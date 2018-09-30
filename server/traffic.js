const geo = require('geoip-lite');
const DATA = {
    conn: {}
};

module.exports.analyzer = function(socket){
  const ip = socket.headers['x-forwarded-for'] || socket.remoteAddress;
  const loc = geo.lookup(ip);
  if(loc){
    const city = loc.city;
    const region = loc.region;
    const country = loc.country;

    const conn = DATA.conn;
    if(conn[country]){
      if(conn[country][region]){
          if(conn[country][region][city]){
            conn[country][region][city].push(new Date());
          }
          else{
            conn[country][region][city] = {
              time: [new Date()]
            };
          }
      }
      else{
        conn[country][region] = {};
        conn[country][region][city] = {
          time: [new Date()]
        };
      }

    }
    else{
      conn[country] = {};
      conn[country][region] = {};
      conn[country][region][city] = {
        time: [new Date()]
      };
    }

    console.log(conn);
  }
  else{
    console.log('Cannot find ip');
  }


}
