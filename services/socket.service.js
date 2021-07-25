const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null
var gSocketBySessionIdMap = {}

function connectSockets(http, session) {
    gIo = require('socket.io')(http, {
        pingTimeout: 30000
    });

    const sharedSession = require('express-socket.io-session');

    gIo.use(sharedSession(session, {
        autoSave: true
    }));
    gIo.on('connection', socket => {
        console.log('New socket - socket.handshake.sessionID', socket.handshake.sessionID)

        if (socket.handshake) {
            if (socket.handshake.session.user) {
                socket.join(socket.handshake.session.user._id);
            }
            gSocketBySessionIdMap[socket.handshake.sessionID] = socket
        }
        socket.on('disconnect', socket => {
                console.log('Someone disconnected')
                if (socket.handshake) {
                    if (socket.handshake.session.user) {
                        socket.leave(socket.handshake.session.user._id);
                    }
                    gSocketBySessionIdMap[socket.handshake.sessionID] = null
                }
            }),
            socket.on('user-watch', userId => {
                socket.join('watching:' + userId)
            })
        socket.on('set-user-socket', userId => {
            logger.debug(`Setting socket.userId = ${userId}`)
            socket.userId = userId
        })
        socket.on('unset-user-socket', () => {
            delete socket.userId
        })
    })
}

function emitToAll({ type, data, room = null }) {
    if (room) gIo.to(room).emit(type, data)
    else gIo.emit(type, data)
}


function emitToUser({ type, data, userId }) {
    logger.debug('Emiting to user socket: ' + userId)
    const socket = _getUserSocket(userId)
    if (socket) socket.emit(type, data)
    else {
        console.log('User socket not found');
        _printSockets();
    }
}

function addUserSocketToRoom(socket, userId) {
    socket.join(userId);
}

function removeUserSocketFromRoom(socket, userId) {
    socket.leave(userId);
}

function getSocketBySessionId(sessionId) {
    return gSocketBySessionIdMap[sessionId];
}

// Send to all sockets BUT not the current socket 
function broadcast({ type, data, room = null }) {
    const store = asyncLocalStorage.getStore()
    const { sessionId } = store
    if (!sessionId) return logger.debug('Shoudnt happen, no sessionId in asyncLocalStorage store')
    const excludedSocket = gSocketBySessionIdMap[sessionId]
    if (!excludedSocket) return logger.debug('Shouldnt happen, No socket in map')
    if (room) excludedSocket.broadcast.to(room).emit(type, data)
    else excludedSocket.broadcast.emit(type, data)
}

function _getUserSocket(userId) {
    const sockets = _getAllSockets();
    const socket = sockets.find(s => s.userId == userId)
    return socket;
}

function _getAllSockets() {
    const socketIds = Object.keys(gIo.sockets.sockets)
    const sockets = socketIds.map(socketId => gIo.sockets.sockets[socketId])
    return sockets;
}

function _printSockets() {
    const sockets = _getAllSockets()
    console.log(`Sockets: (count: ${sockets.length}):`)
    sockets.forEach(_printSocket)
}

function _printSocket(socket) {
    console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}


module.exports = {
    connectSockets,
    emitToAll,
    broadcast,
    emitToUser,
    addUserSocketToRoom,
    removeUserSocketFromRoom,
    getSocketBySessionId
}