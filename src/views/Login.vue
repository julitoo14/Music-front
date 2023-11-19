<template>
  <div class="page">
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
          class="form-control bg-dark text-light"
          style="--bs-bg-opacity: .4; border: solid 2px white"
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          v-model="password"
          required
          type="password"
          class="form-control bg-dark text-light "
          style="--bs-bg-opacity: .4; border: solid 2px white"
          id="password"
        />
      </div>

      <button
        @click="login()"
        class="mt-3 mb-5 btn btn-lg btn-light w-50 m-auto d-block"
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
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import Alert from "../components/Alert.vue";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { loginUser } from "../composables/apiServices";
const email = ref("");
const password = ref("");
const router = useRouter();
const user = ref({});
const token = ref("");
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

const setLocalStorage = () => {
  localStorage.setItem("token", token.value);
  localStorage.setItem("nick", user.value.nick);
  localStorage.setItem("id", user.value._id);
  localStorage.setItem("image", user.value.image);
}

const login = async () => {
  try{
    const res = await loginUser(email.value, password.value);
    showAlert(res.message, "info");
    console.log(res)
    user.value = res.user;
    token.value = res.token;
    setLocalStorage();
    router.go('/');
  }catch(err){
    showAlert(err.response.data.message);
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
  width: 40%;
  margin: auto;
}

.form-control{
  background-color: rgba(0, 0, 0, 0.469)2, 51, 51;
}

.page{
    background: url('/fondo.png') no-repeat center center fixed;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
}

@media screen and (max-width: 1000px) {
  form {
    width: 70%;
    margin: auto;
  }

  .page{
    padding-top:5em;
  }
}



</style>
