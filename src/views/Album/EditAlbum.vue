<template>
  <div class="container">
    <h1 class="mt-5 text-center">Edit Artist</h1>
    <form class="mt-5" @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Title:</label>
        <input
          type="text"
          class="form-control"
          id="name"
          v-model="album.title"
          required
        />
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <input
          type="text"
          class="form-control"
          id="description"
          v-model="album.description"
        />
        <label for="description">Year:</label>
        <input
          type="text"
          class="form-control"
          id="year"
          v-model="album.year"
        />
        <label for="file0" class="form-label">Image: </label>
        <input
          name="file0"
          type="file"
          class="form-control"
          @change="handleFileUpload"
        />
        <button
          @click="update(album.title, album.description, album.year)"
          type="submit"
          class="m-3 btn btn-primary"
        >
          Edit
        </button>
        <button class="m-3 btn btn-primary">
          <RouterLink class="nav-link" :to="`/album/${route.params.id}`"
            >Back</RouterLink
          >
        </button>
      </div>
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
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import Alert from "../../components/Alert.vue";

const album = ref("");
const file0 = ref();
const router = useRouter();
const route = useRoute();
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

const handleFileUpload = (event) => {
  file0.value = event.target.files[0];
};

const upload = async () => {
  if (file0.value) {
    console.log(file0.value);
    let formData = new FormData();
    formData.append("file0", file0.value);
    const token = localStorage.getItem("token");
    await axios
      .put(
        `http://localhost:3910/api/album/upload/${route.params.id}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        showAlert("Image uploaded succesfully", "info");
      })
      .catch((err) => {
        showAlert(err.response.data.message, "danger");
      });
  }
};

const update = async (title, description, year) => {
  upload();
  const token = localStorage.getItem("token");
  try {
    const res = await axios.put(
      `http://localhost:3910/api/album/update/${route.params.id}`,
      { title, description, year },
      { headers: { Authorization: `${token}` } }
    );
    console.log(res.data);
    showAlert("Album editado correctamente", "info");
    setTimeout(() => {
      router.push(`/album/${route.params.id}`);
    }, 2000);
  } catch (err) {
    showAlert(err.response.data.message, "danger");
  }
};

const fetchAlbum = async () => {
  const config = {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  };
  try {
    const response = await axios.get(
      `http://localhost:3910/api/album/one/${route.params.id}`,
      config
    );
    album.value = response.data.album;
    console.log(album.value);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchAlbum();
  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;
  if (role != "role_admin") {
    router.push("/");
  }
});
</script>
