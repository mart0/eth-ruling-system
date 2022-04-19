import { Model, Sequelize, DataTypes } from 'sequelize';

export default class Transactions extends Model {
  /**
   * [PK] Auto-incremented txId.
   */
  public id: number;
  /**
   * [PK] Block number where this transaction was in.
   */
  public blockNumber: number;
  /**
   * [PK] Hash of the transaction (32 Bytes).
   */
  public txHash: string;
  /**
   * [PK] Address of the sender.
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
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
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
      allowNull: false,
      primaryKey: true
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
    tableName: 'tblTransactions',
    timestamps: true
  });
  Transactions.sync();
}