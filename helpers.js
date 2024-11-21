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