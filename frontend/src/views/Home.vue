<template>
    <main class="home">
        <img class="home__photo" src="../assets/home01.jpg" alt="Représentation de trois personnes qui discutent via un chat">

        <section class="login">
            <img class="login__logo" src="../assets/groupomania_red_logo.png" alt="logo de Groupomania">

            <h1 class="login__title">Connexion</h1>

            <p>Vous n'avez pas encore de compte ? <router-link to="/signup" class="login__signup">S'inscrire</router-link></p>

            <form @submit.prevent="login" class="login__form">
                <div class="login__input">
                    <label for="mail" class="login__label">Email</label>
                    <input type="email" v-model="email" id="mail" name="mail">
                </div>

                <div class="login__input">
                    <label for="password" class="login__label">Mot de passe</label>
                    <input type="password" v-model="password" id="password" name="password">
                </div>

                <button class="login__button">Se connecter</button>
            </form> 
        </section>      
    </main>
</template>


<script>
    import axios from 'axios'
    import { Notyf } from 'notyf'
    import 'notyf/notyf.min.css'

    export default {
        name: 'Home',
        data() {
            return {
                email: '',
                password: '',
            }
        },
        created() {
            this.notyf = new Notyf({
                duration: 2000,
                position: {
                    x: 'center',
                    y: 'center'
                }
            });
        }, 
        methods: {
            // Permet de se connecter et de recharger la page sans que l'utilisateur soit déconnecté
            login() {
                axios.post('http://localhost:3000/api/user/login', {
                    email: this.email,
                    password: this.password,
                })
                .then(response => {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userId', response.data.userId);
                    localStorage.setItem('firstname', response.data.firstname);
                    localStorage.setItem('lastname', response.data.lastname);
                    localStorage.setItem('isAdmin', response.data.isAdmin);
                    localStorage.setItem('imageProfile', response.data.imageProfile);

                    this.$router.push('post');
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
    .home {
        &__photo{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            max-height: 100%;
            opacity: 0.5;
        }
    }

    .login{
        position: absolute;
        margin: 150px;
        display: flex;
        flex-direction: column;
        width: 40%;
        padding: 30px;
        border: 1px solid #E0E2DB;
        border-radius: 10px;
        background-color: #fff;
        &__logo{
            width: 60%;
            margin: 0 auto;
        }
        &__title{
            margin-bottom: 1rem;
            font-size: 27px;
        }
        & p{
            margin: 0;
        }
        &__signup{
            font-weight: bold;
            text-decoration: none;
            color: #000;
        }
        &__input{
            display: flex;
            flex-direction: column;
            margin: 1rem auto;
            width: 70%;
        }
        &__label{
            text-align: start;
            font-weight: bold;
        }
        &__button{
            background-image: linear-gradient(to right, #eb3941, #f15e64, #e14e53, #e2373f);  box-shadow: 0 5px 15px rgba(242, 97, 103, .4);
            width: 150px;
            font-size: 16px;
            font-weight: bold;
            color: #fff;
            cursor: pointer;
            height: 50px;
            text-align:center;
            border: none;
            background-size: 300% 100%;
            border-radius: 10px;
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

</style>