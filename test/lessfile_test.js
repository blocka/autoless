var LessFile = require('../lib/lessfile')
  , fs = require('fs');

describe("LessFile", function() {
  var lessFile;

  describe("#parse", function() {
    describe("when loading correct file", function() {
      beforeEach(function() {
        lessFile = new LessFile('test/less/main.less');
      });

      it("doesn't return an error", function(done) {
        lessFile.parse(done);
      });

      it("populates the imports property", function(done) {
        lessFile.parse(function(err) {
          lessFile.imports.should.include('test/less/common.less');
          done();
        });
      });
    });

    describe("when loading incorrect file", function() {
      beforeEach(function() {
        lessFile = new LessFile('test/less/error.less');
      });

      it("returns an error", function(done) {
        lessFile.parse(function(err) {
          should.exist(err);
          err.message.should.match(/^Syntax Error/);
          done();
        });
      });
    });
  });

  describe("#compile", function() {
    beforeEach(function() {
      lessFile = new LessFile('test/less/main.less', 'test/less/main.css');
    });

    afterEach(function() {
      fs.unlink('test/less/main.css');
    });

    it("doesn't return an error", function(done) {
      lessFile.compile(done);
    });

    it("saves css file", function(done) {
      lessFile.compile(function(err) {
        fs.existsSync('test/less/main.css').should.be.true;
        fs.readFileSync('test/less/main.css', 'utf-8').should.include('text-decoration');
      });
      done();
    });
  });
});