const {Router} = require('express');
const path = require("path");

const landing = Router();
const buildpath= path.resolve('../client/build')
console.log(buildpath);
landing.get('/', function(req,res){
    console.log(req.originalUrl);
    if(req.originalUrl === '/'){
        res.sendFile(path.join(buildpath, 'index.html'));
    }else{
        res.sendFile(path.join(buildpath, req.originalUrl));
    }
})


module.exports = {landing}