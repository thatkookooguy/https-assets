setTimeout(() => {
  const haCard = customElements.get('ha-card');
  haCard._styles[0].styleSheet.addRule(':host', 'backdrop-filter: blur(5px)', 0)
}, 1000);
