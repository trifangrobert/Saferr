const express = require('express');
// const { protect } = require('../middleware/authMiddleware.js');
const authController = require('../controllers/authController.js');
// import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
// router.route('/profile').get(protect, authController.getUserProfile);

module.exports = router;