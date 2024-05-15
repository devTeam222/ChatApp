import { 
    createAvatar, 
    resizeAndCropImage, 
    refreshImages 
} from "./images.js";
import { modalDialog } from "./navigation.js";

// ! Recevoir les formulaires
function getForm(type = 'login') {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', './partials/_forms.php');
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
        form_data.append(type, true);
        xhr.send(form_data);
    })
}

// ! Fonction d'enregistrement
async function registerForm() {
    const modal_window = document.querySelector('.modal-window');
    modal_window.classList.add('active');
    modal_window.innerHTML = `
    <header class="modal-header">
            <h3>Inscription</h3>
            <span class="modal-close">&times;</span>
        </header>
        <form method="post" id="modal-form" class="modal-body" data-type="register">
            <span>Chargement...</span>
        </form>
        <footer class="modal-footer">
            <span>Etiez-vous déjà parmi nous ? <a href="#login">Connexion</a></span>
            <div class="buttons">
                Chargement...
            </div>
        </footer>
    `;
    const formContent = await getForm('register');
    modal_window.querySelector('form').innerHTML = formContent;
    modal_window.querySelector('.modal-footer a').addEventListener('click', e => {
        e.preventDefault();
        loginForm();
    })
    formNavigation();
}

// ! Fonction de connexion
async function loginForm() {
    const modal_window = document.querySelector('.modal-window');
    modal_window.classList.add('active');
    modal_window.innerHTML = `
    <header class="modal-header">
            <h3>Connection</h3>
            <span class="modal-close">&times;</span>
        </header>
        <form method="post" id="modal-form" class="modal-body" data-type="login">
            <span>Chargement...</span>
        </form>
        <footer class="modal-footer">
            <span>Etes vous nouveau ? <a href="#">S'enregistrer</a></span>
            <div class="buttons">
                Chargement...
            </div>
        </footer>
    `;
    const formContent = await getForm('login');
    modal_window.querySelector('form').innerHTML = formContent;
    modal_window.querySelector('.modal-footer a').addEventListener('click', e => {
        e.preventDefault();
        registerForm();
    })
    formNavigation();
}

