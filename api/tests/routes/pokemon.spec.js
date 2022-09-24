/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Pokemon, conn } = require('../../src/db.js');

const agent = session(app);
const pokemon = {
  name: 'Pikachu',
};

describe('Pokemon routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  beforeEach(() => Pokemon.sync({ force: true })
    .then(() => Pokemon.create(pokemon)));
  describe('GET /pokemons?limit=1', () => {
    it('should get 200', () =>
      agent.get('/pokemons?limit=1').expect(200)
    );
    it('should get an array with 1 element', ()=>{
      agent.get('/pokemons?limit=1')
      .expect(200)
      .then((response)=>{
        expect(Array.isArray(response.body.results)).to.equal(true);
        expect(response.body.results.length).to.equal(1);
        expect(response.body.results[0].name).to.equal('bulbasaur');
      })
    })
  });
});
