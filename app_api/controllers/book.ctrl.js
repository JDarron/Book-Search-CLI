const Book = require('../models/Book.model')

module.exports = {
    create: (book) => {
        return Book.create(book)
    },


    read: () => {
        return Book.find({}, [], {sort: {id: 1}})
    },


    update: async (books) => {
        for (book of books) {
            if (book._id) {
                await Book
                    .updateOne({ _id: book._id }, book)
                    .catch(err => console.error(err))
            } else {
                await Book.create(book)
                    .catch(err => console.error(err))
            }
        }

        console.log('\nThank you. Goodbye.')
        process.exit()
    },


    delete: (id) => {
        Book
            .deleteOne({ _id: id })
            .then(resBook => console.log({ message: 'Deletion successfull.' }))
            .catch(err => console.error(err))
    },
}