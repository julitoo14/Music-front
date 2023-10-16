<template>
  <form v-on:submit.prevent="onSubmit" class="mt-5">
    <h1 class="text-center">Create your account!</h1>
    <div class="mb-3">
      <label for="name" class="form-label">Name</label>
      <input
        v-model="name"
        required
        type="name"
        class="form-control"
        id="name"
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
      />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input
        v-model="password"
        required
        type="password"
        class="form-control"
        id="password"
      />
    </div>
    <div class="mb-3">
      <label for="confirmPassword" class="form-label">Confirm Password</label>
      <input
        v-model="confirmPassword"
        required
        type="password"
        class="form-control"
        id="confirmPassword"
      />
    </div>
    <button
      @click="register(name, surname, nick, email, password, confirmPassword)"
      class="mt-3 mb-5 btn btn-lg btn-primary"
    >
      Register
    </button>
    <Alert
      :type="alert.type"
      :message="alert.message"
      :show="alert.show"
      @close="alert.show = false"
    />
  </form>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import Alert from "../components/Alert.vue";
import { reactive } from "vue";
import { useRouter } from "vue-router";
const name = ref("");
const surname = ref("");
const nick = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const router = useRouter();
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

const register = async (
  name,
  surname,
  nick,
  email,
  password,
  confirmPassword
) => {
  if (
    name != "" &&
    surname != "" &&
    nick != "" &&
    email != "" &&
    password != "" &&
    confirmPassword != ""
  ) {
    if (password != confirmPassword) {
      showAlert("Passwords do not match", "danger");
      return false;
    }

    const res = await axios
      .post("http://localhost:3910/api/user/register/", {
        name: name,
        nick: nick.toLowerCase(),
        password: password,
        email: email.toLowerCase(),
        surname: surname,
      })
      .then((res) => {
        showAlert(res.data.message, "info");
        setTimeout(() => {
          router.push("/login");
        }, 5000);
      })
      .catch((err) => {
        //hacer un alert con el error
        if (err) {
          showAlert(err.response.data.message, "danger");
        }
      });
  }
};
</script>

<style scoped>
form {
  width: 50%;
  margin: auto;
}

.form-text {
  color: white;
}
</style>
