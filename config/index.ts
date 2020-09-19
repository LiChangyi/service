const config: IConfig = {
  port: 3000,
  mongodb: {
    url: 'mongodb://127.0.0.1:27017/blog',
    user: '',
    password: '',
    authSource: 'admin',
  },
  redis: {
    host: '127.0.0.1',
    password: 'root',
  },
};

export default config;
