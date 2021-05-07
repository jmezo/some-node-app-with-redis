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


## data types

### string: 
2^32 bits 512 MB / key
plain strings, json objects, raw bits, binary files
commands: GET, SET, INCR, GETSET, MGET, MSET

### list:
2^32 elements / key
It's a linked list (fast near both ends, slow in the middle).
commands: (L/R) LPUSH, RPUSH, LPOP, RPOP, LRANGE (NO RRANGE), LTRIM, BRPOP, BLPOP

### hash:
2 ^ 32 key-value / key
It can work like a table. +1 level of nesting is allowed.
commands: HSET, HGET, HMSET, HMGET, HGETALL, HINCRBY

### set:
2^32 elements / key
A set of unordered unique items.
You can compare two sets: SUNIONSTORE, SDIFFSTORE, SINTERSTORE

### sorted set:
Same as set but you can sort it by a value.
Sorting happens on insert.

### bitmap:
It has special commands to handle string values as bit arrays.
Can be used for operating on images in memory.

### hyperloglog:
Probabilistic data structure for estimating number of items in set.

### Stream:
Append olny collection of map-like entries.

## redis keys
Keys are binary safe strings. The max siye is 512MB. An empty string is also valid for a key.
(you can use binary objects like files as keys)
### best practices for using keys:
* Don't use very long keys (e.g. 1024 bytes), as it will slow down lookup time (you can use hashing instead).
* Try to stick with a schema. For instance "object-type:id" is a good idea, as in "user:1000". Dots or dashes are often used for multi-word fields, as in "comment:345234:reply.to" or "comment:345234:reply-to".
* You don't have to use very short keys, it's better if it's more readable.
Instead of "u1000flw" use "user:1000:followers".

commands for keys: EXISTS, DEL, KEYS

#
My sources:
https://redis.io/topics/data-types-intro
https://www.youtube.com/watch?v=jTTlBc2-T9Q
