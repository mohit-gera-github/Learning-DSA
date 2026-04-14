const express = require('express');
const router = express.Router();
const { getProblems, getProblemById, createProblem, updateProblem, deleteProblem } = require('../controllers/problemController');

router.route('/')
  .get(getProblems)
  .post(createProblem);

router.route('/:id')
  .get(getProblemById)
  .put(updateProblem)
  .delete(deleteProblem);

module.exports = router;
