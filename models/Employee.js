const mongoose = require('mongoose');
// Definindo o schema para o funcionário
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});
// Criando o modelo de funcionário com base no schema
const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;  // Exporta o modelo para ser usado no servidor