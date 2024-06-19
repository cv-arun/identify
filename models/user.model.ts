import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

// Define attributes interface for User
interface UserAttributes {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }


class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email?: string;
  public phone?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

export default User;
