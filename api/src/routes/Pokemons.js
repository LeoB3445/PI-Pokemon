const {Router} = require('express');
const { Op } = require('sequelize');
const {Pokemon, Type} = require('../db');

const pokemons = Router();

pokemons.get('/',function(req,res){
    let offset = req.query.offset ? req.query.offset: 0;
    
    if(!req.query.limit){
        res.status(422).send(`Invalid value "${req.query.limit}" for mandatory query parameter "limit"`)
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
                fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${req.query.limit}&offset=${offset}`)
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
            res.status(404).send(`Could not find ${req.body.types.length - foundTypes.length} of the specified types`);
        }else{
            return createdMon.setTypes(foundTypes);
        }
    })
    .then(()=> {res.send('Pokemon created successfuly')})
    .catch(err=>res.status(500).send(err));
})

pokemons.get('/:id', function(req,res){
    let idNum = parseInt(req.params.id)
    if(idNum <0){
        Pokemon.findByPk(req.params.id*(-1))
        .then(found=>{res.send(found)})
        .catch(err=>res.status(500).send(err));
    }else{
        fetch(`https://pokeapi.co/api/v2/pokemon/${idNum}`)
        .then(data=>{data.json()})
        .then((data)=> res.send({
            name: data.forms[0].name,
            img: data.sprites.front_default,
            types: data.types.map((elem=>elem.type))
        }))
    }
})

module.exports= {pokemons};