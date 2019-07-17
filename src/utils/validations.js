export const validations = {
  email : function (email) {
    let regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return regex.test(email);
  },
  required : function (value) {
    return value.trim().length > 0;
  },
  minLength: function (length, value) {
    return value.trim().length >= length ;
  },
  maxLength: function (length, value) {
    return value.trim().length <= length ;
  }
};