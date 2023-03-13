require('dotenv').config()
const express = require("express");
const cors = require("cors");
const path = require('path')

const app = express();


app.use(cors());
app.use(express.static('public'))
app.use(express.json());

const { submitQuestionFunction,
        getQueries,
        deleteJournalEntry,
        getJournal,
        testDadChat,
        saveAs } = require('./controller')
 
app.get('/', (req,res) => {
    res.status(200).sendFile(path.join(__dirname, '../public/draft2.html'))
})
app.get('/questions',getQueries)
app.get("/api/submission/:input",submitQuestionFunction);
app.delete('/:index', deleteJournalEntry);
app.get('/api/submission/',getJournal);

app.post('/testDadChat', testDadChat);
app.post('/saveJournal', saveAs);



app.listen(4000, () => console.log("Server running on 4000"));