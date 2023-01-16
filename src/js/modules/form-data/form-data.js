import {addressObj} from '../map/map';

const getFormData = () => {
    const productItems = document.querySelectorAll('.purchase-item');
    const overallList = document.querySelector('.overall');
    const overallGross = overallList.querySelector('#gross-value').innerText;
    const overallDiscount = overallList.querySelector('#discount-value').innerText;
    const overallPromoCode = overallList.querySelector('#promo-code-value').innerText;
    const storageMethod = overallList.querySelector('#storage-method');
    const overallTotal = overallList.querySelector('#total-price').innerText;

    class userInfo {
        constructor(name, surname, phone, email, address) {
            this.name = name;
            this.surname = surname;
            this.phone = phone;
            this.email = email;
            this.address = address;
        }
    }

    class productItem {
        constructor(title, price, quantity, totalPrice, vendorCode, season, size, color) {
            this.title = title;
            this.price = price;
            this.quantity = quantity;
            this.totalItemPrice = totalPrice;
            this.vendorCode = vendorCode;
            this.season = season;
            this.size = size;
            this.color = color;
        }
    }

    const getUserInfo = () => {
        const userField = document.querySelector('.user-contacts');
        const userName = userField.querySelector('#user-name').value;
        const userSurname = userField.querySelector('#user-surname').value;
        const userPhone = userField.querySelector('#user-phone').value;
        const userEmail = userField.querySelector('#user-email').value;
        const userAddress = addressObj.addressList.shift();

        return new userInfo(userName, userSurname, userPhone, userEmail, userAddress);
    }

    const getProductItemsData = () => {
        return Array.from(productItems).map((item) => {
            const itemTitle = item.querySelector('.purchase-item__title').innerText;
            const itemPrice = item.querySelector('.purchase-item__item-price').innerText;
            const itemQuantity = item.querySelector('.purchase-item__quantity input').value;
            const itemTotal = item.querySelector('.purchase-item__total-price').innerText;
            const itemVendorCode = item.querySelector('.purchase-item__vendor .purchase-item__value').innerText;
            const itemSeason = item.querySelector('.purchase-item__season .purchase-item__value').innerText;
            const itemSize = item.querySelector('.size-list input[type="radio"]:checked').value;
            const itemColor = item.querySelector('.color-list input[type="radio"]:checked').value;
            return new productItem(itemTitle, itemPrice, itemQuantity, itemTotal, itemVendorCode, itemSeason, itemSize, itemColor);
        })
    }

    const formData = () => {
        return {
            userInfo: getUserInfo(),
            goodsTotal: overallGross,
            discountTotal: overallDiscount,
            promoCode: overallPromoCode,
            fromStorage: storageMethod.checked ? 'on' : 'off',
            totalAmount: overallTotal,
            goods: getProductItemsData(),
        }
    };
    const resultData = formData();
    console.log(resultData);
    return resultData;
}

export {getFormData}
