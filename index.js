const express = require('express');
const logger = require('morgan');
const exec = require('child_process').exec;
const app = express();

app.use(express.static('public'));
app.set('view engine', 'pug');

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
  app.use(logger('dev'));
} else if (process.env.NODE_ENV === 'production') {
  app.use(logger('combined'));
}

app.get('/health', (req, res) => {
  res.json({  
    uptime: Math.floor(process.uptime())
  });
});

app.get('/', (req, res) => {
  let defaultVers = exec('node --version', function( err, versout, verserr) {
    if (err !== null) {
      console.log('exec error while retrieving default version: ' + err);
      res.status(500).send('Oops!')
    }
    let child = exec("ls -l /opt/nvm/versions/node | grep '^d' | awk '{ print $9 }'", function (error, stdout, stderr) {
      versout = versout.trim();
      let lines = stdout.toString().split('\n');
      let results = '';
      lines.forEach(function(line) {
        results += `${line == versout ? line + ' <-- default ' : line}` + '\n';
      });
      res.render('index', { title: 'Avaliable nodejs versions', message: results });
      if (error !== null) {
        console.log('exec error while retrieving versions: ' + error);
        res.status(500).send('Oops!')
      }
    });
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
