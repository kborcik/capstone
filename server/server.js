require('dotenv').config()
const express = require("express");
const cors = require("cors");
const path = require('path')

const app = express();


app.use(cors());
app.use(express.static('public'))
app.use(express.json());

const { submitQuestionFunction,
        deleteJournalEntry,
        getJournal,
        testDadChat,
        saveAs,
        displayJournalEntry,
        clearChat } = require('./controller')
 
app.get('/', (req,res) => {
    res.status(200).sendFile(path.join(__dirname, '../public/draft2.html'))
})

app.delete('/api/journal/:index', deleteJournalEntry);
app.get('/api/journal/', getJournal);
app.get('/api/journal/:index', displayJournalEntry);

app.post('/testDadChat', testDadChat);
app.post('/saveJournal', saveAs);

app.get('/clear', clearChat);


app.listen(4000, () => console.log("Server running on 4000"));