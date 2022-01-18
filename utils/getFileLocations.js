// Imports
const fs = require('fs');
const path = require('path');

/**
 * Get locations of all files inside a directory. It searches through all subdirectories too.
 * Shorten your searching by specifying specific file extensions.
 * @param {String} dirPath Full path to the parent directory
 * @param {Undefined | String | Array<String>} extname The extension of seeking file name, for example '.js'
 * @returns {Promise<Array<String>>}
 */
function getFileLocations(dirPath, extname) {
    files = fs.readdirSync(dirPath);

    arrayOfFiles = [];

    files.forEach(file => {
        if (fs.statSync(`${dirPath}/${file}`).isDirectory()) arrayOfFiles = [...arrayOfFiles, ...getFileLocations(`${dirPath}/${file}`, extname)]; 
        else if ((((extname != null) && ((Array.isArray(extname) && ((extname.includes(path.extname(file)) || (extname.filter((el) => {return (/^\s*$/.test(String(el))) == false}).length == 0))))) || (path.extname(file) == extname))) || (extname == null || /^\s*$/.test(String(extname)))) arrayOfFiles.push(`${dirPath}/${file}`);
    });

    return arrayOfFiles;
}

// Module Export
module.exports = getFileLocations;