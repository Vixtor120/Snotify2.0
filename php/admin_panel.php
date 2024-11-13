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
            'registration_date' => date('Y-m-d H:i:s'),
            'last_login' => date('Y-m-d H:i:s'),
            'role' => $_POST['role']
        ];
        $users[] = $new_user;
    } elseif (isset($_POST['delete_user'])) {
        $users = array_filter($users, function($user) {
            return $user['id'] != $_POST['user_id'];
        });
    }
    file_put_contents('../json/users.json', json_encode($users, JSON_PRETTY_PRINT));
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Panel de Control</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        :root {
            --primary-color: #4CAF50;
            --secondary-color: #333;
            --background-dark: #181818;
            --background-darker: #121212;
            --text-light: #f1f1f1;
        }
        body {
            background-color: var(--background-darker);
            color: var(--text-light);
        }
        .table-dark {
            background-color: var(--background-dark);
        }
        .card {
            background-color: var(--background-dark);
        }
        .add-user-form {
            background-color: #6c757d; /* Gray background */
        }
    </style>
</head>
<body class="bg-dark text-white">
    <div class="container mt-5">
        <div class="card">
            <div class="card-body text-center">
                <img src="../images/logo.png" alt="Snotify Logo" class="img-fluid mb-3" style="max-width: 150px;">
                <h1 class="text-center">Admin Panel</h1>
                <table class="table table-dark table-striped mt-4">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Image</th>
                            <th>Registration Date</th>
                            <th>Last Login</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($users as $user): ?>
                        <tr>
                            <td><?php echo $user['id']; ?></td>
                            <td><?php echo $user['username']; ?></td>
                            <td><img src="<?php echo $user['image']; ?>" alt="Avatar" width="50" class="rounded-circle"></td>
                            <td><?php echo $user['registration_date']; ?></td>
                            <td><?php echo $user['last_login']; ?></td>
                            <td><?php echo $user['role']; ?></td>
                            <td>
                                <form method="post" class="d-inline">
                                    <input type="hidden" name="user_id" value="<?php echo $user['id']; ?>">
                                    <select name="role" class="form-control d-inline w-auto">
                                        <option value="user" <?php if ($user['role'] == 'user') echo 'selected'; ?>>User</option>
                                        <option value="admin" <?php if ($user['role'] == 'admin') echo 'selected'; ?>>Admin</option>
                                    </select>
                                    <button type="submit" name="update_role" class="btn btn-primary">Actualizar Rol</button>
                                </form>
                                <form method="post" class="d-inline">
                                    <input type="hidden" name="user_id" value="<?php echo $user['id']; ?>">
                                    <button type="submit" name="delete_user" class="btn btn-danger">Eliminar</button>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>

                <h2 class="text-center">Añadir Nuevo Usuario</h2>
                <form method="post" id="add-user-form" class="add-user-form p-4 rounded" style="background-color:#333;">
                    <div class="form-group">
                        <label for="username">Username:</label>
                        <input type="text" id="username" name="username" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="image">Imagen:</label>
                        <div class="avatar-selection row">
                            <?php foreach ($avatars as $avatar): ?>
                                <div class="form-check col-3">
                                    <input type="radio" name="image" value="<?php echo $avatar['path']; ?>" class="form-check-input" required>
                                    <label class="form-check-label">
                                        <img src="<?php echo $avatar['path']; ?>" alt="<?php echo $avatar['name']; ?>" class="rounded-circle" width="30">
                                        <?php echo $avatar['name']; ?>
                                    </label>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="role">Role:</label>
                        <select id="role" name="role" class="form-control">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" name="add_user" class="btn btn-success">Añadir Usuario</button>
                </form>
                <form action="../php/index.php" method="get" class="mt-3 mb-3">
                    <button type="submit" class="btn btn-secondary">Volver al Index</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
