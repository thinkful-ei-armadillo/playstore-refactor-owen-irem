const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');

describe('playstore app', () => {
  it('should return an array that is not empty', () => {
    return request(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.not.be.empty;
        const psApp = res.body[0];
        expect(psApp).to.include.all.keys([
          'App',
          'Category',
          'Rating',
          'Reviews',
          'Size',
          'Installs'
        ]);
      });
  });

  it('should return status 400 if sort is neither app nor rating', () => {
    return request(app)
      .get('/apps')
      .query({ sort: 'numberOfCastMembers' })
      .expect(400, 'Sort must be one of title or rank');
  });

  it('should accurately sort by app title', () => {
    return (
      request(app)
        .get('/apps')
        .query({ sort: 'app' })
      // .expect(res).to.have.status(200)
      // .expect(res).to.have.header('Content-Type')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.be.an('array');
          let i = 0;
          let sorted = true;
          while (sorted && i < res.body.length - 1) {
            sorted = sorted && res.body[i].App < res.body[i + 1].App;
            i++;
          }
          expect(sorted).to.be.true;
        })
    );
  });
});
