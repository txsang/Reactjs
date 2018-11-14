const env = process.env || {};

[
  'API_URL'
].forEach((name) => {
  if (!env[name]) {
    console.log(`Environment variable ${name} is missing, use default instead.`)
  }
})

const config = {
  API_URL: env.API_URL || 'http://localhost:9000',
  NODE_ENV: env.NODE_ENV || 'development',
  PORT: Number(env.APP_PORT || 9000)
}

module.exports = config
