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
            "profile_img" => $this->data['image_file'],
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
            "id" => $this->data['id'],
            "content" => $this->data['content'],
            "from" => $this->data['from'],
            "to" => $this->data['to'],
            "type" => $this->data['type'],
            "date" => $this->data['date'],
            "status" => $this->data['status'],
        ];
        return $result;
    }
}

class UpdateData
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
        $this->myId = $_SESSION['id'];
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

    private function removeFile($id){
        // Préparation de la requête SQL pour récupérer les informations de la vidéo à partir de l'ID
        $get_path = $this->db->prepare('SELECT * FROM files WHERE id= ?');

        // Exécution de la requête SQL avec l'ID de la vidéo
        $get_path->execute([$id]);

        // Récupération des informations de la vidéo dans un tableau associatif
        $path = "../".$get_path->fetch()['path'];

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

if(isset($_POST['remove'])){
    if(!isset($_SESSION['auth'])){
        return;
    }
    $message = [
        "message"=> +$_POST['remove'],
    ];

    $updateData = new UpdateData($message);
    $removed = $updateData->removeMessage();
    echo json_encode($removed);
};