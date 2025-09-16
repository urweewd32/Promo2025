require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const methodOverride = require('method-override');
const adminRoutes = require('./routes/adminRoutes');
const loginRoutes = require('./routes/loginRoutes');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

const FileStore = require('session-file-store')(session);
app.use(session({
  secret: process.env.SESSION_SECRET || 'cobra-secret',
  resave: false,
  saveUninitialized: false,
  store: new FileStore({}),
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Archivos estáticos
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/login', loginRoutes);
app.use('/admin', adminRoutes);

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.get('/', (req, res) => {
  res.render('index');
});

// Ruta para productos
app.get('/productos', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'productos.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer productos:', err);
      return res.status(500).json({ error: 'Error al obtener productos' });
    }
    res.json(JSON.parse(data));
  });
});

// Ruta para programas
app.get('/programas', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'programas.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer programas:', err);
      return res.status(500).json({ error: 'Error al obtener programas' });
    }
    res.json(JSON.parse(data));
  });
});

// Ruta para comunidad
app.get('/comunidad', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'comunidad.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer comunidad:', err);
      return res.status(500).json({ error: 'Error al obtener comunidad' });
    }
    res.json(JSON.parse(data));
  });
});

// Ruta para promociones
app.get('/promociones', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'promociones.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer promociones:', err);
      return res.status(500).json({ error: 'Error al obtener promociones' });
    }
    res.json(JSON.parse(data));
  });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor corriendo');
});

