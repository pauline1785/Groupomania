//imports
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const db = require('./models/index');

// accéder au chemin du système de fichiers
const path = require('path');

// créer l'application express
const app = express();

// middleware CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// importe les routers
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

// transforme le corps de la requête en objet JS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure les en-têtes HTTP de manière sécurisée
app.use(helmet());

// valider les entrées utilisateur et remplace les caractères interdits par "_"
app.use(mongoSanitize({
    replaceWith: '_'
}));

// accés aux routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);


module.exports = app;

