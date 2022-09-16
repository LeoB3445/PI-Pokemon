const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('pokemon', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true 
    },
    id:{
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement: true,
    },
    hp:{
      type:DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min:1
      }
    },
    attack:{
      type: DataTypes.INTEGER,
      allowNull: true,
      validate:{
        min:1
      }
    },
    defense:{
      type: DataTypes.INTEGER,
      allowNull: true,
      validate:{
        min:1
      }
    },
    speed:{
      type:DataTypes.INTEGER,
      allowNull: true,
      validate:{
        min:1
      }
    },
    weight:{
      type: DataTypes.INTEGER,
      allowNull: true,
      validate:{
        min:1
      }
    },
    height:{
      type: DataTypes.INTEGER,
      allowNull: true,
      validate:{
        min:1
      }
    }
  },
  {
    initialAutoIncrement: 1
  });
};


