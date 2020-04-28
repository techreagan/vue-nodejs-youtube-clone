import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { required, email, max, min, size } from 'vee-validate/dist/rules'
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from 'vee-validate'
import Vuebar from 'vuebar'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: 'Enter {_field_}'
})

extend('max', {
  ...max,
  message: '{_field_} may not be greater than {length} characters'
})

extend('min', {
  ...min,
  message: '{_field_} may not be less than {length} characters'
})

extend('email', {
  ...email,
  message: 'Email must be valid'
})

extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target
  },
  message: 'Password does not match'
})

extend('size', {
  ...size,
  message: 'video size should be less than 5 MB!'
})

Vue.config.productionTip = false
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

Vue.use(Vuebar)

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')
