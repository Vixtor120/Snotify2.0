<?php
session_start();

$jsonFile = '../json/users.json';
$jsonData = file_get_contents($jsonFile);
$users = json_decode($jsonData, true);

$message = ''; // Variable to store messages

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $userId = $_SESSION['user_id']; // Asumiendo que el ID del usuario está almacenado en la sesión

    // Leer el archivo JSON
    $jsonFile = '../json/users.json';
    $jsonData = file_get_contents($jsonFile);
    $users = json_decode($jsonData, true);

    if (isset($_POST['update_username'])) {
        $username = $_POST['username'];

        // Actualizar el nombre de usuario en el JSON
        foreach ($users as &$user) {
            if ($user['id'] == $userId) {
                $user['username'] = $username;
                break;
            }
        }
    }

    if (isset($_POST['update_avatar'])) {
        // Manejar la selección de la imagen de avatar
        if (isset($_POST['avatar_image'])) {
            $avatarImage = $_POST['avatar_image'];

            // Actualizar la imagen de avatar en el JSON
            foreach ($users as &$user) {
                if ($user['id'] == $userId) {
                    $user['image'] = $avatarImage;
                    break;
                }
            }
        }
    }

    if (isset($_POST['update_password'])) {
        $currentPassword = $_POST['current_password'];
        $newPassword = $_POST['new_password'];

        // Verificar la contraseña actual y actualizar la nueva contraseña en el JSON
        $passwordUpdated = false;
        foreach ($users as &$user) {
            if ($user['id'] == $userId) {
                if (password_verify($currentPassword, $user['password'])) {
                    $user['password'] = password_hash($newPassword, PASSWORD_DEFAULT);
                    $passwordUpdated = true;
                }
                break;
            }
        }

        if ($passwordUpdated) {
            $message = 'Contraseña actualizada con éxito.';
        } else {
            $message = 'Contraseña actual incorrecta.';
        }
    }

    if (isset($_POST['delete_account'])) {
        // Eliminar la cuenta del usuario
        foreach ($users as $key => $user) {
            if ($user['id'] == $userId) {
                unset($users[$key]);
                break;
            }
        }
        // Guardar los cambios en el archivo JSON
        file_put_contents($jsonFile, json_encode($users, JSON_PRETTY_PRINT));
        session_destroy();
        header("Location: ../php/register.php?message=" . urlencode('Cuenta eliminada con éxito.'));
        exit();
    }

    if (isset($_POST['logout'])) {
        session_destroy();
        header("Location: login.php");
        exit();
    }

    // Guardar los cambios en el archivo JSON
    file_put_contents($jsonFile, json_encode($users, JSON_PRETTY_PRINT));

    // Redirigir de vuelta al perfil del usuario
    header("Location: user_profile.php?message=" . urlencode($message));
    exit();
}

// Leer el archivo JSON de avatares
$avatarJsonFile = '../json/imagenes_avatar.json'; // Update the file path
$avatarJsonData = @file_get_contents($avatarJsonFile); // Suppress error with @
$avatarImages = $avatarJsonData ? json_decode($avatarJsonData, true) : [];

// Obtener el nombre de usuario actual, rol y otra información
$currentUsername = '';
$registrationDate = '';
$lastLogin = '';
$userRole = ''; // Variable para almacenar el rol del usuario
foreach ($users as $user) {
    if ($user['id'] == $_SESSION['user_id']) {
        $currentUsername = $user['username'];
        $registrationDate = $user['registration_date'];
        $lastLogin = $user['last_login'];
        $userRole = $user['role']; // Obtener el rol del usuario
        break;
    }
}

// Mostrar mensaje si existe
if (isset($_GET['message'])) {
    echo '<p>' . htmlspecialchars($_GET['message']) . '</p>';
}
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="../css/user_profile.css">
        <title>Perfil de Usuario</title>
    </head>
<body>
<div class="user-profile">
    <img src="../images/logo.png" alt="Logo" class="logo">
    <h2>Editar Perfil</h2>
    <p>Fecha de Registro: <?php echo $registrationDate; ?></p>
    <p>Última vez que inició sesión: <?php echo $lastLogin; ?></p>
    <p>Rol de Usuario: <?php echo $userRole; ?></p> 
    <form action="user_profile.php" method="post" class="responsive-form">
        <div class="form-group">
            <label for="username">Nombre de Usuario:</label>
            <input type="text" id="username" name="username" value="<?php echo $currentUsername; ?>" required>
            <button type="submit" name="update_username">Guardar Nombre</button>
        </div>
    </form>
    <form action="user_profile.php" method="post" class="responsive-form">
        <div class="form-group">
            <label for="avatar_image">Seleccionar Avatar:</label>
            <div class="avatar-selection">
                <?php if (!empty($avatarImages)): ?>
                    <?php foreach ($avatarImages as $avatar): ?>
                        <label>
                            <input type="radio" name="avatar_image" value="<?php echo $avatar['path']; ?>">
                            <img src="<?php echo $avatar['path']; ?>" alt="<?php echo $avatar['name']; ?>" style="width: 50px; height: 50px;">
                        </label>
                    <?php endforeach; ?>
                <?php else: ?>
                    <p>No hay avatares disponibles.</p>
                <?php endif; ?>
            </div>
            <button type="submit" name="update_avatar">Guardar Imagen</button>
        </div>
    </form>
    <form action="user_profile.php" method="post" class="responsive-form">
    <div class="form-group">
        <label for="current_password">Contraseña Actual:</label>
        <input type="password" id="current_password" name="current_password" required>
    </div>
    <div class="form-group">
        <label for="new_password">Nueva Contraseña:</label>
        <input type="password" id="new_password" name="new_password" required>
        <?php if (isset($message) && !empty($message)): ?>
        <p style="color=red;" class="success-message"><?php echo htmlspecialchars($message); ?></p>
        <?php endif; ?>
    </div>

    <button type="submit" name="update_password" style="margin: 5px;">Guardar Contraseña</button>
</form>

    <div class="button-grid">
        <form action="user_profile.php" method="post">
            <button type="submit" name="delete_account" onclick="return confirm('¿Estás seguro de que deseas eliminar tu cuenta?');">Eliminar Cuenta</button>
        </form>
        <form action="../php/index.php" method="get"> 
            <button type="submit">Volver al Index</button>
        </form>
        <form action="user_profile.php" method="post"> <!-- Updated form for logout -->
            <button type="submit" name="logout">Cerrar Sesión</button>
        </form>
    </div>
</div>
</body>
</html>
