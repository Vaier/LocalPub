let Table = require('../models/table');

exports.table_list = function(req, res, next)
{
    Table.find({})
        .sort({number : 1})
        .populate('waiter')
        .exec(function (err, list_tables) {
            if (err) { return next(err); }
            res.render('table_list', { title: 'Table List', table_list: list_tables});
        });
};