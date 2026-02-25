import express from 'express';
import bodyParser from 'body-parser';
import { promises as fs } from 'fs';
import { people } from './people.js';

let app = express();

app.use(bodyParser.json());

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/people', (req, res) => {
    res.json(people);
});

app.get('/people/:name', (req, res) => {
    let name = req.params.name;
    let person = people.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (person) {
        res.json(person);
    } else {
        res.status(404).send("Person not found");
    }
});

// Endpoint to read data from a file and return it as JSON
app.get('/file-data', async (req, res) => {
    try {
        let data = await fs.readFile(__dirname + '/people-data.json');
        let peopleData = JSON.parse(data);
        res.json(peopleData);
    } catch (err) {
        res.status(500).send("Error reading file");
    }
});

app.post('/people', (req, res) => {
    let newPerson = req.body;
    people.push(newPerson);
    res.status(201).json(newPerson);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});