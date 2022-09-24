const { Router } = require('express');
const {landing} = require('./Landing');
const {pokemons} = require('./Pokemon');
const {types} = require('.Types/');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('*', landing);
router.use('/pokemons', pokemons);
router.use('/types', types);

module.exports = router;
