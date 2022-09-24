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
            .then()
            .then(found=>{
                found.getTypes()
                .then(types=>{
                    fetch(`https://pokeapi.co/api/v2/pokemon/${req.query.name}`)
                    .then(apiData=> apiData.json())
                    .then((apiData)=>res.send({
                        dbData:{
                            name:found.name,
                            id: found.id,
                            types:types
                        }, 
                        apiData:{
                            name: apiData.forms[0].name,
                            img: apiData.sprites.front_default,
                            types: apiData.types.map((elem=>elem.type))
                        }
                    }))
                })
                
            })
            .catch(err=>res.status(500).send(err));
        }else{
            Pokemon.findAll()
            .then(found=>{
                fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${req.query.limit}&offset=${offset}`)
                .then(apiData => apiData.json())
                .then(apiData=> Promise.all(apiData.results.map(( //results of individual detail fetches are put in promise array
                    //fetches individual pokemon details from links provided by API
                    elem => fetch(elem.url).then(pokemon=>({
                        name:pokemon.forms[0].name,
                        img:pokemon.sprites.front_default, 
                        types:pokemon.types.map(elem=>elem.type)
                    }) 
                    )
                    )))
                )
                .then((resultsArray)=>res.send({
                    dbData:{
                        name:found.name,
                        id: found.id,
                        types:types
                    }, 
                    apiData:resultsArray}));
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