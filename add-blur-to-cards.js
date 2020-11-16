// setTimeout(() => {
//   const haCard = customElements.get('ha-card');
//   const haInfoDialog = customElements.get('ha-dialog');
//   haCard._styles[0].styleSheet.addRule(':host', 'backdrop-filter: blur(5px)', 0);
//   if (haInfoDialog && haInfoDialog._styles) {
//     console.log('found dialog card. injecting style to stylesheet 1');
//     haInfoDialog._styles[0].styleSheet.addRule('.mdc-dialog__surface', 'backdrop-filter: blur(5px)', 0);
//   }
// }, 2000);

Promise.resolve()
  .then(() => customElements.whenDefined("ha-card"))
  .then(() => {
    // Find the HaChartBase class
    const haCard = customElements.get("ha-card");
    insertStyleRule(haCard, ':host { backdrop-filter: blur(5px) }');
    // haCard._styles[0].styleSheet.insertRule(":host { backdrop-filter: blur(5px) }", 0);
  })
  .then(() => customElements.whenDefined("ha-dialog"))
  .then(() => {
    const haDialog = customElements.get("ha-dialog");
    insertStyleRule(haDialog, '.mdc-dialog__surface { backdrop-filter: blur(5px); }');
    // getFistStyle(haDialog).insertRule('.mdc-dialog__surface { backdrop-filter: blur(5px); }');
  })
  // .then(() => addStyle())
  .then(() => {
    // Force lovelace to redraw everything
    const ev = new Event("ll-rebuild", {
      bubbles: true,
      cancelable: false,
      composed: true,
    });

    let root = document.querySelector("home-assistant");
    root = root && root.shadowRoot;
    root = root && root.querySelector("home-assistant-main");
    root = root && root.shadowRoot;
    root =
      root && root.querySelector("app-drawer-layout partial-panel-resolver");
    root = (root && root.shadowRoot) || root;
    root = root && root.querySelector("ha-panel-lovelace");
    root = root && root.shadowRoot;
    root = root && root.querySelector("hui-root");
    root = root && root.shadowRoot;
    root = root && root.querySelector("ha-app-layout #view");
    root = root && root.firstElementChild;
    if (root) root.dispatchEvent(ev);
  });

function insertStyleRule(card, rule) {
  const newWay = Array.isArray(card.getStyles())
    ? card.getStyles()[0].styleSheet
    : card.getStyles().styleSheet;

  const oldWay = card._styles[0].styleSheet;

  newWay.insertRule(rule);
  oldWay.insertRule(rule, 0);
}

function waitP(timeout) {
  return new Promise((resolve) => setTimeout(() => resolve(), timeout || 1000));
}

function addStyle() {
  return Promise.resolve()
  .then(() => {
  const haDialog = customElements.get("ha-dialog");

  console.log(haDialog.styles);

    console.log("found dialog card. injecting style to stylesheet 2!!!");

    if (!haDialog.getStyles() || !haDialog.getStyles()[0]) {
      console.log('waiting!');
      return waitP().then(() => addStyle());
    }

    haDialog.getStyles()[0].styleSheet.insertRule('.mdc-dialog__surface { backdrop-filter: blur(5px); }');
  })
}