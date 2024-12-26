import { apiQueryPOST } from './apiQuery.js';


function addPatient(pesel, first_name, last_name) {
    const endpoint = "patients"

    const data =
        {
            "pesel": pesel.toString(),
            "first_name": first_name.toString(),
            "last_name": last_name.toString()
        };

    apiQueryPOST(endpoint, data)
        .then((result) => {
            console.log(result.message);
        })
        .catch((error) => {
            console.log(error.message);
        })
}


export function registerVisit(doctor_id, selectedDate, selectedHour, patient_id, first_name, last_name, note) {

    const endpoint = "visits"

    const data =
        {
            "patient_id": patient_id.toString(),
            "date": selectedDate.toString(),
            "hour": selectedHour.toString(),
            "doctor_id": doctor_id.toString(),
            "note": note.toString(),
        };

    /*apiQueryPOST(endpoint, data)
        .then(response => {
            // Jeśli wizyta jest utworzona porawnie
            alert(`Wiadomość: ${response.message}`);
        })
        .catch((error) => {
            // Jeśli jest jakiś błąd:
            alert(`Wiadomość: ${error.message}`);

            // Jeśli pacjenta nie ma w bazie danych zostaje automatycznie dodany a wizyta zarejestrowana
        });*/

    addPatient(patient_id, first_name, last_name);

}