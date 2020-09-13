const sheet = new CSSStyleSheet();

// replace all styles synchronously:
sheet.replaceSync('ha-card { color: red; }');

console.log('trying to create style!!!');

document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
