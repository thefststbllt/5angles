const contactFields = document.querySelectorAll('.user-contacts__input');

contactFields.forEach((field) => {
    if (field.value.length) {
        field.classList.add('user-contacts__input--filled');
    }
    field.addEventListener('focus', () => {
        field.classList.add('user-contacts__input--filled');
    })

    field.addEventListener('blur', () => {
        if (!field.value.length) {
            field.classList.remove('user-contacts__input--filled');
        }
    })
});
