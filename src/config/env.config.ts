

export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    portdb: +process.env.PORT_DB,
    hostdb: process.env.HOST_DB,
    usernamedb: process.env.USERNAME_DB,
    passworddb: process.env.PASSWORD_DB,
    namedb: process.env.NAME_DB,
    basePath: process.env.BASE_PATH
})