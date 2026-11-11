const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const handleError = require('../utils/handleError');
const { findProjectForUser } = require('./project.controller');


const assertUserExists = async (userId) => {
  const exists = await User.exists({ _id: userId });
  if (!exists) throw new ApiError(404, 'User to assign not found');
};

// for finding user
const findTaskForUser = async (taskId, user) => {
  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(404, 'Task not found');

  const project = await Project.findById(task.project);
  const isOwner = project && project.owner.toString() === user._id.toString();
  const isAssignee = task.assignedTo && task.assignedTo.toString() === user._id.toString();
  const isPrivileged = user.role === 'manager' || isOwner;

  if (!isPrivileged && !isAssignee) {
    throw new ApiError(403, 'You do not have access to this task');
  }
  return { task, isPrivileged };
};

// POST /projects/:projectId/tasks
exports.createTask = async (req, res) => {
  try {
    const project = await findProjectForUser(req.params.projectId, req.user);
    const { title, description, status, deadline, assignedTo } = req.body;

    // manager condition
    if (assignedTo) {
      if (req.user.role !== 'manager') {
        throw new ApiError(403, 'Only a manager can assign a task');
      }
      await assertUserExists(assignedTo);
    }

    const task = await Task.create({
      title,
      description,
      status,
      deadline,
      project: project._id,
      assignedTo: assignedTo || null,
    });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    handleError(res, err);
  }
};

// GET /projects/:projectId/tasks
exports.listProjectTasks = async (req, res) => {
  try {
    const project = await findProjectForUser(req.params.projectId, req.user);
    const tasks = await Task.find({ project: project._id })
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'name email');
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    handleError(res, err);
  }
};

// GET /tasks  
exports.listTasks = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'manager') {
      const myProjectIds = await Project.find({ owner: req.user._id }).distinct('_id');
      filter = { $or: [{ project: { $in: myProjectIds } }, { assignedTo: req.user._id }] };
    }

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate('project', 'name')
      .populate('assignedTo', 'name email');
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    handleError(res, err);
  }
};

// GET /tasks/:id
exports.getTask = async (req, res) => {
  try {
    const { task } = await findTaskForUser(req.params.id, req.user);
    await task.populate([
      { path: 'project', select: 'name' },
      { path: 'assignedTo', select: 'name email' },
    ]);
    res.json({ success: true, data: task });
  } catch (err) {
    handleError(res, err);
  }
};

// PUT /tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const { task, isPrivileged } = await findTaskForUser(req.params.id, req.user);

    
    if (!isPrivileged) {
      const forbidden = Object.keys(req.body).filter((key) => key !== 'status');
      if (forbidden.length > 0) {
        throw new ApiError(403, 'An assigned user can only update the status');
      }
    }

    ['title', 'description', 'status', 'deadline'].forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

   
    if (req.body.assignedTo !== undefined) {
      if (req.user.role !== 'manager') {
        throw new ApiError(403, 'Only a manager can assign a task');
      }
      if (req.body.assignedTo) await assertUserExists(req.body.assignedTo);
      task.assignedTo = req.body.assignedTo || null;
    }

    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    handleError(res, err);
  }
};

// DELETE /tasks/:id  
exports.deleteTask = async (req, res) => {
  try {
    const { task, isPrivileged } = await findTaskForUser(req.params.id, req.user);
    if (!isPrivileged) {
      throw new ApiError(403, 'Only the project owner or a manager can delete a task');
    }
    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    handleError(res, err);
  }
};