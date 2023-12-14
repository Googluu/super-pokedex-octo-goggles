export const EnvConfiguration = () => ({
  evironment: process.env.NODE_ENV || 'dev',
  mongodb_uri: process.env.MONGODB_URI,
  port: process.env.PORT,
  default_limit: +process.env.DEFAULT_LIMIT || 7,
});
