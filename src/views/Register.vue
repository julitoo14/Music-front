<template>
  <div class="page">
    <form v-on:submit.prevent="onSubmit" class="mt-5">
      <h1 class="text-center">Create your account!</h1>
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
          v-model="form.name"
          required
          type="name"
          class="form-control bg-dark text-light"
          style="--bs-bg-opacity: .4; border: solid 2px white"
          id="name"
        />
        <div id="nameHelp" class="form-text"></div>
      </div>
      <div class="mb-3">
        <label for="surname" class="form-label">Surname</label>
        <input
          v-model="form.surname"
          required
          type="surname"
          class="form-control bg-dark text-light"
          style="--bs-bg-opacity: .4; border: solid 2px white"
          id="surname"
        />
      </div>
      <div class="mb-3">
        <label for="nick" class="form-label">Nickname</label>
        <input
          v-model="form.nick"
          required
          type="text"
          name="nick"
          id="nick"
          class="form-control bg-dark text-light"
          style="--bs-bg-opacity: .4; border: solid 2px white"
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          v-model="form.email"
          required
          type="email"
          name="email"
          id="email"
          class="form-control bg-dark text-light"
          style="--bs-bg-opacity: .4; border: solid 2px white"
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          v-model="form.password"
          required
          type="password"
          class="form-control bg-dark text-light"
          style="--bs-bg-opacity: .4; border: solid 2px white"
          id="password"
        />
      </div>
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirm Password</label>
        <input
          v-model="form.confirmPassword"
          required
          type="password"
          class="form-control bg-dark text-light"
          style="--bs-bg-opacity: .4; border: solid 2px white"
          id="confirmPassword"
        />
      </div>
      <button
        @click="register()"
        class="mt-3 mb-5 btn btn-lg btn-light w-50 m-auto d-block"
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
  </div>
</template>

<script setup>
import {onMounted, reactive } from "vue";
import Alert from "../components/Alert.vue";
import { useRouter } from "vue-router";
import { saveUser } from "../composables/apiServices";

const router = useRouter();

const form = reactive({
  name: "",
  surname: "",
  nick: "",
  email: "",
  password: "",
  confirmPassword: "",
});

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

const validateForm = () => {
  for (let field in form) {
    if (!form[field]) {
      showAlert(`Please fill in the ${field}`, "danger");
      return false;
    }
  }
  if (form.password !== form.confirmPassword) {
    showAlert("Passwords do not match", "danger");
    return false;
  }
  return true;
};

const register = async () => {
  if (!validateForm()) return;

  try {
    const res = await saveUser(form);
    showAlert(res.message, "info");
    console.log(res);
    setTimeout(() => {
      router.push("/login");
    }, 5000);
  } catch (err) {
    showAlert(err.message, "danger");
  }
};

onMounted(() => {
  if (localStorage.getItem("token")) {
    router.push("/");
  }
});
</script>


<style scoped>
form {
  width: 50%;
  margin: auto;
}

.form-text {
  color: white;
}
.page{
    background: url('/fondo.png') no-repeat center center fixed;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-bottom: 6em;
    height: 100vh;
}
</style>
