<template>
  <div class="container">
    <h1>Edit Song</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="track">Track:</label>
        <input
          type="text"
          class="form-control"
          id="track"
          v-model="track"
          required
        />
      </div>
      <div class="form-group">
        <label for="duration">Duration:</label>
        <input
          type="text"
          class="form-control"
          id="duration"
          v-model="duration"
          required
        />
      </div>
      <div class="form-group">
        <label for="name">Name:</label>
        <input
          type="text"
          class="form-control"
          id="name"
          v-model="name"
          required
        />
      </div>
      <div class="form-group">
        <label for="file0">File:</label>
        <input
          type="file"
          class="form-control"
          name="file0"
          @change="onFileChange"
        />
      </div>
      <button @click="update" type="submit" class="btn btn-primary">
        Save
      </button>
      <button class="btn btn-danger">
        <RouterLink class="nav-link" to="/">Back</RouterLink>
      </button>
    </form>

    <Alert
      :type="alert.type"
      :message="alert.message"
      :show="alert.show"
      @close="alert.show = false"
    />
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import Alert from "../../components/Alert.vue";

const track = ref();
const name = ref();
const duration = ref();
const route = useRoute();
const file = ref();
const albumId = ref();
const alert = reactive({
  show: false,
  message: "",
  type: "danger",
});
const config = {
  headers: {
    Authorization: `${localStorage.getItem("token")}`,
  },
};

const onFileChange = (e) => {
  file.value = e.target.files[0];
};

const showAlert = (message, type) => {
  alert.show = true;
  alert.message = message;
  alert.type = type;
};

const fetchSong = async () => {
  const response = await axios.get(
    `http://localhost:3910/api/song/one/${route.params.id}`,
    config
  );
  track.value = response.data.song.track;
  name.value = response.data.song.name;
  duration.value = response.data.song.duration;
  albumId.value = response.data.song.album._id;
};

const upload = async () => {
  if (file.value) {
    const audioFormData = new FormData();
    audioFormData.append("file0", file.value);

    try {
      await axios.put(
        `http://localhost:3910/api/song/upload/${route.params.id}`,
        audioFormData,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (err) {
      showAlert(err.response.data.message, "danger");
    }
  }
};

const update = async () => {
    if (file.value) {
    const audioFormData = new FormData();
    audioFormData.append("file0", file.value);

    try {
      await axios.put(
        `http://localhost:3910/api/song/upload/${route.params.id}`,
        audioFormData,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (err) {
      showAlert(err.response.data.message, "danger");
      return;
    }
  }

  const song = {
    track: track.value,
    name: name.value,
    duration: duration.value,
    album: albumId.value,
  };
  try {
    const response = await axios.put(
      `http://localhost:3910/api/song/update/${route.params.id}`,
      song,
      config
    );
    showAlert("Song updated successfully!", "info");
  } catch (err) {
    showAlert(err.response.data.message, "danger");
  }
};

onMounted( () => {
  fetchSong();
  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;
  if (role != "role_admin") {
    router.push("/");
  }
});
</script>
