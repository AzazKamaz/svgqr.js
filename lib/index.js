const QRCodeModel = require('qrcode-generator');
const {generateSvg} = require('./svg');

function encode(data, opts = {}) {
    let qr = new QRCodeModel(opts.version || 0, opts.correction || 'M');

    let stringToBytes = QRCodeModel.stringToBytesFuncs[opts.encoding || 'default'];
    if (typeof data === 'string')
        data = String.fromCharCode(...stringToBytes(data));

    qr.addData(data, opts.mode || 'Byte');
    qr.make();

    let size = qr.getModuleCount();

    let mat = [];
    for (let i = 0; i < size; i++) {
        mat[i] = [];
        for (let j = 0; j < size; j++)
            mat[i][j] = qr.isDark(i, j);
    }

    return {
        size,
        mat
    };
}

function renderSvg(data, opts = {}) {
    let qr = encode(data, opts);
    return generateSvg(qr, opts);
}

module.exports = renderSvg;