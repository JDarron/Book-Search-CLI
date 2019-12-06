const Book = require('../models/Book.model')

module.exports = {
    read: () => {
        return Book.find({}, [], {sort: {id: 1}})
    },


    create: (book) => {
        return Book.create(book)
    },


    update: (books) => {
        for (book of books) {
            if (book._id) {
                Book
                    .updateOne({ _id: book._id }, book)
                    .then(resBook => console.log(resBook))
                    .catch(err => console.error(err))
            } else {
                Book.create(book)
                    .then(resBook => console.log(resBook))
                    .catch(err => console.error(err))
            }
        }

        console.log("Items saved successfully")
    },


    delete: (id) => {
        Book
            .deleteOne({ _id: id })
            .then(resBook => console.log({ message: "Deletion successfull." }))
            .catch(err => console.error(err))
    },
}