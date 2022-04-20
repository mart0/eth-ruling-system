import { Model, Sequelize, DataTypes } from "sequelize";

export default class Config extends Model {
  /**
   * [PK] Current dynamic configuration.
   */
  public config: object;
}

export const ConfigMap = (sequelize: Sequelize) => {
  Config.init({
    config: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
  }, {
    sequelize,
    tableName: "tblConfig",
    timestamps: true,
    freezeTableName: true
  });

  Config.sync();
}
