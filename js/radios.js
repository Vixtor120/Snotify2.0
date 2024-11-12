let currentRadio = null;
let currentVolume = 1;
let previousVolume = currentVolume;
let currentButton = null; // Variable para almacenar el botón actual
let currentIndex = 0; // Índice actual de la radio

document.addEventListener('DOMContentLoaded', () => {
    fetchRadios();
    setupFooterControls();
});

async function fetchRadios() {
    try {
        const response = await fetch('../json/radios.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        assignRadioUrls(data.radios);
    } catch (error) {
        console.error('Error fetching radios:', error);
    }
}

function assignRadioUrls(radios) {
    radios.forEach((radio, index) => {
        const button = document.querySelector(`.play-button[data-id="${radio.id}"]`);
        if (button) {
            button.setAttribute('data-url', radio.src);
            button.setAttribute('data-index', index); // Asignar índice
            console.log(`Assigned URL ${radio.src} to button with ID ${radio.id}`);
        }
    });
    addPlayButtonListeners(); // Añadir listeners después de asignar las URLs
}

function addPlayButtonListeners() {
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const url = button.getAttribute('data-url');
            currentIndex = parseInt(button.getAttribute('data-index')); // Actualizar índice actual
            if (currentButton && currentButton !== button) {
                currentButton.innerHTML = 'Play'; // Restablecer el icono del botón anterior
            }
            currentButton = button;
            playRadio(url, button);
        });
    });
}

async function playRadio(url, button) {
    const playPauseButton = document.getElementById('play-pause');
    const playPauseIcon = playPauseButton.querySelector('i');

    if (currentRadio) {
        currentRadio.stop();
        if (currentButton) {
            currentButton.innerHTML = 'Play'; // Cambiar el icono a "play"
        }
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
    }

    currentRadio = new Howl({
        src: [url],
        html5: true,
        volume: currentVolume,
        onplay: () => {
            console.log('Playing:', url);
            button.innerHTML = 'Pause'; // Cambiar el icono a "pause"
            playPauseIcon.classList.remove('fa-play');
            playPauseIcon.classList.add('fa-pause');
        },
        onend: () => {
            button.innerHTML = 'Play'; // Cambiar el icono a "play" cuando termine
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
        }
    });

    currentRadio.play();
}

function setupFooterControls() {
    const playPauseButton = document.getElementById('play-pause');
    const volumeSlider = document.getElementById('volumeSlider');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    const volumeButton = document.getElementById('volume');

    playPauseButton.addEventListener('click', () => {
        if (currentRadio && currentRadio.playing()) {
            currentRadio.pause();
            playPauseButton.querySelector('i').classList.replace('fa-pause', 'fa-play');
        } else if (currentRadio) {
            currentRadio.play();
            playPauseButton.querySelector('i').classList.replace('fa-play', 'fa-pause');
        }
    });

    volumeSlider.addEventListener('input', () => {
        currentVolume = volumeSlider.value;
        if (currentRadio) {
            currentRadio.volume(currentVolume);
        }
        console.log(`Volumen ajustado a: ${currentVolume}`);
    });

    volumeButton.addEventListener('click', toggleMute);

    next.addEventListener('click', () => {
        const playButtons = document.querySelectorAll('.play-button');
        if (playButtons.length > 0) {
            currentIndex = (currentIndex < playButtons.length - 1) ? currentIndex + 1 : 0;
            const nextButton = playButtons[currentIndex];
            nextButton.click();
        } else {
            alert("No hay radios disponibles para reproducir.");
        }
    });

    prev.addEventListener('click', () => {
        const playButtons = document.querySelectorAll('.play-button');
        if (playButtons.length > 0) {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : playButtons.length - 1;
            const prevButton = playButtons[currentIndex];
            prevButton.click();
        } else {
            alert("No hay radios disponibles para reproducir.");
        }
    });

    if (currentRadio) {
        currentRadio.on('end', () => {
            playPauseButton.querySelector('i').classList.replace('fa-pause', 'fa-play');
        });
    }
}

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

    if (currentRadio) {
        currentRadio.volume(currentVolume); // Aplicar el cambio de volumen en Howl
    }

    const volumeSlider = document.getElementById('volumeSlider');
    volumeSlider.value = currentVolume; // Sincronizar el slider con el volumen actual
}