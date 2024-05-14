<?php
session_start();
// $_SESSION['auth'] = true;
// $_SESSION['id'] = 1;
!isset($_SESSION['lang']) && $_SESSION['lang'] = 'en';
$root = isset($root) ? $root : '../';
require_once($root . 'db/db.php');
// if (isset($_COOKIE['auth'])) {
//     $_SESSION['auth'] = true;
//     $_SESSION['id'] = $_COOKIE['id'];
//     $_SESSION['username'] = $_COOKIE['username'];
//     $_SESSION['fullnames'] = $_COOKIE['fullnames'];
// }
if (isset($_COOKIE['lang'])) {
    $_SESSION['lang'] = $_COOKIE['lang'];
}
if (isset($_SESSION['auth'])) {
    $check_user = $db->prepare('SELECT * FROM users WHERE id = ? ');
    $check_user->execute([$_SESSION['id']]);
    if ($check_user->rowCount() == 0) {
        $last_lang = $_SESSION['lang'];
        $_SESSION = [];
        session_destroy();
        session_start();
        $_SESSION['lang'] = $last_lang;
    } else {
        $user_data = $check_user->fetch();
        $_SESSION['id'] = $user_data['id'];
        $_SESSION['username'] = $user_data['username'];
        $_SESSION['fullnames'] = $user_data['fullnames'];
        $_SESSION['avatar'] = "./assets/image.php?id=".$user_data['image_file'];
    }
}