// ! Fonction de navigation et de gestion de formulaire
function formNavigation() {
    let currentStep;
    const all_steps = document.querySelectorAll('.modal-body > *');
    let fullNames, username, profilePicture, passwordField = false;
    const form = document.querySelector('.modal-window form');
    const formType = form.getAttribute('data-type');
    form.addEventListener('submit', e => {
        e.preventDefault();
        if(formType){
            const submitInput = document.querySelector('.modal-footer [type="submit"]');
            submitInput && submitInput.classList.add("loading");
            if (document.getElementById("password").validity.valid) {
                const password = document.getElementById("password").value;
                passwordField = password;
            }
            // Vérifier les données avant de les envoyer
            if (formType == 'register' && fullNames && username && profilePicture && passwordField) {
                const form_data = new FormData();
                form_data.append('fullnames', fullNames);
                form_data.append('username', username);
                form_data.append('profile', profilePicture.blob, "profile.webp");
                form_data.append('pwd', passwordField);
                form_data.append('register', true);
                connectUser(form_data).then(data=>{
                    submitInput.textContent = "Connexion...";
                });;
            };
            // Vérifier les données avant de les envoyer
            if (formType === 'login' && passwordField) {
                submitInput.textContent = "Connexion...";
                const form_data = new FormData(form);
                form_data.append('login', true);
                connectUser(form_data).then(data=>{
                    const message = data.error;
                    if(data.type == 'password'){
                        InvalidInput(document.getElementById("password"), {message})
                    }else{
                        InvalidInput(document.getElementById("username"), {message})
                    }
                    submitInput.classList.remove("loading")
                });
            };
        }
    });
    goToStep();
    function goToStep(stp = 0) {
        all_steps.forEach(step => {
            step.classList.remove('active');
        });
        for (let i = 0; i < all_steps.length; i++) {
            const step = all_steps[i];
            const stepsPreview = document.querySelector(".steps") || document.createElement("div");
            const form = document.querySelector('.modal-body');
            if (all_steps.length > 1 && !document.querySelector(".steps")) {
                stepsPreview.classList.add("steps");
                form.prepend(stepsPreview);
            }
            const currentStep = stepsPreview.querySelectorAll('span')[i] || document.createElement("span");
            !stepsPreview.querySelectorAll('span')[i]
                ? stepsPreview.append(currentStep)
                : currentStep.classList.remove('active');
            if (stp === i) {
                currentStep.classList.add('active');
                step.classList.add('active');
                step.parentNode.style.setProperty('--left-pos', `-${i * 100}%`);
            }
            let required = false;
            const all_inputs = step.querySelectorAll('input');
            all_inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    if (!step.classList.contains('active')) {
                        input.blur();
                        document.querySelectorAll('.modal-footer button')[1].click();
                    }
                });
                required = input.required;
            });
            if (stp === i) {
                if (step.querySelector('#image-preview')) {
                    const [imageInput, imagePreview] = [
                        document.getElementById('profile-pic'),
                        document.getElementById('image-preview')
                    ];
                    imageInput && imageInput.addEventListener('change', async e => {
                        profilePicture = await validProfile();
                    });
                }
                const showPassword = step.querySelector('#show-password');
                const password = step.querySelector('#password');
                if (showPassword && password) {
                    showPassword.addEventListener('change', () => {
                        password.type = showPassword.checked ? 'text' : 'password';
                    })
                }
                const position = ['unique', 'start', 'middle', 'end'];
                if (i === 0) {
                    bottomButtons({ position: position[1], required });
                }
                if (i === (all_steps.length - 1)) {
                    bottomButtons({ position: position[3], required });
                }
                if ((all_steps.length > 2) && i > 0 && i < (all_steps.length - 1)) {
                    bottomButtons({ position: position[2], required });
                }
                if (all_steps.length === 1) {
                    bottomButtons({ position: position[0], required });
                }
                const nextButtons = document.querySelectorAll('.modal-footer .next-step');
                const prevButtons = document.querySelectorAll('.modal-footer .prev-step');

                prevButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        goToStep(i - 1);
                    });
                });

                const submitBtn = document.querySelector('.modal-footer button[type="submit"]');
                if (submitBtn) {
                    submitBtn.addEventListener('click', async (e) => {
                        let invalid_step = document.querySelector('.modal-body > *.active input:invalid');
                        if (invalid_step) {
                            InvalidInput(invalid_step);
                            return;
                        }
                        if(step.querySelector("input[name='username']")){
                            username = step.querySelector("input[name='username']").value.trim();
                        }
                        const initialContent = submitBtn.textContent;
                        submitBtn.textContent = 'Envoi...';
                        submitBtn.classList.add('loading');
                        if(!document.getElementById('username')){
                            const inputCheck = await inputsCheck(step);
                        }
                        if (document.getElementById("password").validity.valid) {
                            const password = document.getElementById("password").value;
                            passwordField = password;
                        }
                        submitBtn.textContent = initialContent;
                        submitBtn.classList.remove('loading');
                    })
                }
                const nextButton = nextButtons[0];
                if (nextButton) {
                    nextButton.addEventListener('click', async () => {
                        let invalid_step = document.querySelector('.modal-body > *.active input:invalid');
                        if (invalid_step) {
                            InvalidInput(invalid_step);
                            return;
                        }
                        const initialContent = nextButton.textContent;
                        nextButton.textContent = 'Pentientez...';
                        nextButton.classList.add('loading');
                        const inputCheck = await inputsCheck(step);
                        if (step.querySelector("input[name='username']")) {
                            await new Promise((resolve) => {
                                const userName = step.querySelector("input[name='username']").value.trim();
                                // Générer un avatar avec la première lettre du nom
                                const firstLetter = userName[0];
                                createAvatar(firstLetter, 200)
                                    .then(avatar => {
                                        username = userName;
                                        profilePicture = avatar; // Affiche l'URL de l'image redimensionnée et recadrée
                                        const [imageInput, imagePreview] = [
                                            document.getElementById('profile-pic'),
                                            document.getElementById('image-preview')
                                        ];
                                        imagePreview.src = profilePicture.blobUrl;
                                        resolve();
                                    })
                                    .catch(error => {
                                        console.error('Une erreur s\'est produite :', error);
                                    });
                                resolve();
                            })
                        }
                        if (inputCheck && step.querySelector("input[name='fullnames']")) {
                            const fullnames = step.querySelector("input[name='fullnames']").value.trim();
                            fullNames = fullnames;
                        }
                        !inputCheck && InvalidInput(document.querySelector('.modal-body > *.active input:invalid'));
                        nextButton.classList.remove('loading');
                        setTimeout(() => {
                            nextButton.textContent = initialContent;
                            let invalid_step = document.querySelector('.modal-body > *.active input:invalid');
                            if (invalid_step) {
                                InvalidInput(invalid_step);
                                return;
                            }
                            if (!inputCheck) {
                                return;
                            }
                            goToStep(i + 1);
                        }, 300);
                    });
                }
            }

            modalDialog()


        }
        currentStep = stp;
    }
}


