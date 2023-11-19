<template>
  <nav class="navbar">
      <ul v-if="logged" class="navbar-nav">
        <li>
          <RouterLink
            class="link d-inline-flex nav-link link-light p-1 align-items-center"
            to="/"
          >
            <HomeIcon />
            <p class="m-1"></p>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            class="link d-inline-flex nav-link link-light p-1 align-items-center"
            :to="`/profile/${id}`"
          >
            <Search />
            <p class="m-1"></p>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            class="link d-inline-flex nav-link link-light p-1 align-items-center"
            to="/artists"
          >
            <ProfileIcon />
            <p class="m-1"></p>
          </RouterLink>
        </li>
        <li v-if="admin">
          <RouterLink
            class="link d-inline-flex nav-link link-light p-1 align-items-center"
            to="/createArtist"
          >
            <Add />
            <p class="m-1"></p>
          </RouterLink>
        </li>
      </ul>

      <ul v-else class="navbar-nav">
        <li>
          <RouterLink
            class="link d-inline-flex nav-link link-light p-1 align-items-center"
            to="/login"
          >
            <LoginIcon />
            <p class="m-1">Sign In</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            class="link d-inline-flex nav-link link-light p-1 align-items-center"
            to="/register"
          >
            <p class="m-1">Sign Up</p>
          </RouterLink>
        </li>
      </ul>
  </nav>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { watch, ref, onMounted } from "vue";
import HomeIcon from "../assets/icons/HomeIcon.vue";
import ArtistIcon from "../assets/icons/ArtistIcon.vue";
import ProfileIcon from "../assets/icons/ProfileIcon.vue";
import LoginIcon from "../assets/icons/LoginIcon.vue";
import Add from "../assets/icons/Add.vue";
import Search from "../assets/icons/Search.vue";

const admin = ref(false);
const logged = ref("");
const nick = ref("");
const id = localStorage.getItem("id");
const userImage = ref(null);

onMounted(async () => {
  nick.value = localStorage.getItem("nick");
  const token = localStorage.getItem("token");

  if (localStorage.getItem("token")) {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const role = decoded.role;
    userImage.value = decoded.image;
    if (role == "role_admin") {
      admin.value = true;
    }
    logged.value = true;
  } else {
    logged.value = false;
  }
});

const signOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("nick");
  localStorage.removeItem("id");
  logged.value = false;
  router.push("/login");
};

watch(logged, (newVal) => {
  logged.value = newVal;
});
</script>

<style scoped>

h2{
    color: white;
}

.navbar {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  width: 100%;
  background-color: rgb(26, 27, 27);
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10000;
  height: 60px;
}

.navbar-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
}


svg{
    width: 2em;
    height: 2em;
}
</style>
