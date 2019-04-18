const express = require('express');
const multer = require('multer');
const printer = require('printer');
const cors = require('cors');

const app = express();

const fileStorage = multer.memoryStorage();
const upload = multer({ storage: fileStorage });

app.use(cors());

app.post('/', upload.single('button'), (req, res) => {
    printer.printDirect({
        data: req.file.buffer,
        type: 'PDF',
        success: (id) => {
            res.send(`Printed with id: ${id}`);
        },
        error: (err) => {
            res.status(500).send(`error on printing: ${err}`);
        },
    });
});

app.listen(8602, () => {
    console.log('Example app listening on port 8602!');
});
