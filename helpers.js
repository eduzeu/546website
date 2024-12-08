import axios from "axios";
import date from 'date-and-time';

export const validateString = (str, strName) => {
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

export const validateNumber = (num, numName) => {
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

export const validateEmailAddress = (email, emailName) => {
  email = validateString(email, emailName);
  
  // regex source: https://www.geeksforgeeks.org/javascript-program-to-validate-an-email-address/
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!regex.test(email)) {
      throw `${emailName || "Provided string"} is not a valid email address.`
  }

  return email;
}

export const validateRating = (rating, ratingName) => {
  validateNumber(Number(rating), ratingName);

  if (rating < 1 || rating > 5 || rating % 1 != 0) {
    throw "Rating is invalid."
  }

  return rating;
}

export const validateNumericId = (id, idName) => {
  const strId = validateString(id, idName);

  const numericId = Number(strId);
  validateNumber(numericId, idName);

  return numericId;
}

export const validateReviewType = (reviewType, typeName) => {
  reviewType = validateString(reviewType, typeName);

  if (reviewType !== "wifi" && reviewType !== "coffee") {
    throw "Review type is invalid."
  }

  return reviewType
}

export const validateDateString = (dateStr, dateName) => {
  dateStr = validateString(dateStr, dateName);

  let components = dateTrim.split("/");

  if (components.length !== 3) {
    throw `${dateName || "Provided string"} is not MM/DD/YYYY format.`
  }

  if (components[0].length !== 2 || components[1].length !== 2 || components[2].length !== 4) {
    throw `${dateName || "Provided string"} is not MM/DD/YYYY format.`
  }

  if (!date.isValid(dateTrim, "MM/DD/YYYY")) {
    throw `${dateName || "Provided string"} is not a valid date.`
  }

  return dateStr;
}

export const fetchFrom = async (url) => {
  try {
    let { data } = await axios.get(url);
    return data

  } catch (e) {
    if (e.code === 'ENOTFOUND')
      throw 'Error: Invalid URL';
    else if (e.response)
      throw `Error: ${e.response.status}: ${e.response.statusText}`;
    else
      throw `Error: ${e}`;
  }
}

export const fetchFromOverpass = async (query) => {
  try {
    let { data } = await axios.post("https://overpass-api.de/api/interpreter", query);
    return data

  } catch (e) {
    if (e.code === 'ENOTFOUND')
      throw 'Error: Invalid URL';
    else if (e.response)
      throw `Error: ${e.response.status}: ${e.response.statusText}`;
    else
      throw `Error: ${e}`;
  }
}