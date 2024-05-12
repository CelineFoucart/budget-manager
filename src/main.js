import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import "toastify-js/src/toastify.css";
import "./assets/style.css";
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router.js'
import App from './App.vue'

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')
