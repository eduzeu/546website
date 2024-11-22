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
}

export const validateNumericId = (id, idName) => {
  const strId = validateString(id, idName);

  const numericId = Number(strId);
  validateNumber(numericId, idName);

  return numericId;
}