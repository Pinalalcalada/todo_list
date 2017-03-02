// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.

var app = angular.module('app', ['ngResource']);

app.factory('Project', ['$resource', function($resource) {
    return $resource(
        '/projects/:id',
        { id: '@id' },
        {
          update: {
            method: 'PUT' 
          }
        }
    );
}]);

app.factory('Task', ['$resource', function($resource) {
    return $resource(
        'tasks/:id',
        { id: '@id' },
        {
          update: {
            method: 'PUT' 
          },
          save: {
              method: 'POST',
              url: 'projects/:project_id/tasks',
              params: {
                  project_id: '@project_id'
              }
          },
          complete: {
              method: 'POST',
              url: 'tasks/:id/complete'
          }
        }
    );
}]);

app.controller('projectsController', ['Project', function(Project) {
    var vm = this;
    
    vm.createInputActive = false;
    vm.editInputActive = 0;
    
    vm.list = [];
    
    Project.query(function(projects) {
        vm.list = projects;
    });
    
    vm.createProject = function() {
        if (vm.createInputActive) {
            var project = new Project({name: vm.createInput})
            project.$save()
            vm.list.push(project)
            vm.createInputActive = false;
            vm.createInput = "";
        } else {
            vm.createInputActive = true;
        }
    }
    
    vm.deleteProject = function(id) {
        Project.delete({id: id}, function() {
            vm.list = vm.list.filter(function(project){
            return project.id != id
            });
        });
    }
    
    vm.editProject = function(id) {
        if (vm.editInputActive == id) {
            vm.editInputActive = 0;
        }
        else {
            vm.editInputActive = id;
        }
    }
    
    vm.updateProject = function(task) {
        task.name = vm.editInput;
        task.$update();
        vm.editInputActive = 0;
    }
}])


app.controller('TasksController', ['Task', function(Task) {
    var vm = this;
    vm.editInputActive = 0;
    vm.editInput = "false";
    vm.completeInput = false;
    
    vm.initializeTasks = function(tasks) {
        vm.list = tasks || [];
        vm.list = vm.list.map(function(task) {
            return new Task({
                id: task.id,
                description: task.description,
                project_id: task.project_id,
                completed: task.completed
            })
        })
    }
    
    vm.createTask = function(projectId) {
        var task = new Task({description: vm.createInput, project_id: projectId})
        task.$save()
        vm.list.push(task)
        
    }
    
    vm.deleteTask = function(id) {
        Task.delete({id: id}, function() {
            vm.list = vm.list.filter(function(task){
                return task.id != id
            });
        });
    }
    
    vm.editTask = function(id) {
        if (vm.editInputActive == id) {
            vm.editInputActive = 0;
            vm.editInput = "";
        }
        else {
            vm.editInputActive = id;
        }
    }
    
    vm.updateTask = function(task) {
        task.description = vm.editInput;
        task.$update();
        vm.editInputActive = 0;
    }
    
    vm.completeTask = function(task){
        task.$complete();
    }
}])