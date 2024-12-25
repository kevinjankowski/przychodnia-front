// Importy
import { apiQuery } from './apiQuery.js';

// Zmienne
let hours = []
let busyHours = []

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
}

/*  Funkcja getBusyHours zwraca w formacie JSON daty i godzinami, w których ktoś zarezerwował wizytę u danego lekarza.
*   Takich rekordów może być więcej niż jeden. Rekordy są dodawane po kolei do tablicy busyHours (date, hour) */
function getBusyHours(doctor_id){

    // Zmienne potrzebne funckji apiQuery
    const endpoint = "busyAppointments";
    const params = {doctorId: doctor_id};

    return apiQuery(endpoint, params)
        .then(result => {
            result.forEach(item => {
                busyHours.push(item.date);
            })
        })
}

export async function loadCalendar(doctor_id) {
    try{
        await getAllHours()
        await getBusyHours(doctor_id);
        console.log(busyHours);
    }catch(error){
        console.error("Błąd pobierania danych:", error.message);
    }

}