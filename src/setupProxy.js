const proxy = require("http-proxy-middleware");
module.exports = function(app) {
  // proxies only have effect in development
  // we must ensure that URLs like /api/todos point to the right thing in production
  app.use(proxy("/api/**", { 
    target: "http://localhost:5000",
    secure: false
  }));
};