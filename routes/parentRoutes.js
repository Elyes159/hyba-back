const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');


router.post('/signup', parentController.createParent);

router.post('/login', parentController.login);


router.get('/', parentController.getAllParents);


router.get('/:id', parentController.getParentById);



router.post('/:id/:idbaby/rendezvous', parentController.addRendezVous);




module.exports = router;


module.exports = router;
