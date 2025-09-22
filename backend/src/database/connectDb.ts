import mongoose, { connect, Connection } from 'mongoose'

const dbUrl = "mongodb://localhost:27017/oauth2";

class Database {
  private static instance: Connection | null = null;
  private constructor() {
  }
  
  async connect() {
    try {
      const connection = mongoose.createConnection(dbUrl);
      await connection.asPromise();

      console.log(`connected mongo db successfully: ${dbUrl}`)
      // return connection;
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw error;
    }
  }
  
  static async getInstance(): Promise<Connection> {
    if(!Database.instance) {
      // Create connection once
      const connection = mongoose.createConnection(dbUrl);

      // wait for it to connect
      await connection.asPromise();

      console.log(`✅ Connected to MongoDB: ${dbUrl}`);

      Database.instance = connection;
    }
    
    return Database.instance;
  }
}

const mongoDbInit = Database.getInstance();

export default mongoDbInit;