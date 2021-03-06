try {
  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    require('./Console').default.info(
      "You're running Tweed in <b>dev mode</b>. Make sure you build before deploying to production."
    )
  }
} catch (e) {
  window.process = {
    env: {
      NODE_ENV: 'development'
    }
  }
}
