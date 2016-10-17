# koa-simple-qs
A simple alias of [qs](https://github.com/ljharb/qs) for koa.

### Why not koa-qs?
1. Middleware usage
2. Not all apps are alike. Configure it with your own options.

### Usage

```javascript
let app = require('koa')();
app.use(require('koa-simple-qs')());

app.get('/test', function*() {
  console.log(this.request.body);
});

...

/*
  /test?q=test => { q: 'test' }
 */
```

#### With options
```javascript
let app = require('koa')();
app.use(require('koa-simple-qs')({
  strictNullHandling: true
}));

app.get('/test', function*() {
  console.log(this.request.body);
});

...

/*
  /test?q=test&a => { q: 'test', a: null }
 */
```

---

PRs welcome
