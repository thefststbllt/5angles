import {MAX_DEVICE_WIDTH} from '../variables';

const mobileMenu = document.querySelector('.main-header__container');
const navigation = document.querySelector('.navigation');
const userMenu = mobileMenu.querySelectorAll('.user-menu__item');
const burgerButton = mobileMenu.querySelector('.burger-button');

const isBasket = (listItem) => {
    return Array.from(listItem.classList).includes('user-menu__item--basket')
};

const isOpened = (element) => {
    return Array.from(element.classList).includes('main-header__container--opened');
};

const initMobileMenu = () => {

    const closeMenu = () => {
        mobileMenu.classList.toggle('main-header__container--closed');
        mobileMenu.classList.toggle('main-header__container--opened');
        burgerButton.classList.toggle('burger-button--close');
        userMenu.forEach((item) => {
            if (!isBasket(item)) {
                item.classList.toggle('visually-hidden');
            }
        });

        navigation.classList.toggle('visually-hidden');
    };

    mobileMenu.classList.add('main-header__container--opened');
    burgerButton.classList.add('burger-button--close');
    closeMenu();

    document.addEventListener('click', (evt) => {
        if (evt.target === burgerButton || (evt.target !== mobileMenu && isOpened(mobileMenu))) {
            closeMenu();
        }
    });

}

if (window.matchMedia(`(max-width: ${MAX_DEVICE_WIDTH.mobile}px)`).matches) {
    initMobileMenu();
}
