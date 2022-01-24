let rooms = {};

const addUserSocketIdToRoom = (id, room) => {
    rooms = {
        ...rooms,
        [room]: (rooms[room] || []).concat(id)
    }
    return rooms;
}

const removeRoom = (room) => {
    rooms = Object.fromEntries(Object.entries({ ...rooms }).filter(([ id ]) => id !== room));

    return rooms
}

const removeUserSocketIdFromRoom = (id, room) => {
    rooms = {
        ...rooms,
        [room]: rooms[room]?.filter(item => item !== id)
    }

    return rooms;
}

const getRooms = () => {
    return rooms;
}

module.exports = { addUserSocketIdToRoom, removeUserSocketIdFromRoom, getRooms, removeRoom, }