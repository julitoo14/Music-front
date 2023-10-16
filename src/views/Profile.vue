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
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref, reactive } from "vue";
import Alert from "../components/Alert.vue";
let name = ref("");
let image = ref("");
let nick = ref("");
let email = ref("");
let surname = ref("");
let avatarUrl = ref("");
let showEdit = ref(false);
let file0 = ref();
let alert = reactive({
  show: false,
  message: "",
  type: "danger",
});

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

const update = async (name, surname, nick, email) => {
  const token = localStorage.getItem("token");
  try{
    const res = await axios.put("http://localhost:3910/api/user/update",{ name, surname, nick, email },{headers: {Authorization: `${token}`}})
    showAlert(res.data.message, "info");
  }catch(err){
    showAlert(err.response.data.message, "danger");
  }
}

onMounted(async () => {
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
