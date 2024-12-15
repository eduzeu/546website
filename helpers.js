import axios from "axios";
import { fromZonedTime } from "date-fns-tz";
import { parse } from "isoformat";
import { ObjectId } from "mongodb";
import * as uuid from 'uuid';

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

export const validateISODateString = (dateStr, dateName) => {
  dateStr = validateString(dateStr, dateName);

  if (!parse(dateStr))
    throw `${dateName || "Provided string"} is not an ISO date string.`

  const split = dateStr.split(/\D+/);
  if (split.length !== 7)
    throw `${dateName || "Provided string"} is not in the proper ISO format YYYY-MM-DDThh:mm:ss.MMM.`

  return dateStr;
}

export const isoDateToComponents = (date) => {
  date = validateISODateString(date, "Date");

  const utcDate = fromZonedTime(date, "America/New_York")
  const utcString = utcDate.toISOString();

  const split = utcString.split(/\D+/);
  const year = split[0];
  const month = split[1];
  const day = split[2];
  const hour = split[3];
  const minute = split[4];

  return [ year, month, day, hour, minute ];
}

// Based on: https://stackoverflow.com/a/1353711
export const validateDate = (date, dateName) => {
  if (Object.prototype.toString.call(date) !== "[object Date]")
    throw `${dateName || "Provided data"} is not a date.`

  if (isNaN(date))
    throw `${dateName || "Provided data"} is an invalid date.`

  return date;
}

export const validateCloudinaryUrl = (url, urlName) => {
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

export const validateUserCookie = (cookie, cookieName) => {
  validateObject(cookie, cookieName);

  if (!cookie._id || !cookie.username)
    throw `${cookieName || "Provided object"} is missing id or username.`

  if (!ObjectId.isValid(cookie._id))
    throw `${cookieName || "Provided object"} has an invalid id.`

  cookie.username = validateString(cookie.username, "Username");

  return cookie;
}

export const validateCommenter = (commenter, comName) => {
  validateObject(commenter, comName);

  if (!commenter.id || !commenter.username)
    throw `${comName || "Provided object"} is missing id or username.`

  validateObjectIdString(commenter.id, "Commenter Id");
  commenter.username = validateString(commenter.username, "Commenter Username");

  return commenter;
}

const validateParentType = (type, typeName) => {
  type = validateString(type, typeName);

  if (type !== "comment" && type !== "post")
    throw `${typeName || "Provided string"} is not a valid parent type.`

  return type;
}

export const validateParent = (parent, parentName) => {
  validateObject(parent, parentName);

  if (!parent.id || !parent.type)
    throw `${parentName || "Provided object"} is missing id or type.`

  validateObjectIdString(parent.id, `${parentName || "Provided Parent's"} Id`);
  parent.type = validateParentType(parent.type, `${parentName || "Provided Parent's"} Type`);

  return parent;
}

export const validateUUID = (id, idName) => {
  id = validateString(id, idName);

  if (!uuid.validate(id))
    throw `${idName || "Provided data"} is not a valid UUID.`

  return id;
}

export const validateObjectId = (id, idName) => {
  if (!ObjectId.isValid(id))
    throw `${idName || "Provided data"} is not a valid ObjectId.`
}

export const validateObjectIdString = (id, idName) => {
  id = validateString(id, idName);

  if (!ObjectId.isValid(id))
    throw `${idName || "Provided data"} is not a valid ObjectId.`

  return id;
}

const validateArray = (arr, arrName) => {
  if (!arr)
    throw `${arrName || "Provided data"} was not supplied.`

  if (typeof arr !== "object")
    throw `${arrName || "Provided data"} is not an object.`

  if (!Array.isArray(arr))
    throw `${arrName || "Provided object"} is not an array.`
}

export const validateObjectIdArray = (arr, arrName) => {
  validateArray(arr, arrName);

  for (let i = 0; i < arr.length; i++) {
    arr[i] = validateObjectIdString(arr[i], `${arrName || "Array"} contains a non-Object Id value.`)
  }

  return arr;
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