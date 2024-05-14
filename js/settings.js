import { 
    accountActions, 
    chatActions, 
    getNotification, 
    profileActions, 
    emailActions, 
    downloadUserData, 
    deleteMyAccount 
} from "./actions.js";


async function openSettings() {
    const settingMenu = document.querySelector('.main-nav .settings');
    const closeSettings = document.querySelectorAll('.close-settings');
    const overlay = document.querySelector('.modal-overlay');
    const settingMenuList = document.querySelectorAll('.setting-menu li');
    const settingOptions = document.querySelector('.setting-options');


    settingMenu.classList.toggle('active');
    overlay.classList.add("active");
    const titles = {
        account: "Compte",
        chat: "Discussions",
        notification: "Notifications",
        profile: "Profil"
    }
    const options = {
        account: {
            type: 'server',
            content: 'account',
            actions: accountActions
        },
        chat: {
            type: 'server',
            content: 'chat',
            actions: chatActions
        },
        notification: {
            type: 'dynamic',
            content: getNotification
        },
        profile: {
            type: 'server',
            content: 'profil',
            actions: profileActions
        }
    }
    const subTitles = {
        email: "Adresse e-mail",
        data: "Informations du compte",
        delete_account: "Supprimer mon compte",
    }
    const subOptions = {
        email: {
            type: 'server',
            content: 'email',
            actions: emailActions
        },
        data: {
            type: 'server',
            content: 'userdata',
            actions: downloadUserData
        },
        delete_account: {
            type: 'server',
            content: 'deleteuser',
            actions: deleteMyAccount
        }
    }
    settingMenuList.forEach(menu => {
        menu.addEventListener('click', async () => {
            settingMenuList.forEach(menu => {
                menu.classList.remove('active')
            })
            menu.classList.add('active')
            settingOptions.classList.add('active');
            if (menu.getAttribute('data-setting')) {
                const settingOption = menu.getAttribute('data-setting');
                const optionData = options[settingOption];
                const title = titles[settingOption];
                const type = optionData.type;
                const option = optionData.content;
                settingOptions.innerHTML = `
                <header class="setting-header">
                    <span title="Retour" class="close-options">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left">
                            <path d="m12 19-7-7 7-7"/>
                            <path d="M19 12H5"/>
                        </svg>
                    </span>
                    <h2>${title}</h2>
                </header>
                <section class="setting-body loading"></section>
                `;

                const settingBody = settingOptions.querySelector('.setting-body');
                const content = (type === 'dynamic') ? await getDynamic(option) 
                            : ((type === 'server') ? await getServer(optionData) : option);
                settingBody.classList.remove('loading');
                settingBody.innerHTML = content;
            }

            refreshSubmenu();
            const closeOptions = document.querySelectorAll('.close-options');
            closeOptions.forEach(close => {
                close.addEventListener('click', () => {
                    if (!document.querySelector('.setting-header h3')) {
                        settingOptions.classList.remove('active');
                        return;
                    }
                    if (menu && menu.classList.contains('active')) {
                        menu.click();
                    }
                })
            });
        });
        refreshSubmenu();
        function refreshSubmenu() {
            const settingSubMenuList = document.querySelectorAll('.setting-body li');

            settingSubMenuList.forEach(submenu => {
                submenu.addEventListener('click', async () => {
                    if (submenu.getAttribute('data-sub-setting')) {
                        const menu_type = submenu.getAttribute('data-sub-setting');
                        const optionhead = `<h3><span class="desktop">> </span>  ${subTitles[menu_type]}</h3>`;

                        const settingOptionHead = settingOptions.querySelector('.setting-header');
                        const settingHead = settingOptions.querySelector('.setting-header h2');
                        const settingOptionBody = settingOptions.querySelector('.setting-body');
                        if (!settingOptionHead.querySelector('h3')) {
                            settingHead.classList.add('desktop');
                            settingHead.classList.add('close-options');
                            settingOptionHead.innerHTML += optionhead;
                        }
                        settingOptionBody.innerHTML = '';
                        settingOptionBody.classList.add('loading');

                        const optionData = subOptions[menu_type];
                        const type = optionData.type;
                        const option = optionData.content;
                        const optionbody = (type === 'dynamic') ? await getDynamic(option) 
                        : ((type === 'server') ? await getServer(optionData) : option);
                        settingOptionBody.classList.remove('loading');
                        settingOptionBody.innerHTML = optionbody;
                        settingHead.addEventListener('click', () => {
                            if (menu.classList.contains('active')) {
                                menu.click();
                            }
                            if (!document.querySelector('.setting-header h3')) {
                                settingOptions.classList.remove('active');
                                return;
                            }
                        })
                        refreshSubmenu(menu)
                    }
                    if (submenu.querySelector('input')) {
                        const input = submenu.querySelector('input');
                        const initialValue = input.value;
                        input.removeAttribute('readonly')
                        input.focus();
                        input.addEventListener('blur', () => {
                            if (input.value.trim() === '' || !input.validity.valid) {
                                input.value = initialValue;
                            }
                            input.setAttribute('readonly', true);
                        })
                    }
                })
            });
            const closeOptions = document.querySelectorAll('.close-options');
            closeOptions.forEach(close => {
                close.addEventListener('click', (e) => {
                    if (!document.querySelector('.setting-header h3')) {
                        settingOptions.classList.remove('active');
                        return;
                    }
                    if (menu && menu.classList.contains('active')) {
                        menu.click();
                    }
                })
            });

            const settingHead = settingOptions.querySelector('.setting-header h2');
            settingHead.addEventListener('click', (e) => {
                if (!document.querySelector('.setting-header h3')) {
                    settingOptions.classList.remove('active');
                    return;
                }
                if (menu && menu.classList.contains('active')) {
                    menu.click();
                }
            })
        }
    });
    overlay.addEventListener('click', () => {
        settingMenu.classList.remove('active');
        overlay.classList.remove('active');
    })
    closeSettings.forEach(close => {
        close.addEventListener('click', () => {
            settingMenu.classList.remove('active');
            overlay.classList.remove('active');
        })
    });
    if (window.innerWidth > 500) {
        settingMenuList[0].click();
    };
}
function getHTMLcontent(content) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', './partials/_settings.php');
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        let data = xhr.response;
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

        let form_data = new FormData();
        form_data.append("setting", content);
        xhr.send(form_data);
    })
}
async function getServer(option) {
    const { content, actions } = option;
    const htmlcontent = await getHTMLcontent(content);
    actions();
    return htmlcontent;
}

function getDynamic(option) {
    return option();
}

export { openSettings }