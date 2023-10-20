<template>
    <div class="songsContainer d-flex align-items-center py-3">
        <div class="song flex-grow-1">
            <p class="track mb-0 col-1">{{ song.track }}</p>
            <p class="name mb-0 col-5" >{{ song.name }}</p>
            <p class="duration mb-0 col-3 "> {{ song.duration }}</p>
            <div class="btn-group">
                <button class="btn btn-success">play</button>
                <button class="btn btn-info"><RouterLink class="nav-link" :to="`/editSong/${song._id}`">Edit</RouterLink></button>
                <button class="btn btn-danger" @click="$emit('removeSong')">Delete</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps} from 'vue';

const props = defineProps({
    song: {
        type: Object,
        required: true
    }
});
const emit = defineEmits(['removeSong']);
</script>

<style scoped>

.songsContainer{
    padding: 2em;
}

.song{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.name, .track {
    font-size: 2em;
    font-weight: bold;
}

.duration{
    font-size: 1em;
}

/* Bootstrap classes */
.py-3 {
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
}

.flex-grow-1 {
    flex-grow: 1 !important;
}
</style>
