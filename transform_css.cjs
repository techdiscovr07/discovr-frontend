const fs = require('fs');

let cssContent = fs.readFileSync('src/index.css', 'utf8');

cssContent = cssContent
    .replace(/--color-bg-primary: #0a0a0a;/, '--color-bg-primary: #ffffff;')
    .replace(/--color-bg-secondary: #121212;/, '--color-bg-secondary: #f8f9fa;')
    .replace(/--color-bg-tertiary: #1a1a1a;/, '--color-bg-tertiary: #f1f3f5;')
    .replace(/--color-surface-glass: rgba\(255, 255, 255, 0.03\);/, '--color-surface-glass: rgba(0, 0, 0, 0.03);')
    .replace(/--color-surface-glass-hover: rgba\(255, 255, 255, 0.06\);/, '--color-surface-glass-hover: rgba(0, 0, 0, 0.06);')
    .replace(/--color-surface-glass-active: rgba\(255, 255, 255, 0.08\);/, '--color-surface-glass-active: rgba(0, 0, 0, 0.08);')
    .replace(/--color-border-subtle: rgba\(255, 255, 255, 0.08\);/, '--color-border-subtle: rgba(0, 0, 0, 0.08);')
    .replace(/--color-border-medium: rgba\(255, 255, 255, 0.12\);/, '--color-border-medium: rgba(0, 0, 0, 0.12);')
    .replace(/--color-border-strong: rgba\(255, 255, 255, 0.2\);/, '--color-border-strong: rgba(0, 0, 0, 0.2);')
    .replace(/--color-text-primary: #ffffff;/, '--color-text-primary: #1a1a1a;')
    .replace(/--color-text-secondary: rgba\(255, 255, 255, 0.7\);/, '--color-text-secondary: rgba(0, 0, 0, 0.7);')
    .replace(/--color-text-tertiary: rgba\(255, 255, 255, 0.5\);/, '--color-text-tertiary: rgba(0, 0, 0, 0.5);')
    .replace(/--color-text-disabled: rgba\(255, 255, 255, 0.3\);/, '--color-text-disabled: rgba(0, 0, 0, 0.3);')

// Replace shadows and gradients with lighter versions
cssContent = cssContent
    .replace(/--shadow-glass: 0 8px 32px rgba\(0, 0, 0, 0.4\);/, '--shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.1);')
    .replace(/--shadow-sm: 0 1px 2px rgba\(0, 0, 0, 0.3\);/, '--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);')
    .replace(/--shadow-md: 0 4px 6px rgba\(0, 0, 0, 0.4\);/, '--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);')
    .replace(/--shadow-lg: 0 10px 15px rgba\(0, 0, 0, 0.5\);/, '--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);')
    .replace(/--shadow-xl: 0 20px 25px rgba\(0, 0, 0, 0.6\);/, '--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);')

// Remove data-theme blocks
const lines = cssContent.split('\n');
const newLines = [];
let skip = false;
for (const line of lines) {
    if (line.includes('[data-theme="light"]')) {
        skip = true;
    }
    if (!skip) {
        newLines.push(line);
    }
    if (skip && line === '}') {
        skip = false;
    }
}
cssContent = newLines.join('\n');

// Additional light overrides
cssContent += `\n/* Inverted Logos */\n.header-logo-img, .footer-logo-img, .sidebar-logo { filter: invert(1); }\n`;

// Scrollbar track light specific
cssContent = cssContent.replace(
    /::-webkit-scrollbar-track \{[\s\S]*?\}/,
    '::-webkit-scrollbar-track {\n  background: var(--color-bg-secondary);\n}'
);

fs.writeFileSync('src/index.css', cssContent);
console.log('Success rewriting index.css');
