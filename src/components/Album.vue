<template>
  <RouterLink class="nav-link" :to="`/album/${props.album._id}`">
    <div class="album-card">
      <img :src="props.albumImage" alt="Album Cover" />
      <div id="scroll-container">
        <div id="scroll-text">{{album.title}}</div>
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
  width: 13em;
  height: 13em;
  margin: 0 auto;
  text-align: center;
  padding: 1rem;
  background-color: rgba(20, 20, 20, 0.717);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.album-card img {
  width: 8em;
  height: 8em;
  margin-bottom: 1rem;
}

.name h3 {
  font-size: 1em;
  text-align: start;

}


#scroll-container {
  overflow: hidden;
  width: 90%;
}

#scroll-text {
  text-align: right;
  white-space: nowrap;

  /* animation properties */
  -moz-transform: translateX(-100%);
  -webkit-transform: translateX(-100%);
  transform: translateX(-100%);
  
  -moz-animation: my-animation 10s linear infinite;
  -webkit-animation: my-animation 10s linear infinite;
  animation: my-animation 10s linear infinite;
}

/* for Firefox */
@-moz-keyframes my-animation {
  from { -moz-transform: translateX(-100%); }
  to { -moz-transform: translateX(100%); }
}

/* for Chrome */
@-webkit-keyframes my-animation {
  from { -webkit-transform: translateX(-100%); }
  to { -webkit-transform: translateX(100%); }
}

@keyframes my-animation {
  from {
    -moz-transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
    transform: translateX(-100%);
  }
  to {
    -moz-transform: translateX(100%);
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
  }
}

</style>
