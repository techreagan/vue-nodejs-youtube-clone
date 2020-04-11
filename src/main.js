import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { required, email, max, min } from 'vee-validate/dist/rules'
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from 'vee-validate'

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

Vue.config.productionTip = false
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
