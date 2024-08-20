import * as joi from 'joi';

export const VALIDATION_SCHEMA = joi.object({
  APP_PORT: joi.number(),
  NODE_ENV: joi.string(),
  JWT_SECRET: joi.string(),
  JWT_EXPIRATION_TIME: joi.string(),
  REDIS_HOST: joi.string(),
  REDIS_PORT: joi.number(),
  REDIS_EXPIRATION_TIME: joi.string(),
  MONGO_DB: joi.string(),
  MONGO_INITDB_ROOT_USERNAME: joi.string(),
  MONGO_INITDB_ROOT_PASSWORD: joi.string(),
  MONGO_PORT: joi.number(),
  MONGO_HOST: joi.string(),
  MONGO_CONNECTION: joi.string(),
  MONGO_AUTHSOURCE: joi.string(),
  MONGO_READ_PREFERENCE: joi.string(),
});
