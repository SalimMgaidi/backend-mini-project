const express = require('express');
const {
  listTasks,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');
const { protect } = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');

const router = express.Router();

// getting the token first (checking)
router.use(protect);

router.get('/', listTasks);

router
  .route('/:id')
  .get(validateObjectId('id'), getTask)
  .put(validateObjectId('id'), updateTask)
  .delete(validateObjectId('id'), deleteTask);

module.exports = router;