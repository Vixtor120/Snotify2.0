
<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $userId = $_SESSION['user_id'];
    $mood = $_POST['mood'];

    $jsonFile = '../json/users.json';
    $jsonData = file_get_contents($jsonFile);
    $users = json_decode($jsonData, true);

    foreach ($users as &$user) {
        if ($user['id'] == $userId) {
            $user['mood'] = $mood;
            $_SESSION['user_mood'] = $mood;
            break;
        }
    }

    file_put_contents($jsonFile, json_encode($users, JSON_PRETTY_PRINT));

    header("Location: index.php");
    exit();
}
?>