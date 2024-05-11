<template>
  <NavBar></NavBar>

  <div class="app-container">
    <main class="container-fluid pt-3">
      <router-view></router-view>
    </main>
  
    <footer class="footer text-center small">
      &copy; {{year.getFullYear()}} Budget Manager - version 1.0.0
    </footer>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',

  components: {
    NavBar
  },

  data() {
    return {
      year: new Date()
    }
  },
}
</script>

<style scoped>
.footer {
    bottom: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
}

.app-container {
  margin-top: 48px;
  height: calc(100vh - 48px);
  overflow-y: scroll;
  margin-left: 10px;
}

.app-container::-webkit-scrollbar {
  width: 20px;
}

.app-container::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 6px;
  border: 4px solid rgba(0,0,0,0);
  background-clip: content-box;
  min-width: 32px;
  min-height: 32px;
}

.app-container::-webkit-scrollbar-corner {
  background: rgba(0,0,0,0);
}
</style>
