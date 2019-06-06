function generateMoves(opts = {}) {
    opts.corners = opts.corners || 'None';
    opts.radius = opts.radius != null ? opts.radius : 1;
    const moves = { // From Right to Down be rd
        u: 'v-2', r: 'h2', d: 'v2', l: 'h-2'
    };

    ['ld', 'ul', 'ru', 'dr', 'ur', 'rd', 'dl', 'lu'].forEach((i, j) => {
        let mode = typeof opts.corners === 'string'
            ? opts.corners : opts.corners[i]
            || opts.corners[[...i].reverse().join('')] || 'None';
        let radius = typeof opts.radius === 'number'
            ? opts.radius : opts.radius[i]
            || opts.radius[[...i].reverse().join('')] || 1;
        const sides = [
            {d: [0, 1], l: [-1, 0], u: [0, -1], r: [1, 0]}[i[0]],
            {u: [0, -1], r: [1, 0], d: [0, 1], l: [-1, 0]}[i[1]],
        ];
        switch (mode) {
            case 'None':
                moves[i] = {d: 'v', l: 'h-', u: 'v-', r: 'h'}[i[0]] + '1'
                    + {u: 'v-', r: 'h', d: 'v', l: 'h-'}[i[1]] + '1';
                break;
            case 'Skew':
                moves[i] = (radius < 1 ? {d: 'v', l: 'h-', u: 'v-', r: 'h'}[i[0]] + `${1 - radius}` : '')
                    + 'l' + (sides[0][0] + sides[1][0]) * radius
                    + ' ' + (sides[0][1] + sides[1][1]) * radius
                    + (radius < 1 ? {u: 'v-', r: 'h', d: 'v', l: 'h-'}[i[1]] + `${1 - radius}` : '');
                break;
            case 'Rounded':
                moves[i] = (radius < 1 ? {d: 'v', l: 'h-', u: 'v-', r: 'h'}[i[0]] + `${1 - radius}` : '')
                    + 'a' + `${radius},${radius} 0 0,${j > 3 ? 1 : 0}`
                    + ' ' + (sides[0][0] + sides[1][0]) * radius
                    + ',' + (sides[0][1] + sides[1][1]) * radius
                    + (radius < 1 ? {u: 'v-', r: 'h', d: 'v', l: 'h-'}[i[1]] + `${1 - radius}` : '');
                break;
            default:
                moves[i] = mode;
        }
    });

    return moves;
}

function generateSvgPath({mat, size = mat.length}, options = {}) {
    const moves = generateMoves(options);

    let d /*drawn*/ = Array(size * 2 + 3).fill(0).map(_ => Array(size + 1).fill(false));
    let f /*filled*/ = [Array(size).fill(false), ...mat, Array(size).fill(false)]
        .map(a => [false, ...a, false]);

    let paths = [];
    for (let x = 0; x < size; x++)
        for (let y = 0; y < size * 2; y += 2)
            if (!d[y][x] && !f[y / 2][1 + x] && f[y / 2 + 1][1 + x]) {
                let lpaths = [`M${x * 2 + 1} ${y}`], dir = 0;
                while (!d[y][x]) {
                    d[y][x] = true;
                    switch ((y % 2) * 2 + dir) {
                        case 0b00: // Path going right
                            x++;
                            if (f[y / 2 + 1][1 + x]) {
                                if (f[y / 2][1 + x]) {
                                    lpaths.push(moves.ru);
                                    dir = 0;
                                    y--;
                                } else {
                                    lpaths.push(moves.r);
                                }
                            } else {
                                lpaths.push(moves.rd);
                                dir = 1;
                                y++;
                            }
                            break;
                        case 0b01: // Path going left
                            if (f[y / 2][x]) {
                                if (f[y / 2 + 1][x]) {
                                    lpaths.push(moves.ld);
                                    dir = 1;
                                    y++;
                                } else {
                                    lpaths.push(moves.l);
                                    x--;
                                }
                            } else {
                                lpaths.push(moves.lu);
                                dir = 0;
                                y--;
                            }
                            break;
                        case 0b10: // Path going up
                            if (f[(y - 1) / 2][1 + x]) {
                                if (f[(y - 1) / 2][1 + x - 1]) {
                                    lpaths.push(moves.ul);
                                    dir = 1;
                                    x--;
                                } else {
                                    lpaths.push(moves.u);
                                    y--;
                                }
                            } else {
                                lpaths.push(moves.ur);
                                dir = 0;
                            }
                            y--;
                            break;
                        case 0b11: // Path going down
                            if (f[(y + 3) / 2][1 + x - 1]) {
                                if (f[(y + 3) / 2][1 + x]) {
                                    lpaths.push(moves.dr);
                                    dir = 0;
                                } else {
                                    lpaths.push(moves.d);
                                    y++;
                                }
                            } else {
                                lpaths.push(moves.dl);
                                dir = 1;
                                x--;
                            }
                            y++;
                            break;
                    }
                }
                paths.push(lpaths.join(''));
            }
    return paths.join('');
}

function generateSvg({mat, size = mat.length}, options) {
    return `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${size * 2} ${size * 2}"><path d="${generateSvgPath({mat}, options)}" fill-rule="evenodd"/></svg>`
}

module.exports = {
    generateSvgPath,
    generateSvg
};