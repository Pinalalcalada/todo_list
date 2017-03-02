json.extract! project, :id, :name
json.tasks(project.tasks) do |task|
  json.partial! 'tasks/show', task: task
end