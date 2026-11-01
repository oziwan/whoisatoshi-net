const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'public');

fs.mkdirSync(output, { recursive: true });

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const publicFile = entry.isFile() && (
        ['index.html', 'ads.txt', 'robots.txt', 'sitemap.xml'].includes(entry.name) ||
        /\.(png|jpe?g|webp|svg|ico|woff2?|css)$/i.test(entry.name)
    );
    const assetsFolder = entry.isDirectory() && entry.name === 'assets';

    if (publicFile || assetsFolder) {
        fs.cpSync(
            path.join(root, entry.name),
            path.join(output, entry.name),
            { recursive: true }
        );
    }
}

if (!fs.existsSync(path.join(output, 'index.html'))) {
    throw new Error('index.html is missing');
}

console.log('Public website files prepared.');
