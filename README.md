# BajaBlast

To run game server:
  
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
  npm install --save mongodb-stitch
  ```
  ```
  npm install --save host-validation
  ```
      
  3. Run main.js
  ```
      node main.js
  ```
      
To make calls:

Insert script into HTML page.
```
     <script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
```
```
     const sockjs = new SockJS('api');
```

To send data:
```
    sockjs.send(<data>);
```
    ****data must be a string****
    ****To send JSON, use JSON.stringify****
To recieve data:
```
    sockjs.onmessage = function(msg){
        const json = parse(msg.data);
    };
```
