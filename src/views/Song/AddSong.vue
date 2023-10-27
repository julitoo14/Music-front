<template>
  <div class="container">
    <h1 class="my-4">Add Song</h1>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="name" class="form-label">Name:</label>
        <input
          type="text"
          id="name"
          v-model="name"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="track" class="form-label">Track:</label>
        <input
          type="text"
          id="track"
          v-model="track"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="duration" class="form-label">Duration:</label>
        <input
          type="text"
          id="duration"
          v-model="duration"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="file0" class="form-label">File: </label>
        <input
          name="file0"
          type="file"
          class="form-control"
          @change="onFileChange"
        />
      </div>
      <button
        @click="saveSong(track, name, duration)"
        type="submit"
        class="m-3 btn btn-primary"
      >
        Save
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
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Alert from "../../components/Alert.vue";

const route = useRoute();
const router = useRouter();
const name = ref("");
const track = ref("");
const duration = ref("");
const file = ref(null);

const alert = reactive({
  show: false,
  message: "",
  type: "danger",
});

const showAlert = (message, type) => {
  alert.show = true;
  alert.message = message;
  alert.type = type;
};

const onFileChange = (event) => {
  file.value = event.target.files[0];
};

// Fetch song data from API when component is mounted
const saveSong = async () => {
  const song = {
    name: name.value,
    duration: duration.value,
    track: track.value,
    album: route.params.albumId,
  };

  console.log(song);
  try {
    const response = await axios.post(
      "http://localhost:3910/api/song/save",
      song,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    );

    const savedSong = response.data.savedSong;
    console.log(savedSong);
    const id = savedSong._id;
    console.log(savedSong._id);

    if (!file.value) {
      showAlert("Song saved successfully!", "info");
      return;
    }
    const audioFormData = new FormData();
    audioFormData.append("file0", file.value);

    await axios.put(
      `http://localhost:3910/api/song/upload/${id}`,
      audioFormData,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    showAlert("Song saved successfully!", "info");
  } catch (error) {
    console.error(error);
    showAlert("Failed to save artist!");
  }
};
</script>
