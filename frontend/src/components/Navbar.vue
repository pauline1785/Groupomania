<template> 
    <header>
        <div class="brand_logo">
            <img src="../assets/groupomania_black_logo.svg" alt="logo Groupomania"/>
        </div>

        <nav>
            <ul>
                <li><router-link to="/post" class="links">Accueil</router-link></li>
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
            // Permet d'afficher la boîte modale de déconnexion 
            displayModale() {
                this.revele = !this.revele
            }
        }
    }
</script>

<style lang="scss" scoped>
    header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.2rem 4rem;
        border-bottom: 1px solid #979797;
    }
    
    .brand_logo img{
        display: flex;
        justify-content: flex-start;
        max-width: 450px;
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
        }
    }
</style>