function bottomButtons(pos) {
    const modalButtons = document.querySelector('.modal-footer .buttons');
    const required = !!pos.required ? 'Suivant' : "Passer"
    const start = `
    <button type="reset" form="modal-form" class="bouton modal-close">Annuler</button>
    <button type="button" class="bouton next-step">Suivant</button>
    `
    const unique = `
    <button type="reset" form="modal-form" class="bouton modal-close">Annuler</button>
    <button type="submit" form="modal-form" class="bouton">Confirmer</button>
    `
    const middle = `
    <button type="button" form="modal-form" class="bouton prev-step">Precedent</button>
    <button type="button" class="bouton next-step">${required}</button>
    `;
    const end = `
    <button type="button" form="modal-form" class="bouton prev-step">Precedent</button>
    <button type="submit" form="modal-form" class="bouton">Confirmer</button>
    `;
    const position = { start, unique, middle, end };
    modalButtons.innerHTML = position[pos.position];
}
function connectUser(form_data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', './apis/sendData.php');
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        let data = JSON.parse(xhr.response);
                        if (data.success) {
                            location.reload();
                            return;
                        }
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
        xhr.send(form_data);
    })
}
function validProfile() {
    return new Promise((resolve, reject) => {
        const [imageInput, imagePreview] = [
            document.getElementById('profile-pic'),
            document.getElementById('image-preview')
        ];

        if (!imageInput.files[0]) {
            return;
        }
        const imageFile = imageInput.files[0];
        // Transformer le fichier image en blob
        // const imgBlob = URL.createObjectURL(imageFile);
        const imageUrlOrBlob = imageFile; // URL ou Blob de l'image à redimensionner et recadrager

        const newSize = 500; // Taille souhaitée pour le côté du carré
        resizeAndCropImage(imageUrlOrBlob, newSize)
            .then(croppedImage => {
                imagePreview.src = croppedImage.blobUrl ? croppedImage.blobUrl : "" // Affiche l'URL de l'image redimensionnée et recadrée
                resolve(croppedImage);
            })
            .catch(error => {
                console.error('Une erreur s\'est produite :', error);
                reject();
            });
    })
}

function inputsCheck(stp = null) {
    if (!stp) {
        return;
    }
    const step = stp;
    if (!step.querySelector('input').required) {
        return true;
    }
    const all_inputs = step.querySelectorAll('input');
    return new Promise(async (resolve) => {
        let result = false;
        const requiredInputs = [];
        all_inputs.forEach(async (input) => {
            const isRequired = Boolean(input.required);
            const emptyRequired = await checkEmptyFields(input);
            if (isRequired && emptyRequired) {
                requiredInputs.push(input);
                InvalidInput(requiredInputs[0]);
            }
        });

        if (requiredInputs.length) {
            result = false;
            return;
        }
        if (step.querySelector("input[name='username']")) {
            const usernameInput = step.querySelector("input[name='username']");
            const emptyUsername = await checkEmptyFields(usernameInput);
            const usrn = emptyUsername && (await checkUserName(usernameInput));
            result = (usrn);
        }

        const passwordInputs = step.querySelectorAll('input[type="password"');

        if (passwordInputs.length === 2) {
            const emptyPass = await checkEmptyFields(passwordInputs[0]);
            const pass = emptyPass && checkPasswordMatch({ input1: passwordInputs[0], input2: passwordInputs[1] });
            result = pass;
        }
        resolve(result);
    })
}
async function InvalidInput(input, error = false) {
    if (!input) {
        return true;
    }
    input.focus();
    if (error.message) {
        input.parentNode.setAttribute('data-error', error.message);
        input.classList.add('error');
        input.addEventListener('input', () => {
            input.classList.remove('error');
        })
        setTimeout(() => {
            input.classList.remove('error');
        }, 20000);
        return false;
    } 
    
    if (input.validity.valid) {
        return true;
    }
        input.classList.add('invalid');
        input.addEventListener('input', () => {
            input.classList.remove('invalid');
        })
        setTimeout(() => {
            input.classList.remove('invalid');
        }, 3000);
        return false;
}

