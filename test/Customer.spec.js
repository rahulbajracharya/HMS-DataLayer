
var config = require('./Lib/Config');
var chai = config.chai;
var expect = chai.expect;
var app = config.app;


describe('check server', function () {
    it('sever ok', function () {
        expect('object').to.be.equal(typeof (app));
    });
});

describe('check customer', function () {
    var result;
    before(function (done) {
        this.timeout(0);
        chai.request(app)
            .get('/api/v2/customer')
            .set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidXNlcm5hbWUiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTA3ODg2NjAxLCJleHAiOjE1MDc4ODgwNDF9.6Xtoxff8w8AAz9Tlbd1dUyLjUXM9_JZRJauxHo_-9mY')
            .then(function (res) {
                result = res;
                done();
            });
    });


    it('should return 200', function () {
        expect(result).be.have.status(200);
    });
    it('body should be object', function () {
        expect(result.body).to.be.an('object');
    });
    it('data shoud be in array', function () {
        expect(result.body.data).to.be.an('array');
    });
    
});
//test