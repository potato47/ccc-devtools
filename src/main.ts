import { createApp } from 'vue';
import App from './App.vue';
import 'element-plus/theme-chalk/dark/css-vars.css';
import vfmPlugin from 'vue-final-modal'

createApp(App).use(vfmPlugin).mount('#dev-app');
