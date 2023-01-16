import {CURRENCY_SIGN} from '../../utils';
import {currentPromoVal, getDiscountView} from '../promo-validation/promo-validation';

const purchasesList = document.querySelectorAll('.purchase-item');
const basketQuantity = document.querySelector('#basket-item-count');
const basketTotal = document.querySelector('#basket-total');
const grossValue = document.querySelector('#gross-value');
const discountValue = document.querySelector('#discount-value');
const promoValue = document.querySelector('#promo-value');
const totalBasketPrice = document.querySelector('#total-price');
const deliveryPrice = document.querySelector('#delivery-price');
const promoCodeValue = currentPromoVal;

const prettify = (num) => {
    const n = num.toString();
    return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, '$1' + '\u00A0');
};

const getCleanNumber = (rawNumber) => {
    const rawString = (typeof rawNumber) === 'string' ? rawNumber.replace(/\s/g, '') : rawNumber.innerText.replace(/\s/g, '');
    return rawString.includes(CURRENCY_SIGN) ? Number(rawString.slice(0, rawString.length - 1)) : Number(rawString);
};

const initialItemCount = {
    getInitialValue: [],
    setInitialValue(value) {
        this.getInitialValue.push(Number(value));
    }
};

const initialBasketTotal = {
    getInitialValue: [],
    setInitialValue(value) {
        this.getInitialValue.push(Number(value));
    }
};

const initialGrossTotal = {
    getInitialValue: [],
    setInitialValue(value) {
        this.getInitialValue.push(Number(value));
    }
};

const initialPromoValue = {
    getInitialValue: [],
    setInitialValue(value) {
        this.getInitialValue.push(Number(value));
    }
};

const totalPriceValue = {
    getValue: null,
    setValue(value) {
        this.getValue = value;
    }
};

