let addressObj = {

    addressList: [],
    setAddressList(value) {
        return this.addressList = value;
    },

    address: '',
    setAddress(value) {
        return this.address = value;
    },

    coordinates: {
        lat: '',
        lng: '',
    },

    setCoordinates(updatedLat, updatedLng) {
        return this.coordinates = {
            lat: updatedLat,
            lng: updatedLng
        }
    }
};

const loadMap = () => {
    const URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
    const TOKEN = "7a4e0655ec429d2bfda51e42bcef3c513bd498b4";
    const DEFAULT_COORDINATES = {
        lat: 60.031841,
        lng: 30.429083
    };

    const suggestedList = document.createElement('ul');
    const suggestedListItem = document.createElement('li');
    const addressField = document.querySelector('#delivery-address');

    let myMap;

    const initializeMap = (data, isOld, coordinates) => {
        ymaps.ready(function () {
            if (isOld) {
                myMap.destroy();
            }

            const {lat, lng} = coordinates;
            myMap = new ymaps.Map("map", {
                center: [lat, lng],
                zoom: 15,
                controls: []
            });
            let myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
                hintContent: 'Место доставки',
                balloonContent: `Адрес доставки: ${data.address ?? ''}`
            }, {
                iconLayout: 'default#image',
                iconImageHref: 'assets/icon-map-pin.svg',
                iconImageSize: [30, 42],
                iconImageOffset: [-5, -38]
            });

            myMap.geoObjects.add(myPlacemark);
        });
    };

    const updateMap = {
        initMap(data, isOld, coordinates) {
            initializeMap(data, isOld, coordinates);
        },

        resetMap(updatedData, coordinates) {
            this.initMap(updatedData, true, coordinates);
        }
    };

    addressField.addEventListener('focus', (evt) => {
        if (evt.target !== addressField) {
            return
        }
        suggestedList.className = 'user-contacts__delivery-suggestion';

        addressField.addEventListener('input', () => {
            addressField.parentNode.append(suggestedList);
            suggestedList.append(suggestedListItem);
            addressObj.setAddress(suggestedListItem.innerText);
        })
    });

    addressField.addEventListener('blur', () => {
        fillRightAddress();
        if (!addressField.value.length) {
            suggestedList.remove();
        }
    });

    const fillRightAddress = () => {
        suggestedList.addEventListener('click', (evt) => {
            addressField.value = evt.target.innerText;
            addressObj.setAddress(addressField.value);

            const correctData = getCorrectSuggestion(addressObj.addressList).data;
            addressObj.setCoordinates(correctData.geo_lat, correctData.geo_lon);
            updateMap.resetMap(addressObj, addressObj.coordinates);
            suggestedList.remove();
        })
    }
    const getSuggestions = (rawData) => JSON.parse(rawData).suggestions;
    const getAddresses = (rawData) => getSuggestions(rawData).map((item) => item.unrestricted_value);
    const getCorrectSuggestion = (rawData) => rawData.find((item) => item.unrestricted_value === addressObj.address);

    const createSuggestedList = (data) => {
        if (!data) {
            return;
        }
        const parsedData = getAddresses(data);
        addressObj.setAddressList(getSuggestions(data));
        suggestedListItem.innerText = parsedData.shift() ?? 'Не найдено';
    }

    const getFormData = (evt) => {
        let query = evt.target.value;
        if (!query) {
            return
        }

        const options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + TOKEN
            },
            body: JSON.stringify({query: query})
        }

        return fetch(URL, options)
            .then(response => response.text())
            .then(result => createSuggestedList(result))
            .catch(error => console.log("error", error))
    }

    addressField.addEventListener('input', (evt) => getFormData(evt));
    updateMap.initMap(addressObj.address, false, DEFAULT_COORDINATES);
};

loadMap();

export {addressObj}
