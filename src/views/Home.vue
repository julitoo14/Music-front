<template>
    <div class="homePage">
      <h1 class="tittle">Search for an Artist, a Song or Playlist</h1>
      <input class="searchbar-full" v-model="searchTerm" @input="search" type="text" placeholder="What should you listen to today?">

      <div v-if="searchTerm" class="searchResults">
        <ul ref="list" class="list">
          <li class="item" v-for="song in searchSongsResults" :key="song._id">
            <RouterLink class="row link"  :to="`/album/${song.album}`">
              <h3 class="col-2">Song</h3>
              <h1 class="col-8">{{ song.name}}</h1>
              <h3 class="col-2">{{song.duration}}</h3>
            </RouterLink>
          </li>

          <li class="item " v-for="artist in state.artists" :key="artist._id">
            <RouterLink class="row link" :to="`/artist/${artist._id}`">
              <h3 class="col-2">Artist</h3>
              <h1 class="col-8">{{ artist.name }}</h1>
              <img :src="`http://localhost:3910/api/artist/image/${artist.image}`"  class="col-2 artist-image" >
            </RouterLink>  
          </li>

          <li class="item" v-for="playlist in playlists" :key="playlist._id">
            <RouterLink class="row link" :to="`/playlist/${playlist._id}`">
              <h3 class="col-2">Playlist</h3>
              <h1 class="col-8">{{ playlist.name }}</h1>
              <h3 class="col-2">{{ playlist.songs.length }} Songs</h3>  
            </RouterLink>
          </li>

          <li class="item" v-for="album in albums" :key="album._id">
            <RouterLink class="row link" :to="`/album/${album._id}`">
              <h3 class="col-2">Album</h3>
              <h1 class="col-8">{{ album.title }}</h1>
              <img class="album-cover" :src="`http://localhost:3910/api/album/image/${album.image}`" alt="">
            </RouterLink>
          </li>

        </ul>
      </div>
      <div class="hero" v-else-if="!searchTerm">
        <h1>Welcome {{ nick }} to SoundJam!</h1>
        <p>Explore, discover, and share yout favourite music!</p>
      </div>
  </div>

</template>

<style scoped>

  .item{
    background-color: rgba(2, 2, 2, 0.837);
    width: 100%;
    height: 130px;
    display: flex;
    border: rgba(255, 255, 255, 0.241) solid 0.2px;
  }

  .item:hover{
    background-color: rgba(24, 23, 23, 0.637);
  }
  .link{
    width: 100%;
    text-decoration: none;
    color: white;
    display: flex;
    align-items: center;
    text-align: center;
  }

  .artist-image{
    margin: auto;
    width: 125px;
    height: 100px;
  }

  .album-cover{
    margin: auto;
    width: 125px;
    height: 100px;
  }

  .list{
    list-style: none;
    padding: 0;
  }
  
  .homePage{
    background: url('/fondo.png') no-repeat center center fixed;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-bottom: 6em;
    height: 100vh;
  }
  .searchbar-full{
    width: 70%;
    background-color: rgba(85, 84, 84, 0.429);
    border-radius: 10px;
    border: rgb(255, 255, 255) solid 3px;
    height: 60px;
    text-align: center;
    color: rgb(255, 255, 255);
    margin-bottom: 1em;
    font-size: large;
  }
  .searchResults{
    width: 70%;
    height: 100%;
  }

  .hero {
  text-align: center;
  max-width: 800px;
  position: absolute;
  top: 40%;
}

.hero h1 {
  font-size: 2.5em;
}

.hero p {
  font-size: 1.2em;
}
</style>

<script setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";


const token = localStorage.getItem("token");
const decoded = JSON.parse(atob(token.split(".")[1]));
const nick = decoded.nick;
const userId = decoded.id;
console.log(userId)
const showTable = ref(false);
const playlists = ref([]);
const albums = ref([]);
const state = reactive({
          artists: [],
          page: 1,
          imageUrl: ''
      });
const searchTerm = ref("");
const searchArtistsResults = ref([]);
const searchPlaylistsResults = ref([]);
const searchSongsResults = ref([]);

const getPlaylists = async () => {
  try {
    const res = await axios.get(
      `http://localhost:3910/api/playlist/list/`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    playlists.value = res.data.playlists;
    console.log(playlists.value)
    if(playlists.value.length > 0){
        showTable.value = true;
    }

    playlists.value.forEach(async playlist => {
        console.log(playlist.user)
        const res2 = await axios.get(
            `http://localhost:3910/api/user/profile/${playlist.user}`,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          playlist.user = res2.data.user.nick;
    });
  } catch (err) {
    console.log(err);
  }

};

const fetchArtists = () => {
          axios
              .get(`http://localhost:3910/api/artist/list/${state.page}`, {headers: {
              Authorization: `${localStorage.getItem("token")}`,
          },})
              .then((response) => {
                  state.artists = response.data.artists;
              })
              .catch((error) => {
                  console.log(error.response.data.message);
              });
};

const search = async  () => {
    if (searchTerm.value.length > 0) {
      //artists search
      searchArtistsResults.value = state.artists.filter((artist) =>
        artist.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
      state.artists = searchArtistsResults.value;
      //playlists search
      searchPlaylistsResults.value = playlists.value.filter((playlist) =>
        playlist.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
      playlists.value = searchPlaylistsResults.value;
      //songs search
      const response = await axios.get(`http://localhost:3910/api/song/search/${searchTerm.value}`, {
          headers: {
              Authorization: `${localStorage.getItem("token")}`,
          }});
        searchSongsResults.value = response.data.songs;
      //albums search
      const response2 = await axios.get(`http://localhost:3910/api/album/search/${searchTerm.value}`, {
          headers: {
              Authorization: `${localStorage.getItem("token")}`,
          }});
        albums.value = response2.data.albums;
    } else {
      fetchArtists();
      getPlaylists();
    }
  };

onMounted(() =>{
    getPlaylists();
    fetchArtists();    
});

</script>