import {CURRENCY_SIGN, FISH_PROMO_CODES} from '../../utils';
import {prettify, getCleanNumber} from '../purchase-prices/purchase-prices';
import {getFormData} from '../form-data/form-data';
import {getSuccessMessage} from '../success-message/success-message';

const pageForm = document.querySelector('#page-form');
const grossValue = pageForm.querySelector('#gross-value');
const promoField = pageForm.querySelector('#promo-field');
const promoCodeValue = pageForm.querySelector('#promo-code-value');
const discountValue = pageForm.querySelector('#discount-value');
const totalBasketPrice = pageForm.querySelector('#total-price');
const deliveryPrice = pageForm.querySelector('#delivery-price');
const allFormButtons = pageForm.querySelectorAll('button');
const allFormInputs = pageForm.querySelectorAll('input');
const allFormTextFields = pageForm.querySelectorAll('textarea');
const couponFoundMessage = '\u00A0- купон применен';
const couponNotFoundMessage = '\u00A0- купон не найден';

const getDiscountView = (value) => {
    return `-\u00A0${value}\u00A0${CURRENCY_SIGN}`
};

promoCodeValue.innerText = getDiscountView(0);

const toggleInteractive = (value) => {
    promoField.disabled = value;
    allFormButtons.forEach(button => button.disabled = value);
    allFormInputs.forEach(input => {
        input.disabled = true;
        input.style.color = '#c8c8c8';
    });
    allFormTextFields.forEach(field => field.disabled = value);
};

const currentPromoVal = {
    getValue: 0,
    setValue(value) {
        this.getValue = value ?? 0;
    }
};

const initPromoValidation = () => {

    const currentCode = {
        getCode: '',
        setCode(value) {
            this.getCode = value;
        }
    };

    const getPromoMessage = (status) => {
        const promoWrapper = pageForm.querySelector('.overall__promocode');
        const message = () => {
            if (status === true) {
                promoWrapper.classList.remove('overall__promocode--wrong-code');
                return currentCode.getCode + couponFoundMessage;
            }
            if (status === false) {
                promoWrapper.classList.add('overall__promocode--wrong-code');
                return currentCode.getCode + couponNotFoundMessage;
            }
        }
        return promoWrapper.setAttribute('data-promo-status', message());
    }

    const initCodeValidation = () => {
        currentCode.setCode(promoField.value);
        const foundKey = Object.keys(FISH_PROMO_CODES).find((key) => key === currentCode.getCode);
        currentPromoVal.setValue(FISH_PROMO_CODES[foundKey]);
    }

    promoField.addEventListener('input', () => initCodeValidation());

    if (promoField.value.length === 0) {
        promoField.removeEventListener('input', () => initCodeValidation());
    }

    pageForm.addEventListener('submit', (evt) => {
        evt.preventDefault();
        promoCodeValue.innerText = getDiscountView(currentPromoVal.getValue.toString());
        discountValue.innerText = getDiscountView(prettify(Math.abs(getCleanNumber(discountValue.innerText)) + Math.abs(getCleanNumber(currentPromoVal.getValue.toString()))));
        totalBasketPrice.innerText = prettify(Math.abs(getCleanNumber(grossValue.innerText)) - Math.abs(getCleanNumber(discountValue.innerText)) + Math.abs(getCleanNumber(deliveryPrice))) + `\u00A0${CURRENCY_SIGN}`;
        promoField.value = '';
        if (getCleanNumber(promoCodeValue.innerText)) {
            toggleInteractive(true)
            getPromoMessage(true);
        }
        if (!getCleanNumber(promoCodeValue.innerText)) {
            getPromoMessage(false)
        }
        setTimeout(getSuccessMessage, 2000);
        getFormData();
    })
};

initPromoValidation();
export {currentPromoVal, getDiscountView};