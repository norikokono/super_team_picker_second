
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const knex = require('./db/client');
const app = express();

app.use( express.static( "public" ) );

app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  methodOverride((req, res) => {
    if (req.body && req.body._method) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use((req, res, next) => {
  res.locals.username = req.cookies.username || '';
  next();
});

app.get('/', (req, res) => {
  res.redirect('/cohorts');
});

app.get('/cohorts/new', (req, res) => {
  res.render('new');
});

app.post('/cohorts/new', (req, res) => {

  const cohort = {
    logo_url: req.body.logo_url,
    name: req.body.name,
    members: req.body.members,
  };
  knex('cohorts')
    .insert(cohort, '*')
    .then(() => {
    
      res.redirect('/cohorts'); 
    });
});


app.get('/cohorts/:id', (req, res) => {

  knex('cohorts')
    .where('id', req.params.id)
    .first()
    .then((data) => {
      res.render('show', { cohort: data });
    });
});

app.get('/cohorts/:id/edit', (req, res) => {
  knex('cohorts')
    .where('id', req.params.id)
    .first()
    .then((data) => {
      res.render('edit', { cohort: data });
    });
});

app.patch('/cohorts/:id', (req, res) => {
  const cohort = {
    logo_url: req.body.logo_url,
    name: req.body.name,
    members: req.body.members,
  };
  const id = req.params.id

  knex('cohorts')
    .where('id', id)
    .update(cohort)
    .then(() => {
      res.redirect(`/cohorts/${id}`);
    });
});

app.delete('/cohorts/:id', (req, res) => {
  knex('cohorts')
    .where('id', req.params.id)
    .del()
    .then(() => {
      res.redirect('/cohorts');
    });
});

app.get('/cohorts', (req, res) => {

  knex
    .select()
    .table('cohorts')
    .then((whateverYouWant) => {

      res.render('index', {
        cohorts: whateverYouWant,
      });
    });
});

app.post('/cohorts/:id',function(req,res) {
  console.dir(req.query.cohort.members);
  var randomTeamMembers = Math.random();
  res.send('' + randomTeamMembers);
});


const PORT = process.env.PORT || 3000;
const ADDRESS = 'localhost';
const ENVIRONMENT = app.get('env');

app.listen(PORT, ADDRESS, () => {
  console.log(
    `Server is listening on http://${ADDRESS}:${PORT} in ${ENVIRONMENT}.`
  );
});
