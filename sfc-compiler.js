const { parse } = require("@vue/compiler-sfc");
const fs = require("fs");
const path = require("path");

async function main() {
  const content = fs.readFileSync(path.join(__dirname, "./App.vue"), "utf-8");
  const sfcRecord = parse(content);
  const map = sfcRecord.descriptor["styles"][0].map;
  console.log("sfc:", map); // 打印style的SourceMap
}

main();
