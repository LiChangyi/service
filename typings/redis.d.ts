import redis from 'redis';

declare module 'redis' {
  export interface RedisClient extends NodeJS.EventEmitter {
    setAsync(key:string, value:string, ex: string, time: number): Promise<void>;
    getAsync(key:string): Promise<string>;
  }
}
