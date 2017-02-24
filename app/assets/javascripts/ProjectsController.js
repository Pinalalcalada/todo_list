angular.module('app', ['ngResource']).controller('ProjectsController', function($resource) {
    var vm = this;
    
    vm.createInputActive = false;
    vm.editInputActive = 0;
    
    var Project = $resource(
        '/projects/:id',
        { id: '@id' },
        {
          update: {
            method: 'PUT' 
          }
        }
    );
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
    
    vm.updateProject = function(project) {
        project.name = vm.editInput;
        project.$update();
        vm.editInputActive = 0;
    }
})