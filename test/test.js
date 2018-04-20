const Koa                = require('koa'),
      router             = require('koa-router'),
      chai               = require('chai'),
      expect             = chai.expect;

[ require('chai-http') ].map(plugin => chai.use(plugin));

let handleErrors = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
};

describe('koa-simple-qs', () => {
  let testApp;
  const module = require('../');
  afterEach(() => testApp ? testApp.close() : true);

  describe('basic functionality', () => {
    it('should parse simple keys', async () => {
      const app = new Koa(),
            routes = router();

      routes.get('/test', async (ctx) => {
        expect(ctx.request.body).to.exist;
        expect(ctx.request.body.a).to.equal('test');
        expect(ctx.request.body.b).to.equal('true');
        expect(ctx.request.body.c).to.equal('');
        ctx.status = 200;
        ctx.body = {};
      });

      app
        .use(module())
        .use(handleErrors)
        .use(routes.routes())
        .use(routes.allowedMethods());

      testApp = app.listen(4001);

      await chai.request(testApp)
        .get('/test')
        .query({
          a: 'test',
          b: true,
          c: null
        });
    });

    it('should parse arrays', async () => {
      const app = new Koa(),
            routes = router();

      routes.get('/test', async (ctx) => {
        expect(ctx.request.body.a[0]).to.equal('a');
        expect(ctx.request.body.a[1]).to.equal('b');
        ctx.status = 200;
        ctx.body = {};
      });

      app
        .use(module())
        .use(handleErrors)
        .use(routes.routes())
        .use(routes.allowedMethods());

      testApp = app.listen(4001);

      await chai.request(testApp)
        .get('/test')
        .query({
          a: [ 'a', 'b' ]
        });
    });

    it('should parse objects', async () => {
      const app = new Koa(),
            routes = router();

      routes.get('/test', async (ctx) => {
        expect(ctx.request.body.a.b).to.equal('test');
        expect(ctx.request.body.a.hey).to.equal('hi');
        ctx.status = 200;
        ctx.body = {};
      });

      app
        .use(module())
        .use(handleErrors)
        .use(routes.routes())
        .use(routes.allowedMethods());

      testApp = app.listen(4001);

      await chai.request(testApp)
        .get('/test')
        .query({
          a: {
            b: 'test',
            hey: 'hi'
          }
        });
    });

    it('should pass options to qs', async () => {
      const app = new Koa(),
            routes = router();

      routes.get('/test', async (ctx) => {
        expect(ctx.request.body.a.b).to.equal('test');
        expect(ctx.request.body.a.hey).to.equal(null);
        ctx.status = 200;
        ctx.body = {};
      });

      app
        .use(module({
          strictNullHandling: true
        }))
        .use(handleErrors)
        .use(routes.routes())
        .use(routes.allowedMethods());

      testApp = app.listen(4001);

      await chai.request(testApp)
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
    it('should parse deep objects', async () => {
      const app = new Koa(),
            routes = router();

      routes.get('/test', async (ctx) => {
        expect(ctx.request.body.a.b).to.equal('test');
        expect(ctx.request.body.a.c.d.e).to.equal('test');
        ctx.status = 200;
        ctx.body = {};
      });

      app
        .use(module())
        .use(handleErrors)
        .use(routes.routes())
        .use(routes.allowedMethods());

      testApp = app.listen(4001);

      await chai.request(testApp)
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
