const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware');
//const alarmController = require('../middlewares/alarmController');

//router.get('/status', auth.isLoggedIn, alarmController.getStatus );






module.exports = router;