import { TimeFormatter, NumberFormatter } from "./formatters";
import { refreshImages } from "./images.js";
import { sessionError } from "./forms.js"
import { 
    currentUser, 
    MessageVerifier, 
    getAvailableUsers, 
    getLastMessages, 
    detecterLiVisibles, 
    getMessages, 
    UploadMessage, 
    deleteMessage, 
    download 
} from './getDatas.js'
let currentChat;

App();
async function App() {
    if (currentUser.user_id) {
        UpdateConectedUser(currentUser);
        await RenderLastMessages();
        setInterval(async () => {
            await RenderLastMessages();
        }, 1000);
        addNewChat();
    }
}

async function RenderLastMessages() {
    refreshImages();
    const container = document.querySelector(".container");
    const messageList = document.getElementById("message-list");
    if (!messageList.querySelector('.message')) {
        messageList.classList.add('loading');
    }
    const getDatas = await getLastMessages();
    if (getDatas.session_error) {
        sessionError();
        return;
    }
    const { users, last_messages } = getDatas;
    last_messages.sort((a, b) => a.date - b.date);
    const chatList = messageList.querySelectorAll('.message:not(.loading)');
    chatList.forEach(message => {
        const id = +(message.getAttribute('id').split('_')[1]);
        if (!last_messages.find(chat => chat.user == id)) {
            message.remove();
        }
    });
    messageList.classList.remove('loading');
    if (!last_messages.length) {
        container.classList.contains('active') && displayMessages(currentChat, []);
        messageList.innerHTML = `
            <li class="message loading add-new-chat">
                <span class="chat-data">
                    <div class="message-preview"><span>Ajouter un nouveau message</span></div>
                </span>
            </li>`;
        addNewChat();
        return;
    }
    last_messages.forEach(async chat => {
        const user = users[`user_${chat.user}`];
        const [photo, username, last_seen, timestamp, content] = [user.profile_img, user.username, user.last_seen, chat.date, chat.content];
        const data = { id: chat['user'], photo, username, last_seen, timestamp, content };

        const exists = (!!document.getElementById("chat_" + data.id))
            && ((+data.timestamp == Number(document.getElementById("chat_" + data.id).getAttribute("data-time"))
                && { new: true }));
        const date = data.timestamp;
        const elDate = !!document.getElementById("chat_" + data.id)
            && document.getElementById("chat_" + data.id).getAttribute("data-time");
        if (container.classList.contains('active') && (+container.getAttribute('data-chat')) == data.id) {
            const user_data = { photo: `${user.profile_img}`, username: user.username, lastSeen: user.last_seen, chat_id: user.user_id };
            const [username_el, chat_box, imageprofile, status, last_seen] = [
                document.querySelector('.user-fullnames strong'),
                document.querySelector('.chat-body'),
                document.querySelector('.chat-box .user-profile img'),
                document.querySelector('.chat-box .user-profile .status'),
                document.querySelector('.chat-box .chat-data .status')
            ]
            const { photo, username, lastSeen, chat_id } = user_data;
            const period = Math.floor((Date.now() / 1000) - lastSeen);
            currentChat = chat_id;
            const formattedLastSeen = (period > (30 * 24 * 3600)) ? ('Derniere activitée ' + new TimeFormatter(lastSeen).formatTime())
                : (period > 60 ? ('Enligne il y a ' + new NumberFormatter(period).formatTime())
                    : "Enligne récemment");
            const online_status = (period) < 20 ? 'online' : 'off';
            const activeStatus = (period) < 20 ? 'Actif' : formattedLastSeen;

            imageprofile.setAttribute('src', photo);
            status.classList.remove("online");
            status.classList.add(online_status);
            last_seen.innerHTML = chat_id != currentUser.user_id ? activeStatus : "Envoyez-vous un message";
            username_el.textContent = username;
            getNewMessage(currentChat);
        }
        if (exists) {
            const lastSeen = +data.last_seen;
            const period = Math.floor((Date.now() / 1000) - lastSeen);
            const formattedLastSeen = (period > 60 ? (new NumberFormatter(period).formatTime())
                : "<" + new NumberFormatter(60).formatTime());
            const online_status = (period) < 20 ? 'online' : 'off';
            const activeStatus = (period) < 20 ? '' : formattedLastSeen;
            const statusEl = document.getElementById("chat_" + data.id).querySelector('.status');
            statusEl.classList.remove('online');
            statusEl.classList.add(online_status);
            document.getElementById("chat_" + data.id)
                .querySelector(".user-profile").setAttribute("data-lastseen", data.last_seen)
            statusEl.textContent = activeStatus;
            const unreadMessages = +chat.unread;
            document.querySelector(`#${"chat_" + data.id} b`)
                && (document.querySelector(`#${"chat_" + data.id} b`).textContent = unreadMessages || '');
        }
        if (!exists) {
            const messageData = messagePreview(data, exists);
            await newInChatlist(messageData.element, chat.unread, exists);
            messageData.element.addEventListener("click", (e) => {
                e.preventDefault();
                removeActiveChats();
                currentChat = user.user_id;
                messageData.element.classList.add("active");
                const formbox = document.querySelector('.container .form-box');
                formbox.innerHTML = `<div class="loader"></div>`

                container.classList.add("active");
                container.setAttribute('data-chat', user.user_id)
                const user_data = { photo: `${user.profile_img}`, username: user.username, name: user.name, lastSeen: user.last_seen, chat_id: user.user_id };
                openMessage(user_data);
            })
        }
    });
}
function sortMessages() {
    const messagesList = document.getElementById("message-list");
    const messages = Array.from(messagesList.querySelectorAll("[data-time]"));

    messages.sort((a, b) => {
        const timeA = parseInt(a.getAttribute("data-time"));
        const timeB = parseInt(b.getAttribute("data-time"));
        return timeB - timeA;
    });

    messages.forEach(message => {
        messagesList.appendChild(message);
    });
}

