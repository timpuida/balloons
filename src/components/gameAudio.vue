<template>
	<audio ref="audio" src="@/assets/burst.mp3"></audio>
</template>

<script>
	export default{
		name:'Audio',
		mounted(){
			this.$emit('audioLoaded',this.$refs.audio)
		}
	}
</script>