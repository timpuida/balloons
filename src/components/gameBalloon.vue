<template>
	<div class="top" 
	:style="{left:balloon.left+'px',  bottom:-balloon.bottom+'px'}"
	v-if="balloon.isExist"
	@click="click"
	>
		<div>
			<div class="ball">
			</div>
		</div>

	</div>
</template>

<script>

	export default {
		name: 'balloon',
		props:{
			balloon:{
				type: Object
			}
		},
		data(){
			return {
			}
		},
		methods:{
			click(){
				this.$emit('clickOnBaloon',this.balloon);
			},
		},
		mounted(){
			this.$emit('getWidth', 
			{
				width: window.getComputedStyle(document.querySelector('.top')).getPropertyValue('width'),
				height: window.getComputedStyle(document.querySelector('.top')).getPropertyValue('height') 
			}
			)
		},
}
</script>

<style>
.top{
	width: 10.6%;
	max-width: 45px;
	position: absolute;
	bottom: 0;
	transition: all 0.1s linear;
	pointer-events:none;
	z-index: 1;
}
.top>div{
		position:relative;
    width:100%;
    padding-bottom:140%;
}
div.ball{
	position: absolute;
	z-index: 10;
	bottom: 0px;
	width:100%;
	height:100%;
	background: #e69684;
	pointer-events: none;
}
</style>