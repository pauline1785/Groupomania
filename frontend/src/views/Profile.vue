<template>
	<Navbar/>
	<!-- PROFIL DE L'UTILISATEUR -->
	<section class="Profile">
		<h1 v-if="user">Hello {{ user.firstname }} !</h1>

		<div class="Profile__avatar">
			<ProfileImage :src="user.imageProfile"/>

			<div class="Profile__avatar__modify">
				<button @click="uploadFile" type="button">Modifier ma photo</button>	
				<input type="file" ref="fileUpload" @change="onFileSelected" style="display:none" accept="image/*" id="file-input" aria-label="Modifier ma photo">
			</div>
		</div>

		<div class="Profile__infos">
			<h2>Prénom</h2>
			<p>{{ user.firstname }}</p>

			<h2>Nom</h2>
			<p>{{ user.lastname }}</p>
					
			<h2>Email</h2>
			<p>{{ user.email }}</p>
		</div>

		<button @click="modifyProfile" class="Profile__save">Enregister</button>

		<ModaleDeleteAccount v-bind:revele="revele" v-bind:displayModale='displayModale'/>
		<button class="Profile__delete" v-on:click="displayModale">Supprimer mon compte</button>
	</section>

</template>

<script>
	import axios from 'axios'
	import { Notyf } from 'notyf'
	import 'notyf/notyf.min.css'

	import Navbar from '@/components/Navbar.vue'
	import ModaleDeleteAccount from '@/components/ModaleDeleteAccount.vue'
	import ProfileImage from '../components/ProfileImage.vue'

	export default {
		name: 'Profile',
		components: {
			Navbar,
			ModaleDeleteAccount,
			ProfileImage
		},
		data(){
			return {
			revele: false,
			user: "",
			imageProfile: null,
			}
		},
		created() {
			this.displayProfile();  
			this.notyf = new Notyf({
			duration: 2000,
			position: {
				x: 'center',
				y: 'top'
			}
			}); 
		},
		methods: {
			// Permet d'afficher les informations de profil
			displayProfile() {
				const userId = localStorage.getItem('userId');

				axios.get('http://localhost:3000/api/user/' + userId, {
					headers: {
						Authorization: 'Bearer ' + localStorage.getItem('token')
					}
				})
				.then(response => {
					this.user = response.data;
					localStorage.setItem('imageProfile', response.data.imageProfile);
				})
				.catch(error => {
					const msgerror = error.response.data
					this.notyf.error(msgerror.error)
				})
			},

			// Permet de modifier la photo de profil
			uploadFile () {
				this.$refs.fileUpload.click()
			},
			onFileSelected(event) {
				this.imageProfile = event.target.files[0]
			},
			modifyProfile() {
				const userId = localStorage.getItem('userId');

				const formData = new FormData();
				formData.append("image", this.imageProfile);

				axios.put('http://localhost:3000/api/user/' + userId, formData, {
					headers: {
						'Authorization': 'Bearer ' + localStorage.getItem('token'),
						'Content-Type': 'multipart/form-data'
					}
				})
				.then(() => {
					this.notyf.success('Votre profil a bien été modifié !')
					this.displayProfile();
				})
				.catch(error => {
					const msgerror = error.response.data
					this.notyf.error(msgerror.error)
				})
			},

			// Permet d'afficher la boîte modale pour la suppression du compte
			displayModale() {
				this.revele = !this.revele
			}
		}
	}
</script>

<style lang="scss" scoped>
	.Profile{
		width: 60%;
		margin: 2rem auto;
		display: flex;
		flex-direction: column;
		border: 1px solid #E0E2DB;
		border-radius: 10px;
		padding: 2rem;
		background-color: #fff;
		& button{
			background-image: linear-gradient(to right, #eb3941, #f15e64, #e14e53, #e2373f);  
			color: #fff;
			cursor: pointer;
			height: 40px;
			text-align:center;
			border: none;
			align-self: center;
			background-size: 300% 100%;
			margin-top: 6rem;
			border-radius: 5px;
			padding: 0 1rem;
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
		&__avatar{
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			& img{
				margin-right: 2rem;
				width: 15rem;
				height: 15rem;
			}
			
		}
		&__infos{
			text-align: left;
			margin-top: 20px;
			& h2{
				font-size: 15px;
			}
			& p{
				font-size: 20px;
				padding-bottom: 20px;
			}
		}
		&__save{
			width: 20%;
		}
		&__delete{
			width: 20%;
		}
	}

// RESPONSIVE
	@media screen and (max-width: 992px){
		.Profile{
			width: 80%;
			&__avatar{
				flex-direction: column;
				& img{
					margin: 0 auto;
				}
			}
			& button{
				margin-top: 1rem;
			}
			&__save{
				width: 80%;
			}
			&__delete{
				width: 80%;
			}
		}
	}
</style>