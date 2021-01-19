<template>
  <div id="app">
    <Home msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import Home from './components/Home.vue'
export default {
  name: 'App',
  components: {
    Home
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
  background: rgba(248, 248, 248, 1);
  padding: 6rem 0;
}
#app img {
  border: 1px solid rgba(200, 200, 200, 1);
  border-radius: 10px;
}
</style>