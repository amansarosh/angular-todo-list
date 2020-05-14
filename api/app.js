const express = require('express');
const app = express();

const { mongoose } = require('./db/mongoose')

const bodyParser = require('body-parser')

// Load in the mongoose models
const { List, Task } = require('./db/models');


// Load MiddleWear
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* ROUTE HANDLERS */

/* LIST ROUTES */

/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get('/lists', (req, res) => {
    // We want to return an array of all the lists in the database
    List.find({}).then((lists) => {
        res.send(lists);
    });
})

/**
 * POST /list
 * Purpose: Create a list
 */
app.post('/lists', (req, res) => {
    // Want to create a new list and return the new list document back to the user (which includes the id)
    // The list info fields will be passed in via the json req bpfy
    let title = req.body.title;

    let newList = new List({
        title
    });
    newList.save().then((listDoc) => {
        // the full list document is retured
        res.send(listDoc)
    })
});

/**
 * /lists/:id
 * Purpose: Update a specefied list
 */
app.patch('/lists/:id', (req, res) => {
    // Want to update specified list (list document with id in url) with new values specified in the JSON body of the request
    List.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

app.delete('/lists/:id', (req, res) => {
    // Want to delete the specified list
    List.findOneAndRemove({
        _id: req.params.id
    }).then((removedListDoc) => {
        res.send(removedListDoc);
    })
});

/**
 * /lists/:listid/tasks
 * Purpose: To get all tasks in specific lists
 */

app.get('/lists/:listId/tasks', (req, res) => {
    // We want to return all tasks that belong to a specific list (specified by listId)
    Task.find({ _listId: req.params.listId }).then((tasks) => {
        res.send(tasks);
    })
});

/**
 * POST /lists/:listId/tasks
 * Purpose: Create a new task in a specific list
 */
app.post('/lists/:listId/tasks', (req, res) => {
    // We want to create a new task in a list specified by listId
    let newTask = new Task({
        title: req.body.title, _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc)
    })
})

/**
 * PATCH /lists/:listId/tasks/:taskId
 * Purpose: Update an existing task
 */
app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    // We want to update an existing task (specefied by task id)
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId
    }, {
        $set: req.body
    }
    ).then(() => {
        res.send({message: 'Updated Successfully'})
    })
});
/**
 * DELETE /lists/:listId/tasks/:taskId
 */
app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndRemove({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((removedTaskDoc) => {
        res.send(removedTaskDoc)
    })
});


app.listen(3000, () => {
    console.log('Server is listening on port 3000')
})