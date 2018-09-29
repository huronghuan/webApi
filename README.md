# web-api

a [Sails v1](https://sailsjs.com) application


## Build and run

##node

**require node >9.3.0**

The application runs on node enviroment,if you didn't have installed `node`,then you can install `node` first from the web site [node](https://nodejs.org).

**MacOS**
    
    ```
    brew install node
    ```

**LINUX**

```
    wget https://nodejs.org/dist/v10.11.0/node-v10.11.0-linux-x64.tar.xz 
    xz -d node-v10.11.0-linux-x64.tar.xz 
    tar -xvf node-v10.11.0-linux-x64.tar
    cd node-v10.11.0-linux-x64
    export PATH=$PATH:$PATH:$(pwd)/bin && source /etc/profile
```

### Build the webapp

```
    git clone git@github.com:huronghuan/webApi.git
    cd webApi
    sudo npm install
    sudo npm install sails -g
    sudo npm install sails-hook-grunt
    sudo npm install sails-hook-orm
    sudo npm install sails-hook-sockets
```
    > If came to 'sudo : npm : not found' ,you can open `/etc/sudoers` and find ` Defaults secure_path = /sbin:/bin:/usr/sbin:/usr/bin` then add your node bin path to secure_path


### Deploy the webapp on test enviroment

```
   rm -rf chaindata
   sails lift
```

### Visit the webapp
1. get a block by blockHeight
   
    method: `GET`
    pathinfo: `/block/{height}`  `{height}` can be replaced with a number
    return:  json data or error info

    > URL: http://localhost:8000/block/0
    > response:`{"hash":"468437029a1a0e2dceb65b6242c463a04a46fb392658bbe7146965ad9ca98e25","height":0,"body":"First block in the chain --Genesis Block","time":"1537967349","previousBlockHash":""}`

2. add a block
    method: `POST`
    pathinfo: `/block`
    content :   string can be prased to json with property `body` ,for example: `{"body":"test add a block"}`
    return : the whole data added to blockchain or error info

    > URL:http://localhost:8000/block
    > content:`{"body":"this is a new block"}`
    > response:`{"hash":"bd1bc35b0bfb193319e1aa0aaf83a43276bf06fbf266476820b49e5a23c64d0d","height":2,"body":"this is a new block","time":"1537897093","previousBlockHash":"882801ba52131134f73b4ae5a5cb8c5aa4950dd3ea37ccbc52da02562eaff3c9"}`
    
### Links

+ [Get started](https://sailsjs.com/get-started)
+ [Sails framework documentation](https://sailsjs.com/documentation)
+ [Version notes / upgrading](https://sailsjs.com/documentation/upgrading)
+ [Deployment tips](https://sailsjs.com/documentation/concepts/deployment)
+ [Community support options](https://sailsjs.com/support)
+ [Professional / enterprise options](https://sailsjs.com/enterprise)


### Version info

This app was originally generated on Tue Sep 25 2018 15:10:14 GMT+0800 (CST) using Sails v1.0.2.




