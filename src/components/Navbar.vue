<template>
  <nav class="navbar">
    <RouterLink class="navbar-brand" to="/">
      <img class="logo" src="/logo.png" alt="" />
      <h2 class="m-2">SoundJam</h2>
    </RouterLink>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
        <CollapseIcon />
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul v-if="logged" class="navbar-nav">
        <li>
          <RouterLink
            class="link d-inline-flex nav-link link-light p-1 align-items-center"
            to="/"
          >
            <HomeIcon />
            <p class="m-1">Home</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            class="link d-inline-flex nav-link link-light p-1 align-items-center"
            :to="`/profile/${id}`"
          >
            <ProfileIcon />
            <p class="m-1">Profile</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            class="link d-inline-flex nav-link link-light p-1 align-items-center"
            to="/artists"
          >
            <ArtistIcon />
            <p class="m-1">Artists</p>
          </RouterLink>
        </li>
        <li v-if="admin">
          <RouterLink
            class="link d-inline-flex nav-link link-light p-1 align-items-center"
            to="/createArtist"
          >
            <Add />
            <p class="m-1">Add Artist</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            class="link d-inline-flex nav-link link-light p-1 align-items-center"
            @click="signOut"
            to="/login"
          >
            <Exit />
            <p class="m-1">Sign Out</p>
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
    </div>
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
import Exit from "../assets/icons/Exit.vue";
import CollapseIcon from "../assets/icons/CollapseIcon.vue";

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
  justify-content: space-between;
  align-items: center;
  padding: 0 1em;
  width: 100%;
  background-color: rgb(26, 27, 27);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  border-bottom: #a600ff solid 3px;
}

.logo {
  width: 2em;
  height: 2em;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 1em;
  padding: 1em;
}

.link {
  gap: 1em;
  display: flex;
  justify-content: center;
}

.link p {
    width: 30%;
}
</style>
