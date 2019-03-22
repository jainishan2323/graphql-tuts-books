const graphql = require('graphql');
const Books = require('../models/books');
const Author = require('../models/author');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
} = graphql;

// field is a function since field can refer multiple types
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {
            type: GraphQLID,
        },
        name: {
            type: GraphQLString,
        },
        genre: {
            type: GraphQLString,
        },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Author.findById(parent.authorid)
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {
            type: GraphQLID,
        },
        name: {
            type: GraphQLString,
        },
        age: {
            type: GraphQLID,
        },
        books: {
            type: GraphQLList(BookType),
            resolve(parent, args) {
                return Books.find({ authorid: parent.id })
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {id: { type: GraphQLID }},
            resolve: (parent, args) => {
                return Books.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve: (parent, args) => {
                return Books.find({});
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID }},
            resolve: (parent, args) => {
                return Author.findById(args.id);
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({});
            }
        }
    },
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {
                    type: GraphQLString
                },
                age: {
                    type: GraphQLInt
                }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age,
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                authorid: { type: GraphQLID },
            },
            resolve(parent, args) {
                let books = new Books({
                    name: args.name,
                    genre: args.genre,
                    authorid: args.authorid,
                })

                return books.save();
            }
        }
    }
})
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
