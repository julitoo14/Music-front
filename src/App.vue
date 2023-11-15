<template>
  <div class="view" :style="{ flexDirection: logged ? 'block' : 'flex' }">
    <Navbar v-if="isMobile"></Navbar>
    <Sidebar v-else></Sidebar>
    <RouterView
      class="main-view"
      @playSong="playSong"
      style="position: relative; overflow-y: auto; width: 100%"
    ></RouterView>
    <Mp3Player
      :song="songInfo"
      :files="file"
      @previous="playPreviousSong"
      @next="playNextSong"
      @ended="playNextSong"
    ></Mp3Player>
  </div>
</template>

<style scoped>
.main-view {
  padding-bottom: 5%;
}

.view {
  background: linear-gradient(
    180deg,
    rgba(12, 12, 12, 1) 0%,
    rgba(37, 37, 38, 1) 53%,
    rgba(54, 55, 55, 1) 86%
  );
  width: 100%;
  height: 100vh;
  display: flex;
}
</style>

<script setup>
import { RouterView } from "vue-router";
import { isPlaying } from "./composables/useAudioPlayer.js";
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";
import Mp3Player from "./components/Mp3Player.vue";
import { ref, onMounted, watchEffect } from "vue";
const logged = ref(false);
const file = ref("");
const playlist = ref([]);
const currentIndex = ref(0);
const songInfo = ref(null);

const isMobile = ref(window.innerWidth < 768);

const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  window.addEventListener('resize', updateIsMobile);
  if (localStorage.getItem("token")) {
    logged.value = true;
  } else {
    logged.value = false;
  }
});

const playSong = async (id, files) => {
  playlist.value = files;
  isPlaying.value = true;

  // Search for song in playlist based on id and get its index
  const songIndex = playlist.value.findIndex((song) => song._id === id);
  if (songIndex !== -1) {
    currentIndex.value = songIndex;
    const song = playlist.value[songIndex];
    file.value = song.file;
    songInfo.value = song;
  }
};

const isLastSong = () => {
  if (currentIndex.value === playlist.value.length - 1) {
    currentIndex.value = 0;
    const song = playlist.value[currentIndex.value];
    file.value = song.file;
    songInfo.value = song;
    return true;
  }
};

const isFirstSong = () => {
  if (currentIndex.value === 0) {
    currentIndex.value = playlist.value.length - 1;
    const song = playlist.value[currentIndex.value];
    file.value = song.file;
    songInfo.value = song;
    return true;
  }
};

const playNextSong = () => {
  isPlaying.value = true;
  if (isLastSong()) {return;}
  currentIndex.value = currentIndex.value + 1;
  const song = playlist.value[currentIndex.value];
  file.value = song.file;
  songInfo.value = song;
};

const playPreviousSong = () => {
  if (isFirstSong()) {return;}
  currentIndex.value = currentIndex.value - 1;
  const song = playlist.value[currentIndex.value];
  file.value = song.file;
  songInfo.value = song;
};
</script>
