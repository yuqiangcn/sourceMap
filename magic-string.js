import { writeFileSync } from "fs";
import MagicString from "magic-string";
const s = new MagicString("problems = 99");

s.overwrite(0, 8, "answer");
s.toString(); // 'answer = 99'

s.overwrite(11, 13, "42"); // character indices always refer to the original string
s.toString(); // 'answer = 42'

s.prepend("var ").append(";"); // most methods are chainable
s.toString(); // 'var answer = 42;'

const map = s.generateMap({
  source: "source.js",
  file: "converted.js.map",
  includeContent: true,
}); // generates a v3 SourceMap

console.log("code:", s.toString());
console.log("map:", map);
writeFileSync("./magic-string.js.map", JSON.stringify(map));
