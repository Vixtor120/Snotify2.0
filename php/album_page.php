<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/artistpage.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="../css/albumpage.css">
    <title>Album Page</title>
</head>

<body>
    <header class="navbar">
        <img src="../images/logo.png" alt="Logo" class="logo">
        <div class="auth-buttons">
            <button>Register</button>
            <button>Log In</button>
        </div>
    </header>

    <!-- Album Banner -->
    <div class="album-banner">
        <div class="album-image">
            <img src="" alt="Album Cover" class="img-rounded">
        </div>
        <h1 class="album-title">Album Title</h1>
    </div>

    <!-- Main Container -->
    <div class="container">
        <!-- Album Songs -->
        <section class="album-songs">
            <h2>Canciones del Álbum</h2>
            <div id="album-songs-container">
            </div>
        </section>
    </div>
    <!-- Footer -->
    <footer class="player-controls">

        <div class="current-song">
            <img id="current-song-image" src="" alt="Current Song" style="display: none;" />
            <div style="margin: 10px;" id="current-song-title"></div>
        </div>
    
        <div class="controls">
            <button id="prev" class="btn" onclick="handlePrevSong()"><i class="fas fa-backward"></i></button>
            <button id="play-pause" class="btn" onclick="togglePlayPause()"><i class="fas fa-play"></i></button>
            <button id="next" class="btn" onclick="handleNextSong()"><i class="fas fa-forward"></i></button>
            <button id="bucle" onclick="toggleLoop()"><i class="fas fa-redo"></i></button>
    
            <div class="progress-container">
                <span id="currentTime">0:00</span>
                <input type="range" id="progressSlider" value="0" min="0" max="100" />
                <span id="duration">0:00</span>
            </div>
    
            <button id="volume" class="control-button" onclick="toggleMute()">🔊</button>
            <div class="volume-control">
                <input type="range" id="volumeSlider" min="0" max="1" step="0.1" value="1">
            </div>
    
            <!-- Equalizer -->
            <div class="equalizer-container">
                <canvas id="equalizer" width="700" height="82"></canvas>
            </div>
        </div>
    </footer>

    <div style="height: 100px;"></div>
    <script src="../js/albumpage.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>
    <script src="../js/sound_albums.js"></script>
</body>

</html>

