<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="text-center mb-4">Create Artist</h1>
        <form>
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
          <div class="form-group">
            <div class="custom-file">
              <input
                type="file"
                class="custom-file-input"
                @change="onFileChange"
                id="image"
              />
            </div>
          </div>
          <button
            type="button"
            class="btn btn-primary btn-block mt-4"
            @click="addArtist"
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
    </div>
  </div>
</template>

<script setup>

import { ref, reactive, onMounted } from "vue";
import Alert from "../components/Alert.vue";
import { useRouter } from "vue-router";
import { saveArtist, uploadArtistImage } from "../composables/apiServices.js";

const name = ref("");
const description = ref("");
const image = ref("default.png");
const router = useRouter();
const fields = [
  { id: "name", label: "Name:", model: name, type: "text", required: true },
  { id: "description", label: "Description:", model: description, type: "textarea", required: true },
]
let alert = reactive({
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
  image.value = event.target.files[0];
};

const addArtist = async () => {
  const artist = {
    name: name.value,
    description: description.value,
  };

  try {
    const res = await saveArtist(artist);
    const savedArtist = res.artist;
    const artistId = savedArtist._id;

    if (image.value == "default.png") {
      showAlert("Artist saved successfully!",'info');
      return;
    }
    const imageFormData = new FormData();
    imageFormData.append("file0", image.value);
    await uploadArtistImage(imageFormData, artistId);
    showAlert("Artist saved successfully!", 'info');
    router.push(`/artist/${artistId}`);
  } catch (error) {
    console.error(error);
    showAlert(error.message, 'danger');
  }
};

onMounted( () => {
  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;
  if (role != "role_admin") {
    router.push("/");
  }
});
</script>

<style scoped>
.form-group {
  margin-bottom: 1.5rem;
}
form{
    margin-bottom: 3em;
}
</style>
