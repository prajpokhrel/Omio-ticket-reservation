const baseURL = "http://127.0.0.1:5000/api"
const btnBusDelete = document.getElementsByClassName('busDeleteBtn');

for (let i = 0 ; i < btnBusDelete.length; i++) {
    btnBusDelete[i].addEventListener('click' , () => deleteBusData(btnBusDelete[i].dataset.id));
}

async function deleteBusData(id) {
    axios.delete(`${baseURL}/general-routes/buses/${id}`)
        .then((response) => {
            window.location.reload();
            console.log(response);
        }).catch((error) => {
            console.log(error);
    });
}
