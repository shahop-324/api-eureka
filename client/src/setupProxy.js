const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    "/eureka/v1/auth/google",
    createProxyMiddleware({
      target: "http://www.bez-app.com:3000",
    })
  );
};
// module.exports = function (app) {
//   app.use(
//    [ "/event-landing-page/:id"],
//     createProxyMiddleware({
//       target: "http://localhost:3001",
//     })
//   );
// };


