const {Router} = require('express');
const {Types, conn} = require('../db')

const types = Router();

types.get('/', function(req,res){
    Types.count()
    .then((count)=>{
        if (count<20){
            fetch('https://pokeapi.co/api/v2/type')
            .then(data=> data.json())
            .then(data=>Promise.all(
                data.results.map((elem=> Types.create({name:elem.name})))
                ))
            .then((created=> res.send(created)))
            .catch(err=> res.status(500).send(err));
        }else{
            Types.findAll()
            .then(found=> res.send(found))
            .catch(err=> res.status(500).send(err));
        }
    })

})