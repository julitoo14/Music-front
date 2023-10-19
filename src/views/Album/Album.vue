<template>
  <div class="">
    <div class="container-fluid">
      <div class="row info p-3">
        <div class="col-md-3">
          <img :src="albumImage" alt="Album Cover" class="img-fluid rounded" />
        </div>
        <div class="col-md-9">
          <h1>{{ album.title }}</h1>
          <h2>{{ artist.name }}</h2>
          <p>{{ album.description }}</p>
          <p>Year: {{ album.year }}</p>
          <div class="btn-group">
            <button class="btn-success btn" ><RouterLink class="nav-link" :to="`/addSong/${id}`" >Add Song</RouterLink></button>
            <button class="btn-primary btn"><RouterLink class="nav-link" :to="`/editAlbum/${id}`">Edit Album</RouterLink></button>
            <button class="btn-danger btn" @click="removeAlbum">Remove</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="songs container-fluid">
      <h2 class="mt-5">Songs</h2>
      <div class="row">
        <div class="col-md-12">
          <Song v-for="song in songs" :key="song._id" :song="song" />
        </div>
      </div>
    </div>
  </div>
  </template>

<style scoped>
.info {
  color: white;
  background-color: rgba(0, 0, 0, 0.599);
}
.songs {
  color: white;
  background-color: rgba(0, 0, 0, 0.599);
}
</style>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { router } from "../../routes";
import Song from "../../components/Song.vue";

const album = ref("");
const artist = ref("");
const albumImage = ref("");
const songs = ref([]);

const route = useRoute();
const id = ref(route.params.id);
const config = {
  headers: {
    Authorization: localStorage.getItem("token"),
  },
};

const fetchAlbum = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3910/api/album/one/${route.params.id}`,
      config
    );
    album.value = response.data.album;
    artist.value = response.data.album.artist;

    const imageResponse = await axios.get(
      `http://localhost:3910/api/album/image/${album.value.image}`,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
        responseType: "arraybuffer",
      }
    );

    const imageBase64 = btoa(
      new Uint8Array(imageResponse.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );

    albumImage.value = `data:${imageResponse.headers[
      "content-type"
    ].toLowerCase()};base64,${imageBase64}`;
  } catch (err) {
    console.log(err.response.message);
  }
};

const fetchSongs = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3910/api/song/listByAlbum/${route.params.id}`,
      config
    );
    console.log(response.data.songs)
    songs.value = response.data.songs;
  } catch (err) {
    console.log(err.response.message);
  }
};


const removeAlbum = async () => {
  try {
    await axios.delete(
      `http://localhost:3910/api/album/remove/${route.params.id}`,
      config
    );
    router.push(`/artist/${artist.value._id}`)
  } catch (err) {
    console.log(err.response.message);
  }
};

onMounted(() => {
  fetchAlbum();
  fetchSongs();
  
});
</script>
