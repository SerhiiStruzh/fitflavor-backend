export default () => ({
    auth: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        client_redirect: process.env.GOOGLE_REDIRECT_URL,
    },
    database: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    jwt: {
        access_secret: process.env.JWT_SECRET,
        access_expiration: process.env.JWT_EXPIRATION,
        refresh_secret: process.env.REFRESH_SECRET,
        refresh_expiration: process.env.REFRESH_EXPIRATION,
    },
    frontend: {
        base_url: process.env.FRONTEND_BASE_URL,
    },
});