# web-api

a [Sails v1](https://sailsjs.com) application


## Build and run

## node

The application runs on node enviroment,if you didn't have installed `node`,then you can install `node` first from the web site [node](https://nodejs.org).

### Build the webapp
```
    git clone git@github.com:huronghuan/webApi.git
    cd webApi
    npm install
```

### Deploy the webapp
```
    cd webApi
    sails lift
```

### Visit the webapp
1. get a block by blockHeight
    method `GET`
    pathinfo `/block/{height}`  `{height}` can be replaced with a number
    return  json data or error info
2. add a block
    method `POST`
    pathinfo `/block`
    content    string can be prased to json with property `body` ,for example: `{"body":"test add a block"}`
    return  the whole data added to blockchain or error info

### Links

+ [Get started](https://sailsjs.com/get-started)
+ [Sails framework documentation](https://sailsjs.com/documentation)
+ [Version notes / upgrading](https://sailsjs.com/documentation/upgrading)
+ [Deployment tips](https://sailsjs.com/documentation/concepts/deployment)
+ [Community support options](https://sailsjs.com/support)
+ [Professional / enterprise options](https://sailsjs.com/enterprise)


### Version info

This app was originally generated on Tue Sep 25 2018 15:10:14 GMT+0800 (CST) using Sails v1.0.2.




