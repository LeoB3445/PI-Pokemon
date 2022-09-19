const { Router } = require('express');
const {landing} = require('./Landing');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('*', landing);

module.exports = router;
