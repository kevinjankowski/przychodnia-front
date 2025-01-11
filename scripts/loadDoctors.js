// Importy
import { apiQueryGET } from './apiQuery.js';
import { loadCalendar } from './loadCalendar.js';

// Zmienne
const submitButton = document.getElementById("submit");
const specializationList = document.getElementById("specializations-list");
const listOfDoctors  = document.getElementById("list-of-doctors");
const  listText  = document.getElementById("list-text");

// Funkcje

/* Funkcj doctorElement tworzy kafelek z imieniem, nazwiskiem oraz specjalizacjami danego lekarza */
function doctorElement(doctor) {
    const doctorDiv = document.createElement("div");
    doctorDiv.id = "doctor-div";

    // Stworzenie nagłówka imienia i nazwiska
    const doctorName = document.createElement("h4");
    doctorName.textContent = `${doctor.first_name} ${doctor.last_name}`;

    // Stworzenie paragrafu z wszystkimi specjalizacjiami
    const doctorSpecializations = document.createElement("p");
    doctorSpecializations.textContent = doctor.specializations.join(", ");

    // Dodanie danych do kafelka
    doctorDiv.appendChild(doctorName);
    doctorDiv.appendChild(doctorSpecializations);

    // Dodanie kafelka do kontenera list-of-doctors
    listOfDoctors.appendChild(doctorDiv);

    // Wywołanie funkcji loadCalendar, która uruchamia listę dostępnych terminów dla danego lekarza
    doctorDiv.addEventListener("click", function() {
        loadCalendar(doctor.doctor_id, doctor.first_name, doctor.last_name).then(r => {});
    });
}

/*  Poniższa funkcja wywołuje zaimportowaną funkcję apiQuery, która pobiera z bazy danych wszystkich lekarzy
*   o podanej w parametrze specjalizacji. Specjalizacja pobrana jest z listy rozwijanej typu <select> */
function loadDoctors(selectedSpecialization) {

    // Zmienne potrzebne funkcji apiQuery
    const endpoint = "doctorsBySpec";
    const params = {specialization: selectedSpecialization};

    apiQueryGET(endpoint, params)
        .then((result) => {
            result.forEach((item) => {
                // Wywołanie funckji, która dodaje kafelek z danymi lekarza podanego w patametrze
                doctorElement(item)
            })
        })
        .catch((error) => {
            listText.style.display = "none";
            alert(error.message);
        })
}

// Wywołanie funckji

/*  Poniższy fragment dodaje addEventListener do przycisku "Wybierz".
*   Po naciśnięciu guzika wywoływana jest funkcja loadDoctors */
submitButton.addEventListener("click", function () {

    const existingDatePicker = document.getElementById('date-picker-container');
    const existingHourPicker = document.getElementById('hour-picker-container');

    if (existingDatePicker || existingHourPicker) {
        existingDatePicker.remove();
        existingHourPicker.remove();
    }
    // Odkrycie napisu listText
    listText.style.display = "block";

    // Wyczyszczenie obecnej listy lekarzy
    listOfDoctors.innerHTML = "";

    // Pobranie do zmiennej nazwy specjalizacji z listy typu <select> oraz wywołanie funkcji loadDoctors
    const selectedSpecialization = specializationList.value;
    loadDoctors(selectedSpecialization)
})


// Code created by Kevin Jankowski