<template>
    <div class="container">
        <div class="row">
            <div v-for="artist in state.artists" :key="artist._id" class="col-md-4">
                <div class="p-2 card border-secondary bg-black mb-4 box-shadow">
                    <img class="card-img-top" :src="artist.image" alt="Artist Image">
                    <div class="card-body">
                        <h5 class="text-light card-title">{{ artist.name }}</h5>
                        <p class="card-text">{{ artist.description }}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-light">9 mins</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <nav class="pagination" role="navigation" aria-label="pagination">
            <button class="button" :disabled="state.page === 1" @click="previousPage()">Previous</button>
            <button class="button" :disabled="state.page === state.totalPages" @click="nextPage()">Next</button>
        </nav>
    </div>
</template>

<script>
import { reactive, onMounted } from "vue";
import axios from "axios";

export default {
    setup() {
        const state = reactive({
            artists: [],
            page: 1,
            totalPages: 1,
        });

        const config = {
            headers: {
                Authorization: `${localStorage.getItem("token")}`,
            },
        };

        const fetchArtists = () => {
            axios
                .get(`http://localhost:3910/api/artist/list/${state.page}`, config)
                .then((response) => {
                    state.artists = response.data.artists;
                    state.totalPages = response.data.totalPages;

                    // Fetch image for each artist
                    state.artists.forEach((artist) => {
                        axios
                            .get(`http://localhost:3910/api/artist/image/${artist.image}`, {
                                headers: {
                                    Authorization: `${localStorage.getItem("token")}`,
                                },
                                responseType: "arraybuffer",
                            })
                            .then((res) => {
                                const blob = new Blob([res.data], {
                                    type: res.headers["content-type"],
                                });
                                const imageUrl = URL.createObjectURL(blob);
                                artist.image = imageUrl;
                                console.log(imageUrl)
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        };

        const nextPage = () => {
            state.page++;
            fetchArtists();
        };

        const previousPage = () => {
            state.page--;
            fetchArtists();
        };

        onMounted(() => {
            fetchArtists();
        });

        return {
            state,
            nextPage,
            previousPage,
        };
    },
};
</script>
