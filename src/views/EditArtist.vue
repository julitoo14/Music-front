<template>
  <div class="container">
    <h1 class="mt-5 text-center">Edit Artist</h1>
    <form class="mt-5" @submit.prevent="submitForm">
      <div class="form-group" v-for="field in fields" :key="field.id">
        <label :for="field.id">{{ field.label }}</label>
        <input
          :type="field.type"
          class="form-control"
          :id="field.id"
          v-model="field.model.value"
          :required="field.required"
        />
      </div>
      <div>
        <label for="file0" class="form-label">Image: </label>
        <input
          name="file0"
          type="file"
          class="form-control"
          @change="handleFileUpload"
        />
        <button
          @click="update(name, description)"
          type="submit"
          class="m-3 btn btn-primary"
        >
          Save
        </button>
        <button class="m-3 btn btn-primary">
          <RouterLink class="nav-link" :to="`/artist/${route.params.id}`"
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
import { useRouter, useRoute } from "vue-router";
import Alert from "../components/Alert.vue";
import { uploadArtistImage, updateArtist, getArtist } from "../composables/apiServices";

const artist = ref("");
const file0 = ref();
const router = useRouter();
const route = useRoute();
const name = ref("");
const description = ref("");
const artistId = route.params.id;
const alert = reactive({
  show: false,
  message: "",
  type: "danger",
});

const fields = [
  { id: "name", label: "Name:", model: name, type: "text", required: true },
  {
    id: "description",
    label: "Description:",
    model: description,
    type: "textarea",
    required: true,
  },
];

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
    try {
      let formData = new FormData();
      formData.append("file0", file0.value);
      await uploadArtistImage(formData, artistId);

      showAlert("Image uploaded succesfully", "info");
    } catch (err) {
      showAlert(err.response.data.message, "danger");
    }
  }
};

const update = async (name, description) => {
  await upload();

  try {
    const res = await updateArtist(artistId, name, description);
    showAlert(res.message, "info");
    router.push(`/artist/${route.params.id}`);
  } catch (err) {
    showAlert(err.message, "danger");
  }
};

const fetchArtist = async () => {
  try {
    const res = await getArtist(artistId);
    artist.value = res.artist;
    name.value = artist.value.name;
    description.value = artist.value.description;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchArtist();
  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;
  if (role != "role_admin") {
    router.push("/");
  }
});
</script>
