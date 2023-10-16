<template>
  <form v-on:submit.prevent="onSubmit" class="mt-5">
    <h1 class="text-center">Log Into Your Account</h1>

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

    <button
      @click="login(email, password)"
      class="mt-3 mb-5 btn btn-lg btn-primary"
    >
      Login
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
import { onMounted } from 'vue';
import { ref } from "vue";
import axios from "axios";
import Alert from "../components/Alert.vue";
import { reactive } from "vue";
import { useRouter } from "vue-router";
const email = ref("");
const password = ref("");
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

const login = async (email, password) => {
  const res = await axios
    .post("http://localhost:3910/api/user/login/", {
      email: email,
      password: password,
    })
    .then((res) => {
      showAlert(res.data.message, "info");
      const token = res.data.token;
      const id = res.data.user._id;
      const nick = res.data.user.nick;
      const image = res.data.user.image;


      localStorage.setItem('token', token);
      localStorage.setItem('nick', nick);
      localStorage.setItem('id', id);
      localStorage.setItem('image', image);
      setTimeout(() => {
        router.go();
      }, 2000);
    })
    .catch((err) => {
      //hacer un alert con el error
      if (err) {
        showAlert(err.response.data.message, "danger");
      }
    });
};

onMounted(() => {
  if (localStorage.getItem("token")) {
    router.push("/");
  }
});

</script>

<style scoped>
  form{
    width: 40%;
    margin: auto;
  }

</style>