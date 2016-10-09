const crypto = require('crypto');
const hmac = crypto.createHmac('sha256', 'a secret');
var bcrypt=require('bcrypt-nodejs');
hmac.update('some data to hash');
console.log(hmac.digest('hex'));
console.log(crypto.getCiphers())
console.log(crypto.getHashes())

var hash = bcrypt.hashSync("bacon", bcrypt.genSaltSync());
console.log(hash);
console.log(bcrypt.compareSync("bacon", hash));
