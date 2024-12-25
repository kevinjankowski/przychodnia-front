// Importy
import { apiQuery } from './apiQuery.js';

// Zmienne
const specializationsList = document.getElementById("specializations-list");
const endpoint = "specs";

// Funkcje

/*  Funkcja loadSpecializations dodaje do listy typu <select>
*   podaną w parametrze nazwę specjalizacji pobraną z bazy danych */
function loadSpecializations(listContainer, specialization) {
    const listItem = document.createElement("option");
    listItem.setAttribute("value", specialization.name);
    listItem.textContent = specialization.name;
    listContainer.appendChild(listItem);
}

// Wyołanie funkcji

/*  Poniższy fragment wywołuje zaimportowaną funkcję apiQuery,
*   która pobiera z bazy danych listę wszystkich specjalizacji */
apiQuery(endpoint)
    .then((data) => {
        data.forEach((item) => {
            // Wywołanie funkcji, który dodaje nazwę specjalizacji (item) do rozwijanej lity typu <select>
            loadSpecializations(specializationsList, item);
        })
    })
    .catch((error) => {
        console.error("Błąd podczas pobierania specjalizacji:", error.message);
    });