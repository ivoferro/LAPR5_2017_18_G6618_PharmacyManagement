// medicinesAuthentication.js
const request = require('request');

exports.authenticateMedicinesManagement = (req, res, next) => {

    var options = {
        method: 'POST',
        url: 'https://lapr5-3da.eu.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json' },
        body: 
        {
            grant_type: 'client_credentials',
            client_id: req.headers.client_id,
            client_secret: req.headers.client_secret,
            audience:"https://medicines-backend-api/"
        },
        json:true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        req.medicinesToken = body;
        next();
    });
    
};