require('dotenv').config()

const {CONNECTION_STRING} = process.env

const Sequelize = require('sequelize')
const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
  } )

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


let entries = []

module.exports = {
    submitQuestionFunction: (req,res) => {
        const {input} = req.params
        console.log(req.params)
        sequelize.query(
            `SELECT *
            FROM dadResponses
            WHERE responseid = ${input}`
        ).then(dbRes=>{
             res.status(200).send(dbRes[0])
       }).catch(err =>console.log(err))

    },
    deleteJournalEntry: (req,res) => {
        let { index } = req.params
        entries.splice(+index,1)
        res.status(200).send(entries)
        
    },
    getJournal: (req,res) => {
        sequelize.query(`
        SELECT *
        FROM dadJournal;`
        ).then(dbRes => {
            console.log(dbRes)
            res.status(200).send(dbRes[0])
        }).catch(err => console.log(err))
    },
    getQueries: (req,res) => {
        sequelize.query(`
        SELECT *
        FROM dadQuestions;`
        ).then(dbRes =>{
            console.log(dbRes)
            res.status(200).send(dbRes[0])
        }).catch(err=> console.log(err))

    },
    testDadChat: async(req,res) => {
        let { question } = req.body
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: question }],
          });

          let dadVoice = completion.data.choices[0].message.content
          console.log(completion.data.choices[0].message);

          res.status(200).send(dadVoice)
    },
    saveAs: (req,res) => {
        let {title, dadresponse} = req.body

        title = sequelizeSyntax(title)
        dadresponse = sequelizeSyntax(dadresponse)

        sequelize.query (`
        INSERT INTO dadJournal (question, dadChatResponse)
            VALUES ('${title}','${dadresponse}');
        `).then(()=>{
            res.status(200).send(title)
        }).catch(err => console.log(err))


    }
}


const sequelizeSyntax = (string) => {
    
    const step1 = string.replace(/\'/g, '"');
    return step1
  }