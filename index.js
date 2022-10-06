const {ApolloServer, gql} = require("apollo-server");
const db = require('./db');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    enum Genre {
        Pop,
        Rock,
        Alternative
        HipHop,
        Folk
    }
    
    input inputAlbum {
        title: String
        artist: inputArtist
        year: Int
        tracks: [inputTrack!]
        genre: Genre
    }
    
    input inputArtist {
        name: String!
    }
    input inputTrack {
        title: String!
    }

    type Track {
        title: String!
        number: Int!
    }

    type Artist {
        name: String!
    }

    type Album {
        title: String!
        artist: Artist!
        year: Int!
        tracks: [Track!]!
        genre: Genre!
    }

    type Query {
        albums(payload:inputAlbum): [Album!]!
    }
`;

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        albums: (root, args, context) => {
            console.log(args.payload);
            const dynamicFilter = !!args && Object.keys(args.payload) ? !!args.payload : false;
            return dynamicFilter ? context.db.getAlbumsByDynamicFilter(args.payload) : context.db.getAllAlbums();
        },

    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({db})
});

server.listen().then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
});