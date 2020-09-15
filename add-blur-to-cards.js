setTimeout(() => {
  const haCard = customElements.get('ha-card');
  haCard._styles[0].styleSheet.addRule(':host', 'color: pink !important;', 0)
}, 1000);
