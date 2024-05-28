const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


router.post('/login', adminController.login);


router.get('/info', adminController.getAdminInfo);

router.post('/addNotif',adminController.addNotification)

router.get('/getNotif',adminController.getNotifications)



module.exports = router;