function removeActiveChats() {
    const all_chats = document.querySelectorAll(".messages-list .message");
    const container = document.querySelector(".container");
    container.classList.remove("active");
    container.removeAttribute('data-chat')
    all_chats.forEach(chat => {
        chat.classList.remove("active")
    });
    currentChat = false;
}
async function newInChatlist(chat, number = 0, exists = false, parent = null) {
    const container = document.querySelector('.container');
    const chatParent = chat.parentNode || ((parent) ?? document.getElementById('message-list'));
    if (chatParent.querySelector('.loading')) {
        chatParent.querySelector('.loading').remove();
    }
    const allMessages = chatParent.querySelectorAll('.message');
    const { firstIndex } = detecterLiVisibles(chatParent);

    if (exists.new || !exists) {
        ((allMessages.length > 1) && allMessages[0] != chat) && chat.classList.add("moving");
        chat.classList.contains("moving") && await wait(250);
        const firstVisible = allMessages[firstIndex];
        if (firstVisible) {
            chatParent.insertBefore(chat, firstVisible);
        } else {
            chatParent.prepend(chat);
        }
        chatParent.prepend(chat);
        sortMessages();
        setTimeout(() => {
            chat.querySelector('b') && (chat.querySelector('b').innerText = number ? number : '');
            chat.classList.remove('moving');
        }, 250);
        container.classList.contains("active") && updateChatBox();
    }
}
function wait(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    })
}
function UpdateConectedUser(current_user = {}) {

    if (!current_user.username) {
        return
    }
    const user_images = [...document.querySelectorAll('.connceted-user img'), ...document.querySelectorAll('.profile-picture img')];
    const user_fullnames = document.querySelectorAll('.user-data > .user-fullnames');

    user_images.forEach(image => {
        image.setAttribute('src', current_user.profile_img)
    })
    user_fullnames.forEach(userfullname => {
        userfullname.textContent = current_user.username;
        if (userfullname.nextSibling && userfullname.nextElementSibling.classList.contains('username')) {
            const username = "@" + current_user.name;
            userfullname.nextSibling.textContent = username;
        }
    })

}
updateTextareas();
function updateTextareas() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener("input", () => {
            textarea.parentNode.style.setProperty('--height', "auto");
            textarea.parentNode.style.setProperty('--height', textarea.scrollHeight + "px");
        })
        textarea.addEventListener("blur", () => {
            let scrollH = textarea.scrollHeight;
            setTimeout(() => {
                textarea.scrollTop = scrollH;
            }, 250);
        })

        addEventListener("resize", () => {
            textarea.parentNode.style.setProperty('--height', "auto");
            textarea.parentNode.style.setProperty('--height', textarea.scrollHeight + "px");
        })
    });
}
function nl2br(str) {
    return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
}

