const rollup = require("rollup");
const path = require("path");
const rollupPluginVue = require("rollup-plugin-vue");
const css = require("rollup-plugin-css-only");

async function bundle() {
  const bundle = await rollup.rollup({
    input: [path.join(__dirname, "./App.vue")],
    plugins: [rollupPluginVue({ needMap: true, css: false }), css()],
    external: ["vue"],
    output: {
      sourcemap: "inline",
    },
  });
  const result = await bundle.write({
    output: {
      file: "bundle.js",
      sourcemap: true,
    },
  });
  for (const chunk of result.output) {
    console.log("chunk:", chunk.map); // SourceMap
  }
}
bundle();
