// Imports
const jwt = require("jsonwebtoken");
const db = require('../models/index');
const fs = require('fs');

// Permet de créer un nouveau post
exports.createPost = (req, res, next) => {   
    const content = req.body.content;

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_SECRET_TOKEN');
    const userId = decodedToken.userId;
    
    // Permet de vérifier que tous les champs sont complétés
    if (content == null || content == '') {
        return res.status(400).json({ error: 'Tous les champs doivent être renseignés' });
    } 

    // Permet de contrôler la longueur du titre et du contenu du posy
    if (content.length <= 4) {
        return res.status(400).json({ error: 'Le contenu du post doit contenir au moins 4 caractères' });
    }
    
    db.User.findOne({
        where: { id: userId }
    })
    
    .then(userFound => {
        if(userFound) {
            const post = db.Post.build({
                content: req.body.content,
                imagePost: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`: req.body.imagePost,
                UserId: userFound.id
            })
            post.save()
            .then(() => res.status(201).json({ message: 'Votre post a bien été créé !' }))
            .catch(error => res.status(400).json({ error: 'Error : code 400' }));
        } else {
            return res.status(404).json({ error: 'Utilisateur non trouvé' })
        }
    })
    .catch(error => res.status(500).json({ error: 'Error : code 500' }));
};


// Permet d'afficher tous les post
exports.getAllPosts = (req, res, next) => {


    db.Post.findAll({
        order: [['createdAt', "DESC"]] ,
        include: [{
            model: db.User,
            attributes: [ 'firstname', 'imageProfile' ]
        },{
            model: db.Comment
        }]
    })
    .then(postFound => {
        if(postFound) {
            res.status(200).json(postFound);
        } else {
            res.status(404).json({ error: 'Aucun post trouvé' });
        }
    })
    .catch(error => {
        res.status(500).send({ error: 'Error : code 500' });
    });
}


// Permet de modifier un post
exports.modifyPost = (req, res, next) => {
    const postObject = req.file ?
    {
    content: req.body.content,
    imagePost: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_SECRET_TOKEN');
    const userId = decodedToken.userId;

    db.Post.findOne({
        attributes: ['userId'],
        where: { id: req.params.postId }
    })
    .then(post => {
        if(userId === post.userId) {
            if(post) {
                db.Post.update(postObject, {
                    where: { id: req.params.postId}
                })
                .then(post => res.status(200).json({ message: 'Votre post a bien été modifié !' }))
                .catch(error => res.status(400).json({ error: 'Error : code 400' }))
            }
            else {
                res.status(404).json({ error: 'Post non trouvé' });
            }
        } else {
            return res.status(401).json({ error: 'Utilisateur non authorisé' })
        }
    })
    .catch(error => res.status(500).json({ error: 'Error : code 500' }));
}


// Permet de supprimer un post
exports.deletePost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_SECRET_TOKEN');
    const userId = decodedToken.userId;

    db.Post.findOne({
        attributes: ['userId'],
        where: { id: req.params.postId }
    })
    .then(post => {
        if(userId === post.userId) {
            if(post) {
                if(post.imagePost != null) {
                    const filename = post.imagePost.split('/images/')[1];
                
                    fs.unlink(`images/${filename}`, () => {
                        db.Post.destroy({ 
                            where: { id: req.params.postId } 
                        })
                        .then(() => res.status(200).json({ message: 'Votre post a été supprimé' }))
                        .catch(() => res.status(500).json({ error: 'Error : code 500' }));
                    })
                } else {
                    db.Post.destroy({ 
                        where: { id: req.params.postId } 
                    })
                    .then(() => res.status(200).json({ message: 'Votre post a été supprimé' }))
                    .catch(() => res.status(500).json({ error: 'Error : code 500' }));
                }
            } else {
                return res.status(404).json({ error: 'Post non trouvé'})
            }
        } else {
            return res.status(401).json({ error: 'Utilisateur non authorisé' })
        }
    })
    .catch(error => res.status(500).json({ error: 'Error : code 500' }));
}



