export const initQueueSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join specific procurement center room
    socket.on('join_center_queue', (centerId) => {
      socket.join(`center_${centerId}`);
      console.log(`[Socket.IO] Client ${socket.id} joined center_${centerId}`);
    });

    // Handle token called event by officer
    socket.on('officer_call_next', (data) => {
      // Broadcast live update to all farmers connected to this center room
      io.to(`center_${data.centerId}`).emit('queue_updated', {
        type: 'TOKEN_CALLED',
        currentServingToken: data.currentServingToken,
        calledToken: data.calledToken,
        timestamp: new Date().toISOString()
      });
    });

    // Handle status update (Lab test, weighbridge, approval, rejection)
    socket.on('update_token_status', (data) => {
      io.to(`center_${data.centerId}`).emit('queue_updated', {
        type: 'STATUS_CHANGED',
        tokenNumber: data.tokenNumber,
        newStatus: data.newStatus,
        details: data.details,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};