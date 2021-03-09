<template>
  <div class="shooter-wrap">
    <div class="base">
      <div class="weapon"
      :style="{transform: 'translateX(-50%) rotate(-'+angleWeapon+'deg)'}"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'gameBalloon',
  props: {
    angleWeapon:{
      type: Number,
      default: 90
    }
  }
}
</script>

<style>
  .shooter-wrap{
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    width: 10%;
  }
  .base{
    position: relative;
    width: 100%;
    padding-bottom: 60%;
    background: #000;
    border-radius: 50% / 30%;
  }
  .weapon{
    position: absolute;
    z-index: 5;
    left: 0;
    right: 0;
    margin: auto;
    height: 3px;
    width: 30px;
    background: #d8adad;
    transform-origin: 100% 50% 0;
    transform: translateX(-50%) rotate(-90deg);
    transition: transform 0.05s ease; 
  }
</style>