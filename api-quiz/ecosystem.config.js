module.exports = {
  apps: [
    {
      name: 'api-quiz',
      script: './dist/main.js',
      watch: false,
      env: {
        NODE_ENV: 'local',
        TZ: 'Asia/Ho_Chi_Minh',
      },
      env_development: {
        NODE_ENV: 'development',
        TZ: 'Asia/Ho_Chi_Minh',
      },
      env_staging: {
        NODE_ENV: 'staging',
        TZ: 'Asia/Ho_Chi_Minh',
      },
      env_production: {
        NODE_ENV: 'production',
        TZ: 'Asia/Ho_Chi_Minh',
      },
      env_test: {
        NODE_ENV: 'test',
        TZ: 'Asia/Ho_Chi_Minh',
      },
    },
  ],
};
