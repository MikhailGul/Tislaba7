const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

// GET /api/list – получить все задачи из отдельного файла users.json
app.get('/api/list', (req, res) => {
  fs.readFile('./users.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    const tasks = JSON.parse(data);
    res.json(tasks);
  });
});

// POST /api/list/ - добавить новую задачу в отдельный файл users.json с ее названием, id и маркером выполнена/невыполнена
app.post('/api/list', (req, res) => {
  fs.readFile('./users.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    const tasks = JSON.parse(data);
    const newTask = {
      id: tasks.length + 1,
      title: req.body.title,
      completed: false
    };
    tasks.push(newTask);
    fs.writeFile('./users.json', JSON.stringify(tasks), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      res.status(201).json(newTask);
    });
  });
});

// PUT\UPDATE /api/list/:id – изменить конкретную задачу в файле users.json
// Данные передаём через body (тело запросов)
app.put('/api/list/:id', (req, res) => {
  fs.readFile('./users.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    const tasks = JSON.parse(data);
    const taskIndex = tasks.findIndex(task => task.id === +req.params.id);
    if (taskIndex === -1) {
      return res.status(404).send('Task not found');
    }
    tasks[taskIndex].title = req.body.title;
    tasks[taskIndex].completed = req.body.completed;
    fs.writeFile('./users.json', JSON.stringify(tasks), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      res.json(tasks[taskIndex]);
    });
  });
});

// DELETE /api/list/:id – удалить конкретную задачу по id из файла users.json
app.delete('/api/list/:id', (req, res) => {
  fs.readFile('./users.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    const tasks = JSON.parse(data);
    const taskIndex = tasks.findIndex(task => task.id === +req.params.id);
    if (taskIndex === -1) {
      return res.status(404).send('Task not found');
    }
    const deletedTask = tasks.splice(taskIndex, 1);
    fs.writeFile('./users.json', JSON.stringify(tasks), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      res.json(deletedTask[0]);
    });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});