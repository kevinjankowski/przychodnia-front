// Importy
import { apiQuery } from './apiQuery.js';

// Zmienne
const submitButton = document.getElementById("submit");
const specializationList = document.getElementById("specializations-list");

// Funkcje
/*  Poniższa funkcja wywołuje zaimportowaną funkcję apiQuery, która pobiera z bazy danych wszystkich lekarzy
*   o podanej w parametrze specjalizacji. Specjalizacja pobrana jest z listy rozwijanej typu <select> */
function loadDoctors(selectedSpecialization) {

    // Zmienne potrzebne funkcji apiQuery
    const endpoint = "doctorsBySpec";
    const params = {specialization: selectedSpecialization};

    apiQuery(endpoint, params)
        .then((data) => {
            console.log(data);
        })
}

// Wywołanie funckji

/*  Poniższy fragment dodaje addEventListener do przycisku "Wybierz".
*   Po naciśnięciu guzika wywoływana jest funkcja loadDoctors */
submitButton.addEventListener("click", function () {
    const selectedSpecialization = specializationList.value;
    loadDoctors(selectedSpecialization)
})
