setTimeout(() => {
  const haCard = customElements.get('ha-card');
  hello._styles[0].styleSheet.addRule(':host', 'color: pink !important;', 0)
}, 1000);
