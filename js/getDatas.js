import { TimeFormatter, NumberFormatter } from "./formatters";
let currentUser = await getCurrentUser();
class MessageVerifier {
    constructor(data, exists = false) {
        this.data = data;
        this.id = data.id;
        this.exists = exists;
    }

    verifyData() {
        const { id, photo, username, timestamp, content, isNew } = this.data;

        // Vérifie si toutes les données nécessaires sont présentes
        return (photo && username && timestamp && (content || isNew));
    }

    isNew() {
        return !!(this.data.isNew);
    }

    getData() {
        if (!this.verifyData) {
            return false;
        }
        const { id, photo, username, timestamp, content } = this.data;
        return { id, photo, username, timestamp, content };
    }
    generatePreviewHTML() {
        if (!this.verifyData() || this.exists && !this.exists.new) {
            return;
        }

        const { photo, username, timestamp, content } = this.data;

        // Convertit le timestamp en heure
        const formatter = new TimeFormatter(timestamp, false);
        const formattedTime = formatter.formatTime();
        const firstName = username.split(' ')[0] || username;

        // Génère l'élément HTML
        let messageEl = document.getElementById("chat_" + this.id) || document.createElement('li');
        messageEl.className = "message";
        messageEl.setAttribute('data-time', timestamp);
        messageEl.id = "chat_" + this.id;
        const lastSeen = this.data.last_seen;
        const period = Math.floor((Date.now() / 1000) - lastSeen);
        const formattedLastSeen = (period > 60 ? (new NumberFormatter(period).formatTime())
            : "<" + new NumberFormatter(60).formatTime());
        const online_status = (period) < 20 ? 'online' : 'off';
        const activeStatus = (period) < 20 ? '' : formattedLastSeen;
        if (this.isNew()) {
            const messagePrev = this.id === currentUser.user_id ? "Envoyez-vous un message" : "Envoyer un message"
            messageEl = document.createElement('li');
            messageEl.className = "message";
            messageEl.id = "new_chat_" + this.id;
            messageEl.innerHTML = `
            <span class="user-profile" data-lastseen="${lastSeen}">
                <img src="${photo}" alt="${firstName}'s profile picture">
                <div class="status ${online_status}"></div>
            </span>
            <span class="chat-data">
                <div class="message-time"><strong>${username}</strong></div>
                <div class="message-preview"><span>${messagePrev}</span></div>
            </span>
        `;
        } else {
            messageEl.innerHTML = `
                <span class="user-profile"  data-lastseen="${lastSeen}">
                    <img src="${photo}" alt="${firstName}'s profile picture">
                    <div class="status ${online_status}">${activeStatus}</div>
                </span>
                <span class="chat-data">
                    <div class="message-time"><strong>${username}</strong> <time>${formattedTime}</time></div>
                    <div class="message-preview"><span>${content}</span><b></b></div>
                </span>
            `;
        }

        return messageEl;
    }
}
class UserVerifier {
    constructor(data, exists = false) {
        this.data = data;
        this.id = data.id;
        this.exists = exists;
    }

    verifyData() {
        const { id, photo, username, timestamp, content, isNew } = this.data;

        // Vérifie si toutes les données nécessaires sont présentes
        return (photo && username && timestamp && (content || isNew));
    }

    getData() {
        if (!this.verifyData) {
            return false;
        }
        const { id, photo, username, timestamp, content } = this.data;
        return { id, photo, username, timestamp, content };
    }
    generatePreviewHTML() {
        if (!this.verifyData() || this.exists && !this.exists.new) {
            return;
        }

        const { photo, username, timestamp, content } = this.data;

        // Convertit le timestamp en heure
        const formatter = new TimeFormatter(timestamp, false);
        const formattedTime = formatter.formatTime();
        const firstName = username.split(' ')[0] || username;

        // Génère l'élément HTML
        let messageEl = document.getElementById("chat_" + this.id) || document.createElement('li');
        messageEl.className = "message";
        messageEl.setAttribute('data-time', timestamp);
        messageEl.id = "chat_" + this.id;
        const lastSeen = this.data.last_seen;
        const period = Math.floor((Date.now() / 1000) - lastSeen);
        const formattedLastSeen = (period > 60 ? (new NumberFormatter(period).formatTime())
            : "<" + new NumberFormatter(60).formatTime());
        const online_status = (period) < 20 ? 'online' : 'off';
        const activeStatus = (period) < 20 ? '' : formattedLastSeen;
        const messagePrev = this.id === currentUser.user_id ? "Envoyez-vous un message" : "Envoyer un message"
        messageEl = document.createElement('li');
        messageEl.className = "message";
        messageEl.id = "new_chat_" + this.id;
        messageEl.innerHTML = `
        <span class="user-profile" data-lastseen="${lastSeen}">
            <img src="${photo}" alt="${firstName}'s profile picture">
            <div class="status ${online_status}"></div>
        </span>
        <span class="chat-data">
            <div class="message-time"><strong>${username}</strong></div>
            <div class="message-preview"><span>${messagePrev}</span></div>
        </span>
        `;
        return messageEl;
    }
}
let last_messages_req = 0;
function getAvailableUsers() {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', './apis/getData.php');
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        let data = JSON.parse(xhr.response);
                        console.log(data);
                        resolve(data)
                    } catch (error) {
                        console.warn(error);
                        console.warn(xhr.response);
                        reject();
                    }
                } else {
                    console.log('Erreur ' + xhr.status);
                    reject();
                }
            }
        };

        let form_data = new FormData();
        form_data.append("get_available_users", true);
        xhr.send(form_data);
    })
}

