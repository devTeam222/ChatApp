<?php

$root = './';
require_once('./config/config.php');

?>
<!DOCTYPE html>
<html lang="fr">
<?php
include('./partials/_head.php');
?>

<body>
    <?php
    include('./partials/_navbar.php');
    if (isset($_SESSION['auth'])) {
    ?>
        <main class="container">
            <aside class="chat-list">
                <section class="new-message-section">
                    <header>
                        <h2>
                            <span>Nouvelle discussion</span>
                            <span class="close-new-chat" title="Fermer">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </span>
                        </h2>
                        <form class="search-message">
                            <input type="text" placeholder="Recherche..." required>
                            <button type="submit" title="Rechercher">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                            </button>
                        </form>
                    </header>
                    <ul class="messages-list loading" id="new-chat-list">
                    </ul>
                </section>
                <header>
                    <nav class="connected-user">
                        <div class="toggle-menu" title="Afficher le menu">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu">
                                <line x1="4" x2="20" y1="12" y2="12" />
                                <line x1="4" x2="20" y1="6" y2="6" />
                                <line x1="4" x2="20" y1="18" y2="18" />
                            </svg>
                        </div>
                        <h2 class="logo">
                            <span class="icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-heart">
                                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                                    <path fill="#dc143c" stroke="#dc143c" d="M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.6 3.5 3.6-3.5c1.2-1.2 1.1-2.7.2-3.7" />
                                </svg>
                            </span>
                            <span>ChatApp</span>
                        </h2>
                    </nav>
                    <h2>
                        <span>Discussions</span>
                        <span class="add-new-chat new-chat-icon" title="Nouveau message">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen">
                                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
                            </svg>
                        </span>
                        <button class="add-new-chat new-chat-float-btn" title="Nouveau message">
                            <svg width="37" height="37" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus">
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                            </svg>
                        </button>
                    </h2>
                    <form class="search-message">
                        <input type="text" placeholder="Recherche..." required>
                        <button type="submit" title="Rechercher">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </button>
                    </form>
                </header>
                <ul class="messages-list loading" id="message-list"></ul>
            </aside>
            <section class="chat-window">
                <header>
                    <nav class="connected-user">
                        <h2 class="logo">
                            <span class="icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-heart">
                                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                                    <path fill="#dc143c" stroke="#dc143c" d="M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.6 3.5 3.6-3.5c1.2-1.2 1.1-2.7.2-3.7" />
                                </svg>
                            </span>
                            <span>ChatApp</span>
                        </h2>
                        <ul>
                            <li title="Notifications">
                                <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell">
                                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                                </svg>
                            </li>
                            <li title="Profil" class="profile-picture">
                                <img src="" alt="">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round">
                                    <path d="M18 20a6 6 0 0 0-12 0" />
                                    <circle cx="12" cy="10" r="4" />
                                    <circle cx="12" cy="12" r="10" />
                                </svg>
                            </li>
                        </ul>
                    </nav>
                </header>
                <section class="unopened">
                    <p>Ouvrir une discussion pour l'afficher ici</p>
                </section>
                <section class="chat-box">
                    <header class="chat-header">
                        <a href="./" class="back-to-home" title="Retour">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left">
                                <path d="m12 19-7-7 7-7" />
                                <path d="M19 12H5" />
                            </svg>
                        </a>
                        <span class="user-profile">
                            <img src="" alt="Profile">
                            <div class="status"></div>
                        </span>
                        <span class="chat-data">
                            <div class="user-fullnames"><strong></strong></div>
                            <div class="user-username"></div>
                            <div class="status"></div>
                        </span>
                    </header>
                    <section class="chat-body">
                    </section>
                    <div class="form-box">
                        <div class="loader"></div>
                    </div>
                </section>
            </section>
        </main>
    <?php
    } else {
        header('location : /');
    }
    ?>

    <section class="modal-window">
    </section>
    <div class="overlay modal-overlay"></div>
    <ul class="context-menu"></ul>
    <script src="./js/theme.js"></script>
    <script src="./js/messages/app.js" type="module"></script>
    <script src="./js/navigation.js" type="module"></script>
</body>
</html>