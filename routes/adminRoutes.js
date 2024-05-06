const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


router.post('/login', adminController.login);


router.get('/info', adminController.getAdminInfo);


module.exports = router;
