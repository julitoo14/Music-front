<template>
  <div class="view" :style="{ flexDirection: logged ? 'block' : 'flex' }">
    <Navbar />
    <RouterView class="main-view"
      @playSong="playSong"
      style="position: relative; overflow-y: auto; width: 100%"
    ></RouterView>
    <Mp3Player :song="songInfo" :files="file" @previous="playPreviousSong" @next="playNextSong" @ended="playNextSong" ></Mp3Player>
  </div>
</template>

<style scoped>

.main-view{
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
import Mp3Player from "./components/Mp3Player.vue";
import { ref, onMounted } from "vue";
const logged = ref(false);
const file = ref("");
const playlist = ref([]);
const currentTrack = ref(0);
const songInfo = ref(null);

onMounted(async () => {
  if (localStorage.getItem("token")) {
    logged.value = true;
  } else {
    logged.value = false;
  }
});

const playSong = async (track, files) => {
  playlist.value = files;
  currentTrack.value = track;
  isPlaying.value = true;
  // Search for song in playlist based on track
  const song = playlist.value.find((song ) => song.track === currentTrack.value);  
  file.value = song.url;
  songInfo.value = song;
};

const playNextSong = () => {
  if (currentTrack.value === playlist.value.length) {
    currentTrack.value = 0;
    file.value = "";
    return;
  }
  currentTrack.value = currentTrack.value + 1;
  const song = playlist.value.find((song) => song.track === currentTrack.value);
  file.value = song.url;
  songInfo.value = song;
};

const playPreviousSong = () => {
  if (currentTrack.value === 1) {
    currentTrack.value = playlist.value.length;
    file.value = "";
    songInfo.value = song;
    return;
  }
  currentTrack.value = currentTrack.value - 1;
  const song = playlist.value.find((song) => song.track === currentTrack.value);
  file.value = song.url;
  songInfo.value = song;
};


</script>
