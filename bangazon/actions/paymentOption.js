'use strict';

const { DB, errHandler } = require('../db.js');
const prompt = require('prompt');


// Defining schema for payment prompt
let list = [
  { name: 'paymentType', required: true,
    message: 'Please enter a payment type',
    description: 'Enter payment type (e.g. AmEx, Visa, Checking)'
  },
  {
    name: 'accountNumber', required: true,
    message: 'Please enter an account number',
    description: 'Enter account number'
  }
];


// Prompt user for payment info
const getPaymentOptions = () => {
  // Determine if there is an active user
  let user = process.env.CURRENT_USER;
  if (!user) {
    console.log(`\nPlease create or choose a customer.`);
    return setTimeout(require('./menuOptions.js').startMenu, 1500);
  };

  // If active user, begin prompt
  console.log(`\nPlease enter the following information.\n`);
  prompt.get(list, (err, resultObj) => {
    setPaymentOptions(resultObj);
  });
};


// Get customerId and insert paymentOptions
const setPaymentOptions = ({ paymentType, accountNumber }) => {
  // Query the database for the active customers customerId
  let user = process.env.CURRENT_USER;
  DB.get(`select customerId from customers where name = "${user}"`, (err, { customerId }) => {
    errHandler(err);
    // Insert paymentOption info into DB
    DB.run(`insert into paymentOptions values
      (null, ${customerId}, "${paymentType.toUpperCase()}", "${accountNumber}")`, errHandler);

    console.log(`\nA ${paymentType} Payment Option has been saved to your accout.\n`);
    // Navigate to startMenu
    setTimeout(require('./menuOptions.js').startMenu, 2000);
  });
};


module.exports = { getPaymentOptions };
