// const authMiddleware = (socket, next) => {
//   const { role, room } = socket.handshake.query;
//   console.log(
//     `Connection attempt - Role: ${role}, Room: ${room}, ID: ${socket.id}`
//   );
//   next();
// };

// const connectionLogger = (socket, next) => {
//   console.log("New connection attempt:", socket.handshake.headers);
//   next();
// };

// module.exports = {
//   authMiddleware,
//   connectionLogger,
// };
