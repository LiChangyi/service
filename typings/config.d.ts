interface IConfig {
  port: number;
  mongodb: {
    url: string;
    user: string;
    password: string;
    authSource: string;
  },
  redis: {
    host: string;
    password: string;
  }
}
