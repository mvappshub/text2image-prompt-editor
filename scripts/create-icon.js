const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create a 512x512 canvas
const canvas = createCanvas(512, 512);
const ctx = canvas.getContext('2d');

// Set background
ctx.fillStyle = '#1a1a1a';
ctx.fillRect(0, 0, 512, 512);

// Draw text icon
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 200px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('T2I', 256, 256);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, '..', 'public', 'icon.png'), buffer);
