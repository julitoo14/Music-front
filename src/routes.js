import { createRouter, createWebHistory } from "vue-router";
import Register from './views/register.vue';
import Login from './views/login.vue';
import Home from './views/Home.vue';
import Profile from './views/Profile.vue';

const routes = [
    {
        path: "/register",
        component: Register
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: '/',
        component: Home
    }, 
    {
        path: '/profile/:id',
        component: Profile
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  export { router };