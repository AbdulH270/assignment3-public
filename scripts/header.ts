"use strict";
export async function LoadHeader() {
    console.log("[INFO] LoadHeader() is called.");

    return fetch("./views/components/header.html")
        .then(response => response.text())
        .then(data => {
            const headerElement = document.querySelector("header");
            if(headerElement) {
                headerElement.innerHTML = data;
            } else {
                console.error("[ERROR] Failed to locate header in the DOM.");
            }
        })
        .catch(error => console.log("[ERROR] Unable to load header", error));

}

export function updateActiveNavLink() {
    console.log("[INFO] updateActiveNavLink() is called.");

    const currentPath = location.hash.slice(1) || "/"
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {

        // Remove Hash Symbol
        const linkPath = link.getAttribute("href")?.replace("#", "");

        if(currentPath === linkPath) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

export function handleLogout(event:Event) {
    event.preventDefault();
    sessionStorage.removeItem("user");
    console.log("[INFO] User logged out. Updating UI...");

    LoadHeader().then( () => {
        location.hash = "/";
    });

}