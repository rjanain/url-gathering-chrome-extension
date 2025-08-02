const webpack = require('webpack');
const envConfig = require('./env.js');

/**
 * Get environment variables for webpack DefinePlugin
 * @param {string} env - Environment name (development, production, staging)
 * @returns {object} Environment variables object
 */
function getEnvironmentVariables(env = 'development') {
  const config = envConfig[env] || envConfig.development;

  // Convert config to webpack DefinePlugin format
  const envVars = {};
  for (const [key, value] of Object.entries(config)) {
    envVars[`process.env.${key}`] = JSON.stringify(value);
  }

  return envVars;
}

/**
 * Get webpack DefinePlugin instance with environment variables
 * @param {string} env - Environment name
 * @returns {webpack.DefinePlugin} DefinePlugin instance
 */
function getDefinePlugin(env) {
  return new webpack.DefinePlugin(getEnvironmentVariables(env));
}

/**
 * Get optimization configuration based on environment
 * @param {boolean} isProduction - Whether this is a production build
 * @returns {object} Optimization configuration
 */
function getOptimization(isProduction) {
  const baseConfig = {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          enforce: true,
          priority: 10
        }
      }
    }
  };

  if (isProduction) {
    return {
      ...baseConfig,
      minimize: true,
      sideEffects: false,
      usedExports: true
    };
  }

  return {
    ...baseConfig,
    minimize: false
  };
}

module.exports = {
  getEnvironmentVariables,
  getDefinePlugin,
  getOptimization
};
