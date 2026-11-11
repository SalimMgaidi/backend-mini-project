const express = require('express');
const {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller');
const { createTask, listProjectTasks } = require('../controllers/task.controller');
const { protect } = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');

const router = express.Router();

router.use(protect);

router.route('/').post(createProject).get(listProjects);

router
  .route('/:id')
  .get(validateObjectId('id'), getProject)
  .put(validateObjectId('id'), updateProject)
  .delete(validateObjectId('id'), deleteProject);

// related tasks
router
  .route('/:projectId/tasks')
  .post(validateObjectId('projectId'), createTask)
  .get(validateObjectId('projectId'), listProjectTasks);

module.exports = router;