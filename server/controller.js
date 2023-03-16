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


let userChat = [
    {"role": "system", "content": "Answer as if you are a nurturing emtionally intelligent father figure, with clear action steps, and include a light endearing nickname."},
    {"role": "user", "content": "Answer as if you are a nurturing emtionally intelligent father figure, with clear action steps, and include a light endearing nickname."},
   
]



module.exports = {

    deleteJournalEntry: (req,res) => {
        let { index }= req.params
        
        sequelize.query(`
        DELETE 
        FROM dadJournal WHERE dadresponseid = ${index};
        `).then(dbRes =>{
            console.log(dbRes[0]);
            res.status(200).send(dbRes[0])
        }).catch(err => console.log(err))
        
    },
    getJournal: (req,res) => {
        sequelize.query(`
        SELECT *
        FROM dadJournal;`
        ).then(dbRes => {
            res.status(200).send(dbRes[0])
        }).catch(err => console.log(err))
    },
    testDadChat: async(req,res) => {
        console.log (req.body)
        
        userChat.push(req.body)

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: userChat,
          });

          let dadVoice = completion.data.choices[0].message.content
          let dadObj = {role: 'assistant', content: dadVoice}
          userChat.push(dadObj)

          console.log(userChat);

          res.status(200).send(dadVoice)
    },
    saveAs: (req,res) => {
        let {title, dadresponse } = req.body

        title = sequelizeSyntax(title)
        dadresponse = sequelizeSyntax(dadresponse)

        let chatGPTContext = JSON.stringify(userChat)

        chatGPTContext = sequelizeChatGPT(chatGPTContext)

        

        sequelize.query (`
        INSERT INTO dadJournal (question, dadChatResponse, chatGPTContext)
            VALUES ('${title}','${dadresponse}', '${chatGPTContext}');
        `).then(()=>{
            res.status(200).send(title + "was saved successfully")
        }).catch(err => console.log(err))
    },
    displayJournalEntry: (req,res) => {
        let {index} = req.params
        console.log(index)
        sequelize.query(`
        SELECT *
        FROM dadJournal
        WHERE dadresponseid = ${index}
        `).then(dbRes =>{
            let cat = dbRes[0][0]
            let {chatgptcontext, dadchatresponse } = cat
            chatgptcontext = unsequelizeChatGPT(chatgptcontext)
            dadchatresponse = unsequelizeSyntax(dadchatresponse)         
            cat.dadchatresponse = dadchatresponse
            cat.chatgptcontext = chatgptcontext
            console.log('cat', cat)
            res.status(200).send(cat)
            console.log(cat)
            userChat = JSON.parse(cat.chatgptcontext)
            
            console.log("!!!!!!!!!!!!!!!!" , userChat)
        }).catch(err => console.log(err))
    },
    clearChat: (req,res) => {
        userChat = [
            {"role": "system", "content": "Answer as if you are a nurturing emtionally intelligent father figure, with clear action steps, and include a light endearing nickname."},
            {"role": "user", "content": "Answer as if you are a nurturing emtionally intelligent father figure, with clear action steps, and include a light endearing nickname."},
           
        ]

        console.log(userChat);
    }
}


const sequelizeSyntax = (string) => {
    
    const step1 = string.replace(/\'/g, '??');
    return step1
  }

  const unsequelizeSyntax = (string) => {
    const step1 = string.replaceAll('??', "'")
    return step1
  }

  const sequelizeChatGPT = (string) => {
    const step1 = string.replace(/\[/g, "|")
    const step2 = step1.replace(/\]/g, "/ ")
    const step3 = step2.replace(/\{/g, "+")
    const step4 = step3.replace(/\}/g, "^")
    const step5 = step4.replace(/\:/g, "???")
    const step6 = step5.replaceAll("'", "??")

    return step6
  }

  const unsequelizeChatGPT = (string) => {
    const step1 = string.replace(/\|/g, "[")
    const step2 = step1.replace(/\//g, "]")
    const step3 = step2.replace(/\+/g, "{")
    const step4 = step3.replace(/\^/g, "}")
    const step5 = step4.replaceAll('???',":")
    const step6 = step5.replaceAll('??',"'")

    return step6
  }