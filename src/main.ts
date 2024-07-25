import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './tailwind.css';

const app = createApp(App);
const pinia = createPinia();
const cookies =
app.use(pinia);
app.use(router);
app.mount('#app');
