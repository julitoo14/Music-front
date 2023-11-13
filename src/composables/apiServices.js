import axios from 'axios';
const config = {headers: {
    Authorization: `${localStorage.getItem('token')}`,
  }
};

//gets
export async function getArtist(id){
    const response = await axios.get(`http://localhost:3910/api/artist/one/${id}`, config);
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

//deletes
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

//posts
export async function saveAlbum(album) {
    const response = await axios.post(`http://localhost:3910/api/album/save`, album, config);
    return response.data; 
}

//puts
export async function uploadAlbumImage(image, id) {
    const response = await axios.put(`http://localhost:3910/api/album/upload/${id}`, image, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
    return response.data; 
}

