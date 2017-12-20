// controllers/salesController.js

var nodeRestClient = require('node-rest-client');
var config = require('../config');
var Sale = require('../models/Sale');
var Prescription = require('../models/Prescription').model;
var update = require('../services/UpdateStockService');
var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;

// GET /api/sale/
exports.get_sales = function (req, res) {
    Sale.find({
        _type: "Sale"
    }, function (err, sales) {
        if (err)
            return res.status(500).send(err);
        if (sales != undefined) {
            return res.status(200).json(sales);
        } else {
            return res.status(400).send("There aren´t registered sales.");
        }
    });
}

// GET /api/sale/{id}/
exports.get_sale = function (req, res) {
    Sale.findById(req.params.id, function (err, sale) {
        if (err) return res.status(500).send(err);
        if (!sale) return res.status(404).send("There isn´t a sale with the given ID.");
        return res.status(200).send(sale);
    })
}

// GET /api/sale/receipt/{id}
exports.get_receipt = function (req, res) {
    Sale.find({
        '_type': "Sale",
        'prescription.receiptId': req.params.id
    }, function (err, sales) {
        if (err)
            return res.status(500).send(err);
        if (sales != undefined) {
            return res.status(200).json(sales);
        } else {
            return res.status(400).send("There aren´t registered sales.");
        }
    });
}

// GET /api/sale/receipt/{id}/prescription/{idPresc}
exports.get_prescriptions = function (req, res) {
    Sale.find({
        '_type': "Sale",
        'prescription.receiptId': req.params.id,
        'prescription.prescriptionId': req.params.idPresc
    }, function (err, sales) {
        if (err)
            return res.status(500).send(err);
        if (sales != undefined) {
            return res.status(200).json(sales);
        } else {
            return res.status(400).send("There aren´t registered sales.");
        }
    });
}

// GET /api/sale/medicine/{name}
exports.get_sale_medicine_name = function (req, res) {
    Sale.find({
        '_type': "Sale",
        'prescription.medicinePresentation.medicine': req.params.name,
    }, function (err, sale) {
        if (err) return res.status(500).send(err);
        if (!sale) return res.status(404).send("There isn´t a sale of a medicine with the given name.");
        return res.status(200).send(sale);
    })
}

// GET /api/sale/drug/{name}
exports.get_sale_drug_name = function (req, res) {
    Sale.find({
        '_type': "Sale",
        'prescription.medicinePresentation.drug': req.params.name,
    }, function (err, sale) {
        if (err) return res.status(500).send(err);
        if (!sale) return res.status(404).send("There isn´t a sale of a drug with the given name.");
        return res.status(200).send(sale);
    })
}

// POST /api/sale
exports.post_sale = function (req, res) {

    var presc = new Prescription({
        prescriptionId: req.body.prescription.prescriptionId,
        receiptId: req.body.prescription.receiptId,
        medicinePresentation: req.body.prescription.medicinePresentation,
    });

    var sale = new Sale({
        id_pharmacy: req.body.id_pharmacy,
        quantity: req.body.quantity,
        prescription: presc,
    });

    Promise.join(
        update.updateStock(
            sale.id_pharmacy,
            sale.prescription.medicinePresentation,
            sale.quantity,
            config.sub),
        function (check) {

            sale.save(function (err) {
                if (err) return res.status(500).send(err);
                return res.status(201).json({ message: 'Sale Created', sale });
            })
        });
}
