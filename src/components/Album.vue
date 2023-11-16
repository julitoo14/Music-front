<template>
  <RouterLink class="nav-link" :to="`/album/${props.album._id}`">
    <div class="album-card">
      <img :src="props.albumImage" alt="Album Cover" />
      <div class="name">
        <h3>{{ album.title }}</h3>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  album: {
    type: Object,
    required: true,
  },
  albumImage: "",
});

const album = ref(props.album);
</script>

<style scoped>
.album-card {
  width: 100%;
  height: 100%;
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  padding: 1rem;
  background-color: rgba(20, 20, 20, 0.717);
  border-radius: 5px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.album-card img {
  width: 100%;

  margin-bottom: 1rem;
}

.name h3 {
  font-size: 1.3em;
  text-align: center;
}

.name {
  display: flex;
  align-items: flex-end;
}
</style>
