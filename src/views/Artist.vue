<template>
  <div class="container-fluid page">
    
    <div class="artist-container" >
      <div class="artist-info " >
        <div class="name-img ">
          <img class="artist-image " :src="image">
          <h1 class="">{{ artist.name }}</h1>
        </div>
        <div>
          <p class="description">{{ artist.description }}</p>
          
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
            <button class="btn-danger btn" @click="showDeleteModal = true">
              Remove Artist
            </button>
          </div>
        </div>
      </div>
      <div class="albums">
        <Album
        class="album"
        v-for="album in albums"
        :key="album._id"
        :album="album"
        :albumImage="`https://juliangarciasuarez.tech/api/album/image/${album.image}`"
        />
      </div>
    </div>
  </div>
  <DeleteModal
  v-if="showDeleteModal"
  @close="showDeleteModal = false"
  :show="showDeleteModal"
  @delete="removeArtist(artistId), showDeleteModal = false"
  ></DeleteModal>
  </template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Album from "../components/Album.vue";
import { deleteArtist, getArtist, getAlbumsByArtist } from "../composables/apiServices";
import DeleteModal from "../components/DeleteModal.vue";
import { API_BASE_URL } from "../../config";

const router = useRouter();
const route = useRoute();
const admin = ref(false);
const artistId = route.params.id;
const artist = ref({});
const image = ref("");
const albums = ref([]);
const showDeleteModal = ref(false);


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
    image.value = `${API_BASE_URL}/artist/image/${artist.value.image}`;
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

.page{
  height: min-content;
}

.artist-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.artist-info {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
  text-align:justify;
  color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
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

.albums{
  display: flex;
  flex-direction: row;
  padding: 1em;
  width: 100%;
}

.album{
  background-color: rgba(0, 0, 0, 0.729);
}

.album:hover{
  background-color: rgb(46, 45, 45);
}


h1 {
  font-size: 4rem;
  margin-bottom: 10px;
}

h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.description {
  font-size: 1.3rem;
  margin-bottom: 20px;
  height: 9em;
  overflow-x: auto;
}



@media (max-width: 768px) {

  .description{
    font-size: 1rem;
    height: 10em;
    overflow: scroll;
  }
  .artist-container {
    padding: 10px;
    margin-bottom: 5em;
  }

  .artist-info {
    flex-direction: column;
    text-align: center;
  }

  .name-img {
    gap: 0.3em;
    margin: auto;
  }

  .artist-image {
    width: 200px;
    height: 200px;
  }


  .albums{
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    width: 20em;
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
