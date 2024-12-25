/*  Funckja apiQuery służy do pobierania danych z bazy poprzez endpointy obsługiwane wewnątrz API
*
*   Funkcja przyjmuje dwa argumenty:
*   1. Nazwa endpointu (np.: busyAppointments)
*   2. Parametry (np.: doctorId: 123)
*
*   Ostatecznie funckja będzie wyglądać następująco:
*   apiQuery("doctorsBySpec", { specialization: "Cardiologist" })
*
*   ! Jeśli jakiś endpoint (np. doctors) nie ma paremtrów, nie trzeba ich podawać !
*
*   Funkcja może zostać zaimportowana do innych plików. Aby to zrobić należy skopiować i wkleić do pliku poniższy
*   fragnent kodu:
*
*   import { apiQuery } from './apiQuery.js';
*/

export function apiQuery(endpoint, params = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Podstawowy URL API
        const baseUrl = "http://127.0.0.1:8000/api";

        // Dodanie parametrów do URL, jeśli istnieją
        const queryParams = Object.keys(params).length > 0 ? `?${new URLSearchParams(params)}` : "";
        const fullUrl = `${baseUrl}/${endpoint}${queryParams}`;

        // Wywołanie odpowiedniego endpointu
        xhr.open("GET", fullUrl, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Zamiana pobranych danych na format JSON
                    try {
                        const data = JSON.parse(xhr.responseText);
                        resolve(data); // Zwrócenie danych za pomocą resolve
                    } catch (error) {
                        reject(new Error("Błąd parsowania odpowiedzi JSON: " + error.message));
                    }
                } else {
                    // Jeśli dane nie zostały załadowane, wyświetlany jest alert z odpowiednią informacją
                    alert(JSON.parse(xhr.responseText).message);
                    reject(new Error("Błąd pobierania danych: " + xhr.status));
                }
            }
        };

        xhr.onerror = function () {
            reject(new Error("Błąd sieci podczas ładowania danych."));
        };

        xhr.send();
    });
}
