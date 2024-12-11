const fetchFrom = async (url, options) => {
    const response = await fetch(url, options);

    if (response.ok) {
        const json = await response.json();
        return json;

    } else {
        throw `Recieved status ${response.status}: ${response.statusText}`;
    }
}

const validateString = (str, strName) => {
    if (typeof str === "undefined")
        throw `${strName || "Provided parameter"} was not supplied.`;

    if (!str)
        throw `${strName || "Provided parameter"} was not supplied.`;

    if (typeof str !== "string")
        throw `${strName || "Provided data"} is not a string'.`;

    if (str.trim().length === 0)
        throw `${strName || "Provided string"} consists of only spaces.`;

    return str.trim();
}

const validateEmailAddress = (email, emailName) => {
    email = validateString(email, emailName);

    // regex source: https://www.geeksforgeeks.org/javascript-program-to-validate-an-email-address/
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!regex.test(email)) {
        throw `${emailName || "Provided string"} is not a valid email address.`
    }

    return email;
}

const validateDateString = (dateStr, dateName) => {
    dateStr = validateString(dateStr, dateName);

    let components = dateStr.split("-");

    if (components.length !== 3) {
        throw `${dateName || "Provided string"} is not YYYY-MM-DD format.`
    }

    if (components[0].length !== 4 || components[1].length !== 2 || components[2].length !== 2) {
        throw `${dateName || "Provided string"} is not YYYY-MM-DD format.`
    }

    let formattedDate = `${components[0]}/${components[1]}/${components[2]}`

    if (new Date(formattedDate) === "Invalid Date") {
        throw `${dateName || "Provided string"} is not a valid date.`
    }

    return dateStr;
}

const validateNumber = (num, numName) => {
    if (typeof num === "undefined") {
        throw `${numName || "Provided parameter"} was not supplied.`;
    }

    if (typeof num !== "number") {
        throw `${numName || "Provided data"} is not a number.`;
    }

    if (isNaN(num)) {
        throw `${numName || "Provided data"} is not a number.`;
    }

    return num;
}

const validateNumericId = (id, idName) => {
    const strId = validateString(id, idName);

    const numericId = Number(strId);
    validateNumber(numericId, idName);

    return numericId;
}

const validateReviewType = (reviewType, typeName) => {
    reviewType = validateString(reviewType, typeName);

    if (reviewType !== "wifi" && reviewType !== "coffee") {
        throw "Review type is invalid."
    }

    return reviewType
}


const validateReviewsArray = (arr, arrName) => {
    if (!Array.isArray(arr)) {
        throw `${arrName || "Provided parameter"} is not an array`
    }

    for (const item of arr) {
        validateString(item, `${arrName || "Array"} contains a non-string value.`)
    }
}