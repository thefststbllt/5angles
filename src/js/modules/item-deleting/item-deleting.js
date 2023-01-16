const purchasesList = document.querySelectorAll('.purchase-item');
const userPurchases = document.querySelector('.user-purchases');
const emptyBasketMessage = document.querySelector('#empty-basket-message');
const deleteItemMessage = document.querySelector('#item-delete-message');
const basketForm = document.querySelector('.basket');
const basketTitle = basketForm.querySelector('.basket__info-title');
const mainBasketInfo = basketForm.querySelector('#main-basket-info');

const removeSpareElements = () => {
    Array.from(basketForm.children).forEach((child) => {
        if (child !== mainBasketInfo) {
            child.remove();
        }
    });
};

purchasesList.forEach((item) => {
    const deleteButton = Array.from(item.children).find((item) => Array.from(item.classList).includes('purchase-item__item-delete'));
    const itemTitle = item.querySelector('.purchase-item__title');

    item.addEventListener('click', (evt) => {
        if (evt.target === deleteButton) {
            Array.from(item.children).forEach((element) => {
                element.classList.add('visually-hidden');
            });

            item.append(deleteItemMessage.content.cloneNode(true));

            const deleteMessage = item.querySelector('.delete-message');
            const recoveryButton = deleteMessage.querySelector('.delete-message__recovery-button');
            const deleteButton = deleteMessage.querySelector('.delete-message__delete-button');
            deleteMessage.querySelector('.delete-message__item-name').textContent = itemTitle.textContent;

            deleteMessage.addEventListener('click', (evt) => {
                if (evt.target === recoveryButton) {
                    Array.from(item.children).forEach((element) => {
                        element.classList.remove('visually-hidden');
                        deleteMessage.remove();
                    });
                }
                if (evt.target === deleteButton) {
                    item.remove();
                }
                if (!userPurchases.children.length) {
                    userPurchases.append(emptyBasketMessage.content.cloneNode(true));
                    removeSpareElements();
                    basketTitle.remove();
                }
            })
        }
    })
})