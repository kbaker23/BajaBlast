# BajaBlast

### To run game server:
  
  1. Install Node.js and npm
  
  2. Install dependencies
  ```
  npm install --save sockjs
  ```
  ```
  npm install --save express
  ```
  ```
  npm install --save http
  ```
  ```
  npm install --save mongodb-stitch-server-sdk
  ```
  ```
  npm install --save host-validation
  ```
      
  3. Run index.js
  ```
      node index.js
  ```
      
### To make calls:

Insert script into HTML page.
```
     <script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
```
Initialize SockJS instance.
```
     const sockjs = new SockJS('http://the-twisted-game.herokuapp.com/api');
```
Or, if run on localhost on your computer
```
     const sockjs = new SockJS('http://localhost:5000/api');
```

### To send data:
```
    sockjs.send(<data>);
```
    ****data must be a string****
    ****To send JSON, use JSON.stringify****
### To recieve data:
```
    sockjs.onmessage = function(msg){
        const json = parse(msg.data);
    };
```

For more info on SockJS, see https://github.com/sockjs/sockjs-client and https://github.com/sockjs/sockjs-node
