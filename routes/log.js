const express = require('express');
const router = express.Router();


const auth = require('../middlewares/authMiddleware');

const logController = require('../controllers/logController');


router.get('/', auth.isLoggedIn, logController.getAllLogs);
router.get('/last', auth.isLoggedIn, logController.getLastLog);
router.get('/status', auth.rasp, logController.getLastLog);
router.get('/change', auth.isLoggedIn, logController.changeStatus);

module.exports = router;