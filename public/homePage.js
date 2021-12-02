"use strict";

// Выход из личного кабинета

let logoutButton = new LogoutButton();

logoutButton.action = function() {
    ApiConnector.logout(response => {
        if (response.success === true) {
            location.reload();
        }
    })
}


// Получение информации о пользователе

ApiConnector.current(response => {
    if (response.success === true) {
        ProfileWidget.showProfile(response.data);
    }
})


// Получение текущих курсов валюты 

let ratesBoard = new RatesBoard();

function getCurrentStocks() {
    ApiConnector.getStocks(response => {
        if (response.success === true) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
            console.log("Stock renewed")
        }
    })
}

getCurrentStocks();
setInterval(getCurrentStocks, 60000);


// Операции с деньгами 

let moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = function(data) {
    ApiConnector.addMoney(data, response => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, "Счет пополнен")
        } else {
            moneyManager.setMessage(response.success, `Ошибка пополнения: ${response.error}`);
        }
    })
}

moneyManager.conversionMoneyCallback = function(data) {
    ApiConnector.convertMoney(data, response => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, "Конвертирование завершено")
        } else {
            moneyManager.setMessage(response.success, `Ошибка конвертирования: ${response.error}`);
        }
    })
}

moneyManager.sendMoneyCallback = function(data) {
    ApiConnector.transferMoney(data, response => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, "Перевод завершен")
        } else {
            moneyManager.setMessage(response.success, `Ошибка перевода: ${response.error}`);
        }
    })
}


// Работа с избранным

let favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites(response => {
    if (response.success === true) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
})

favoritesWidget.addUserCallback = function(data) {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success === true) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            moneyManager.setMessage(response.success, "Пользователь добавлен")
        } else {
            moneyManager.setMessage(response.success, `Ошибка добавления: ${response.error}`);
        }
    })
}

favoritesWidget.removeUserCallback = function(data) {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success === true) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            moneyManager.setMessage(response.success, "Пользователь удален")
        } else {
            moneyManager.setMessage(response.success, `Ошибка удаления: ${response.error}`);
        }
    })
}
