module.exports = {
  publicPath: './',
  outputDir: '../www',
  productionSourceMap: false,
  devServer: {
    host: '0.0.0.0',
    port: '9999',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8880',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
}