let currentSongIndex = 0;
let songs = [];
let sound = null;
let isPlaying = false;
let songSelected = false;
let isLooping = false;
let currentVolume = 0.5;
let previousVolume = currentVolume;
let isPaused = false; // Variable para rastrear si la canción está en pausa
let isEqualizerSetup = false; // Variable para rastrear si el ecualizador ya está configurado


// Equalizer variables
let analyser;
let bufferLength;
let dataArray;
let canvas = document.getElementById('equalizer');
let ctx = canvas.getContext('2d');

// Obtener el ID del artista de la URL
const params = new URLSearchParams(window.location.search);
const artistId = params.get('id');

// Función para cargar el JSON
fetch('../json/artists.json')
    .then(response => response.json())
    .then(data => {
        const artist = data.artists.find(a => a.id == artistId);
        if (artist) {
            const albumTitle = params.get('album'); // Obtener el título del álbum de la URL
            if (albumTitle) {
                const album = artist.albums.find(a => a.title === albumTitle);
                if (album && album.songs) {
                    songs = album.songs; // Reemplazar las canciones con las del álbum
                    console.log('Canciones del álbum cargadas:', songs);
                    addAlbumSongsListeners(); // Añadir listeners a las canciones del álbum
                    setupEqualizer(); // Configurar el ecualizador
                } else {
                    console.error(`Álbum '${albumTitle}' no encontrado o sin canciones.`);
                }
            }
        } else {
            console.error(`Artista con ID ${artistId} no encontrado.`);
        }
    })
    .catch(error => console.error('Error fetching data:', error));

// Función para cargar una canción y configurar el ecualizador
async function loadSongAsync(index, songList = songs) {
    const song = songList[index];
    if (!song) {
        console.error('No hay canción en el índice:', index);
        return;
    }

    // Actualizamos el índice de la canción seleccionada
    currentSongIndex = index;
    songSelected = true;
    console.log('Cargando canción desde:', song.src);

    if (sound) {
        sound.stop();
        sound.unload();
    }

    sound = new Howl({
        src: [song.src],
        html5: true,
        volume: currentVolume,
        loop: isLooping,
        onplay: () => {
            isPlaying = true;
            document.getElementById("play-pause").innerHTML = "<i class='fas fa-pause'></i>";
            if (!isEqualizerSetup) {
                setupEqualizer(); // Configurar el ecualizador solo una vez
            }
        },
        onpause: () => {
            isPlaying = false;
            document.getElementById("play-pause").innerHTML = "<i class='fas fa-play'></i>";
        },
        onend: () => {
            // Solo avanzar al siguiente si no estamos en modo loop
            if (!isLooping) {
                // Avanzar al siguiente índice y verificar el límite
                currentSongIndex = (currentSongIndex < songList.length - 1) ? currentSongIndex + 1 : 0;
                loadSongAsync(currentSongIndex, songList);
                sound.play(); // Asegurarse de que la siguiente canción se reproduzca automáticamente
            }
        },
    });

    document.getElementById("current-song-title").innerText = `${song.title}`;
    const currentSongImage = document.getElementById("current-song-image");
    currentSongImage.src = song.cover;
    currentSongImage.style.display = "block";

    // Reproduce la canción después de cargar
    sound.play();
}

// Función para añadir listeners a las canciones del álbum
function addAlbumSongsListeners() {
    const buttons = document.querySelectorAll('.play-song-button');
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            songSelected = true;
            currentSongIndex = index;
            loadSongAsync(currentSongIndex, songs); // Asegúrate de pasar la lista de canciones correcta
        });
    });
}

function togglePlayPause() {
    if (!songSelected) { // Verifica si se ha seleccionado una canción
        alert("Por favor, selecciona una canción para reproducir.");
        return;
    }

    if (sound) {
        if (isPlaying) {
            sound.pause();
            isPlaying = false;
        } else {
            sound.play();
            isPlaying = true;
            if (!isEqualizerSetup) {
                setupEqualizer(); // Configurar el ecualizador solo una vez
            }
        }
    }
}

// Asegúrate de que la animación del ecualizador se inicie al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    if (!isEqualizerSetup) {
        setupEqualizer();
    }
});

// Función para manejar el evento de siguiente canción
async function handleNextSong() {
    console.log('songSelected:', songSelected);
    console.log('currentSongIndex before:', currentSongIndex);
    if (songSelected && songs.length > 0) {
        currentSongIndex = (currentSongIndex < songs.length - 1) ? currentSongIndex + 1 : 0;
        console.log('New currentSongIndex:', currentSongIndex);
        await loadSongAsync(currentSongIndex, songs);
        sound.play();
    }
}

// Función para manejar el evento de canción anterior
async function handlePrevSong() {
    console.log('songSelected:', songSelected);
    console.log('currentSongIndex before:', currentSongIndex);
    if (songSelected && songs.length > 0) {
        currentSongIndex = (currentSongIndex > 0) ? currentSongIndex - 1 : songs.length - 1;
        console.log('New currentSongIndex:', currentSongIndex);
        await loadSongAsync(currentSongIndex, songs);
        sound.play();
    } else {
        alert("Por favor, selecciona una canción para reproducir.");
    }
}

// Función para manejar el evento de mute
function toggleMute() {
    const volumeButton = document.getElementById('volume');
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

    const volumeSlider = document.getElementById('volumeSlider');
    volumeSlider.value = currentVolume; // Sincronizar el slider con el volumen actual
}

// Función para manejar el evento de loop
function toggleLoop() {
    isLooping = !isLooping;
    if (sound) {
        sound.loop(isLooping);
    }
    const bucleButton = document.getElementById('bucle');
    bucleButton.style.backgroundColor = isLooping ? "green" : "red";
}

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

// Función para configurar el ecualizador
function setupEqualizer() {
    if (!Howler.ctx) {
        console.error("Howler context is not available.");
        return;
    }
    analyser = Howler.ctx.createAnalyser();    // Proporciona acceso a la frecuencia y los datos de tiempo del audio que está siendo reproducido.
    bufferLength = analyser.frequencyBinCount; // Indica el número de muestras de datos que se obtendrán del audio.
    dataArray = new Uint8Array(bufferLength);
    loadEqualizer();
    animateEqualizer();
}

function loadEqualizer() {
    // Conexión entre el nodo de sonido y el analizador
    if (sound && !isEqualizerSetup) {
        const source = Howler.ctx.createMediaElementSource(sound._sounds[0]._node);
        source.connect(analyser); // Conectar el nodo de sonido al analizador
        analyser.connect(Howler.ctx.destination); // Conectar el analizador a la salida de audio
        isEqualizerSetup = true; // Marcar que el ecualizador ya está configurado
    }
}

function animateEqualizer() {
    requestAnimationFrame(animateEqualizer); // Solicita un nuevo cuadro de animación.
    analyser.getByteFrequencyData(dataArray); // Llenar el array con datos de frecuencias.

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas para la nueva animación.
    const barWidth = (canvas.width / bufferLength) * 2.0; // Ancho de cada barra.
    let barHeight; // Altura de cada barra.

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i]; // Obtener la altura de la barra del array.
        const x = i * barWidth; // Posición en el canvas.
        ctx.fillStyle = 'green'; // Cambia el color de las barras según tu preferencia
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2); // Dibujar la barra en el canvas.
    }
}
