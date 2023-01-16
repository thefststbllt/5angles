const orderPage = document.querySelector('.page');
const successMessage = document.querySelector('#order-success-message');

const getSuccessMessage = () => {
    orderPage.append(successMessage.content.cloneNode(true));

    const message = document.querySelector('.success-message');
    message.addEventListener('click', () => {
        message.remove();
    });
};

export {getSuccessMessage};
