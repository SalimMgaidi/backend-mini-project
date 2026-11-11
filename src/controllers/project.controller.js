const Project = require('../models/Project');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const handleError = require('../utils/handleError');



//checking the user role  
const findProjectForUser = async (projectId, user) => {
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, 'Project not found');

  const isOwner = project.owner.toString() === user._id.toString();
  if (!isOwner && user.role !== 'manager') {
    throw new ApiError(403, 'You do not have access to this project');
  }
  return project;
};

// POST /projects any user
exports.createProject = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    const project = await Project.create({
      name,
      description,
      status,
      owner: req.user._id,
    });
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    handleError(res, err);
  }
};

// GET /projects
exports.listProjects = async (req, res) => {
  try {
    
    const filter = req.user.role === 'manager' ? {} : { owner: req.user._id }; // normal user can only get his projects

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .populate('owner', 'name email');

    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    handleError(res, err);
  }
};

// GET /projects/:id
exports.getProject = async (req, res) => {
  try {
    const project = await findProjectForUser(req.params.id, req.user);
    await project.populate('owner', 'name email');
    res.json({ success: true, data: project });
  } catch (err) {
    handleError(res, err);
  }
};

// PUT /projects/:id
exports.updateProject = async (req, res) => {
  try {
    const project = await findProjectForUser(req.params.id, req.user);

    
    ['name', 'description', 'status'].forEach((field) => {
      if (req.body[field] !== undefined) project[field] = req.body[field];
    });
    await project.save();

    res.json({ success: true, data: project });
  } catch (err) {
    handleError(res, err);
  }
};

// DELETE /projects/:id
exports.deleteProject = async (req, res) => {
  try {
    const project = await findProjectForUser(req.params.id, req.user);

    
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ success: true, message: 'Project and its tasks deleted' });
  } catch (err) {
    handleError(res, err);
  }
};

exports.findProjectForUser = findProjectForUser;