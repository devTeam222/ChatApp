<?php

$root = './';
require_once('./config/config.php');

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./theme/style.css">
    <link rel="icon" href="./assets/icon.svg" type="image/svg+xml" media="(prefers-color-scheme:light)">
    <link rel="icon" href="./assets/icon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme:dark)">
    <title>ChatApp</title>
</head>
<body>
    <?php
    include('./partials/_navbar.php');
    if (isset($_SESSION['auth'])) {
    ?>
        <main class="container disconnected">
            <h1 class="logo">
                <span class="icon">
                    <svg width="45" height="45" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-heart">
                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                        <path fill="#dc143c" stroke="#dc143c" d="M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.6 3.5 3.6-3.5c1.2-1.2 1.1-2.7.2-3.7" />
                    </svg>
                </span>
                <span>ChatApp</span>
            </h1>
            <section>
                <h2>Bienvenue sur ChatApp !</h2>
                <p>
                    <ul>
                        <li>🎉 Meci de faire parti de notre communauté de chat en ligne pour connecter avec d'autres passionnés comme toi ! </li>
                        <li>Vous pouvez commencer a discuter !</li>
                    </ul>
                </p>
                <div class="buttons">
                    <a href="./messages" class="bouton">Commencer à discuter</a>
                </div>
            </section>
        </main>
    <?php
    } else {
    ?>
        <main class="container disconnected">
            <h1 class="logo">
                <span class="icon">
                    <svg width="45" height="45" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-heart">
                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                        <path fill="#dc143c" stroke="#dc143c" d="M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.6 3.5 3.6-3.5c1.2-1.2 1.1-2.7.2-3.7" />
                    </svg>
                </span>
                <span>ChatApp</span>
            </h1>
            <section>
                <h2>Bienvenue sur ChatApp !</h2>
                <p>
                    <ul>
                        <li>🎉 Rejoins notre communauté de chat en ligne pour connecter avec d'autres passionnés comme toi ! Partage, échange, et découvre de nouveaux amis dès maintenant.</li>
                        <li>Connecte-toi ou inscris-toi pour plonger dans l'aventure !</li>
                    </ul>
                    Bienvenue à bord ! 🚀
                </p>
                <div class="buttons">
                    <button class="bouton form-button" data-modal="register">Inscription</button>
                    <button class="bouton form-button" data-modal="login">Connexion</button>
                </div>
            </section>
        </main>
    <?php
    }
    ?>

    <section class="modal-window">
    </section>
    <div class="overlay modal-overlay"></div>
    <ul class="context-menu"></ul>
    <script src="./js/theme.js"></script>
    <script src="./js/index.js" type="module"></script>
    <script src="./js/navigation.js" type="module"></script>
</body>
</html>