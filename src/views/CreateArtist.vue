<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="text-center mb-4">Create Artist</h1>
        <form>
          <div class="form-group">
            <label for="name">Name</label>
            <input
              type="text"
              class="form-control"
              v-model="name"
              id="name"
              placeholder="Enter name"
            />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              class="form-control"
              v-model="description"
              id="description"
              placeholder="Enter description"
            ></textarea>
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
            @click="saveArtist"
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
import axios from "axios";
import { ref, reactive } from "vue";
import Alert from "../components/Alert.vue";
import { useRouter } from "vue-router";

const name = ref("");
const description = ref("");
const image = ref("default.png");
const router = useRouter();
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

const saveArtist = async () => {
  const artist = {
    name: name.value,
    description: description.value,
  };

  try {
    const response = await axios.post(
      "http://localhost:3910/api/artist/save",
      artist,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    );

    const savedArtist = response.data.artist;
    const artistId = savedArtist._id;

    if (image.value == "default.png") {
      showAlert("Artist saved successfully!",'info');
      return;
    }
    const imageFormData = new FormData();
    imageFormData.append("file0", image.value);

    await axios.post(
      `http://localhost:3910/api/artist/upload/${artistId}`,
      imageFormData,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    showAlert("Artist saved successfully!", 'info');
    setTimeout(() => {
      router.push(`/artist/`);
    }, 2000);
  } catch (error) {
    console.error(error);
    showAlert("Failed to save artist!");
  }
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1.5rem;
}
form{
    margin-bottom: 3em;
}
</style>
