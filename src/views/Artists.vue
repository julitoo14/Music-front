<template>
    <div class="container p-3">
        <div class="row">
          <div v-for="artist in state.artists" :key="artist._id" class="col-md-4">
            <div class="p-2 card border-secondary bg-dark mb-4 box-shadow">
              <img class="card-img-top" :src="artist.image" alt="Artist Image">
              <div class="card-body">
                <h5 class="text-light card-title">{{ artist.name }}</h5>
                <p class="card-text text-light">{{ artist.description }}</p>
                
              </div>
            </div>
          </div>
        </div>
        <nav class="pagination justify-content-center mt-auto" role="navigation" aria-label="pagination">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: state.page === 1 }">
              <button class="page-link" @click="previousPage()">Previous</button>
            </li>
            <li class="page-item" :class="{ disabled: state.page === state.totalPages }">
              <button class="page-link" @click="nextPage()">Next</button>
            </li>
          </ul>
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


                    // Fetch image for each artist
                    state.artists.forEach((artist) => {
                        console.log(artist.image)
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
                            })
                            .catch((error) => {
                                console.log('hola')
                                console.log(error.response.data.message);
                            });
                    });
                })
                .catch((error) => {
                    console.log(error.response.data.message);
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

<style scoped>
.card {
    border-radius: 10px;
  }
  
  .card-img-top {
    height: 15em;
    object-fit: cover;
  }
  
  .card-title {
    font-size: 1.25rem;
  }
  
  .pagination {
    margin-top: 20px;
  }
  
  .page-link {
    border-radius: 0;
  }
  
  .page-item.disabled .page-link {
    background-color: #343a40;
    border-color: #343a40;
  }
  
  .page-item.disabled .page-link:hover {
    background-color: #343a40;
    border-color: #343a40;
  }
  
  .page-item.active .page-link {
    background-color: #343a40;
    border-color: #343a40;
  }
  
  /* Custom styles */
  .container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .mt-auto {
    margin-top: auto;
  }
</style>
