import redis from "redis";
import { promisify } from "util";

export default class Queue {
  private redisClient: redis.RedisClient;

  private readonly queueKey = "some-queue";

  private readonly waitTimeSec = 30;

  private lpopAsync: (key: string) => Promise<string | null>;

  private blpopAsync: (
    ...args: (string | number)[]
  ) => Promise<[string, string]>;

  constructor(redisClient: redis.RedisClient) {
    this.redisClient = redisClient;
    this.lpopAsync = promisify(this.redisClient.lpop).bind(this.redisClient);
    this.blpopAsync = promisify(this.redisClient.blpop).bind(this.redisClient);
  }

  pushToQueue(val: string): void {
    this.redisClient.rpush(this.queueKey, val);
  }

  async popFromQueue(wait: boolean): Promise<string | null> {
    let poppedValue: string | null;
    if (wait) {
      const res = await this.blpopAsync(this.queueKey, this.waitTimeSec);
      poppedValue = res === null ? null : res[1];
    } else {
      poppedValue = await this.lpopAsync(this.queueKey);
    }
    return poppedValue;
  }
}
