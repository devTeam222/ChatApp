import { registerForm, loginForm, logout } from "./forms.js";
import { openSettings } from "./settings.js";

Nav();
function Nav() {
    const nav_links = document.querySelectorAll('a');
    nav_links.forEach(link=>{
        if (link.href && link.href.split(':').includes('javascript') && link.href.split('javascript:')[1]){
            link.addEventListener('click', e=>{
                e.preventDefault();
                eval(link.href.split('javascript:')[1]);
                modalDialog();
            })
        }
    })
    formButtons();
    modalDialog();
    const mainNavigation = document.querySelector(".main-nav");
    const container = document.querySelector(".container");
    const mainNavToggles = document.querySelectorAll(".toggle-menu");
    const backToHomeBtns = document.querySelectorAll(".back-to-home");
    mainNavToggles.forEach(navtoggle => {
        navtoggle.addEventListener("click", () => {
            mainNavigation.classList.toggle("active");
        })
    });
    backToHomeBtns.forEach(backToHomeBtn => {
        backToHomeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            container.classList.remove("active");
        })
    });
    window.addEventListener("popstate", e => {
        const all_active_elements = document.querySelectorAll(".active");
        if (document.querySelector(".active")) {
            e.preventDefault();
            all_active_elements.forEach(active_element => {
                active_element.classList.remove('active');
            });
        }
    })
}
function formButtons() {
    const form_buttons = document.querySelectorAll('.form-button');
    form_buttons.forEach(form_button => {
        const type = form_button.getAttribute('data-modal');
        form_button.addEventListener('click', () => {
            type === 'register' ? registerForm() : loginForm();
        })
    })
}
function modalDialog() {
    const modal_window = document.querySelector('.modal-window');
    const modal_closes = document.querySelectorAll('.modal-close');
    modal_closes.forEach(close => {
        close.addEventListener('click', () => {
            modal_window.classList.remove('active');
        })
    });
}
export { Nav, modalDialog }