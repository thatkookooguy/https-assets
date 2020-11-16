// setTimeout(() => {
//   const haCard = customElements.get('ha-card');
//   const haInfoDialog = customElements.get('ha-dialog');
//   haCard._styles[0].styleSheet.addRule(':host', 'backdrop-filter: blur(5px)', 0);
//   if (haInfoDialog && haInfoDialog._styles) {
//     console.log('found dialog card. injecting style to stylesheet 1');
//     haInfoDialog._styles[0].styleSheet.addRule('.mdc-dialog__surface', 'backdrop-filter: blur(5px)', 0);
//   }
// }, 2000);

customElements.whenDefined('ha-dialog').then(() => {
  const haDialog = customElements.get('ha-dialog');

  console.log('found dialog card. injecting style to stylesheet 2!!!');

  haDialog.getStyles()[haDialog.getStyles().length - 1].styleSheet.addRule('.mdc-dialog__surface', 'backdrop-filter: blur(5px)', 0);
});

customElements.whenDefined('ha-card').then(() => {

  // Find the HaChartBase class
  const haCard = customElements.get('ha-card');

  haCard.getStyles()[haCard.getStyles().length - 1].styleSheet.addRule(':host', 'backdrop-filter: blur(5px)', 0);

  // Force lovelace to redraw everything
  const  ev = new Event("ll-rebuild", {
      bubbles: true,
      cancelable: false,
      composed: true,
  });

  let root = document.querySelector("home-assistant");
  root = root && root.shadowRoot;
  root = root && root.querySelector("home-assistant-main");
  root = root && root.shadowRoot;
  root = root && root.querySelector("app-drawer-layout partial-panel-resolver");
  root = root && root.shadowRoot || root;
  root = root && root.querySelector("ha-panel-lovelace");
  root = root && root.shadowRoot;
  root = root && root.querySelector("hui-root");
  root = root && root.shadowRoot;
  root = root && root.querySelector("ha-app-layout #view");
  root = root && root.firstElementChild;
  if (root) root.dispatchEvent(ev);
});