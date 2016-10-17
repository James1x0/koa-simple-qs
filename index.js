const qs = require('qs');

module.exports = ( options = { plainObjects: true } ) => {
  return function*(next) {
    this.request.body = qs.parse(this.request.querystring, options);
    yield next;
  };
};
