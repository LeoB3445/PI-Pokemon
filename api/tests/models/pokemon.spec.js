const { Pokemon, conn } = require('../../src/db.js');
const { expect } = require('chai');

describe('Pokemon model', () => {
  const dummy = {
    name: "testmon",
    hp:1,
    attack:1,
    speed:1,
    defense:1,
    weight:1,
    height:1
  }
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', () => {
    it("should work correctly when all parameters are valid",()=>{
      Pokemon.create(dummy);
    })
    beforeEach(() => Pokemon.sync({ force: true }));
    describe('name', () => {
      it('should throw an error if name is null', (done) => {
        Pokemon.create({...dummy, name:null})
          .then(() => done(new Error('It requires a valid name')))
          .catch(() => done());
      });
      it('should not accept a repeated name', (done) => {
        Pokemon.create({dummy})
        .then(()=> Pokemon.create(dummy))
        .then(()=> done(new Error("should not have accepted repeated name")))
        .catch(()=>done())
      });
    });
  });
});
