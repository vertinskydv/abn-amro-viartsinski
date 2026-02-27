import {
  createWebHistory,
  createRouter,
  type RouteRecordRaw,
} from 'vue-router';

import Dashboard from './screens/Dashboard.vue';
import ShowDetails from './screens/ShowDetails.vue';
import Search from './screens/Search.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'dashboard', component: Dashboard },
  {
    path: '/show/:id',
    name: 'show-details',
    component: ShowDetails,
    props: true,
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
    props: (route) => ({ q: route.query.q }),
  },
  { path: '/:pathMatch(.*)*', redirect: { name: 'dashboard' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  to.meta.previousRoute = from;
});

export default router;
