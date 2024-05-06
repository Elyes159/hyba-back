const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const babysitterRoutes = require('./routes/babysitterRoutes');
const parentRoutes = require('./routes/parentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
const hostname = '192.168.1.17 ';
mongoose.connect('mongodb://127.0.0.1:27017/hyba', {

}).then(() => {
  console.log('Connexion à la base de données MongoDB établie');
}).catch(err => {
  console.error('Erreur de connexion à la base de données MongoDB :', err);
  process.exit(1); 
});


app.use(express.json());


app.use('/api/babysitters', babysitterRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/admin', adminRoutes);


app.listen(PORT, hostname => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
