const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Definindo o Schema do funcionário
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
const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

// Conexão com o MongoDB
const connectToDb = async () => {
    if (mongoose.connections[0].readyState) {
        return; // Se já estiver conectado, não faz nada
    }
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conectado ao MongoDB com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        throw new Error('Erro ao conectar ao MongoDB');
    }
};

// Manipulando as requisições da API
module.exports = async (req, res) => {
    // Certificando-se de que a conexão com o banco está feita
    await connectToDb();

    if (req.method === 'GET') {
        // Requisição GET - Listar todos os funcionários
        try {
            const employees = await Employee.find();
            res.status(200).json(employees);
        } catch (error) {
            console.error('Erro ao listar funcionários:', error);
            res.status(500).json({ message: 'Erro ao listar funcionários' });
        }
    } else if (req.method === 'POST') {
        // Requisição POST - Criar um novo funcionário
        try {
            const employee = new Employee(req.body);
            await employee.save();
            res.status(201).json(employee);
        } catch (error) {
            console.error('Erro ao criar funcionário:', error);
            res.status(500).json({ message: 'Erro ao criar funcionário' });
        }
    } else {
        // Se o método HTTP não for GET ou POST
        res.status(405).json({ message: 'Método não permitido' });
    }
};