purchasesList.forEach((item) => {
    const priceWrapper = item.querySelector('.purchase-item__price-wrapper');
    const counter = Array.from(priceWrapper.children).find((el) => Array.from(el.classList).includes('purchase-item__quantity'));
    const counterValue = counter.querySelector('input').value;
    const commonPrice = Array.from(priceWrapper.children).find((el) => Array.from(el.classList).includes('purchase-item__item-price'));
    const commonOldPrice = commonPrice.dataset.oldPrice;
    const totalPrice = Array.from(priceWrapper.children).find((el) => Array.from(el.classList).includes('purchase-item__total-price'));
    const quantityField = item.querySelector('input[name=item-count]');

    const getItemGrossPrice = (price) => {
        if (price.dataset.oldTotal) {
            return getCleanNumber(price.dataset.oldTotal);
        }
        if (price.dataset.oldPrice) {
            return getCleanNumber(price.dataset.oldPrice);
        } else {
            return getCleanNumber(price.textContent);
        }
    };

    const counterInput = Array.from(Array.from(counter.children).find(item => item.nodeName === 'LABEL').children).shift();

    const getCorrectPrice = () => {
        return totalPrice.innerText = `${prettify(getCleanNumber(commonPrice) * quantityField.value)}\u00A0${CURRENCY_SIGN}`;
    };

    const getPromoValue = (price, multiplier) => {
        if (!price.dataset.oldPrice) {
            return Number(0);
        }
        return getCleanNumber(price.dataset.oldPrice) * multiplier;
    };

    const getItemDiscountPrice = (price, multiplier) => {
        if (!price.dataset.oldPrice) {
            return Number(0);
        }
        return getCleanNumber(price.innerText) * multiplier;
    };

    const getDiscountDifference = (multiplier) => {
        return getPromoValue(commonPrice, multiplier) - getItemDiscountPrice(commonPrice, multiplier);
    };

    const getOldPrice = () => {
        if (!commonOldPrice) {
            return
        }
        return totalPrice.setAttribute('data-old-total', `${prettify(getCleanNumber(commonOldPrice) * quantityField.value)}\u00A0${CURRENCY_SIGN}`);
    };

    const changePromoValue = (currentValue, oldValue) => {
        return getDiscountDifference(currentValue) ? getDiscountView(prettify(getDiscountDifference(currentValue))) : oldValue;
    };

    initialItemCount.setInitialValue(counterInput.value);
    initialBasketTotal.setInitialValue(getCleanNumber(totalPrice));
    initialGrossTotal.setInitialValue(getItemGrossPrice(totalPrice));
    initialPromoValue.setInitialValue(getDiscountDifference(counterValue));

    Array.from(counter.children).forEach((item) => {
        if (Array.from(item.classList).includes('purchase-item__quantity-button--minus')) {
            item.addEventListener('click', () => {
                if (counterInput.value > 1) {
                    counterInput.value--
                    initialItemCount.setInitialValue(counterInput.value);
                    basketQuantity.innerText = Number(basketQuantity.innerText) - 1;
                    basketTotal.innerText = prettify(getCleanNumber(basketTotal.innerText) - getCleanNumber(commonPrice)) + `\u00A0${CURRENCY_SIGN}`;
                    grossValue.innerText = prettify(getCleanNumber(grossValue.innerText) - getItemGrossPrice(commonPrice)) + `\u00A0${CURRENCY_SIGN}`;
                    promoValue.innerText = changePromoValue(counterInput.value, promoValue.innerText);
                    discountValue.innerText = getDiscountView(prettify(Math.abs(getCleanNumber(promoValue.innerText) - getCleanNumber(promoCodeValue.getValue.toString()))));

                    totalPriceValue.setValue(getCleanNumber(grossValue.innerText) + getCleanNumber(discountValue.innerText) + getCleanNumber(deliveryPrice) + getCleanNumber(promoCodeValue.getValue.toString()));
                    totalBasketPrice.innerText = prettify(totalPriceValue.getValue) + `\u00A0${CURRENCY_SIGN}`;

                    getCorrectPrice();
                    getOldPrice();
                }
            })
        } else if (Array.from(item.classList).includes('purchase-item__quantity-button--plus')) {
            item.addEventListener('click', () => {
                counterInput.value++
                initialItemCount.setInitialValue(counterInput.value);
                basketQuantity.innerText = Number(basketQuantity.innerText) + 1;
                basketTotal.innerText = prettify(getCleanNumber(basketTotal.innerText) + getCleanNumber(commonPrice)) + `\u00A0${CURRENCY_SIGN}`;
                grossValue.innerText = prettify(getCleanNumber(grossValue.innerText) + getItemGrossPrice(commonPrice)) + `\u00A0${CURRENCY_SIGN}`;
                promoValue.innerText = changePromoValue(counterInput.value, promoValue.innerText);
                discountValue.innerText = getDiscountView(prettify(Math.abs(getCleanNumber(promoValue.innerText) - getCleanNumber(promoCodeValue.getValue.toString()))));

                totalPriceValue.setValue(getCleanNumber(grossValue.innerText) + getCleanNumber(discountValue.innerText) + getCleanNumber(deliveryPrice) + getCleanNumber(promoCodeValue.getValue.toString()));
                totalBasketPrice.innerText = prettify(totalPriceValue.getValue) + `\u00A0${CURRENCY_SIGN}`;

                getCorrectPrice();
                getOldPrice();
            })
        }
    });
});

basketQuantity.innerText = initialItemCount.getInitialValue.reduce((acc, current) => acc + current, 0);
basketTotal.innerText = prettify(initialBasketTotal.getInitialValue.reduce((acc, current) => acc + current, 0)) + `\u00A0${CURRENCY_SIGN}`;
grossValue.innerText = prettify(initialGrossTotal.getInitialValue.reduce((acc, current) => acc + current, 0)) + `\u00A0${CURRENCY_SIGN}`;
promoValue.innerText = getDiscountView(prettify(initialPromoValue.getInitialValue.reduce((acc, current) => acc + current, 0)));
discountValue.innerText = getDiscountView(prettify(Math.abs(getCleanNumber(promoValue.innerText)) + Math.abs(getCleanNumber(promoCodeValue.getValue.toString()))));
totalPriceValue.setValue(getCleanNumber(grossValue.innerText) + getCleanNumber(discountValue.innerText) + getCleanNumber(deliveryPrice));
totalBasketPrice.innerText = prettify(totalPriceValue.getValue) + `\u00A0${CURRENCY_SIGN}`;

export {
    prettify,
    getCleanNumber
};