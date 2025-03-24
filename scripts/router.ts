"use strict";

import {LoadHeader} from "./header.js";

type RouteMap = {[key:string]: string};

export class Router {

    private routes: RouteMap;

    constructor(routes: RouteMap) {
        this.routes = routes;
        this.init();
    }

    // Popstate activates when the user clicks a back or forward button in the browser.
    // This ensures the SPA updates content when the browser history is called or changed.

    init() {

        window.addEventListener("DOMContentLoaded", () => {
            const path = location.hash.slice(1) || "/";
            console.log(`[INFO] Initial Page Load: ${path}`);
            this.loadRoute(location.hash.slice(1));
        })

        window.addEventListener("popstate", () => {
            console.log(`[INFO] Navigating to : ${location.hash.slice(1)}`);
            this.loadRoute(location.hash.slice(1));
        })
    }

    navigate(path:string) {
        location.hash = path;
    }

    loadRoute(path:string) {
        console.log(`[INFO] Loading route: ${path}`);

        const basePath = path.split("#")[0];

        if(!this.routes[basePath]) {
            console.warn(`[WARNING] Route not found: ${basePath}, redirecting to 404.`);
            location.href = "/404";
            path = "/404";
        }

        fetch(this.routes[basePath])
            .then(response => {
                if(!response.ok) throw new Error(`Failed to load ${this.routes[basePath]}.`);
                return response.text();
            })
            .then(html => {
                const mainElement = document.querySelector("main");
                if (mainElement) {
                    mainElement.innerHTML = html;
                } else {
                    console.error("[ERROR] Could not locate <main> element in the DOM.");
                }

                LoadHeader().then(() => {
                    document.dispatchEvent(new CustomEvent("routeLoaded", {detail : basePath}))
                });

            })
            .catch(error =>
                console.error("[ERROR] Error loading page:", error))
    }


}