const {Router} = require('express');
const { Op } = require('sequelize');
const {Pokemon, Type} = require('../db');

const pokemons = Router();

pokemons.get('/',function(req,res){
    var offset = req.query.offset ? req.query.offset: 0;
    var dbQuery, apiQuery;
    
    
    if(req.query.name){
        //Queries database and API for any pokemon with the specified name
        dbQuery = Pokemon.findOne({where:{name:req.query.name}})
        .then((data)=>
            data.getTypes()
            .then(types=>({
                name: data.name,
                img:null,
                types:types.map(elem=>elem.name)
            })
            )
        );
        apiQuery = fetch(`https://pokeapi.co/api/v2/pokemon/${req.query.name}`)
        .then((data)=>data.json())
        .then(poke=> (poke !== 'Not Found'?{
            name: poke.forms[0].name,
            img: poke.sprites.front_default,
            types: poke.types.map((elem=>elem.type))
        }: null))
    }else{
        if(!req.query.limit){
            res.status(422).send(`Invalid value "${req.query.limit}" for mandatory query parameter "limit"`)
        }else{
            dbQuery = Pokemon.findAll()
            .then(data=>
                Promise.all(data.map(poke=> 
                    poke.getTypes()
                    .then(types =>({
                        name: poke.name,
                        img:null,
                        types: types.map( e => e.name)
                    }))
                ))
                
            );
            apiQuery = fetch(`https://pokeapi.co/api/v2/pokemon?limit=${req.querylimit}&offset=${offset}`)
            .then((data=>
                Promise.all(data.map(elem=> 
                    fetch(elem.url)
                    .then(poke=>({
                        name: poke.forms[0].name,
                        img: poke.sprites.front_default,
                        types: poke.types.map((elem=>elem.type))
                    }))
                    ))
                
            ))
        }

    }
    Promise.all([apiQuery,dbQuery])
    .then(([apiQuery, dbQuery]) =>{
        res.send({apiQuery: apiQuery, dbQuery: dbQuery})
    })
}
);

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
            types: data.types.map((elem=>elem.type)),
            hp: data.stats[0].base_stats,
            attack:data.stats[1].base_stats,
            defense: data.stats[2].base_stats,
            speed: data.stats[5].base_stats,
            height: data.height,
            weigth: data.weigth
        }))
    }
})

module.exports= {pokemons};