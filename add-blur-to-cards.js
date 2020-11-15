setTimeout(() => {
  const haCard = customElements.get('ha-card');
  const haInfoDialog = customElements.get('ha-more-info-dialog');
  haCard._styles[0].styleSheet.addRule(':host', 'backdrop-filter: blur(5px)', 0);
  if (haInfoDialog && haInfoDialog._styles) {
    haInfoDialog._styles[0].styleSheet.addRule(':host', 'backdrop-filter: blur(5px)', 0);
  }
}, 1000);
