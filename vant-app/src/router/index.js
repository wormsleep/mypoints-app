import Vue from 'vue'
import VueRouter from 'vue-router'

import login from '../views/Login'
import home from '../views/Home'
import about from '../views/About'


const gallery = () => import('../views/gallery')
const working = () => import('../views/working')
const points = () => import('../views/points')
const owner = () => import('../views/owner')

const workingListView = () => import('../views/working/working-list-view')

Vue.use(VueRouter)

/**
 * 路由参数传递
 * 1、路由参数若使用 push 则 path 不能与 params 一起使用，只能与 query 使用
 */

const routes = [
  {path: '*', redirect:'/login'},
  {
    name: 'login',
    component: login,
    meta: {
      keepAlive: false
    }
  },
  {
    name: 'home',
    component: home,
    props: true,
    meta: {
      keepAlive: true
    },
    children: [
      {
        path: 'gallery',
        name: 'home-gallery',
        components: {
          home: gallery
        },
        meta: {
          keepAlive: true
        },
      },
      {
        path: 'working',
        name: 'home-working',
        components: {
          home: working
        },
        meta: {
          keepAlive: true
        },
      },
      {
        path: 'points',
        name: 'home-points',
        components: {
          home: points
        },
        meta: {
          keepAlive: true
        },
      },
      {
        path: 'owner',
        name: 'home-owner',
        components: {
          home: owner
        },
        meta: {
          keepAlive: true
        },
      },
      {
        path: '',
        redirect: '/home/gallery'
      }
    ]
  },
  {
    name: 'working-list-view',
    component: workingListView,
    meta: {
      title: '赢取积分列表',
      keepAlive: false,
    },
  },
  {
    name: 'about',
    component: about,
    meta: {
      keepAlive: false,
    },
  }
]

routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }

  next();
});

export default router
