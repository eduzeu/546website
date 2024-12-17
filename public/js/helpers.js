const fetchFrom = async (url, options) => {
    const response = await fetch(url, options);

    if (response.ok) {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            const json = await response.json();
            return json;

        } else {
            const text = await response.text();
            return text;
        }

    } else {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            const json = await response.json();
            throw `${response.statusText}: ${json["error"]}`;

        } else {
            const errorMsg = await response.text();
            throw `${response.statusText}: ${errorMsg}`;
        }
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

const validatePassword = (password, passwordName) => {
  password = validateString(password, passwordName);

  if (password.length < 8) {
    throw "Password must be at least 8 characters long."
  }

  const lowerRegex = /[a-z]+/g;
  if (!lowerRegex.test(password)) {
    throw "Password must contain at least one lowercase letter."
  }

  const upperRegex = /[A-Z]+/g;
  if (!upperRegex.test(password)) {
    throw "Password must contain at least one uppercase letter."
  }

  const symbolRegex = /[^A-Za-z0-9]+/g;
  if (!symbolRegex.test(password)) {
    throw "Password must contain at least one symbol."
  }

  return password;
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

const validateISODateString = (dateStr, dateName) => {
  dateStr = validateString(dateStr, dateName);

  // Regex based on: https://stackoverflow.com/a/3143231
  const isoRegex = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{3}$/;
  if (!isoRegex.test(dateStr))
    throw `${dateName || "Provided string"} is not an ISO date string.`

  const split = dateStr.split(/\D+/);
  if (split.length !== 7)
    throw `${dateName || "Provided string"} is not in the proper ISO format: YYYY-MM-DDThh:mm:ss.MMM.`

  const zonedDate = `${dateStr}-05:00`;
  if ((new Date(zonedDate)) === "Invalid Date")
    throw `${dateName || "Provided string"} is not a valid date.`

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

const validateStringId = (id, idName) => {
  id = validateString(id, idName);

  const numericId = Number(id);
  validateNumber(numericId, idName);

  return id;
}

const validateObjectId = (id, idName) => {
    id = validateString(id, idName);

    const objectIdRegex = /^[a-f\d]{24}$/i;
    if (!objectIdRegex.test(id))
      throw `${idName || "Provided string"} is not a valid ObjectId.`

    return id;
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
