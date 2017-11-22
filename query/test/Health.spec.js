
var config = require('./Lib/Config');
var chai = config.chai;
var expect = chai.expect;
var app = config.app;
var assert = requre('assert');




describe('check health status', function () {
    var result;
    before(function (done) {
        chai.request(app)
            .get('/api/v2/health')
            .set('token', 'token_values')
            .then(function (res) {
                result = res;
                done();
            });
    });

    describe('inner describe', function () {
        it('inner it', function () {
            expect(true).to.be.equal(true);
        })
    });


    it('should return 200', function (done) {
        expect(result).to.have.status(200);
       
        done();
    });

    it('should be an object', function (done) {       
        expect(result.body).to.be.an('object');
        expect(2).to.be.an('number');
        done();
    });
});