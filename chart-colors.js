// Add this to your lovelace resources as
// url: /local/chart-colors.js
// type: module

customElements.whenDefined('ha-chart-base').then(() => {

  // Find the HaChartBase class
  const HaChartBase = customElements.get('ha-chart-base');

  // Write a new color list generator
  function getColorList(cnt) {
    let retval = [];
    // This one just makes a list of all magenta
    while(cnt--)
      retval.push(Color().rgb(255, 56, 96));
    return retval;
  }
  
function getColorGenerator(t, e) {
  const i = [
    "FF3860",
    "66a61e",
    "377eb8",
    "984ea3",
    "00d2d5",
    "ff7f00",
    "af8d00",
    "7f80cd",
    "b3e900",
    "c42e60",
    "a65628",
    "f781bf",
    "8dd3c7",
    "bebada",
    "fb8072",
    "80b1d3",
    "fdb462",
    "fccde5",
    "bc80bd",
    "ffed6f",
    "c4eaff",
    "cf8c00",
    "1b9e77",
    "d95f02",
    "e7298a",
    "e6ab02",
    "a6761d",
    "0097ff",
    "00d067",
    "f43600",
    "4ba93b",
    "5779bb",
    "927acc",
    "97ee3f",
    "bf3947",
    "9f5b00",
    "f48758",
    "8caed6",
    "f2b94f",
    "eff26e",
    "e43872",
    "d9b100",
    "9d7a00",
    "698cff",
    "d9d9d9",
    "00d27e",
    "d06800",
    "009f82",
    "c49200",
    "cbe8ff",
    "fecddf",
    "c27eb6",
    "8cd2ce",
    "c4b8d9",
    "f883b0",
    "a49100",
    "f48800",
    "27d0df",
    "a04a9b",
  ];
  function a(t) {
    return Color("#" + i[t % i.length]);
  }
  const s = {};
  let n = 0;
  return (
    e > 0 && (n = e),
    t &&
      Object.keys(t).forEach((e) => {
        const i = t[e];
        isFinite(i)
          ? (s[e.toLowerCase()] = a(i))
          : (s[e.toLowerCase()] = Color(t[e]));
      }),
    function (t, e) {
      let i;
      const r = e[3];
      if (null === r) return Color().hsl(0, 40, 38);
      if (void 0 === r) return Color().hsl(120, 40, 38);
      const o = r.toLowerCase();
      return (
        void 0 === i && (i = s[o]),
        void 0 === i && ((i = a(n)), n++, (s[o] = i)),
        i
      );
    }
  );
}


  // Replace the color list generator in the base class
  HaChartBase.getColorGenerator = getColorGenerator;
  HaChartBase.getColorList = getColorList;

  // Force lovelace to redraw everything
  const  ev = new Event("ll-rebuild", {
      bubbles: true,
      cancelable: false,
      composed: true,
  });
  var root = document.querySelector("home-assistant");
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
