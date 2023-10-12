module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        login: {
            type: Sequelize.STRING,
            unique: true
        },
        password: {
            type: Sequelize.STRING
        },
        role : {
            type: Sequelize.STRING
        },
        firstLogin: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    })
    return User;
}