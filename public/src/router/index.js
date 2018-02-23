import Vue from 'vue'
import Router from 'vue-router'
import Organizations from '../components/organization/organizations'
import OrganizationDetails from '../components/organization/organization-details'
import OrganizationAdd from '../components/organization/organization-add.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'organizations',
      component: Organizations
    },
    {
      path: '/add',
      name: 'organization-add',
      component: OrganizationAdd
    },
    {
      path: '/:id',
      name: 'organization-details',
      component: OrganizationDetails,
      props: true
    }
  ]
})