function addNewChat() {
    const [newChatDialog, newChatOpen, newChatClose] = [
        document.querySelector('.new-message-section'),
        document.querySelectorAll('.add-new-chat'),
        document.querySelector('.close-new-chat')
    ]
    const container = document.querySelector(".container");
    newChatOpen.forEach(async chatOpen => {
        chatOpen.addEventListener("click", async () => {
            newChatDialog.classList.add('active');
            const messageList = newChatDialog.querySelector('.messages-list');
            messageList.innerHTML = '';
            messageList.classList.add('loading');
            const getDatas = await getAvailableUsers();
            if (getDatas.session_error) {
                sessionError();
                return;
            }
            const { users } = getDatas;
            const usersArray = Object.values(users)
            usersArray.sort((a, b) => a.last_seen - b.last_seen);
            messageList.classList.remove('loading');
            if (!usersArray.length) {
                messageList.innerHTML = `<li class="message loading">
                <span class="chat-data">
                    <div class="message-preview"><span>Aucun utilisateur disponible</span></div>
                </span>`
                return;
            }
            messageList.innerHTML = '';
            usersArray.forEach(async chat => {
                const user = chat;
                const [photo, username, timestamp] = [user.profile_img, user.username, chat.last_seen];
                const data = { id: chat['user_id'], photo, username, timestamp, content: false, isNew: true };

                const messageData = messagePreview(data);
                if (!document.getElementById("new_chat_" + data.id)) {
                    await newInChatlist(messageData.element, 0, false, messageList);

                }
                messageData.element.addEventListener("click", (e) => {
                    e.preventDefault();
                    removeActiveChats();
                    messageData.element.classList.add("active");
                    newChatDialog.classList.remove('active');
                    container.classList.add("active");
                    container.setAttribute('data-chat', user.user_id)
                    const user_data = { photo: `${user.profile_img}`, username: user.username, name: user.name, lastSeen: user.last_seen, chat_id: user.user_id };
                    openMessage(user_data);
                })
            });
        })
    })
    newChatClose.addEventListener("click", () => {
        newChatDialog.classList.remove('active')
    })
}

