const fs = require('fs');

function updateNotes(notes) {
    return fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
        if (err) {
            return err;
        } 
    })
}

module.exports = updateNotes