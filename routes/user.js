const express = require('express');
const router = express.Router();

//controllers
const userController = require('../controllers/userController');

//middlewares
const auth = require('../middlewares/authMiddleware');


//get all users
router.get('/', auth.isAdmin, userController.getAllUsers);

//add user
router.post('/add', userController.add);

//get user
router.get('/details/:id', userController.getUserData);

//user data update data
router.get('/edit/:id', (req, res, next) => {
    res.send("Change user data in database");
})

//save user's data
router.post('/edit/:id', (req, res, next) => {
    res.send("Change user data in database");
})


router.post('/login', userController.login);
router.post('/refresh', userController.refresh);

router.post('/changepass', auth.isLoggedIn, userController.changepassword);

router.get('/checkFirstLogin', auth.isLoggedIn, userController.checkFirstLogin);
router.post('/reset', auth.isAdmin, userController.resetPassword)

module.exports = router;