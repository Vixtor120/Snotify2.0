// Some howler variables
let songVolume = 0.5;
let howler;

// Equalizer
// Get the audio context for the analyzer and get the number of samples
let analyser;
let bufferLength;
let dataArray;

// Get the canvas and the context to use the equalizer
let canvas = document.getElementById('equalizer');
let ctx = canvas.getContext('2d');

// Loading Songs
const loadSongs = async () => {
    // Aquí se asume que tienes un archivo JSON con la información de las canciones
    let response = await fetch('../json/artists.json');
    let data = await response.json();
    const artist = data.artists.find(a => a.id == artistId);
    if (artist) {
        const albumTitle = params.get('album'); // Obtener el título del álbum de la URL
        if (albumTitle) {
            const album = artist.albums.find(a => a.title === albumTitle);
            if (album && album.songs) {
                songs = album.songs; // Reemplazar las canciones con las del álbum
                console.log('Canciones del álbum cargadas:', songs);
                howler = new Howl({
                    src: [songs[0].src],
                    volume: songVolume
                });

                // Equalizer
                analyser = Howler.ctx.createAnalyser();    // Proporciona acceso a la frecuencia y los datos de tiempo del audio que está siendo reproducido.
                bufferLength = analyser.frequencyBinCount; // Indica el número de muestras de datos que se obtendrán del audio.
                dataArray = new Uint8Array(bufferLength);
                loadEqualizer();
                animateEqualizer();
            } else {
                console.error(`Álbum '${albumTitle}' no encontrado o sin canciones.`);
            }
        }
    } else {
        console.error(`Artista con ID ${artistId} no encontrado.`);
    }
}

function loadEqualizer() {
    // Conexión del masterGain (el volumen maestro de Howler.js) con el analyzer, permitiendo que el ecualizador recoja datos del audio que se está reproduciendo.
    Howler.masterGain.connect(analyser);

    // Conecta analyzer en el destino de audio. El audio sigue reproduciéndose en los altavoces o auriculares mientras se analiza
    analyser.connect(Howler.ctx.destination);

    // Coloca la frecuencia de muestreo. Obtiene un equilibrio entre la resolución temporal y la precisión de la frecuencia.
    analyser.fftSize = 2048;

    // Se utiliza para obtener los datos de forma de onda del audio en tiempo real, lo que se conoce como datos de dominio temporal. Devuelve la representación de la señal de audio en el dominio del tiempo, es decir, cómo varía la amplitud del sonido a lo largo del tiempo.
    analyser.getByteTimeDomainData(dataArray);
}

function animateEqualizer() {
    // Limpia el lienzo del canvas para pintar de nuevo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Obtiene los datos de frecuencia del audio. Cada valor del arreglo representa la amplitud de una frecuencia específica del espectro de audio, que luego se usa para dibujar las barras.
    analyser.getByteFrequencyData(dataArray);

    // Dibuja las barras del ecualizador
    let barWidth = (canvas.width / bufferLength) * 10;
    let barSpacing = 4;
    let barHeight;

    // Recorre el array de datos de frecuencia y dibuja las barras
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        let x = i * (barWidth + barSpacing);
        let y = canvas.height - barHeight;

        ctx.fillStyle = 'blue'; // Cambia el color de las barras según tu preferencia
        // Pinta la barra actual
        ctx.fillRect(x, y, barWidth, barHeight);
    }

    // Repite la animación
    requestAnimationFrame(animateEqualizer);
}

// On Load
document.addEventListener('DOMContentLoaded', loadSongs);