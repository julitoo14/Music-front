<template>
  <div class="homePage">
    <div class="hero">
      <h1>Welcome {{ nick }} to SoundJam!</h1>
      <h5>Explore, discover, and share your favorite music!</h5>
    </div>
    <div style="width: 100%;">
      <input
      class="searchbar-full"
      v-model="searchTerm"
      @input="search"
      type="text"
      placeholder="What should you listen to today?"
      />
    </div>

    <div v-if="searchTerm" class="searchResults">
      <ul ref="list" class="list">
        <li class="item" v-for="song in searchSongsResults" :key="song._id">
          <RouterLink class="row link" :to="`/album/${song.album}`">
            <h3 class="col-2">Song</h3>
            <h1 class="col-8">{{ song.name }}</h1>
            <h3 class="col-2">{{ song.duration }}</h3>
          </RouterLink>
        </li>

        <li class="item" v-for="artist in state.artists" :key="artist._id">
          <RouterLink class="row link" :to="`/artist/${artist._id}`">
            <h3 class="col-2">Artist</h3>
            <h1 class="col-8">{{ artist.name }}</h1>
            <img
              :src="`${API_BASE_URL}/artist/image/${artist.image}`"
              class="col-2 artist-image"
            />
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
            <img
              class="album-cover"
              :src="`${API_BASE_URL}/album/image/${album.image}`"
              alt=""
            />
          </RouterLink>
        </li>
      </ul>
    </div>

    <div class="container-fluid homeScreen" v-else>
      <h1>Albums</h1>
      <div class="albums">

        <Album
        class="album"
        v-for="album in albums"
        :key="album._id"
        :album="album"
        :albumImage="`${API_BASE_URL}/album/image/${album.image}`"
        />
      </div>
      <h1>Artists</h1>
      <div class="albums">
        <Artist
        v-for="artist in state.artists"
        :key="artist._id"
        :artist="artist"
        :artistImage="`${API_BASE_URL}/artist/image/${artist.image}`"
        class="album"
        />
      </div>
    </div>



  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import {getPlaylists, getArtists, getRandomAlbums, getSongsBySearch, getAlbumsBySearch} from "../composables/apiServices";
import { API_BASE_URL } from "../../config";
import Album from "../components/Album.vue";
import Artist from "../components/Artist.vue";

const token = localStorage.getItem("token");
const decoded = JSON.parse(atob(token.split(".")[1]));
const nick = decoded.nick;
const userId = decoded.id;
console.log(userId);
const showTable = ref(false);
const playlists = ref([]);
const albums = ref([]);
const state = reactive({
  artists: [],
  page: 1,
  imageUrl: "",
});
const searchTerm = ref("");
const searchArtistsResults = ref([]);
const searchPlaylistsResults = ref([]);
const searchSongsResults = ref([]);

const fetchPlaylists = async () => {
  try {
    const res = await getPlaylists();
    playlists.value = res.playlists;
    if (playlists.value.length > 0) {
      showTable.value = true;
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchArtists = async () => {
  try {
    const res = await getArtists();
    state.artists = res.artists;
  } catch (err) {
    console.log(err.message);
  }
};

const fetchAlbums = async () => {
  try {
    const res = await getRandomAlbums();
    albums.value = res.albums;
  } catch (err) {
    console.log(err.message);
  }
};

const searchArtists = async () => {
  searchArtistsResults.value = state.artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
  state.artists = searchArtistsResults.value;
};

const searchPlaylists = async () => {
  searchPlaylistsResults.value = playlists.value.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
  playlists.value = searchPlaylistsResults.value;
};

const searchSongs = async () => {
  const res = await getSongsBySearch(searchTerm.value);
  searchSongsResults.value = res.songs;
};

const searchAlbums = async () => {
  const res = await getAlbumsBySearch(searchTerm.value);
  albums.value = res.albums;
};

const search = async () => {
  if (searchTerm.value.length > 0) {
    searchArtists();
    searchPlaylists();
    searchSongs();
    searchAlbums();
  } else {
    fetchArtists();
    fetchPlaylists();
    fetchAlbums();
  }
};

onMounted(() => {
  fetchPlaylists();
  fetchArtists();
  fetchAlbums();
});
</script>

<style scoped>

.item {
  background-color: rgba(2, 2, 2, 0.837);
  width: 100%;
  height: 130px;
  display: flex;
  border: rgba(255, 255, 255, 0.241) solid 0.2px;
}

.item:hover {
  background-color: rgba(24, 23, 23, 0.637);
}
.link {
  width: 100%;
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
  text-align: center;
}

.artist-image {
  margin: auto;
  width: 125px;
  height: 100px;
}

.album-cover {
  margin: auto;
  width: 125px;
  height: 100px;
}

.list {
  list-style: none;
  padding: 0;
}

.homePage {
  background: url("/fondo.png") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}
.searchbar-full {
  width: 100%;
  background-color: rgba(85, 84, 84, 0.429);
  height: 60px;
  text-align: center;
  color: rgb(255, 255, 255);
  margin-bottom: 1em;
  font-size: large;
}
.searchResults {
  width: 70%;
  height: 40em;
}

.albums{
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    width: 100%;
    margin: auto;
  }

  .album{
    width: 20em;
    background-color: rgba(0, 0, 0, 0.729);
  }

  .album:hover{
    background-color: rgb(46, 45, 45);
  }

  h1{
    color: white;
    font-size: 2em;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }


@media (max-width: 768px) {


  .homePage {
    min-height: max-content;
  }

  .homeScreen{
    margin-bottom: 80px;
  }

  .hero{
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    text-align: center;
  }

  .hero h1{
    font-size: 1.5em;
  }

  .hero h5{
    font-size: 1em;
  }

  .searchbar-full {
    width: 100%;
    border: none;
    height: 2.5em;
  }

  .searchResults {
    width: 90%;
    margin-bottom: 8em;
    overflow-y: auto;
  }

  .albums{
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    width: 95%;
  }

  .album{
    width: 20em;
    background-color: rgba(0, 0, 0, 0.795);
  }

  .title{
    text-align: center;
    font-size: 1.4em;
    padding: 0.3em;
  }

  .artist-image, .album-cover{
    width: 30%;
    margin: auto;
  }

  .item h3{
    font-size: 1em;
    width: 30%;
    margin: auto;
  }

  .item h1{
    font-size: 1.1em;
    width: 30%;
    margin: auto;
  }



}
</style>
