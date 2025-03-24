export function LoadFooter() : Promise<void> {
    return fetch("views/components/footer.html")

        .then((response: Response) => {
            if(!response.ok) {
                throw new Error(`Http error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then((html: string)=> {
            const footerElement = document.querySelector("footer");
            if(footerElement){
                footerElement.innerHTML = html;
            }else{
                console.warn("[WARNING] No <footer> element found in DOM");
            }
        })
        .catch((error: Error) => console.error("[ERROR] Failed to load footer:", error));
}