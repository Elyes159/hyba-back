const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Babysitter = require('../models/babysitter');

exports.createBabysitter = async (req, res) => {
  try {
    const { nom, prenom, email, password, phone, description } = req.body;
    const babysitter = new Babysitter({ nom, prenom, email, password, phone, description });

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    babysitter.password = hashedPassword;

    // Check if file is present
    if (req.file) {
      babysitter.file.data = req.file.buffer; // Store file as Buffer
      babysitter.file.contentType = req.file.mimetype; // Store file MIME type
    }

    // Save the babysitter in the database
    await babysitter.save();
    
    res.status(201).json({ message: 'Babysitter created successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded.' });
    }

    // Assuming you have a user ID to link the profile picture to a babysitter
    const token = req.body.token;
    
    // Vérifiez si le token est vide
    if (!token) {
      return res.status(400).send({ message: 'Token is missing.' });
    }

    const babysitter = await Babysitter.findOne({token:token});

    if (!babysitter) {
      return res.status(404).send({ message: 'Babysitter not found.' });
    }

    babysitter.profilePic = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    await babysitter.save();

    res.status(200).send({ message: 'Profile picture uploaded successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while uploading the profile picture.' });
  }
};
exports.acceptBabysitter = async (req, res) => {
  try {
    // Extract the babysitter ID from the URL parameters
    const { id } = req.params;

    // Find the babysitter by ID and update the 'accepte' field to 'acceptée'
    const updatedBabysitter = await Babysitter.findByIdAndUpdate(
      id,
      { accepte: 'acceptée' },
      { new: true } 
    );

    // Check if the babysitter was found and updated
    if (!updatedBabysitter) {
      return res.status(404).json({ message: 'Babysitter not found' });
    }

    // Respond with the updated babysitter data
    res.status(200).json({ message: 'Babysitter accepted successfully', babysitter: updatedBabysitter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while accepting the babysitter' });
  }
};



exports.getProfilePic = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(400).send({ message: 'Token is missing.' });
    }

    const babysitter = await Babysitter.findOne({ token: token });

    if (!babysitter || !babysitter.profilePic) {
      return res.status(404).send({ message: 'Profile picture not found.' });
    }

    const profilePicData = babysitter.profilePic.data.toString('base64');
    const profilePicContentType = babysitter.profilePic.contentType;

    res.status(200).send({ profilePicData, profilePicContentType });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while retrieving the profile picture.' });
  }
};


exports.getProfilePicById = async (req, res) => {
  try {
    const { id } = req.body;

    const babysitter = await Babysitter.findById(id);

    if (!babysitter) {
      return res.status(404).send({ message: 'Profile picture not found.' });
    }

    const profilePicData = babysitter.profilePic.data
      ? babysitter.profilePic.data.toString('base64')
      : null;
    const profilePicContentType = babysitter.profilePic.contentType;

    res.status(200).send({ profilePicData, profilePicContentType });
  } catch (error) {
    console.error(error);
    console.log(error);
    res.status(500).send({ message: 'An error occurred while retrieving the profile picture.' });
  }
};


exports.getCVById = async (req, res) => {
  try {
    const { id } = req.body;

    const babysitter = await Babysitter.findById(id);

    if (!babysitter) {
      return res.status(404).send({ message: 'Profile picture not found.' });
    }

    const cv = babysitter.file.data
      ? babysitter.file.data.toString('base64')
      : null;
    const profilePicContentType = babysitter.file.contentType;

    res.status(200).send({ cv, profilePicContentType });
  } catch (error) {
    console.error(error);
    console.log(error);
    res.status(500).send({ message: 'An error occurred while retrieving the profile picture.' });
  }
};



exports.loginBabysitter = async (req, res) => {
  try {
    const { email, password , fcmToken} = req.body;

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
    babysitter.fcmToken = req.body.fcmToken;
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
    const demandesEnAttente = await Babysitter.find({ accepte: 'en attente' , accepte:'acceptée',accepte:'refusée' });
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
exports.getRendezVousByBabysitterToken = async (req, res) => {
  try {
    const babysitter = await Babysitter.findOne({token : req.params.token});
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

exports.updateFCMToken = async (req, res) => {
  try {
    const { id ,fcmToken} = req.body;

    // Vérifiez si le token est vide
    if (!id) {
      return res.status(400).json({ message: 'Token or FCM token is missing.' });
    }

    // Recherchez le babysitter correspondant au token
    const babysitter = await Babysitter.findById(id);

    if (!babysitter) {
      return res.status(404).json({ message: 'Babysitter not found.' });
    }

    // Associez le FCM token au babysitter
    babysitter.fcmToken = fcmToken;

    // Enregistrez les modifications dans la base de données
    await babysitter.save();

    res.status(200).json({ message: 'FCM token updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the FCM token.' });
  }
};

exports.deleteBabysitter = async (req, res) => {
  try {
    // Extract the babysitter ID from the URL parameters
    const { id } = req.params;

    // Find the babysitter by ID and delete it from the database
    const deletedBabysitter = await Babysitter.findByIdAndDelete(id);

    // Check if the babysitter was found and deleted
    if (!deletedBabysitter) {
      return res.status(404).json({ message: 'Babysitter not found' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'Babysitter deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the babysitter' });
  }
};

