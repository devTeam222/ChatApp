<?php
require_once('../config/config.php');

class File
{
    private $db;
    public $data;

    // Constructeur de la classe
    public function __construct($array = [])
    {
        global $db;
        $this->db = $db;
        $this->data = $array;
    }
    // Fonction membre de la classe
    public function renderBlob()
    {
        // Récupération de l'ID du fichier depuis la requête GET
        $getid = $this->data['id'];

        // Préparation de la requête SQL pour récupérer les informations du fichier à partir de l'ID
        $get_path = $this->db->prepare('SELECT * FROM files WHERE id= ?');

        // Exécution de la requête SQL avec l'ID du fichier
        $get_path->execute([$getid]);

        // Récupération des informations du fichier dans un tableau associatif
        $path = "../".$get_path->fetch()['path'];

        // Récupération de la taille du fichier vidéo en octets
        $size = filesize($path);

        // Ouverture du fichier vidéo en mode lecture binaire
        $fm = fopen($path, 'rb');

        // Vérification que le fichier a bien été ouvert en lecture binaire
        if (!$fm) {
            die();
        }
        try {
            $mime_type = mime_content_type($path);
            // Envoi des entêtes HTTP pour indiquer que le contenu est envoyé en plusieurs parties et pour définir la taille totale du contenu
            header("Accept-Ranges: bytes");
            header("Content-Length: " . $size);
            header("Content-Disposition: inline;");
            header("Content-Transfert-Encoding: binary");
            header("Content-Type: $mime_type"); 
            header("Connexion: close");

            // Envoi du contenu du fichier au client
            fpassthru($fm);

            // Fermeture du fichier vidéo
            fclose($fm);
        } catch (Exception $e) {
            return false;
        }
    }
    public function getPath()
    {
        // Récupération de l'ID du fichier depuis la requête GET
        $getid = $this->data['id'];

        // Préparation de la requête SQL pour récupérer les informations du fichier à partir de l'ID
        $get_path = $this->db->prepare('SELECT * FROM `files` WHERE id= ?');

        // Exécution de la requête SQL avec l'ID du fichier
        $get_path->execute(array($getid));

        // Récupération des informations du fichier dans un tableau associatif
        $path = $get_path->fetch()['path'];

        return $path;
    }
};

if (isset($_GET['id'])) {
    $file = new File(["id"=>$_GET['id']]);
    return $file->renderBlob();
} elseif (isset($_GET['path'])) {
    $file = new File(["id"=>$_GET['path']]);
    echo $file->getPath();
}
