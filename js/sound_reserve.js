let currentSongIndex = 0;
let songs = [];
let sound = null;
let isPlaying = false;
let songSelected = false;
let isLooping = false;
let currentVolume = 0.5;
let previousVolume = currentVolume;

// Obtener el ID del artista de la URL
const params = new URLSearchParams(window.location.search);
const artistId = params.get('id');

// Función para cargar el JSON
fetch('../json/artists.json')
    .then(response => response.json())
    .then(data => {
        const artist = data.artists.find(a => a.id == artistId);
        if (artist && artist.popular_songs) {
            songs = artist.popular_songs;
            console.log('Canciones de popular songs cargadas:', songs);
            addPopularSongsListeners(); // Añadir listeners a las canciones de popular songs
        } else {
            console.error(`Artista con ID ${artistId} no encontrado o sin canciones populares.`);
        }
    })
    .catch(error => console.error('Error fetching data:', error));

// Función para cargar una canción
function loadSong(index, songList = songs) {
    const song = songList[index];
    if (!song) {
        console.error('No hay canción en el índice:', index);
        return;
    }
    songSelected = true; // Marcar que una canción ha sido seleccionada
    console.log('Cargando canción desde:', song.src); // Para verificar la ruta del audio

    // Detener y descargar la canción actual si existe
    if (sound) {
        sound.stop();
        sound.unload();
    }

    // Crear una nueva instancia de Howl para la canción seleccionada
    sound = new Howl({
        src: [song.src],
        html5: true,
        volume: currentVolume, // Establece el volumen actual
        loop: isLooping, // Aplica el estado de bucle
        onplay: () => {
            isPlaying = true; // Marcar como en reproducción
            document.getElementById("play-pause").innerHTML = "<i class='fas fa-pause'></i>"; // Ícono de 'pause'
        },
        onpause: () => {
            isPlaying = false; // Marcar como pausado
            document.getElementById("play-pause").innerHTML = "<i class='fas fa-play'></i>"; // Ícono de 'play'
        },
        onend: () => {
            if (!isLooping) { // Solo pasa a la siguiente canción si no está en bucle
                currentSongIndex = (currentSongIndex < songList.length - 1) ? currentSongIndex + 1 : 0;
                loadSong(currentSongIndex, songList);
                sound.play();
            }
        },
    });

    // Actualiza la información de la canción actual en el DOM
    document.getElementById("current-song-title").innerText = `${song.title}`;
    const currentSongImage = document.getElementById("current-song-image");
    currentSongImage.src = song.cover;
    currentSongImage.style.display = "block";

    sound.play();
}

// Función para añadir listeners a los botones de cada canción en popular songs
function addPopularSongsListeners() {
    const buttons = document.querySelectorAll('.play-song-button');
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            songSelected = true;
            currentSongIndex = index;
            loadSong(currentSongIndex, songs); // Asegúrate de pasar la lista de canciones correcta
            playSongImmediately();
        });
    });
}

// Función para alternar entre reproducción y pausa
function togglePlayPause() {
    if (!songSelected) { // Verifica si se ha seleccionado una canción
        alert("Por favor, selecciona una canción para reproducir.");
        return;
    }

    if (sound) {
        if (isPlaying) {
            sound.pause();
        } else {
            sound.play();
        }
    }
}

// Añadir evento al botón "Reproducir/Pausar" en el footer
document.getElementById("play-pause").addEventListener("click", togglePlayPause);

// Manejo de eventos para los botones de siguiente y anterior
document.getElementById('next').addEventListener('click', () => {
    console.log('songSelected:', songSelected);
    console.log('currentSongIndex before:', currentSongIndex);
    if (songSelected && songs.length > 0) {
        currentSongIndex = (currentSongIndex < songs.length - 1) ? currentSongIndex + 1 : 0;
        console.log('New currentSongIndex:', currentSongIndex);
        loadSong(currentSongIndex, songs);
        sound.play();
    } else {
        alert("Por favor, selecciona una canción para reproducir.");
    }
});

document.getElementById('prev').addEventListener('click', () => {
    console.log('songSelected:', songSelected);
    console.log('currentSongIndex before:', currentSongIndex);
    if (songSelected && songs.length > 0) {
        currentSongIndex = (currentSongIndex > 0) ? currentSongIndex - 1 : songs.length - 1;
        console.log('New currentSongIndex:', currentSongIndex);
        loadSong(currentSongIndex, songs);
        sound.play();
    } else {
        alert("Por favor, selecciona una canción para reproducir.");
    }
});

// Manejo del control de volumen
const volumeSlider = document.getElementById('volumeSlider');
volumeSlider.value = currentVolume;
volumeSlider.addEventListener('input', () => {
    currentVolume = volumeSlider.value;
    if (sound) {
        sound.volume(currentVolume);
    }
    console.log(`Volumen ajustado a: ${currentVolume}`);
});

// Botón de bucle
const bucleButton = document.getElementById('bucle');
bucleButton.addEventListener('click', () => {
    isLooping = !isLooping;
    if (sound) {
        sound.loop(isLooping);
    }
    bucleButton.style.backgroundColor = isLooping ? "green" : "red";
});

// Botón de silencio/volumen
const volumeButton = document.getElementById('volume'); // Este es el botón con el icono 🔊
volumeButton.style.backgroundColor = "green"; // El sonido está activado inicialmente

volumeButton.addEventListener('click', () => {
    if (volumeButton.style.backgroundColor === "green") {
        // Cambiar a modo silencio
        previousVolume = currentVolume; // Guardar el volumen actual
        currentVolume = 0; // Establecer el volumen a cero
        volumeButton.style.backgroundColor = "red"; // Cambiar el color del botón
        volumeButton.innerHTML = "🔇"; // Cambiar el icono a silenciado
        console.log("Silenciado");
    } else {
        // Restaurar el volumen previo
        currentVolume = previousVolume; // Restaurar el volumen guardado
        volumeButton.style.backgroundColor = "green"; // Cambiar el color del botón
        volumeButton.innerHTML = "🔊"; // Cambiar el icono a volumen activado
        console.log(`Volumen restaurado a: ${currentVolume}`);
    }

    if (sound) {
        sound.volume(currentVolume); // Aplicar el cambio de volumen en Howl
    }

    volumeSlider.value = currentVolume; // Sincronizar el slider con el volumen actual
});

const progressSlider = document.getElementById('progressSlider');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');

// Actualizar el rango de la barra de progreso en función de la duración de la canción
function updateProgressBar() {
    if (sound && sound.playing()) {
        const progress = (sound.seek() / sound.duration()) * 100;
        progressSlider.value = progress; // Actualiza el valor de la barra de progreso
        // Actualizar tiempo actual
        const currentSec = Math.floor(sound.seek());
        const durationSec = Math.floor(sound.duration());
        currentTime.innerText = formatTime(currentSec);
        duration.innerText = formatTime(durationSec);
    }
}

// Función para formatear el tiempo en minutos y segundos
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Actualizar la barra de progreso cada 500ms cuando la canción está en reproducción
setInterval(updateProgressBar, 500);

// Permitir que el usuario se desplace a un punto específico de la canción
progressSlider.addEventListener('input', () => {
    if (sound) {
        const seekTime = (progressSlider.value / 100) * sound.duration();
        sound.seek(seekTime); // Desplazar la canción al tiempo correspondiente
    }
});