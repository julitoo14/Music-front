<template>
  <div class="container-fluid page">
      <div class="row mt-5">
        <div v-for="artist in state.artists" :key="artist._id" class="col-md-4 col-lg-3  col-sm-6">
          <RouterLink :to="`/artist/${artist._id}`">

            <div class="card  bg-dark mb-4 box-shadow">
              <img class="card-img" :src="`http://localhost:3910/api/artist/image/${artist.image}`" alt="Artist Image">
              <div class="card-img-overlay">
                <p class="text-light text-center ">{{ artist.name }}</p>
                
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
      <nav class="pagination justify-content-center" role="navigation" aria-label="pagination">
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

<script setup>
import { reactive, onMounted } from "vue";
import { getArtists } from "../composables/apiServices";

const state = reactive({
  artists: [],
  page: 1,
});

const fetchArtists = async () => {
  try {
    const res = await getArtists(state.page);
    state.artists = res.artists;
  } catch (error) {
    console.log(error.response.data.message);
  }
};

const nextPage = () => {
  state.page++;
  fetchArtists();
};

const previousPage = () => {
  state.page--;
  fetchArtists();
};

onMounted(fetchArtists);
</script>


<style scoped>

.page{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 5%;
}

.card {
  border-radius: 10px;
  width: 100%;
}

.card-img {
  height: 20em;
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
@media screen and (max-width: 1000px) {
  .page{
    margin-bottom: 35%;
    margin-top: 5%;
  }
  
}
</style>