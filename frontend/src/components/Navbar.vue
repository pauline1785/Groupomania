<template> 
    <header>
        <div class="brand_logo">
            <router-link to="/post"><img src="../assets/groupomania_black_logo.svg" alt="logo Groupomania"/></router-link>
        </div>

        <nav >
            <ul>
                <li><router-link to="/profile" class="links">Profil</router-link></li>
                <li><ModaleLogout v-bind:revele="revele" v-bind:displayModale='displayModale'/>
                    <button @click="displayModale" class="links logout">Déconnexion</button>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script>
    import ModaleLogout from '@/components/ModaleLogout.vue'

    export default {
        name: 'Navbar',
        data(){
            return {
                revele: false
            }
        },
        components: {
            ModaleLogout
        },
        methods: {
            // affiche la boîte modale de déconnexion 
            displayModale() {
                this.revele = !this.revele
            }
        }
    }
</script>

<style lang="scss" scoped>
    header{
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        flex-basis: 100%;
        align-items: center;
        height: auto;
        border-bottom: 1px solid #979797;
        background-color: #fff;
        padding: 1rem 0;
    }
    
    .brand_logo img{
        width: 50%;
    }

    nav {
        & ul{
            display: flex;
            flex-flow: row wrap;
            align-items: flex-end;
        }
        & .links{
            text-decoration: none;
            padding: 1rem 4rem 0 0;
            align-items: flex-end;
            color: #000;
            &:hover{
                color: #F74038;
            }
        }
        & .logout{
            border: none;
            background-color: #fff;
            height: 0px;
        }
        & input{
            display: none;
        }
        & label{
            display: none;
        }
    }

// RESPONSIVE
    @media screen and (max-width: 768px){
        header{
            padding-bottom: 0;
        }
        .brand_logo{
            margin: 0 auto;
        }

        nav{
            width: 100%;
            margin-top: 1rem;
            & ul{
                justify-content: space-around;
            }
            & .links{
                padding: 0;
            }
            
        }


    }
</style>