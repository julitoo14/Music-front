<template>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h1 class="text-center mb-4">Create Album</h1>
          <form>
            <div class="form-group">
              <label for="title">Title</label>
              <input
                type="text"
                class="form-control"
                v-model="title"
                id="title"
                placeholder="Enter title"
              />
            </div>
            <div class="form-group">
              <label for="description">Description</label>
              <input
                class="form-control"
                v-model="description"
                id="description"
                placeholder="Enter description"
              >
            </div>
            <div class="form-group">
                <label for="year">Year</label>
                <input
                  class="form-control"
                  v-model="year"
                  id="year"
                  placeholder="Enter year"
                >
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
              @click="saveAlbum"
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
  import { ref, reactive, onMounted } from "vue";
  import Alert from "../../components/Alert.vue";
  import { useRouter, useRoute } from "vue-router";
  
  const title = ref("");
  const year = ref("");
  const description = ref("");
  const image = ref("default.png");
  const router = useRouter();
    const route = useRoute();
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
  
  const saveAlbum = async () => {
    const album = {
        title: title.value,
        description: description.value,
        year: year.value,
        artist: route.params.artistId,
    };
    
    console.log(album);

    try {
      const response = await axios.post(
        "http://localhost:3910/api/album/save",
        album,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
  
      const savedAlbum = response.data.album;
      const id = savedAlbum._id;
  
      if (image.value == "default.png") {
        showAlert("Artist saved successfully!",'info');
        return;
      }
      const imageFormData = new FormData();
      imageFormData.append("file0", image.value);
  
      await axios.put(
        `http://localhost:3910/api/album/upload/${id}`,
        imageFormData,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      showAlert("Album saved successfully!", 'info');
      setTimeout(() => {
        router.push(`/album/${id}`);
      }, 1000);
    } catch (error) {
      console.error(error);
      showAlert("Failed to save artist!");
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
  