
<template>
  
  <div class="view" :style="{ flexDirection: logged ? 'block' : 'flex' }">
    <Navbar />
    <RouterView style="overflow-y:auto; width: 100%;"></RouterView>
  </div>
</template>

<style scoped>
.view{
  background: linear-gradient(180deg, rgba(12,12,12,1) 0%, rgba(37,37,38,1) 53%, rgba(54,55,55,1) 86%);
  width: 100%;
  height: 100vh;
  display: flex;
}



</style>

<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue"
import { ref, onMounted } from 'vue';
const logged = ref(false);


  onMounted(async () =>{
    if(localStorage.getItem('token')){
    logged.value = true;   
  }else{
      logged.value = false;
  }
});




</script>