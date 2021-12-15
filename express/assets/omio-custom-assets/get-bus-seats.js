const busMap = document.getElementById('getBusMap');
const getSeats = document.getElementById('get-bus-seat');
const deleteSeatsBtn = document.getElementById('seatsDeleteBtn');

window.onLoad = () => {
    deleteSeatsBtn.disabled = true;
}

getSeats.onchange = () => {
    const busId = getSeats.value;
    console.log(busId);
    axios.get(`/api/seats/bus-map/${busId}`)
        .then((response) => {
            // console.log(response.data);
            buildSeatMap(response.data.seatData);
        }).catch((error) => {
            console.log(error.response);
    });
    deleteSeatsBtn.disabled = false;
}

deleteSeatsBtn.onclick = (event) => {
    event.preventDefault();
    const busId = getSeats.value;
    console.log(busId);
    axios.delete(`/api/seats/bus-map/${busId}`).then((response) => {
        window.location.reload();
    }).catch((error) => {
        console.log(error);
    });
}

// isBlockedSeat
// isGeneralSeat
// isSociallyDistancedSeat
// isSeat
// isReservedSeat

const buildSeatMap = (seats) => {
    while (busMap.firstChild) {
        busMap.removeChild(busMap.firstChild);
    }
    seats.map((row) => {
        row.map((node) => {
            const { row, col, isBlockedSeat, isSociallyDistancedSeat, isReservedSeat, isGeneralSeat } = node;
            let seat = document.createElement('div');
            busMap.appendChild(seat);
            seat.id = `bus-seat-${row}-${col}`;
            seat.className= `bus-seat seat-gap ${isBlockedSeat ? 'isBlockedSeat' : isSociallyDistancedSeat ? 'isSociallyDistancedSeat' : isReservedSeat ? 'isReservedSeat' : isGeneralSeat ? 'isGeneralSeat' : ''}`;
            seat.addEventListener('click', () => handleSeatsClick(row, col));
        });
    });
}

// getInitialSeatPlan(seats);
// generateSeatMap(seats);

