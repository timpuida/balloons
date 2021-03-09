<template>
	<div class="arrow"
		:style="{transform: `translateX(-100%) rotate(-${arrowData.angle}deg)`, 
			left: arrowData.left-documentLeft+'px',
			top: arrowData.top+'px'}"
		>
		<div class="spearhead"></div>
		<slot></slot>
	</div>
</template>

<script>
	export default{
		name: 'gameArrow',
		props:['arrowData', 'clientX', 'documentLeft'],
		data(){
			return{
				coordStartArrow:null
			}
		},
		mounted(){
			this.coordStartArrow = document.querySelectorAll('.arrow');
			this.coordStartArrow=this.coordStartArrow[this.coordStartArrow.length-1].getBoundingClientRect().left;
			this.$emit('getCoordStartArrow', this.coordStartArrow);

		}
	}	
</script>

<style>
.arrow{
	position: absolute;
	background: #000;
	height: 3px;
	width: 30px;
	transform-origin: 100% 50% 0;
	transform: translateX(-50%) rotate(-90deg);
}	
.spearhead{
	width: 2px;
	height: 3px;
	background: red;
}
</style>