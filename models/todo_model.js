const Sequelize = require(`sequelize`);
const db = require(`../db/index`)
const Todos = db.define(`todos`,{
    id:{
        type:Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement: true,
       
    } ,
    name:{
        type:Sequelize.TEXT,
       

    },
    isCompleted:{
        type:Sequelize.BOOLEAN,
        
    }
 },{
     timestamps:false
 });
 module.exports = Todos;