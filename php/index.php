<?php
session_start();
$user_id = $_SESSION['user_id'] ?? null;
$user = null;

if ($user_id) {
    $filePath = '../json/users.json';
    if (file_exists($filePath)) {
        $json = file_get_contents($filePath);
        $users = json_decode($json, true) ?? []; // Ensure $users is always an array
        if (is_array($users)) { // Ensure $users is an array
            foreach ($users as $u) {
                if ($u['id'] == $user_id) {
                    $user = $u;
                    break;
                }
            }
        }
    }
}
?>
<!DOCTYPE HTML5>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/user.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <title>Snotify</title>
    <style>
        .admin-panel-button {
            background-color: #4CAF50; /* Green background */
            border: none; /* Remove borders */
            color: white; /* White text */
            padding: 10px 20px; /* Some padding */
            text-align: center; /* Centered text */
            text-decoration: none; /* Remove underline */
            display: inline-block; /* Get the element to line up correctly */
            font-size: 16px; /* Increase font size */
            margin: 4px 2px; /* Some margin */
            cursor: pointer; /* Pointer/hand icon */
            border-radius: 12px; /* Rounded corners */
            transition: background-color 0.3s; /* Smooth transition */
            margin: 10px;
        }

        .admin-panel-button:hover {
            background-color: #45a049; /* Darker green on hover */
        }
    </style>
</head>

<body>

    <header class="navbar">
        <img src="../images/logo.png" alt="Logo" class="logo">
        <input type="text" placeholder="Buscar Artistas">
        <?php if ($user): ?>
        <div class="user-section" style="margin:10px;">
            <a href="user_profile.php?id=<?php echo $user['id']; ?>">
                <span><?php echo $user['username']; ?></span>
                <img src="<?php echo $user['image']; ?>" alt="User Image" class="user-image">
            </a>
            <?php if ($user['role'] === 'admin'): ?>
            <a href="admin_panel.php" class="admin-panel-button">Panel de Control</a>
            <?php endif; ?>
        </div>
        <?php else: ?>
        <div class="auth-links">
            <a href="../php/login.php" class="admin-panel-button">Login</a>
            <a href="../php/register.php" class="admin-panel-button">Register</a>
        </div>
        <?php endif; ?>
    </header>

    <div class="container">

        <aside class="sidebar-left">
            <div class="popular-songs">
                <h3>Canciones Populares</h3>
                <div class="song">
                    <img src="../images/beliver.jpg" alt="Song Cover">
                    <span>Beliver</span>
                </div>
                <div class="song">
                    <img src="../images/shakeitoff.jpg" alt="Song Cover">
                    <span>Shake It Off</span>
                </div>
                <div class="song">
                    <img src="../images/origins.jpg" alt="Song Cover">
                    <span>Natural</span>
                </div>
                <div class="song">
                    <img src="../images/loom.jpg" alt="Song Cover">
                    <span>Wake Up</span>
                </div>
            </div>
            <div class="popular-artists">
                <h3>Artistas Populares</h3>
                <div class="artist">
                    <img src="../images/imaginedragons.jpg" alt="Artist Avatar">
                    <span>Imagine Dragons</span>
                </div>
                <div class="artist">
                    <img src="../images/taylorswift.jpg" alt="Artist Avatar">
                    <span>Taylor Swift</span>
                </div>
                <div class="artist">
                    <img src="../images/coldplay.jpg" alt="Artist Avatar">
                    <span>Coldplay</span>
                </div>
                <div class="artist">
                    <img src="../images/laurapausini.jpg" alt="Artist Avatar">
                    <span>Laura Pausini</span>
                </div>
            </div>
            <div class="anuncio">
                <button class="close-button">&times;</button>
                <img src="../images/anuncio.jpg" alt="Anuncio">
            </div>
        </aside>

        <main class="main-content">
            <div class="artists-photomain" id="artists-container"></div>
            <div class="favorite-songs">
                <h3>Canciones Favoritas</h3>
                <div id="favorite-songs-container"></div>
            </div>
        </main>

        <aside class="sidebar-right">
            <div class="radios">
                <h3>Radios</h3>
                <div class="radio">
                    <img src="../images/mirchi.png" alt="Radio Avatar">
                    <span>Radio Mirchi</span>
                    <button class="play-button" data-id="1">Play</button>
                </div>
                <div class="radio">
                    <img src="../images/AntenneBayern.png" alt="Radio Avatar">
                    <span>Antenne Bayern</span>
                    <button class="play-button" data-id="3">Play</button>
                </div>
                <div class="radio">
                    <img src="../images/RockAntenne.png" alt="Radio Avatar">
                    <span>Rock Antenne</span>
                    <button class="play-button" data-id="4">Play</button>
                </div>
                <div class="radio">
                    <img src="../images/radiomarca.png" alt="Radio Avatar">
                    <span>Radio Marca</span>
                    <button class="play-button" data-id="5">Play</button>
                </div>
                <div class="radio">
                    <img src="../images/los40.png" alt="Radio Avatar">
                    <span>Los 40</span>
                    <button class="play-button" data-id="6">Play</button>
                </div>
                <div class="radio">
                    <img src="../images/cadenaser.png" alt="Radio Avatar">
                    <span>Cadena Ser</span>
                    <button class="play-button" data-id="7">Play</button>
                </div>
            </div>
            <div class="player-controls">
                <div class="controls">
                    <button id="prev" class="btn"><i class="fas fa-backward"></i></button>
                    <button id="play-pause" class="btn"><i class="fas fa-play"></i></button>
                    <button id="next" class="btn"><i class="fas fa-forward"></i></button>
                </div>
                <div class="volume-control">
                    <button id="volume" class="control-button">🔊</button>
                    <input type="range" id="volumeSlider" min="0" max="1" step="0.1" value="1">
                </div>
            </div>
            <img src="../images/VINILO.png" alt="Vinyl" class="vinyl" id="vinyl">
        </aside>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>
    <script src="../js/radios.js"></script>
    <script src="../js/artists.js"></script>
    <script src="../js/search.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const closeButton = document.querySelector('.anuncio .close-button');
            closeButton.addEventListener('click', () => {
                const anuncio = document.querySelector('.anuncio');
                anuncio.style.display = 'none'; // Oculta el anuncio
            });

            const playButtons = document.querySelectorAll('.play-button');
            const vinyl = document.getElementById('vinyl');

            playButtons.forEach(button => {
                button.addEventListener('click', () => {
                    vinyl.classList.add('playing');
                });
            });

            const playPauseButton = document.getElementById('play-pause');
            playPauseButton.addEventListener('click', () => {
                if (vinyl.classList.contains('playing')) {
                    vinyl.classList.remove('playing');
                } else {
                    vinyl.classList.add('playing');
                }
            });

            // Load favorite songs
            const favoriteSongsContainer = document.getElementById('favorite-songs-container');
            fetch('../json/favorite_songs.json')
                .then(response => response.json())
                .then(data => {
                    data.favorite_songs.forEach(song => {
                        const songDiv = document.createElement('div');
                        songDiv.classList.add('song');
                        songDiv.innerHTML = `
                            <img src="${song.cover}" alt="${song.title}">
                            <span>${song.title}</span>
                        `;
                        favoriteSongsContainer.appendChild(songDiv);
                    });
                })
                .catch(error => console.error('Error loading favorite songs:', error));
        });
    </script>
</body>
</html>