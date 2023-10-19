<template>
    <div class="album-card">
        <RouterLink class="nav-link" :to="`/album/${props.album._id}`">

            <img :src="props.albumImage" alt="Album Cover">
            <h3>{{ album.title }}</h3>
        </RouterLink>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
    album: {
        type: Object,
        required: true
    },
    albumImage: '',
});

const album = ref(props.album);


</script>

<style scoped>


.album-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    border: 1px solid #000000;
    border-radius: 5px;
    background-color: #000000af;
    margin-left: 2px;
    margin-right: 2px;
    height: 26em;
    margin: auto;
}

.album-card img {
    width: 100%;
    max-width: 300px;
    height: 20em;
    margin-bottom: 1rem;
}

.album-card h3 {
    font-size: 1.2rem;
    text-align: center;
    margin: 0;
}
</style>
