<?php
require_once('../config/config.php');

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
        $date = time();

        if ($id) {
            $getFromDb = $this->db->prepare("SELECT * FROM `users` WHERE id = ?");
            $getFromDb->execute([$id]);
            $user = $getFromDb->fetch();
            if ($user) {
                $object = new User($user);
                $response = $object->getData();
                if (isset($this->data['chat'])) {
                    $get_conversations = $this->db->prepare("SELECT * FROM `conversation`  WHERE (`creator` = ? AND `to_user` = ? OR `to_user` = ? AND `creator` = ? )  ORDER BY `date` DESC LIMIT 1");
                    $get_conversations->execute([$this->myId, $response['user_id'], $this->myId, $response['user_id']]);

                    if (!$get_conversations->rowCount()) {
                        $create_conversation = $this->db->prepare("INSERT INTO `conversation` (`creator`, `to_user`, `date`) VALUES (?, ?, ?)");
                        $create_conversation->execute([$this->myId, $response['user_id'], $date]);
                    }
                }
                return $response;
            }
        } else {
            $result = [];
            $getFromDb = $this->db->query("SELECT * FROM `users` ORDER BY `lastseen` DESC");
            while ($row = $getFromDb->fetch()) {
                $object = new User($row);
                $response = $object->getData();
                // if(isset($this->data['chat'])){
                $get_conversations = $this->db->prepare("SELECT * FROM `conversation`  WHERE (`creator` = ? AND `to_user` = ? OR `to_user` = ? AND `creator` = ? )  ORDER BY `date` DESC LIMIT 1");
                $get_conversations->execute([$this->myId, $response['user_id'], $this->myId, $response['user_id']]);

                if ($get_conversations->rowCount()) {
                    $conversation_id = $get_conversations->fetch()['id'];
                } else {
                    $create_conversation = $this->db->prepare("INSERT INTO `conversation` (`creator`, `to_user`, `date`) VALUES (?, ?, ?)");
                    $create_conversation->execute([$this->myId, $response['user_id'], $date]);
                    $conversation_id = $this->db->lastInsertId();
                }
                $response['user_id'] = $conversation_id;
                // }
                $result[] = $response;
            }
            return $result;
        }
    }
    private function getUnreadMessages($id)
    {
        $chat = $id;
        $get_messages = $this->db->prepare("SELECT * FROM `messages` WHERE (`conversation` = ? AND NOT `from` = ? AND NOT `status` = ?) ORDER BY `date` DESC");
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

        // ! Verifier s'il y a deja une conversation en cours sinon en creer une 
        $get_conversation = $this->db->prepare("SELECT * FROM `conversation` WHERE `id` = ?");
        $get_conversation->execute([$chat]);
        if ($get_conversation->rowCount()) {
            $conversation = $get_conversation->fetch();
            $to_user = $conversation['to_user'] == $conversation['creator']
                || $conversation['to_user'] == $this->myId;
        } else {
            $create_conversation = $this->db->prepare("INSERT INTO `conversation` (`creator`, `to_user`, `date`) VALUES(?, ?, ?)");
            $create_conversation->execute([$this->myId, $chat, time()]);
        }

        $get_messages = $this->db->prepare("SELECT * FROM `messages` WHERE `conversation` = ? ORDER BY `date` DESC");
        $get_messages->execute([$chat]);
        $result = [];
        while ($message = $get_messages->fetch()) {
            if (isset($to_user) && $to_user) {
                $update_message = $this->db->prepare("UPDATE `messages` SET `status` = ? WHERE id = ?");
                $update_message->execute([1, $message['id']]);
            }
            $object = new Message($message);
            $result[] = $object->getData();
        }
        return [
            "messages" => $result
        ];
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
        $get_conversations = $this->db->prepare("SELECT * FROM `conversation`  WHERE (`creator` = ? OR `to_user` = ? )  ORDER BY `date` DESC");
        $get_conversations->execute([$this->myId, $this->myId]);

        while ($conversation = $get_conversations->fetch()) {
            $conversation_id = $conversation['id'];
            $to_user = $conversation['to_user'];
            $get_all_message = $this->db->prepare("SELECT * FROM `messages`  WHERE `conversation` = ?   ORDER BY `date` DESC");
            $get_all_message->execute([$conversation_id]);
            $get_last_message = $this->db->prepare("SELECT * FROM `messages`  WHERE `conversation` = ?   ORDER BY `date` DESC LIMIT 1");
            $get_last_message->execute([$conversation_id]);
            while ($single_message = $get_all_message->fetch()) {
                if (isset($to_user) && $to_user == $this->myId) {
                    $update_message = $this->db->prepare("UPDATE `messages` SET `status` = ? WHERE id = ? AND NOT `status` = ?");
                    $update_message->execute([2, $single_message['id'], 1]);
                }
            }
            if ($get_last_message->rowCount()) {
                $message = $get_last_message->fetch();

                $unread_messages = $this->getUnreadMessages($conversation_id);

                $content = ($message['from'] == $this->myId) ? "Vous: " . $message['content'] : $message['content'];
                $content = (strlen($content) > 35) ? substr($content, 0, 35) . "..." : $content;

                $attachmentText = ($message['from'] == $this->myId) ? "Vous avez envoyé une photo" : "Vous a envoyé une photo";

                $content = ($message['type'] != "text") ? $attachmentText : $content;
                $array = [
                    "id" => $conversation_id,
                    "content" => $content,
                    "date" => $message['date'],
                    "type" => $message['type'],
                    "unread" => $unread_messages,
                ];

                $object = new LastMessages($array);
                if (!in_array($conversation_id, $chats)) {
                    $chats[] = $conversation_id;
                    $last_messages[] = $object->getData();
                }
            }
        }
        $response = [];
        foreach ($last_messages as $last_message) {
            if (isset($_SESSION['current_messages']) && count($_SESSION['current_messages'])) {
                // $saved_lastmessages = $_SESSION['current_messages'];
                // $findIfDisplayed = findObjectWithKey($saved_lastmessages, "user", $last_message['user']);
                // if ($findIfDisplayed && $findIfDisplayed['date'] != $last_message['date']
                // || $findIfDisplayed &&  $findIfDisplayed['unread'] != $last_message['unread']) {
                $response[] = $last_message;
                // }
            } else {
                $response[] = $last_message;
            }
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
    // if (isset($user["user_id"])) {
    echo json_encode($user);
    // }
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
    if ($last_messages) {
        foreach ($last_messages as $key => $message) {
            $userData = new GetData(["id" => +$message['user']]);
            $user = $userData->getUsers();

            $users['user_' . $message['user']] = $user;
        }
    }

    $response = [
        "last_messages" => $last_messages,
        "sess" => $_SESSION['current_messages'],
    ];

    echo json_encode($response);
};
if (isset($_POST['conversation_name'])) {
    if (!isset($_SESSION['auth'])) {
        $response = [
            "session_error" => true,
        ];
        echo json_encode($response);
        return;
    }

    $last_messages = $_SESSION['current_messages'];
    $last_users = isset($_SESSION['last_users']) ? $_SESSION['last_users'] : [];

    $users = [];

    foreach ($last_messages as $key => $message) {
        $chat_id = +$message['user'];
        $get_conv = $db->prepare("SELECT * FROM `conversation` WHERE id = ? LIMIT 1");
        $get_conv->execute([$chat_id]);
        if ($get_conv->rowCount()) {
            $myId = +$_SESSION['id'];
            $conversation = $get_conv->fetch();
            $creator = $conversation['creator'];
            $to_user = $conversation['to_user'];
            $user_id = ($to_user === $creator) ? $creator  : (($myId != $creator) ? $creator  : $to_user);

            $userData = new GetData(["id" => $user_id]);
            $user = $userData->getUsers();
            if (isset($_SESSION['last_users']) && isset($_SESSION['last_users']['user_' . $message['user']])) {
                $saved_user = $_SESSION['last_users']['user_' . $message['user']];
                if (
                    @$saved_user['last_seen'] != @$user['last_seen']
                    || @$saved_user['username'] != @$user['username']
                    || @$saved_user['profile_img'] != @$user['profile_img']
                ) {
                    $users['user_' . $message['user']] = $user;
                }
            } else {
                $users['user_' . $message['user']] = $user;
            }
        }
    }

    $response = [
        "users" => $users,
    ];
    $_SESSION['last_users'] = $users;
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
