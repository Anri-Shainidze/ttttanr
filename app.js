const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const DATA_FILE = path.join(__dirname, 'data.json');

function readExpenses() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeExpenses(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/', (req, res) => {
  const expenses = readExpenses();
  res.render('index', { expenses });
});

app.post('/add', (req, res) => {
  const expenses = readExpenses();
  const newExpense = {
    id: Date.now().toString(),
    title: req.body.title,
    amount: req.body.amount
  };
  expenses.push(newExpense);
  writeExpenses(expenses);
  res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
  const expenses = readExpenses();
  const updated = expenses.filter(e => e.id !== req.params.id);
  writeExpenses(updated);
  res.redirect('/');
});


app.get('/edit/:id', (req, res) => {
  const expenses = readExpenses();
  const expense = expenses.find(e => e.id === req.params.id);
  if (!expense) return res.status(404).send('ხარჯი არ მოიძებნა');
  res.render('edit', { expense });
});

app.post('/edit/:id', (req, res) => {
  const expenses = readExpenses();
  const index = expenses.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).send('ხარჯი არ მოიძებნა');

  expenses[index].title = req.body.title;
  expenses[index].amount = req.body.amount;
  writeExpenses(expenses);
  res.redirect('/');
});


app.get('/expense/:id', (req, res) => {
  const expenses = readExpenses();
  const expense = expenses.find(e => e.id === req.params.id);
  if (!expense) return res.status(404).send('ხარჯი არ მოიძებნა');
  res.render('expense', { expense });
});
