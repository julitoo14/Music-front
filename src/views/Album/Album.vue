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
              <RouterLink class="nav-link" :to="`/addSong/${id}`"
                >Add Song</RouterLink
              >
            </button>
            <button class="btn-primary btn">
              <RouterLink class="nav-link" :to="`/editAlbum/${id}`"
                >Edit Album</RouterLink
              >
            </button>
            <button class="btn-danger btn" @click="removeAlbum">Remove</button>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid ">
      <table v-if=(showTable) class="table table-hover">
        <thead >
          <tr>
            <th scope="col">#</th>
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
          :track="true"
        />
        
      </table>
    </div>

    <AddSongToPlaylist
      v-if="showAddPlaylistModal"
      @close="showAddPlaylistModal = false"
      :show="showAddPlaylistModal"
      @update="getPlaylists()"
    />
    
  </div>
</template>

<style scoped>

th{
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
  height: 90%;
}
</style>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { router } from "../../routes";
import Song from "../../components/Song.vue";
import AddSongToPlaylist from "../../components/AddSongToPlaylist.vue";

const album = ref("");
const artist = ref("");
const albumImage = ref("");
const songs = ref([]);
const files = ref([]);
const showTable = ref(false);
const admin = ref(false);
const songId = ref("");
const showAddPlaylistModal = ref(false);
const route = useRoute();
const id = ref(route.params.id);
const config = {
  headers: {
    Authorization: localStorage.getItem("token"),
  },
};

const showAdd = () => {
  showAddPlaylistModal.value = true;
};

const getSongId = (song) => {
  songId.value = song;
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

    songs.value = response.data.songs;

    songs.value.forEach(async (song) => {
      const res = await axios.get(
        `http://localhost:3910/api/song/file/${song.file}`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([res.data], {
        type: res.headers["content-type"],
      });

      const fileUrl = URL.createObjectURL(blob);

      files.value.push({ url: fileUrl, name: song.name, track: song.track });
      if(files.value.length > 0){
        showTable.value = true;
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const removeAlbum = async () => {
  try {
    await axios.delete(
      `http://localhost:3910/api/album/remove/${route.params.id}`,
      config
    );
    router.push(`/artist/${artist.value._id}`);
  } catch (err) {
    console.log(err.response.message);
  }
};

const removeSong = async (id) => {
  try {
    await axios.delete(`http://localhost:3910/api/song/remove/${id}`, config);
    fetchSongs();
  } catch (err) {
    console.log(err.response.message);
  }
};

onMounted(() => {
  fetchAlbum();
  fetchSongs();

  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;
  console.log(role);
  if (role == "role_admin") {
    admin.value = true;
  }
});
</script>
