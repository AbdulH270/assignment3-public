"use strict";

import * as bootstrap from 'bootstrap';

class Contact {
    private _fullName: string;
    private _emailAddress: string;
    private _subject: string;
    private _message: string;

    constructor(fullName: string = "", emailAddress: string = "", subject: string = "", message: string = "") {
        this._fullName = fullName;
        this._emailAddress = emailAddress;
        this._subject = subject;
        this._message = message;
    }

    get fullName(): string {
        return this._fullName;
    }

    set fullName(fullName: string) {
        if (!fullName.trim()) {
            throw new Error("Invalid fullName: must be a non-empty string");
        }
        this._fullName = fullName;
    }

    get emailAddress(): string {
        return this._emailAddress;
    }

    set emailAddress(emailAddress: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailAddress)) {
            throw new Error("Invalid emailAddress: must be in proper email format");
        }
        this._emailAddress = emailAddress;
    }

    get subject(): string {
        return this._subject;
    }

    set subject(subject: string) {
        if (!subject.trim()) {
            throw new Error("Invalid subject: must be a non-empty string");
        }
        this._subject = subject;
    }

    get message(): string {
        return this._message;
    }

    set message(message: string) {
        if (!message.trim()) {
            throw new Error("Invalid message: must be a non-empty string");
        }
        this._message = message;
    }

    toString(): string {
        return `Full Name: ${this._fullName}\nEmail Address: ${this._emailAddress}\nSubject: ${this._subject}\nMessage: ${this._message}`;
    }

    serialize(): string | null {
        if (!this._fullName || !this._emailAddress || !this._subject || !this._message) {
            console.error("One or more of the contact properties are missing or invalid");
            return null;
        }
        return `${this._fullName},${this._emailAddress},${this._subject},${this._message}`;
    }

    deserialize(data: string): void {
        const propArray = data.split(",");
        if (propArray.length !== 4) {
            console.error("Invalid data format for deserialization");
            return;
        }
        [this._fullName, this._emailAddress, this._subject, this._message] = propArray;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const opportunitiesList = document.getElementById("opportunities-list") as HTMLElement;

    fetch("./data/events.json")
        .then((response) => response.json())
        .then((opportunities: { title: string; description: string; start: string; end: string; location: string }[]) => {
            opportunities.forEach((opportunity) => {
                const card = document.createElement("div");
                card.className = "col-md-4 opportunity-card";

                const startDate = new Date(opportunity.start);
                const endDate = new Date(opportunity.end);
                const formattedDate = startDate.toLocaleDateString();
                const formattedStartTime = startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                const formattedEndTime = endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                card.innerHTML = `
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${opportunity.title}</h5>
                            <p class="card-text">${opportunity.description}</p>
                            <p class="card-text"><strong>Date:</strong> ${formattedDate}</p>
                            <p class="card-text"><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
                            <p class="card-text"><strong>Location:</strong> ${opportunity.location}</p>
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#signUpModal" onclick="setOpportunity('${opportunity.title}')">Sign Up</button>
                        </div>
                    </div>
                `;
                opportunitiesList.appendChild(card);
            });
        })
        .catch((error) => console.error("Error fetching opportunities:", error));

    document.getElementById("signUpForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = (document.getElementById("name") as HTMLInputElement).value;
        const email = (document.getElementById("email") as HTMLInputElement).value;
        const role = (document.getElementById("role") as HTMLInputElement).value;

        if (name && email && role) {
            const confirmationMessage = document.getElementById("confirmationMessage") as HTMLElement;
            confirmationMessage.textContent = "Thank you for signing up!";

            setTimeout(() => {
                confirmationMessage.textContent = "";
                (document.getElementById("signUpForm") as HTMLFormElement).reset();

                const signUpModalElement = document.getElementById("signUpModal");
                if (signUpModalElement) {
                    const signUpModal = bootstrap.Modal.getInstance(signUpModalElement);
                    signUpModal?.hide();
                }
            }, 3000);
        }
    });
});

function setOpportunity(title: string): void {
    const modalLabel = document.getElementById("signUpModalLabel") as HTMLElement;
    modalLabel.textContent = `Sign Up for ${title}`;
}
