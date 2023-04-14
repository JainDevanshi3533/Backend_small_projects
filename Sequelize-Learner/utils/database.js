// To establish a connection with the database.:-
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const Sequelize = require('sequelize');
                                //<database-name>, <root-name>, <password>,<optional-parameterS>
const sequelize = new Sequelize("sequelize_youtube", "root",process.env.MYSQL_PASS,{
    dialect:"mysql",
    host:"localhost"
});

module.exports = sequelize;