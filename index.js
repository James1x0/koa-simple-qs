const qs = require('qs');

module.exports = (options = { plainObjects: true }) => {
  return async (next) => {
    if (this.request.method === 'GET') {
      this.request.body = qs.parse(this.request.querystring, options);
    }

    await next;
  };
};
