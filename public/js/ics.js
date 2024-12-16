const downloadICSButtons = document.getElementsByClassName("downloadICS");
const icsError = document.getElementById("icsError");

Array.from(downloadICSButtons).forEach((button) => {
    button.addEventListener("click", async (event) => {
        event.preventDefault();

        const container = button.closest(".event");
        const icsError = container.querySelector(".icsError");
        icsError.innerHTML = "";
    
        let buttonValue = button.value;
    
        try {
            buttonValue = validateString(buttonValue, "Button Value");
            if (!buttonValue.includes("|||")) { throw "Invalid button value" }
            if (buttonValue.split("|||").length !== 2) { throw "Invalid button value" }
        } catch (e) {
            icsError.innerHTML = e;
            return;
        }
    
        let eventId = buttonValue.split("|||")[0].trim();
        let startDate = buttonValue.split("|||")[1].trim();
    
        try {
            eventId = validateStringId(eventId, "Event ID");
            startDate = validateISODateString(startDate, "Start Date");
        } catch (e) {
            icsError.innerHTML = e;
            return;
        }
    
        try {
            const icsFile = await fetchFrom(`/location/events/ics/${eventId}/${startDate}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ eventId, startDate })
            });
    
            // Based on: https://linuxhaxor.net/code/download-file-using-javascript.html
            const blob = new Blob([icsFile], { type: 'text/calendar' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${eventId}-${startDate}.ics`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
        } catch (e) {
            icsError.innerHTML = e;
        }
    });
});