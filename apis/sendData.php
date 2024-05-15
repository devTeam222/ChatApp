<?php
require_once('../config/config.php');

class SendData
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
        if (isset($_SESSION['auth'])) {
            $this->myId = $_SESSION['id'];
        }
    }
    // Fonction membre de la classe
    public function addUser()
    {
        $profile_image = $this->data['files']['profile'];
        $image_id = $this->uploadFile($profile_image);
        $fullnames = $this->data['post']['fullnames'];
        $username = trim($this->data['post']['username']);
        $password = password_hash($this->data['post']['pwd'], PASSWORD_DEFAULT);
        $created = time();
        $last_seen = $created + 1;
        $keys = "fullnames	username	pwd	image_file	created	lastseen	
        ";
        // ! Enregistrer l'itilisateur dans la base des données 
        $register_user = $this->db->prepare("INSERT INTO `users`(`fullnames`,	`username`,	`pwd`,	`image_file`,	`created`,	`lastseen`) VALUES (?, ?, ?, ?, ?, ?)");


        $register_user->execute([$fullnames, $username, $password, $image_id, $created, $last_seen]);
        $user_id = +$this->db->lastInsertId();
        $_SESSION['auth'] = true;
        $_SESSION['id'] = $user_id;
        $_SESSION['username'] = $username;
        $_SESSION['fullnames'] = $fullnames;
        $_SESSION['avatar'] = "./assets/image.php?id=".$image_id;
        return ["success"=>[$user_id, $fullnames, $username, $image_id, $created, $last_seen]];
    }
    // Connecter et authentifier l'utilisateur
    public function authUser()
    {
        $username = trim($this->data['post']['username']);
        $password = $this->data['post']['pwd'];
        
        $get_user = $this->db->prepare("SELECT * FROM `users` WHERE `username` = ?");
        $get_user->execute([$username]);

        if (!$get_user->rowCount()) {
            return ['error'=>"Nous n'avons pas trouvé de compte sous ce nom d'utilisateur !","type"=> 'username'];
        }
        $user_data = $get_user->fetch();

        if(password_verify($password, $user_data['pwd'])){
            $image_id = $user_data['image_file'];
            $fullnames = $user_data['fullnames'];
            $username = trim($user_data['username']);
            
            $user_id = +$user_data['id'];
            $_SESSION['auth'] = true;
            $_SESSION['id'] = $user_id;
            $_SESSION['username'] = $username;
            $_SESSION['fullnames'] = $fullnames;
            $_SESSION['avatar'] = "./assets/image.php?id=".$image_id;
            $this->updateUserActivity($user_id);
            return ["success"=>[$user_id, $fullnames, $username, $_SESSION['avatar']]];
        }
        return ['error'=>"Mot de passe incorrect ! Veuillez réesayer.", "type"=> 'password'];
    }

    private function updateUserActivity($id){
        $update_activity = $this->db->prepare("UPDATE `users` SET lastseen = ? WHERE id = ?");
        $update_activity->execute([time() + 30, $id]);
    }

    public function logout(){
        session_destroy();
        return true;
    }

    // Fonction membre de la classe
    public function sendMessages()
    {
        if (!count($this->data) || !$this->data['chat']) {
            return [];
        }
        $chat = $this->data['chat'];
        if ($this->data['type'] != 'text') {
            $sendFile = $this->uploadFile($this->data['content']);
            $content = $sendFile;
        } else {
            $content = $this->data['content'];
        }

        $date = time();

        // ! Verifier s'il y a deja une conversation en cours sinon en creer une 
        $get_conversation = $this->db->prepare("SELECT * FROM `conversation` WHERE (`creator` = ? AND `to_user` = ?) OR (`creator` = ? AND `to_user` = ?)");
        $get_conversation->execute([$chat, $this->myId, $this->myId, $chat]);
        
        if($get_conversation->rowCount()){
            $conversation = $get_conversation->fetch();
            $conversation_id = $conversation['id'];
        }else{
            $create_conversation = $this->db->prepare("INSERT INTO `conversation` (`creator`, `to_user`, `date`) VALUES(?, ?, ?)");
            $create_conversation->execute([$this->myId, $chat, $date]);

            $conversation_id = $this->db->lastInsertId();
        }

        // ! Declarer les donnees a envoyer puis les inserer dans la base des donnees
        $data_to_send = [$this->myId, $conversation_id, $content, $this->data['type'], $date];

        $send_message = $this->db->prepare("INSERT INTO `messages` (`from`, `conversation`,`content`, `type`, `date`) VALUES(?, ?, ?, ?, ?)");
        // Insert new message into database
        if ($send_message->execute($data_to_send)) {
            return [
                "id"=>$this->db->lastInsertId(),
                "date"=> $date,
            ];
        }
        return false;
    }
    // Fonction pour mettre en ligne le fichier
    private function uploadFile($file)
    {
        //! Stocker le nom du fichier dans des variables unique
        $fileName = time() . "-" . uniqid() . ".". pathinfo($file['name'], PATHINFO_EXTENSION);
        $fileTmpName = $file['tmp_name'];
        // ? Vérifier si le dossier d'envoi des fichiers existe sinon en créer un
        $uploadDir = '../uploads/';

        !is_dir($uploadDir) && mkdir($uploadDir); //! Créer un dossier pour les fichiers sùil n'existe pas

        $uploadPath = './uploads/'.$fileName;
        // Déplacer le fichier dans le dossier uploas
        if (move_uploaded_file($fileTmpName, $uploadDir . $fileName)) {
            // todo Enregistrer dans la base des données le chemin du fichier
            $file_sql = $this->db->prepare("INSERT INTO `files`(`path`) VALUES (?)");
            $file_sql->execute([$uploadPath]);

            // todo Récupérer l'id du fichier dans la base des données
            $file_id = $this->db->lastInsertId();

            // ? Envoyer l'id du fichier
            return $file_id;
        } else {
            return false;
        };
    }
};

if(isset($_POST['message'])){
    if (!isset($_SESSION['auth'])) {
        $response = [
            "session_error" => true,
        ];
        echo json_encode($response);
        return;
    }
    $message = [
        "chat"=> $_POST['message'],
        "type"=> $_POST['type'] 
    ];
    if($message['type'] != 'text'){
        $file = $_FILES['image'];
        $message['content'] = $file;
    }else{
        $message['content'] = htmlspecialchars(trim($_POST['content']));
    }

    $data = new SendData($message);
    $sendMessage = $data->sendMessages();
    echo json_encode($sendMessage);
};


if(isset($_POST['register'])){
    $array = ["post"=>$_POST, "files"=>$_FILES];
    $data = new SendData($array);
    $add_user = $data->addUser();
    echo json_encode($add_user);
};
if(isset($_POST['login'])){
    $array = ["post"=>$_POST];
    $data = new SendData($array);
    $auth_user = $data->authUser();
    echo json_encode($auth_user);
};
if(isset($_POST['logout'])){
    $data = new SendData();
    $auth_user = $data->logout();
    echo json_encode($auth_user);
};