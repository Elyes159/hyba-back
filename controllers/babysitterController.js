const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Babysitter = require('../models/babysitter');


exports.createBabysitter = async (req, res) => {
  try {
    const { nom, prenom, email, password, phone,description } = req.body;
    const babysitter = new Babysitter({ nom, prenom, email, password, phone,description });
    salt = bcrypt.genSaltSync(10);
    cryptedPass = bcrypt.hashSync(req.body.password, salt)
    babysitter.password = cryptedPass;
    await babysitter.save();
    res.status(201).json({ babysitter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.loginBabysitter = async (req, res) => {
  try {
    const { email, password } = req.body;

    const babysitter = await Babysitter.findOne({ email : req.body.email });

    if (!babysitter) {
      return res.status(404).json({ message: 'Email ou mot de passe incorrect' });
    }
    else {
      validPass = bcrypt.compareSync(req.body.password,babysitter.password)
    if (!validPass) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }else if (babysitter.accepte !== 'acceptée') {
      return res.status(401).json({ message: 'Votre compte n\'a pas encore été accepté' });
    }else {
      payload = {
        _id: babysitter.id,
        email:babysitter.email,
        name : babysitter.name
    }
    tokenn = jwt.sign(payload,'123456');
    babysitter.token = tokenn;
    await babysitter.save();
    res.status(200).json({mytoken:tokenn});
    }
  } 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getDemandesEnAttente = async (req, res) => {
  try {
    const demandesEnAttente = await Babysitter.find({ accepte: 'en attente' });
    res.status(200).json(demandesEnAttente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getDemandesAcceptees = async (req, res) => {
  try {
    const demandesAcceptees = await Babysitter.find({ accepte: 'acceptée' });
    res.status(200).json(demandesAcceptees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getDemandesRefusees = async (req, res) => {
  try {
    const demandesRefusees = await Babysitter.find({ accepte: 'refusée' });
    res.status(200).json(demandesRefusees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getRendezVousByBabysitterId = async (req, res) => {
  try {
    const babysitter = await Babysitter.findById(req.params.id);
    if (!babysitter) {
      return res.status(404).json({ message: 'Babysitter not found' });
    }
    
    const rendezVous = babysitter.rendezVous;
    res.status(200).json(rendezVous);
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      res.status(400).json({ message: 'Invalid ID format' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};
