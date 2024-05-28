const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  }
});

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    default: 'admin@gmail.com' 
  },
  password: {
    type: String,
    required: true,
    default: 'admin123' 
  },
  notifications: {
    type: [notificationSchema],
    default: []
  }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
