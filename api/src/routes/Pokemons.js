const {Router} = require('express');
const { Op } = require('sequelize');
const {Pokemon, Type} = require('../db');

const pokemons = Router();

pokemons.get('/',function(req,res){
    
    if(req.query.limit===null||req.query.offset===null){
        res.status(422).send('Missing query parameters "limit" and/or "offset"')
    }else{
        if(req.query.name !== null){
            Pokemon.findOne({where:{name:req.query.name}})
            .then(found=>{
                fetch(`https://pokeapi.co/api/v2/pokemon/${req.query.name}`)
                .then(apiData=> apiData.json())
                .then(()=>res.send({dbData:found, apiData:apiData}))
            })
            .catch(err=>res.status(500).send(err));
        }else{
            Pokemon.findAll()
            .then(found=>{
                fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${req.query.limit}&offset=${req.query.offset}`)
                .then(apiData => apiData.json())
                .then(()=>res.send({dbData:found, apiData:apiData}));
            })
            .catch(err=>res.status(500).send(err));
        }
    }
});

pokemons.post('/', function(req, res){
    var createdMon = Pokemon.create(req.body.pokemon)
    .then(()=>Type.findAll({
        where:{
            name:{
                [Op.or]:req.body.types
            }
        }
    }))
    .then((foundTypes)=>{
        if(foundTypes.length < req.body.types.length){
            res.status(404).send({msg:`Could not find ${req.body.types.length - foundTypes.length} of the specified types`});
        }else{
            return createdMon.setTypes(foundTypes);
        }
    })
    .then(()=> {res.send('Pokemon created successfuly')})
    .catch(err=>res.status(500).send(err));
})

pokemons.get('/:id', function(req,res){
    Pokemon.findByPk(req.params.id)
    .then(found=>{res.send(found)})
    .catch(err=>res.status(500).send(err));
})

module.exports= {pokemons};