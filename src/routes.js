import { createRouter, createWebHistory } from "vue-router";
import Register from './views/register.vue';
import Login from './views/login.vue';
import Home from './views/Home.vue';
import Profile from './views/Profile.vue';
import Create from './views/CreateArtist.vue';
import Artists from './views/Artists.vue';

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
    },
    {
        path: '/createArtist',
        component: Create
    },
    {
        path: '/artists',
        component: Artists
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  export { router };