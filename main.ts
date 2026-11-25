// Have You Tried Turning It Off? — one-line IT-support joke entry.
//
// The program writes a single funny line — a hopeless tech-support agent
// talking to a desperate customer — to /output/entry.txt, prints it, and
// refuses to write anything that would fail the sealed gate (UTF-8 text,
// 1 to 199 characters, not only whitespace, a single line).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Have you tried turning it off and on again? If that fails, I'll escalate you to my supervisor, who'll ask you to turn it off and on again — but in a deeper voice.";

function gate(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 199) {
    throw new Error(`gate failed: entry is ${chars} characters (need 1-199)`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate failed: entry must be a single line");
  }
  // The sealed gate reads the file as UTF-8; fail here if the text does
  // not survive a UTF-8 round-trip or would gain a trailing newline.
  const roundTrip = Buffer.from(text, "utf8").toString("utf8");
  if (roundTrip !== text) {
    throw new Error("gate failed: entry is not clean UTF-8 text");
  }
  if (text !== text.trim()) {
    throw new Error("gate failed: entry has leading or trailing whitespace");
  }
}

function main(): void {
  gate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  console.log(ENTRY);
  console.log(`wrote ${[...ENTRY].length} chars to ${outPath}`);
}

main();
