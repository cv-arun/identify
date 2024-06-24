import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";


type linkPrecedenceType = "secondary" | "primary"
interface UserAttributes {
  id: number;
  email?: string;
  phoneNumber?: string;
  linkedId?: number;
  linkPrecedence: linkPrecedenceType;
  deletedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }


class Contact extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email?: string;
  public phone?: string;
  public phoneNumber?: string;
  public linkedId?: number;
  public linkPrecedence!: linkPrecedenceType;
  public deletedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}


Contact.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: Contact, 
        key: 'id' 
      }
    },
    linkPrecedence: {
      type: DataTypes.ENUM('primary', 'secondary')
    },
    deletedAt: {
      type: DataTypes.DATE,
    }
  },
  {
    sequelize,
    modelName: 'Contact',
  }
);

export default Contact;
