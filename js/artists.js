document.addEventListener("DOMContentLoaded", function () {
    // Selecciona el contenedor de artistas
    const artistsContainer = document.getElementById("artists-container");

    // Función para cargar y mostrar los artistas desde el archivo JSON
    function loadArtists() {
        fetch("../json/artists.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al cargar el archivo JSON");
                }
                return response.json();
            })
            .then(data => {
                // Asegúrate de que estás accediendo a la propiedad correcta
                data.artists.forEach(artist => { // Iterar sobre cada artista
                    // Crear la estructura HTML de cada artista
                    const artistDiv = document.createElement("div"); // Crear un div
                    artistDiv.classList.add("artist-img");  // Añadir la clase "artist-img"

                    const pageartist = `../php/artist_page.php?${artist.id}`; // Construir la URL para cada artista

                    artistDiv.innerHTML = ` 
                    <a href="#" onclick="window.location.href='${pageartist}'"> 
                        <img src="${artist.image}" alt="${artist.name}">
                    </a>
                    <h4>${artist.name}</h4>
                `; // Añadir la imagen y el nombre del artista

                    // Añadir el artista al contenedor
                    artistsContainer.appendChild(artistDiv);
                });
            })
            .catch(error => {
                console.error("Error al cargar los artistas:", error);
            });
    }

    // Llama a la función para cargar los artistas
    loadArtists();
});