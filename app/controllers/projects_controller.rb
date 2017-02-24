class ProjectsController < ApplicationController
  
  load_and_authorize_resource
 
  def index
    render json: @projects
  end

  def create
    @project.save!
    render json: @project
  end

  def update
    @project.update(project_params)
    render json: @project
    
  end

  def destroy
    @project.destroy!
    render json: {}
  end
  
  private
  
  def project_params
    params.require(:project).permit(:name)
  end
end