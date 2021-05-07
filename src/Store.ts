import redis from "redis";
import { promisify } from "util";

redis.createClient();

export default class Store {
  private redisClient: redis.RedisClient;

  private getAsync: (key: string) => Promise<string | null>;

  constructor(redisClient: redis.RedisClient) {
    this.redisClient = redisClient;
    this.getAsync = promisify(this.redisClient.get).bind(this.redisClient);
  }

  async get(key: string): Promise<string | null> {
    return this.getAsync(key);
  }

  set(key: string, val: string): void {
    this.redisClient.set(key, val);
  }

  delete(key: string): void {
    this.redisClient.del(key);
  }
}
