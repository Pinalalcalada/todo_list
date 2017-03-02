json.array!(@projects) do |project|
  json.partial! 'projects/show', project: project
end