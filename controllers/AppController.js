import redisClient from '../utils/redis'; // Ensure this path is correct
import dbClient from '../utils/db'; // Ensure this path is correct

class AppController {
  static getStatus(req, res) {
    try {
      const redis = redisClient.isAlive(); // Check if Redis is alive
      const db = dbClient.isAlive(); // Check if DB is alive
      res.status(200).json({ redis, db });
    } catch (error) {
      console.error('Error in getStatus:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getStats(req, res) {
    try {
      const users = await dbClient.nbUsers(); // Get number of users
      const files = await dbClient.nbFiles(); // Get number of files
      res.status(200).json({ users, files });
    } catch (error) {
      console.error('Error in getStats:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AppController;
