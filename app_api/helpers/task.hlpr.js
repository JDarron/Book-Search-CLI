const inquirer = require('inquirer')
const fs = require('fs')

const ctrl = require('../controllers/book.ctrl')


function overwriteDisk(data) {
    fs.writeFile('files/books', JSON.stringify(data), function (err) {
        if (err) return console.log(err)
    })
}


function storeBooksToDisk() {
    ctrl.read()
        .then(resBooks => {
            overwriteDisk(resBooks)
        })
        .catch(err => console.error(err))
}


module.exports = {
    initiate: (callback) => {
        storeBooksToDisk()
        return callback()
    },


    view: (callback) => {
        fs.readFile('files/books', 'utf8', function (err, data) {
            if (err) throw err

            let booksList = JSON.parse(data)

            if (!booksList.length) {
                console.log('No books to view. Try adding one')
                return callback()
            }

            const choices = []

            for (book of booksList) {
                choices.push(`[${book.id}] ${book.title}`)
            }

            inquirer.prompt({
                type: 'list',
                name: 'book',
                choices: choices,
                message: '\n\n==== View Books ===='
            }).then(answers => {
                const index = parseInt(answers.book.slice(answers.book.indexOf('[') + 1, answers.book.indexOf(']'))) - 1
                console.log(booksList[index])
                callback()
            })
        })
    },


    add: (callback) => {
        console.log('\n\n==== Add a Book ====')
        console.log('\nPlease enter the following information:')
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Title: '
                },
                {
                    type: 'input',
                    name: 'author',
                    message: 'Author: '
                },
                {
                    type: 'input',
                    name: 'description',
                    message: 'Description: '
                }
            ])
            .then(answers => {

                let booksList

                fs.readFile('files/books', 'utf8', function (err, data) {
                    if (err) throw err

                    booksList = JSON.parse(data)

                    if (!booksList.length) {
                        answers.id = 1
                    } else {
                        answers.id = booksList.length + 1
                    }

                    booksList.push(answers)
                    overwriteDisk(booksList)

                    callback()
                })
            })
    },


    edit: (callback) => {
        fs.readFile('files/books', 'utf8', function (err, data) {
            if (err) throw err

            let booksList = JSON.parse(data)

            if (!booksList.length) {
                console.log('No books to view. Try adding one')
                return callback()
            }

            const choices = []

            for (book of booksList) {
                choices.push(`[${book.id}] ${book.title}`)
            }

            inquirer.prompt({
                type: 'list',
                name: 'book',
                choices: choices,
                message: '\n\n==== Edit a Book ===='
            }).then(answers => {
                const index = parseInt(answers.book.slice(answers.book.indexOf('[') + 1, answers.book.indexOf(']'))) - 1

                inquirer.prompt([{
                    type: 'input',
                    name: 'title',
                    message: `Title [${booksList[index].title}]: `
                },
                {
                    type: 'input',
                    name: 'author',
                    message: `Author [${booksList[index].author}]: `
                },
                {
                    type: 'input',
                    name: 'description',
                    message: `Description [${booksList[index].description}]: `
                }]).then(ans => {
                    if (ans.title) {
                        booksList[index].title = ans.title
                    }

                    if (ans.author) {
                        booksList[index].author = ans.author
                    }

                    if (ans.description) {
                        booksList[index].description = ans.description
                    }

                    overwriteDisk(booksList)
                    callback()
                })
            })
        })
    },


    search: (callback) => {
        fs.readFile('files/books', 'utf8', function (err, data) {
            if (err) throw err

            let booksList = JSON.parse(data)

            inquirer.prompt({
                type: 'input',
                name: 'query',
                message: '\n\n==== Search ===='
            }).then(answers => {
                const choices = []

                for (book of booksList) {
                    if (book.title.toLowerCase().includes(answers.query.toLowerCase())) {
                        choices.push(`[${book.id}] ${book.title}`)
                    }
                }

                inquirer.prompt({
                    type: 'list',
                    name: 'book',
                    choices: choices,
                    message: '\n\nThe following books matched your query. Enter the book ID to see more details, or <Enter> to return.'
                }).then(answers => {
                    const index = parseInt(answers.book.charAt(1)) - 1

                    console.log(booksList[index])
                    callback()
                })
            })
        })
    },


    save: () => {
        fs.readFile('files/books', 'utf8', function (err, data) {
            if (err) throw err

            booksList = JSON.parse(data)

            ctrl.update(booksList)
        })
    }
}