function ValidInput(input, success = false) {
    if (success.message) {
        input.parentNode.setAttribute('data-valid', success.message);
        input.classList.add('valid');
        input.addEventListener('input', () => {
            input.classList.remove('valid');
        })
        setTimeout(() => {
            input.classList.remove('valid');
        }, 3000);
        return;
    }
}

async function checkEmptyFields(input) {
    const value = input.value;
    const isNotEmpty = await new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', './apis/getData.php');
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        let data = xhr.response
                        data = JSON.parse(data);

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
        form_data.append("check_empty", value);
        xhr.send(form_data);
    });
    isNotEmpty.success ? ValidInput(input, isNotEmpty.success) : InvalidInput(input, isNotEmpty.error);
    return !!isNotEmpty.success;
}
async function checkUserName(input) {
    const username = input.value;
    const isUserNameNew = await new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', './apis/getData.php');
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        let data = xhr.response
                        data = JSON.parse(data);

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
        form_data.append("check_username", username);
        xhr.send(form_data);
    });
    isUserNameNew.success ? ValidInput(input, isUserNameNew.success) : InvalidInput(input, isUserNameNew.error);
    return !!isUserNameNew.success;
}

function checkPasswordMatch(inputs) {
    const { input1, input2 } = inputs;
    if (input1.value !== input2.value) {
        const error = { message: "Vous avez du faire une faute de frappe car ce mot de passe est différent du premier !" };
        console.log(error);
        InvalidInput(input2, error);
    };
    return (input1.value === input2.value);
}

function logout() {
    sessionStorage.clear();
        const modal_window = document.querySelector('.modal-window');
        const userImg = document.querySelector('.connected-user img').getAttribute('src') || ''
        modal_window.classList.add('active');
        modal_window.innerHTML = `
        <header class="modal-header">
                <h3>Déconnexion</h3>
                <span class="modal-close">&times;</span>
            </header>
            <section method="post" class="modal-body" data-type="login">
                <section class="active conneted-user">
                    <h1>Vous nous quittez déjà ? </h1>
                    <label title="Profil" class="profile-picture">
                        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round">
                            <path d="M18 20a6 6 0 0 0-12 0" />
                            <circle cx="12" cy="10" r="4" />
                            <circle cx="12" cy="12" r="10" />
                        </svg>
                        <img src="${userImg}" alt="" id="image-preview">
                    </label>    
                    <p>🌟 Mais vous étiez tellement génial(e) à discuter avec nous ! <br>
                    On adore votre compagnie ici !</p>
                </section>
            </section>
            <footer class="modal-footer">
                <span>Êtes-vous sûr(e) de vouloir vous déconnecter ?</span>
                <div class="buttons">
                    <button type="button" form="modal-form" class="bouton modal-close">Annuler</button>
                    <button type="button" form="modal-form" class="bouton logout">Partir</button>
                </div>
            </footer>
        `;
        modal_window.querySelector('.logout').addEventListener('click',async e=>{
            e.preventDefault();
            e.target.classList.add('loading')
            e.target.textContent = "Deconnexion..."
            await new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                    xhr.open('POST', './apis/sendData.php');
                    xhr.onload = () => {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status === 200) {
                                try {
                                    let data = xhr.response;
                                    location.reload();
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
                    formData.append('logout', true)
                    xhr.send(formData);
            })
            e.target.classList.remove('loading')
            e.target.textContent = "Deconneté"
        })
}


export { 
    getForm, 
    registerForm, 
    loginForm, 
    validProfile, 
    inputsCheck, 
    InvalidInput, 
    ValidInput, 
    checkEmptyFields, 
    checkUserName, 
    checkPasswordMatch, 
    logout
}