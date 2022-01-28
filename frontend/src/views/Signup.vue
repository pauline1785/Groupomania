<template>
    <main class="home">
            <img class="home__photo" src="../assets/home01.jpg" alt="Représentation de trois personnes qui discutent via un chat">

            <section class="signup">
                <img class="signup__logo" src="../assets/groupomania_red_logo.png" alt="logo de Groupomania">

                <h1 class="signup__title">Inscription</h1>

                <p>Vous avez déjà un compte ? <router-link to="/" class="signup__login">Se connecter</router-link></p>

                <form @submit.prevent="signup" class="signup__form">
                    <div class="signup__input">
                        <label for="firstname" class="signup__label">Prénom</label>
                        <input type="text" v-model="firstname" id="firstname" name="firstname">
                    </div>

                    <div class="signup__input">
                        <label for="lastname" class="signup__label">Nom</label>
                        <input type="text" v-model="lastname" id="lastname" name="lastname">
                    </div>

                    <div class="signup__input">
                        <label for="mail" class="signup__label">Email</label>
                        <input type="email" v-model="email" id="mail" name="mail">
                    </div>

                    <div class="signup__input">
                        <label for="password" class="signup__label">Mot de passe</label>
                        <input type="password" v-model="password" id="password" name="password">
                    </div>

                    <button class="signup__button">S'inscrire</button>
                </form> 
            </section>      
        </main>
</template>


<script>
    import axios from 'axios'
    import { Notyf } from 'notyf'
    import 'notyf/notyf.min.css'

    export default {
        name: 'Signup',
        data() {
            return {
                firstname: '',
                lastname: '',
                email: '',
                password: '',
            }
        },
        created() {
            this.notyf = new Notyf({
                duration: 4000,
                position: {
                    x: 'center',
                    y: 'center'
                }
            });
        },
        methods: {
            // Permet de s'inscrire et de basculer sur la page de connexion 
            signup() {
                axios.post('http://localhost:3000/api/user/signup', {
                    firstname: this.firstname,
                    lastname: this.lastname,
                    email: this.email,
                    password: this.password,
                })
                .then(() => {
                    this.notyf.success('Votre compte a bien été créé ! A présent, veuillez vous connecter.')
                    this.$router.push('/');
                })
                .catch(error => {
                    const msgerror = error.response.data
                    this.notyf.error(msgerror.error)
                })
            },
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

    .signup{
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
        &__login{
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
            background-image: linear-gradient(to right, #eb3941, #f15e64, #e14e53, #e2373f);  
            box-shadow: 0 5px 15px rgba(242, 97, 103, .4);
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