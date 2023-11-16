<template>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h1 class="text-center mb-4">Create Album</h1>
          <form>
            <div class="form-group" v-for="field in fields" :key="field.id">
              <label :for="field.id">{{ field.label }}</label>
              <input
                class="form-control"
                v-model="field.model.value"
                :id="field.id"
                :placeholder="field.placeholder"
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
              @click="addAlbum"
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
  import Alert from "../../components/Alert.vue";
  import { useRouter, useRoute } from "vue-router";
  import { saveAlbum, uploadAlbumImage } from "../../composables/apiServices";
  
  const title = ref("");
  const year = ref("");
  const description = ref("");
  const image = ref("default.png");
  const router = useRouter();
  const route = useRoute();
  const fields = [
      { id: 'title', label: 'Title', model: title, placeholder: 'Enter title' },
      { id: 'description', label: 'Description', model: description, placeholder: 'Enter description' },
      { id: 'year', label: 'Year', model: year, placeholder: 'Enter year' },
    ];
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
  
  const addAlbum = async () => {
    const album = {
        title: title.value,
        description: description.value,
        year: year.value,
        artist: route.params.artistId,
    };

    try {
      const res = await saveAlbum(album);
  
      const savedAlbum = res.album;
      const id = savedAlbum._id;
  
      if (image.value == "default.png") {
        router.push(`/album/${id}`);
        return;
      }

      const imageFormData = new FormData();
      imageFormData.append("file0", image.value);
      await uploadAlbumImage(imageFormData, id); 
      router.push(`/album/${id}`);

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
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    .container{
      margin-top: 4em;
    }
  }
  </style>
  