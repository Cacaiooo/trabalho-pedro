// /api/employees.js (Backend)
const mongoose = require('mongoose');
const Employee = require('../models/employee');
const dotenv = require('dotenv');
dotenv.config();

// Conexão com o MongoDB
if (!global.mongoose) {
    global.mongoose = mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const employees = await Employee.find();
            res.status(200).json(employees);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao listar funcionários' });
        }
    } else if (req.method === 'POST') {
        try {
            const employee = new Employee(req.body);
            await employee.save();
            res.status(201).json(employee);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar funcionário' });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
};
