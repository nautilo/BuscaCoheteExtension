const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Usuario y contraseña de ejemplo
const usuarios = [
  { username: 'BuscaCohete', password: 'admin123' }
];

// Ruta de inicio de sesión
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Busca el usuario en el arreglo de usuarios
  const usuario = usuarios.find(user => user.username === username && user.password === password);

  if (usuario) {
    res.json({ success: true, message: '¡Inicio de sesión exitoso!' });
  } else {
    res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});