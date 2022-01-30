<template> 
    <Navbar/>
    <!-- CREATION D'UN POST -->
    <section class="NewPost">
        <ProfileImage v-if="imageProfile == 'null'" :src="'user-solid.svg'" class="NewPost__avatar"/>
        <ProfileImage v-else :src="imageProfile" class="NewPost__avatar"/>

        <form @submit.prevent="createPost" aria-label="Nouveau message" class="NewPost__content">
            <textarea v-model="content" class="NewPost__content__text" name="message" id="message" placeholder="Quoi de neuf ?" aria-label="Rédiger un nouveau message"/>    
            
            <button type="submit" class="NewPost__publish" aria-label="Publier le message">Publier</button> 

            <div id="preview" style="display:block">
                <img v-if="imagePreview" :src="imagePreview" id="preview" style="display:block" class="NewPost__content__preview" alt="Prévisualisation de l'image ajoutée au message"/>
            </div> 

            <button @click="uploadFile" type="button" class="NewPost__upload"><i class="far fa-image"></i></button>
            <input type="file" style="display:none" ref="fileUpload" @change="onFileSelected" accept="image/*" aria-label="Sélectionner un fichier">
        </form>
    </section>

    <!-- AFFICHAGE DES POSTS -->
    <section class="Feed">
        <!-- un post -->
        <div class="Post" v-for="post in posts" :key="post.postId">

            <div class="Post__user">
                <ProfileImage :src="post.User.imageProfile" class="Post__user__avatar"/>
                <div class="Post__user__infos">
                    <h2 class="Post__user__infos__name">{{ post.User.firstname }}</h2>
                    <span class="Post__user__infos__date">{{ dateFormat(post.createdAt) }}</span>
                </div>
                <div  class="Post__user__modify">
                    <i v-if="userId == post.UserId || isAdmin == 'true'" @click="displayModifyPost(post.id)" class="far fa-edit" aria-label="Modifier l'article"></i>
                    <i v-if="userId == post.UserId || isAdmin == 'true'" v-on:click="deletePost(post.id)" class="far fa-trash-alt" aria-label="Supprimer l'article"></i>
                </div>
            </div>

            <div class="Post__text">
                <p :contentPostId="post.id" style="display:block" >{{ post.content }}</p>
            </div>

            <img v-if="post.imagePost" :imgPostId="post.id" style="display:block" :src="post.imagePost" class="Post__image" alt="Image de l'article publié"/>            

            <div class="Post__options">
                <Likes v-bind:post="post"/>
                <div class="Post__options__comments">
                    <i @click="displayComment(post.id)" v-on:click="diplayCreateComment(post.id)" class="far fa-comment" aria-label="Commenter l'article"></i>
                    <span v-if="post.Comments.length > 0">{{ post.Comments.length }}</span>
                </div>
            </div>
        
            <!-- modification du post -->
            <div :inputId="post.id" style="display:none" v-bind:showInputModify="showInputModify" class="Post__edit">
                <textarea v-model="contentmodifyPost" :placeholder="post.content" id="textarea" class="Post__edit__text" aria-label="Modifier le message"/>
                
                <div class="Post__edit__options">
                    <button @click="uploadFile" type="button"><i class="far fa-images fa-2x"></i></button>   
                    <input type="file" ref="fileUpload" style="display:none" @change="onFileSelected" accept="image/*" aria-label="Sélectionner un fichier">
        
                    <button v-on:click="modifyPost(post.id)" class="Post__edit__save" aria-label="Enregistrer les modifications"><i class="far fa-check-circle"></i></button>
                </div>

                <img v-if="post.imagePost && !imagePreview" :src="post.imagePost" class="Post__edit__preview" alt="Image insérée dans l'article"/>
                <img v-if="imagePreview" :src="imagePreview" class="Post__edit__preview" alt="Prévisualisation de l'image ajoutée"/>
            </div>

            <!-- commentaires -->
            <div class="Post__comments">
                <div class="Comment" v-for="comment in comments" :key="comment.commentId">
                    <div v-bind:showComment="showComment" v-if="showComment && post.id == comment.postId">
                        <div class="Comment__infos">
                            <ProfileImage :src="comment.User.imageProfile" class="Comment__infos__avatar"/>
                            <h3 class="Comment__infos__name"> {{ comment.User.firstname }}</h3>
                            <span class="Comment__infos__date">{{ dateFormat(comment.createdAt) }}</span>  
                        </div>

                        <div class="Comment__content">
                            <p>{{ comment.content }}</p>
                        </div>

                        <div class="Comment__option">
                            <i v-if="userId == comment.UserId || isAdmin == 'true'" @click="deleteComment(comment.id)" class="Comment__option__delete far fa-trash-alt"></i>
                        </div>
                    </div>
                </div>
                <!-- nouveau commentaire -->
                <div :formId="post.id" style="display:none" v-bind:showCreateComment="showCreateComment" class="NewComment">
                    <form @submit.prevent="createComment(post.id)" class="NewComment__form">
                        <textarea v-model="contentComment" class="NewComment__text" name="comment" id="comment" placeholder="Ecrivez votre commentaire ..." aria-label="Rédiger un nouveau commentaire"/>              
                        
                        <button class="NewComment__publish" aria-label="Publier le commentaire">Commenter</button>
                    </form>
                </div>
            </div>
            
        </div>
    </section>

    <router-view/>
