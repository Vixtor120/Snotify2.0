document.addEventListener("DOMContentLoaded", function () {
    // Selecciona el contenedor de artistas
    const artistsContainer = document.getElementById("artists-container");

    // Función para obtener el estado de ánimo del usuario desde la cookie
    function getUserMood() {
        const name = "user_mood=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    // Función para cargar y mostrar los artistas desde el archivo JSON
    function loadArtists(userMood) {
        console.log("User mood:", userMood); // Debugging line
        fetch("../json/artists.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al cargar el archivo JSON");
                }
                return response.json();
            })
            .then(data => {
                artistsContainer.innerHTML = ''; // Clear existing artists
                data.artists.forEach(artist => { // Iterar sobre cada artista
                    if (userMood && artist.mood === userMood) {
                        console.log("Displaying artist:", artist.name); // Debugging line
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
    const userMood = getUserMood();
    console.log("User mood from cookie:", userMood); // Debugging line
    if (userMood) {
        loadArtists(userMood);
    } else {
        console.log("No user mood found in cookie."); // Debugging line
    }
});