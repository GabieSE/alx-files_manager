import { MongoClient } from 'mongodb';

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}/`;

class DBClient {
  constructor() {
    this.db = null;
    this.connect();
  }

  async connect() {
    try {
      const client = await MongoClient.connect(url, { useUnifiedTopology: true });
      this.db = client.db(database);
      await this.createCollections();
      console.log('Database connected and collections ensured.');
    } catch (error) {
      console.error('Failed to connect to the database:', error);
    }
  }

  async createCollections() {
    try {
      // Create collections if they do not exist
      const collections = await this.db.listCollections().toArray();
      const collectionNames = collections.map((col) => col.name);

      if (!collectionNames.includes('users')) {
        await this.db.createCollection('users');
        console.log('Users collection created.');
      } else {
        console.log('Users collection already exists.');
      }

      if (!collectionNames.includes('files')) {
        await this.db.createCollection('files');
        console.log('Files collection created.');
      } else {
        console.log('Files collection already exists.');
      }
    } catch (error) {
      console.error('Error creating collections:', error);
    }
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    if (!this.isAlive()) {
      throw new Error('Database connection not established.');
    }
    try {
      return this.db.collection('users').countDocuments();
    } catch (error) {
      console.error('Error counting users:', error);
      return 0;
    }
  }

  async getUser(query) {
    if (!this.isAlive()) {
      throw new Error('Database connection not established.');
    }
    try {
      console.log('QUERY IN DB.JS', query);
      const user = await this.db.collection('users').findOne(query);
      console.log('GET USER IN DB.JS', user);
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async nbFiles() {
    if (!this.isAlive()) {
      throw new Error('Database connection not established.');
    }
    try {
      return this.db.collection('files').countDocuments();
    } catch (error) {
      console.error('Error counting files:', error);
      return 0;
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
