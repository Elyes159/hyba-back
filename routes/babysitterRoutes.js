const express = require('express');
const router = express.Router();
const babysitterController = require('../controllers/babysitterController');


router.post('/signup', babysitterController.createBabysitter);


router.post('/login', babysitterController.loginBabysitter);


router.get('/demandes/en-attente', babysitterController.getDemandesEnAttente);


router.get('/demandes/acceptees', babysitterController.getDemandesAcceptees);


router.get('/demandes/refusees', babysitterController.getDemandesRefusees);

router.get('/rendezVous/:id',babysitterController.getRendezVousByBabysitterId)

module.exports = router;
