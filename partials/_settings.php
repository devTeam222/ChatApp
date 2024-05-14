<?php

require('../config/config.php');
if (isset($_POST['setting'])) {
    $setting_option = $_POST['setting'];

    if ($setting_option === 'account') {
?>
        <ul>
            <li data-sub-setting="email">Adresse e-mail</li>
            <li data-sub-setting="data">Demander les informations du compte</li>
            <li data-sub-setting="delete_account">Supprimer le compte</li>
        </ul>

    <?php
    }
    if ($setting_option === 'chat') {
    ?>
        <header>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cog">
                <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                <path d="M12 2v2" />
                <path d="M12 22v-2" />
                <path d="m17 20.66-1-1.73" />
                <path d="M11 10.27 7 3.34" />
                <path d="m20.66 17-1.73-1" />
                <path d="m3.34 7 1.73 1" />
                <path d="M14 12h8" />
                <path d="M2 12h2" />
                <path d="m20.66 7-1.73 1" />
                <path d="m3.34 17 1.73-1" />
                <path d="m17 3.34-1 1.73" />
                <path d="m11 13.73-4 6.93" />
            </svg>
        </header>
        <p>Aucun paramètre à modifier ici, veuillez patienter les prochaines mises à jour ou actualisez la page</p>
    <?php
    }
    if ($setting_option === 'profil') {
        if (!isset($_SESSION['auth'])) {
            return;
        }
        $fullnames = $_SESSION['fullnames'];
        $username = $_SESSION['username'];
        $userImage = $_SESSION['avatar'];
    ?>
        <header>
            <div class="img-box">
                <img width="48" height="48" src="<?= $userImage ?>" alt="My profile picture">
                <label title="Modifier la photo de profil">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-camera">
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                        <circle cx="12" cy="13" r="3" />
                    </svg>
                    <input type="file" accept="image/*" hidden>
                </label>
            </div>
        </header>
        <ul>
            <li title="Modifier le nom">
                <input type="text" class="text" value="<?= $fullnames ?>" placeholder="Modifier le nom" readonly />
                <span class="icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                    </svg>
                </span>
            </li>
            <li title="Modifier le nom d'utilisateur">
                <input type="text" class="text" value="<?= $username ?>" placeholder="Modifier le nom d'utilisateur" readonly />
                <span class="icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                    </svg>
                </span>
            </li>
            <li title="Modifier le mot de passe">
                <input type="text" class="text" placeholder="Modifier le mot de passe" />
                <span class="icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                    </svg>
                </span>
            </li>
            <li title="Effacer la photo de profil">
                <span class="text">Rétirer la photo de profil</span>
                <span class="icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                </span>
            </li>
        </ul>
        <?php
    }
    if ($setting_option === 'email') {
        if (!isset($_SESSION['auth'])) {
            return;
        }
        $user_id = $_SESSION['id'];
        $get_email_from_db = $db->prepare("SELECT * FROM `emails` WHERE `user_id` = ? AND `available` = ?");
        $get_email_from_db->execute([$user_id, 1]);

        if (!$get_email_from_db->rowCount()) {
        ?>
            <header>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
            </header>
            <p>Vous n'avez pas encore enregistré une adresse e-mail pour ce compte</p>
            <div class="input-box">
                <button class="bouton">Ajouter une adress e-email</button>
            </div>
        <?php
        } else {
        ?>
            <header>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
            </header>
            <ul>
                <?php
                while ($emaildata = $get_email_from_db->fetch()) {
                    $email = $emaildata['email'];
                ?>
                    <li title="<?= $email ?>">
                        <span class="text"><?= $email ?></span>
                        <span class="icon" title="Rétirer <?= $email ?>">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                        </span>
                    </li>

                <?php
                }
                ?>
                <li title="Rétirer toutes les adresses e-mail">
                    <span class="text">Rétirer toutes les adresses e-mail</span>
                    <span class="icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                    </span>
                </li>
                <li title="Ajouter une adresses e-mail">
                    <span class="text">Ajouter une adresses e-mail</span>
                    <span class="icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus">
                            <path d="M5 12h14"></path>
                            <path d="M12 5v14"></path>
                        </svg>
                    </span>
                </li>
            </ul>
        <?php
        }
    }
    if ($setting_option === 'userdata') {
        ?>
        <header>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round">
                <path d="M18 20a6 6 0 0 0-12 0"></path>
                <circle cx="12" cy="10" r="4"></circle>
                <circle cx="12" cy="12" r="10"></circle>
            </svg>
        </header>
        <p>Telechargez les informations du compte</p>
        <div class="input-box">
            <button class="bouton">Telecharger</button>
        </div>
    <?php
    }
    if ($setting_option === 'deleteuser') {
    ?>
        <header>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round">
                <path d="M18 20a6 6 0 0 0-12 0"></path>
                <circle cx="12" cy="10" r="4"></circle>
                <circle cx="12" cy="12" r="10"></circle>
            </svg>
        </header>
        <p>Nous n'allons pas supprimer definitivement votre compte avant un an. <br>
            Vous pouvez toujours récupérer votre compte pendant cette periode</p>
        <div class="input-box">
            <button class="bouton">Supprimer mon compte</button>
        </div>
    <?php
    }
}
