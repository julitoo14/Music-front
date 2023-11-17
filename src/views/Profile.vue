<template>
  <div class="container-fluid">
    <div class="top p-4">
      <img class="avatar" :src="avatarUrl" alt="" />
      <div class="info">
        <p>Perfil</p>
        <h1>{{ user.name }}</h1>
        <h3>{{ user.nick }} ~ {{ user.email }}</h3>
      </div>
      <button class="btn btn-light" @click="showAddPlaylist">
        Add Playlist
      </button>
    </div>

    <div class="container-fluid ">
      <table v-if=(showTable) class="table table-hover">
        <thead >
          <tr>
            <th scope="col">Playlist Name</th>
            <th scope="col">Number of Songs</th>
            <th scope="col">options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="playlist in playlists" :key="playlist._id">
            <td>{{ playlist.name }}</td>
            <td>{{ playlist.songs.length }}</td>
            <td><div class="btn-group">
              <button class="btn btn-primary"><RouterLink class="nav-link" :to="`/playlist/${playlist._id}`">Visit</RouterLink></button>
              <button @click="showDeleteModal = true, playlistToDelete = playlist._id" class="btn btn-danger">Remove</button>
            </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <AddPlaylist
      v-if="showPlaylistModal"
      @close="showPlaylistModal = false"
      :show="showPlaylistModal"
      @update="fetchPlaylists()"
      class="add-playlist-modal"
    />
    <DeleteModal
    v-if="showDeleteModal"
    @close="showDeleteModal = false"
    :show="showDeleteModal"
    @delete="removePlaylist(playlistToDelete), showDeleteModal = false"
    ></DeleteModal>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { useRoute} from "vue-router";
import AddPlaylist from "../components/AddPlaylist.vue";
import { deletePlaylist, getPlaylistsByUser, getUserProfile } from "../composables/apiServices";
import DeleteModal from "../components/DeleteModal.vue";
import { API_BASE_URL } from "../../config";
const route = useRoute();
const id = route.params.id;
const user = ref({});
const avatarUrl = ref("");
const showPlaylistModal =ref('');
const showDeleteModal = ref(false);
const playlistToDelete = ref("");
const showTable = ref(false);
const playlists = ref([]);
const alert = reactive({
  show: false,
  message: "",
  type: "danger",
});


const fetchUser = async () => {
  try{
    const res = await getUserProfile(id);
    user.value = res.user;
    avatarUrl.value = `${API_BASE_URL}/user/avatar/${user.value.image}`;
  }catch(err){
    console.log(err.message);
  }
}


const showAddPlaylist = () => {
  showPlaylistModal.value = true;
};


const showAlert = (message, type) => {
  alert.show = true;
  alert.message = message;
  alert.type = type;
};

const fetchPlaylists = async () => {
  try {
    const res = await getPlaylistsByUser(id);
    playlists.value = res.playlists;
  } catch (err) {
    showAlert(err.message, "danger");
  }
};

const removePlaylist = async (id) => {
  try{
    await deletePlaylist(id);
    await fetchPlaylists();
  }catch(err){
    console.log(err, "danger");
  }
}

onMounted(async () => {
  await fetchPlaylists();
  await fetchUser();
  if(playlists.value.length > 0){
  showTable.value = true;
  }
});
</script>

<style scoped>
div{
  cursor: default;
}

.table td{
  background-color: black;
  color: white;
  border: black solid 1px;
}

.table{
  border: none;
  color: white;
}

.table th{
  background-color: rgb(25, 24, 24);
  color: white;
  border: black solid 1px;
}


.avatar {
  width: 12em;
  height: 12em;
  border-radius: 50%;
}

form {
  width: 60%;
  margin: auto;
}

button {
  height: 2em;
  text-align: center;
}

.top {
  display: flex;
  width: 100%;
  justify-content: space-evenly;
}

.top h1 {
  font-size: 6em;
}

.info {
  width: 75%;
}

@media (max-width: 768px) {
  .avatar{
    width: 8em;
    height: 8em;
  }

  .top h1 {
    font-size: 3em;
  }

  .top h3{
    font-size: 1em;
  }
}

@media (max-width: 1000px) {
  .top{
    margin-top: 4em;
  }

  .add-playlist-modal{
    margin-top: 4em;
  }

}
  
</style>
