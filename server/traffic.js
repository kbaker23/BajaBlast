
const DATA = {
    conn: []
};

module.exports.analyzer = function(socket){
  const info = {
    ip: socket.remoteAddress,
    time: new Date()
  };
  DATA.conn.push(info);
  console.log(DATA);
}
