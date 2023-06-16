const express = require('express');
const eventController = require('../controllers/eventController.js');

const router = express.Router();

router.get('/all', eventController.getAllEvents);
router.post('/create', eventController.createEvent);
router.put('/update/:id', eventController.updateEvent);
router.delete('/delete/:id', eventController.deleteEvent);

module.exports = router;