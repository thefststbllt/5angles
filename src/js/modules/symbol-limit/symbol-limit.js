const symbolCounter = document.querySelector('#symbol-counter');
const userComment = document.querySelector('#user-comment');

document.addEventListener('input', (evt) => {
    if (evt.target !== userComment) {
        return
    }

    symbolCounter.innerText = `Использовано ${evt.target.value.length}/142 символов`
})
