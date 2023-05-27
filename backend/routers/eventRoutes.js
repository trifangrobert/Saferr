const express = require('express');
const eventController = require('../controllers/eventController.js');

const router = express.Router();

router.post('/create', eventController.createEvent);
// router.delete('/:id', eventController.deleteEvent);
router.get('/all', eventController.getAllEvents);
router.put('/update/:id', eventController.updateEvent);

module.exports = router;