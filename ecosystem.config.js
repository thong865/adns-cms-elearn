module.exports = {
    apps: [
      {
        name: 'web404',
        script: './build/server.js',
        instances: '2',
        exec_mode: 'cluster',
        autorestart: true,
      },
    ],
  }