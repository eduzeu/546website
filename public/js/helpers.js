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

const validateDate = (date, dateName) => {
    if (Object.prototype.toString.call(date) !== "[object Date]")
        throw `${dateName || "Provided data"} is not a date.`

    if (isNaN(date))
        throw `${dateName || "Provided data"} is an invalid date.`

    return date;
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

    const dateObj = new Date(dateStr);
    validateDate(dateObj, dateName);

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

const validateCloudinaryUrl = (url, urlName) => {
    url = validateString(url, urlName);

    let path = /^http:\/\/res\.cloudinary\.com\/dcvqjizwy\/image\/upload\/v[0-9]+\/[a-z0-9]+/m
    if (!path.test(url)) {
        throw `${urlName || "Provided string"} is not a valid image url.`
    }

    let fileExt = /\.(jpg|jpeg|png|gif|webp|bmp|heic)$/mi
    if (!fileExt.test(url)) {
        throw `${urlName || "Provided string"} is not a valid image url.`
    }

    return url;
}

const validateLocationType = (locType, typeName) => {
    locType = validateString(locType, typeName);

    if (locType !== "wifi" && locType !== "coffee" && locType !== "event") {
        throw "Review type is invalid."
    }

    return locType
}

const validateObject = (obj, objName) => {
    if (!obj)
      throw `${objName || "Provided data"} was not supplied.`
  
    if (typeof obj !== "object")
      throw `${objName || "Provided data"} is not an object.`
  
    if (Array.isArray(obj))
      throw `${objName || "Provided object"} is an array.`
  
    if (Object.keys(obj).length === 0)
      throw `${objName || "Provided object"} is empty.`
  }

const validateLocationPostDetails = (details, detailName) => {
  validateObject(details, detailName);

  if (!details.type || !details.id || !details.name)
    throw `${detailName || "Provided object"} is missing id, type, or name.`

  details.id = validateNumericId(details.id, `${detailName || "Provided Location Info"}  Id`);
  details.type = validateLocationType(details.type, `${detailName || "Provided Location Info"} Type`);
  details.name = validateString(details.name, `${detailName || "Provided Location Info"} Name`);

  if (details.detail) {
    details.detail = validateString(details.detail, `${detailName || "Provided Location Info"} Details`)
  } else {
    details["detail"] = null;
  }

  return details;
}