const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const child_process = require('child_process');
const fs = require('fs');

const app = express();

const upload = multer({ dest: 'code4maus-uploads/' });

app.use(cors());

const printDefault = (buffer, format = 'PDF') => {
    const printer = require('printer');
    return new Promise((res, rej) => printer.printDirect({
        data: buffer,
        type: format,
        success: res,
        error: rej,
    }));
};

let binPath = path.join(
    'C:', 'Program Files (x86)',
    'Adobe', 'Adobe Reader DC', 'Reader', 'AcroRd32.exe'
);
if (process.argv.length > 2 && process.argv[2] !== '') {
    binPath = process.argv[2];
}

try {
    const binStat = fs.statSync(binPath);
    if (!binStat.isFile) {
        throw new Error('Acrobat Reader executable is not a file!');
    }
} catch (err) {
    console.error(`Acrobat Reader is required at ${binPath}!`, 'Failed with:', err);
}

const printWin = async (filepath) => new Promise((res, rej) => {
    const child = child_process.spawn(binPath, [ '/t', path.join(process.cwd(), filepath) ]);
    const childTimeout = setTimeout(() => child.killed || child.kill(), 2000);
    child.on('exit', () => {
        clearTimeout(childTimeout);
        res();
    });
    child.on('error', (err) => {
        rej(err);
    });
});

app.post('/', upload.single('button'), async (req, res) => {
    try {
        let printId;
        if (process.platform !== 'win32') {
            printId = await printDefault(req.file.buffer);
        } else {
            printId = await printWin(req.file.path);
        }
        res.send(`Printed with id: ${printId}`);
    } catch (err) {
        res.status(500).send(`error on printing: ${err}`);
    }
});

app.listen(8602, () => {
    console.log('Example app listening on port 8602!');
});
