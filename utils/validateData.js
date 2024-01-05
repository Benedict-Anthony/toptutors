const Validator = require("validatorjs");

async function validateData(body, rules, customMessage) {
    //Sample data/format
    
//   const body = { name: "promise", agfe: 7, emafil: "", veriffied: "" };
//   const rules = {
//     name: "required|string",
//     age: "required",
//     email: "required|email",
//     verified: "boolean",
//   };
//   const messages = {
//     required: ":attribute is required",
//     email: "Please provide a valid :attribute",
//     boolean: ":attribute must be a boolean value",
//     number: ":attribute must be a number",
//   };

  const validation = new Validator(body, rules, customMessage);
  try {
    if (validation.fails()) {
      const errors = validation.errors.errors;
      let error = "";
      for (let err in errors) {
        error = `${err}: ${errors[err][0]}`;
        break;
      }
      return error;
    }
  } catch (error) {
    console.log(error, "the error");
  }
}

module.exports = validateData;
