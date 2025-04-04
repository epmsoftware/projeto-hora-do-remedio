const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Configuração do middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve arquivos estáticos da pasta public

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Substitua pelo seu usuário do MySQL
    password: '', // Substitua pela sua senha do MySQL
    database: 'horaDoRemedio' // Substitua pelo seu banco de dados
});

// Conectar ao banco de dados
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Rota para cadastrar medicamentos
app.post('/api/cadastrar', (req, res) => {
    const { nome, validade, quantidade, horario1, horario2, descricao } = req.body;

    const sql = 'INSERT INTO cadastromedicamentos (nome, validade, quantidade, horario1, horario2, descricao) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [nome, validade, quantidade, horario1, horario2, descricao], (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar medicamento:', err);
            return res.status(500).json({ message: 'Erro ao cadastrar medicamento' });
        }
        res.status(200).json({ message: 'Medicamento cadastrado com sucesso!' });
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});