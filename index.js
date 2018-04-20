const qs = require('qs');

module.exports = (options = { plainObjects: true }) => {
  return async (ctx, next) => {
    if (ctx.request.method === 'GET') {
      ctx.request.body = qs.parse(ctx.request.querystring, options);
    }

    await next();
  };
};
