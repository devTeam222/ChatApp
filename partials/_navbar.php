<?php
if (isset($_SESSION['auth'])) {
?>
    <nav class="main-nav pos-sticky inset-0 d-flex flex-column gap-1em">
        <div class="overlay toggle-menu pos-fixed w-100v h-100v inset-0"></div>
        <h1 class="logo d-flex items-center cursor-pointer">
            <span class="icon toggle-menu" title="Afficher le menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-heart">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                    <path fill="#dc143c" stroke="#dc143c" d="M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.6 3.5 3.6-3.5c1.2-1.2 1.1-2.7.2-3.7" />
                </svg>
            </span>
            <a href="./">ChatApp</a>
            <div class="close-menu toggle-menu" title="Masquer le menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m15 9-6 6" />
                    <path d="m9 9 6 6" />
                </svg>
            </div>
        </h1>
        <ul class="user-nav d-flex flex-column" title="Profil">
            <li class="profile-picture connected-user">
                <img src="#" alt="">
                <svg width="5em" height="5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round">
                    <path d="M18 20a6 6 0 0 0-12 0" />
                    <circle cx="12" cy="10" r="4" />
                    <circle cx="12" cy="12" r="10" />
                </svg>
            </li>
            <li class="user-data">
                <div class="user-fullnames"></div>
                <div class="username"></div>
            </li>
        </ul>
        <ul class="top d-flex flex-column">
            <li>
                <a href="./">
                    <span class="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </span>
                    <span class="text">Accueil</span>
                </a>
            </li>
            <li>
                <a href="./messages">
                    <span class="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-text">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            <path d="M13 8H7"/>
                            <path d="M17 12H7"/>
                        </svg>
                    </span>
                    <span class="text">Messages</span>
                </a>
            </li>
        </ul>
        <ul class="bottom d-flex flex-column">
            <li>
                <a href="javascript:openSettings()">
                    <span class="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </span>
                    <span class="text">Paramètres</span>
                </a>
            </li>
            <li>
                <a href="javascript:logout()">
                    <span class="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>
                    </span>
                    <span class="text">Deconnexion</span>
                </a>
            </li>
        </ul>
        <section class="settings">
            <nav class="setting-menu">
                <ul>
                    <li data-setting="account" class="active">Compte</li>
                    <li data-setting="chat">Discussions</li>
                    <li data-setting="notification">Notifications</li>
                </ul>
                <ul class="bottom">
                    <li data-setting="profile">Profil</li>
                </ul>
                <h1 class="setting-head">
                    <span class="text">Parametres</span>
                    <span class="icon close-settings">&times;</span>
                </h1>
            </nav>
            <section class="setting-options">
                <header class="setting-header">
                    <h2>Paramètres</h2>
                </header>
                <section class="setting-body loading"></section>
            </section>
        </section>
    </nav>
<?php
    return;
}
?>
<nav class="main-nav login">
    <div class="overlay toggle-menu"></div>
    <h1 class="logo">
        <span class="icon toggle-menu" title="Afficher le menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-heart">
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                <path fill="#dc143c" stroke="#dc143c" d="M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.6 3.5 3.6-3.5c1.2-1.2 1.1-2.7.2-3.7" />
            </svg>
        </span>
        <a href="./">ChatApp</a>
        <div class="close-menu toggle-menu" title="Masquer le menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x">
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
            </svg>
        </div>
    </h1>
    <ul class="top">
        <li>
            <a href="./">
                <span class="icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                </span>
                <span class="text">Accueil</span>
            </a>
        </li>
    </ul>
    <ul class="bottom">
        <li>
            <a href="javascript:loginForm()">
                <span class="icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-in">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" x2="3" y1="12" y2="12" />
                    </svg>
                </span>
                <span class="text">Connexion</span>
            </a>
        </li>
        <li>
            <a href="javascript:registerForm()">
                <span class="icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-plus">
                        <path d="M2 21a8 8 0 0 1 13.292-6" />
                        <circle cx="10" cy="8" r="5" />
                        <path d="M19 16v6" />
                        <path d="M22 19h-6" />
                    </svg>
                </span>
                <span class="text">S'enregistrer</span>
            </a>
        </li>
    </ul>
</nav>