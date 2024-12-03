// /api/employees.js (Backend)
const mongoose = require('mongoose');
const Employee = require('../api/employees');
const dotenv = require('dotenv');
dotenv.config();

// Conexão com o MongoDB
(async () => {
    if (!global.mongoose) {
        try {
            global.mongoose = await mongoose.connect(process.env.MONGO_URI);
            console.log('Conectado ao MongoDB com sucesso!');
        } catch (error) {
            console.error('Erro ao conectar ao MongoDB:', error);
        }
    }
})();

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
