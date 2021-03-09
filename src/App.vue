<template>
  <div id="app">
   <game-wrapper/>
  </div>
</template>

<script>
import gameWrapper from './components/gameWrapper'

export default {
  name: 'App',
  components: {
    gameWrapper
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  
}
@import './assets/main.css';

</style>
