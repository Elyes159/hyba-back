const mongoose = require('mongoose');

const babysitterSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  accepte: {
    type: String,
    enum: ['en attente', 'acceptée', 'refusée'],
    default: 'en attente' 
  },
  rendezVous: [{
    nomParent: {
      type : String,
    },
    date: {
      type: Date,
    },
    heure_debut: {
      type: String, 
    },
    heure_fin: {
      type: String, 
    },
  }],
  file: {
    data: Buffer,
    contentType: String,
  },
  token: {
    type: String,
  },
  profilePic: {
    data: Buffer,
    contentType: String,
  },
  fcmToken : {
    type: String,

  }
});

const Babysitter = mongoose.model('Babysitter', babysitterSchema);

module.exports = Babysitter;
