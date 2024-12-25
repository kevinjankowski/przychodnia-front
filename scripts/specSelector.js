function loadSpecializationsFromDb(){

    // pobranie elementu, który będzie przechowywać listę specializacji
    const listContainer = document.getElementById("specializations-list");

    // Tworzenie nowego obiektu typu XMLHttpRequest
    const xhr = new XMLHttpRequest();

    // Podanie stałej części url, która nie ulegnie zmianie
    const url = "http://127.0.0.1:8000/api"

    // Wywołanie odpowiedniego endpointu
    xhr.open("GET", url + "/specs", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Zamiana pobranych danych na format JSON
            const specializations = JSON.parse(xhr.responseText);

            // Pętla for each, która w zmiennej "specialization" przechowuje pojedyncze rekordy
            specializations.forEach(specialization => {
                const listItem = document.createElement("option");
                listItem.setAttribute("value", specialization.name);
                listItem.textContent = specialization.name;
                listContainer.appendChild(listItem);
            })
        } else {
            console.error("Unable to load specializations from database. Status: " + xhr.status);
        }
    }

    xhr.send();
}

function loadDoctorsFromDb(specializationName) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Podanie stałej części url, która nie ulegnie zmianie
        const url = "http://127.0.0.1:8000/api";

        // Wywołanie odpowiedniego endpointu
        xhr.open("GET", url + "/doctorsBySpec?specialization=" + specializationName, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Zamiana pobranych danych na format JSON
                    try {
                        const doctors = JSON.parse(xhr.responseText);
                        resolve(doctors); // Zwrócenie danych za pomocą resolve
                    } catch (error) {
                        reject(new Error("Błąd parsowania odpowiedzi JSON: " + error.message));
                    }
                } else {
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

function getSpecializationsFromUser(){
    const submitButton = document.getElementById("submit");
    const specializationList = document.getElementById("specializations-list");
    const listOfDoctors  = document.getElementById("list-of-doctors");
    const  listText  = document.getElementById("list-text");

    submitButton.addEventListener("click", async function () {
        try {
            let selectedSpecialization = specializationList.value;
            const doctors = await loadDoctorsFromDb(selectedSpecialization)


            // Wyczyszczenie obecnych już lekarzy
            listOfDoctors.innerHTML = "";

            listText.style.display = "block";


            doctors.forEach(doctor => {
                // Stworzenie "kafelka", w którym będą dane lekarza
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
            })


        } catch (error) {
            console.log("Wystąpił błąd. " + error.message);
        }
    });
}

function getBusyDates(doctor_id){
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Podanie stałej części url, która nie ulegnie zmianie
        const url = "http://127.0.0.1:8000/api";

        // Wywołanie odpowiedniego endpointu
        xhr.open("GET", url + "/busyAppointments?doctorId=" + doctor_id, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Zamiana pobranych danych na format JSON
                    try {
                        const doctors = JSON.parse(xhr.responseText);
                        resolve(doctors); // Zwrócenie danych za pomocą resolve
                    } catch (error) {
                        reject(new Error("Błąd parsowania odpowiedzi JSON: " + error.message));
                    }
                } else {
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



loadSpecializationsFromDb();
getSpecializationsFromUser();