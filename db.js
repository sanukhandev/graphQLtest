const fs = require('fs');
const path = require('path');

const json = fs.readFileSync(path.join(__dirname, './data.json'),);
let data = JSON.parse(json);


const TracksMap = {
    toGraphQL: (tracks) => {
        return tracks.map((track, index) => ({
            ...track,
            number: index + 1
        }))
    }
}

const AlbumMap = {
    toGraphQL: (album) => ({
        ...album,
        tracks: TracksMap.toGraphQL(album.tracks)
    })
}

const match = (obj, key, query) => {
    switch (typeof query) {
        case 'string':
            return obj[key] === query;
        case 'object':
            if (query instanceof Array) {
                return query.includes(obj[key]);
            }else {
                return Object.keys(query).every((childkey) => match(obj[key], childkey, query[childkey]));
            }
        default:
            return true;

    }
}

const db = {
    getAllAlbums: () => {
        return data.albums.map((a) => AlbumMap.toGraphQL(a))
    },
    getAlbumByTitle: (albumTitle) => {
        const album = data.albums.find((a) => a.title === albumTitle);
        if (!album) {
            throw new Error("Album not found")
        }
        return AlbumMap.toGraphQL(album);
    },
    getAlbumsByDynamicFilter: (payload) => {
        const albums = data.albums.filter((a) => Object.keys(payload).every(key => match(a, key, payload[key])));
        return albums.map((a) => AlbumMap.toGraphQL(a));
    }
}

module.exports = db;