function getCurrentUser() {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', './apis/getData.php');
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        let data = JSON.parse(xhr.response);
                        resolve(data)
                    } catch (error) {
                        console.warn(error);
                        console.warn(xhr.response);
                        reject();
                    }
                } else {
                    console.log('Erreur ' + xhr.status);
                    reject();
                }
            }
        };

        let form_data = new FormData();
        form_data.append("get_user", true);
        xhr.send(form_data);
    })
}

function getChatPreview() {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', './apis/getData.php');
        xhr.onload = async () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        const response = {
                            users: [],
                            last_messages: []
                        }
                        let data = JSON.parse(xhr.response);

                        if (data.session_error) {
                            resolve(data);
                            return;
                        }
                        const lastMessages = data.last_messages;
                        response.users = await getConversationUsers();
                        response.last_messages = lastMessages;
                        resolve(response);
                    } catch (error) {
                        console.warn(error);
                        console.warn(xhr.response);
                        reject();
                    }
                } else {
                    console.log('Erreur ' + xhr.status);
                    reject();
                }
            }
        };

        let form_data = new FormData();
        form_data.append("last_messages", true);
        if ((Date.now() - last_messages_req) > 500) {
            last_messages_req = Date.now();
            xhr.send(form_data);
        }
    })
}

function getConversationUsers() {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', './apis/getData.php');
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        let data = JSON.parse(xhr.response).users;
                        if (data.session_error) {
                            resolve(data);
                            return;
                        }
                        const response = data;
                        resolve(response);
                    } catch (error) {
                        console.warn(error);
                        console.warn(xhr.response);
                        reject();
                    }
                } else {
                    console.log('Erreur ' + xhr.status);
                    reject();
                }
            }
        };
        xhr.onerror = (e)=>{
            console.log(e);
        }
        let form_data = new FormData();
        form_data.append("conversation_name", true);
        xhr.send(form_data);
    })
}

function getMessages(chat) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', './apis/getData.php');
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        let data = JSON.parse(xhr.response);
                        resolve(data.messages);
                    } catch (error) {
                        console.warn(error);
                        console.warn(xhr.response);
                        reject();
                    }
                } else {
                    console.log('Erreur ' + xhr.status);
                    reject();
                }
            }
        };

        let form_data = new FormData();
        form_data.append("chat", chat);
        xhr.send(form_data);
    })
}
function UploadMessage(formData) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', './apis/sendData.php');
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        let data = JSON.parse(xhr.response);
                        resolve(data)
                    } catch (error) {
                        console.warn(error);
                        console.warn(xhr.response);
                        reject();
                    }
                } else {
                    console.log('Erreur ' + xhr.status);
                    reject();
                }
            }
        };
        const container = document.querySelector(".container");
        if (container.getAttribute('data-chat')) {
            const chat = +container.getAttribute('data-chat');
            formData.append('message', chat);
            xhr.send(formData);
        }
    })
}

function deleteMessage(id) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', "./apis/updateData.php", true);
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.response);
                        resolve(data);
                    } catch (error) {
                        console.warn(error);
                        console.warn(xhr.response);
                        reject();
                    }
                } else {
                    console.log('Erreur ' + xhr.status);
                    reject();
                }
            }
        };
        const formData = new FormData();
        formData.append('remove', id)
        xhr.send(formData);
    })
}
function download(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.responseType = "blob",
            xhr.onload = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        try {
                            const data = xhr.response;
                            const type = xhr.getResponseHeader('Content-Type');
                            const url = URL.createObjectURL(new Blob([data], { type }));
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = url.split('/').pop();
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            resolve(data);
                        } catch (error) {
                            console.warn(error);
                            console.warn(xhr.response);
                            reject();
                        }
                    } else {
                        console.log('Erreur ' + xhr.status);
                        reject();
                    }
                }
            };
        xhr.send();
    })
}

function detecterLiVisibles(ulElement) {
    // Sélectionne tous les éléments <li> dans la liste <ul>
    const liElements = ulElement.querySelectorAll('li');

    // Crée un tableau pour stocker les informations sur les éléments <li> visibles
    const liVisibles = [];
    let firstIndex = 0; // Index du premier élément visible

    // Parcours tous les éléments <li>
    liElements.forEach(function (liElement, index) {
        // Récupère les dimensions de l'élément par rapport à la fenêtre visible
        const rect = liElement.getBoundingClientRect();

        // Vérifie si l'élément est visible dans la fenêtre visible
        if (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        ) {
            // Si l'élément est visible, ajoute-le au tableau liVisibles avec ses informations
            liVisibles.push({
                element: liElement,
                index: liVisibles.length, // L'indice de l'élément dans le tableau liVisibles
                positionParent: liElement.offsetTop, // Position de l'élément par rapport au parent
                positionSibling: liElement.previousElementSibling ? liElement.previousElementSibling.offsetTop : 0 // Position de l'élément par rapport aux autres éléments <li>
            });

            // Si c'est le premier élément visible, met à jour premierElementVisibleIndex
            if (firstIndex === 0) {
                firstIndex = index;
            }
        }
    });

    // Retourne le tableau des éléments <li> visibles avec leurs informations
    return { liVisibles, firstIndex };
}

export { 
    currentUser, 
    MessageVerifier, 
    UserVerifier, 
    getAvailableUsers, 
    getCurrentUser, 
    getChatPreview, 
    detecterLiVisibles, 
    getMessages, 
    UploadMessage, 
    deleteMessage, 
    download 
}