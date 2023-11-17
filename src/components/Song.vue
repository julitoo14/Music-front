<template>
  <tbody>
    <tr class="song" @click="$emit('playSong')">
      <th v-if="props.track">{{ song.track }}</th>
      <td style="font-size: 1.5em; text-align:left">{{ song.name }}</td>
      <td v-if="!isMobile" style="font-size: 1.1em; text-align:left">{{ song.duration }}</td>
      <td>
        <div class="btn-group" v-if="playlistview ">
          <button v-if="isMobile" class="btn btn-success" @click="$emit('playSong')">play</button>
          <button class="btn btn-danger" @click="$emit('removeSong')">Delete</button>
        </div>
        <div v-else-if="admin" class="btn-group">
          <button v-if="!isMobile" class="btn btn-success" @click="$emit('playSong')">play</button>
        <AddIcon  @click="$emit('addSong',selectSong())" /> 
          <RouterLink class="nav-link" :to="`/editSong/${song._id}`"
            > <Pencil></Pencil> </RouterLink
          >
        
        <Delete  @click="$emit('removeSong')">
          Delete
        </Delete>
      </div>
      <div v-else class="btn-group">
        <AddIcon @click="$emit('addSong', selectSong())">+</AddIcon>
      </div>
      </td>
    </tr>
  </tbody>
  
</template>
<style scoped>
  
.song{
  cursor: pointer;
}

  td{
    background-color: black;
    color: white;
    text-align: center;
    border: none;
  }

  th{
    background-color: rgb(0, 0, 0);
    color: white;
    text-align: center;
    font-size: 1.6em;
    border: none;
  }

  tr:hover td, tr:hover th {
    background-color: rgb(42, 41, 41);
  }


</style>


<script setup>
import { onMounted, ref } from "vue";
import AddIcon from "../assets/icons/AddIcon.vue";
import Pencil from "../assets/icons/Pencil.vue";
import Delete from "../assets/icons/Delete.vue";
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
  isMobile: {
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


