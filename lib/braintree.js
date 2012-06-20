var braintree = require('braintree_node/lib/braintree');

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: '4yfpm3ndby9rh6y7',
  publicKey: 'xztbktpdrwfpz8db',
  privateKey: 'pgz562g6cgc7k4x5'
});
exports.gateway = gateway;
