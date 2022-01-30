<template>
		<img :src=" src || 'user-solid.svg'" class="photo" alt="Photo de profil"/>
</template>


<script>
	export default {
		name: 'ProfileImage',
		props: ['src']
	}
</script>


<style lang="scss" scoped>
	.photo{
		object-fit: cover;
		border-radius: 10%;
		border: 1px solid #E0E2DB;
	}
</style>