const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config(); // environment variables are loaded

module.exports = function(app) {
  // Get Directus URL from environment variables
  const targetUrl = process.env.REACT_APP_BASE_URL;
  const token = process.env.REACT_APP_TOKEN;

  console.log('Setting up proxy to:', targetUrl);
  
  app.use(
    '/api',
    createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/api': '' 
      },
      onProxyReq: (proxyReq, req, res) => {
        // Log all proxy requests for debugging
        console.log('Proxying request:', req.method, req.path, 'to', targetUrl + req.path.replace(/^\/api/, ''));
        
        // Add authorization header with token
        if (token) {
          proxyReq.setHeader('Authorization', `Bearer ${token}`);
          console.log('Added authorization header');
        }
        
        // Log all headers for debugging
        console.log('Request headers:', proxyReq.getHeaders());
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Proxy response status:', proxyRes.statusCode);
        
        // Log response content type
        console.log('Response content-type:', proxyRes.headers['content-type']);
        
        // Add more detailed logging for error responses
        if (proxyRes.statusCode >= 400) {
          console.error('Proxy error response:', proxyRes.statusCode, proxyRes.statusMessage);
        }
      },
      // Headers to be sent with every proxied request
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  );
};