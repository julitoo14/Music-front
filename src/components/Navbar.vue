<template>
  <div class="sidebar d-flex flex-column flex-shrink-0">
    <RouterLink
      class="d-flex align-items-center p-3 mb-3 mb-md-0 me-md-auto link-light text-decoration-none flex-wrap justify-content-center"
      to="/"
    >
      <img class="logo" src="/logo.svg" alt="" />
      <h2 class="m-2">SoundJam</h2>
    </RouterLink>
    <hr />

    <ul v-if="logged" class="p-3 nav nav-pills flex-column mb-auto">
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
    </ul>

    <ul v-else class="p-3 nav nav-pills flex-column mb-auto">
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
          <LibraryIcon />
          <p class="m-1">Sign Up</p>
        </RouterLink>
      </li>
    </ul>

    <hr v-if="logged" />

    <div v-if="logged" class="dropdown p-4">
      <a
        href="#"
        class="d-flex align-items-center link-light text-decoration-none dropdown-toggle"
        id="dropdownUser"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img
          :src="avatarUrl"
          width="32"
          height="32"
          class="rounded-circle me-2"
        />
        <strong>{{ nick }}</strong>
      </a>

      <ul class="dropdown-menu shadow bg-dark" aria-labelledby="dropdownUser">
        <li>
          <RouterLink class="link-light dropdown-item" :to="`/profile/${id}`"
            >Profile</RouterLink
          >
        </li>
        <li>
          <RouterLink class="link-light dropdown-item" to="/settings/"
            >Settings</RouterLink
          >
        </li>
        <li>
          <hr class="dropdown-divider" />
        </li>

        <li>
          <RouterLink class="link-light dropdown-item" @click="signOut" to="/"
            >sign Out</RouterLink
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router";
import { watch, ref, onMounted } from "vue";
import HomeIcon from "../assets/icons/HomeIcon.vue";
import ArtistIcon from "../assets/icons/ArtistIcon.vue";
import ProfileIcon from "../assets/icons/ProfileIcon.vue";
import LoginIcon from "../assets/icons/LoginIcon.vue";
import Add from "../assets/icons/Add.vue";
import axios from "axios";

const avatarUrl = ref("");
const admin = ref(false);
const logged = ref("");
const nick = ref("");
const id = localStorage.getItem("id");

onMounted(async () => {
  nick.value = localStorage.getItem("nick");
  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;
  if (role == "role_admin") {
    admin.value = true;
  }
  if (localStorage.getItem("token")) {
    logged.value = true;
    await axios
      .get(
        `http://localhost:3910/api/user/avatar/${localStorage.getItem(
          "image"
        )}`,
        {
          headers: {
            Authorization: `${token}`,
          },
          responseType: "arraybuffer",
        }
      )
      .then((res) => {
        const blob = new Blob([res.data], {
          type: res.headers["content-type"],
        });
        const imageUrl = URL.createObjectURL(blob);
        avatarUrl.value = imageUrl;
        console.log(res.data);
      });
  } else {
    logged.value = false;
  }
});

const signOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("nick");
  localStorage.removeItem("id");
  logged.value = false;
};

watch(logged, (newVal) => {
  logged.value = newVal;
});
</script>

<style scoped>
h2 {
  font-size: 1.5em;
}
.dropdown-menu hr {
  background-color: rgb(100, 99, 99);
}

.dropdown {
  bottom: 0;
  width: 50%;
}
.nav-link:hover {
  cursor: pointer;
}

.logo {
  width: 3em;
  height: 3em;
}

.sidebar {
  width: 20%;
  background-color: rgb(26, 27, 27);
  height: 90%;
  position: relative;
}

.link p {
  font-size: 1.6em;
}
.top-nav {
  width: 100%;
}
</style>
