<p align="center">
  <img src="assets/svgqr.png" width="290" height="290"/>
</p>

# SvgQr.js
QR code renderer into SVG with rounded edges

# Installation
#### Npm:

`npm install svgqr.js`

#### Yarn:

`yarn add svgqr.js`

# Usage

```
const SvgQr = require('svgqr.js'); // For NodeJS
import SvgQr from 'svgqr.js'; // For Webpack

// Simple usage
let svg = SvgQr('Hello, World!');

// With options
let svg = SvgQr('Hello, World!', {
  correction: 'H'
});

// svg = '<svg ...> ... </svg>'
```

# API Reference
### `SvgQr(data, opts)` - encode and render QR code into SVG string
- `data` — data to encode
- `opts` — object with options fields:

    Name | Default | Description
    ---- | ------- | -----------
    `version` | `0` | QR code version, `0` (auto) \| from `1` to `40`
    `correction` | `'M'` | Error correction level, `'L'` (7%) \| `'M'` (15%) \| `'Q'` (25%) \| `'H'` (30%)
    `mode` | `'Byte'` | Data encoding mode, `'Numeric'` \| `'Alphanumeric'` \| `'Byte'`
    `encoding` | `'default'` | Text encoding, `'default'` (bytes) \| `'UTF-8'`

# Todo
- [x] Optimize 5 paths into 1
- [ ] Add rounding option

# License
MIT licensed

Copyright (C) 2019 Aleksandr Krotov