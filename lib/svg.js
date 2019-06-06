function generateSvgPath({mat, size = mat.length}, options) {
    const moves = { // From Right to Down be rd
        uu: 'v-2', rr: 'h2', dd: 'v2', ll: 'h-2',
        rd: 'a1,1 0 0,0 -1,1',
        dl: 'a1,1 0 0,0 -1,-1',
        lu: 'a1,1 0 0,0 1,-1',
        ur: 'a1,1 0 0,0 1,1',
        dr: 'a1,1 0 0,1 1,-1',
        ld: 'a1,1 0 0,1 1,1',
        ul: 'a1,1 0 0,1 -1,1',
        ru: 'a1,1 0 0,1 -1,-1',
    };

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
                                    lpaths.push(moves.lu);
                                    dir = 0;
                                    y--;
                                } else {
                                    lpaths.push(moves.rr);
                                }
                            } else {
                                lpaths.push(moves.ld);
                                dir = 1;
                                y++;
                            }
                            break;
                        case 0b01: // Path going left
                            if (f[y / 2][x]) {
                                if (f[y / 2 + 1][x]) {
                                    lpaths.push(moves.rd);
                                    dir = 1;
                                    y++;
                                } else {
                                    lpaths.push(moves.ll);
                                    x--;
                                }
                            } else {
                                lpaths.push(moves.ru);
                                dir = 0;
                                y--;
                            }
                            break;
                        case 0b10: // Path going up
                            if (f[(y - 1) / 2][1 + x]) {
                                if (f[(y - 1) / 2][1 + x - 1]) {
                                    lpaths.push(moves.dl);
                                    dir = 1;
                                    x--;
                                } else {
                                    lpaths.push(moves.uu);
                                    y--;
                                }
                            } else {
                                lpaths.push(moves.dr);
                                dir = 0;
                            }
                            y--;
                            break;
                        case 0b11: // Path going down
                            if (f[(y + 3) / 2][1 + x - 1]) {
                                if (f[(y + 3) / 2][1 + x]) {
                                    lpaths.push(moves.ur);
                                    dir = 0;
                                } else {
                                    lpaths.push(moves.dd);
                                    y++;
                                }
                            } else {
                                lpaths.push(moves.ul);
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