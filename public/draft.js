const submitQuestion = document.querySelector("form")
const saveResponse = document.getElementById("saveResponse")
const saveJournal = document.getElementById('saveJournal')
const journal = document.querySelector('#journalContainer')
const queryList = document.querySelector('#queryList')
const paragraph = document.querySelector('p')
const testButton = document.querySelector('#test')
const testinput = document.querySelector ('#testInput')
const clear = document.getElementById('clear')
const cancelSave = document.getElementById('cancelSave')






const saveResponseFunction = () => {
    saveJournal.style.visibility = 'visible'
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
        saveResponse.style.visibility="visible"
    }

    let journalObj = {

        title: title,
        dadresponse: save
    }

    axios.post(`/saveJournal`, journalObj)
    .then(response => {
        console.log(response)
        getJournal()
    }).catch(err => console.log(err))

    saveJournal.style.visibility = 'hidden'
    
    
}



const getJournal = () => {
    axios.get("/api/journal/")
        .then(response => {
            console.log(response.data)
            createJournalList(response.data)
        })
        .catch(err => console.log(err))
}

const createJournalList = array => {
    journal.innerHTML = ""
    array.forEach((response,index) =>{

        let {dadresponseid,
             question} = response

        console.log(response)

        let responseSpan = document.createElement('span')
        journal.appendChild(responseSpan)
        responseSpan
        let savedJournal = document.createElement('button')

        let title = question

        console.log(question)
        console.log(dadresponseid)
        
        savedJournal.innerText = title
        savedJournal.id = dadresponseid
        savedJournal.classList = "journalBtns"
        

        let deleteBtn = document.createElement('button')
        deleteBtn.innerHTML = `<img src="./images/delete.png" style="height: 10px; filter: invert(100%);"></img>`
        deleteBtn.id = dadresponseid
        deleteBtn.classList = "deleteBtns"
        
        responseSpan.appendChild(savedJournal)
        responseSpan.appendChild(deleteBtn)
   

        deleteBtn.addEventListener('click', deleteJournalEntry)
        savedJournal.addEventListener('click', displayJournalEntry)


      
    })

}

const displayJournalEntry = async(event) => {
    paragraph.innerHTML = ""
    let journalEntry = event.target.id
    await axios.get(`/api/journal/${journalEntry}`)
    .then(res => {
        console.log(res.data)
        let display = (res.data.dadchatresponse)

        paragraph.innerText = display
        
    }).catch(err => console.log(err))

    clear.style.visibility = "visible"

    
}

const deleteJournalEntry = (event) => {

    console.log(event.target.id);

    axios.delete('/api/journal/' + event.target.id)
        .then(response => {

            console.log(response.data)
            getJournal(response.data)
        })
        .catch(err => console.log(err))

        getJournal()
}


const testDadChat = async(event) => {
    event.preventDefault()


    let testObject = {
        "role": "user", "content": testinput.value     
    }
    await axios.post('/testDadChat', testObject)
    .then((response) => {

        let question = document.createElement('h1')
        question.innerText= "You: " + testinput.value + "\n\n"
        paragraph.appendChild(question)

        console.log(response.data)
        
        paragraph.innerText += "Dad: " + response.data + '\n\n'

        testinput.value= ""
    }).catch(err => console.log(err))

    saveResponse.style.visibility = "visible"
    clear.style.visibility = "visible"

}

const clearChat = () => {
    paragraph.innerText = ""

    axios.get('/clear')

    clear.style.visibility = "hidden"
    saveResponse.style.visibility = "hidden"

    

}

const cancelSaveFunction = () => {
    saveResponse.style.visibility = "visible"
    saveAs.Style.visibility = "hidden"
}
  






getJournal()

testButton.addEventListener('submit', testDadChat)
clear.addEventListener('click', clearChat)
saveResponse.addEventListener('click', saveResponseFunction)
cancelSave.addEventListener('click',cancelSaveFunction)

