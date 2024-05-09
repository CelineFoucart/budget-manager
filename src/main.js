import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./assets/style.css";
import { createApp } from 'vue'
import router from './router.js'
import App from './App.vue'

createApp(App).use(router).mount('#app')
