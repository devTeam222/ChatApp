<?php
if (isset($_POST['register'])) {
?> 
    <section class="form">
        <header>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
        </header>
        <h3>Nous sommes impatients de vous accueillir ! <br>
        Complétez les champs ci-dessous pour nous rejoindre. 😊🌟</h3>
        <label class="input-box">
            <div>Nom Complet</div>
            <input type="text" name="fullnames" placeholder="Ex. John Doe" required>
        </label>
        <label class="input-box">
            <div>Nom d'utilisateur</div>
            <input type="text" name="username" pattern="[A-Za-z0-9]+" placeholder="Ex. johndoe13" required>
        </label>
    </section>
    <section class="form">
        <h3>Envie d'ajouter une photo de profil ? <br>
            Vous pouvez passer si vous n'avez pas envi ! 📷✨</h3>
        <label title="Profil" class="profile-picture">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round">
                <path d="M18 20a6 6 0 0 0-12 0" />
                <circle cx="12" cy="10" r="4" />
                <circle cx="12" cy="12" r="10" />
            </svg>
            <img src="" alt="" id="image-preview">
            <div class="cam">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-camera">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                </svg>
            </div>
            <input type="file" name="avatar" id="profile-pic" title="Profil" hidden accept="image/*">
        </label>
    </section>
    <section class="form">
        <header>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        </header>
        <h3>Il est fortement recommandé que votre compte bénéficient d'une couche supplémentaire de sécurité pour les futures connexions. 🔒✨</h3>
        <div class="input-box">
            <label class="input-box">
                <div>Mot de passe</div>
                <input type="password" minlength="7" id="password" name="password" placeholder="Entrez un mot de passe securisé" required>
            </label>
            <label>
                <input type="checkbox" id="show-password" switch title="Afficher le mot de passe">
                <span>Afficher le mot de passe</span>
            </label>
        </div>
        <label class="input-box">
            <div>Confirmer</div>
            <input type="password" name="password" placeholder="Entrez de nouveau le mot de passe" required>
        </label>
    </section>
<?php
}
if (isset($_POST['login'])) {
?>
    <section class="form">
        <header>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
        </header>
        <h3>Vous revoilà ! Vous serez toujours bienvenu(e) parmi nous. 🎉✨</h3>
        <label class="input-box">
            <div>Nom d'utilisateur</div>
            <input type="text" id="username" name="username" pattern="[A-Za-z0-9]+" placeholder="Ex. johndoe13" required>
        </label>
        <div class="input-box">
            <label class="input-box">
                <div>Mot de passe</div>
                <input type="password" id="password" name="pwd" placeholder="Entrez votre mot de passe" required>
            </label>
            <label>
                <input type="checkbox" id="show-password" switch title="Afficher le mot de passe">
                <span>Afficher le mot de passe</span>
            </label>
        </div>
    </section>
<?php
}
