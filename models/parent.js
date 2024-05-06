const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
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
    required: true
  },
  nombreDesEnfants: {
    type: Number,
    required: true
  },
  phone: {
    type: String
  }
});

const Parent = mongoose.model('Parent', parentSchema);

module.exports = Parent;
