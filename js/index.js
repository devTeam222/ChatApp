
async function App() {
    
    // ! Message d'avertissement
    console.warn("%cAVERTISSEMENT !\n\n%cExécuter du code dans cette console peut causer des problèmes de sécurité et de performance. Si quelqu'un vous a dit d'entrer quelque chose ici, il y a de fortes chances qu'il essaie de vous tromper et d'accéder à vos informations personnelles. Fermez cette console sauf si vous savez exactement ce que vous faites.", 'color: red; font-size: 30px;', 'font-size: 20px');

    // ? Message de copyright
    console.log(`%cDesigned and implemented by Martin OCHO. \nFor more information, please visit my GitHub profile: https://github.com/OchoKOM/. \nAll rights reserved, 2024.`, 'color: dodgerblue; font-size: 15px;');
    console.log('%cConçu et réalisé par Martin OCHO. \nPour plus d\'informations, veuillez visiter mon profil GitHub : https://github.com/OchoKOM/. \nTous droits réservés, 2024.', 'color: dodgerblue; font-size: 15px;');


}
App();
async function sessionError() {
    const modal_window = document.querySelector('.modal-window');
    const userImg = document.querySelector('.connected-user img').getAttribute('src') || ''
    modal_window.classList.add('active');
    modal_window.innerHTML = `
    <header class="modal-header">
            <h3>Session expirée</h3>
        </header>
        <section method="post" class="modal-body" data-type="login">
            <section class="active conneted-user">
                <h1>Salut là-bas !</h1>
                <label title="Profil" class="profile-picture">
                    <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round">
                        <path d="M18 20a6 6 0 0 0-12 0" />
                        <circle cx="12" cy="10" r="4" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    <img src="${userImg}" alt="" id="image-preview">
                </label>    
                <p>Nous avons remarqué que ta session a expiré. Pas de souci, ça arrive ! Mais, nous ne voulons pas te laisser en plan.</p>
                <p>Reconnecte-toi simplement et nous te ramènerons là où tu t'étais arrêté.</p>
                <p>Si tu as besoin d'aide pour quoi que ce soit, n'hésite pas à nous faire signe. On est là pour toi !</p>
            </section>
        </section>
        <footer class="modal-footer">
            <span>À bientôt !</span>
            <div class="buttons">
                <button type="button" form="modal-form" class="bouton logout loading">Deconnexion...</button>
            </div>
        </footer>
    `;
    refreshImages();
    const logoutBtn = modal_window.querySelector('.logout');
        await new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
                xhr.open('POST', './apis/sendData.php');
                xhr.onload = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            try {
                                let data = xhr.response;
                                setTimeout(() => {
                                    location.reload();
                                    resolve(data);
                                }, 10000);
                            } catch (error) {
                                console.warn(error);
                                console.warn(xhr.response);
                                setTimeout(() => {
                                    location.reload();
                                    reject();
                                }, 10000);
                            }
                        } else {
                            console.log('Erreur ' + xhr.status);
                            setTimeout(() => {
                                    location.reload();
                                    reject();
                                }, 10000);
                        }
                    }
                };
                const formData = new FormData();
                formData.append('logout', true)
                xhr.send(formData);
        })
        logoutBtn.classList.remove('loading')
        logoutBtn.textContent = "Deconneté"
}
async function serverError() {
    const modal_window = document.querySelector('.modal-window');
    const userImg = document.querySelector('.connected-user img').getAttribute('src') || ''
    modal_window.classList.add('active');
    modal_window.innerHTML = `
    <header class="modal-header">
            <h3>Session expirée</h3>
        </header>
        <section method="post" class="modal-body" data-type="login">
            <section class="active conneted-user">
                <h1>Salut là-bas !</h1>
                <label title="Profil" class="profile-picture">
                    <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round">
                        <path d="M18 20a6 6 0 0 0-12 0" />
                        <circle cx="12" cy="10" r="4" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    <img src="${userImg}" alt="" id="image-preview">
                </label>    
                <p>🛠️✨ Nous tenions juste à vous informer que notre service subit actuellement une petite mise à jour, ce qui signifie qu'il sera temporairement indisponible. Pas d'inquiétude, nos experts travaillent dur pour le remettre en ligne aussi rapidement que possible !</p>
                <p>Nous vous prions de bien vouloir nous excuser pour ce petit contretemps et vous remercions pour votre patience et votre compréhension. En attendant, n'hésitez pas à nous contacter si vous avez des questions ou des préoccupations.</p>
            </section>
        </section>
        <footer class="modal-footer">
            <span>À bientôt !</span>
            <div class="buttons">
                <button type="button" form="modal-form" class="bouton logout loading">Actualisation...</button>
            </div>
        </footer>
    `;
    refreshImages();
    location.reload();
}

export { sessionError, serverError }