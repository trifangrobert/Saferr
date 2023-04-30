const express = require('express');
const eventController = require('../controllers/eventController.js');

const router = express.Router();

router.post('/create', eventController.createEvent);

module.exports = router;