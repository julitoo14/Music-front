<template>
  <div class="container p-3">
      <div class="row mt-5">
        <div v-for="artist in state.artists" :key="artist._id" class="col-md-4 col-lg-3  col-sm-6">
          <RouterLink :to="`/artist/${artist._id}`">

            <div class="card  bg-dark mb-4 box-shadow">
              <img class="card-img" :src="artist.image" alt="Artist Image">
              <div class="card-img-overlay">
                <p class="text-light text-center ">{{ artist.name }}</p>
                
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
      <nav class="pagination justify-content-center mt-auto" role="navigation" aria-label="pagination">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: state.page === 1 }">
            <button class="page-link bg-black border-black" @click="previousPage()">Previous</button>
          </li>
          <li class="page-item" :class="{ disabled: state.page === state.totalPages }">
            <button class="page-link bg-black border-black " @click="nextPage()">Next</button>
          </li>
        </ul>
        
      </nav>
    </div>
</template>

<script>
import { reactive, onMounted, ref } from "vue";
import axios from "axios";

export default {
  setup() {
      const state = reactive({
          artists: [],
          page: 1,
          imageUrl: ''
      });


      const config = {
          headers: {
              Authorization: `${localStorage.getItem("token")}`,
          },
      };

      const imageUrl = ref('');

      const fetchArtists = () => {
          axios
              .get(`http://localhost:3910/api/artist/list/${state.page}`, config)
              .then((response) => {
                  state.artists = response.data.artists;


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
                          })
                          .catch((error) => {
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

.card-img {
  height: 22em;
  object-fit: cover;

}

.card-img-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  background-color: rgba(0, 0, 0, 0.293);;
}
.card-img-overlay:hover {
  background-color: rgba(0, 0, 0, 0.493);
  font-size: 3.1em;
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