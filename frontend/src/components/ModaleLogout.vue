<template> 
    <div v-if="revele" class="modaleBloc">
        <div @click="displayModale" class="modaleBloc__overlay"></div>
        
        <div class="modaleBloc__card">
            <div class="modaleBloc__card__title">
                <p>Souhaitez-vous vraiment vous déconnecter ?</p>
                
                <div class="modaleBloc__card__title__close">
                    <i @click="displayModale" class="far fa-times-circle fa-2x modaleBloc__card__title__close" aria-label="Fermer la fenêtre"></i>
                </div>
            </div>

            <button @click="logout" class="modaleBloc__card__button" aria-label="Se déconnecter">Se  déconnecter</button>
        </div>
    </div>
</template>


<script>
    export default {
        name: 'ModaleLogout',
        props: ['revele', 'displayModale'],
        methods: {
            logout() {
                // Permet de se déconnecter
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('firstname');
                localStorage.removeItem('lastname');
                localStorage.removeItem('isAdmin');
                localStorage.removeItem('imageProfile');
                
                this.$router.push('http://localhost:8080/');
            }
        }
    }
</script>


<style lang="scss" scoped>
    .modaleBloc {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 599;
        &__overlay {
            background: rgba(0,0,0,0.5);
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
        }
        &__card {
            z-index: 2;
            position: fixed;
            background: #f1f1f1;
            color: #3f3d56;
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #E0E2DB;
            &__title {
                display: flex;
                flex-direction: column;
                text-align: center;
                padding: 3rem 6rem 1.5rem 6rem;
                & p {
                    margin-top: 0px;
                    @media (max-width: 500px) {
                        font-size: 20px;
                    }
                }
                &__close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    color: #3f3d56;
                    &:hover, &:focus {
                        color: #ff6363;
                    }
                }
            }
            &__button {
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
    }
</style>