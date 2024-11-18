<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    // $user_image = $_FILES['user_image']['name'];
    // $target_dir = "../images/users/";
    // $target_file = $target_dir . basename($user_image);

    $filePath = '../json/users.json';
    if (file_exists($filePath)) {
        $json = file_get_contents($filePath);
        $users = json_decode($json, true);
        if (!is_array($users)) {
            $users = [];
        }
    } else {
        $users = [];
    }

    // Check if username already exists
    $usernameExists = false;
    foreach ($users as $user) {
        if ($user['username'] === $username) {
            $usernameExists = true;
            break;
        }
    }

    if ($usernameExists) {
        $message = "El nombre de usuario ya existe.";
    } elseif ($password === $confirm_password) {
        // if (!empty($user_image) && move_uploaded_file($_FILES['user_image']['tmp_name'], $target_file)) {
        //     $image_path = $target_file;
        // } else {
        //     $image_path = "../images/logo.png"; // Default image
        // }
        $image_path = "../images/avatar.png"; // Default image

        $userData = [
            'id' => count($users) + 1,
            'username' => $username,
            'password' => password_hash($password, PASSWORD_DEFAULT),
            'image' => $image_path,
            'registration_date' => date('Y-m-d H:i:s'),
            'last_login' => date('Y-m-d H:i:s'),
            'role' => 'user', // Add default role
            'mood' => '' // Add mood field
        ];

        $users[] = $userData;
        file_put_contents($filePath, json_encode($users, JSON_PRETTY_PRINT));
        $_SESSION['user_id'] = $userData['id'];
        header('Location: ../php/login.php');
        exit;
    } else {
        $message = "Las contraseñas no coinciden.";
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" href="../css/register.css">
</head>
<body>
    <img src="../images/logo.png" alt="Snotify Logo" class="logo">
    <h2>Register</h2>
    <form action="register.php" method="post" enctype="multipart/form-data">
        <label for="username">Usuario:</label>
        <input type="text" id="username" name="username" class="input-field" required>
        <br>
        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" class="input-field" required>
        <br>
        <label for="confirm_password">Confirmar Contraseña:</label>
        <input type="password" id="confirm_password" name="confirm_password" class="input-field" required>
        <br>
        <!-- <label for="user_image">Imagen de Usuario:</label>
        <input type="file" id="user_image" name="user_image" class="input-field">
        <br> -->
        <?php if (isset($message)) { echo "<p>$message</p>"; } ?>
        <input type="submit" value="Registrarse" class="submit-button">
    </form>
    <p>¿Ya tienes cuenta? <a href="login.php">Inicia sesión</a></p>
</body>
<script src="../js/register.js"></script>
</html>
