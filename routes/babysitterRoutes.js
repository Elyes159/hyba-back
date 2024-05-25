const express = require('express');
const router = express.Router();
const babysitterController = require('../controllers/babysitterController');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

router.post('/signup', upload.single('file'), babysitterController.createBabysitter);

router.post('/uploadProfilePic', upload.single('file'), babysitterController.uploadProfilePic);

router.get('/getProfilePic', babysitterController.getProfilePic);

router.post('/getProfilePicById', babysitterController.getProfilePicById);




router.post('/login', babysitterController.loginBabysitter);


router.get('/demandes/en-attente', babysitterController.getDemandesEnAttente);


router.get('/demandes/acceptees', babysitterController.getDemandesAcceptees);


router.get('/demandes/refusees', babysitterController.getDemandesRefusees);

router.get('/rendezVous/:token',babysitterController.getRendezVousByBabysitterToken)

router.get('/rendezVousId/:id',babysitterController.getRendezVousByBabysitterId)
router.post('/updateFCMToken',babysitterController.updateFCMToken)



module.exports = router;
