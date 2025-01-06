const { createProxyMiddleware } = require("http-proxy-middleware");

const proxy = createProxyMiddleware({
  target: "https://api.zeptonow.com/api",
  changeOrigin: true,
  pathRewrite: { "^/api/zepto": "" },
});

module.exports = (req, res) => {
  proxy(req, res, (err) => {
    if (err) {
      res.status(500).send("Proxy error: " + err.message);
    }
  });
};
