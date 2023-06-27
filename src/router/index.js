import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/IndexView')
  },{
    path: '/teacher',
    name: 'teacher',
    component: () =>import('../views/teacher/HomeworkManageView')
  },
  {
    path:'/login',
    name:'login',
    component: () =>import('../views/login')
  },
  {
    path:'/register',
    name:'register',
    component: () =>import('../views/Register')
  },
  {
    path: '/user/information/:id',
    name:'Personal',
    component: () =>import('../views/user/InformationView')
  },
  {
    path: '/user/info/:id',
    name:'info',
    component: () =>import('../views/user/Info')
  },
  {
    path: '/selectCourse',
    name:'course',
    component: () =>import('../views/student/SelectCourseView')
  },
  {
    path: '/student/course/:id',
    name:'course',
    component: () =>import('../views/student/CourseView')
  },
  {
    path: '/teacher/course/:id',
    name:'course',
    component: () =>import('../views/teacher/CourseView')
  },
  {
    path: '/student/courseLearn/:cid',
    name:'courseLearn',
    component: () =>import('../views/student/CourseLearnView')
  },
  {
    path: '/teacher/addCourse/:tid',
    name:'addCourse',
    component: () =>import('../views/teacher/AddCourseView')
  },
  {
        path: '/',
        name: 'front',
        component: () =>import('../views/frontpage/IndexView.vue')
    },{
    path: '/test',
    name: 'test',
    component: ()=>import('../views/teacher/HomeworkListView')
  }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
