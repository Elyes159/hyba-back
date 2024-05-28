const Admin = require('../models/admin');


exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@gmail.com' && password === 'admin123') {
    res.status(200).json({ message: 'Connexion réussie' });
  } else {
    res.status(401).json({ message: 'Identifiants incorrects' });
  }
};


exports.getAdminInfo = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: 'admin@gmail.com' });
    if (admin) {
      res.status(200).json(admin);
    } else {
      res.status(404).json({ message: 'Administrateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.addNotification = async (req, res) => {
  try {
    const { nom, prenom } = req.body;
    const admin = await Admin.findOne({ email: 'admin@gmail.com' });

    if (admin) {
      admin.notifications.push({ nom, prenom });
      await admin.save();
      res.status(201).json({ message: 'Notification ajoutée avec succès' });
    } else {
      res.status(404).json({ message: 'Administrateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: 'admin@gmail.com' });
    if (admin) {
      res.status(200).json(admin.notifications);
    } else {
      res.status(404).json({ message: 'Administrateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
