const express = require('express');
const router = express.Router();
const { getAllTopics, createTopic, updateTopic, deleteTopic } = require('../controllers/topicController');

router.route('/')
  .get(getAllTopics)
  .post(createTopic);

router.route('/:id')
  .put(updateTopic)
  .delete(deleteTopic);

module.exports = router;
