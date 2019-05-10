const QRCodeModel = require('qrcode-generator');

function encode(data, opts = {}) {
    let qr = new QRCodeModel(opts.version || 0, opts.correction || 'M');
    qr.stringToBytes = qr.stringToBytesFuncs[opts.encoding || 'default'];

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


function pointsPaths({size, mat}) {
    let paths = [[], []];

    for (let i = 0; i < size; i++)
        for (let j = 0; j < size; j++)
            if (mat[i][j]) {
                paths[0].push(`M ${i} ${j} m 0.4 0.5 l 0.1 -0.5 a 0.5 0.5 0 1 1 0 1 z`);
                paths[1].push(`M ${i} ${j} m 0.6 0.5 l -0.1 -0.5 a 0.5 0.5 0 1 0 0 1 z`);
            }

    return paths;
}

function blocksPaths({size, mat}) {
    let paths = [[], []];

    for (let i = 0; i < size; i++)
        for (let j = 0; j < size - 1; j++)
            if (mat[i][j] && mat[i][j + 1])
                paths[0].push(`M ${i} ${j + 0.5} m 0 0 h 1 v 1 h -1 z`);

    for (let i = 0; i < size - 1; i++)
        for (let j = 0; j < size; j++)
            if (mat[i][j] && mat[i + 1][j])
                paths[1].push(`M ${i + 0.5} ${j} m 0 0 h 1 v 1 h -1 z`);

    return paths;
}

function edgesPaths({size, mat}) {
    let paths = [[]];

    for (let i = 0; i < size - 1; i++)
        for (let j = 0; j < size - 1; j++)
            if (mat[i][j] && mat[i + 1][j + 1]) {
                if (mat[i + 1][j] && !mat[i][j + 1])
                    paths[0].push(`M ${i} ${j + 1} m 1.1 -0.1 l -0.1 0.6 a 0.5,0.5 0 0,0 -0.5 -0.5 z`);
                if (!mat[i + 1][j] && mat[i][j + 1])
                    paths[0].push(`M ${i + 1} ${j} m -0.1 1.1 l 0.6 -0.1 a 0.5,0.5 0 0,1 -0.5 -0.5 z`);
            }

    for (let i = 0; i < size - 1; i++)
        for (let j = 0; j < size - 1; j++)
            if (mat[i + 1][j] && mat[i][j + 1]) {
                if (mat[i][j] && !mat[i + 1][j + 1])
                    paths[0].push(`M ${i + 1} ${j + 1} m -0.1 -0.1 l 0.1 0.6 a 0.5,0.5 0 0,1 0.5 -0.5 z`);
                if (!mat[i][j] && mat[i + 1][j + 1])
                    paths[0].push(`M ${i} ${j} m 1.1 1.1 l -0.1 -0.6 a 0.5,0.5 0 0,1 -0.5 0.5 z`);
            }

    return paths;
}

function renderSvg(data, opts = {}) {
    let qr = encode(data, opts);

    let paths = [
        ...pointsPaths(qr),
        ...blocksPaths(qr),
        ...edgesPaths(qr),
    ].map(p => p.join(' '));

    return `
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${qr.size} ${qr.size}">
            <path d="${paths[0]}"/>
            <path d="${paths[1]}"/>
            <path d="${paths[2]}" shape-rendering="crispEdges"/>
            <path d="${paths[3]}" shape-rendering="crispEdges"/>
            <path d="${paths[4]}"/>
        </svg>
    `.replace(/(^\s+|\s+$|\n)/gm, '');
}

module.exports = renderSvg;