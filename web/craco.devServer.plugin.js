module.exports = {
  overrideDevServerConfig: ({
    devServerConfig,
    cracoConfig,
    pluginOptions,
    context: { env, paths, allowedHost },
  }) => ({
    ...devServerConfig,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
        secure: false,
        changeOrigin: true,
      },
    },
  }),
}
