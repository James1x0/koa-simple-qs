const qs = require('qs');

module.exports = ( options = { plainObjects: true } ) => {
  return async (next) {
    if ( this.request.method === 'GET' ) {
      Object.assign(this.request, {
      	get query() { return qs.parse(this.request.querystring, options) }
      	set query(obj) { this.request.querystring = qs.stringify(obj) }
      }
    }

    await next;
  };
};
