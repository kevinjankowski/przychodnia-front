// Importy
import {apiQuery} from './apiQuery.js';

// Zmienne
const leftSide = document.getElementById('left-side');
let hours = [];
let busyHours = [];
let selectedDate = null;

// Funkcje

/*  Funckja getAllHours zwraca wszystkie godziny, w których mogą odbyć się wizyty*/
function getAllHours(){

    // Zmienne potrzebne funckji apiQuery
    const endpoint = "hours"

    return apiQuery(endpoint)
        .then(result => {
            result.forEach(item => {
                hours.push(item.hour);
            })
        })
        .catch((error) => {});
}

/*  Funkcja getBusyHours zwraca wszystkie godziny, w których ktoś w określonym dniu zarezerwował wizytę u danego lekarza.
*   Takich rekordów może być więcej niż jeden. Rekordy są dodawane po kolei do tablicy busyHours */
function getBusyHours(doctor_id, visit_date){

    // Zmienne potrzebne funckji apiQuery
    const endpoint = "busyAppointments";
    const params = {doctorId: doctor_id, date: visit_date};

    return apiQuery(endpoint, params)
        .then(result => {
            result.forEach(item => {
                busyHours.push(item.hour);
            })
        })
        .catch((error) => {});
}

/* Poniższa funkcja tworzy element typu input date, który pozwala wybrać datę począwszy od dzisiaj */
function createDatePicker(doc_first_name, doc_last_name) {
    return new Promise((resolve, reject) => {
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

        // Dodanie elementu do kontenera
        container.appendChild(pickDateText);
        container.appendChild(datePicker);
        container.appendChild(pickButton);

        // Dodanie kontenera do dokumentu
        leftSide.appendChild(container);

        // Obsługa kliknięcia przycisku
        pickButton.addEventListener('click', function () {
            const selectedDate = datePicker.value;

            if (selectedDate) {
                resolve(selectedDate); // Rozwiązanie obietnicy z wybraną datą
            } else {
                // Jeśli nie wybrano daty, wysyłana jest dzisiejsza
                resolve(new Date().toISOString().split('T')[0])
            }
        });
    });
}

export async function loadCalendar(doctor_id, doc_first_name, doc_last_name) {

    try{
        // Tworzenie kalendarza i pobranie daty od użytkownika
        selectedDate = await createDatePicker(doc_first_name, doc_last_name);

        // Pobranie wszystkich godzin z bazy danych
        await getAllHours()

        // Pobranie zajętych godzin w podanej dacie
        await getBusyHours(doctor_id, selectedDate);

    }catch(error){
        console.error("Błąd pobierania danych:", error.message);
    }
}