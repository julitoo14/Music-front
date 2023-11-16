<template>
  <div class="bottom-navbar">
    <div class="songInfo">
      <img :src="`http://localhost:3910/api/album/image/${cover}`" />
      <div  class="div">
        <h4>{{ getSongInfo() }}</h4>
        <h5>{{ artist }}</h5>
      </div>
    </div>
    <div class="controls">
      <div class="buttons">
        <PreviousIcon @click="previousSong"></PreviousIcon>
        <PlayIconVue
          v-if="!isPlaying"
          class="play-pause"
          @click="togglePlay"
        ></PlayIconVue>
        <PauseIconVue
          v-else
          class="play-pause"
          @click="togglePlay"
        ></PauseIconVue>
        <NextIcon @click="nextSong"></NextIcon>
      </div>
      <div class="timeInfo">
        {{ formatTime(currentTime) }}
        <input
          class="slider"
          type="range"
          min="0"
          :max="duration"
          v-model="currentTime"
          @mousedown="onSliderStart"
          @mouseup="onSliderEnd"
          @touchstart="onSliderStart"
          @touchend="onSliderEnd"
        />
        {{ formatTime(duration) }}
      </div>
    </div>
    
    <div class="volume" v-if="!isMobile">
      <input
        type="range"
        class="volume-slider"
        min="0"
        max="1"
        step="0.01"
        v-model="volume"
      />
    </div>
    <div class="mobileInfo" v-if="isMobile">
      
    </div>
    <audio
      ref="audio"
      autoplay
      @ended="ended"
      :src="props.files"
      @timeupdate="updateTime"
      @loadedmetadata="loadedMetadata"
    ></audio>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { isPlaying } from "../composables/useAudioPlayer.js";
import PlayIconVue from "../assets/icons/PlayIcon.vue";
import PauseIconVue from "../assets/icons/PauseIcon.vue";
import NextIcon from "../assets/icons/NextIcon.vue";
import PreviousIcon from "../assets/icons/PreviousIcon.vue";
import { getAlbum } from "../composables/apiServices";



const props = defineProps({
  files: {
    required: true,
    type: String,
  },
  song: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(["ended", "next", "previous"]);

const audio = ref(null);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const album = ref("");
const cover = ref("default.png");
const artist = ref("");

const isMobile = ref(window.innerWidth < 768);

const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 768;
};


const updateTime = () => {
  currentTime.value = audio.value.currentTime;
};

const loadedMetadata = () => {
  duration.value = audio.value.duration;
  fetchAlbum();
};

const getSongInfo = () => {
  if (props.song) {
    return `${props.song.name}`;
  }
  return "";
};

const fetchAlbum = async () => {
  if (props.song) {
    try {
      const res = await getAlbum(props.song.album._id)
      album.value = res.album;
      cover.value = album.value.image;
      artist.value = res.album.artist.name;
    } catch(err) {
      console.log(err)
    }
  }
};

const togglePlay = () => {
  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

const ended = () => {
  isPlaying.value = false;
  emit("ended");
};

let isUserSeeking = false;

// Esta función se llama cuando el usuario comienza a mover el control deslizante
const onSliderStart = () => {
  isUserSeeking = true;
};

// Esta función se llama cuando el usuario deja de mover el control deslizante
const onSliderEnd = () => {
  isUserSeeking = false;
};

const previousSong = () => {
  emit("previous");
  isPlaying.value = true;
};

const nextSong = () => {
  emit("next");
  isPlaying.value = true;
};

const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

watch(currentTime, (newTime) => {
  if (isUserSeeking) {
    audio.value.currentTime = newTime;
  }
});

watch(volume, (newVolume) => {
  audio.value.volume = newVolume;
});

onMounted(() => {
  window.addEventListener('resize', updateIsMobile);
  if (props.files) {
    isPlaying.value = true;
  }
});
</script>

<style scoped>
.volume {
  width: 25%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 30px;
}

.timeInfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.bottom-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 10%;
  background-color: rgb(12, 12, 12);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  flex-direction: row;
  padding: 0.4em; 
  margin-top: 10%;
}

.play-pause {
  width: 50px;
  height: 50px;
  margin: 0 20px;
  cursor: pointer;
}

.volume-slider {
  -webkit-appearance: none;
  width: 40%;
  height: 5px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #a600ff;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #a600ff;
  cursor: pointer;
}

.slider {
  -webkit-appearance: none;
  width: 90%;
  height: 5px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}
.controls {
  width: 50%;
}

.songInfo {
  width: 25%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 20px;

}

.songInfo img{
  width: 80px;
  margin-right: 20px;
}

.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 7px;
  height: 14px;
  background: #a600ff;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 7px;
  height: 14px;
  background: #a600ff;
  cursor: pointer;
}

@media (max-width: 768px) {
  .bottom-navbar {
    height: 15%;
    display: flex;
    flex-direction: column;

  }

  .songInfo, .controls {
    width: 100%;
    padding: 0 10px;
  }

  .songInfo{
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .songInfo img {
    width: 60px;
  }

  .play-pause {
    width: 40px;
    height: 40px;
  }

  .volume-slider, .slider {
    width: 80%;
  }

  .controls{
    width: 100%;
  }
}

</style>
