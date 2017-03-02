class TasksController < ApplicationController
    load_and_authorize_resource :project
    load_and_authorize_resource through: :project, shallow: true
    
    def create
        @task.save!
        render json: @task
    end
    
    def update
        @task.update(task_params)
        render json: @task
    end
    
    def destroy
        @task.destroy!
        render json: ""
    end
    
    def complete
        @task.completed = !@task.completed
        @task.save!
        render json: @task
    end
    
    private
    
    def task_params
        params.require(:task).permit(:description)
    end
    
end
