const { readFile } = require("fs");
const readFileAsync = require("util").promisify(readFile);

async function decode() {
  // vlq 解码
  const { decode } = require("vlq");
  const map = await readFileAsync("./test.js.map");
  const mappings = JSON.parse(map).mappings;
  console.log("mappings:", mappings);
  /**
   * @type {string[]}
   */
  const lines = mappings.split(";");
  const decodeLines = lines.map((line) => {
    const segments = line.split(",");
    const decodedSeg = segments.map((x) => {
      return decode(x);
    });
    return decodedSeg;
  });
  console.log(decodeLines);

  // 还原绝对位置索引
  const absSegment = [0, 0, 0, 0];
  const decoded = decodeLines.map((line) => {
    absSegment[0] = 0; // 每行的第一个segment的位置要重置
    if (line.length == 0) {
      return [];
    }
    const absoluteSegment = line.map((segment) => {
      const result = [];
      for (let i = 0; i < segment.length; i++) {
        absSegment[i] += segment[i];
        console.log(absSegment[i]);
        result.push(absSegment[i]);
      }
      return result;
    });
    return absoluteSegment;
  });
  console.log("decoded:", decoded);
}

decode();
