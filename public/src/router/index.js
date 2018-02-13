import Vue from 'vue'
import Router from 'vue-router'
import Organizations from '../components/organization/organizations'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'organizations',
      component: Organizations
    }
  ]
})
