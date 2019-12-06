const inquirer = require('inquirer')
const mongoose = require('mongoose')
const MONGODB_URI = 'mongodb://localhost/book-search'

const hlpr = require('./app_api/helpers/task.hlpr')


mongoose.Promise = Promise
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        hlpr.initiate(chooseTask) 
    })
    .catch(err => console.error(err))


function chooseTask () {
    inquirer
        .prompt([
            {
                type: "list",
                name: "choice",
                message: "\n\n==== Book Manager ====",
                choices: [
                    "1) View all books",
                    "2) Add a book",
                    "3) Edit a book",
                    "4) Search for a book",
                    "5) Save and exit"
                ]
            }
        ])
        .then(answers => {
            switch (answers.choice) {
                case "1) View all books":
                    hlpr.view(chooseTask)
                    break;
                case "2) Add a book":
                    hlpr.add(chooseTask)
                    break;
                case "3) Edit a book":
                    hlpr.edit(chooseTask)
                    break;
                case "4) Search for a book":
                    hlpr.search(chooseTask)
                    break;
                case "5) Save and exit":
                    hlpr.save(chooseTask)
                    break;
                default:
                    console.log("Please choose a valid option.")
            }
        });
}