function openMessage(user_data) {
    const [username_el, name_el, chat_box, imageprofile, status, last_seen] = [
        document.querySelector('.user-fullnames strong'),
        document.querySelector('.user-username'),
        document.querySelector('.chat-body'),
        document.querySelector('.chat-box .user-profile img'),
        document.querySelector('.chat-box .user-profile .status'),
        document.querySelector('.chat-box .chat-data .status')
    ]
    const { photo, username, name, lastSeen, chat_id } = user_data;
    currentChat = chat_id;
    const period = Math.floor((Date.now() / 1000) - lastSeen);
    const formattedLastSeen = (period > (30 * 24 * 3600)) ? ('Derniere activitée ' + new TimeFormatter(lastSeen).formatTime())
        : (period > 60 ? ('Enligne il y a ' + new NumberFormatter(period).formatTime())
            : "Enligne récemment");
    const online_status = (period) < 20 ? 'online' : 'off';
    const activeStatus = (period) < 20 ? 'Actif' : formattedLastSeen;

    imageprofile.setAttribute('src', photo);
    status.classList.add(online_status);
    last_seen.innerHTML = chat_id != currentUser.user_id ? activeStatus : "Envoyez-vous un message";
    username_el.textContent = `${username}`;
    name_el.textContent = "@" + name;

    chat_box.innerHTML = `
    <section class="unopened loading"></section>
    `
    displayMessages(chat_id);
}
async function displayMessages(id, messageList = false) {
    const chatBox = document.querySelector('.chat-body');
    const messages = !!messageList ? messageList : await getMessages(id);
    const formboxHTML = `
    <div class="image-preview" id="image-preview">
        <img src="" alt="">
        <div class="buttons">
            <button type="reset" form="image-form" title="Annuler">
                <span>Annuler</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                </svg>
            </button>
            <button type="submit" form="image-form" title="Envoyer">
                <span>Envoyer</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send">
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                </svg>
            </button>

        </div>
    </div>
    <section class="send-message">
        <form method="post" id="message-form">
            <textarea name="message" required placeholder="Ecrivez un message..." rows="1"></textarea>
        </form>
        <form class="image-form" id="image-form">
            <label title="Importer une photo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <input type="file" name="image" id="image-input" class="hidden-input" accept="image/*">
            </label>
            <label class="camera-input" title="Prendre une photo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-camera">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                    <circle cx="12" cy="13" r="3"/>
                </svg>
                <input type="file" name="camera" id="camera-input" class="hidden-input" accept="image/*" capture>
            </label>
        </form>
    </section>
    <button type="submit" title="Envoyer" form="message-form" class="message-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send">
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
        </svg>
    </button>
    `
    const formbox = document.querySelector('.container .form-box');
    if (formbox.querySelector('.loader')) {
        formbox.innerHTML = formboxHTML
    }
    updateTextareas();
    MessageForms();
    messages.sort((a, b) => b.date - a.date);
    if (!messages.length && !chatBox.querySelector('.loading')) {
        chatBox.innerHTML = `
        <section class="unopened">
            <p>Aucun message ici</p>
        </section>
        `;
        return;
    }
    if (!chatBox.querySelector(`.message-content`)) chatBox.innerHTML = '';
    messages.forEach(message => {
        const states = ['Envoyé', 'Vu', 'Distribué'];
        const state = states[message.status];
        if (document.getElementById(`message-${message.id}`)) {
            document.querySelector(`#message-${message.id} .state`).textContent = state;
            return;
        }
        const time = new TimeFormatter(message.date).formatLongTime();
        const content = message.type === 'text'
            ? `<p class="bubble">${message.content}</p>`
            : `<div class="image">
                <span class="close">&times;</span>
                <img src="${message.content}" alt="" loading="lazy">
            </div>`;
        const isMyMessage = (message.from === currentUser.user_id) ? ' outgoing' : ' incoming';
        const messageContainer = document.createElement('div');
        messageContainer.className = `message-content${isMyMessage}`;
        messageContainer.id = `message-${message.id}`;
        messageContainer.innerHTML =
            `
            <time>${time}</time>
            ${content}
            <span class="state">${state}</span>
        `;
        (!!messageList.length) ? chatBox.prepend(messageContainer) : chatBox.append(messageContainer);
        const previousSibling = messageContainer.previousSibling;
        if (previousSibling && previousSibling.querySelector('time')) {
            if (previousSibling.querySelector('time').textContent.trim() != time.trim()) {
                chatBox.insertBefore(document.createElement('spacer'), messageContainer);
            }
        }
        if (message.type === 'image') {
            const image_att = messageContainer.querySelector('.image');
            image_att.querySelector('img').addEventListener('click', () => {
                image_att.classList.add('full')
            })
            const image_att_close = messageContainer.querySelector('.close');
            image_att_close.addEventListener('click', () => {
                image_att.classList.remove('full');
            })
        }
    });
    updateChatBox();
}

// Exemple d'utilisation
function messagePreview(data, exists = false) {
    const verifier = new MessageVerifier(data, exists);
    const [validData, element] = [verifier.getData(), verifier.generatePreviewHTML()];
    return { validData, element };
}

function displayTime(time, element = null) {
    const formatter = new TimeFormatter(time);
    const formattedTime = formatter.formatTime();
    element ?
        element.textContent = formattedTime
        : console.log({ formattedTime });
}

