
var  url = require('url');

/** filter **/
var filter = function(req, query) {
  
  var qs = url.parse(req.url, true).query;
  var limit = 10;
  var page = 0;
  if(qs['sort'] && qs['by']) {
    query.sort(qs['by'], qs['sort']);  
  }
  if (qs['limit']) {
    limit = qs['limit'];
  }
  if(qs['page']) {
    page = qs['page'];
  }
  
  query.limit(limit);
  query.skip(qs['page'] * limit);
  
  var fpager = pager(req, page, limit, query);
  
  return {
      query   : query
    , limit   : limit
    , page    : page
    , pager   : fpager
  };
}
exports.filter = filter;

/** pager **/
var pager = function(req, p, l, q) {

  var path = url.parse(req.url, true).pathname
  var list = {};
  
  //previous link
  p = p - 1;
  if (p >= 0) {
    list.previous = { text: 'previous', link: path + '?page=' + p };
  }
  
  //next link
  p = p + 2;
  list.next = { text: 'next', link: path + '?page=' + p };
  
  return list;

}
exports.pager = pager;
