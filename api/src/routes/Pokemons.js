const {Router} = require('express');
const {Pokemon, Type} = require('../db');

const pokemons = Router();

pokemons.get('/',function(req,res){
    if(req.query.name !== null){
        Pokemon.findOne({where:{name:req.query.name}})
        .then(found=>{
            res.send(found);
        })
        .catch(err=>res.status(500).send(err));
    }else{
        Pokemon.findAll()
        .then(found=>{res.send(found)})
        .catch(err=>res.status(500).send(err));
    }
});

pokemons.get('/:id', function(req,res){
    Pokemon.findByPk(req.params.id)
    .then(found=>{res.send(found)})
    .catch(err=>res.status(500).send(err));
})

module.exports= {pokemons};