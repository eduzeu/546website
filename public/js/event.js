const form = document.getElementById("searchform");
const searchCity = document.getElementById("searchByBorough");
const searchDate = document.getElementById("searchByDate");
const error = document.getElementById("error");

if (form) {
    form.addEventListener("submit", async (event) => {
        error.innerHTML = "";

        if (searchCity) {
            let borough = search.value;

            try {
                borough = validateString(borough, "Borough");

            } catch (e) {
                event.preventDefault();
                error.innerHTML = e;
                return;
            }
        }

        if (searchDate) {
            let date = searchDate.value;

            try {
                date = validateDateString(date, "Date");

            } catch (e) {
                event.preventDefault();
                error.innerHTML = e;
                return;
            }
        }
    });
}