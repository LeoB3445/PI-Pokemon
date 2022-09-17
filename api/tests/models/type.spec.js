const { Type, conn } = require('../../src/db.js');
const { expect } = require('chai');

describe("Type model", ()=>{
    before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
    describe("Validators", ()=>{
      beforeEach(() => Type.sync({force:true}));
      describe("id", ()=>{
        it("should auto increment", ()=>{
          let idArray = [];
          Type.create({name:"firstelem"})
          .then((res)=>{
            idArray.push(res.id);
            return Type.create({name:"secondelem"});
          })
          .then((res)=>{
            idArray.push(res.id);
          })
          .then(()=>expect(idArray).to.equal([1,2]))
        })
      })
    })
})
