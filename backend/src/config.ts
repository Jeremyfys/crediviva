import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    appPort: process.env.APP_PORT,
    nodeEnv: process.env.NODE_ENV,
    mongo: {
      name: process.env.MONGO_DB,
      username: process.env.MONGO_INITDB_ROOT_USERNAME,
      password: process.env.MONGO_INITDB_ROOT_PASSWORD,
      port: parseInt(process.env.MONGO_PORT, 10),
      host: process.env.MONGO_HOST,
      connection: process.env.MONGO_CONNECTION,
      authSource: process.env.MONGO_AUTHSOURCE,
    },
  };
});
