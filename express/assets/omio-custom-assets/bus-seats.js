const busMap = document.getElementById('busMap');
const seatType = document.getElementById('seats');
const seatAdd = document.getElementById('seatsAddButton');
const busSelect = document.getElementById('select-bus');
const sdSeatFare = document.getElementById('sd-seat');
const rSeatFare = document.getElementById('r-seat');
let seats = [];
let seatTypeValue;

seatType.onchange = () => {
    seatTypeValue = seatType.value;
    console.log(seatTypeValue);
}

const getInitialSeatPlan = (seats) => {
    for (let row = 0; row < 10; row++) {
        const currentRow = [];
        for (let col = 0; col < 5; col++) {
            currentRow.push(createSeat(col, row));
        }
        seats.push(currentRow);
    }
}

// isBlockedSeat
// isGeneralSeat
// isSociallyDistancedSeat
// isSeat
// isReservedSeat

const initialValues = {
    isSeat: false,
    isSociallyDistancedSeat: false,
    isReservedSeat: false,
    isGeneralSeat: false,
    isBlockedSeat: false
}

const getNewSeatPlan = (seats, row, col) => {
    const newSeats = seats.slice();
    const node = newSeats[row][col];

    // check frontend code if you need some adjustments
    const newNode = {
        ...initialValues,
        col: col,
        row: row,
        [seatTypeValue]: !node[seatTypeValue],
        isSeat: !node.isSeat
    };

    newSeats[row][col] = newNode;
    return newSeats;
}

const createSeat = (col, row) => {
    return {
        col,
        row,
        isSeat: false,
        isSociallyDistancedSeat: false,
        isReservedSeat: false,
        isGeneralSeat: false,
        isBlockedSeat: false
    }
}

const handleSeatsClick = (row, col) => {
    const newSeatPlan = getNewSeatPlan(seats, row, col);
    seats = newSeatPlan;
    generateSeatMap(seats);
    console.log(seats);
};

const generateSeatMap = (seats) => {
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

seatAdd.onclick = (event) => {
    event.preventDefault();
    if  (busSelect.value === '' || sdSeatFare.value === '' || rSeatFare.value === '') {
        alert("Fields cannot be empty and you should create seat plan for the bus.");
        return;
    }
    const formData = {
        selectedBus: busSelect.value,
        sociallyDistancedSeatFare: sdSeatFare.value,
        reservedSeatFare: rSeatFare.value,
        seatMap: seats
    };
    try {
        axios.post('/api/seats/create-bus-map', formData).then((response) => {
            console.log(response.data);
            window.location.href = response.data.redirect;
        }).catch((error) => {
            console.log(error.response);
        });
    } catch (error) {
        console.log(error);
    }
}

getInitialSeatPlan(seats);
generateSeatMap(seats);

