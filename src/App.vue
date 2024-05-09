<template>
  <NavBar></NavBar>

  <main class="container-fluid">
    <router-view></router-view>
  </main>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',

  components: {
    NavBar
  }
}
</script>

<style scoped>
main {
  margin-top: 80px;
}
</style>
