<template>
  <tbody>
    <tr>
      <th v-if="props.track">{{ song.track }}</th>
      <td style="font-size: 1.5em; text-align:left">{{ song.name }}</td>
      <td style="font-size: 1.1em; text-align:left">{{ song.duration }}</td>
      <td>
        <div class="btn-group" v-if="playlistview ">
          <button class="btn btn-success" @click="$emit('playSong')">play</button>
          <button class="btn btn-danger" @click="$emit('removeSong')">Delete</button>
        </div>
        <div v-else-if="admin" class="btn-group">
          <button class="btn btn-success" @click="$emit('playSong')">play</button>
        <button class="btn btn-primary" @click="$emit('addSong',selectSong())">+</button>
        <button class="btn btn-info">
          <RouterLink class="nav-link" :to="`/editSong/${song._id}`"
            >Edit</RouterLink
          >
        </button>
        <button class="btn btn-danger" @click="$emit('removeSong')">
          Delete
        </button>
      </div>
      <div v-else class="btn-group">
        <button class="btn btn-success" @click="$emit('playSong')">play</button>
        <button class="btn btn-primary" @click="$emit('addSong', selectSong())">+</button>
      </div>
      </td>
    </tr>
  </tbody>
  
</template>
<style scoped>
  

  td{
    background-color: black;
    color: white;
    border: black solid 1px;
    text-align: center;
  }

  th{
    background-color: rgb(0, 0, 0);
    color: white;
    border: black solid 1px;
    text-align: center;
    font-size: 1.6em;
  }

</style>


<script setup>
import { onMounted, ref } from "vue";
const admin = ref(false);
const props = defineProps({
  song: {
    type: Object,
    required: true,
  },
  track: {
    type: Boolean,
    default: true,
  },
  playlistview: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["removeSong", "playSong", "getSongId", "addSong"]);

const selectSong = () => {
  localStorage.setItem('songId', props.song._id) 
};

onMounted(() => {
  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;
  if (role == "role_admin") {
    admin.value = true;
  }
});
</script>


