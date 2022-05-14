export const appConfig = () => ({
  app: {
    url: process.env.APP_URL,
    port: process.env.PORT,
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    dbname: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    logLevel: JSON.parse(process.env.DATABASE_LOG),
  },
  auth: {
    jwtSecret: process.env.JWT_AUTH_SECRET,
    jwtExpiration: process.env.JWT_AUTH_EXPIRATION,
  },
});
