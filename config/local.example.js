module.exports = {
  app: {
    initializeAdmin: true
  },
  models: {
    connection: 'mysql',
    migrate: 'alter'
  },
  connections: {
    'mysql': {
      adapter: 'sails-mysql',
      user: 'root',
      database: 'sailsadmin_dev'
    }
  }
};
