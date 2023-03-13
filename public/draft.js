const submitQuestion = document.querySelector("form")
const saveResponse = document.getElementById("saveResponse")
const saveJournal = document.getElementById('saveJournal')
const journal = document.querySelector('ul')
const queryList = document.querySelector('#queryList')
const paragraph = document.querySelector('p')
const testButton = document.querySelector('#test')
const testinput = document.querySelector ('#testInput')




const submitQuestionFunction = (event) => {
    event.preventDefault()

 
    axios.get(`/api/submission/${queryList.value}`)
        .then(response => {
        
            paragraph.innerHTML = response.data[0].response
            console.log(response.data)
            console.log(response.data[0].response)


    })
        .catch(err => console.log(err))

 queryList.value = ""


}

const saveResponseFunction = () => {
    document.getElementById('saveJournal').style.visibility = 'visible'
    saveResponse.style.visibility = 'hidden'

    saveJournal.addEventListener('submit', saveAs)
    
} 


const saveAs = (event) => {
    event.preventDefault()

    const save = paragraph.innerText
    const title = document.getElementById('saveAs').value

    console.log(save)

    if (title === ""){
        alert('You need to insert a title')
    }

    let journalObj = {

        title: title,
        dadresponse: save
    }

    axios.post(`/saveJournal`, journalObj)
    .then(response => {
        console.log(response)
    }).catch(err => console.log(err))
    
}



const getJournal = () => {
    axios.get("/api/submission/")
        .then(response => {
            createJournalList(response.data)
        })
        .catch(err => console.log(err))
}

const createJournalList = array => {
    journal.innerHTML = ""
    array.forEach((response,index) =>{

        let {dadresponseid,
             question,
             dadchatresponse} = response
        let dadResponse = document.createElement('li')

        let title = question

        let responseSpan = document.createElement('span')
        responseSpan.textContent = title

        let deleteBtn = document.createElement('button')
        deleteBtn.textContent = "X"
        deleteBtn.id = index

     


        dadResponse.appendChild(responseSpan)
        dadResponse.appendChild(deleteBtn)
   

        deleteBtn.addEventListener('click', deleteJournalEntry)


        journal.appendChild(dadResponse)
    })

}

const deleteJournalEntry = (event) => {

    axios.delete(baseURL+event.target.id)
        .then(response => {
            createJournalList(response.data)
        })
        .catch(err => console.log(err))
}


function getQueries() {
    axios.get('/questions')
        .then(res => {
            res.data
            res.data.forEach(query => {
                const option = document.createElement('option')
                option.setAttribute('value', query['responseid'])
                option.textContent = query.question
                queryList.appendChild(option)
            })
        })
}

function testDadChat (event) {
    event.preventDefault()

    let testObj = {
        question: 'Answer this question as if you are a nurturing emtionally intelligent father figure, with clear action steps, and include an light endearing nickname: ' + testinput.value
    }
    axios.post('/testDadChat', testObj)
    .then((response) => {

        // const displayChat = cleanUpDadChat(response.data)
        console.log(response.data)
        // console.log(displayChat);

        paragraph.innerText += response.data + '\n\n'
    }).catch(err => console.log(err))

}

const cleanUpDadChat = (string) => {
    
    const step1 = string.replace(/\n/g, "<br>");
    const step2 = step1.replace(/\+/g, "");
    return step2;
  }
  






getJournal()

getQueries()

submitQuestion.addEventListener('submit', submitQuestionFunction )
testButton.addEventListener('submit', testDadChat)

saveResponse.addEventListener('click', saveResponseFunction)

