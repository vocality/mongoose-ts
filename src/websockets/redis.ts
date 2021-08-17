import Redis from 'ioredis'

// some functions


// Connect
const redis = new Redis(6379);

// commands
redis.ping().then( res => {
    console.log(`Response from PING cmd: ${res}`);

    //redis.quit();
})

redis.set('foo', 'bar');
redis.set('k1', 'v1');


redis.keys('*', (err, res) => {
    console.log(res)
})

redis.get('foo', (err, res) => {
    err ? console.log(err): console.log(res)
    
})
