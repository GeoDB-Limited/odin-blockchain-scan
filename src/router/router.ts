import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// import {
//   makeAuthorizedOnlyGuard,
//   makeRootRedirector,
//   makeUnauthorizedOnlyGuard,
// } from './guards'

// const rootRedirector = makeRootRedirector(
//   { name: 'Validators' },
//   { name: 'Auth' }
// )

// const rootRedirector = makeRootRedirector(
//   { name: 'Validators' },
//   { name: 'Auth' }
// )
// const authorizedOnlyGuard = makeAuthorizedOnlyGuard({ name: 'Auth' })
// const unauthorizedOnlyGuard = makeUnauthorizedOnlyGuard({ name: 'Redirector' })

const routes: Array<RouteRecordRaw> = [
  // { path: '/', name: 'Redirector', redirect: rootRedirector },
  // { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: rootRedirector },
  // {
  //   path: '/auth',
  //   name: 'Auth',
  //   beforeEnter: unauthorizedOnlyGuard,
  //   component: () => import(/* webpackChunkName: "auth" */ '../views/Auth.vue'),
  // },
  // TODO: temp. hidden all but validators
  // {
  //   path: '/data-sources',
  //   name: 'DataSources',
  //   beforeEnter: authorizedOnlyGuard,
  //   component: () =>
  //     import(/* webpackChunkName: "data-sources" */ '../views/DataSources.vue'),
  // },
  // {
  //   path: '/oracle-scripts',
  //   name: 'OracleScripts',
  //   beforeEnter: authorizedOnlyGuard,
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "oracle-scripts" */ '../views/OracleScripts.vue'
  //     ),
  // },
  // {
  //   path: '/requests',
  //   name: 'Requests',
  //   beforeEnter: authorizedOnlyGuard,
  //   component: () =>
  //     import(/* webpackChunkName: "requests" */ '../views/Requests.vue'),
  // },
  // {
  //   path: '/voting',
  //   name: 'Voting',
  //   beforeEnter: authorizedOnlyGuard,
  //   component: () =>
  //     import(/* webpackChunkName: "voting" */ '../views/Voting.vue'),
  // },
  // {
  //   path: '/validators',
  //   name: 'Validators',
  //   beforeEnter: authorizedOnlyGuard,
  //   component: () =>
  //     import(/* webpackChunkName: "validators" */ '../views/Validators.vue'),
  // },
  {
    path: '/',
    name: 'Home',
    // beforeEnter: authorizedOnlyGuard,
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/blocks',
    name: 'Blocks',
    // beforeEnter: authorizedOnlyGuard,
    component: () => import('../views/Blocks.vue'),
  },
  {
    path: '/blocks/:id',
    name: 'BlockItem',
    // beforeEnter: authorizedOnlyGuard,
    component: () => import('../views/BlockItem.vue'),
  },
  {
    path: '/transactions/:height?',
    name: 'Transactions',
    // beforeEnter: authorizedOnlyGuard,
    component: () => import('../views/Transactions.vue'),
  },
  {
    path: '/transactions/:height/:trans',
    name: 'TransactionsItem',
    // beforeEnter: authorizedOnlyGuard,
    component: () => import('../views/TransactionsItem.vue'),
  },
  {
    path: '/pending_transactions',
    name: 'PendingTransactions',
    // beforeEnter: authorizedOnlyGuard,
    component: () => import('../views/PendingTransactions.vue'),
  },
  {
    path: '/validators',
    name: 'Validators',
    // beforeEnter: authorizedOnlyGuard,
    component: () => import('../views/Validators.vue'),
  },
  {
    path: '/validators/:address',
    name: 'ValidatorItem',
    // beforeEnter: authorizedOnlyGuard,
    component: () => import('../views/ValidatorItem.vue'),
  },
  {
    path: '/tokemonics',
    name: 'Tokemonics',
    // beforeEnter: authorizedOnlyGuard,
    component: () => import('../views/Tokemonics.vue'),
  },
  // TODO: create view for this pages
  {
    path: '/odin-geo',
    name: 'odin&geo',
    // beforeEnter: authorizedOnlyGuard,
    component: () => import('../views/Odin-geo.vue'),
  },
  {
    path: '/charts',
    name: 'charts',
    // beforeEnter: authorizedOnlyGuard,
    component: () => import('../views/Tokemonics.vue'),
  },
  {
    path: '/delegators/:hash/',
    name: 'DelegatorItem',
    // beforeEnter: authorizedOnlyGuard,
    component: () => import('../views/DelegatorItem.vue'),
  },
  {
    path: '/top_accounts/',
    name: 'TopAccounts',
    // beforeEnter: authorizedOnlyGuard,
    component: () => import('../views/TopAccounts.vue'),
  },
  {
    path: '/account/:hash/',
    name: 'AccountsItem',
    // beforeEnter: authorizedOnlyGuard,
    component: () => import('../views/AccountsItem.vue'),
  },
  {
    path: '/chart',
    name: 'ChartValidators',
    children: [
      // TODO: wait for backend
      // {
      //   path: 'validators',
      //   name: 'validatorsChart',
      //   component: () => import('../views/validatorsChart.vue'),
      // },
      {
        path: 'daily_transactions',
        name: 'dailyTransactions',
        component: () => import('../views/dailyTransactionsChart.vue'),
      },
    ],
    // beforeEnter: authorizedOnlyGuard,
    component: () => import('../views/ChartPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
