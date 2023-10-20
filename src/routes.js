import { createRouter, createWebHistory } from "vue-router";
import Register from './views/register.vue';
import Login from './views/login.vue';
import Home from './views/Home.vue';
import Profile from './views/Profile.vue';
import CreateArtist from './views/CreateArtist.vue';
import Artists from './views/Artists.vue';
import Artist from './views/Artist.vue';
import EditArtist from './views/EditArtist.vue';
import Album from './views/Album/Album.vue';
import CreateAlbum from './views/CreateAlbum.vue';
import EditAlbum from './views/Album/EditAlbum.vue';
import AddSong from './views/Song/AddSong.vue';
import EditSong from './views/Song/EditSong.vue'

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
        component: CreateArtist
    },
    {
        path: '/artists',
        component: Artists
    },
    {
        path: '/artist/:id',
        component: Artist
    },
    {
        path: '/editArtist/:id',
        component: EditArtist
    },
    {
        path: '/album/:id',
        component: Album
    },
    {
        path: '/createAlbum/:artistId',
        component: CreateAlbum
    },
    {
        path: '/editAlbum/:id',
        component: EditAlbum
    },
    {
        path: '/addSong/:albumId',
        component: AddSong
    },
    {
        path: '/editSong/:id',
        component: EditSong
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  export { router };