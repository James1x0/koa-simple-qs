const koa                = require('koa'),
      router             = require('koa-router'),
      chai               = require('chai'),
      expect             = chai.expect;

[ require('chai-http') ].map(plugin => chai.use(plugin));

let handleErrors = function* (next) {
  try {
    yield next;
  } catch (err) {
    this.status = err.status || 500;
    this.body = err.message;
    this.app.emit('error', err, this);
  }
};

describe('koa-simple-qs', () => {
  let testApp;
  const module = require('../');
  afterEach(() => testApp ? testApp.close() : true);

  describe('basic functionality', () => {
    it('should parse simple keys', function*() {
      const app = koa(),
            routes = router();

      routes.get('/test', function* () {
        expect(this.request.body).to.exist;
        expect(this.request.body.a).to.equal('test');
        expect(this.request.body.b).to.equal('true');
        expect(this.request.body.c).to.equal('');
        this.status = 200;
        this.body = {};
      });

      app
      .use(module())
      .use(handleErrors)
      .use(routes.routes())
      .use(routes.allowedMethods());

      testApp = app.listen(4001);

      yield chai.request(testApp)
      .get('/test')
      .query({
        a: 'test',
        b: true,
        c: null
      });
    });

    it('should parse arrays', function*() {
      const app = koa(),
            routes = router();

      routes.get('/test', function* () {
        expect(this.request.body.a[0]).to.equal('a');
        expect(this.request.body.a[1]).to.equal('b');
        this.status = 200;
        this.body = {};
      });

      app
      .use(module())
      .use(handleErrors)
      .use(routes.routes())
      .use(routes.allowedMethods());

      testApp = app.listen(4001);

      yield chai.request(testApp)
      .get('/test')
      .query({
        a: [ 'a', 'b' ]
      });
    });

    it('should parse objects', function*() {
      const app = koa(),
            routes = router();

      routes.get('/test', function* () {
        expect(this.request.body.a.b).to.equal('test');
        expect(this.request.body.a.hey).to.equal('hi');
        this.status = 200;
        this.body = {};
      });

      app
      .use(module())
      .use(handleErrors)
      .use(routes.routes())
      .use(routes.allowedMethods());

      testApp = app.listen(4001);

      yield chai.request(testApp)
      .get('/test')
      .query({
        a: {
          b: 'test',
          hey: 'hi'
        }
      });
    });

    it('should pass options to qs', function*() {
      const app = koa(),
            routes = router();

      routes.get('/test', function* () {
        expect(this.request.body.a.b).to.equal('test');
        expect(this.request.body.a.hey).to.equal(null);
        this.status = 200;
        this.body = {};
      });

      app
      .use(module({
        strictNullHandling: true
      }))
      .use(handleErrors)
      .use(routes.routes())
      .use(routes.allowedMethods());

      testApp = app.listen(4001);

      yield chai.request(testApp)
      .get('/test')
      .query({
        a: {
          b: 'test',
          hey: null
        }
      });
    });
  });

  describe('deep functionality', () => {
    it('should parse deep objects', function*() {
      const app = koa(),
            routes = router();

      routes.get('/test', function* () {
        expect(this.request.body.a.b).to.equal('test');
        expect(this.request.body.a.c.d.e).to.equal('test');
        this.status = 200;
        this.body = {};
      });

      app
      .use(module())
      .use(handleErrors)
      .use(routes.routes())
      .use(routes.allowedMethods());

      testApp = app.listen(4001);

      yield chai.request(testApp)
      .get('/test')
      .query({
        a: {
          b: 'test',
          c: {
            d: {
              e: 'test'
            }
          }
        }
      });
    });
  });
});
