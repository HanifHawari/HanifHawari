#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Read config
const configPath = path.join(__dirname, '..', 'profile.config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Read profile image and convert to base64
const imagePath = path.join(__dirname, '..', config.profileImage);
let imageBase64 = '';

if (fs.existsSync(imagePath)) {
  const imageBuffer = fs.readFileSync(imagePath);
  imageBase64 = imageBuffer.toString('base64');
  console.log('✓ Profile image loaded');
} else {
  console.warn('⚠ Profile image not found at', imagePath);
}

// Generate SVG template
function generateSVG(isDark) {
  const colors = isDark ? config.colors.dark : config.colors.light;
  const animId = isDark ? 'scanDark' : 'scanLight';
  
  const svg = `<svg viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @keyframes scan-animation {
        0% {
          transform: translateY(-400px);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(400px);
          opacity: 0;
        }
      }
      
      .scan-line {
        animation: scan-animation ${config.animation.scanSpeed}s infinite;
      }
      
      .profile-container {
        filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
      }
    </style>
    
    <!-- Profile Image Pattern -->
    <pattern id="profileImage" patternUnits="userSpaceOnUse" width="400" height="400">
      <image href="data:image/png;base64,${imageBase64}" width="400" height="400" preserveAspectRatio="xMidYMid slice" />
    </pattern>
    
    <!-- Mask for circular profile -->
    <mask id="profileMask">
      <rect width="1200" height="600" fill="white" />
      <circle cx="200" cy="300" r="${config.animation.imageRadius}" fill="black" />
    </mask>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="600" fill="${colors.background}" />
  
  <!-- Main Content Area -->
  <g class="profile-container">
    <!-- Profile Circle Background -->
    <circle cx="200" cy="300" r="${config.animation.imageRadius}" fill="${colors.border}" opacity="0.1" />
    
    <!-- Profile Image Circle -->
    <circle cx="200" cy="300" r="${config.animation.imageRadius - 10}" fill="url(#profileImage)" />
    
    <!-- Border Circle -->
    <circle cx="200" cy="300" r="${config.animation.imageRadius}" fill="none" stroke="${colors.border}" stroke-width="3" />
    
    <!-- Scan Line -->
    <g class="scan-line" id="${animId}">
      <rect x="0" y="0" width="400" height="8" fill="${colors.scanLine}" opacity="0.8" />
      <rect x="0" y="-20" width="400" height="20" fill="${colors.scanLine}" opacity="0.3" />
      <rect x="0" y="8" width="400" height="20" fill="${colors.scanLine}" opacity="0.3" />
    </g>
  </g>
  
  <!-- Text Area -->
  <g>
    <text x="500" y="150" font-size="48" font-weight="bold" fill="${isDark ? '#c9d1d9' : '#24292f'}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif">
      ${config.metadata.name}
    </text>
    <text x="500" y="200" font-size="24" fill="${isDark ? '#8b949e' : '#57606a'}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif">
      ${config.metadata.title}
    </text>
    
    <!-- Decorative lines -->
    <line x1="500" y1="220" x2="1100" y2="220" stroke="${colors.scanLine}" stroke-width="2" opacity="0.5" />
    <line x1="500" y1="230" x2="1100" y2="230" stroke="${colors.scanLine}" stroke-width="1" opacity="0.3" />
  </g>
</svg>`;
  
  return svg;
}

// Generate both versions
const darkSVG = generateSVG(true);
const lightSVG = generateSVG(false);

// Write files
fs.writeFileSync(path.join(__dirname, '..', 'dark.svg'), darkSVG);
fs.writeFileSync(path.join(__dirname, '..', 'light.svg'), lightSVG);

console.log('✓ Generated dark.svg');
console.log('✓ Generated light.svg');
console.log('\n✨ Profile animations updated successfully!');
