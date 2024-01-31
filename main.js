import './assets/main.css';
import 'vue-easy-dnd/dist/dnd.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import 'mosha-vue-toastify/dist/style.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { QuillEditor } from '@vueup/vue-quill';
import moshaToast from 'mosha-vue-toastify';
import { createModal } from '@kolirt/vue-modal'

const pinia = createPinia();
const app = createApp(App);

app.component('QuillEditor', QuillEditor);
app.use(pinia);
app.use(router);

app.directive('focus', {  // When the bound element is inserted into the DOM...
  mounted(el, binding, vnode) {
    if (binding.value) { // Focus the element if the value is true
      el.focus();
    } else {
      el.blur();
    }
  }
});

app.use(moshaToast);
app.use(createModal({
  transitionTime: 200,
  animationType: 'slideUp',
  modalStyle: {
    padding: '0rem 0rem',
    align: 'center',
    'z-index': 201
  },
  overlayStyle: {
    'background-color': 'rgba(0, 0, 0, .5)',
    'z-index': 200
  }
}));

app.mount('#app');
