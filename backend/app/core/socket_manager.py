import socketio
import logging

logger = logging.getLogger("travelforge.socket")

# Initialize Socket.io AsyncServer with CORS enabled for frontend
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
    logger=True,
    engineio_logger=False
)

@sio.event
async def connect(sid, environ, auth=None):
    logger.info(f"? Client connected: {sid}")
    await sio.emit("connection_ack", {"status": "connected", "sid": sid}, to=sid)

@sio.event
async def disconnect(sid):
    logger.info(f"? Client disconnected: {sid}")

@sio.event
async def join_room(sid, data):
    room = data.get("room")
    if room:
        await sio.enter_room(sid, room)
        logger.info(f"Client {sid} joined room: {room}")
        await sio.emit("room_joined", {"room": room, "status": "ok"}, to=sid)

@sio.event
async def leave_room(sid, data):
    room = data.get("room")
    if room:
        await sio.leave_room(sid, room)
        logger.info(f"Client {sid} left room: {room}")

async def emit_to_app(application_id: str, event: str, data: dict):
    """Emits a message to all clients connected to an application's room."""
    room = f"app_{application_id}"
    await sio.emit(event, data, room=room)
    # Also broadcast to staff dashboard
    await sio.emit(f"staff_{event}", data, room="staff_room")

async def broadcast_staff(event: str, data: dict):
    """Emits a message specifically to the staff room."""
    await sio.emit(event, data, room="staff_room")
