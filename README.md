# koa-simple-qs
A simple alias of [qs](https://github.com/ljharb/qs) for koa.

**Use 1.x versions for koa 2.x-3.x support**

### Why not koa-qs?
1. Middleware usage
2. Not all apps are alike. Configure it with your own options.

### Usage

```javascript
let app = new Koa();
app.use(require('koa-simple-qs')());

app.get('/test', async (ctx) => {
  console.log(ctx.request.body);
});

...

/*
  /test?q=test => { q: 'test' }
 */
```

#### With options
```javascript
let app = new Koa();
app.use(require('koa-simple-qs')({
  strictNullHandling: true
}));

app.get('/test', async (ctx) => {
  console.log(ctx.request.body);
});

...

/*
  /test?q=test&a => { q: 'test', a: null }
 */
```

---

PRs welcome
