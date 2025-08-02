// Environment configuration for different build targets
module.exports = {
  development: {
    NODE_ENV: 'development',
    DEBUG: true,
    API_URL: 'http://localhost:3000',
    LOG_LEVEL: 'debug'
  },

  production: {
    NODE_ENV: 'production',
    DEBUG: false,
    API_URL: 'https://api.example.com',
    LOG_LEVEL: 'error'
  },

  staging: {
    NODE_ENV: 'staging',
    DEBUG: true,
    API_URL: 'https://staging-api.example.com',
    LOG_LEVEL: 'warn'
  }
};
