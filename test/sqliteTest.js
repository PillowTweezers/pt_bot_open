const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('..\\blacklist.db');
// db.run("CREATE TABLE blacklist(\n" +
//     "                          name varchar(255),\n" +
//     "                          phone varchar(255),\n" +
//     "                          start BIGINT(128),\n" +
//     "                          end BIGINT(128),\n" +
//     "                          reason varchar(2552)\n" +
//     ");")
db.serialize(function () {
    // db.get('SELECT * from blacklist', (err, result) => {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log(result);
    //         // do something with result
    //     }
    // })
    // db.each('SELECT * FROM sqlite_master', function (err, row) {
    //     console.log(row);
    // });
    db.each('SELECT * FROM blacklist', function (err, row) {
        console.log(row);
    });
});
// db.run("insert into blacklist (name, phone, start, end, reason) values ('****', '************', 1617206051, -1, 'check');");
// db.run("delete from blacklist where phone=***********")
db.close();
