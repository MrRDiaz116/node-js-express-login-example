const { authJwt } = require("../middleware");
const controller = require("../controllers/vitals.controller copy");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });

  app.post(
    "/api/test/vitals/",
    //[authJwt.verifyToken],
    controller.createVitalsNormal
  );
  
};