</template>



<script>
    import axios from 'axios'
    import moment from 'moment'
    import { Notyf } from 'notyf'
    import 'notyf/notyf.min.css'
    
    import Navbar from '../components/Navbar.vue'
    import ProfileImage from '../components/ProfileImage.vue'
    import Likes from '../components/Likes.vue'

    export default {
        name: 'Post',
        components: {
            Navbar,
            ProfileImage,
            Likes
        },
        data() {
            return {
                userId: localStorage.getItem('userId'),
                firstname: localStorage.getItem('firstname'),
                isAdmin: localStorage.getItem('isAdmin'),
                imageProfile: localStorage.getItem('imageProfile'),
                posts: [],
                post: '',
                imagePost: '',
                imagePreview: null,
                content: '',
                contentmodifyPost: '',
                comments: [],
                contentComment: '',
                like: false,
                postLikes: [],
                revele: false,
                showComment: false,
                showCreateComment: false,
                showInputModify: false,
            }
        },
        created() {
            this.displayPost();
            this.notyf = new Notyf({
                duration: 2000,
                position: {
                    x: 'center',
                    y: 'top'
                }
            });
        },  
        methods: {
            // Permet de créer un nouveau message
            uploadFile() {
                this.$refs.fileUpload.click()
            },
            onFileSelected(event) {
                this.imagePost = event.target.files[0];
                this.imagePreview = URL.createObjectURL(this.imagePost);
            },      
            createPost() {
                const formData = new FormData();
                formData.append("content", this.content);
                formData.append("image", this.imagePost);

                axios.post('http://localhost:3000/api/post', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(() => {
                    window.location.reload()
                })
                .catch(error => {
                    const msgerror = error.response.data;
                    this.notyf.error(msgerror.error)
                    
                })
            },
            

            // Permet d'afficher tous les messages
            displayPost() {
                axios.get('http://localhost:3000/api/post', {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(response => {
                    this.posts = response.data;
    
                })
                .catch(error => {
                    const msgerror = error.response.data
                    this.notyf.error(msgerror.error)
                })
            },

            // Permet d'afficher la date de publication au bon format
            dateFormat(date){
                if (date) {
                    return moment(String(date)).format('DD/MM/YYYY')
                }
            },

            // Permet d'afficher le champ pour modifier un message
            displayModifyPost(id) {
                const postId = id;

                this.showInputModify == false

                let input = document.querySelector('div[inputId="'+id+'"]')
                let inputId = input.getAttribute('inputId');

                let contentPost = document.querySelector('p[contentPostId="'+id+'"]')
                let contentPostId = contentPost.getAttribute('contentPostId');

                let imgPreviewCreatePost = document.querySelector('#preview')


                if(postId == inputId && postId == contentPostId && this.showInputModify == false) {
                    input.style.display = "block";
                    contentPost.style.display = "none";
                    imgPreviewCreatePost.style.display = "none";
                    this.showInputModify = !this.showInputModify

                    let imgPost = document.querySelector('img[imgPostId="'+id+'"]')
                    let imgPostId = imgPost.getAttribute('imgPostId');

                    if(postId == imgPostId) {
                        imgPost.style.display = "none";
                    }
                    
                } else if(postId == inputId && this.showInputModify == true) {
                    input.style.display = "none";
                    contentPost.style.display = "block";
                    let imgPost = document.querySelector('img[imgPostId="'+id+'"]')
                    imgPost.style.display = "block";
                    this.showInputModify = !this.showInputModify
                }
            },

            // Permet de modifier un message
            modifyPost(id) {
                const postId = id;

                const formData = new FormData();
                formData.append("content", this.contentmodifyPost);
                formData.append("image", this.imagePost);

                axios.put('http://localhost:3000/api/post/' + postId, formData, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(() => {
                    window.location.reload()
                })
                .catch(error => {
                    const msgerror = error.response.data
                    this.notyf.error(msgerror.error)
                })
            },

            // Permet de supprimer un message
            deletePost(id) {
                const postId = id;
               
                axios.delete('http://localhost:3000/api/post/' + postId, {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(() => {
                    this.displayPost();
                })
                .catch(error => {
                    const msgerror = error.response.data
                    this.notyf.error(msgerror.error)
                })
            },
            
            

            // Permet d'afficher le champ pour créer un nouveau commentaire
            diplayCreateComment(id) {
                const postId = id;

                this.showCreateComment == false

                let form = document.querySelector('div[formId="'+id+'"]')
                let formId = form.getAttribute('formId');
                
                if(postId == formId && this.showCreateComment == false) {
                    form.style.display = "block";
                    this.showCreateComment = !this.showCreateComment
                } else if(postId == formId && this.showCreateComment == true) {
                    form.style.display = "none";
                    this.showCreateComment = !this.showCreateComment
                }
            },

            // Permet de créer un nouveau commentaire
            createComment(id) {
                const postId = id;

                axios.post('http://localhost:3000/api/comment/' + postId, {
                    content: this.contentComment,
                },{
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(() => {
                    window.location.reload()                    
                })
                .catch(error => {
                    const msgerror = error.response.data
                    this.notyf.error(msgerror.error)
                })
            },

            // Permet d'afficher les commentaires d'un message
            displayComment(id) {
                this.showComment = !this.showComment

                const postId = id;
                
                axios.get('http://localhost:3000/api/comment/' + postId, {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(response => {
                    this.comments = response.data;
                })
                .catch(error => {
                    const msgerror = error.response.data
                    this.notyf.error(msgerror.error)
                })
            },

            // Permet de supprimer un commentaire
            deleteComment(id) {
                const commentId = id;

                axios.delete('http://localhost:3000/api/comment/' + commentId, {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(() => {
                    window.location.reload()
                })
                .catch(error => {
                    const msgerror = error.response.data
                    this.notyf.error(msgerror.error)
                })
            }
        }
    }
</script>


<style lang="scss" scoped>
//new post
    .NewPost{
        padding: 1rem;
        width: 40%;
        height: auto;
        background-color: #FFF;
        margin: 2rem auto;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        border-radius: 10px;
        border: 1px solid #E0E2DB;
        &__avatar{
            width: 4rem;
            height: 4rem;
        }
        &__content{
            width: 85%;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            &__text{
                width: 80%;
                margin-right: 0.5rem;
                margin-bottom: 0.5rem;
                border: none;
            }
            &__preview{
                max-width: 50rem;
                width: 90%;
                height: 274px;
                margin: 1rem auto;
                object-fit: cover;
            }
           
        }
         &__publish{
            background-image: linear-gradient(to right, #eb3941, #f15e64, #e14e53, #e2373f);  
            width: 15%;
            color: #fff;
            cursor: pointer;
            height: 40px;
            text-align:center;
            border: none;
            align-self: center;
            background-size: 300% 100%;
            border-radius: 5px;
            moz-transition: all .4s ease-in-out;
            -o-transition: all .4s ease-in-out;
            -webkit-transition: all .4s ease-in-out;
            transition: all .4s ease-in-out;
            &:hover{
                background-position: 100% 0;
                moz-transition: all .4s ease-in-out;
                -o-transition: all .4s ease-in-out;
                -webkit-transition: all .4s ease-in-out;
                transition: all .4s ease-in-out;
            }
            &:focus{
               outline: none; 
            }
        }
        &__upload{
            border: none;
            background-color: #fff;
            font-size: 1.2rem;
            &:hover{
                color: #F74038;
            }
        }
    }

// feed
    .Feed{
       margin: 2rem auto;
    }

    .Post{
        padding: 1rem;
        width: 40%;
        height: auto;
        background-color: #FFF;
        margin: 2rem auto;
        border-radius: 10px;
        border: 1px solid #E0E2DB;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: space-between;
        text-align: left;
        position: relative;
        &__user{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            &__avatar{
                width: 4rem;
                height: 4rem;
                margin-right: 15px;
            }
            &__infos{
                display: flex;
                flex-direction: column;
                position: absolute;
                left: 6rem;
                &__name{
                    font-size: 1rem;
                }
                &__date{
                    font-size: 0.7rem;
                    color: #ccc;
                }
            }
            &__modify{
                display: flex;
                flex-direction: column;
                & .fa-edit{
                    margin-bottom: 20px;
                }
                & .far:hover{
                    color: #F74038;
                    cursor: pointer;
                }
            }
        }  
        &__text{
            margin-top: 10px;
            width: 100%;
        }
        &__image{
            max-width: 100%;
            width: 100%;
            height: auto;
            margin: 10px 0;
        }
        &__options{
            display: flex;
            justify-content: space-around;
            width: 100%;
        }
        &__edit{
            width: 100%;
            &__text{
              width: 100%; 
            }
            &__options button{
                border: none;
                background-color: #fff;
            }
            &__options .far{
                font-size: 2rem;
                &:hover{
                    color: #F74038;
                }
            }
            &__preview{
                width: 100%;
            }
        }
    }

    .Comment{
        background-color: #E0E2DB;
        border-radius: 2%;
        padding: 10px;
        margin: 1rem 0;
        &__infos{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-bottom: 10px;
            &__avatar{
                width: 2rem;
                height: 2rem;
            }
            &__name{
                font-size: 14px;
                position: absolute;
                left: 4rem;
            }
            &__date{
                font-size: 12px;
            }
        }
    }

    .NewComment{
        &__text{
            width: 100%;
        }
        &__publish{
            background-image: linear-gradient(to right, #eb3941, #f15e64, #e14e53, #e2373f);  
            width: 40%;
            color: #fff;
            cursor: pointer;
            height: 40px;
            text-align:center;
            border: none;
            align-self: center;
            background-size: 300% 100%;
            border-radius: 5px;
            moz-transition: all .4s ease-in-out;
            -o-transition: all .4s ease-in-out;
            -webkit-transition: all .4s ease-in-out;
            transition: all .4s ease-in-out;
            &:hover{
                background-position: 100% 0;
                moz-transition: all .4s ease-in-out;
                -o-transition: all .4s ease-in-out;
                -webkit-transition: all .4s ease-in-out;
                transition: all .4s ease-in-out;
            }
            &:focus{
               outline: none; 
            }
        } 
    }

// RESPONSIVE
    @media screen and (max-width: 1400px){
        .NewPost{
            width: 60%;
        }

        .Post{
            width: 60%;
        }
    }

    @media screen and (max-width: 1200px){
        .NewPost{
            width: 80%;
        }

        .Post{
            width: 80%;
        }
    }

    @media screen and (max-width: 768px){
        .NewPost{
            width: 90%;
            padding: 0.5rem;
            &__avatar{
                width: 3rem;
                height: 3rem;
            }
            &__content__text{
                width: 90%;
                min-height: 70px;
            }
            &__publish{
                order: 4;
                width: 80%;
                margin: 0 auto;
            }
            &__upload{
                order: 3;
            }
        }

        .Post{
            width: 90%;
            padding: 0.5rem;
            &__user__avatar{
                width: 3rem;
                height: 3rem;
            }
            &__user__infos{
                left: 4rem;
            }
        }

        .NewComment{
            &__publish{
                width: 100%;
            }
        }
    }

</style>