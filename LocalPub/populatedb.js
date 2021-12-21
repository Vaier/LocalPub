#! /usr/bin/env node

// Get arguments passed on command line
let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

let async = require('async');
let Waiter = require('./models/waiter');
let Table = require('./models/table');
let Customer = require('./models/customer');
let TimeTable = require('./models/time_table');


let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// let testWaiter = {

// }
// let testTable = {
//     _id: '61aa53be626abe7ad7d31181',
//     number: 3,
//     capacity: 2,
//     waiter: { type: Schema.Types.ObjectId, ref: 'Waiter', required: true },
//     location: { type: String },
// }
let waiters = [];
let customers = [];
let tables = [];
let time_tables = [];

function waiterCreate(first_name, last_name, date_of_birth, cb) {
    let waiter_detail = { first_name: first_name, last_name: last_name }
    if (date_of_birth !== false) waiter_detail.date_of_birth = date_of_birth;
    if (date_of_birth !== false) waiter_detail.date_of_death = date_of_birth;

    let waiter = new Waiter(waiter_detail);
    waiter.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Waiter: ' + waiter);
        waiters.push(waiter)
        cb(null, waiter)
    });
}

function customerCreate(first_name, last_name, cb) {
    let waiter_detail = { first_name: first_name, last_name: last_name }

    let customer = new Customer(waiter_detail);
    customer.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Waiter: ' + customer);
        customers.push(customer)
        cb(null, customer)
    });
}

function tableCreate(number, capacity, waiter, location, cb) {
    let table_detail = {
        number: number,
        capacity: capacity,
        waiter: waiter,
        location: location
    }

    let table = new Table(table_detail);
    table.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New table: ' + table);
        tables.push(table);
        cb(null, table);
    });
}

function timetableCreate(table, customer, reservation_date_from, reservation_date_to, cb) {
    let timetable_detail = {
        table: table,
        customer: customer,
        reservation_date_from: reservation_date_from,
        reservation_date_to: reservation_date_to,
    }

    let timetable = new TimeTable(timetable_detail);
    timetable.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New timetable: ' + timetable);
        time_tables.push(timetable);
        cb(null, timetable);
    });
}

function createWaiters(cb) {
    async.series([
            function(callback) {
                waiterCreate('George', 'Black', '1994-06-21', callback);
            },
            function(callback) {
                waiterCreate('Steven', 'Marbles', '1999-02-25', callback);
            },
            function(callback) {
                waiterCreate('Mia', 'Ranch', '1997-09-19', callback);
            },
            function(callback) {
                waiterCreate('Bethony', 'Miller', '1995-03-13', callback);
            },
        ],
        // optional callback
        cb
    );
}

function createCustomers(cb) {
    async.series([
            function(callback) {
                customerCreate('Client', 'First', callback);
            },
        ],
        // optional callback
        cb
    );
}

function createTables(cb) {
    async.parallel([
            function(callback) {
                tableCreate(1, 4, waiters[0], "Near the window", callback);
            },
            function(callback) {
                tableCreate(2, 6, waiters[1], "In the center of the hall", callback);
            },
            function(callback) {
                tableCreate(3, 2, waiters[2], "Next to the bar", callback);
            },
            function(callback) {
                tableCreate(4, 4, waiters[3], "In the corner of the hall", callback);
            }
        ],
        // optional callback
        cb);
}

function createTimeTables(cb) {
    async.parallel([
            function(callback) {
                timetableCreate(tables[0], customers[0], '2021-12-10T16:00:00', '2021-12-10T20:00:00', callback)
            },
        ],
        // optional callback
        cb);
}

async.series([
    createCustomers,
    createWaiters,
    createTables,
    createTimeTables
], function cb(err, results) {
    if (err) {
        console.log('FINAL ERR: ' + err);
    } else {
        console.log('It works!');
    }
    // All done, disconnect from database
    mongoose.connection.close();
});