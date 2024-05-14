<?php
require_once('../config/config.php');

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
            "to" => $this->data['to'],
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

class GetData
{
    private $db;
    public $data;
    private $myId;

    // Constructeur de la classe
    public function __construct($array = [])
    {
        global $db;
        $this->db = $db;
        $this->data = $array;
        if (isset($_SESSION['id'])) {
            $this->myId =  +$_SESSION['id'];
        }
    }

    // Fonction membre de la classe
    public function getUsers()
    {
        $id = isset($this->data['id']) ? $this->data['id'] : 0;

        if ($id) {
            $getFromDb = $this->db->prepare("SELECT * FROM `users` WHERE id = ?");
            $getFromDb->execute([$id]);
            $user = $getFromDb->fetch();
            $object = new User($user);
            return $object->getData();
        } else {
            $result = [];
            $getFromDb = $this->db->query("SELECT * FROM `users` ORDER BY `lastseen` DESC");
            while ($row = $getFromDb->fetch()) {
                $object = new User($row);
                $result[] = $object->getData();
            }
            return $result;
        }
    }
    private function getUnreadMessages($id)
    {
        $chat = $id;
        $get_messages = $this->db->prepare("SELECT * FROM `messages` WHERE (`from` = ? AND `to` = ? AND NOT `status` = ?) ORDER BY `date` DESC");
        $get_messages->execute([$chat, $this->myId, 1]);
        $result = $get_messages->rowCount();
        return $result;
    }
    public function getMessages()
    {
        if (!count($this->data) || !$this->data['chat']) {
            return [];
        }
        $chat = $this->data['chat'];


        $get_messages = $this->db->prepare("SELECT * FROM `messages` WHERE ( `from` = ? AND `to` = ? ) OR ( `from` = ? AND `to` = ? ) ORDER BY `date` DESC");
        $get_messages->execute([$chat, $this->myId, $this->myId, $chat]);
        $result = [];
        while ($message = $get_messages->fetch()) {
            if ($message['to'] == $this->myId) {
                $update_message = $this->db->prepare("UPDATE `messages` SET `status` = ? WHERE id = ?");
                $update_message->execute([1, $message['id']]);
            }
            $object = new Message($message);
            $result[] = $object->getData();
        }
        return $result;
    }
    private function updateUserActivity($id)
    {
        $update_activity = $this->db->prepare("UPDATE `users` SET lastseen = ? WHERE id = ?");
        $update_activity->execute([time() + 30, $id]);
    }

    public function logout()
    {
        session_destroy();
        return true;
    }
    public function getLastMessages()
    {
        $this->updateUserActivity($this->myId);
        $last_messages = [];
        $chats = [];
        $get_all_messages = $this->db->prepare("SELECT * FROM `messages`  WHERE (`from` = ? OR `to` = ? )  ORDER BY `date` DESC");
        $get_all_messages->execute([$this->myId, $this->myId]);

        while ($message = $get_all_messages->fetch()) {
            if ($message['status'] != 1) {
                $update_message = $this->db->prepare("UPDATE `messages` SET `status` = ? WHERE id = ? AND `to` = ?");
                $update_message->execute([2, $message['id'], $this->myId]);
            }


            $chat = ($message['from'] == $this->myId) ? $message['to'] : $message['from'];

            $unread_messages = $this->getUnreadMessages($chat);

            $content = ($message['from'] == $this->myId) ? "Vous: " . $message['content'] : $message['content'];
            $content = (strlen($content) > 35) ? substr($content, 0, 35) . "..." : $content;

            $attachmentText = ($message['from'] == $this->myId) ? "Vous avez envoyé une photo" : "Vous a envoyé une photo";

            $content = ($message['type'] != "text") ? $attachmentText : $content;
            $array = [
                "id" => $chat,
                "content" => $content,
                "date" => $message['date'],
                "type" => $message['type'],
                "unread" => $unread_messages,
            ];

            $object = new LastMessages($array);
            if (!in_array($chat, $chats)) {
                $chats[] = $chat;
                $last_messages[] = $object->getData();
            }
        }
        $response = [];
        foreach ($last_messages as $last_message) {
            if (isset($_SESSION['current_messages']) && count($_SESSION['current_messages'])) {
                $saved_lastmessages = $_SESSION['current_messages'];
                $findIfDisplayed = findObjectWithKey($saved_lastmessages, "user", $last_message['user']);
                if ($findIfDisplayed && $findIfDisplayed['date'] != $last_message['date']
                || $findIfDisplayed &&  $findIfDisplayed['unread'] != $last_message['unread']) {
                    $response[] = $last_message;
                }
            } else {
                $response[] = $last_message;
            }
        }
        if (!count($response)) {
            $_SESSION['current_messages'] = [];
            return [];
        }
        $_SESSION['current_messages'] = $response;
        return $response;
    }
    public function checkUniqueUserName()
    {
        $username = $this->data['username'];
        $getFromDb = $this->db->prepare("SELECT * FROM `users` WHERE username = ?");
        $getFromDb->execute([$username]);
        $is_unique = !$getFromDb->rowCount();
        return $is_unique;
    }
};

