// Importy
import {apiQueryGET} from './apiQuery.js';
import {personalData} from './personalData.js';

// Zmienne
const leftSide = document.getElementById('left-side');
const goToPersonal = document.getElementById('go-to-personal');
const userForm = document.getElementById('user-form');
let allHours = [];
let busyHours = [];
let freeHours = [];

let selectedDate = "";
let selectedHour = "";

// Funkcje

/*  Funckja getAllHours zwraca wszystkie godziny, w których mogą odbyć się wizyty*/
function getAllHours(){

    // Zmienne potrzebne funckji apiQuery
    const endpoint = "hours"

    return apiQueryGET(endpoint)
        .then(result => {
            result.forEach(item => {
                allHours.push(item.hour);
            })
        })
        .catch((error) => {});
}

/*  Funkcja getBusyHours zwraca wszystkie godziny, w których ktoś w określonym dniu zarezerwował wizytę u danego lekarza.
*   Takich rekordów może być więcej niż jeden. Rekordy są dodawane po kolei do tablicy busyHours */
function getBusyHours(doctor_id, visit_date){

    // Wyczyszczenie tablicy z godzinami.
    busyHours = [];

    // Zmienne potrzebne funckji apiQuery
    const endpoint = "busyAppointments";
    const params = {doctorId: doctor_id, date: visit_date};

    return apiQueryGET(endpoint, params)
        .then(result => {
            result.forEach(item => {
                busyHours.push(item.hour);
            })
        })
        .catch((error) => {});
}

/* Poniższa funkcja tworzy element typu input date, który pozwala wybrać datę począwszy od dzisiaj */
function createDatePicker(doctor_id, doc_first_name, doc_last_name) {
    // Sprawdzenie, czy istnieje już jakiś date picker i usunięcie go
    const existingContainer = document.getElementById('date-picker-container');
    if (existingContainer) {
        existingContainer.remove();
    }

    // Tworzenie elementów HTML
    const pickDateText = document.createElement('p');
    pickDateText.id = "pick-date-text";
    pickDateText.textContent = `Wybierz datę, aby zobaczyć dostępne godziny u ${doc_first_name} ${doc_last_name}:`;

    const container = document.createElement('div');
    container.id = "date-picker-container";

    // Tworzenie elementu typu input date
    const datePicker = document.createElement('input');
    datePicker.type = 'date';
    datePicker.id = 'date-picker';

    // Ustawienie minimalnej daty na dzisiejszą
    datePicker.min = new Date().toISOString().split('T')[0];

    // Tworzenie przycisku
    const pickButton = document.createElement('button');
    pickButton.id = 'pick-date';
    pickButton.textContent = 'Wybierz';

    // Dodanie elementów do kontenera
    container.appendChild(pickDateText);
    container.appendChild(datePicker);
    container.appendChild(pickButton);

    // Dodanie kontenera do dokumentu
    leftSide.appendChild(container);

    // Obsługa kliknięcia przycisku
    pickButton.addEventListener('click', async function () {
        freeHours = [];
        selectedDate = datePicker.value;

        if (!selectedDate) {
            selectedDate = new Date().toISOString().split('T')[0]
        }

        // Pobranie zajętych godzin w podanej dacie.
        await getBusyHours(doctor_id, selectedDate);

        // Wyodrębnienie wolnych godzin danego lekarza w danym dniu.
        allHours.forEach(hour => {
            if(!busyHours.includes(hour)){
                freeHours.push(hour);
            }
        })

        // Utworzenie przycisków z dostępnymi godzinami
        createHourPicker();
    });
}

function createHourPicker(){
    // Sprawdzenie, czy istnieje już jakiś hour picker i usunięcie go
    const existingContainer = document.getElementById("hour-picker-container");
    if (existingContainer) {
        existingContainer.remove();
    }

    // Tworzenie elementów HTML
    const pickHourText = document.createElement('p');
    pickHourText.id = "pick-hour-text";
    pickHourText.textContent = `Wybierz dostępną godzinę: `;

    const container = document.createElement('div');
    container.id = "hour-picker-container";
    container.appendChild(pickHourText);

    // Tworzenie guzików do poszczególnych godzin
    freeHours.forEach(hour => {
        const pickHour = document.createElement('button');
        pickHour.id = "pick-hour";
        pickHour.textContent = hour;
        container.appendChild(pickHour);

        // Obsługa kliknięcia przycisku
        pickHour.addEventListener('click', function () {

            // Przypisanie do zmiennej globalnej wartości naciśniętego przycisku
            selectedHour = hour;

            // Zmiana kolorów przucisków na białe
            const allButtons = container.querySelectorAll('button');
            allButtons.forEach(button => {
                button.style.color = "black"; // Domyślny kolor
            });

            // Zmiana koloru naciśniętego przycisku na zielony
            pickHour.style.color = "green";

            // Kiedy wybrano datę i godzinę, pojawia się opcja przejścia dalej
            goToPersonal.style.display = "block";
        })
    })

    // Dodanie elementów do kontenera
    leftSide.appendChild(container);
}

export async function loadCalendar(doctor_id, doc_first_name, doc_last_name) {

    try{
        // Czyszczenie tablic z godzinami
        allHours = [];
        busyHours = [];
        freeHours = [];

        // Sprawdzenie, czy istnieje już jakiś date picker i usunięcie go
        const existingContainer = document.getElementById('hour-picker-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        // Pobranie wszystkich godzin z bazy danych
        await getAllHours()

        // Tworzenie kalendarza i pobranie daty od użytkownika
        createDatePicker(doctor_id, doc_first_name, doc_last_name);

        goToPersonal.addEventListener('click', function () {
            userForm.style.display = "block";
            personalData(doctor_id, selectedDate, selectedHour);
        })


    }catch(error){
        console.error("Błąd pobierania danych:", error.message);
    }

}