<template>
  <div class="container-fluid">
    <div class="top p-4">
      <img class="avatar" :src="avatarUrl" alt="" />
      <div class="info">
        <p>Perfil</p>
        <h1>{{ name }}</h1>
        <h3>{{ nick }} ~ {{ email }}</h3>
      </div>
      <button v-if="!showEdit" @click="showEdit = true" class="btn btn-light">
        Edit
      </button>
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
              <button @click="removePlaylist(playlist._id)" class="btn btn-danger">Remove</button>
            </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <form @submit.prevent v-if="showEdit">
      <div>
        <label for="name" class="form-label">Name</label>
        <input
          v-model="name"
          required
          type="name"
          class="form-control"
          id="name"
          :placeholder="name"
        />
        <div id="nameHelp" class="form-text"></div>
      </div>
      <div class="mb-3">
        <label for="surname" class="form-label">Surname</label>
        <input
          v-model="surname"
          required
          type="surname"
          class="form-control"
          id="surname"
          :placeholder="surname"
        />
      </div>
      <div class="mb-3">
        <label for="nick" class="form-label">Nickname</label>
        <input
          v-model="nick"
          required
          type="text"
          name="nick"
          id="nick"
          class="form-control"
          :placeholder="nick"
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          v-model="email"
          required
          type="email"
          name="email"
          id="email"
          class="form-control"
          :placeholder="email"
        />
      </div>
      <div class="mb-3">
        <label for="file0" class="form-label">Avatar</label>
        <input
          name="file0"
          type="file"
          class="form-control"
          @change="handleFileUpload"
        />
      </div>

      <button
        class="btn btn-light m-1"
        @click="upload(), update(name, surname, nick, email)"
      >
        Update Info
      </button>
      <button class="btn btn-light m-2" @click="showEdit = false">Close</button>
      <Alert
        :type="alert.type"
        :message="alert.message"
        :show="alert.show"
        @close="alert.show = false"
      />
    </form>
    <div class="container-fluid"></div>

    <AddPlaylist
      v-if="showPlaylistModal"
      @close="showPlaylistModal = false"
      :show="showPlaylistModal"
      @update="getPlaylists()"
    />
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref, reactive } from "vue";
import Alert from "../components/Alert.vue";
import AddPlaylist from "../components/AddPlaylist.vue";
const name = ref("");
const image = ref("");
const nick = ref("");
const email = ref("");
const surname = ref("");
const avatarUrl = ref("");
const showEdit = ref(false);
const showPlaylistModal =ref('');
const showTable = ref(false);
const playlists = ref([]);
const file0 = ref();
const alert = reactive({
  show: false,
  message: "",
  type: "danger",
});


const showAddPlaylist = () => {
  showPlaylistModal.value = true;
};



const handleFileUpload = (event) => {
  file0.value = event.target.files[0];
};

const showAlert = (message, type) => {
  alert.show = true;
  alert.message = message;
  alert.type = type;
};

const upload = async () => {
  let formData = new FormData();
  formData.append("file0", file0.value);
  const token = localStorage.getItem("token");
  await axios
    .post("http://localhost:3910/api/user/upload/", formData, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      showAlert("Image uploaded succesfully", "info");
    })
    .catch((err) => {
      showAlert(err.response.data.message, "danger");
    });
};

const getPlaylists = async () => {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  try {
    const res = await axios.get(
      `http://localhost:3910/api/playlist/list/${id}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    playlists.value = res.data.playlists;
  } catch (err) {
    showAlert(err.response.data.message, "danger");
  }
};


const update = async (name, surname, nick, email) => {
  const token = localStorage.getItem("token");
  try{
    const res = await axios.put("http://localhost:3910/api/user/update",{ name, surname, nick, email },{headers: {Authorization: `${token}`}})
    showAlert(res.data.message, "info");
  }catch(err){
    showAlert(err.response.data.message, "danger");
  }
}

const removePlaylist = async (id) => {
  const token = localStorage.getItem("token");
  try{
    const res = await axios.delete(`http://localhost:3910/api/playlist/remove/${id}`,{
      headers: {
        Authorization: `${token}`,
      },
    });
    showAlert(res.data.message, "info");
    getPlaylists();
  }catch(err){
    showAlert(err.response.data.message, "danger");
  }
}

onMounted(async () => {
  await getPlaylists();
  if(playlists.value.length > 0){
  showTable.value = true;
  }
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  await axios
    .get(`http://localhost:3910/api/user/profile/${id}`, {
      headers: {
        Authorization: `${token}`,
      },
    })
    .then((res) => {
      name.value = res.data.user.name;
      image.value = res.data.user.image;
      nick.value = res.data.user.nick;
      email.value = res.data.user.email;
      surname.value = res.data.user.surname;
    })
    .catch((err) => {
      console.log(err.response.data.message);
    });

  await axios
    .get(`http://localhost:3910/api/user/avatar/${image.value}`, {
      headers: {
        Authorization: `${token}`,
      },
      responseType: "arraybuffer",
    })
    .then((res) => {
      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const imageUrl = URL.createObjectURL(blob);
      avatarUrl.value = imageUrl;
    });
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
</style>
