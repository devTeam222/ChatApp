import { refreshImages } from "./images.js";
function accountActions() {
    
}
function chatActions() {
    
}


function getNotification() {
    const notification = Notification.permission === "granted" ? `
        <header>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
            </svg>
        </header>
        <p>Les notifications sont activés</p>
        ` : `
        <header>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
            </svg>
        </header>
        <p>Vous n'avez pas encore activé les notificaions</p>
        <div class="input-box">
            <button class="bouton" id="active-push">Activer</button>
        </div>
        `;
    setTimeout(toggleNotification, 20);
    return notification;
}


function toggleNotification() {
    const activePush = document.getElementById('active-push');
    if (!activePush) {
        return;
    }

    const notificationSetting = activePush.parentNode.parentNode;
    activePush.addEventListener('click', () => {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                notificationSetting.innerHTML = `
                <header>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                    </svg>
                </header>
                <p>Les notifications sont activés</p>
                `
            }else{
                
                notificationSetting.innerHTML = `
                <header>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                    </svg>
                </header>
                <p>Les notifications n'ont pas pu être activés car nous n'avons pas reçu l'autorisation</p>
                `
            }
        }).catch(err => {
            console.log(err);
            notificationSetting.innerHTML = `
                <header>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell-off">
                        <path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5"/>
                        <path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7"/>
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="m2 2 20 20"/>
                    </svg>
                </header>
                <p>Impossible d'activer les notifications verifiez vos paramètres de sécurité</p>
                `
        })
    })
}

function profileActions() {
    refreshImages();
}

function emailActions() {
    
}

function downloadUserData() {
    
}

function deleteMyAccount() {
    
}

export { accountActions, chatActions, getNotification, profileActions, emailActions, downloadUserData, deleteMyAccount }