/*  Funckja apiQueryGET służy do pobierania danych z bazy poprzez endpointy obsługiwane wewnątrz API
*
*   Funkcja przyjmuje dwa argumenty:
*   1. Nazwa endpointu (np.: busyAppointments)
*   2. Parametry w formacie JSON (np.: doctorId: 123)
*
*   Ostatecznie funckja będzie wyglądać następująco:
*   apiQuery("doctorsBySpec", { specialization: "Kardiolog })
*
*   ! Jeśli jakiś endpoint (np. doctors) nie ma paremtrów, nie trzeba ich podawać !
*
*   Funkcja może zostać zaimportowana do innych plików. Aby to zrobić należy skopiować i wkleić do pliku poniższy
*   fragnent kodu:
*
*   import { apiQueryGET } from './apiQuery.js';
*/

export function apiQueryGET(endpoint, params = {}) {
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
                    reject(JSON.parse(xhr.responseText));
                }
            }
        };

        xhr.onerror = function () {
            reject(new Error("Błąd sieci podczas ładowania danych."));
        };

        xhr.send();
    });
}


/*  Funckja apiQueryPOST służy do wysyłania danych do bazy poprzez endpointy obsługiwane wewnątrz API
*
*   Funkcja przyjmuje dwa argumenty:
*   1. Nazwa endpointu (np.: visits)
*   2. Dane w formacie JSON
*
*   Ostatecznie funckja będzie wyglądać następująco:
*   apiQuery("visits", {key: value, key: value, ...})
*
*   Funkcja może zostać zaimportowana do innych plików. Aby to zrobić należy skopiować i wkleić do pliku poniższy
*   fragnent kodu:
*
*   import { apiQueryPOST } from './apiQuery.js';
*/

export function apiQueryPOST(endpoint, data = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Podstawowy URL API
        const baseUrl = "http://127.0.0.1:8000/api";
        const fullUrl = `${baseUrl}/${endpoint}`;

        // Wywołanie odpowiedniego endpointu
        xhr.open("POST", fullUrl, true);

        // Ustawienie nagłówka Content-Type dla formatu JSON
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 201) {
                    // Zamiana pobranych danych na format JSON
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response); // Zwrócenie danych za pomocą resolve
                    } catch (error) {
                        reject(new Error("Błąd parsowania odpowiedzi JSON: " + error.message));
                    }
                } else {
                    // Jeśli dane nie zostały załadowane, wyświetlany jest alert z odpowiednią informacją
                    resolve(JSON.parse(xhr.responseText));
                }
            } else {
                reject(JSON.parse(xhr.responseText));
            }
        };

        xhr.onerror = function () {
            reject(new Error("Błąd sieci podczas wysyłania danych."));
        };

        // Przesyłanie danych w formacie JSON
        xhr.send(JSON.stringify(data));
    });
}

// Code created by Kevin Jankowski