function MessageForms() {
    const imageForm = document.getElementById('image-form');
    const imagePreview = document.getElementById('image-preview');
    const imageInputs = imageForm.querySelectorAll('input');
    const messageForm = document.getElementById('message-form');
    const messageTextarea = messageForm.querySelector('textarea');

    messageForm.addEventListener('submit', e => {
        e.preventDefault();
        if (messageTextarea.value.trim() === '') {
            return;
        }
        // Créez une URL pour le fichier en utilisant l'API URL.createObjectURL
        const content = nl2br(messageTextarea.value.trim());
        const type = 'text';
        const formData = new FormData();
        formData.append('type', "text");
        formData.append('content', (messageTextarea.value.trim()));
        SendMessage({ content, type, formData });
        messageForm.reset();
    })

    imageInputs.forEach(input => {
        input.addEventListener('focus', () => {
            imageForm.reset();
        });
        input.addEventListener('input', () => {
            // Vérifiez si un fichier a été sélectionné
            if (!input.files || input.files.length === 0) {
                console.log("Aucun fichier sélectionné.");
                return;
            }

            // Récupérez le premier fichier sélectionné
            const file = input.files[0];

            // Vérifiez si le fichier est une image en vérifiant son type MIME
            if (!file.type.startsWith('image/')) {
                return;
            }

            // Créez une URL pour le fichier en utilisant l'API URL.createObjectURL
            const imageUrl = URL.createObjectURL(file);
            const imageElement = imagePreview.querySelector('img');
            imageElement.setAttribute('src', imageUrl);

            // Affichez la prévisualisation de l'image dans l'élément img
            imagePreview.classList.add('active');
        });
    })
    imageForm.addEventListener('reset', () => {
        const imageElement = imagePreview.querySelector('img');
        imagePreview.classList.remove('active');
        imageElement.setAttribute('src', "");
    })
    imageForm.addEventListener('submit', e => {
        e.preventDefault();
        imageInputs.forEach(input => {
            // Vérifiez si un fichier a été sélectionné
            if (!input.files || input.files.length === 0) {
                return;
            }

            // Récupérez le premier fichier sélectionné
            const file = input.files[0];

            // Vérifiez si le fichier est une image en vérifiant son type MIME
            if (!file.type.startsWith('image/')) {
                return;
            }

            // Créez une URL pour le fichier en utilisant l'API URL.createObjectURL
            const content = URL.createObjectURL(file);
            const type = 'image';
            const formData = new FormData();
            formData.append('type', "image");
            formData.append('image', input.files[0]);

            // Affichez la prévisualisation de l'image dans l'élément img
            imagePreview.classList.remove('active');

            SendMessage({ content, type, formData })
            imageForm.reset();
        })
    })
}


