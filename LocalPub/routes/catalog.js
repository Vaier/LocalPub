let express = require('express');
let router = express.Router();

// Require controller modules.
let waiter_controller = require('../controllers/waiterController');
let timeTableController = require('../controllers/timetableController');
let tableController = require('../controllers/tableController');

router.get('/', waiter_controller.index);
router.get('/waiter', waiter_controller.waiter_list);

router.get('/table', tableController.table_list);

router.get('/time_table', timeTableController.time_table_list);
router.post('/time_table', timeTableController.time_table_reserve)

module.exports = router;