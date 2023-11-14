import axios from 'axios';
const config = {headers: {
    Authorization: `${localStorage.getItem('token')}`,
  }
};

// ----------------- GET -----------------
export async function getArtist(id){
    const response = await axios.get(`http://localhost:3910/api/artist/one/${id}`, config);
    return response.data;
}

export async function getArtists(page){
    const response = await axios.get(`http://localhost:3910/api/artist/list/${page}`, config);
    return response.data;
}

export async function getAlbumsByArtist(artistId) {
    const response = await axios.get(`http://localhost:3910/api/album/list/${artistId}`,config);
    return response.data;
}

export async function getAlbum(id) {
    const response = await axios.get(`http://localhost:3910/api/album/one/${id}`,config);
    return response.data;
}

export async function getSongsByAlbum(albumId) {
    const response = await axios.get(`http://localhost:3910/api/song/listByAlbum/${albumId}`,config);
    return response.data;
}

export async function getSong(id) {
    const response = await axios.get(`http://localhost:3910/api/song/one/${id}`,config);
    return response.data;
}


export async function getPlaylists() {
    const response = await axios.get(`http://localhost:3910/api/playlist/list`,config);
    return response.data;
}

export async function getUserProfile(id){
    const response = await axios.get(`http://localhost:3910/api/user/profile/${id}`, config);
    return response.data;
}

// ----------------- SEARCH -----------------

export async function getSongsBySearch(search) {
    const response = await axios.get(`http://localhost:3910/api/song/search/${search}`,config);
    return response.data;
}

export async function getAlbumsBySearch(search) {
    const response = await axios.get(`http://localhost:3910/api/album/search/${search}`,config);
    return response.data;
}

// ----------------- DELETE -----------------
export async function deleteArtist(id) {
    const response = await axios.delete(`http://localhost:3910/api/artist/remove/${id}`, config);
    return response.data; 
}

export async function deleteAlbum(id) {
    const response = await axios.delete(`http://localhost:3910/api/album/remove/${id}`, config);
    return response.data; 
}

export async function deleteSong(id) {
    const response = await axios.delete(`http://localhost:3910/api/song/remove/${id}`, config);
    return response.data; 
}

// ----------------- POST -----------------
export async function saveAlbum(album) {
    const response = await axios.post(`http://localhost:3910/api/album/save`, album, config);
    return response.data; 
}

export async function saveSong(song) {
    const response = await axios.post(`http://localhost:3910/api/song/save`, song, config);
    return response.data;
}
export async function saveArtist(artist) {
    const response = await axios.post(`http://localhost:3910/api/artist/save`, artist, config);
    return response.data; 
}

export async function loginUser(email, password){
    const response = await axios.post(`http://localhost:3910/api/user/login`, {email, password});
    return response.data;
}

// ----------------- PUT -----------------
export async function uploadAlbumImage(image, id) {
    const response = await axios.put(`http://localhost:3910/api/album/upload/${id}`, image, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
    return response.data; 
}

export async function updateAlbum(updatedAlbum, id) {
    const response = await axios.put(`http://localhost:3910/api/album/update/${id}`, updatedAlbum , config);
    console.log(updatedAlbum)
    return response.data; 
}

export async function uploadSongFile(file, id){
    const response = await axios.put(`http://localhost:3910/api/song/upload/${id}`, file, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
    return response.data; 
}

export async function updateSong(updatedSong, id) {
    const response = await axios.put(`http://localhost:3910/api/song/update/${id}`, updatedSong , config);
    return response.data; 
}

export async function uploadArtistImage(image, id) {
    const response = await axios.put(`http://localhost:3910/api/artist/upload/${id}`, image, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
    return response.data; 
}

export async function updateArtist(id, name, description) {
    const response = await axios.put(`http://localhost:3910/api/artist/update/${id}`, {name , description } , config);
    return response.data;
}

