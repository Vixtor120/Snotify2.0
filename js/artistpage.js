document.addEventListener('DOMContentLoaded', () => {
    fetch('../json/artists.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const params = new URLSearchParams(window.location.search);
            const artistId = params.get('id');

            if (data.artists.length > 0) {
                const artist = data.artists.find(a => a.id == artistId);

                if (artist) {
                    document.querySelector('.artist-name').textContent = artist.name;
                    document.querySelector('.artist-image img').src = artist.image;

                    // Mostrar canciones populares
                    const popularSongsContainer = document.getElementById('popular-songs-container');
                    artist.popular_songs.forEach((song, index) => {
                        const songDiv = document.createElement('div');
                        songDiv.classList.add('song');
                        songDiv.innerHTML = `
                            <img src="${song.cover}" alt="${song.title}">
                            <div class="song-info">
                                <h4>${song.title}</h4>
                            </div>
                            <button class="play-song-button" data-index="${index}">Play</button>
                        `;
                        popularSongsContainer.appendChild(songDiv);
                    });

                    // Mostrar álbumes
                    const albumsContainer = document.getElementById('albums-container');
                    artist.albums.forEach((album, index) => {
                        const albumDiv = document.createElement('div');
                        albumDiv.classList.add('album');
                        albumDiv.innerHTML = `
                            <img src="${album.cover}" alt="${album.title}">
                            <div class="album-info">
                                <h4>${album.title}</h4>
                            </div>
                            <button class="play-album-button" data-artist-id="${artistId}" data-album-title="${album.title}">Ver Album</button>
                        `;
                        albumsContainer.appendChild(albumDiv);
                    });

                    // Mostrar conciertos
                    const concertsContainer = document.getElementById('concerts-container');
                    artist.concerts.forEach(concert => {
                        const concertDiv = document.createElement('div');
                        concertDiv.classList.add('concert');
                        concertDiv.innerHTML = `
                            <h4>${concert.date} - ${concert.location}</h4>
                        `;
                        concertsContainer.appendChild(concertDiv);
                    });

                    // Añadir eventos a los botones de reproducción de canciones populares
                    document.querySelectorAll('.play-song-button').forEach(button => {
                        button.addEventListener('click', (event) => {
                            const index = event.target.getAttribute('data-index');
                            loadSong(index);
                        });
                    });

                    // Añadir eventos a los botones de ver álbumes
                    document.querySelectorAll('.play-album-button').forEach(button => {
                        button.addEventListener('click', (event) => {
                            const artistId = event.target.getAttribute('data-artist-id');
                            const albumTitle = event.target.getAttribute('data-album-title');
                            window.location.href = `../php/album_page.php?artistId=${artistId}&albumTitle=${encodeURIComponent(albumTitle)}`;
                        });
                    });
                } else {
                    console.error(`Artist with ID ${artistId} not found.`);
                }
            } else {
                console.error('No artists found in the data.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});