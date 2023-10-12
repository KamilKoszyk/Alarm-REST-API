module.exports = (sequelize, Sequelize) => {
    const Log = sequelize.define('Log', {
        log_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        action: {
            type: Sequelize.STRING
        },
        createdAt:{
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        }
    })
    return Log;
}