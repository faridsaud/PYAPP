// policies/canWrite.js
module.exports = function isLoggedIn (req, res, next) {
  if (!req.session.userLogged) {
    return res.json(401,{
      msg: 'Not logged in'
    });
  }else{
    return next();
  }


};
