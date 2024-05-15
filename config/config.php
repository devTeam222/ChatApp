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

class User
{
    public $data;

    // Constructeur de la classe
    public function __construct($array = [])
    {
        $this->data = $array;
    }
    // Fonction membre de la classe
    public function getData()
    {
        if (!count($this->data)) {
            return;
        }
        $result = [
            "user_id" => $this->data['id'],
            "username" => $this->data['fullnames'],
            "name" => $this->data['username'],
            "profile_img" => "./assets/image.php?id=" . $this->data['image_file'],
            "last_seen" => $this->data['lastseen'],
        ];
        return $result;
    }
}

class Message
{
    public $data;

    // Constructeur de la classe
    public function __construct($array = [])
    {
        $this->data = $array;
    }
    // Fonction membre de la classe
    public function getData()
    {
        if (!count($this->data)) {
            return;
        }
        $result = [
            "id" => +$this->data['id'],
            "content" => $this->data['type'] != 'text'
                ? "./assets/file.php?id=" . $this->data['content']
                : $this->data['content'],
            "from" => $this->data['from'],
            "to" => $this->data['conversation'],
            "type" => $this->data['type'],
            "date" => $this->data['date'],
            "status" => $this->data['status'],
        ];
        return $result;
    }
}

class LastMessages
{
    public $data;
    public function __construct($array = [])
    {
        $this->data = $array;
    }
    public function getData()
    {
        if (!count($this->data)) {
            return;
        }
        $result = [
            "user" => $this->data['id'],
            "content" => $this->data['content'],
            "date" => $this->data['date'],
            "unread" => $this->data['unread'],
            "type" => $this->data['type'],
        ];
        return $result;
    }
}