const sourceSelect = document.getElementById('fromSourcePlace');
const destinationSelect = document.getElementById('toDestinationPlace');
const busSelect = document.getElementById('assignedBus');
const departureDate = document.getElementById('departureDate');
const baseURL = "http://127.0.0.1:5000/api";

// window.onload = () => {
//     let tomorrow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
//     $('#departureDate').flatpickr({
//         minDate: tomorrow,
//         maxDate: new Date().fp_incr(60) // 60 days from day after tomorrow
//     });
//
//     $('#arrivalDate').flatpickr({
//         minDate: tomorrow,
//         maxDate: new Date().fp_incr(60)
//     });
// }

window.onload = () => {
    dateBlocker('departureDate', Date.now(), 60);
    dateBlocker('arrivalDate', Date.now(), 60);
}

// Can set destination to only upto 60 days
const dateBlocker = (dateElementId, minDate, maxDate = 60) => {
    // let tomorrow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    let tomorrow = 2 * 24 * 60 * 60 * 1000; // day after tomorrow
    $(`#${dateElementId}`).flatpickr({
        minDate: new Date(minDate + tomorrow),
        maxDate: new Date(minDate).fp_incr(maxDate)
    });
}

const blockDepartureArrivalDate = (blockingDate) => {
    dateBlocker('departureDate', blockingDate === undefined ? Date.now() : blockingDate, 60);
    dateBlocker('arrivalDate', blockingDate === undefined ? Date.now() : blockingDate, 60);
}

// attribute format: [value][text 1][text 2][text 3]....
function initDropdownList(selectElementId, response, ...attributes) {
    let select, option;
    select = document.getElementById(selectElementId);
    const valueAttribute = attributes[0];
    if ("there is image") {
        console.log("Do something here and add there later");
    }
    response.map((data) => {
        option = document.createElement('option');
        option.value =  data[valueAttribute];
        attributes.forEach((value) => {
            option.innerHTML += data[value] + "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
        });
        select.add(option);
    });
}

const getSourcePlaces = () => {
    const selectedBus = busSelect.value;
    while (sourceSelect.firstChild) {
        sourceSelect.removeChild(sourceSelect.firstChild);
    }
    axios.get(`${baseURL}/places/bus-specific-source/${selectedBus}`).then((response) => {
        if (response.data.allSource) {
            initDropdownList("fromSourcePlace", response.data.allSource, "source");
            blockDepartureArrivalDate();
        }
        if (response.data.currentRoute) {
            const arrivalDate = response.data.currentRoute[0].arrivalDate;
            initDropdownList("fromSourcePlace", response.data.currentRoute, "toDestination");
            blockDepartureArrivalDate(Date.parse(arrivalDate));
        }
        getAvailableDestinations();
    }).catch((error) => {
        console.log(error.response);
    });
};

const getAvailableDestinations = () => {
    const selectedSource = sourceSelect.value;
    while (destinationSelect.firstChild) {
        destinationSelect.removeChild(destinationSelect.firstChild);
    }
    axios.get(`${baseURL}/places/source/${selectedSource}`)
        .then((response) => {
            initDropdownList("toDestinationPlace", response.data, "destination");
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error.response);
        });
};

sourceSelect.onchange = () => {
    getAvailableDestinations();
}

busSelect.onchange = () => {
    getSourcePlaces();
}

departureDate.onchange = () => {
    const twoDaysBefore = 2 * 24 * 60 * 60 * 1000;
    dateBlocker('arrivalDate', Date.parse(departureDate.value) - twoDaysBefore, 60);
}

// getSourcePlaces();

// const getSourcePlaces = () => {
//     const selectedBus = busSelect.value;
//     axios.get(`${baseURL}/places/source`)
//         .then((response) => {
//             initDropdownList("fromSourcePlace", response.data, "source");
//         }).catch((error) => {
//             console.log(error.response);
//         });
// };