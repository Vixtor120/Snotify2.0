<?php
// Leer el archivo JSON
$json_data = file_get_contents('../json/users.json');
$users = json_decode($json_data, true);

// Leer el archivo JSON de avatares
$avatars_data = file_get_contents('../json/imagenes_avatar.json');
$avatars = json_decode($avatars_data, true);

// Get the highest existing user ID
$max_id = max(array_column($users, 'id'));

// Guardar cambios en el archivo JSON
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['update_role'])) {
        foreach ($users as &$user) {
            if ($user['id'] == $_POST['user_id']) {
                $user['role'] = $_POST['role'];
                break;
            }
        }
    } elseif (isset($_POST['add_user'])) {
        $new_user = [
            'id' => $max_id + 1, // Increment the highest ID by 1
            'username' => $_POST['username'],
            'image' => $_POST['image'],
            'registration_date' => date('Y-m-d'),
            'last_login' => date('Y-m-d'),
            'role' => $_POST['role']
        ];
        $users[] = $new_user;
    }
    file_put_contents('../json/users.json', json_encode($users, JSON_PRETTY_PRINT));
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Panel de Control</title>
    <link rel="stylesheet" href="../css/panel.css">
    <style>
        body {
            background-color: #000;
            color: #fff;
        }
        .avatar-option {
            display: flex;
            align-items: center;
        }
        .avatar-option img {
            margin-right: 10px;
            border-radius: 50%;
            width: 30px;
            height: 30px;
        }
        .logo {
            display: block;
            margin: 0 auto;
            width: 150px;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="../images/logo.png" alt="Snotify Logo" class="logo">
        <h1>Admin Panel</h1>
        <table border="1">
            <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Image</th>
                <th>Registration Date</th>
                <th>Last Login</th>
                <th>Role</th>
                <th>Actions</th>
            </tr>
            <?php foreach ($users as $user): ?>
            <tr>
                <td><?php echo $user['id']; ?></td>
                <td><?php echo $user['username']; ?></td>
                <td><img src="<?php echo $user['image']; ?>" alt="Avatar" width="50"></td>
                <td><?php echo $user['registration_date']; ?></td>
                <td><?php echo $user['last_login']; ?></td>
                <td><?php echo $user['role']; ?></td>
                <td>
                    <form method="post">
                        <input type="hidden" name="user_id" value="<?php echo $user['id']; ?>">
                        <select name="role">
                            <option value="user" <?php if ($user['role'] == 'user') echo 'selected'; ?>>User</option>
                            <option value="admin" <?php if ($user['role'] == 'admin') echo 'selected'; ?>>Admin</option>
                        </select>
                        <button type="submit" name="update_role">Actualizar Rol</button>
                    </form>
                </td>
            </tr>
            <?php endforeach; ?>
        </table>

        <h2>Add New User</h2>
        <form method="post" id="add-user-form">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <label for="image">Imagen:</label>
            <div class="avatar-selection">
                <?php foreach ($avatars as $avatar): ?>
                    <label class="avatar-option">
                        <input type="radio" name="image" value="<?php echo $avatar['path']; ?>" required>
                        <img src="<?php echo $avatar['path']; ?>" alt="<?php echo $avatar['name']; ?>">
                        <?php echo $avatar['name']; ?>
                    </label>
                <?php endforeach; ?>
            </div>
            <label for="role">Role:</label>
            <select id="role" name="role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <button type="submit" name="add_user">Añadir Usuario</button>
        </form>
        <form action="../php/index.php" method="get">
            <button type="submit">Volver al Index</button>
        </form>
    </div>
</body>
</html>
