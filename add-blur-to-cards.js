setTimeout(() => {
  const haCard = customElements.get('ha-card');
  const haInfoDialog = customElements.get('ha-dialog');
  haCard._styles[0].styleSheet.addRule(':host', 'backdrop-filter: blur(5px)', 0);
  if (haInfoDialog && haInfoDialog._styles) {
    haInfoDialog._styles[0].styleSheet.addRule('.mdc-dialog__surface', 'backdrop-filter: blur(5px)', 0);
  }
}, 1000);
