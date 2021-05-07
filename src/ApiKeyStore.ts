import redis from "redis";
import { promisify } from "util";

export default class ApiKeyStore {
  private redisClient: redis.RedisClient;

  private hmsetAsync: (args: [string, ...(string | number)[]]) => Promise<"OK">;

  private readonly prefixApiKey = "api-keys";

  private readonly fieldName = "name";

  private readonly fieldCounter = "counter";

  private hincrbyAsync: (
    key: string,
    field: string,
    increment: number
  ) => Promise<number>;

  private hgetAsync: (key: string, field: string) => Promise<string | null>;

  private existsAsyc: (key: string) => Promise<number>;

  constructor(redisClient: redis.RedisClient) {
    this.redisClient = redisClient;
    this.hmsetAsync = promisify(this.redisClient.hmset).bind(this.redisClient);
    this.hincrbyAsync = promisify(this.redisClient.hincrby).bind(
      this.redisClient
    );
    this.hgetAsync = promisify(this.redisClient.hget).bind(this.redisClient);
    this.existsAsyc = promisify(this.redisClient.exists).bind(this.redisClient);
  }

  putKey(apiKey: string, name: string): void {
    this.hmsetAsync([
      `${this.prefixApiKey}:${apiKey}`,
      this.fieldName,
      name,
      this.fieldCounter,
      0,
    ]);
  }

  incrementCounter(apiKey: string): void {
    this.hincrbyAsync(`${this.prefixApiKey}:${apiKey}`, this.fieldCounter, 1);
  }

  async getName(apiKey: string): Promise<string | null> {
    return this.hgetAsync(`${this.prefixApiKey}:${apiKey}`, this.fieldName);
  }

  async checkApiKey(apiKey: string): Promise<boolean> {
    return (await this.existsAsyc(`${this.prefixApiKey}:${apiKey}`)) === 1;
  }
}
