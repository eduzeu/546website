import axios from "axios";

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

export const fetch = async (url) => {
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

export const stringChecker = (str) => {
  if(typeof str != 'string'){
    throw 'Not a string';
  }
  str = str.trim();
  if(str.length < 1){
    throw 'String is empty';
  }
  return str;
};