const { createProxyMiddleware } = require("http-proxy-middleware");

const proxy = createProxyMiddleware({
  target: "https://www.swiggy.com/api/instamart",
  changeOrigin: true,
  pathRewrite: { "^/api/instamart": "" },
});

module.exports = (req, res) => {
  proxy(req, res, (err) => {
    if (err) {
      res.status(500).send("Proxy error: " + err.message);
    }
  });
};
