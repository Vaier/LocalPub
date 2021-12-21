let Waiter = require('../models/waiter');
let Table = require('../models/table');

const async = require('async');

exports.index = function(req, res) {

    async.parallel({
        waiter_count: function(callback) {
            Waiter.countDocuments({}, callback);
        },
        table_count: function(callback) {
            Table.countDocuments({}, callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Local Pub Home', error: err, data: results });
    });
};

exports.waiter_list = function(req, res, next) {

    Waiter.find({})
        .exec(function (err, list_waiters) {
            if (err) { return next(err); }
            res.render('waiter_list', { title: 'Waiter List', waiter_list: list_waiters});
        });
};
