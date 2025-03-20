const handleConnection = (io, socket) => {
  let currentRoom = null;

  socket.on("join", ({ room, name, role }) => {
    if (currentRoom) return;

    const roomClients = io.sockets.adapter.rooms.get(room) || new Set();
    const existingClients = Array.from(roomClients).map((id) => {
      const clientSocket = io.sockets.sockets.get(id);
      return {
        id,
        role: clientSocket?.handshake?.query?.role,
        name: clientSocket?.handshake?.query?.name,
      };
    });

    const roleExists = existingClients.some((client) => client.role === role);
    if (roleExists) {
      socket.emit("room-error", { message: "Role already exists in room" });
      return;
    }

    if (roomClients.size >= 2) {
      socket.emit("room-error", { message: "Room is full" });
      return;
    }

    currentRoom = room;
    socket.join(room);
    console.log(`${role} ${name} joined room ${room}`);

    // Notify the joining user of existing participants
    existingClients.forEach((client) => {
      socket.emit("user-connected", { name: client.name, role: client.role });
    });

    // Broadcast to others in the room that a new user has joined
    socket.to(currentRoom).emit("user-connected", { name, role });

    socket.emit("join-success", { room });
  });

  socket.on("message", (data) => {
    if (!currentRoom) return;
    const messageData = {
      text: data.text,
      sender: data.sender,
      timestamp: Date.now(),
    };
    io.in(currentRoom).emit("message", messageData);
  });

  socket.on("offer", (data) => {
    if (!currentRoom) return;
    io.in(currentRoom).emit("offer", data);
    console.log(`Offer sent in room ${currentRoom}`);
  });

  socket.on("answer", (data) => {
    if (!currentRoom) return;
    io.in(currentRoom).emit("answer", data);
    console.log(`Answer sent in room ${currentRoom}`);
  });

  socket.on("ice-candidate", (data) => {
    if (!currentRoom) return;
    io.in(currentRoom).emit("ice-candidate", data);
  });

  socket.on("end-call", () => {
    if (!currentRoom) return;
    io.in(currentRoom).emit("call-ended");
  });

  socket.on("disconnect", () => {
    if (currentRoom) {
      io.in(currentRoom).emit("peer-disconnected");
      socket.leave(currentRoom);
      currentRoom = null;
    }
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
    if (currentRoom) {
      io.in(currentRoom).emit("peer-disconnected");
      socket.leave(currentRoom);
      currentRoom = null;
    }
  });
};

module.exports = { handleConnection };
