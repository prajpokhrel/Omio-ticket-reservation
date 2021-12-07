const btnDestinationDelete = document.getElementsByClassName('destinationDeleteBtn');
const baseURL = "http://127.0.0.1:5000/api"

for (let i = 0 ; i < btnDestinationDelete.length; i++) {
    btnDestinationDelete[i].addEventListener('click' , () => deleteDestinationData(btnDestinationDelete[i].dataset.id));
}

function deleteDestinationData(id) {
    axios.delete(`${baseURL}/general-routes/destinations/${id}`)
        .then((response) => {
            window.location.reload();
            console.log(response);
        }).catch((error) => {
        console.log(error);
    });
}