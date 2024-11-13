document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const artistId = params.get('artistId');
    const albumTitle = params.get('albumTitle');

    console.log('Artist ID:', artistId);
    console.log('Album Title:', albumTitle);

    fetch('../json/artists.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const artist = data.artists.find(a => a.id == artistId);
            if (artist) {
                const album = artist.albums.find(a => a.title === albumTitle);
                if (album) {
                    // Colocar el título del álbum y la imagen
                    document.querySelector('.album-title').textContent = album.title;
                    document.querySelector('.album-image img').src = album.cover;

                    // Mostrar canciones del álbum
                    const albumSongsContainer = document.getElementById('album-songs-container');
                    album.songs.forEach((song, index) => {
                        const songDiv = document.createElement('div');
                        songDiv.classList.add('song');
                        songDiv.innerHTML = `
                            <img src="${song.cover}" alt="${song.title}">
                            <div class="song-info">
                                <h4>${song.title}</h4>
                            </div>
                            <button class="play-song-button" data-index="${index}">Play</button>
                            <i class="far fa-star favorite-icon"></i>
                        `;
                        albumSongsContainer.appendChild(songDiv);
                    });

                    // Añadir eventos a los botones de reproducción de canciones del álbum
                    document.querySelectorAll('.play-song-button').forEach(button => {
                        button.addEventListener('click', (event) => {
                            const index = event.target.getAttribute('data-index');
                            songSelected = true; // Marcar que se ha seleccionado una canción
                            currentSongIndex = index; // Actualizar índice de la canción actual
                            loadSongAsync(index, album.songs); // Pasa la lista de canciones del álbum
                        });
                    });
                } else {
                    console.error(`Album with title ${albumTitle} not found.`);
                }
            } else {
                console.error(`Artist with ID ${artistId} not found.`);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});