async function SendMessage(message) {
    const chatBox = document.querySelector('.chat-body')
    const { content, type, formData } = message;
    const message_html = type === 'text'
        ? `<p class="bubble">${content}</p>`
        : `<div class="image">
                <img src="${content}" alt="">
            </div>`;
    const messageContainer = document.createElement('div');
    messageContainer.className = `message-content outgoing loading`;
    messageContainer.id = `message-${message.id}`;
    messageContainer.innerHTML =
        `
            <time class="message-status">Envoi...</time>
            ${message_html}
        `;
    chatBox.prepend(messageContainer);
    updateChatBox();
    const scrollH = chatBox.scrollHeight;
    setTimeout(() => {
        chatBox.scrollTop = scrollH;
    }, 300);
    if (message.type === 'image') {
        const image_att = messageContainer.querySelector('.image');
        image_att.addEventListener('click', () => {
            image_att.classList.toggle('full');
        });
    }
    const message_data = await UploadMessage(formData);
    messageContainer.id = message_data.id;
    const message_status = messageContainer.querySelector('.message-status');
    message_status.textContent = "Envoyé";
    setTimeout(() => {
        messageContainer.classList.remove('loading');
        const time = new TimeFormatter(message_data.date).formatLongTime();
        message_status.textContent = time;
        const previousSibling = messageContainer.previousSibling;
        if (previousSibling && previousSibling.querySelector('time')) {
            if (previousSibling.querySelector('time').textContent.trim() != time.trim()) {
                chatBox.insertBefore(document.createElement('spacer'), messageContainer.nextSibling);
            }
        }
    }, 1500);
    RenderLastMessages();
};
function copy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;

    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
}
function updateChatBox() {
    const chatBox = document.querySelector('.chat-body');
    const message = chatBox.querySelector('.message-content');
    const allMessage = chatBox.querySelectorAll('.message-content');
    const noMessage = chatBox.querySelector('.unopened');

    if (!message) {
        const lastMessage = document.getElementById('chat_' + currentChat);
        lastMessage && lastMessage.remove();
        chatBox.innerHTML = `
        <section class="unopened">
            <p>Aucun message ici</p>
        </section>`;
        return
    };
    allMessage.forEach(messageEl => {
        function createMenu(content) {
            const menu = document.createElement('li');
            menu.className = "menu";
            menu.textContent = content;
            return menu;
        }
        const messageBubbles = [
            ...messageEl.querySelectorAll('.bubble'),
            ...messageEl.querySelectorAll('.image')
        ];
        messageBubbles.forEach(bubble => {
            const bubblePositions = ['first', 'center', 'last', 'unique'];

            bubblePositions.forEach(position=>{
                bubble.classList.remove(position);
            });
            const bubbleParent = bubble.parentNode;
            const bubbleParentClass = bubbleParent.classList[1];

            if (['incoming' , 'outgoing'].includes(bubbleParentClass)) {
                const bubbleParentPrevious = (bubbleParent.previousSibling 
                    && bubbleParent.previousSibling.classList 
                    && bubbleParent.previousSibling.classList.contains(bubbleParentClass)) ? bubbleParent.previousSibling : false;
                const bubbleParentNext = (bubbleParent.nextSibling 
                    && bubbleParent.nextSibling.classList
                    && bubbleParent.nextSibling.classList.contains(bubbleParentClass)) ? bubbleParent.nextSibling : false;
    
                const bubbleNewPos = (bubbleParentPrevious  || bubbleParentNext) ? ((bubbleParentPrevious && !bubbleParentNext) ? bubblePositions[2] : ((bubbleParentPrevious && bubbleParentNext) ? bubblePositions[1] : bubblePositions[0])) : bubblePositions[3];
    
                bubble.classList.add(bubbleNewPos);
            }else{
                bubble.classList.add(bubblePositions[3]);
            }

        })
        messageEl.addEventListener('contextmenu', e => {
            e.preventDefault();
            const modalOverlay = document.querySelector('.modal-overlay');
            const contextMenu = document.querySelector('.context-menu');
            const deleteMenu = createMenu("Supprimer");

            const messageMenus = [];
            if (messageEl.classList.contains('outgoing')) {
                messageMenus.push(deleteMenu);
                deleteMenu.addEventListener('click', async () => {
                    const id = +(messageEl.getAttribute('id').split('-')[1]);
                    messageEl.querySelector('time').textContent = 'Suppression...'
                    const success = await deleteMessage(id);
                    if (!success.success) {
                        messageEl.querySelector('time').textContent = 'Impossible de supprimer';
                        return;
                    }
                    messageEl.remove();
                    updateChatBox();
                })
            }
            messageBubbles.forEach(bubble => {

                if (bubble.querySelector('img')) {
                    const imageMenu = createMenu("Enregistrer");
                    messageMenus.unshift(imageMenu);
                    imageMenu.addEventListener('click', () => {
                        download(bubble.querySelector('img').getAttribute('src'));
                    })
                }
                if (bubble.tagName.toLocaleLowerCase() === 'p') {
                    const copyMenu = createMenu("Copier");
                    messageMenus.unshift(copyMenu);
                    copyMenu.addEventListener('click', () => {
                        copy(bubble.textContent);
                    })
                }
            });
            // Vérifier si le menu dépasse le bord inférieur de la fenêtre
            const menuHeight = contextMenu.offsetHeight;
            const windowHeight = window.innerHeight;
            const contextTop = e.clientY + menuHeight > windowHeight ? e.clientY - menuHeight : e.clientY;

            // Vérifier si le menu dépasse le bord droit de la fenêtre
            const menuWidth = contextMenu.offsetWidth;
            const windowWidth = window.innerWidth;
            const contextLeft = e.clientX + menuWidth > windowWidth ? e.clientX - menuWidth : e.clientX;

            contextMenu.style.setProperty('--context-top', `${contextTop}px`);
            contextMenu.style.setProperty('--context-left', `${contextLeft}px`);
            contextMenu.innerHTML = 'Chargement...'
            contextMenu.classList.add('active');
            modalOverlay.classList.add('active');

            messageMenus.length ? contextMenu.innerHTML = ''
                : contextMenu.innerHTML = "Impossible d'afficher le menu"
            messageMenus.forEach(menu => {
                contextMenu.append(menu);
                menu.addEventListener('click', () => {
                    contextMenu.removeAttribute('style');
                    contextMenu.classList.remove('active');
                    modalOverlay.classList.remove('active');
                    contextMenu.innerHTML = ''
                });
            });

            modalOverlay.addEventListener('click', () => {
                contextMenu.removeAttribute('style');
                contextMenu.classList.remove('active');
                modalOverlay.classList.remove('active');
                contextMenu.innerHTML = ''
            });
        });

    });
    noMessage && noMessage.remove();
}

async function getNewMessage(id) {
    const chatBox = document.querySelector('.chat-body');
    const allMessages = chatBox.querySelectorAll('.message-content:not(.error)');
    const new_message = await getMessages(id);
    if (new_message.session_error) {
        sessionError();
        return;
    }

    allMessages.forEach(messageEl => {
        const id = +(messageEl.getAttribute('id').split('-')[1]);
        if (!new_message.find(message => message.id == id)) {
            messageEl.remove();
        }
    });
    displayMessages(id, new_message);
}