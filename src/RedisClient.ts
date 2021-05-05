import redis from "redis";
import { promisify } from "util";

redis.createClient();

class RedisClient {
  redisClient: redis.RedisClient;

  getAsync: (key: string) => Promise<string | null>;

  constructor() {
    this.redisClient = redis.createClient();
    this.getAsync = promisify(this.redisClient.get).bind(this.redisClient);
  }

  async get(key: string): Promise<string | null> {
    return this.getAsync(key);
  }

	set(key: string, val: string): void {
		this.redisClient.set(key, val);
	}
}

export default  new RedisClient();
