document.addEventListener("DOMContentLoaded", function () {
    // Selecciona el contenedor de artistas
    const artistsContainer = document.getElementById("artists-container");

    // Obtener el ID del usuario desde un campo oculto
    const userId = document.getElementById("user-id").value;

    // Función para obtener el estado de ánimo del usuario desde el archivo JSON
    function getUserMood() {
        return fetch("../json/users.json")
            .then(response => response.json())
            .then(users => {
                const user = users.find(user => user.id == userId);
                return user ? user.mood : '';
            });
    }

    // Función para cargar y mostrar los artistas desde el archivo JSON
    function loadArtists(userMood) {
        fetch("../json/artists.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al cargar el archivo JSON");
                }
                return response.json();
            })
            .then(data => {
                artistsContainer.innerHTML = ''; // Clear existing artists
                // Asegúrate de que estás accediendo a la propiedad correcta
                data.artists.forEach(artist => { // Iterar sobre cada artista
                    if (!userMood || artist.mood === userMood) {
                        // Crear la estructura HTML de cada artista
                        const artistDiv = document.createElement("div"); // Crear un div
                        artistDiv.classList.add("artist-img");  // Añadir la clase "artist-img"

                        const pageartist = `../php/artist_page.php?id=${artist.id}`; // Construir la URL para cada artista

                        artistDiv.innerHTML = ` 
                        <a href="${pageartist}"> 
                            <img src="${artist.image}" alt="${artist.name}">
                        </a>
                        <h4>${artist.name}</h4>
                    `; // Añadir la imagen y el nombre del artista

                        // Añadir el artista al contenedor
                        artistsContainer.appendChild(artistDiv);
                    }
                });
            })
            .catch(error => {
                console.error("Error al cargar los artistas:", error);
            });
    }

    // Obtener el estado de ánimo del usuario y cargar los artistas
    getUserMood().then(loadArtists);
});