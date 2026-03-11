import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { join } from 'path';

function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#4F46E5');
  gradient.addColorStop(1, '#7C3AED');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Clock icon
  ctx.strokeStyle = '#FFFFFF';
  ctx.fillStyle = '#FFFFFF';
  ctx.lineWidth = Math.max(2, size / 16);
  
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 3;
  
  // Circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  
  // Hour hand (pointing up)
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX, centerY - radius * 0.5);
  ctx.lineWidth = Math.max(2, size / 20);
  ctx.stroke();
  
  // Minute hand (pointing right)
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + radius * 0.7, centerY);
  ctx.lineWidth = Math.max(2, size / 24);
  ctx.stroke();
  
  // Center dot
  ctx.beginPath();
  ctx.arc(centerX, centerY, Math.max(2, size / 32), 0, 2 * Math.PI);
  ctx.fill();
  
  return canvas.toBuffer('image/png');
}

// Generate icons
console.log('Generating extension icons...');

const icon16 = createIcon(16);
writeFileSync(join('extension', 'icons', 'icon16.png'), icon16);
console.log('✓ Created icon16.png');

const icon48 = createIcon(48);
writeFileSync(join('extension', 'icons', 'icon48.png'), icon48);
console.log('✓ Created icon48.png');

const icon128 = createIcon(128);
writeFileSync(join('extension', 'icons', 'icon128.png'), icon128);
console.log('✓ Created icon128.png');

console.log('\n✅ All icons created successfully!');
console.log('📁 Location: extension/icons/');
console.log('\nNow go to chrome://extensions/ and click "Retry" on the extension!');
