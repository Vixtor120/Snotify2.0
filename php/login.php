<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $filePath = '../json/users.json';
    if (file_exists($filePath)) {
        $json = file_get_contents($filePath);
        $users = json_decode($json, true);
        if (is_array($users)) {
            foreach ($users as &$user) {
                if ($user['username'] === $username && password_verify($password, $user['password'])) {
                    $message = "Inicio de sesión exitoso.";
                    // Aquí puedes iniciar la sesión del usuario
                    $_SESSION['user_id'] = $user['id'];
                    $user['last_login'] = date('Y-m-d H:i:s');
                    file_put_contents($filePath, json_encode($users, JSON_PRETTY_PRINT));
                    header('Location: ../php/index.php');
                    exit;
                }
            }
            $message = "Usuario o contraseña incorrectos.";
        } else {
            $message = "No se encontraron usuarios registrados.";
        }
    } else {
        $message = "No se encontraron usuarios registrados.";
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="../css/login.css">
</head>
<body>
    <img src="../images/logo.png" alt="Snotify Logo" class="logo">
    <h2>Login</h2>
    <form action="login.php" method="post">
        <label for="username">Usuario:</label>
        <input type="text" id="username" name="username" class="input-field" required>
        <br>
        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" class="input-field" required>
        <br>
        <?php if (isset($message)) { echo "<p>$message</p>"; } ?>
        <input type="submit" value="Iniciar sesión" class="submit-button">
    </form>
    <p>¿No tienes cuenta? <a href="register.php">Regístrate</a></p>
</body>
<script src="../js/login.js"></script>
</html>
