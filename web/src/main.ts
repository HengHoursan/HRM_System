import { createApp } from 'vue';
import router from './router';
import i18n from './i18n';

import './style.css';

import App from './App.vue';

import { permission } from './directives/permission';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';

import pinia from './stores';
const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark',
        }
    }
});
app.use(ToastService);
app.use(pinia);
app.use(router);
app.use(i18n);
app.directive('permission', permission);

app.mount('#app');
