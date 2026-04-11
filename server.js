import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Mock database de usuários
const users = {
  'charonejr@gmail.com': { password: 'admin123', name: 'Admin' }
};

// Mock database de pacientes
const patients = [
  { id: 1, name: 'Paciente 1', email: 'paciente1@email.com', status: 'ativo' },
  { id: 2, name: 'Paciente 2', email: 'paciente2@email.com', status: 'pausado' }
];

// Rotas de autenticação
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }
  
  const user = users[email];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }
  
  // Simular token JWT
  const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
  
  res.json({
    success: true,
    token,
    user: { email, name: user.name }
  });
});

app.post('/api/logout', (req, res) => {
  res.json({ success: true, message: 'Logout realizado' });
});

// Rotas de pacientes (protegidas)
app.get('/api/patients', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  
  res.json({ success: true, patients });
});

app.post('/api/patients', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  
  const { name, email, status } = req.body;
  const newPatient = {
    id: patients.length + 1,
    name,
    email,
    status: status || 'ativo'
  };
  
  patients.push(newPatient);
  res.json({ success: true, patient: newPatient });
});

// Servir index.html para todas as rotas (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 PWA rodando em http://localhost:${PORT}`);
});
