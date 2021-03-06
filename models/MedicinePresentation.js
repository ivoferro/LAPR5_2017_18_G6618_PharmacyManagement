// models/Presentation.js

var mongoose = require("mongoose");

var MedicinePresentationSchema = mongoose.Schema({  
    drug: { 
        type: String,
        required: true
    },    
    medicine: { 
        type: String,
        required: true
    },
    form: { 
        type: String,
        required: true
    },
    concentration: { 
        type: String,
        required: true
    },
    packageQtt: { 
        type: String,
        required: true
    },
    // saves id from MedicinesAPI
    id_medicine: {
        type: String, 
        required: true
    },
    id_presentation: {
        type: String, 
        required: true
    }
});

module.exports.schema = MedicinePresentationSchema;
module.exports.model = mongoose.model('MedicinePresentation', MedicinePresentationSchema);