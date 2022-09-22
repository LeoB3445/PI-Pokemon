const { expect } = require('chai');
const {Pokemon, Type, conn} = require('../../src/db');

describe("Many to Many relation", ()=>{
    var fakePikachu= Pokemon.build({name:'fakePikachu'});
    console.log(fakePikachu);
    var electric = Type.build({name:"electric"})
    console.log(electric);
    before(()=> conn.authenticate()
        .catch(err=>{
            console.error('Unable to connect to the database:', err);
        })
    );
    beforeEach(()=>{
        //nota : estas declaraciones hacen que el test sea destructivo.
        Pokemon.sync({alter:true});
        Type.sync({alter:true});
    });
    describe("pokemon to type association", ()=>{
        it("should create associations between defined model instances", ()=>{
            fakePikachu.addType(electric)
            .then(()=>{
                expect(fakePikachu.hasType(electric)).to.equal(true);
            })
        })
    })
    
})