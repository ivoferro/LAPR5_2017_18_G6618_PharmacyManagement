// helpers/receiptsRequests.js

var config = require('../config');
var Client = require('node-rest-client').Client;
var client = new Client();
var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;

//prescriptions from ReceiptsMedicine backend
exports.getReceipt = function (receiptId, header) {
    if (receiptId == null) return;

    return new Promise((resolve, reject) => {

        var url = config.receipts_backend.urlReceipt + receiptId;

        var test = header;

        var args = {
            headers: {
                "Authorization": header.Authorization,
                'content-type': 'application/json',
                'client_id': header.client_id,
                'client_secret': header.client_secret
            },
            json: true
        };


        client.get(url, args, (data, response) => {
            resolve(data);
        });
    })
}

//prescriptions from ReceiptsMedicine backend
exports.fillReceipt = function (receiptId, prescriptionId, header) {
    if (receiptId == null || receiptId == null) return;

    return new Promise((resolve, reject) => {

        var url = config.receipts_backend.urlReceipt + receiptId + '/Prescriptions/' + prescriptionId + '/fills';

        var args = {
            headers: {
                "Authorization": header.Authorization,
                'content-type': 'application/json',
                'client_id': header.client_id,
                'client_secret': header.client_secret
            },
            json: true
        };


        client.post(url, args, (data, response) => {
            resolve(data);
        });
    })
}

//login from ReceiptsMedicine backend
exports.login = function (username, password) {
    console.log("Username", username);
    console.log("Password", password);

    if (username == null || password == null) return;

    return new Promise((resolve, reject) => {
        var url = config.receipts_backend.url + '/authenticate';

        var args = {
            data: {
                "username": username,
                "password": password
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
        client.post(url, args, (data, response) => {
            resolve(data);
        });
    })
}