// Imports 
const { MongoClient } = require('mongodb');
const { username, password, hostname, port } = require('./../config/db.json');

// Configuration
let base_url = `mongodb://`;
if (!(!username && !password)) base_url += `${username}:${password}`;
base_url += `@${hostname}:${port}`;

const client = new MongoClient(base_url);

// Export
module.exports = client;