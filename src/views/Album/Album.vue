<template>
  <div class="albumView">
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
          <div v-if="admin" class="btn-group">
            <button class="btn-success btn">
              <RouterLink class="nav-link" :to="`/addSong/${albumId}`"
                >Add Song</RouterLink
              >
            </button>
            <button class="btn-primary btn">
              <RouterLink class="nav-link" :to="`/editAlbum/${albumId}`"
                >Edit Album</RouterLink
              >
            </button>
            <button class="btn-danger btn" @click="removeAlbum">Remove</button>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <table v-if="showTable" class="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th class="text-left" scope="col">Name</th>
            <th class="text-left" scope="col">Duration</th>
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
          :track="true"
        />
      </table>
    </div>

    <AddSongToPlaylist
      v-if="showAddPlaylistModal"
      @close="showAddPlaylistModal = false"
      :show="showAddPlaylistModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { router } from "../../routes";
import Song from "../../components/Song.vue";
import AddSongToPlaylist from "../../components/AddSongToPlaylist.vue";
import {getAlbum, getSongsByAlbum, deleteAlbum, deleteSong} from "../../composables/apiServices";

const route = useRoute();
const album = ref("");
const artist = ref("");
const albumImage = ref("");
const songs = ref([]);
const files = ref([]);
const showTable = ref(false);
const admin = ref(false);
const showAddPlaylistModal = ref(false);
const albumId = route.params.id;
const config = {
  headers: {
    Authorization: localStorage.getItem("token"),
  },
};

const showAdd = () => {showAddPlaylistModal.value = true};

const fetchAlbum = async () => {
  try {
    const res = await getAlbum(albumId);
    album.value = res.album;
    artist.value = res.album.artist;
    albumImage.value = `http://localhost:3910/api/album/image/${album.value.image}`;
  } catch (err) {
    console.log(err.response.data.message);
  }
};

const fetchSongs = async () => {
  try {
    //get album songs
    const res = await getSongsByAlbum(albumId);
    songs.value = res.songs;
    //get songs files
    songs.value.forEach(async (song) => {
      files.value.push({
        url: `http://localhost:3910/api/song/file/${song.file}?token=${localStorage.getItem('token')}`,
        name: song.name,
        track: song.track,
        _id: song._id,
        album: song.album,
      });
      if (files.value.length > 0) {showTable.value = true;}
    });
  } catch (err) {
    console.log(err.response.data.message);
  }
};

const removeAlbum = async () => {
  try {
    await deleteAlbum(albumId);
    router.push(`/artist/${artist.value._id}`);
  } catch (err) {
    console.log(err.response.data.message);
  }
};

const removeSong = async (id) => {
  try {
    await deleteSong(id);
    fetchSongs();
  } catch (err) {
    console.log(err.response.data.message);
  }
};

onMounted(() => {
  fetchAlbum();
  fetchSongs();

  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;
  if (role == "role_admin") {
    admin.value = true;
  }
});
</script>

<style scoped>
.text-left {
  text-align: left;
}

th {
  background-color: rgb(32, 31, 31);
  color: white;
  text-align: center;
  font-size: 1.2em;
}
.info {
  color: white;
  background-color: rgba(0, 0, 0, 0.599);
}
.songs {
  color: white;
  background-color: rgba(0, 0, 0, 0.599);
}

.albumView {
  height: 100%;
}
</style>
