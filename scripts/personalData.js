// Importy
import { registerVisit } from './registerVisit.js';

// Zmienne
const peselElement = document.getElementById("pesel");
const firstNameElement = document.getElementById("first-name");
const lastNameElement = document.getElementById("last-name");
const noteElement = document.getElementById("note");
const registerButton = document.getElementById("register-button");

// Funkcje

export function personalData(doctor_id, selectedDate, selectedHour){
    registerButton.addEventListener("click", function() {
        let pesel = peselElement.value;
        let first_name = firstNameElement.value;
        let last_name = lastNameElement.value;
        let note = noteElement.value;

        registerVisit(doctor_id, selectedDate, selectedHour, pesel, first_name, last_name, note);

    })
}

// Code created by Kevin Jankowski