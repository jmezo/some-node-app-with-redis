# Some node app with redis

## how to run:
This project connects to a redis server on localhost.
You can start up a redis instance with:
```bash
docker-compose up -d
```

To install dependencies and run the app:
```bash
npm i --save-dev
npm run dev
```

If you need to access the redis cli:
```bash
docker-compose exec redis bash
redis-cli
```

## what is redis?
An open source, in-memory, NoSQL database, key-value store.
Also a pub/sub engine.

5 data types: string, list, set, sorted set, hash
    + 3 special data types: bitmap, hyperloglog, stream

A ton of commands (160) specificly to be high performant.

It has it's own scripting languange -Lua scripts- for when none of the 160 commands do what you need

Single threaded. Queues up actions.


## what can you do with redis?
Mostly used as a cache layer with an existing database.

Or as a primary database if you only need the data for a short time.

use cases:
* show latest items
* leadboards
* counting stuff
* queues
* pub/sub
* caching


## redis keys
Keys are binary safe strings. The max size is 512MB. An empty string is also valid for a key.
(you can use binary objects like files as keys)  
### best practices for using keys:
* Don't use very long keys (e.g. 1024 bytes), as it will slow down lookup time (you can use hashing instead).
* Try to stick with a schema. For instance "object-type:id" is a good idea, as in "user:1000". Dots or dashes are often used for multi-word fields like "comment:345234:reply-to".
* You don't have to use very short keys, it's better if it's more readable.
Instead of "u1000flw" use "user:1000:followers".  

commands for keys: EXISTS, DEL, KEYS, SCAN, TYPE


## databases
Redis supports 16 logical databases. Numbered 0 - 15.  
The default db is 0.  
commands: SELECT, SWAPDB  


## data types

### string: 
2^32 bits 512 MB / key  
plain strings, json objects, raw bits, binary files  
commands: GET, SET, INCR, INCRBY, GETSET, MGET, MSET 
(SET expire, nx, xx)  
use case: cache(websites, queries), IP tracking (limit)  

### list:
2^32 elements / key  
It's a linked list (fast near both ends, slow in the middle).  
commands: LPUSH, RPUSH, LPOP, RPOP, LRANGE (NO RRANGE), LTRIM, BRPOP, BLPOP, RPOPLPUSH, LLEN  
use cases: queues, stacks, news feeds

### set:
2^32 elements / key  
A set of unordered unique items.
commands: SADD, SREM, SPOP, SMEMBERS, SISMEMBER, SINTER, SUNION, SDIFF, SINTERSTORE, SUNIONSTORE, SCARD  
use case: content filter, compare, IP tracking(usage)  

### sorted set:
Same as set but you can sort it by a score.  
Sorting happens on insert.  
If 2 values hav the same score sorting happens lexicographically.  
commands: ZADD, ZREM, ZRANGE, ZREVRANGE (withscores), ZRANGEBYSCORE, ZREVRANGEBYSCORE, ZRANK, ZSCARD. 
use case: leadboard, voting

### hash:
2 ^ 32 key-value / key  
For representing objects, or +1 level of nesting.  
commands: HSET, HGET, HMSET, HMGET, HGETALL, HINCRBY, HSETNX, HKEYS, HVALS, HLEN  
use case: object properties, key-value store...  

### bitmap:
It has special commands to handle string values as bit arrays.  
Can be used for operating on images in memory.  
commands: SETBIT, GETBIT, BITOP, BITCOUNT, BITPOS

### hyperloglog:
Probabilistic data structure for estimating number of items in set.  
commands: PFADD, PFCOUNT  

### stream:
Append olny collection of map-like entries.  
commands: XADD, XLEN, XRANGE  

## what not to do
* don't use KEYS use SCAN instead
* don't use unbound ranges (HGETALL, LRANGE 0 -1, ) or sanity check first (HLEN, LLEN)
* don't use large data as keys, hash the data instead
* don't use numbered databases (it doesn't scale well)


## pub/sub
Publishers can send messages in channels.  
Subscribers can subscribe to these channels to recieve these messages.  
pub/sub is separate from databases, channels can have same name as keys.  
commands: SUBSCRIBE, PSUBSCRIBE, UNSIBSCRIBE, PUNSUBSCRIBE, PUBLISH


## 
My sources:  
https://redis.io/topics/data-types-intro  
https://www.youtube.com/watch?v=jTTlBc2-T9Q  
https://redislabs.com/blog/7-redis-worst-practices/  
