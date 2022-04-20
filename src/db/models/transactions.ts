import { Model, Sequelize, DataTypes } from "sequelize";

export default class Transactions extends Model {
  /**
   * [PK] Transaction type based on pre-defined configuration (see default.js).
   * Possible members of the array - 'all', 'nonZeroValue' and 'expensiveTx'.
   */
  public type: string[];
  /**
   * [PK] Block number where this transaction was in.
   */
  public blockNumber: number;
  /**
   * [PK] Hash of the transaction (32 Bytes).
   */
  public txHash: string;
  /**
   * Address of the sender.
   */
  public from: string;
  /**
   * Address of the receiver. null if it’s a contract creation transaction.
   */
  public to?: string | null;
  /**
   * Transaction's age.
   */
  public age?: string;
  /**
   * Value transferred in wei.
   */
  public value?: string;
  /**
   * Gas price * gas used (in Ether).
   */
  public fee?: string;
}

export const TransactionsMap = (sequelize: Sequelize) => {
  Transactions.init({
    type: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    blockNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    txHash: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: "tblTransactions",
    timestamps: true
  });
  Transactions.sync();
}
