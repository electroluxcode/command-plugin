使用类似于

```js

cross-env ENV=production max dev

var proEnv = require('./config/production.env'); // 生产环境
var testEnv = require('./config/test.env'); // 测试环境
var devEnv = require('./config/development.env'); // 本地环境


const env = process.env.ENV;//当前环境
let URL_COMMON = '';//路径
let URL_RESOURCE = '';//路径

// 默认是本地环境
if (env === 'production') { // 生产环境
    console.log("----------生产环境----------");
    URL_COMMON = proEnv.URL_COMMON;
    URL_RESOURCE = proEnv.URL_RESOURCE
} else if (env === 'test') { // 测试环境
    console.log("----------测试环境----------");
    URL_COMMON = testEnv.URL_COMMON;
    URL_RESOURCE = testEnv.URL_RESOURCE
} else if( env ==='development') { // 开发环境
    console.log("----------开发环境----------");
    URL_COMMON = devEnv.URL_COMMON;
    URL_RESOURCE = devEnv.URL_RESOURCE
}

```