<template>
    <div class="container-fluid ">
        <table v-if=(showTable) class="table table-hover">
          <thead >
            <tr>
              <th style="text-align:left" scope="col">Name</th>
              <th style="text-align:left" scope="col">Duration</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <Song
            @playSong="$emit('playSong', song.track, files)"
            @removeSong="removeSong(song._id)"
            @addSong="showAdd()"
            v-for="song in songs"
            :key="song._id"
            :song="song"
            :track="false"
            :playlistview="true"
          />
          
        </table>
    </div>
</template>

<script setup>
import Song from "../components/Song.vue";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
const songs = ref([]);
const playlistSongs = ref([]);
const route = useRoute();
const showTable = ref(true);
const files = ref([]);

const fetchSongs = async () =>{
    songs.value = [];
    try{
        const response = await axios.get(`http://localhost:3910/api/playlist/songlist/${route.params.id}`,{
            headers: {
                Authorization: `${localStorage.getItem("token")}`,
            },
        });
        playlistSongs.value = response.data.songs;
        playlistSongs.value.forEach(async song => {

          const res = await axios.get(`http://localhost:3910/api/song/one/${song}`,{
            headers: {
                Authorization: `${localStorage.getItem("token")}`,
            },
          });

          song = res.data.song;
          console.log(song)

          const fileUrl = `http://localhost:3910/api/song/file/${song.file}?token=${localStorage.getItem("token")}`;
          songs.value.push(song);
          files.value.push({ url: fileUrl, name: song.name, track: song.track });
          if(files.value.length > 0){
            showTable.value = true;
          }
        });
    }catch(error){
        console.log(error);
    }
}

const removeSong = async (id) => {
    try{
        const response = await axios.delete(`http://localhost:3910/api/playlist/removeSong/${id}`,{
            headers: {
                Authorization: `${localStorage.getItem("token")}`,
            },
        });
        console.log(response.data.message);
        fetchSongs();
    }catch(error){
        alert(error);
    }
}

onMounted(() => {
    fetchSongs();
});


</script>