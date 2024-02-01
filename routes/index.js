const express = require('express');
const sseManager = require('../sseManager');
const router = express.Router();

/* GET log page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Logwatch', body: '/log' });
});

router.get('/log', (req, res, next) => {
  res.render('index', { title: 'Logwatch', body: '/log' });
});

/* GET updates of the `logFile` monitored */
router.get('/log-stream', sseManager);

module.exports = router;
