<template>
  <div class="artist-container" :style="{ backgroundImage: `url(${image})` }">
    <div class="artist-info">
      <div v-if="admin">
        <button class="btn-success btn">
          <RouterLink class="nav-link" :to="`/createAlbum/${artist._id}`"
            >Create Album</RouterLink
          >
        </button>
        <button class="btn-primary btn">
          <RouterLink class="nav-link" :to="`/editArtist/${artist._id}`"
            >Edit Artist</RouterLink
          >
        </button>
        <button class="btn-danger btn" @click="removeArtist()">
          Remove Artist
        </button>
      </div>
      <h1>{{ artist.name }}</h1>
      <p>{{ artist.description }}</p>
    </div>
    <div class="albums-container row">
      <Album
        class="albums col-lg-3 col-md-6 col-sm-12"
        v-for="album in state.albums"
        :key="album._id"
        :album="album"
        :albumImage="album.image"
      />
    </div>
  </div>
</template>

<style scoped>
.artist-container {
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: repeat-y;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 2em;
}

.albums {
  display: flex;
  align-items: center;
}
.artist-info {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: white;
  width: 100%;
}

.albums-container,
.songs-container {
  margin-top: 50px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  margin-bottom: 5%;
}

.albums-container {
  overflow-x: auto;
  padding: 1em;
  display: flex;
}

h1 {
  font-size: 4rem;
  margin-bottom: 10px;
}

h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}

p {
  font-size: 1.5rem;
  margin-bottom: 20px;
}
</style>

<script setup>
import axios from "axios";
import { ref, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import Album from "../components/Album.vue";

const artist = ref({});
const route = useRoute();
const image = ref({});
const router = useRouter();
const admin = ref(false);

const state = reactive({
  albums: [],
});

const removeArtist = async () => {
  const config = {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  };

  try {
    const response = await axios.delete(
      `http://localhost:3910/api/artist/remove/${artist.value._id}`,
      config
    );
    console.log(response.data.message);
    router.push("/artists");
  } catch (error) {
    console.log(error.response.data.message);
  }
};

const getArtistData = async () => {
  try {
    const artistId = route.params.id;
    const config = {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    };
    const response = await axios.get(
      `http://localhost:3910/api/artist/one/${artistId}`,
      config
    );
    artist.value = response.data.artist;

    const imageResponse = await axios.get(
      `http://localhost:3910/api/artist/image/${artist.value.image}`,
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

    image.value = `data:${imageResponse.headers[
      "content-type"
    ].toLowerCase()};base64,${imageBase64}`;
  } catch (error) {
    console.log(error.response.data.message);
  }
};

const getAlbums = async () => {
  const artistId = route.params.id;
  const config = {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  };
  const response = await axios.get(
    `http://localhost:3910/api/album/list/${artistId}`,
    config
  );
  state.albums = response.data.albums;

  state.albums.forEach(async (album) => {
    axios
      .get(`http://localhost:3910/api/album/image/${album.image}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
        responseType: "arraybuffer",
      })
      .then((res) => {
        const blob = new Blob([res.data], {
          type: res.headers["content-type"],
        });
        const imageUrl = URL.createObjectURL(blob);
        album.image = imageUrl;
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  });
};

onMounted(() => {
  getArtistData();
  getAlbums();
  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;
  if (role == "role_admin") {
    admin.value = true;
  }
});
</script>
