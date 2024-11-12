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
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/artistpage.css">
    <link rel="stylesheet" href="../css/user.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
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
    <title>Artist Page</title>
</head>

<body>
    <!-- Navbar -->
    <header class="navbar">
        <img src="../images/logo.png" alt="Logo" class="logo">
        <?php if ($user): ?>
        <div class="user-section">
            <a href="user_profile.php?id=<?php echo $user['id']; ?>">
                <span><?php echo $user['username']; ?></span>
                <img src="<?php echo $user['image']; ?>" alt="User Image" class="user-image">
            </a>
            <?php if ($user['role'] === 'admin'): ?>
            <a href="admin_panel.php" class="admin-panel-button">Panel de Control</a>
            <?php endif; ?>
        </div>
        <?php endif; ?>
        <div class="auth-buttons">
            <!--<button>Register</button>
          <button>Log In</button> -->
        </div>
    </header>

    <!-- Artist Banner -->
    <div class="artist-banner">
        <div class="artist-image">
            <img src="" alt="Artist Name" class="img-rounded">
        </div>
        <h1 class="artist-name">Artist Name</h1>
    </div>

    <!-- Main Container -->
    <div class="container">
        <!-- Popular Songs -->
        <section class="popular-songs">

            <h2>Canciones Populares</h2>
            <div id="popular-songs-container"></div>
        </section>

        <!-- Albums -->
        <section class="albums">
            <h2>Albums</h2>
            <div id="albums-container"></div>
        </section>

        <!-- Upcoming Concerts -->
        <section class="upcoming-concerts">
            <h2>Proximos Conciertos</h2>
            <div id="concerts-container"></div>
        </section>
    </div>

    <!-- Footer -->
    <footer class="player-controls">
        <div class="current-song">
            <img id="current-song-image" src="" alt="Current Song" style="display: none;" />
            <div style="margin: 10px;" id="current-song-title"></div>
        </div>

        <div class="controls">
            <button id="prev" class="btn"><i class="fas fa-backward"></i></button>
            <button id="play-pause" class="btn"><i class="fas fa-play"></i></button>
            <button id="next" class="btn"><i class="fas fa-forward"></i></button>
            <button id="bucle"><i class="fas fa-redo"></i>
            </button>

            <div class="progress-container">
                <span id="currentTime">0:00</span>
                <input type="range" id="progressSlider" value="0" min="0" max="100" />
                <span id="duration">0:00</span>
            </div>

            <button id="volume" class="control-button">🔊</button>
            <div class="volume-control">
                <input type="range" id="volumeSlider" min="0" max="1" step="0.1" value="1">
            </div>
        </div>
    </footer>

    <div style="height: 100px;"></div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>
    <script src="../js/artistpage.js"></script>
    <script src="../js/sound_popular_songs.js"></script>
    <script src="../js/equilizer.js"></script>
</body>

</html>