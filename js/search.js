document.addEventListener("DOMContentLoaded", function () {
    const artistsContainer = document.getElementById("artists-container");
    const searchBar = document.querySelector("header input[type='text']");
    let artistsData = [];

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
                artistsData = data.artists; // Guardar los datos de los artistas
                displayArtists(artistsData); // Mostrar todos los artistas inicialmente
            })
            .catch(error => {
                console.error("Error al cargar los artistas:", error);
            });
    }

    // Función para mostrar los artistas en el contenedor
    function displayArtists(artists) {
        artistsContainer.innerHTML = ""; // Limpiar el contenedor
        artists.forEach(artist => {
            const artistDiv = document.createElement("div");
            artistDiv.classList.add("artist-img");
            artistDiv.innerHTML = `
                <a href="artist_page.php?id=${artist.id}">
                    <img src="${artist.image}" alt="${artist.name}">
                </a>
                <h4>${artist.name}</h4>
            `;
            artistsContainer.appendChild(artistDiv);
        });
    }

    // Función para filtrar los artistas según el término de búsqueda
    function filterArtists(term) {
        const filteredArtists = artistsData.filter(artist => 
            artist.name.toLowerCase().includes(term.toLowerCase())
        );
        displayArtists(filteredArtists);
    }

    // Evento para el campo de búsqueda
    searchBar.addEventListener("input", (e) => {
        const searchTerm = e.target.value;
        filterArtists(searchTerm);
    });

    // Llama a la función para cargar los artistas
    loadArtists();
});