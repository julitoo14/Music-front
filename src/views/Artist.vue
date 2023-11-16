<template>
  <div class="artist-container" >
    <div class="artist-info row" >
      <div class="name-img row">
        <img class="artist-image col-sm-12  " :src="image">
        <h1 class="col-12">{{ artist.name }}</h1>
      </div>
      <div>
        <p style="overflow-y: auto">{{ artist.description }}</p>

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
      </div>
    </div>
    <div class="albums-container row">
      <Album
        class="albums col-lg-3 col-md-6 col-sm-12"
        v-for="album in albums"
        :key="album._id"
        :album="album"
        :albumImage="`http://localhost:3910/api/album/image/${album.image}`"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Album from "../components/Album.vue";
import { deleteArtist, getArtist, getAlbumsByArtist } from "../composables/apiServices";

const router = useRouter();
const route = useRoute();
const admin = ref(false);
const artistId = route.params.id;
const artist = ref({});
const image = ref("");
const albums = ref([]);

const removeArtist = async () => {
  try {
    const res = await deleteArtist(artist.value._id)
    router.push("/artists");
  } catch (error) {
    console.log(error.response.data.message);
  }
};

const getArtistData = async () => {
  try {
    
    const res = await getArtist(artistId);
    artist.value = res.artist;
    image.value = `http://localhost:3910/api/artist/image/${artist.value.image}`;
  } catch (error) {
    console.log(error.response.data.message);
  }
};

const getAlbums = async () => {
  try{
    const res = await getAlbumsByArtist(artistId);
    albums.value = res.albums;
  }catch(error){
    console.log(error.response.data.message);
  }
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


<style scoped>
.artist-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-bottom: 10vh;
}

.albums {
  display: flex;
  align-items: center;
  justify-content: center;
}
.artist-info {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
  text-align:justify;
  color: white;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.artist-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 20px;
  margin: auto;
}

.name-img{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 20px;  
}

.albums-container {
  margin-top: 20px;
  margin-bottom: 70px;
  width: 100%;
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


@media (max-width: 768px) {
  .artist-container {
    padding: 10px;
    margin-bottom: 10%;
  }

  .artist-info {
    flex-direction: column;
    text-align: center;
  }

  .name-img {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .artist-image {
    width: 200px;
    height: 200px;
  }

  .albums-container {
    margin-top: 10px;
    margin-bottom: 50px;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1rem;
  }

  p {
    font-size: 1rem;
  }
}
</style>
