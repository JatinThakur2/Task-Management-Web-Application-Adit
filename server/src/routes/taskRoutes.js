const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

// Every task route requires a valid token.
router.use(authenticate);

const statusValidator = body('status')
  .optional()
  .isIn(['pending', 'completed'])
  .withMessage('Status must be either pending or completed');

const createValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  statusValidator,
];

// On update every field is optional, but title cannot be blanked out.
const updateValidators = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  statusValidator,
];

router.route('/')
  .get(listTasks)
  .post(createValidators, validate, createTask);

router.route('/:id')
  .get(getTask)
  .put(updateValidators, validate, updateTask)
  .delete(deleteTask);

module.exports = router;