// Fonction pour trouver un objet dans le tableau en fonction de la valeur d'une clé
function findObjectWithKey($array, $key, $valeur)
{
    foreach ($array as $objet) {
        if ($objet[$key] === $valeur) {
            return $objet;
        }
    }
    return false; // Retourne null si l'objet n'est pas trouvé
}


if (isset($_POST['get_user'])) {
    if (!isset($_SESSION['auth'])) {
        echo json_encode([]);
        return;
    }
    $data = new GetData(["id" => $_SESSION['id']]);

    $user = $data->getUsers();
    if (isset($user["user_id"])) {
        echo json_encode($user);
    }
};
if (isset($_POST['last_messages'])) {
    if (!isset($_SESSION['auth'])) {
        $response = [
            "session_error" => true,
        ];
        echo json_encode($response);
        return;
    }
    $data = new GetData(["id" => $_SESSION['id']]);

    $last_messages = $data->getLastMessages();
    $users = [];

    foreach ($last_messages as $key => $message) {
        $userData = new GetData(["id" => +$message['user']]);
        $user = $userData->getUsers();

        $users['user_' . $message['user']] = $user;
    }

    $response = [
        "last_messages" => $last_messages,
        "sess" => $_SESSION['current_messages'],
    ];

    echo json_encode($response);
};
if (isset($_POST['get_lastusers'])) {
    if (!isset($_SESSION['auth'])) {
        $response = [
            "session_error" => true,
        ];
        echo json_encode($response);
        return;
    }

    $last_messages = $_SESSION['current_messages'];
    $last_users = $_SESSION['current_messages'];
    $users = [];

    foreach ($last_messages as $key => $message) {
        $userData = new GetData(["id" => +$message['user']]);
        $user = $userData->getUsers();
        if(isset($_SESSION['last_users']) && isset($_SESSION['last_users']['user_' . $message['user']])){
            $saved_user = $_SESSION['last_users']['user_' . $message['user']];
            if ($saved_user['last_seen'] != $user['last_seen'] 
            || $saved_user['username'] != $user['username']
            || $saved_user['profile_img'] != $user['profile_img']) {
                $users['user_' . $message['user']] = $user;
            }
        }else{
            $users['user_' . $message['user']] = $user;
        }
    }

    $response = [
        "users" => $users,
    ];
    $_SESSION['last_users'] = $response;
    if (!count($response['users'])) {
        $_SESSION['last_users'] = [];
    }
    echo json_encode($response);
};
if (isset($_POST['get_available_users'])) {
    if (!isset($_SESSION['auth'])) {
        $response = [
            "session_error" => true,
        ];
        echo json_encode($response);
        return;
    }
    $data = new GetData();

    $users = $data->getUsers();

    $response = [
        "users" => $users,
    ];

    echo json_encode($response);
};
if (isset($_POST['chat'])) {
    if (!isset($_SESSION['auth'])) {
        $response = [
            "session_error" => true,
        ];
        echo json_encode($response);
        return;
    }
    $data = new GetData(["chat" => $_POST['chat']]);

    $messages = $data->getMessages();

    $response = $messages;

    echo json_encode($response);
};
if (isset($_POST['check_empty'])) {
    $response = !empty(trim($_POST['check_empty'])) ? [
        "success" => [
            "message" => "",
        ]
    ] : [
        "error" => [
            "message" => "Oups ! il semble que ce champ est invalide ou vide.",
        ]
    ];
    echo json_encode($response);
};
if (isset($_POST['check_username'])) {
    if (preg_match('/^[a-zA-Z0-9]+$/', $_POST['check_username'])) {
        $data = new GetData(["username" => $_POST['check_username']]);

        $isUnique = $data->checkUniqueUserName();

        $response = $isUnique ? [
            "success" => [
                "message" => "Votre nom d'utilisateur est valide et unique",
            ]
        ] : [
            "error" => [
                "message" => "Oups ! il semble que quelqu'un a déjà pris ce nom d'utilisateur",
            ]
        ];
    }
    !preg_match('/^[a-zA-Z0-9]+$/', $_POST['check_username']) && $response = [
        "error" => [
            "message" => "Vous ne pouvez pas utiliser ce nom d'utilisateur, il n'est pas valide.",
        ]
    ];
    echo json_encode($response);
};
