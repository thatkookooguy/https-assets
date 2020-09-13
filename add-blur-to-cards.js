addStyle(`
  ha-card {
    backdrop-filter: blur(5px);
  }
`);


function addStyle(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
  
  setTimeout(() => {
    console.log('test selector');
    console.log(document.queryselectorall('ha-card'));
  }, 3000);
}
