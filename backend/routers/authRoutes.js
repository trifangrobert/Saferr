const express = require('express');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/profile', authController.getUserProfile);
router.get('/all', authController.getAllUsers);


module.exports = router;