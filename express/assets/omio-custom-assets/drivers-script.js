const baseURL = "http://127.0.0.1:5000/api"
const btnDriverDelete = document.getElementsByClassName('driverDeleteBtn');

for (let i = 0 ; i < btnDriverDelete.length; i++) {
    btnDriverDelete[i].addEventListener('click' , () => deleteDriverData(btnDriverDelete[i].dataset.id));
}

function deleteDriverData(id) {
    axios.delete(`${baseURL}/general-routes/drivers/${id}`)
        .then((response) => {
            window.location.reload();
            console.log(response);
        }).catch((error) => {
        console.log(error);
    });
}
