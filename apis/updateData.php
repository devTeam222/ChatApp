<?php
require_once('../config/config.php');

class UpdateData
{
    private $db;
    public $data;
    private $myId;
    public $now;

    // Constructeur de la classe
    public function __construct($array = [])
    {
        global $db;
        $this->db = $db;
        $this->data = $array;
        $this->myId = $_SESSION['id'];
    }
    public function getOrCreateChat()
    {
        $date = $this->now;
        $user_id = $this->data['user_id'];
        $get_conversations = $this->db->prepare("SELECT id FROM `conversation`  WHERE (`creator` = ? AND `to_user` = ? OR `to_user` = ? AND `creator` = ? )  ORDER BY `date` DESC LIMIT 1");
        $get_conversations->execute([$this->myId, $user_id, $this->myId, $user_id]);

        if (!$get_conversations->rowCount()) {
            $create_conversation = $this->db->prepare("INSERT INTO `conversation` (`creator`, `to_user`, `date`) VALUES (?, ?, ?)");
            $create_conversation->execute([$this->myId, $user_id, $date]);
            $chat_id = $this->db->lastInsertId();
        }else{
            $conversation = $get_conversations->fetch();
            $chat_id = $conversation['id'];
        }
        return [
            'id'=>$chat_id,
        ];
    }

    // Fonction membre de la classe
    public function editMessage()
    {
        $id = isset($this->data['id']) && $this->data['id'];
        $getFromDb = $this->db->query("SELECT * FROM users ORDER BY `lastseen` DESC");
        $result = [];
        while ($row = $getFromDb->fetch()) {
            $object = new User($row);
            if (!$id) {
                $result[] = $object->getData();
            } else {
                if ($row['id'] == $id) {
                    $result[] = $object->getData();
                }
            }
        }
        return $result;
    }

    private function removeFile($id)
    {
        // Préparation de la requête SQL pour récupérer les informations de la vidéo à partir de l'ID
        $get_path = $this->db->prepare('SELECT * FROM files WHERE id= ?');

        // Exécution de la requête SQL avec l'ID de la vidéo
        $get_path->execute([$id]);

        // Récupération des informations de la vidéo dans un tableau associatif
        $path = "../" . $get_path->fetch()['path'];

        @unlink($path);

        $deleteFromDb = $this->db->prepare("DELETE FROM `files` WHERE id = ?");
        $deleteFromDb->execute([$id]);
    }

    // Fonction membre de la classe
    public function removeMessage()
    {
        if (!count($this->data) || !$this->data['message']) {
            return [];
        }
        $id = $this->data['message'];
        $getFromDb = $this->db->prepare("SELECT * FROM `messages` WHERE id = ? AND `from` = ?");
        $getFromDb->execute([$id, $this->myId]);
        if ($getFromDb->rowCount() == 0) {
            return ['success' => false];
        }
        $message = $getFromDb->fetch();
        $messageType = $message['type'];
        $messageType != "text" && $this->removeFile($message['content']);
        $deleteFromDb = $this->db->prepare("DELETE FROM `messages` WHERE id = ?");
        $deleteFromDb->execute([$id]);

        return ['success' => true];
    }
};

if (isset($_POST['remove'])) {
    if (!isset($_SESSION['auth'])) {
        return;
    }
    $message = [
        "message" => $_POST['remove'],
    ];

    $updateData = new UpdateData($message);
    $removed = $updateData->removeMessage();
    echo json_encode($removed);
};
if (isset($_POST['get_chat_id'])) {
    if (!isset($_SESSION['auth'])) {
        return;
    }
    $chat = [
        "user_id" => $_POST['get_chat_id'],
    ];

    $updateData = new UpdateData($chat);
    $created = $updateData->getOrCreateChat();
    echo json_encode($created);
};
