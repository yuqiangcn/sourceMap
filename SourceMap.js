const { codeFrameColumns } = require("@babel/code-frame");

class SourceMap {
  constructor(rawMap) {
    this.decode(rawMap);
    this.rawMap = rawMap;
  }

  /**
   *
   * @param {number} line
   * @param {number} column
   */
  originalPositionFor(line, column) {
    const lineInfo = this.decoded[line];
    if (!lineInfo) {
      throw new Error(`不存在该行信息:${line}`);
    }
    const columnInfo = lineInfo[column];
    for (const seg of lineInfo) {
      // 列号匹配
      if (seg[0] === column) {
        const [column, sourceIdx, origLine, origColumn] = seg;
        const source = this.rawMap.sources[sourceIdx];
        const sourceContent = this.rawMap.sourcesContent[sourceIdx];
        const result = codeFrameColumns(
          sourceContent,
          {
            start: {
              line: origLine + 1,
              column: origColumn + 1,
            },
          },
          { forceColor: true }
        );
        return {
          source,
          line: origLine,
          column: origColumn,
          frame: result,
        };
      }
    }
    throw new Error(`不存在该行列号信息:${line},${column}`);
  }

  decode(rawMap) {
    const { mappings } = rawMap;
    const { decode } = require("vlq");
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
    const absSegment = [0, 0, 0, 0, 0];
    const decoded = decodeLines.map((line) => {
      absSegment[0] = 0; // 每行的第一个segment的位置要重置
      if (line.length == 0) {
        return [];
      }
      const absoluteSegment = line.map((segment) => {
        const result = [];
        for (let i = 0; i < segment.length; i++) {
          absSegment[i] += segment[i];
          result.push(absSegment[i]);
        }
        return result;
      });
      return absoluteSegment;
    });
    this.decoded = decoded;
  }
}

const { readFileSync } = require("fs");

const consumer = new SourceMap(JSON.parse(readFileSync("./test.js.map")));

console.log(consumer.originalPositionFor(0, 21).frame);
