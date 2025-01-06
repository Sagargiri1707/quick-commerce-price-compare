const { createProxyMiddleware } = require("http-proxy-middleware");
const proxy = createProxyMiddleware({
  target: "https://blinkit.com",
  changeOrigin: true,
  pathRewrite: { "^/api/blinkit": "/v1" },
});

module.exports = (req, res) => {
  proxy(req, res, (err) => {
    if (err) {
      res.status(500).send("Proxy error: " + err.message);
    }
  });
};
