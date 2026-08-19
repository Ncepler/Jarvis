// Pulls a data literal out of a demo's source without running it.
//
// The /start form shows a client the real content their chosen template ships
// with — the FAQ, the services, the words in the scrolling strip — so they can
// edit it in place instead of imagining it. That means reading
// components/demos/*.tsx at request time and lifting the arrays out.
//
// Deliberately a hand-rolled scanner rather than `new Function` or a JSON
// coercion: it can't execute anything a future edit to a demo introduces, and
// it understands exactly the subset the demo data uses (arrays, object
// literals, quoted strings, numbers, booleans, null, comments, trailing
// commas). Anything else returns null, which the form treats as "no template
// content for this section" and falls back to a plain box.

export type Literal =
  | string
  | number
  | boolean
  | null
  | Literal[]
  | { [key: string]: Literal };

// Whitespace and comments, which can sit between any two tokens.
function skip(s: string, i: number): number {
  for (;;) {
    while (i < s.length && /\s/.test(s[i])) i++;
    if (s.startsWith("//", i)) {
      const end = s.indexOf("\n", i);
      if (end < 0) return s.length;
      i = end + 1;
    } else if (s.startsWith("/*", i)) {
      const end = s.indexOf("*/", i);
      if (end < 0) return s.length;
      i = end + 2;
    } else {
      return i;
    }
  }
}

type Step<T> = [T, number] | null;

const ESCAPES: Record<string, string> = { n: "\n", t: "\t", r: "\r" };

function readString(s: string, i: number): Step<string> {
  const quote = s[i++];
  let out = "";
  while (i < s.length) {
    const c = s[i];
    // A backtick string with ${} in it isn't static content, so refuse it
    // rather than handing back a half-resolved template.
    if (quote === "`" && c === "$" && s[i + 1] === "{") return null;
    if (c === "\\") {
      out += ESCAPES[s[i + 1]] ?? s[i + 1];
      i += 2;
    } else if (c === quote) {
      return [out, i + 1];
    } else {
      out += c;
      i++;
    }
  }
  return null;
}

// Comma-separated values up to `close`, tolerating a trailing comma.
function readSeries<T>(
  s: string,
  i: number,
  close: string,
  item: (s: string, i: number) => Step<T>,
): Step<T[]> {
  const out: T[] = [];
  for (;;) {
    i = skip(s, i);
    if (s[i] === close) return [out, i + 1];
    const got = item(s, i);
    if (!got) return null;
    out.push(got[0]);
    i = skip(s, got[1]);
    if (s[i] === ",") i++;
    else if (s[i] !== close) return null;
  }
}

function readEntry(s: string, i: number): Step<[string, Literal]> {
  const quoted = /["'`]/.test(s[i]) ? readString(s, i) : null;
  const bare = quoted ? null : /^[A-Za-z_$][\w$]*/.exec(s.slice(i));
  const key = quoted ? quoted[0] : bare?.[0];
  if (key === undefined) return null;
  const afterKey = skip(s, quoted ? quoted[1] : i + key.length);
  if (s[afterKey] !== ":") return null;
  const value = readValue(s, afterKey + 1);
  return value && [[key, value[0]], value[1]];
}

export function readValue(s: string, i: number): Step<Literal> {
  i = skip(s, i);
  const c = s[i];
  if (c === '"' || c === "'" || c === "`") return readString(s, i);
  if (c === "[") return readSeries(s, i + 1, "]", readValue);
  if (c === "{") {
    const entries = readSeries(s, i + 1, "}", readEntry);
    return entries && [Object.fromEntries(entries[0]), entries[1]];
  }
  const word = /^(true|false|null|-?\d+(?:\.\d+)?)/.exec(s.slice(i));
  if (!word) return null;
  const [t] = word;
  const value = t === "true" ? true : t === "false" ? false : t === "null" ? null : Number(t);
  return [value, i + t.length];
}

const asArray = (got: Step<Literal>) =>
  got && Array.isArray(got[0]) ? got[0] : null;

// `const NAME = [...]` at the top level of a demo file.
export function readConstArray(src: string, name: string): Literal[] | null {
  const decl = new RegExp(`(?:^|\\n)\\s*(?:export\\s+)?const\\s+${name}\\b[^=[]*=\\s*\\[`).exec(src);
  if (!decl) return null;
  return asArray(readValue(src, src.indexOf("[", decl.index + decl[0].length - 1)));
}

// The scrolling strip, written inline in JSX: <DemoMarquee terms={[...]} />.
export function readMarqueeTerms(src: string): Literal[] | null {
  const at = /terms=\{\s*\[/.exec(src);
  return at ? asArray(readValue(src, src.indexOf("[", at.index))) : null;
}
