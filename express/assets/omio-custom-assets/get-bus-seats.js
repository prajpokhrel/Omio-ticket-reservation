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
//
// const getInitialSeatPlan = (seats) => {
//     for (let row = 0; row < 10; row++) {
//         const currentRow = [];
//         for (let col = 0; col < 5; col++) {
//             currentRow.push(createSeat(col, row));
//         }
//         seats.push(currentRow);
//     }
// }

// isBlockedSeat
// isGeneralSeat
// isSociallyDistancedSeat
// isSeat
// isReservedSeat

// const initialValues = {
//     isSeat: false,
//     isSociallyDistancedSeat: false,
//     isReservedSeat: false,
//     isGeneralSeat: false,
//     isBlockedSeat: false
// }

// const getNewSeatPlan = (seats, row, col) => {
//     const newSeats = seats.slice();
//     const node = newSeats[row][col];
//
//     // check frontend code if you need some adjustments
//     const newNode = {
//         ...initialValues,
//         col: col,
//         row: row,
//         [seatTypeValue]: !node[seatTypeValue],
//         isSeat: !node.isSeat
//     };
//
//     newSeats[row][col] = newNode;
//     return newSeats;
// }

// const createSeat = (col, row) => {
//     return {
//         col,
//         row,
//         isSeat: false,
//         isSociallyDistancedSeat: false,
//         isReservedSeat: false,
//         isGeneralSeat: false,
//         isBlockedSeat: false
//     }
// }

// const handleSeatsClick = (row, col) => {
//     const newSeatPlan = getNewSeatPlan(seats, row, col);
//     seats = newSeatPlan;
//     generateSeatMap(seats);
//     console.log(seats);
// };

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

