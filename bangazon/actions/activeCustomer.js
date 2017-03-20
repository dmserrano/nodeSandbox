'use strict';

const { DB, errHandler } = require('../db.js');
const prompt = require('prompt');


const showActiveCustomers = () => {
  let resultArray;
  // Query the database for all customers
  DB.all(`select customerId, name from customers`, (err, results) => {
    errHandler(err);
    resultArray = results;

    // If no user has been created
    if (results.length < 1) {
      console.log(`\nPlease create a customer first.\n`);
      return setTimeout(require('./menuOptions.js').startMenu, 1500);
    };

    // If there are user(s) log each out to the console
    console.log('\nWhich customer will be active?\n');
    results.forEach(({customerId, name}) => {
      console.log(`${customerId}. ${name}`);
    });
    // Console.log for sinlge line space
    console.log('');

  })
  // Will run after the DB.all block, will only open prompt if users present
  .run(``, () => (resultArray.length > 0) ? setActiveUser(): false);
};


// Creates the prompt to capture the active listener
const setActiveUser = () => {
  // Capture input from user and query the db to get the user
  prompt.get('$', (err, { $ }) => {

    // If the user input is not a number, execute showActiveCustomers again
    if (isNaN($)) {
      console.log('\nPlease enter an number.\n');
      return setTimeout(showActiveCustomers, 1500);
    };

    // Search for a specific user with user input
    DB.all(`select name from customers where customerId = ${parseInt($)}`, (err, results) => {
      errHandler(err);

      // If no results return, no such user exists. Display users
      if (results.length < 1) {
        console.log('\nNo such user exists. Please select another.\n');
        return setTimeout(showActiveCustomers, 1500);
      };

      // Store the current user on the process.env obj
      let [{name}] = results;
      process.env.CURRENT_USER = name;
      process.env.CURRENT_USER_ID = $;
      console.log("process.env.CURRENT_USER_ID", process.env.CURRENT_USER_ID);
      // Require in startMenu method here to avoid circular dep
      setTimeout(require('./menuOptions.js').startMenu, 1500);
    });
  });
};

module.exports = { showActiveCustomers };
