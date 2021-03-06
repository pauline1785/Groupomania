/* MIDDLEWARE D'AUTHENTIFICATION */

// import le package qui vérifie les tokens
const jwt = require('jsonwebtoken');

// Permet de vérifier le token envoyé par le frontend
module.exports = (req, res, next) => {
    try {
        // récupération du token dans le header de la requête, ça nous retourne un tableau et on récupère le deuxième élément du tableau (le 1)
        const token = req.headers.authorization.split(' ')[1];
        // décoder le token
        const decodedToken = jwt.verify(token, 'RANDOM_SECRET_TOKEN');
        // récupération de l'user Id dans le décodage du token (qui est un objet js)
        const userId = decodedToken.userId;
        // si on a un user Id dans le body de la requête et qu'il est différent de l'user id du token
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable';
        // si l'user Id du body correspond à celui du token, on passe au prochain middleware
        } else {            
            next();
        }
    } catch (error) {
        res.status(401).json({ error: 'Requête non authentifiée'});
    }
};
