var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// dist/worker.js
function escapeHtml(text) {
  if (!text) return "";
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
__name(escapeHtml, "escapeHtml");
function getCookie(request, name) {
  const cookieString = request.headers.get("Cookie");
  if (!cookieString) return null;
  const cookies = cookieString.split(";");
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === name) {
      return value;
    }
  }
  return null;
}
__name(getCookie, "getCookie");
function setCookie(response, name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const cookieString = `${name}=${value}; expires=${expires}; path=/; HttpOnly; SameSite=Lax`;
  response.headers.append("Set-Cookie", cookieString);
}
__name(setCookie, "setCookie");
function isAuthenticated(request) {
  const token = getCookie(request, "admin_token");
  return token === "secret-admin-token";
}
__name(isAuthenticated, "isAuthenticated");
function M() {
  return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
}
__name(M, "M");
var T = M();
function N(l3) {
  T = l3;
}
__name(N, "N");
var _ = { exec: /* @__PURE__ */ __name(() => null, "exec") };
function E(l3) {
  let e = [];
  return (t) => {
    let n = Math.max(0, Math.min(3, t - 1)), s = e[n];
    return s || (s = l3(n), e[n] = s), s;
  };
}
__name(E, "E");
function d(l3, e = "") {
  let t = typeof l3 == "string" ? l3 : l3.source, n = { replace: /* @__PURE__ */ __name((s, r) => {
    let i = typeof r == "string" ? r : r.source;
    return i = i.replace(m.caret, "$1"), t = t.replace(s, i), n;
  }, "replace"), getRegex: /* @__PURE__ */ __name(() => new RegExp(t, e), "getRegex") };
  return n;
}
__name(d, "d");
var Te = ((l3 = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + l3);
  } catch {
    return false;
  }
})();
var m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: /* @__PURE__ */ __name((l3) => new RegExp(`^( {0,3}${l3})((?:[	 ][^\\n]*)?(?:\\n|$))`), "listItemRegex"), nextBulletRegex: E((l3) => new RegExp(`^ {0,${l3}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)), hrRegex: E((l3) => new RegExp(`^ {0,${l3}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)), fencesBeginRegex: E((l3) => new RegExp(`^ {0,${l3}}(?:\`\`\`|~~~)`)), headingBeginRegex: E((l3) => new RegExp(`^ {0,${l3}}#`)), htmlBeginRegex: E((l3) => new RegExp(`^ {0,${l3}}<(?:[a-z].*>|!--)`, "i")), blockquoteBeginRegex: E((l3) => new RegExp(`^ {0,${l3}}>`)) };
var Oe = /^(?:[ \t]*(?:\n|$))+/;
var we = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
var ye = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var B = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var Pe = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var j = / {0,3}(?:[*+-]|\d{1,9}[.)])/;
var oe = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
var ae = d(oe).replace(/bull/g, j).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
var Se = d(oe).replace(/bull/g, j).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
var F = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
var $e = /^[^\n]+/;
var U = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
var Le = d(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", U).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var _e = d(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, j).getRegex();
var H = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var K = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var ze = d("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", K).replace("tag", H).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var le = d(F).replace("hr", B).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", H).getRegex();
var Me = d(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", le).getRegex();
var W = { blockquote: Me, code: we, def: Le, fences: ye, heading: Pe, hr: B, html: ze, lheading: ae, list: _e, newline: Oe, paragraph: le, table: _, text: $e };
var se = d("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", B).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", H).getRegex();
var Ee = { ...W, lheading: Se, table: se, paragraph: d(F).replace("hr", B).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", se).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", H).getRegex() };
var Ie = { ...W, html: d(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", K).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: _, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: d(F).replace("hr", B).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ae).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() };
var Ae = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var Ce = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var ue = /^( {2,}|\\)\n(?!\s*$)/;
var Be = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var I = /[\p{P}\p{S}]/u;
var Z = /[\s\p{P}\p{S}]/u;
var X = /[^\s\p{P}\p{S}]/u;
var De = d(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Z).getRegex();
var pe = /(?!~)[\p{P}\p{S}]/u;
var qe = /(?!~)[\s\p{P}\p{S}]/u;
var ve = /(?:[^\s\p{P}\p{S}]|~)/u;
var He = d(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Te ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex();
var ce = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/;
var Ze = d(ce, "u").replace(/punct/g, I).getRegex();
var Ge = d(ce, "u").replace(/punct/g, pe).getRegex();
var he = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
var Ne = d(he, "gu").replace(/notPunctSpace/g, X).replace(/punctSpace/g, Z).replace(/punct/g, I).getRegex();
var Qe = d(he, "gu").replace(/notPunctSpace/g, ve).replace(/punctSpace/g, qe).replace(/punct/g, pe).getRegex();
var je = d("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, X).replace(/punctSpace/g, Z).replace(/punct/g, I).getRegex();
var Fe = d(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, I).getRegex();
var Ue = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)";
var Ke = d(Ue, "gu").replace(/notPunctSpace/g, X).replace(/punctSpace/g, Z).replace(/punct/g, I).getRegex();
var We = d(/\\(punct)/, "gu").replace(/punct/g, I).getRegex();
var Xe = d(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var Je = d(K).replace("(?:-->|$)", "-->").getRegex();
var Ve = d("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Je).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var v = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/;
var Ye = d(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", v).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var ke = d(/^!?\[(label)\]\[(ref)\]/).replace("label", v).replace("ref", U).getRegex();
var de = d(/^!?\[(ref)\](?:\[\])?/).replace("ref", U).getRegex();
var et = d("reflink|nolink(?!\\()", "g").replace("reflink", ke).replace("nolink", de).getRegex();
var ie = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
var J = { _backpedal: _, anyPunctuation: We, autolink: Xe, blockSkip: He, br: ue, code: Ce, del: _, delLDelim: _, delRDelim: _, emStrongLDelim: Ze, emStrongRDelimAst: Ne, emStrongRDelimUnd: je, escape: Ae, link: Ye, nolink: de, punctuation: De, reflink: ke, reflinkSearch: et, tag: Ve, text: Be, url: _ };
var tt = { ...J, link: d(/^!?\[(label)\]\((.*?)\)/).replace("label", v).getRegex(), reflink: d(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", v).getRegex() };
var Q = { ...J, emStrongRDelimAst: Qe, emStrongLDelim: Ge, delLDelim: Fe, delRDelim: Ke, url: d(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", ie).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: d(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", ie).getRegex() };
var nt = { ...Q, br: d(ue).replace("{2,}", "*").getRegex(), text: d(Q.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
var D = { normal: W, gfm: Ee, pedantic: Ie };
var A = { normal: J, gfm: Q, breaks: nt, pedantic: tt };
var rt = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
var ge = /* @__PURE__ */ __name((l3) => rt[l3], "ge");
function O(l3, e) {
  if (e) {
    if (m.escapeTest.test(l3)) return l3.replace(m.escapeReplace, ge);
  } else if (m.escapeTestNoEncode.test(l3)) return l3.replace(m.escapeReplaceNoEncode, ge);
  return l3;
}
__name(O, "O");
function V(l3) {
  try {
    l3 = encodeURI(l3).replace(m.percentDecode, "%");
  } catch {
    return null;
  }
  return l3;
}
__name(V, "V");
function Y(l3, e) {
  let t = l3.replace(m.findPipe, (r, i, o) => {
    let u = false, a = i;
    for (; --a >= 0 && o[a] === "\\"; ) u = !u;
    return u ? "|" : " |";
  }), n = t.split(m.splitPipe), s = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; s < n.length; s++) n[s] = n[s].trim().replace(m.slashPipe, "|");
  return n;
}
__name(Y, "Y");
function $(l3, e, t) {
  let n = l3.length;
  if (n === 0) return "";
  let s = 0;
  for (; s < n; ) {
    let r = l3.charAt(n - s - 1);
    if (r === e && !t) s++;
    else if (r !== e && t) s++;
    else break;
  }
  return l3.slice(0, n - s);
}
__name($, "$");
function ee(l3) {
  let e = l3.split(`
`), t = e.length - 1;
  for (; t >= 0 && m.blankLine.test(e[t]); ) t--;
  return e.length - t <= 2 ? l3 : e.slice(0, t + 1).join(`
`);
}
__name(ee, "ee");
function fe(l3, e) {
  if (l3.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let n = 0; n < l3.length; n++) if (l3[n] === "\\") n++;
  else if (l3[n] === e[0]) t++;
  else if (l3[n] === e[1] && (t--, t < 0)) return n;
  return t > 0 ? -2 : -1;
}
__name(fe, "fe");
function me(l3, e = 0) {
  let t = e, n = "";
  for (let s of l3) if (s === "	") {
    let r = 4 - t % 4;
    n += " ".repeat(r), t += r;
  } else n += s, t++;
  return n;
}
__name(me, "me");
function xe(l3, e, t, n, s) {
  let r = e.href, i = e.title || null, o = l3[1].replace(s.other.outputLinkReplace, "$1");
  n.state.inLink = true;
  let u = { type: l3[0].charAt(0) === "!" ? "image" : "link", raw: t, href: r, title: i, text: o, tokens: n.inlineTokens(o) };
  return n.state.inLink = false, u;
}
__name(xe, "xe");
function st(l3, e, t) {
  let n = l3.match(t.other.indentCodeCompensation);
  if (n === null) return e;
  let s = n[1];
  return e.split(`
`).map((r) => {
    let i = r.match(t.other.beginningSpace);
    if (i === null) return r;
    let [o] = i;
    return o.length >= s.length ? r.slice(s.length) : r;
  }).join(`
`);
}
__name(st, "st");
var w = class {
  static {
    __name(this, "w");
  }
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || T;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = this.options.pedantic ? t[0] : ee(t[0]), s = n.replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: n, codeBlockStyle: "indented", text: s };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], s = st(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: s };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let s = $(n, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (n = s.trim());
      }
      return { type: "heading", raw: $(t[0], `
`), depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: $(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = $(t[0], `
`).split(`
`), s = "", r = "", i = [];
      for (; n.length > 0; ) {
        let o = false, u = [], a;
        for (a = 0; a < n.length; a++) if (this.rules.other.blockquoteStart.test(n[a])) u.push(n[a]), o = true;
        else if (!o) u.push(n[a]);
        else break;
        n = n.slice(a);
        let c = u.join(`
`), p = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${c}` : c, r = r ? `${r}
${p}` : p;
        let k = this.lexer.state.top;
        if (this.lexer.state.top = true, this.lexer.blockTokens(p, i, true), this.lexer.state.top = k, n.length === 0) break;
        let h = i.at(-1);
        if (h?.type === "code") break;
        if (h?.type === "blockquote") {
          let R = h, f = R.raw + `
` + n.join(`
`), S = this.blockquote(f);
          i[i.length - 1] = S, s = s.substring(0, s.length - R.raw.length) + S.raw, r = r.substring(0, r.length - R.text.length) + S.text;
          break;
        } else if (h?.type === "list") {
          let R = h, f = R.raw + `
` + n.join(`
`), S = this.list(f);
          i[i.length - 1] = S, s = s.substring(0, s.length - h.raw.length) + S.raw, r = r.substring(0, r.length - R.raw.length) + S.raw, n = f.substring(i.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: s, tokens: i, text: r };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let n = t[1].trim(), s = n.length > 1, r = { type: "list", raw: "", ordered: s, start: s ? +n.slice(0, -1) : "", loose: false, items: [] };
      n = s ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = s ? n : "[*+-]");
      let i = this.rules.other.listItemRegex(n), o = false;
      for (; e; ) {
        let a = false, c = "", p = "";
        if (!(t = i.exec(e)) || this.rules.block.hr.test(e)) break;
        c = t[0], e = e.substring(c.length);
        let k = me(t[2].split(`
`, 1)[0], t[1].length), h = e.split(`
`, 1)[0], R = !k.trim(), f = 0;
        if (this.options.pedantic ? (f = 2, p = k.trimStart()) : R ? f = t[1].length + 1 : (f = k.search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, p = k.slice(f), f += t[1].length), R && this.rules.other.blankLine.test(h) && (c += h + `
`, e = e.substring(h.length + 1), a = true), !a) {
          let S = this.rules.other.nextBulletRegex(f), te = this.rules.other.hrRegex(f), ne = this.rules.other.fencesBeginRegex(f), re = this.rules.other.headingBeginRegex(f), be = this.rules.other.htmlBeginRegex(f), Re = this.rules.other.blockquoteBeginRegex(f);
          for (; e; ) {
            let G = e.split(`
`, 1)[0], C;
            if (h = G, this.options.pedantic ? (h = h.replace(this.rules.other.listReplaceNesting, "  "), C = h) : C = h.replace(this.rules.other.tabCharGlobal, "    "), ne.test(h) || re.test(h) || be.test(h) || Re.test(h) || S.test(h) || te.test(h)) break;
            if (C.search(this.rules.other.nonSpaceChar) >= f || !h.trim()) p += `
` + C.slice(f);
            else {
              if (R || k.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || ne.test(k) || re.test(k) || te.test(k)) break;
              p += `
` + h;
            }
            R = !h.trim(), c += G + `
`, e = e.substring(G.length + 1), k = C.slice(f);
          }
        }
        r.loose || (o ? r.loose = true : this.rules.other.doubleBlankLine.test(c) && (o = true)), r.items.push({ type: "list_item", raw: c, task: !!this.options.gfm && this.rules.other.listIsTask.test(p), loose: false, text: p, tokens: [] }), r.raw += c;
      }
      let u = r.items.at(-1);
      if (u) u.raw = u.raw.trimEnd(), u.text = u.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let a of r.items) {
        this.lexer.state.top = false, a.tokens = this.lexer.blockTokens(a.text, []);
        let c = a.tokens[0];
        if (a.task && (c?.type === "text" || c?.type === "paragraph")) {
          a.text = a.text.replace(this.rules.other.listReplaceTask, ""), c.raw = c.raw.replace(this.rules.other.listReplaceTask, ""), c.text = c.text.replace(this.rules.other.listReplaceTask, "");
          for (let k = this.lexer.inlineQueue.length - 1; k >= 0; k--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[k].src)) {
            this.lexer.inlineQueue[k].src = this.lexer.inlineQueue[k].src.replace(this.rules.other.listReplaceTask, "");
            break;
          }
          let p = this.rules.other.listTaskCheckbox.exec(a.raw);
          if (p) {
            let k = { type: "checkbox", raw: p[0] + " ", checked: p[0] !== "[ ]" };
            a.checked = k.checked, r.loose ? a.tokens[0] && ["paragraph", "text"].includes(a.tokens[0].type) && "tokens" in a.tokens[0] && a.tokens[0].tokens ? (a.tokens[0].raw = k.raw + a.tokens[0].raw, a.tokens[0].text = k.raw + a.tokens[0].text, a.tokens[0].tokens.unshift(k)) : a.tokens.unshift({ type: "paragraph", raw: k.raw, text: k.raw, tokens: [k] }) : a.tokens.unshift(k);
          }
        } else a.task && (a.task = false);
        if (!r.loose) {
          let p = a.tokens.filter((h) => h.type === "space"), k = p.length > 0 && p.some((h) => this.rules.other.anyLine.test(h.raw));
          r.loose = k;
        }
      }
      if (r.loose) for (let a of r.items) {
        a.loose = true;
        for (let c of a.tokens) c.type === "text" && (c.type = "paragraph");
      }
      return r;
    }
  }
  html(e) {
    let t = this.rules.block.html.exec(e);
    if (t) {
      let n = ee(t[0]);
      return { type: "html", block: true, raw: n, pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: n };
    }
  }
  def(e) {
    let t = this.rules.block.def.exec(e);
    if (t) {
      let n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return { type: "def", tag: n, raw: $(t[0], `
`), href: s, title: r };
    }
  }
  table(e) {
    let t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
    let n = Y(t[1]), s = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: $(t[0], `
`), header: [], align: [], rows: [] };
    if (n.length === s.length) {
      for (let o of s) this.rules.other.tableAlignRight.test(o) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(o) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(o) ? i.align.push("left") : i.align.push(null);
      for (let o = 0; o < n.length; o++) i.header.push({ text: n[o], tokens: this.lexer.inline(n[o]), header: true, align: i.align[o] });
      for (let o of r) i.rows.push(Y(o, i.header.length).map((u, a) => ({ text: u, tokens: this.lexer.inline(u), header: false, align: i.align[a] })));
      return i;
    }
  }
  lheading(e) {
    let t = this.rules.block.lheading.exec(e);
    if (t) {
      let n = t[1].trim();
      return { type: "heading", raw: $(t[0], `
`), depth: t[2].charAt(0) === "=" ? 1 : 2, text: n, tokens: this.lexer.inline(n) };
    }
  }
  paragraph(e) {
    let t = this.rules.block.paragraph.exec(e);
    if (t) {
      let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
    }
  }
  text(e) {
    let t = this.rules.block.text.exec(e);
    if (t) return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
  }
  escape(e) {
    let t = this.rules.inline.escape.exec(e);
    if (t) return { type: "escape", raw: t[0], text: t[1] };
  }
  tag(e) {
    let t = this.rules.inline.tag.exec(e);
    if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t[0] };
  }
  link(e) {
    let t = this.rules.inline.link.exec(e);
    if (t) {
      let n = t[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n)) return;
        let i = $(n.slice(0, -1), "\\");
        if ((n.length - i.length) % 2 === 0) return;
      } else {
        let i = fe(t[2], "()");
        if (i === -2) return;
        if (i > -1) {
          let u = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + i;
          t[2] = t[2].substring(0, i), t[0] = t[0].substring(0, u).trim(), t[3] = "";
        }
      }
      let s = t[2], r = "";
      if (this.options.pedantic) {
        let i = this.rules.other.pedanticHrefTitle.exec(s);
        i && (s = i[1], r = i[3]);
      } else r = t[3] ? t[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? s = s.slice(1) : s = s.slice(1, -1)), xe(t, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
    }
  }
  reflink(e, t) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
      let s = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = t[s.toLowerCase()];
      if (!r) {
        let i = n[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return xe(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let s = this.rules.inline.emStrongLDelim.exec(e);
    if (!s || !s[1] && !s[2] && !s[3] && !s[4] || s[4] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(s[1] || s[3] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      let i = [...s[0]].length - 1, o, u, a = i, c = 0, p = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (p.lastIndex = 0, t = t.slice(-1 * e.length + i); (s = p.exec(t)) !== null; ) {
        if (o = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !o) continue;
        if (u = [...o].length, s[3] || s[4]) {
          a += u;
          continue;
        } else if ((s[5] || s[6]) && i % 3 && !((i + u) % 3)) {
          c += u;
          continue;
        }
        if (a -= u, a > 0) continue;
        u = Math.min(u, u + a + c);
        let k = [...s[0]][0].length, h = e.slice(0, i + s.index + k + u);
        if (Math.min(i, u) % 2) {
          let f = h.slice(1, -1);
          return { type: "em", raw: h, text: f, tokens: this.lexer.inlineTokens(f) };
        }
        let R = h.slice(2, -2);
        return { type: "strong", raw: h, text: R, tokens: this.lexer.inlineTokens(R) };
      }
    }
  }
  codespan(e) {
    let t = this.rules.inline.code.exec(e);
    if (t) {
      let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), s = this.rules.other.nonSpaceChar.test(n), r = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return s && r && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n };
    }
  }
  br(e) {
    let t = this.rules.inline.br.exec(e);
    if (t) return { type: "br", raw: t[0] };
  }
  del(e, t, n = "") {
    let s = this.rules.inline.delLDelim.exec(e);
    if (!s) return;
    if (!(s[1] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      let i = [...s[0]].length - 1, o, u, a = i, c = this.rules.inline.delRDelim;
      for (c.lastIndex = 0, t = t.slice(-1 * e.length + i); (s = c.exec(t)) !== null; ) {
        if (o = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !o || (u = [...o].length, u !== i)) continue;
        if (s[3] || s[4]) {
          a += u;
          continue;
        }
        if (a -= u, a > 0) continue;
        u = Math.min(u, u + a);
        let p = [...s[0]][0].length, k = e.slice(0, i + s.index + p + u), h = k.slice(i, -i);
        return { type: "del", raw: k, text: h, tokens: this.lexer.inlineTokens(h) };
      }
    }
  }
  autolink(e) {
    let t = this.rules.inline.autolink.exec(e);
    if (t) {
      let n, s;
      return t[2] === "@" ? (n = t[1], s = "mailto:" + n) : (n = t[1], s = n), { type: "link", raw: t[0], text: n, href: s, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(e) {
    let t;
    if (t = this.rules.inline.url.exec(e)) {
      let n, s;
      if (t[2] === "@") n = t[0], s = "mailto:" + n;
      else {
        let r;
        do
          r = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
        while (r !== t[0]);
        n = t[0], t[1] === "www." ? s = "http://" + t[0] : s = t[0];
      }
      return { type: "link", raw: t[0], text: n, href: s, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(e) {
    let t = this.rules.inline.text.exec(e);
    if (t) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: t[0], text: t[0], escaped: n };
    }
  }
};
var x = class l {
  static {
    __name(this, "l");
  }
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || T, this.options.tokenizer = this.options.tokenizer || new w(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
    let t = { other: m, block: D.normal, inline: A.normal };
    this.options.pedantic ? (t.block = D.pedantic, t.inline = A.pedantic) : this.options.gfm && (t.block = D.gfm, this.options.breaks ? t.inline = A.breaks : t.inline = A.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: D, inline: A };
  }
  static lex(e, t) {
    return new l(t).lex(e);
  }
  static lexInline(e, t) {
    return new l(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(m.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let n = this.inlineQueue[t];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], n = false) {
    this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, ""));
    let s = 1 / 0;
    for (; e; ) {
      if (e.length < s) s = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      let r;
      if (this.options.extensions?.block?.some((o) => (r = o.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), true) : false)) continue;
      if (r = this.tokenizer.space(e)) {
        e = e.substring(r.raw.length);
        let o = t.at(-1);
        r.raw.length === 1 && o !== void 0 ? o.raw += `
` : t.push(r);
        continue;
      }
      if (r = this.tokenizer.code(e)) {
        e = e.substring(r.raw.length);
        let o = t.at(-1);
        o?.type === "paragraph" || o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.text, this.inlineQueue.at(-1).src = o.text) : t.push(r);
        continue;
      }
      if (r = this.tokenizer.fences(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.heading(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.hr(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.blockquote(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.list(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.html(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.def(e)) {
        e = e.substring(r.raw.length);
        let o = t.at(-1);
        o?.type === "paragraph" || o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.raw, this.inlineQueue.at(-1).src = o.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, t.push(r));
        continue;
      }
      if (r = this.tokenizer.table(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.lheading(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      let i = e;
      if (this.options.extensions?.startBlock) {
        let o = 1 / 0, u = e.slice(1), a;
        this.options.extensions.startBlock.forEach((c) => {
          a = c.call({ lexer: this }, u), typeof a == "number" && a >= 0 && (o = Math.min(o, a));
        }), o < 1 / 0 && o >= 0 && (i = e.substring(0, o + 1));
      }
      if (this.state.top && (r = this.tokenizer.paragraph(i))) {
        let o = t.at(-1);
        n && o?.type === "paragraph" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
        continue;
      }
      if (r = this.tokenizer.text(e)) {
        e = e.substring(r.raw.length);
        let o = t.at(-1);
        o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : t.push(r);
        continue;
      }
      if (e) {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
    }
    return this.state.top = true, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  inlineTokens(e, t = []) {
    this.tokenizer.lexer = this;
    let n = e, s = null;
    if (this.tokens.links) {
      let a = Object.keys(this.tokens.links);
      if (a.length > 0) for (; (s = this.tokenizer.rules.inline.reflinkSearch.exec(n)) !== null; ) a.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (s = this.tokenizer.rules.inline.anyPunctuation.exec(n)) !== null; ) n = n.slice(0, s.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let r;
    for (; (s = this.tokenizer.rules.inline.blockSkip.exec(n)) !== null; ) r = s[2] ? s[2].length : 0, n = n.slice(0, s.index + r) + "[" + "a".repeat(s[0].length - r - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
    let i = false, o = "", u = 1 / 0;
    for (; e; ) {
      if (e.length < u) u = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      i || (o = ""), i = false;
      let a;
      if (this.options.extensions?.inline?.some((p) => (a = p.call({ lexer: this }, e, t)) ? (e = e.substring(a.raw.length), t.push(a), true) : false)) continue;
      if (a = this.tokenizer.escape(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.tag(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.link(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(a.raw.length);
        let p = t.at(-1);
        a.type === "text" && p?.type === "text" ? (p.raw += a.raw, p.text += a.text) : t.push(a);
        continue;
      }
      if (a = this.tokenizer.emStrong(e, n, o)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.codespan(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.br(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.del(e, n, o)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.autolink(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (!this.state.inLink && (a = this.tokenizer.url(e))) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      let c = e;
      if (this.options.extensions?.startInline) {
        let p = 1 / 0, k = e.slice(1), h;
        this.options.extensions.startInline.forEach((R) => {
          h = R.call({ lexer: this }, k), typeof h == "number" && h >= 0 && (p = Math.min(p, h));
        }), p < 1 / 0 && p >= 0 && (c = e.substring(0, p + 1));
      }
      if (a = this.tokenizer.inlineText(c)) {
        e = e.substring(a.raw.length), a.raw.slice(-1) !== "_" && (o = a.raw.slice(-1)), i = true;
        let p = t.at(-1);
        p?.type === "text" ? (p.raw += a.raw, p.text += a.text) : t.push(a);
        continue;
      }
      if (e) {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
    }
    return t;
  }
  infiniteLoopError(e) {
    let t = "Infinite loop on byte: " + e;
    if (this.options.silent) console.error(t);
    else throw new Error(t);
  }
};
var y = class {
  static {
    __name(this, "y");
  }
  options;
  parser;
  constructor(e) {
    this.options = e || T;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let s = (t || "").match(m.notSpaceStart)?.[0], r = e.replace(m.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + O(s) + '">' + (n ? r : O(r, true)) + `</code></pre>
` : "<pre><code>" + (n ? r : O(r, true)) + `</code></pre>
`;
  }
  blockquote({ tokens: e }) {
    return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
  }
  html({ text: e }) {
    return e;
  }
  def(e) {
    return "";
  }
  heading({ tokens: e, depth: t }) {
    return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
  }
  hr(e) {
    return `<hr>
`;
  }
  list(e) {
    let t = e.ordered, n = e.start, s = "";
    for (let o = 0; o < e.items.length; o++) {
      let u = e.items[o];
      s += this.listitem(u);
    }
    let r = t ? "ol" : "ul", i = t && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + r + i + `>
` + s + "</" + r + `>
`;
  }
  listitem(e) {
    return `<li>${this.parser.parse(e.tokens)}</li>
`;
  }
  checkbox({ checked: e }) {
    return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: e }) {
    return `<p>${this.parser.parseInline(e)}</p>
`;
  }
  table(e) {
    let t = "", n = "";
    for (let r = 0; r < e.header.length; r++) n += this.tablecell(e.header[r]);
    t += this.tablerow({ text: n });
    let s = "";
    for (let r = 0; r < e.rows.length; r++) {
      let i = e.rows[r];
      n = "";
      for (let o = 0; o < i.length; o++) n += this.tablecell(i[o]);
      s += this.tablerow({ text: n });
    }
    return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + s + `</table>
`;
  }
  tablerow({ text: e }) {
    return `<tr>
${e}</tr>
`;
  }
  tablecell(e) {
    let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
    return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
  }
  strong({ tokens: e }) {
    return `<strong>${this.parser.parseInline(e)}</strong>`;
  }
  em({ tokens: e }) {
    return `<em>${this.parser.parseInline(e)}</em>`;
  }
  codespan({ text: e }) {
    return `<code>${O(e, true)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let s = this.parser.parseInline(n), r = V(e);
    if (r === null) return s;
    e = r;
    let i = '<a href="' + e + '"';
    return t && (i += ' title="' + O(t) + '"'), i += ">" + s + "</a>", i;
  }
  image({ href: e, title: t, text: n, tokens: s }) {
    s && (n = this.parser.parseInline(s, this.parser.textRenderer));
    let r = V(e);
    if (r === null) return O(n);
    e = r;
    let i = `<img src="${e}" alt="${O(n)}"`;
    return t && (i += ` title="${O(t)}"`), i += ">", i;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : O(e.text);
  }
};
var L = class {
  static {
    __name(this, "L");
  }
  strong({ text: e }) {
    return e;
  }
  em({ text: e }) {
    return e;
  }
  codespan({ text: e }) {
    return e;
  }
  del({ text: e }) {
    return e;
  }
  html({ text: e }) {
    return e;
  }
  text({ text: e }) {
    return e;
  }
  link({ text: e }) {
    return "" + e;
  }
  image({ text: e }) {
    return "" + e;
  }
  br() {
    return "";
  }
  checkbox({ raw: e }) {
    return e;
  }
};
var b = class l2 {
  static {
    __name(this, "l2");
  }
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || T, this.options.renderer = this.options.renderer || new y(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new L();
  }
  static parse(e, t) {
    return new l2(t).parse(e);
  }
  static parseInline(e, t) {
    return new l2(t).parseInline(e);
  }
  parse(e) {
    this.renderer.parser = this;
    let t = "";
    for (let n = 0; n < e.length; n++) {
      let s = e[n];
      if (this.options.extensions?.renderers?.[s.type]) {
        let i = s, o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(i.type)) {
          t += o || "";
          continue;
        }
      }
      let r = s;
      switch (r.type) {
        case "space": {
          t += this.renderer.space(r);
          break;
        }
        case "hr": {
          t += this.renderer.hr(r);
          break;
        }
        case "heading": {
          t += this.renderer.heading(r);
          break;
        }
        case "code": {
          t += this.renderer.code(r);
          break;
        }
        case "table": {
          t += this.renderer.table(r);
          break;
        }
        case "blockquote": {
          t += this.renderer.blockquote(r);
          break;
        }
        case "list": {
          t += this.renderer.list(r);
          break;
        }
        case "checkbox": {
          t += this.renderer.checkbox(r);
          break;
        }
        case "html": {
          t += this.renderer.html(r);
          break;
        }
        case "def": {
          t += this.renderer.def(r);
          break;
        }
        case "paragraph": {
          t += this.renderer.paragraph(r);
          break;
        }
        case "text": {
          t += this.renderer.text(r);
          break;
        }
        default: {
          let i = 'Token with "' + r.type + '" type was not found.';
          if (this.options.silent) return console.error(i), "";
          throw new Error(i);
        }
      }
    }
    return t;
  }
  parseInline(e, t = this.renderer) {
    this.renderer.parser = this;
    let n = "";
    for (let s = 0; s < e.length; s++) {
      let r = e[s];
      if (this.options.extensions?.renderers?.[r.type]) {
        let o = this.options.extensions.renderers[r.type].call({ parser: this }, r);
        if (o !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(r.type)) {
          n += o || "";
          continue;
        }
      }
      let i = r;
      switch (i.type) {
        case "escape": {
          n += t.text(i);
          break;
        }
        case "html": {
          n += t.html(i);
          break;
        }
        case "link": {
          n += t.link(i);
          break;
        }
        case "image": {
          n += t.image(i);
          break;
        }
        case "checkbox": {
          n += t.checkbox(i);
          break;
        }
        case "strong": {
          n += t.strong(i);
          break;
        }
        case "em": {
          n += t.em(i);
          break;
        }
        case "codespan": {
          n += t.codespan(i);
          break;
        }
        case "br": {
          n += t.br(i);
          break;
        }
        case "del": {
          n += t.del(i);
          break;
        }
        case "text": {
          n += t.text(i);
          break;
        }
        default: {
          let o = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
};
var P = class {
  static {
    __name(this, "P");
  }
  options;
  block;
  constructor(e) {
    this.options = e || T;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(e) {
    return e;
  }
  postprocess(e) {
    return e;
  }
  processAllTokens(e) {
    return e;
  }
  emStrongMask(e) {
    return e;
  }
  provideLexer(e = this.block) {
    return e ? x.lex : x.lexInline;
  }
  provideParser(e = this.block) {
    return e ? b.parse : b.parseInline;
  }
};
var q = class {
  static {
    __name(this, "q");
  }
  defaults = M();
  options = this.setOptions;
  parse = this.parseMarkdown(true);
  parseInline = this.parseMarkdown(false);
  Parser = b;
  Renderer = y;
  TextRenderer = L;
  Lexer = x;
  Tokenizer = w;
  Hooks = P;
  constructor(...e) {
    this.use(...e);
  }
  walkTokens(e, t) {
    let n = [];
    for (let s of e) switch (n = n.concat(t.call(this, s)), s.type) {
      case "table": {
        let r = s;
        for (let i of r.header) n = n.concat(this.walkTokens(i.tokens, t));
        for (let i of r.rows) for (let o of i) n = n.concat(this.walkTokens(o.tokens, t));
        break;
      }
      case "list": {
        let r = s;
        n = n.concat(this.walkTokens(r.items, t));
        break;
      }
      default: {
        let r = s;
        this.defaults.extensions?.childTokens?.[r.type] ? this.defaults.extensions.childTokens[r.type].forEach((i) => {
          let o = r[i].flat(1 / 0);
          n = n.concat(this.walkTokens(o, t));
        }) : r.tokens && (n = n.concat(this.walkTokens(r.tokens, t)));
      }
    }
    return n;
  }
  use(...e) {
    let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e.forEach((n) => {
      let s = { ...n };
      if (s.async = this.defaults.async || s.async || false, n.extensions && (n.extensions.forEach((r) => {
        if (!r.name) throw new Error("extension name required");
        if ("renderer" in r) {
          let i = t.renderers[r.name];
          i ? t.renderers[r.name] = function(...o) {
            let u = r.renderer.apply(this, o);
            return u === false && (u = i.apply(this, o)), u;
          } : t.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let i = t[r.level];
          i ? i.unshift(r.tokenizer) : t[r.level] = [r.tokenizer], r.start && (r.level === "block" ? t.startBlock ? t.startBlock.push(r.start) : t.startBlock = [r.start] : r.level === "inline" && (t.startInline ? t.startInline.push(r.start) : t.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (t.childTokens[r.name] = r.childTokens);
      }), s.extensions = t), n.renderer) {
        let r = this.defaults.renderer || new y(this.defaults);
        for (let i in n.renderer) {
          if (!(i in r)) throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i)) continue;
          let o = i, u = n.renderer[o], a = r[o];
          r[o] = (...c) => {
            let p = u.apply(r, c);
            return p === false && (p = a.apply(r, c)), p || "";
          };
        }
        s.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new w(this.defaults);
        for (let i in n.tokenizer) {
          if (!(i in r)) throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let o = i, u = n.tokenizer[o], a = r[o];
          r[o] = (...c) => {
            let p = u.apply(r, c);
            return p === false && (p = a.apply(r, c)), p;
          };
        }
        s.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new P();
        for (let i in n.hooks) {
          if (!(i in r)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let o = i, u = n.hooks[o], a = r[o];
          P.passThroughHooks.has(i) ? r[o] = (c) => {
            if (this.defaults.async && P.passThroughHooksRespectAsync.has(i)) return (async () => {
              let k = await u.call(r, c);
              return a.call(r, k);
            })();
            let p = u.call(r, c);
            return a.call(r, p);
          } : r[o] = (...c) => {
            if (this.defaults.async) return (async () => {
              let k = await u.apply(r, c);
              return k === false && (k = await a.apply(r, c)), k;
            })();
            let p = u.apply(r, c);
            return p === false && (p = a.apply(r, c)), p;
          };
        }
        s.hooks = r;
      }
      if (n.walkTokens) {
        let r = this.defaults.walkTokens, i = n.walkTokens;
        s.walkTokens = function(o) {
          let u = [];
          return u.push(i.call(this, o)), r && (u = u.concat(r.call(this, o))), u;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(e) {
    return this.defaults = { ...this.defaults, ...e }, this;
  }
  lexer(e, t) {
    return x.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return b.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (n, s) => {
      let r = { ...s }, i = { ...this.defaults, ...r }, o = this.onError(!!i.silent, !!i.async);
      if (this.defaults.async === true && r.async === false) return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof n > "u" || n === null) return o(new Error("marked(): input parameter is undefined or null"));
      if (typeof n != "string") return o(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
      if (i.hooks && (i.hooks.options = i, i.hooks.block = e), i.async) return (async () => {
        let u = i.hooks ? await i.hooks.preprocess(n) : n, c = await (i.hooks ? await i.hooks.provideLexer(e) : e ? x.lex : x.lexInline)(u, i), p = i.hooks ? await i.hooks.processAllTokens(c) : c;
        i.walkTokens && await Promise.all(this.walkTokens(p, i.walkTokens));
        let h = await (i.hooks ? await i.hooks.provideParser(e) : e ? b.parse : b.parseInline)(p, i);
        return i.hooks ? await i.hooks.postprocess(h) : h;
      })().catch(o);
      try {
        i.hooks && (n = i.hooks.preprocess(n));
        let a = (i.hooks ? i.hooks.provideLexer(e) : e ? x.lex : x.lexInline)(n, i);
        i.hooks && (a = i.hooks.processAllTokens(a)), i.walkTokens && this.walkTokens(a, i.walkTokens);
        let p = (i.hooks ? i.hooks.provideParser(e) : e ? b.parse : b.parseInline)(a, i);
        return i.hooks && (p = i.hooks.postprocess(p)), p;
      } catch (u) {
        return o(u);
      }
    };
  }
  onError(e, t) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
        let s = "<p>An error occurred:</p><pre>" + O(n.message + "", true) + "</pre>";
        return t ? Promise.resolve(s) : s;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
};
var z = new q();
function g(l3, e) {
  return z.parse(l3, e);
}
__name(g, "g");
g.options = g.setOptions = function(l3) {
  return z.setOptions(l3), g.defaults = z.defaults, N(g.defaults), g;
};
g.getDefaults = M;
g.defaults = T;
g.use = function(...l3) {
  return z.use(...l3), g.defaults = z.defaults, N(g.defaults), g;
};
g.walkTokens = function(l3, e) {
  return z.walkTokens(l3, e);
};
g.parseInline = z.parseInline;
g.Parser = b;
g.parser = b.parse;
g.Renderer = y;
g.TextRenderer = L;
g.Lexer = x;
g.lexer = x.lex;
g.Tokenizer = w;
g.Hooks = P;
g.parse = g;
var Ft = g.options;
var Ut = g.setOptions;
var Kt = g.use;
var Wt = g.walkTokens;
var Xt = g.parseInline;
var Vt = b.parse;
var Yt = x.lex;
function getPetHTML() {
  return `
    <div id="pixel-pet-container" class="pixel-pet-container">
      <div class="pet-header">\u{1F431} \u50CF\u7D20\u732B (Lv.<span id="pet-level">1</span>)</div>
      <div class="pet-body">
        <pre id="pet-ascii" class="pet-ascii">
  /\\_/\\
 ( o.o )
  > ^ <
        </pre>
      </div>
      <div class="pet-stats">
        <div class="exp-bar">
          <div id="pet-exp-fill" class="exp-fill" style="width: 0%"></div>
        </div>
        <div class="exp-text">EXP: <span id="pet-exp">0</span> / Next: <span id="pet-next-exp">100</span></div>
      </div>
      <div class="pet-actions">
        <button onclick="interactPet('feed')" class="pet-btn">\u{1F41F} \u5582\u98DF</button>
        <button onclick="interactPet('play')" class="pet-btn">\u{1F9F6} \u9017\u732B</button>
      </div>
    </div>
  `;
}
__name(getPetHTML, "getPetHTML");
function getPetCSS() {
  return `
    .pixel-pet-container { border: 2px solid var(--text); background: var(--bg2); width: 100%; max-width: 320px; box-shadow: 4px 4px 0 rgba(0,0,0,0.8); display: flex; flex-direction: column; margin: 0 auto 20px auto; }
    .pet-header { background: var(--text); color: var(--bg); padding: 5px 10px; font-weight: bold; text-align: center; border-bottom: 2px solid var(--text); }
    .pet-body { padding: 15px; text-align: center; background: var(--bg3); overflow: hidden; min-height: 80px; display: flex; align-items: center; justify-content: center;}
    .pet-ascii { font-family: 'Courier New', monospace; font-size: 16px; line-height: 1.2; margin: 0; display: inline-block; white-space: pre; font-weight: bold; }
    .pet-stats { padding: 10px; border-top: 1px dashed var(--border); border-bottom: 1px dashed var(--border); }
    .exp-bar { width: 100%; height: 12px; background: #000; border: 1px solid var(--border); position: relative; }
    .exp-fill { height: 100%; background: #0f0; width: 0%; transition: width 0.3s; box-shadow: inset 0 -3px 0 rgba(0,0,0,0.3); }
    .exp-text { font-size: 12px; text-align: right; margin-top: 5px; font-weight: bold; color: var(--text); }
    .pet-actions { display: flex; padding: 10px; gap: 10px; }
    .pet-btn { flex: 1; padding: 8px 5px; border: 2px solid var(--text); background: var(--btn-bg); cursor: pointer; font-family: inherit; font-weight: bold; box-shadow: inset 1px 1px 0 var(--btn-hi), inset -1px -1px 0 var(--btn-lo), 2px 2px 0 var(--text); color: var(--text); transition: transform 0.1s; }
    .pet-btn:active { box-shadow: inset 1px 1px 0 var(--btn-hi), inset -1px -1px 0 var(--btn-lo); transform: translate(2px, 2px); }
    
    @keyframes pet-jump {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes pet-eat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1) rotate(5deg); }
    }
    @keyframes pet-shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-3px) rotate(-3deg); }
      75% { transform: translateX(3px) rotate(3deg); }
    }
    .anim-jump { animation: pet-jump 0.3s ease 2; }
    .anim-eat { animation: pet-eat 0.3s ease 2; }
    .anim-shake { animation: pet-shake 0.15s ease 3; }
  `;
}
__name(getPetCSS, "getPetCSS");
function getPetJS() {
  return `
    let isInteracting = false;
    const expressions = [
      "  /\\\\_/\\\\ \\n ( -.- )\\n  > ^ < ", // Blink
      "  /\\\\_/\\\\ \\n ( <.< )\\n  > ^ < ", // Look left
      "  /\\\\_/\\\\ \\n ( >.> )\\n  > ^ < ", // Look right
      "  /\\\\_/\\\\ \\n ( ^.^ )\\n  > ^ < ", // Happy
      "  /\\\\_/\\\\ \\n ( O.O )\\n  > ^ < ", // Surprised
      "  /\\\\_/\\\\ \\n ( -\u03C9- )\\n  > ^ < "  // Sleepy
    ];

    function randomExpression() {
      if (isInteracting) return;
      const ascii = document.getElementById('pet-ascii');
      if (!ascii) return;
      
      // If there's a 40% chance, let's do a random expression
      if (Math.random() < 0.4) {
        const rand = expressions[Math.floor(Math.random() * expressions.length)];
        ascii.innerText = rand;
        
        // 30% chance to shake fur
        if (Math.random() < 0.3) {
          ascii.classList.add('anim-shake');
        }
        
        // Return to normal after a short time
        setTimeout(() => {
          if (!isInteracting) {
             ascii.innerText = "  /\\\\_/\\\\ \\n ( o.o )\\n  > ^ < ";
          }
          ascii.classList.remove('anim-shake');
        }, 800 + Math.random() * 1000); 
      }
    }

    async function loadPet() {
      try {
        const res = await fetch('/api/pet');
        if (res.ok) {
          const data = await res.json();
          updatePetUI(data.exp, data.level);
        }
      } catch (e) {}
    }

    function updatePetUI(exp, level) {
      document.getElementById('pet-level').innerText = level;
      document.getElementById('pet-exp').innerText = exp;
      
      const currentLevelBaseExp = (level - 1) * 100;
      const nextLevelExp = level * 100;
      document.getElementById('pet-next-exp').innerText = nextLevelExp;
      
      const progress = exp - currentLevelBaseExp;
      const percent = Math.min(100, Math.max(0, (progress / 100) * 100)) + '%';
      document.getElementById('pet-exp-fill').style.width = percent;
    }

    async function interactPet(action) {
      isInteracting = true;
      const ascii = document.getElementById('pet-ascii');
      ascii.classList.remove('anim-jump', 'anim-eat');
      void ascii.offsetWidth; // trigger reflow
      
      if (action === 'play') {
        ascii.classList.add('anim-jump');
        ascii.innerText = "  /\\\\_/\\\\ \\n ( ^.^ )\\n  > ^ < ";
      } else {
        ascii.classList.add('anim-eat');
        ascii.innerText = "  /\\\\_/\\\\ \\n ( >\u03C9< )\\n  > ^ < ";
      }
      
      setTimeout(() => {
        ascii.innerText = "  /\\\\_/\\\\ \\n ( o.o )\\n  > ^ < ";
        isInteracting = false;
      }, 1000);

      try {
        const res = await fetch('/api/pet/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action })
        });
        if (res.ok) {
          const data = await res.json();
          updatePetUI(data.exp, data.level);
        }
      } catch (e) {}
    }

    document.addEventListener('DOMContentLoaded', loadPet);
    // Refresh pet state every 10 seconds
    setInterval(loadPet, 10000);
    // Try to trigger a random expression every 1.5 seconds
    setInterval(randomExpression, 1500);
  `;
}
__name(getPetJS, "getPetJS");
async function serveHomepage(request, env) {
  const url = new URL(request.url);
  const section = url.searchParams.get("section") || "home";
  let posts = [];
  if (["home", "posts", "gallery"].includes(section)) {
    const postsResult = await env.DB.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
    posts = postsResult.results || [];
  }
  let guestbook = [];
  if (section === "guestbook") {
    const guestbookResult = await env.DB.prepare("SELECT * FROM guestbook ORDER BY created_at DESC").all();
    guestbook = guestbookResult.results || [];
  }
  const settingsResult = await env.DB.prepare("SELECT key, value FROM settings").all();
  const settingsMap = {};
  if (settingsResult.results) {
    settingsResult.results.forEach((r) => settingsMap[r.key] = r.value);
  }
  let musicPlayerCode = settingsMap["music_player_code"] || '<iframe class="music-box" src="https://i.y.qq.com/n2/m/outchain/player/index.html?songid=526191277&songtype=0" height="65" frameBorder="0" allowfullscreen="" loading="lazy"></iframe>';
  let aboutTitle = settingsMap["about_title"] || "\u5173\u4E8E\u6211 (About)";
  let aboutContent = settingsMap["about_content"] || `<p>\u6B22\u8FCE\u6765\u5230\u6211\u7684\u4E2A\u4EBA\u7F51\u7AD9\uFF01\u8FD9\u91CC\u662F\u5C5E\u4E8E\u6211\u7684\u4E00\u65B9\u5C0F\u5929\u5730\u3002</p>
<p>\u5728\u8FD9\u91CC\u6211\u4F1A\u5206\u4EAB\u6211\u7684\u751F\u6D3B\u70B9\u6EF4\u3001\u4F5C\u54C1\u548C\u60F3\u6CD5\u3002</p>
<p>\u5982\u679C\u4F60\u6709\u4EC0\u4E48\u60F3\u5BF9\u6211\u8BF4\u7684\uFF0C\u6B22\u8FCE\u968F\u65F6\u8054\u7CFB\u6211~</p>`;
  let siteTitle = settingsMap["site_title"] || "TeeAte's Website";
  let siteSubtitle = settingsMap["site_subtitle"] || "\u5F88Niubi \u7684 Website";
  let windowTitle = settingsMap["window_title"] || siteTitle;
  let aboutImageUrl = settingsMap["about_image_url"] || "";
  function renderPostImages(imageUrlStr) {
    if (!imageUrlStr) return "";
    let urls = [];
    if (imageUrlStr.startsWith("[")) {
      try {
        urls = JSON.parse(imageUrlStr);
      } catch (e) {
        urls = [imageUrlStr];
      }
    } else {
      urls = [imageUrlStr];
    }
    if (urls.length === 0) return "";
    if (urls.length === 1) {
      return `<img src="${urls[0]}" class="post-image" onclick="openLightbox('${urls[0]}')">`;
    }
    return `<div class="post-images-grid">
      ${urls.map((u) => `<img src="${u}" class="post-image grid-img" onclick="openLightbox('${u}')">`).join("")}
    </div>`;
  }
  __name(renderPostImages, "renderPostImages");
  let galleryItems = [];
  posts.forEach((p) => {
    if (!p.image_url) return;
    if (p.image_url.startsWith("[")) {
      try {
        JSON.parse(p.image_url).forEach((u) => galleryItems.push({ url: u, title: p.title }));
      } catch (e) {
        galleryItems.push({ url: p.image_url, title: p.title });
      }
    } else {
      galleryItems.push({ url: p.image_url, title: p.title });
    }
  });
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(windowTitle)}</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect x='2' y='2' width='28' height='22' rx='2' ry='2' fill='%23DDDDDD' stroke='%23000' stroke-width='2'/><rect x='4' y='4' width='24' height='15' fill='%23FFFFFF' stroke='%23000' stroke-width='2'/><rect x='8' y='7' width='3' height='3' fill='%23000'/><rect x='21' y='7' width='3' height='3' fill='%23000'/><path d='M 10 13 Q 16 17 22 13' fill='none' stroke='%23000' stroke-width='2'/><rect x='8' y='21' width='6' height='1' fill='%23000'/><rect x='10' y='24' width='12' height='6' fill='%23DDDDDD' stroke='%23000' stroke-width='2'/></svg>">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; overflow: hidden; }
    
    /* Default is Light Mode */
    :root {
      --bg: #FFFFFF; --bg2: #BBBBBB; --bg3: #FFFFFF; --bg4: #999999;
      --border: #000000; --border2: #888888;
      --text: #000000; --text2: #0000FF; --text3: #666666;
      --topbar-grad: repeating-linear-gradient(to bottom, #000000 0px, #000000 1px, #FFFFFF 1px, #FFFFFF 2px);
      --btn-bg: #BBBBBB;
      --btn-hi: #FFFFFF;
      --btn-hi2: #DDDDDD;
      --btn-lo: #888888;
      --btn-lo2: #000000;
    }
    
    body.dark-mode {
      --bg: #1A1A1A; --bg2: #2C2C2C; --bg3: #111111; --bg4: #000000;
      --border: #000000; --border2: #444444;
      --text: #E0E0E0; --text2: #00ffd5; --text3: #AAAAAA;
      --topbar-grad: repeating-linear-gradient(to bottom, #111 0px, #111 1px, #333 1px, #333 2px);
      --btn-bg: #444444;
      --btn-hi: #666666;
      --btn-hi2: #555555;
      --btn-lo: #222222;
      --btn-lo2: #000000;
    }

    body {
      font-family: "Chicago", "Geneva", "Monaco", "Courier New", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      background: var(--bg);
      color: var(--text);
      height: 100vh;
      overflow: hidden;
      font-size: 15px;
      transition: background 0.3s, color 0.3s;
    }

    /* Mac Menu Bar */
    .menu-bar { height: 28px; background: var(--bg3); border-bottom: 2px solid #000000; display: flex; align-items: center; padding: 0 12px; font-size: 14px; font-weight: 700; gap: 20px; transition: background 0.3s; }
    .menu-bar .apple { font-size: 18px; margin-right: 8px; color: var(--text); }
    .menu-item { padding: 2px 8px; cursor: pointer; color: var(--text); text-decoration: none; }
    .menu-item:hover { background: var(--text); color: var(--bg3); }
    .menu-item.active { background: var(--border2); color: var(--bg); }
    .menu-right { margin-left: auto; display: flex; gap: 15px; align-items: center; }

    .app { display: flex; flex-direction: column; height: calc(100vh - 28px); border: 1px solid #000000; margin: 10px; background: var(--bg2); box-shadow: 2px 2px 0px rgba(0,0,0,0.8); transition: background 0.3s; }
    @media(max-width:800px) { .app { margin: 0; height: calc(100vh - 28px); border-radius: 0; box-shadow: none; } }

    /* Title Bar */
    .topbar { display: flex; align-items: center; padding: 0 8px; height: 36px; background: var(--topbar-grad); border-bottom: 1px solid #000000; position: relative; flex-shrink: 0; }
    .close-box { width: 16px; height: 16px; background: var(--btn-bg); border: 1px solid #000000; flex-shrink: 0; position: relative; cursor: pointer; }
    .close-box::before, .close-box::after { content: ""; position: absolute; top: 3px; left: 7px; width: 1px; height: 9px; background: #000000; border: none; }
    .close-box::before { transform: rotate(45deg); }
    .close-box::after { transform: rotate(-45deg); }
    .close-box:active { background: var(--text); }
    .close-box:active::before, .close-box:active::after { background: var(--bg); }
    .topbar h1 { font-size: 15px; font-weight: 700; letter-spacing: 0; display: flex; align-items: center; gap: 6px; background: var(--bg3); color: var(--text); padding: 2px 16px; border: 1px solid #000000; position: absolute; left: 50%; transform: translateX(-50%); z-index: 1; white-space: nowrap; max-width: 60%; overflow: hidden; text-overflow: ellipsis; }
    .shade-box { width: 16px; height: 16px; background: var(--btn-bg); border: 1px solid #000000; flex-shrink: 0; position: relative; margin-left: auto; }
    .shade-box::after { content: ""; position: absolute; top: 7px; left: 3px; right: 3px; border-bottom: 1px solid #000000; }
    .zoom-box { width: 16px; height: 16px; background: var(--btn-bg); border: 1px solid #000000; flex-shrink: 0; position: relative; margin-left: 4px; }
    .zoom-box::after { content: ""; position: absolute; top: 3px; left: 3px; right: 3px; bottom: 3px; border: 1px solid #000000; }

    .main-area { display: flex; flex: 1; overflow: hidden; }
    
    /* Mobile Layout for main area */
    @media(max-width:800px) {
      .main-area { flex-direction: column; }
    }

    /* Sidebar / Tabs */
    .sidebar { width: 200px; background: var(--bg2); border-right: 1px solid #000000; display: flex; flex-direction: column; border-top: 1px solid var(--border2); flex-shrink: 0; transition: background 0.3s; }
    @media(max-width:800px) {
      .sidebar { width: 100%; flex-direction: row; flex-wrap: wrap; border-right: none; border-bottom: 1px solid #000000; }
    }
    .panel-tab { padding: 12px 16px; font-size: 14px; font-weight: 700; color: var(--text); text-decoration: none; display: block; background: var(--btn-bg); border: 1px solid var(--border); box-shadow: inset 1px 1px 0 var(--btn-hi), inset 2px 2px 0 var(--btn-hi2), inset -1px -1px 0 var(--btn-lo), inset -2px -2px 0 var(--btn-lo2); transition: none; margin-bottom: -1px; }
    .panel-tab:active { box-shadow: inset 1px 1px 0 var(--btn-lo), inset 2px 2px 0 var(--btn-lo2), inset -1px -1px 0 var(--btn-hi), inset -2px -2px 0 var(--btn-hi2); padding-top: 13px; padding-left: 17px; }
    @media(max-width:800px) {
      .panel-tab { padding: 8px 12px; flex: 1; text-align: center; margin-bottom: 0; margin-right: -1px; }
      .panel-tab:active { padding-top: 9px; padding-left: 13px; }
    }
    .panel-tab.active { background: var(--text); color: var(--bg); box-shadow: inset 2px 2px 0 var(--bg2); }
    body.dark-mode .panel-tab.active { background: var(--text); color: var(--bg); }
    .panel-tab:hover:not(.active) { background: var(--bg2); color: var(--text); }

    /* Buttons */
    .btn { height: 36px; padding: 0 20px; border: 1px solid #000000; box-shadow: inset 1px 1px 0 var(--btn-hi), inset 2px 2px 0 var(--btn-hi2), inset -1px -1px 0 var(--btn-lo), inset -2px -2px 0 var(--btn-lo2); background: var(--btn-bg); color: var(--text); font-size: 14px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: inherit; border-radius: 0; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; }
    .btn:active { box-shadow: inset 1px 1px 0 var(--btn-lo), inset 2px 2px 0 var(--btn-lo2), inset -1px -1px 0 var(--btn-hi), inset -2px -2px 0 var(--btn-hi2); padding-top: 1px; padding-left: 1px; }

    /* Content Area */
    .content-area { flex: 1; background: var(--bg3); overflow-y: auto; padding: 20px; box-shadow: inset 1px 1px 0 #000000, inset -1px -1px 0 var(--border2); position: relative; transition: background 0.3s; }
    @media(max-width:800px) {
      .content-area { padding: 10px; }
    }
    
    /* Typography & Specifics */
    .site-header { margin-bottom: 20px; text-align: center; border-bottom: 2px solid var(--border2); padding-bottom: 20px; }
    .site-title { font-size: 2rem; font-weight: 900; color: var(--text); letter-spacing: 2px; }
    .site-subtitle { font-size: 1.2rem; color: var(--text3); margin-top: 5px; }
    .music-box { width: 100%; max-width: 100%; height: 67px; border-radius: 0; border: 1px solid #000; box-shadow: 2px 2px 0 #000; margin-bottom: 20px; display: block; overflow: hidden; background: #fff; }
    
    .post-card { background: var(--bg); border: 1px solid var(--border2); padding: 20px; margin-bottom: 20px; box-shadow: inset 1px 1px 0 var(--border2), inset -1px -1px 0 #000; }
    .post-title { font-size: 1.5rem; color: var(--text2); margin-bottom: 10px; font-weight: bold; }
    .post-date { font-size: 0.9rem; color: var(--text3); margin-bottom: 15px; }
    .post-content { line-height: 1.6; white-space: normal; font-family: "Courier New", monospace; }
    .post-image { max-width: 100%; max-height: 400px; object-fit: contain; border: 1px solid #000; border-radius: 8px; margin-top: 15px; display: block; }

    /* Markdown Styles */
    .markdown-body { font-family: "Courier New", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", monospace; line-height: 1.6; }
    .markdown-body p { margin-bottom: 10px; }
    .markdown-body h1, .markdown-body h2, .markdown-body h3 { color: var(--text2); margin-top: 15px; margin-bottom: 10px; border-bottom: 1px dashed var(--border2); padding-bottom: 5px;}
    .markdown-body a { color: var(--text2); text-decoration: underline; cursor: pointer; }
    .markdown-body pre { background: var(--bg3); border: 1px solid var(--border); padding: 10px; overflow-x: auto; margin-bottom: 15px; box-shadow: inset 1px 1px 0 var(--border2); }
    .markdown-body code { background: var(--bg2); padding: 2px 4px; font-family: monospace; border: 1px solid var(--border2); }
    .markdown-body pre code { background: transparent; padding: 0; border: none; }
    .markdown-body blockquote { border-left: 4px solid var(--text2); padding-left: 10px; margin-left: 0; color: var(--text3); font-style: italic; background: var(--bg2); padding: 5px 10px; }
    .markdown-body ul, .markdown-body ol { padding-left: 25px; margin-bottom: 15px; }
    .markdown-body img { max-width: 100%; border: 1px solid #000; box-shadow: 2px 2px 0 #000; display: block; margin: 10px 0; }

    /* Guestbook Sticky Notes Wall */
    .guestbook-wall { position: relative; width: 100%; height: 600px; background: var(--bg3); border: 2px inset var(--border2); overflow: auto; margin-top: 15px; background-image: radial-gradient(var(--border) 1px, transparent 1px); background-size: 20px 20px; touch-action: pan-x pan-y; }
    .sticky-note { position: absolute; width: 160px; padding: 15px; box-shadow: 3px 3px 5px rgba(0,0,0,0.3); cursor: grab; user-select: none; font-family: 'Comic Sans MS', 'Chalkboard SE', 'Kaiti SC', 'KaiTi', 'STKaiti', cursive, sans-serif; font-size: 15px; transform-origin: top center; transition: box-shadow 0.2s; word-wrap: break-word; touch-action: none; }
    .sticky-note:active { cursor: grabbing; box-shadow: 6px 6px 10px rgba(0,0,0,0.4); z-index: 1000 !important; }
    .sticky-note::before { content: ''; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 60px; height: 20px; background: rgba(255, 255, 255, 0.4); box-shadow: 0 1px 2px rgba(0,0,0,0.2); border-radius: 2px; }
    .note-yellow { background-color: #fdfd96; color: #333; }
    .note-pink { background-color: #ffb7b2; color: #333; }
    .note-blue { background-color: #a2cffe; color: #333; }
    .note-green { background-color: #b5ead7; color: #333; }
    .note-author { font-weight: bold; margin-bottom: 8px; border-bottom: 1px dashed rgba(0,0,0,0.2); padding-bottom: 3px; font-size: 15px; }
    .note-date { font-size: 11px; color: rgba(0,0,0,0.5); text-align: right; margin-top: 10px; }
    
    @media(max-width:800px) {
      .guestbook-wall { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 20px 0; height: auto; max-height: 80vh; }
      .sticky-note { position: static !important; transform: none !important; margin: 0 auto; cursor: default; touch-action: auto; width: 80%; max-width: 300px; }
      .sticky-note:active { cursor: default; box-shadow: 3px 3px 5px rgba(0,0,0,0.3) !important; z-index: auto !important; }
    }

    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
    .gallery-item { border: 1px solid var(--border2); background: var(--bg4); padding: 5px; cursor: pointer; transition: transform 0.2s; }
    .gallery-item:hover { transform: scale(1.02); border-color: var(--text2); }
    .gallery-item img { width: 100%; height: 200px; object-fit: cover; display: block; }

    .about-section { line-height: 1.8; color: var(--text); font-family: "Courier New", monospace; }
    .about-section h2 { color: var(--text2); margin-bottom: 20px; border-bottom: 1px dashed var(--border2); padding-bottom: 10px; }

    .sidebar-btn { width: 100%; text-align: left; padding: 8px 15px; border: 1px solid var(--border); background: var(--btn-bg); color: var(--text); font-weight: bold; font-family: inherit; cursor: pointer; box-shadow: inset 1px 1px 0 var(--btn-hi), inset 2px 2px 0 var(--btn-hi2), inset -1px -1px 0 var(--btn-lo), inset -2px -2px 0 var(--btn-lo2); display: flex; align-items: center; gap: 8px; font-size: 14px; transition: none; }
    .sidebar-btn:active { box-shadow: inset 1px 1px 0 var(--btn-lo), inset 2px 2px 0 var(--btn-lo2), inset -1px -1px 0 var(--btn-hi), inset -2px -2px 0 var(--btn-hi2); padding-top: 9px; padding-left: 1px; }
    .sidebar-btn.active { background: var(--text); color: var(--bg); box-shadow: inset 2px 2px 0 var(--bg2); }

    /* Guestbook */
    .input-field { padding: 4px 8px; border: 1px solid var(--border); background: var(--bg3); color: var(--text); font-family: inherit; font-size: 14px; box-shadow: inset 1px 1px 2px rgba(0,0,0,0.4); outline: none; transition: background 0.2s; }
    .input-field:focus { background: var(--bg); border-color: var(--text2); }
    .guestbook-form { border: 2px solid var(--text); padding: 15px; margin-bottom: 20px; background: var(--bg2); }
    .gb-input, .gb-textarea { width: 100%; padding: 8px; border: 1px solid #000; background: var(--bg3); color: var(--text); font-family: inherit; margin-bottom: 10px; }
    .gb-btn { padding: 8px 15px; border: 1px solid var(--border); background: var(--btn-bg); color: var(--text); cursor: pointer; font-weight: bold; font-family: inherit; box-shadow: inset 1px 1px 0 var(--btn-hi), inset 2px 2px 0 var(--btn-hi2), inset -1px -1px 0 var(--btn-lo), inset -2px -2px 0 var(--btn-lo2); }
    .gb-btn:active { box-shadow: inset 1px 1px 0 var(--btn-lo), inset 2px 2px 0 var(--btn-lo2), inset -1px -1px 0 var(--btn-hi), inset -2px -2px 0 var(--btn-hi2); padding-top: 9px; padding-left: 1px; }
    .gb-entry { border: 1px solid var(--border2); padding: 15px; margin-bottom: 10px; background: var(--bg); }
    .gb-author { font-weight: bold; color: var(--text2); font-size: 1.1rem; }
    .gb-date { font-size: 0.8rem; color: var(--text3); float: right; }
    .gb-msg { margin-top: 10px; white-space: pre-wrap; font-family: "Courier New", monospace; word-break: break-all; }
    
    /* Scrollbar */
    ::-webkit-scrollbar { width: 16px; background: var(--bg2); border-left: 1px solid #000; }
    ::-webkit-scrollbar-thumb { background: var(--border2); border: 1px solid #000; }
    ${getPetCSS()}
    .post-images-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 15px; }
    .grid-img { width: 100%; aspect-ratio: 1/1; object-fit: cover; cursor: pointer; margin-top: 0 !important; }
    @media(max-width:800px) {
      .post-images-grid { grid-template-columns: 1fr; gap: 10px; }
      .grid-img { aspect-ratio: auto; }
    }
    .post-image { cursor: pointer; margin-top: 15px; max-width: 100%; height: auto; border: 1px solid #000; display: block; box-shadow: 2px 2px 0 #000; }
    
    /* Lightbox Modal */
    .lightbox-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; justify-content: center; align-items: center; padding: 20px; }
    .lightbox-content { max-width: 90%; max-height: 90%; border: 2px solid #fff; box-shadow: 4px 4px 0 #000; object-fit: contain; }
    .lightbox-close { position: absolute; top: 20px; right: 20px; color: #fff; font-size: 30px; cursor: pointer; font-weight: bold; background: none; border: none; text-shadow: 2px 2px 0 #000; }

  </style>
</head>
<body>
  <div class="menu-bar">
    <span class="apple">\uF8FF</span>
    <span class="menu-item" onclick="window.location.href='/'">File</span>
    <span class="menu-item" onclick="window.location.href='/admin'">Admin</span>
    <div class="menu-right">
      <span class="menu-item" id="themeToggle">\u{1F317} \u9ED1\u767D\u5207\u6362</span>
    </div>
  </div>

  <div class="app">
    <div class="topbar">
      <div class="close-box"></div>
      <h1>${escapeHtml(windowTitle)}</h1>
      <div class="shade-box"></div>
      <div class="zoom-box"></div>
    </div>
    <div class="main-area">
      <div class="sidebar">
        <a href="/" class="panel-tab ${section === "home" ? "active" : ""}">\u9996\u9875</a>
        <a href="/?section=posts" class="panel-tab ${section === "posts" ? "active" : ""}">\u52A8\u6001</a>
        <a href="/?section=gallery" class="panel-tab ${section === "gallery" ? "active" : ""}">\u76F8\u518C</a>
        <a href="/?section=guestbook" class="panel-tab ${section === "guestbook" ? "active" : ""}">\u7559\u8A00</a>
        <a href="/?section=about" class="panel-tab ${section === "about" ? "active" : ""}">\u5173\u4E8E</a>
      </div>
      
      <div class="content-area">
        ${section === "home" ? `
          <div class="site-header">
            <div class="site-title">${escapeHtml(siteTitle)}</div>
            <div class="site-subtitle">${escapeHtml(siteSubtitle)}</div>
          </div>
          ${musicPlayerCode}
          ${getPetHTML()}
          <div class="posts-section">
            ${posts.slice(0, 3).map((post) => `
              <div class="post-card">
                <div class="post-title">${escapeHtml(post.title)}</div>
                <div class="post-date">${new Date(post.created_at).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}</div>
                <div class="post-content markdown-body">${g.parse(post.content)}</div>
                ${renderPostImages(post.image_url)}
              </div>
            `).join("")}
            ${posts.length > 3 ? `
            <div style="text-align: center; margin-top: 15px; margin-bottom: 20px;">
              <a href="/?section=posts" class="btn" style="text-decoration: none; padding: 6px 15px;">\u67E5\u770B\u66F4\u591A...</a>
            </div>
            ` : ""}
          </div>
        ` : ""}

        ${section === "posts" ? `
          <div class="posts-section">
            ${posts.map((post) => `
              <div class="post-card">
                <div class="post-title">${escapeHtml(post.title)}</div>
                <div class="post-date">${new Date(post.created_at).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}</div>
                <div class="post-content markdown-body">${g.parse(post.content)}</div>
                ${renderPostImages(post.image_url)}
              </div>
            `).join("")}
          </div>
        ` : ""}

        ${section === "gallery" ? `
          <div class="gallery-grid">
            ${galleryItems.map((item) => `
              <div class="gallery-item" onclick="openLightbox('${item.url}')">
                <img src="${item.url}" alt="${escapeHtml(item.title)}">
              </div>
            `).join("")}
          </div>
        ` : ""}

        ${section === "guestbook" ? `
          <div class="guestbook-section">
            <h2>\u4E92\u52A8\u7559\u8A00\u5899</h2>
            <div style="background: var(--bg2); padding: 10px; border: 1px solid var(--border); margin-bottom: 10px; box-shadow: inset 1px 1px 0 var(--btn-hi), inset -1px -1px 0 var(--btn-lo);">
              <form id="guestbookForm" onsubmit="submitGuestbook(event)" style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <label style="font-weight: bold; white-space: nowrap;">\u5199\u4FBF\u5229\u8D34:</label>
                <input type="text" id="gbAuthor" placeholder="\u4F60\u7684\u6635\u79F0" required class="input-field" style="width: 120px; height: 30px;">
                <input type="text" id="gbMessage" placeholder="\u60F3\u8BF4\u70B9\u4EC0\u4E48\uFF1F" required class="input-field" style="flex: 1; min-width: 200px; height: 30px;">
                <button type="submit" class="btn" style="height: 30px; line-height: 28px; padding: 0 15px;">\u8D34\u4E0A\u5899</button>
              </form>
            </div>
            <div class="guestbook-wall">
              ${guestbook.map((g2) => {
    const colorCls = "note-" + (g2.color || "yellow");
    const x2 = g2.x >= 0 ? g2.x : Math.floor(Math.random() * 300);
    const y2 = g2.y >= 0 ? g2.y : Math.floor(Math.random() * 400);
    const rot = Math.floor(Math.random() * 10) - 5;
    const z2 = Math.floor(Math.random() * 10) + 1;
    return `
                <div class="sticky-note ${colorCls}" data-id="${g2.id}" style="left: ${x2}px; top: ${y2}px; transform: rotate(${rot}deg); z-index: ${z2};">
                  <div class="note-author">${escapeHtml(g2.author)}</div>
                  <div class="note-message">${escapeHtml(g2.message)}</div>
                  <div class="note-date">${new Date(g2.created_at).toLocaleDateString("zh-CN", { timeZone: "Asia/Shanghai" })}</div>
                </div>
              `;
  }).join("")}
            </div>
          </div>
        ` : ""}

        ${section === "about" ? `
          <div class="about-section">
            <h2>${escapeHtml(aboutTitle)}</h2>
            ${aboutImageUrl ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${escapeHtml(aboutImageUrl)}" style="max-width: 100%; border: 1px solid #000; box-shadow: 2px 2px 0 #000;" alt="About Image"></div>` : ""}
            <div class="markdown-body" style="font-size: 16px;">${g.parse(aboutContent)}</div>
          </div>
        ` : ""}
      </div>
    </div>
  </div>

  <script>
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('macTheme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('macTheme', 'dark');
      } else {
        localStorage.setItem('macTheme', 'light');
      }
    });

    async function submitGuestbook(e) {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.disabled = true;
        btn.textContent = '\u63D0\u4EA4\u4E2D...';
        
        const colors = ['yellow', 'pink', 'blue', 'green'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const wall = document.querySelector('.guestbook-wall');
        const x = wall ? wall.clientWidth / 2 - 80 + (Math.random() * 40 - 20) : 100;
        const y = wall ? wall.clientHeight / 2 - 80 + (Math.random() * 40 - 20) : 100;

        const res = await fetch('/api/guestbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author: document.getElementById('gbAuthor').value,
            message: document.getElementById('gbMessage').value,
            x: Math.floor(x),
            y: Math.floor(y),
            color: randomColor
          })
        });
        if (res.ok) {
          window.location.reload();
        } else {
          alert('\u63D0\u4EA4\u5931\u8D25');
          btn.disabled = false;
          btn.textContent = '\u8D34\u4E0A\u5899';
        }
      }

      // Drag and Drop Logic (Mouse + Touch)
      let activeNote = null;
      let offsetX = 0;
      let offsetY = 0;

      function dragStart(e) {
        if (window.innerWidth <= 800) return; // Disable drag on mobile
        const target = e.target.closest('.sticky-note');
        if (target) {
          activeNote = target;
          activeNote.style.zIndex = 1000;
          activeNote.style.transform = activeNote.style.transform.replace(/rotate\\([^\\)]+\\)/, 'rotate(0deg) scale(1.05)');
          
          const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
          const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
          
          offsetX = clientX - activeNote.offsetLeft;
          offsetY = clientY - activeNote.offsetTop;
        }
      }

      function dragMove(e) {
        if (!activeNote) return;
        if (e.type.includes('touch')) e.preventDefault(); // Prevent scrolling while dragging note
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        let x = clientX - offsetX;
        let y = clientY - offsetY;
        const wall = document.querySelector('.guestbook-wall');
        
        if (wall) {
          x = Math.max(0, Math.min(x, wall.scrollWidth - activeNote.offsetWidth));
          y = Math.max(0, Math.min(y, wall.scrollHeight - activeNote.offsetHeight));
        }

        activeNote.style.left = x + 'px';
        activeNote.style.top = y + 'px';
      }

      async function dragEnd(e) {
        if (activeNote) {
          const rot = Math.floor(Math.random() * 10) - 5;
          activeNote.style.transform = \`rotate(\${rot}deg)\`;
          activeNote.style.zIndex = Math.floor(Math.random() * 10) + 1;
          
          const id = activeNote.dataset.id;
          const x = parseInt(activeNote.style.left);
          const y = parseInt(activeNote.style.top);
          
          const noteToSave = activeNote;
          activeNote = null; 
          
          try {
            await fetch(\`/api/guestbook/\${id}/position\`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ x, y })
            });
          } catch (err) { console.error('Failed to save position'); }
        }
      }

      document.addEventListener('mousedown', dragStart);
      document.addEventListener('mousemove', dragMove);
      document.addEventListener('mouseup', dragEnd);

      document.addEventListener('touchstart', dragStart, {passive: false});
      document.addEventListener('touchmove', dragMove, {passive: false});
      document.addEventListener('touchend', dragEnd);
    ${getPetJS()}
  <\/script>


  <div id="lightboxModal" class="lightbox-modal" onclick="closeLightbox()">
    <button class="lightbox-close" onclick="closeLightbox()">\xD7</button>
    <img id="lightboxImg" class="lightbox-content" src="" onclick="event.stopPropagation()">
  </div>
  <script>
    function openLightbox(url) {
      document.getElementById('lightboxImg').src = url;
      document.getElementById('lightboxModal').style.display = 'flex';
    }
    function closeLightbox() {
      document.getElementById('lightboxModal').style.display = 'none';
    }
  <\/script>
</body>
</html>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-cache, no-store, must-revalidate" }
  });
}
__name(serveHomepage, "serveHomepage");
async function serveAdminPanel(request, env) {
  const isAuth = isAuthenticated(request);
  const url = new URL(request.url);
  const settingsResult = await env.DB.prepare("SELECT key, value FROM settings").all();
  const settingsMap = {};
  if (settingsResult.results) {
    settingsResult.results.forEach((r) => settingsMap[r.key] = r.value);
  }
  let siteTitle = settingsMap["site_title"] || "TeeAte's Website";
  let siteSubtitle = settingsMap["site_subtitle"] || "\u5F88Niubi \u7684 Website";
  let windowTitle = settingsMap["window_title"] || siteTitle;
  let aboutContent = settingsMap["about_content"] || "";
  let aboutTitle = settingsMap["about_title"] || "\u5173\u4E8E\u6211 (About)";
  let aboutImageUrl = settingsMap["about_image_url"] || "";
  let musicPlayerCode = settingsMap["music_player_code"] || "";
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\u63A7\u5236\u9762\u677F</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='10' y='10' width='80' height='80' rx='10' fill='%23333' stroke='%23000' stroke-width='5'/><circle cx='30' cy='30' r='10' fill='%23fff'/><circle cx='70' cy='30' r='10' fill='%23fff'/><rect x='25' y='60' width='10' height='20' fill='%23fff'/><rect x='65' y='50' width='10' height='30' fill='%23fff'/></svg>">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; overflow: hidden; }
    :root {
      --bg: #FFFFFF; --bg2: #BBBBBB; --bg3: #AAAAAA; --bg4: #999999;
      --border: #000000; --border2: #888888;
      --text: #000000; --text2: #333333; --text3: #666666;
    }
    body {
      font-family: "Chicago", "Geneva", "Monaco", "Courier New", monospace;
      background: #999999;
      color: var(--text);
      height: 100vh;
      overflow: hidden;
      font-size: 15px;
    }

    /* Mac Menu Bar */
    .menu-bar { height: 28px; background: #FFFFFF; border-bottom: 2px solid #000000; display: flex; align-items: center; padding: 0 12px; font-size: 14px; font-weight: 700; gap: 20px; }
    .menu-bar .apple { font-size: 18px; margin-right: 8px; }
    .menu-item { padding: 2px 8px; cursor: default; }
    .menu-item:hover { background: #000000; color: #FFFFFF; }

    .app { display: flex; flex-direction: column; height: calc(100vh - 28px); border: 1px solid #000000; margin: 10px; background: #BBBBBB; box-shadow: 2px 2px 0px rgba(0,0,0,0.5); }
    @media(max-width:800px) { .app { margin: 0; height: calc(100vh - 28px); border-radius: 0; } }

    /* Title Bar with Pinstripes */
    .topbar { display: flex; align-items: center; padding: 0 8px; height: 36px; background: repeating-linear-gradient(to bottom, #000000 0px, #000000 1px, #FFFFFF 1px, #FFFFFF 2px); border-bottom: 1px solid #000000; position: relative; flex-shrink: 0; }
    .close-box { width: 16px; height: 16px; background: #BBBBBB; border: 1px solid #000000; flex-shrink: 0; position: relative; cursor: pointer; }
    .close-box::before, .close-box::after { content: ""; position: absolute; top: 3px; left: 7px; width: 1px; height: 9px; background: #000000; border: none; }
    .close-box::before { transform: rotate(45deg); }
    .close-box::after { transform: rotate(-45deg); }
    .close-box:active { background: #000; }
    .close-box:active::before, .close-box:active::after { background: #FFFFFF; }
    .topbar h1 { font-size: 15px; font-weight: 700; letter-spacing: 0; display: flex; align-items: center; gap: 6px; background: #FFFFFF; padding: 2px 16px; border: 1px solid #000000; position: absolute; left: 50%; transform: translateX(-50%); z-index: 1; }
    .shade-box { width: 16px; height: 16px; background: #BBBBBB; border: 1px solid #000000; flex-shrink: 0; position: relative; margin-left: auto; }
    .shade-box::after { content: ""; position: absolute; top: 7px; left: 3px; right: 3px; border-bottom: 1px solid #000000; }
    .zoom-box { width: 16px; height: 16px; background: #BBBBBB; border: 1px solid #000000; flex-shrink: 0; position: relative; margin-left: 4px; }
    .zoom-box::after { content: ""; position: absolute; top: 3px; left: 3px; right: 3px; bottom: 3px; border: 1px solid #000000; }

    .main-area { display: flex; flex: 1; overflow: hidden; }
    @media(max-width:800px) { .main-area { flex-direction: column; } }

    /* Sidebar / Tabs */
    .sidebar { width: 200px; background: #BBBBBB; border-right: 1px solid #000000; display: flex; flex-direction: column; border-top: 1px solid #FFFFFF; flex-shrink: 0; }
    @media(max-width:800px) {
      .sidebar { width: 100%; flex-direction: row; flex-wrap: wrap; border-right: none; border-bottom: 1px solid #000000; }
    }
    .panel-tab { padding: 12px 16px; font-size: 14px; font-weight: 700; color: #333333; cursor: pointer; border-bottom: 1px solid #000000; border-top: 1px solid #FFFFFF; }
    @media(max-width:800px) {
      .panel-tab { padding: 8px 12px; flex: 1; text-align: center; margin-bottom: 0; border-right: 1px solid #000000; }
      .panel-tab:last-child { border-right: none; }
    }
    .panel-tab.active { background: #000000; color: #FFFFFF; }
    .panel-tab:hover:not(.active) { background: #AAAAAA; }

    /* Content Area */
    .content-area { flex: 1; background: #FFFFFF; overflow-y: auto; padding: 20px; box-shadow: inset 1px 1px 0 #000000, inset -1px -1px 0 #FFFFFF; position: relative; }
    @media(max-width:800px) { .content-area { padding: 10px; overflow-x: auto; } }
    .tab-content { display: none; }
    .tab-content.active { display: block; }

    /* Forms & Inputs */
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 14px; color: #000000; margin-bottom: 5px; font-weight: 700; }
    .form-group input[type="text"], .form-group input[type="password"] { width: 100%; height: 36px; padding: 0 8px; border: 1px solid #000000; box-shadow: inset 1px 1px 0 #000000, inset -1px -1px 0 #FFFFFF; background: #FFFFFF; color: #000000; font-size: 14px; outline: none; font-family: "Chicago", "Geneva", "Monaco", "Courier New", monospace; border-radius: 0; }
    .form-group textarea { width: 100%; padding: 8px; border: 1px solid #000000; box-shadow: inset 1px 1px 0 #000000, inset -1px -1px 0 #FFFFFF; background: #FFFFFF; color: #000000; font-size: 14px; outline: none; font-family: "Chicago", "Geneva", "Monaco", "Courier New", monospace; border-radius: 0; min-height: 150px; resize: vertical; }
    .form-group input:focus, .form-group textarea:focus { background: #FFFFEE; }

    /* Buttons */
    .btn { height: 36px; padding: 0 20px; border: 1px solid #000000; box-shadow: inset 1px 1px 0 #FFFFFF, inset 2px 2px 0 #DDDDDD, inset -1px -1px 0 #888888, inset -2px -2px 0 #000000; background: #BBBBBB; color: #000000; font-size: 14px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: "Chicago", "Geneva", "Monaco", "Courier New", monospace; border-radius: 0; display: inline-flex; align-items: center; justify-content: center; }
    .btn:active { box-shadow: inset 1px 1px 0 #888888, inset 2px 2px 0 #000000, inset -1px -1px 0 #FFFFFF, inset -2px -2px 0 #DDDDDD; padding-top: 1px; padding-left: 1px; }
    .btn:disabled { color: #999999; cursor: not-allowed; }
    .btn-small { height: 28px; padding: 0 12px; font-size: 12px; }

    /* Login View */
    #loginView { position: absolute; inset: 0; background: #999999; display: flex; align-items: center; justify-content: center; z-index: 100; }
    .login-box { background: #BBBBBB; border: 1px solid #000000; padding: 2px; width: 300px; box-shadow: 2px 2px 0 #000000; }
    .login-box-inner { border: 2px solid #000000; padding: 20px; background: #FFFFFF; text-align: center; }
    .login-box h2 { margin-bottom: 20px; font-size: 16px; font-weight: 700; border-bottom: 2px solid #000000; padding-bottom: 5px; }

    /* Messages */
    .message { padding: 8px 12px; border: 1px solid #000000; margin-bottom: 15px; font-weight: bold; display: none; font-size: 13px; }
    .message.success { background: #FFFFFF; border: 2px solid #000000; display: block; box-shadow: 2px 2px 0px #000; }
    .message.error { background: #000000; color: #FFFFFF; display: block; box-shadow: 2px 2px 0px #FFF; }

    /* Stats & Cards */
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 20px; }
    .stat-card { background: #FFFFFF; border: 1px solid #000000; padding: 15px; text-align: center; box-shadow: inset 1px 1px 0 #000000, inset -1px -1px 0 #FFFFFF; }
    .stat-card .number { font-size: 24px; font-weight: 700; margin-bottom: 5px; }
    .stat-card .label { font-size: 12px; color: #333333; }

    /* Post List */
    .post-item { border: 1px solid #000000; padding: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; background: #EEEEEE; }
    .post-item:hover { background: #DDDDDD; }
    .post-item-info h3 { font-size: 15px; margin-bottom: 4px; }
    .post-item-info p { font-size: 12px; color: #666666; font-family: "Monaco", "Courier New", monospace; }

    /* Upload Area */
    .upload-area { border: 1px dashed #000000; background: #EEEEEE; padding: 20px; text-align: center; cursor: pointer; }
    .upload-area:active { background: #DDDDDD; }
    .preview-image { max-width: 200px; max-height: 200px; border: 1px solid #000000; margin-top: 10px; }
    .progress-bar { height: 14px; border: 1px solid #000000; background: #FFFFFF; margin-top: 10px; box-shadow: inset 1px 1px 0 #000, inset -1px -1px 0 #FFF; }
    .progress-fill { height: 100%; background: repeating-linear-gradient(45deg, #000 0, #000 10px, #FFF 10px, #FFF 20px); transition: width 0.3s; }

    /* Tables */
    .visit-table { width: 100%; border-collapse: collapse; border: 1px solid #000000; font-size: 12px; table-layout: fixed; }
    .visit-table th, .visit-table td { padding: 4px 6px; border: 1px solid #000000; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .visit-table th { background: #BBBBBB; font-weight: 700; }
    .visit-table tr:nth-child(even) { background: #EEEEEE; }
    .visit-table tr:hover { background: #DDDDDD; }

    .section-title { font-size: 16px; font-weight: 700; border-bottom: 2px solid #000000; margin-bottom: 15px; padding-bottom: 5px; }
  </style>
</head>
<body>
  <div id="loginView">
    <div class="login-box">
      <div class="login-box-inner">
        <h2>\u767B\u5F55\u63A7\u5236\u9762\u677F</h2>
        <div id="loginMessage" class="message error"></div>
        <div class="form-group">
          <input type="password" id="passwordInput" placeholder="\u8F93\u5165\u7BA1\u7406\u5458\u5BC6\u7801..." onkeypress="if(event.key === 'Enter') login()">
        </div>
        <button class="btn" onclick="login()">\u767B\u5F55</button>
      </div>
    </div>
  </div>

  <div class="menu-bar" style="display: none;" id="menuBar">
    <span class="apple">\uF8FF</span>
    <span class="menu-item" onclick="window.open('/', '_blank')">\u8FDB\u5165\u7AD9\u70B9</span>
    <span class="menu-item">\u6587\u4EF6</span>
    <span class="menu-item">\u7F16\u8F91</span>
    <span class="menu-item">\u89C6\u56FE</span>
  </div>

  <div class="app" id="dashboardView" style="display: none;">
    <header class="topbar">
      <div class="close-box" onclick="logout()"></div>
      <h1>Control Panel</h1>
      <div class="shade-box"></div>
      <div class="zoom-box"></div>
    </header>
    
    <div class="main-area">
      <aside class="sidebar">
        <div class="panel-tab active" onclick="switchTab('postsTab')">\u6587\u7AE0\u7BA1\u7406</div>
        <div class="panel-tab" onclick="switchTab('statsTab')">\u6D41\u91CF\u7EDF\u8BA1</div>
        <div class="panel-tab" onclick="switchTab('visitsTab')">\u8BBF\u95EE\u8BB0\u5F55</div>
        <div class="panel-tab" onclick="switchTab('guestbookTab')">\u7559\u8A00\u7BA1\u7406</div>
        <div class="panel-tab" onclick="switchTab('logsTab')">\u7CFB\u7EDF\u65E5\u5FD7</div>
        <div class="panel-tab" onclick="switchTab('settingsTab')">\u7CFB\u7EDF\u8BBE\u7F6E</div>
        <div class="panel-tab" onclick="switchTab('imagesTab')">\u56FE\u5E8A\u7BA1\u7406</div>
      </aside>
      
      <section class="content-area">
        <div id="postsTab" class="tab-content active">
          <div id="postMessage" class="message"></div>
          
          <div class="section-title" style="display:flex; justify-content:space-between; align-items:center;">
            \u5199\u65B0\u52A8\u6001
            <button class="btn btn-small" onclick="publishPost()">\u53D1\u5E03</button>
          </div>
          <div class="form-group">
            <input type="text" id="postTitle" placeholder="\u6807\u9898...">
          </div>
          <div class="form-group">
            <textarea id="postContent" placeholder="\u5199\u70B9\u4EC0\u4E48\u5427..."></textarea>
          </div>
          
          <div class="form-group">
            <label>\u914D\u56FE (\u70B9\u51FB\u4E0A\u4F20, \u6700\u591A 4 \u5F20)</label>
            <div class="upload-area" onclick="if(uploadedImageUrls.length < 4) document.getElementById('imageInput').click()">
              <div id="uploadPrompt">\u9009\u62E9\u56FE\u7247\u6216\u62D6\u62FD\u5230\u6B64\u5904</div>
              <div id="imagePreviewContainer" style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;"></div>
            </div>
            <input type="file" id="imageInput" style="display:none" accept="image/*" multiple onchange="handleImageSelect(event)">
            <div class="progress-bar" id="uploadProgress" style="display:none">
              <div class="progress-fill" id="uploadFill" style="width: 0%"></div>
            </div>
          </div>

          <div class="section-title" style="margin-top:30px;">\u5386\u53F2\u52A8\u6001</div>
          <div id="postList"></div>
        </div>

        <div id="statsTab" class="tab-content">
          <div class="section-title">\u6838\u5FC3\u6570\u636E</div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="number" id="statTotalVisits">0</div>
              <div class="label">\u603B\u8BBF\u95EE\u91CF</div>
            </div>
            <div class="stat-card">
              <div class="number" id="statUniqueIPs">0</div>
              <div class="label">\u72EC\u7ACB\u8BBF\u5BA2 (IP)</div>
            </div>
            <div class="stat-card">
              <div class="number" id="statTotalPosts">0</div>
              <div class="label">\u5DF2\u53D1\u5E03\u52A8\u6001</div>
            </div>
          </div>
          
          <div class="section-title">\u6700\u53D7\u6B22\u8FCE\u9875\u9762 (Top 5)</div>
          <div id="topPagesList" style="background:#EEEEEE; border:1px solid #000; padding:10px;"></div>
        </div>

        <div id="visitsTab" class="tab-content">
          <div class="section-title">\u6700\u8FD1\u8BBF\u95EE\u8BB0\u5F55 <button id="refreshVisitsBtn" class="btn btn-small" onclick="refreshVisits()" style="float: right; margin-top: -5px;">\u5237\u65B0</button></div>
          <table class="visit-table">
            <thead>
              <tr><th>\u65F6\u95F4</th><th>\u8DEF\u5F84</th><th>IP</th><th>\u8BBE\u5907</th></tr>
            </thead>
            <tbody id="visitTableBody"></tbody>
          </table>
        </div>

        <div id="guestbookTab" class="tab-content">
          <div id="gbMessage" class="message"></div>
          <div class="section-title">\u7559\u8A00\u7BA1\u7406</div>
          <table class="visit-table">
            <thead>
              <tr><th>\u65F6\u95F4</th><th>\u6635\u79F0</th><th>\u5185\u5BB9</th><th>\u64CD\u4F5C</th></tr>
            </thead>
            <tbody id="guestbookTableBody"></tbody>
          </table>
        </div>

        <div id="logsTab" class="tab-content">
          <div class="section-title">\u7CFB\u7EDF\u65E5\u5FD7 (\u6700\u8FD150\u6761)</div>
          <table class="visit-table">
            <thead>
              <tr><th>\u65F6\u95F4</th><th>\u7EA7\u522B</th><th>\u4FE1\u606F</th></tr>
            </thead>
            <tbody id="logTableBody"></tbody>
          </table>
        </div>

        <div id="settingsTab" class="tab-content">
          <div id="settingsMessage" class="message"></div>
          <div class="section-title">\u7F51\u7AD9\u4FE1\u606F\u8BBE\u7F6E</div>
          <div class="form-group">
            <label>\u7F51\u9875\u6807\u9898\u680F (Mac \u4F2A\u6807\u9898\u680F)</label>
            <input type="text" id="windowTitleInput" placeholder="\u663E\u793A\u5728\u6D4F\u89C8\u5668\u6807\u7B7E\u9875\u548C Mac \u6807\u9898\u680F\u4E0A\u7684\u6587\u5B57">
          </div>
          <div class="form-group">
            <label>\u9996\u9875\u5927\u6807\u9898 (\u6253\u5B57\u6548\u679C)</label>
            <input type="text" id="siteTitleInput" placeholder="TeeAte's Website">
          </div>
          <div class="form-group">
            <label>\u9996\u9875\u526F\u6807\u9898</label>
            <input type="text" id="siteSubtitleInput" placeholder="\u5F88Niubi \u7684 Website">
          </div>

          <div class="form-group">
            <label>\u524D\u53F0\u201C\u5173\u4E8E\u201D\u9875\u9762\u6807\u9898</label>
            <input type="text" id="aboutTitleInput" placeholder="\u5173\u4E8E\u6211 (About)">
          </div>
          <div class="form-group">
            <label>\u524D\u53F0\u201C\u5173\u4E8E\u201D\u9875\u9762\u5185\u5BB9 (\u652F\u6301 HTML)</label>
            <textarea id="aboutContentInput" placeholder="\u8F93\u5165\u5173\u4E8E\u4F60\u7684\u4ECB\u7ECD..."></textarea>
          </div>

          <div class="form-group">
            <label>\u524D\u53F0\u201C\u5173\u4E8E\u201D\u9875\u9762\u914D\u56FE</label>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <div style="flex: 1;">
                <input type="text" id="aboutImageInput" placeholder="\u56FE\u7247\u94FE\u63A5 (\u4E5F\u53EF\u76F4\u63A5\u4E0A\u4F20)">
                <input type="file" id="aboutImageUpload" accept="image/*,image/gif" style="display:none" onchange="uploadAboutImage(event)">
                <div style="margin-top: 10px; display: flex; gap: 10px;">
                  <button class="btn btn-small" onclick="document.getElementById('aboutImageUpload').click()">\u4E0A\u4F20\u65B0\u56FE\u7247</button>
                  <button class="btn btn-small" onclick="clearAboutImage()">\u6E05\u9664\u56FE\u7247</button>
                </div>
              </div>
              <img id="aboutImagePreview" src="" style="display:none; max-width: 150px; max-height: 100px; border: 1px solid #000;">
            </div>
          </div>
          <div class="form-group">
            <label>\u5D4C\u5165\u5F0F\u97F3\u4E50\u64AD\u653E\u5668\u4EE3\u7801 (\u652F\u6301 iframe/HTML)</label>
            <textarea id="musicPlayerCodeInput" placeholder="\u8F93\u5165\u4F60\u60F3\u5D4C\u5165\u7684\u97F3\u4E50\u64AD\u653E\u5668\u4EE3\u7801..."></textarea>
          </div>
          <div class="form-group">
            <label>\u4FEE\u6539\u7BA1\u7406\u540E\u53F0\u5BC6\u7801</label>
            <input type="password" id="adminPasswordInput" placeholder="\u7559\u7A7A\u5219\u4E0D\u4FEE\u6539...">
          </div>
          <button class="btn" onclick="saveSettings()">\u4FDD\u5B58\u8BBE\u7F6E</button>
        </div>

        <div id="imagesTab" class="tab-content">
          <div id="imagesMessage" class="message"></div>
          <div class="section-title">\u56FE\u5E8A\u7BA1\u7406 (KV)</div>
          <div style="margin-bottom: 15px; display: flex; gap: 10px;">
            <button class="btn btn-small" onclick="loadImages()">\u5237\u65B0\u56FE\u5E8A</button>
            <button class="btn btn-small" style="background: #aa0000; border-color: #880000;" onclick="cleanUnusedImages()">\u4E00\u952E\u6E05\u7406\u672A\u4F7F\u7528</button>
          </div>
          <div id="imagesList" style="display: flex; flex-wrap: wrap; gap: 10px;">
            <!-- Images go here -->
          </div>
        </div>

      </section>
    </div>
  </div>

  <div id="visitDetailsModal" class="modal-overlay" style="display:none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; padding: 16px;">
    <div class="window" style="width: 100%; max-width: 500px; max-height: 90vh; display: flex; flex-direction: column;">
      <div class="topbar">
        <div class="close-box" onclick="closeVisitDetails()"></div>
        <h1>\u8BBF\u95EE\u8BE6\u60C5</h1>
        <div class="shade-box"></div>
        <div class="zoom-box"></div>
      </div>
      <div style="flex: 1; overflow-y: auto; background: #BBBBBB; padding: 15px; border-top: 1px solid #FFFFFF;">
        <div id="visitDetailsContent" style="background: #FFFFFF; border: 1px solid #000000; box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2); padding: 12px; font-size: 14px; line-height: 1.6; max-height: 60vh; overflow-y: auto;"></div>
        <div style="text-align: right; margin-top: 15px;">
          <button class="btn" onclick="closeVisitDetails()">\u786E\u5B9A</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    let recentlyDeletedImages = new Set();
    function escapeHtml(text) {
      if (!text) return '';
      return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    // \u6CE8\u5165\u521D\u59CB\u6570\u636E
    let stats = { totalVisits: 0, uniqueIPs: 0, totalPosts: 0, topPages: [] };
    let postsData = [];
    let visitsData = [];
    let logsData = [];
    let guestbookData = [];
    const currentSettings = {
      site_title: \`${siteTitle.replace(/`/g, "\\`")}\`,
      site_subtitle: \`${siteSubtitle.replace(/`/g, "\\`")}\`,
      window_title: \`${windowTitle.replace(/`/g, "\\`")}\`,
      about_title: \`${aboutTitle.replace(/`/g, "\\`")}\`,
      about_image_url: \`${aboutImageUrl.replace(/`/g, "\\`")}\`,
      about_content: \`${aboutContent.replace(/`/g, "\\`")}\`,
      music_player_code: \`${musicPlayerCode.replace(/`/g, "\\`")}\`
    };

    let uploadedImageUrls = [];

    window.onload = () => {
      const isAuth = ${isAuth};
      if (isAuth || document.cookie.includes('admin_token=secret-admin-token')) {
        showDashboard();
      }
    };

    function showDashboard() {
      document.getElementById('loginView').style.display = 'none';
      document.getElementById('menuBar').style.display = 'flex';
      document.getElementById('dashboardView').style.display = 'flex';
      renderSettings();
      switchTab('postsTab');
    }

    async function login() {
      const pwd = document.getElementById('passwordInput').value;
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pwd })
        });
        const data = await res.json();
        if (data.success) {
          showDashboard();
        } else {
          showMessage('loginMessage', data.message, 'error');
        }
      } catch (e) {
        showMessage('loginMessage', '\u767B\u5F55\u8BF7\u6C42\u5931\u8D25', 'error');
      }
    }

    async function logout() {
      await fetch('/logout');
      location.reload();
    }

    let switchTab = async function(tabId) {
      document.querySelectorAll('.panel-tab').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      if (event && event.target) {
        event.target.classList.add('active');
      }
      document.getElementById(tabId).classList.add('active');
      
      if (tabId === 'imagesTab') {
        loadImages();
      } else if (tabId === 'postsTab') {
        await refreshPosts();
      } else if (tabId === 'statsTab') {
        await refreshStats();
      } else if (tabId === 'visitsTab') {
        await refreshVisits();
      } else if (tabId === 'guestbookTab') {
        await refreshGuestbook();
      } else if (tabId === 'logsTab') {
        await refreshLogs();
      }
    };

    function showMessage(elementId, message, type = 'success') {
      const el = document.getElementById(elementId);
      el.textContent = message;
      el.className = 'message ' + type;
      setTimeout(() => { el.className = 'message'; }, 3000);
    }

    // Helper functions for dynamic fetching
    async function refreshPosts() {
      try {
        const res = await fetch('/api/posts');
        postsData = await res.json() || [];
        const postList = document.getElementById('postList');
        postList.innerHTML = postsData.map(post => \`
          <div class="post-item">
            <div class="post-item-info">
              <h3>\${escapeHtml(post.title)}</h3>
              <p>\${new Date(post.created_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
            </div>
            <div>
              <button class="btn btn-small" onclick="editPost(\${post.id})">\u7F16\u8F91</button>
              <button class="btn btn-small" onclick="deletePost(\${post.id})">\u5220\u9664</button>
            </div>
          </div>
        \`).join('');
      } catch (e) { console.error('Failed to fetch posts', e); }
    }

    async function refreshGuestbook() {
      try {
        const res = await fetch('/api/guestbook'); // Note: worker.js doesn't have GET /api/guestbook! We must fix worker.js too!
        guestbookData = await res.json() || [];
        const gbBody = document.getElementById('guestbookTableBody');
        gbBody.innerHTML = guestbookData.map(g => \`
          <tr>
            <td>\${new Date(g.created_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</td>
            <td>\${escapeHtml(g.author)}</td>
            <td>\${escapeHtml(g.message).substring(0,30)}\${g.message.length>30?'...':''}</td>
            <td>
              <button class="btn btn-small" onclick="editGuestbook(\${g.id})">\u7F16\u8F91</button>
              <button class="btn btn-small" onclick="deleteGuestbook(\${g.id})">\u5220\u9664</button>
            </td>
          </tr>
        \`).join('');
      } catch (e) { console.error('Failed to fetch guestbook', e); }
    }

    async function refreshLogs() {
      try {
        const res = await fetch('/api/logs');
        logsData = await res.json() || [];
        const logBody = document.getElementById('logTableBody');
        logBody.innerHTML = logsData.map(l => \`
          <tr>
            <td>\${new Date(l.created_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</td>
            <td>\${escapeHtml(l.level)}</td>
            <td title="\${escapeHtml(l.message)}">\${escapeHtml(l.message).substring(0,50)}...</td>
          </tr>
        \`).join('');
      } catch (e) { console.error('Failed to fetch logs', e); }
    }

    function renderSettings() {
      document.getElementById('siteTitleInput').value = currentSettings.site_title;
      document.getElementById('siteSubtitleInput').value = currentSettings.site_subtitle;
      document.getElementById('windowTitleInput').value = currentSettings.window_title;
      document.getElementById('aboutTitleInput').value = currentSettings.about_title;
      document.getElementById('aboutContentInput').value = currentSettings.about_content;
      document.getElementById('aboutImageInput').value = currentSettings.about_image_url || '';
      if (currentSettings.about_image_url) { document.getElementById('aboutImagePreview').src = currentSettings.about_image_url; document.getElementById('aboutImagePreview').style.display = 'block'; }
      document.getElementById('musicPlayerCodeInput').value = currentSettings.music_player_code || '';
    }

    async function handleImageSelect(event) {
      const files = Array.from(event.target.files);
      if (!files.length) return;
      if (uploadedImageUrls.length + files.length > 4) {
        showMessage('postMessage', '\u6700\u591A\u53EA\u80FD\u4E0A\u4F20 4 \u5F20\u56FE\u7247', 'error');
        return;
      }

      document.getElementById('uploadProgress').style.display = 'block';
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        document.getElementById('uploadFill').style.width = Math.round((i / files.length) * 100) + '%';
        const formData = new FormData();
        formData.append('image', file);
        try {
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          const data = await res.json();
          if (data.success) {
            uploadedImageUrls.push(data.url);
            renderImagePreviews();
          } else {
            showMessage('postMessage', '\u56FE\u7247\u4E0A\u4F20\u5931\u8D25: ' + data.error, 'error');
          }
        } catch (e) {
          showMessage('postMessage', '\u4E0A\u4F20\u51FA\u9519', 'error');
        }
      }
      
      document.getElementById('uploadFill').style.width = '100%';
      setTimeout(() => {
        document.getElementById('uploadProgress').style.display = 'none';
        document.getElementById('uploadFill').style.width = '0%';
      }, 500);
      
      document.getElementById('imageInput').value = '';
    }



    async function refreshStats() {
      const btn = document.getElementById('refreshStatsBtn');
      if (btn) btn.textContent = '\u5237\u65B0\u4E2D...';
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        document.getElementById('statTotalVisits').textContent = data.totalVisits;
        document.getElementById('statUniqueIPs').textContent = data.uniqueIPs;
        document.getElementById('statTotalPosts').textContent = data.totalPosts;
        
        const topPagesHtml = data.topPages.map((p, i) => \`
          <div style="display:flex; justify-content:space-between; margin-bottom:5px; padding:5px; background:#fff; border:1px solid #ccc;">
            <span>\${i+1}. \${escapeHtml(p.path)}</span>
            <span style="font-weight:bold;">\${p.count} \u6B21</span>
          </div>
        \`).join('');
        document.getElementById('topPagesList').innerHTML = topPagesHtml || '<p>\u6682\u65E0\u6570\u636E</p>';
      } catch(e) {
        console.error('Refresh stats failed', e);
      }
      if (btn) btn.textContent = '\u5237\u65B0';
    }

    async function refreshVisits() {
      const btn = document.getElementById('refreshVisitsBtn');
      if (btn) btn.textContent = '\u5237\u65B0\u4E2D...';
      try {
        const res = await fetch('/api/visits');
        const data = await res.json();
        // Update visitsData global so details modal works
        visitsData.length = 0;
        visitsData.push(...data);
        
        const visitBody = document.getElementById('visitTableBody');
        visitBody.innerHTML = visitsData.map(v => \`
          <tr onclick="showVisitDetails('\${v.id}')" style="cursor: pointer;" title="\u70B9\u51FB\u67E5\u770B\u8BE6\u60C5">
            <td>\${new Date(v.visit_time).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</td>
            <td>\${escapeHtml(v.path)}</td>
            <td>\${escapeHtml(v.ip)}</td>
            <td>\${escapeHtml(v.user_agent).substring(0,30)}...</td>
          </tr>
        \`).join('');
      } catch(e) {
        console.error('Refresh visits failed', e);
      }
      if (btn) btn.textContent = '\u5237\u65B0';
    }

    function showVisitDetails(id) {
      const v = visitsData.find(x => x.id == id);
      if (!v) return;
      const details = \`
        <p><strong>\u8BBF\u95EE\u65F6\u95F4\uFF1A</strong> \${new Date(v.visit_time).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
        <p><strong>\u8DEF\u5F84\uFF1A</strong> \${escapeHtml(v.path)}</p>
        <p><strong>IP\uFF1A</strong> \${escapeHtml(v.ip)}</p>
        <p><strong>\u8BBE\u5907 (User-Agent)\uFF1A</strong></p>
        <div style="background: #eee; padding: 10px; border-radius: 4px; word-break: break-all; margin-bottom: 10px;">\${escapeHtml(v.user_agent)}</div>
        <p><strong>\u6765\u6E90 (Referrer)\uFF1A</strong></p>
        <div style="background: #eee; padding: 10px; border-radius: 4px; word-break: break-all;">\${escapeHtml(v.referrer || '\u65E0')}</div>
      \`;
      document.getElementById('visitDetailsContent').innerHTML = details;
      document.getElementById('visitDetailsModal').style.display = 'flex';
    }

    function closeVisitDetails() {
      document.getElementById('visitDetailsModal').style.display = 'none';
    }

    
    function renderImagePreviews() {
      const container = document.getElementById('imagePreviewContainer');
      const uploadText = document.getElementById('uploadPrompt');
      if(!container) return;
      container.innerHTML = '';
      if (uploadedImageUrls.length > 0) {
        uploadText.style.display = 'none';
        uploadedImageUrls.forEach((url, idx) => {
          container.innerHTML += "<div style='position:relative; width:80px; height:80px;'>" +
            "<img src='" + url + "' style='width:100%; height:100%; object-fit:cover; border:1px solid #000;'>" +
            "<button onclick='event.stopPropagation(); removeImage(" + idx + ")' style='position:absolute; top:-5px; right:-5px; background:var(--text); color:var(--bg); border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-weight:bold; box-shadow: 1px 1px 0 #000;'>\xD7</button>" +
          "</div>";
        });
      } else {
        uploadText.style.display = 'block';
      }
    }
    
    window.removeImage = function(idx) {
      uploadedImageUrls.splice(idx, 1);
      renderImagePreviews();
    }
    let editingPostId = null;


    function editPost(id) {
      const post = postsData.find(p => p.id === id);
      if (!post) return;
      document.getElementById('postTitle').value = post.title;
      document.getElementById('postContent').value = post.content;
      uploadedImageUrls = [];
      if (post.image_url) {
        if (post.image_url.startsWith('[')) {
          try { uploadedImageUrls = JSON.parse(post.image_url); } catch(e){}
        } else {
          uploadedImageUrls = [post.image_url];
        }
      }
      renderImagePreviews();
      
      switchTab('postsTab');
      showMessage('postMessage', '\u6B63\u5728\u7F16\u8F91\u6587\u7AE0\uFF1A' + post.title, 'success');
      window.scrollTo(0, 0);
    }

    async function publishPost() {
      const title = document.getElementById('postTitle').value;
      const content = document.getElementById('postContent').value;
      
      if (!title || !content) {
        showMessage('postMessage', '\u6807\u9898\u548C\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A', 'error');
        return;
      }

      const method = editingPostId ? "PUT" : "POST";
      const url = editingPostId ? \`/api/posts/\${editingPostId}\` : "/api/posts";

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, imageUrls: uploadedImageUrls })
        });
        const data = await res.json();
        if (data.success) {
          showMessage('postMessage', editingPostId ? '\u66F4\u65B0\u6210\u529F\uFF01' : '\u53D1\u5E03\u6210\u529F\uFF01', 'success');
          setTimeout(() => location.reload(), 1000);
        } else {
          showMessage('postMessage', editingPostId ? '\u66F4\u65B0\u5931\u8D25' : '\u53D1\u5E03\u5931\u8D25', 'error');
        }
      } catch (e) {
        showMessage('postMessage', '\u8BF7\u6C42\u5931\u8D25: ' + e.message, 'error');
      }
    }

    window.deletePost = async function(id) {
      if (!confirm('\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u6761\u52A8\u6001\u5417\uFF1F')) return;
      try {
        const res = await fetch('/api/posts/' + id, { method: 'DELETE' });
        if ((await res.json()).success) {
          showMessage('postMessage', '\u5220\u9664\u6210\u529F', 'success');
          setTimeout(() => location.reload(), 1000);
        }
      } catch (e) {
        showMessage('postMessage', '\u5220\u9664\u5931\u8D25', 'error');
      }
    }

    async function editGuestbook(id) {
      const gb = guestbookData.find(g => g.id === id);
      if (!gb) return;
      const newMessage = prompt('\u4FEE\u6539\u7559\u8A00\u5185\u5BB9:', gb.message);
      if (newMessage === null || newMessage.trim() === gb.message.trim()) return;
      
      try {
        const res = await fetch('/api/guestbook/' + id, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: newMessage })
        });
        if ((await res.json()).success) {
          showMessage('gbMessage', '\u4FEE\u6539\u6210\u529F', 'success');
          setTimeout(() => location.reload(), 1000);
        } else {
          showMessage('gbMessage', '\u4FEE\u6539\u5931\u8D25', 'error');
        }
      } catch (e) {
        showMessage('gbMessage', '\u7F51\u7EDC\u9519\u8BEF', 'error');
      }
    }

    async function deleteGuestbook(id) {
      if (!confirm('\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u6761\u7559\u8A00\u5417\uFF1F')) return;
      try {
        const res = await fetch('/api/guestbook/' + id, { method: 'DELETE' });
        if ((await res.json()).success) {
          showMessage('gbMessage', '\u5220\u9664\u6210\u529F', 'success');
          setTimeout(() => location.reload(), 1000);
        }
      } catch (e) {
        showMessage('gbMessage', '\u5220\u9664\u5931\u8D25', 'error');
      }
    }


    async function uploadAboutImage(e) {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('image', file);
      try {
        showMessage('settingsMessage', '\u56FE\u7247\u4E0A\u4F20\u4E2D...', 'success');
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          document.getElementById('aboutImageInput').value = data.url;
          document.getElementById('aboutImagePreview').src = data.url;
          document.getElementById('aboutImagePreview').style.display = 'block';
          showMessage('settingsMessage', '\u914D\u56FE\u4E0A\u4F20\u6210\u529F\uFF0C\u8BF7\u70B9\u51FB\u4FDD\u5B58\u8BBE\u7F6E', 'success');
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        showMessage('settingsMessage', '\u914D\u56FE\u4E0A\u4F20\u5931\u8D25: ' + err.message, 'error');
      }
    }
    function clearAboutImage() {
      document.getElementById('aboutImageInput').value = '';
      document.getElementById('aboutImagePreview').src = '';
      document.getElementById('aboutImagePreview').style.display = 'none';
      showMessage('settingsMessage', '\u5DF2\u6E05\u9664\u914D\u56FE\uFF0C\u8BF7\u70B9\u51FB\u4FDD\u5B58\u8BBE\u7F6E', 'success');
    }

    async function saveSettings() {
      const settings = {
        site_title: document.getElementById('siteTitleInput').value,
        site_subtitle: document.getElementById('siteSubtitleInput').value,
        window_title: document.getElementById('windowTitleInput').value,
        about_title: document.getElementById('aboutTitleInput').value,
        about_content: document.getElementById('aboutContentInput').value,
        about_image_url: document.getElementById('aboutImageInput').value,
        music_player_code: document.getElementById('musicPlayerCodeInput').value
      };
      const pwd = document.getElementById('adminPasswordInput').value;
      if (pwd) {
        settings.admin_password = pwd;
      }
      try {
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
        });
        if ((await res.json()).success) {
          showMessage('settingsMessage', '\u8BBE\u7F6E\u4FDD\u5B58\u6210\u529F', 'success');
        }
      } catch (e) {
        showMessage('settingsMessage', '\u4FDD\u5B58\u5931\u8D25', 'error');
      }
    }


    async function loadImages() {
      const container = document.getElementById('imagesList');
      container.innerHTML = '<p>\u52A0\u8F7D\u4E2D...</p>';
      try {
        const res = await fetch('/api/images');
        let images = await res.json();
        images = images.filter(img => !recentlyDeletedImages.has(img.name));
        if (images.length === 0) {
          container.innerHTML = '<p>\u56FE\u5E8A\u4E3A\u7A7A</p>';
          return;
        }
        container.innerHTML = images.map(img => \`
          <div style="border: 1px solid #000; padding: 5px; width: 150px; background: #fff; text-align: center;">
            <div style="height: 100px; display: flex; align-items: center; justify-content: center; background: #eee; margin-bottom: 5px; overflow: hidden;">
              <img src="\${img.url}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            </div>
            <div style="font-size: 11px; word-break: break-all; margin-bottom: 5px; height: 30px; overflow: hidden;">\${escapeHtml(img.name)}</div>
            <div style="margin-bottom: 5px; font-weight: bold; color: \${img.used ? '#00aa00' : '#aa0000'};">
              \${img.used ? '\u2705 \u5DF2\u4F7F\u7528' : '\u26A0\uFE0F \u672A\u4F7F\u7528'}
            </div>
            <button class="btn btn-small" style="width: 100%" onclick="deleteImage('\${img.name}')">\u5220\u9664</button>
          </div>
        \`).join('');
      } catch (err) {
        showMessage('imagesMessage', '\u52A0\u8F7D\u56FE\u5E8A\u5931\u8D25: ' + err.message, 'error');
        container.innerHTML = '<p>\u52A0\u8F7D\u5931\u8D25</p>';
      }
    }

    async function deleteImage(name) {
      if (!confirm('\u786E\u5B9A\u8981\u5220\u9664\u56FE\u7247 ' + name + ' \u5417\uFF1F\u5220\u9664\u540E\u5C06\u65E0\u6CD5\u6062\u590D\uFF01')) return;
      try {
        const res = await fetch('/api/images/' + name, { method: 'DELETE' });
        if ((await res.json()).success) {
          recentlyDeletedImages.add(name);
          showMessage('imagesMessage', '\u5220\u9664\u6210\u529F\uFF01', 'success');
          loadImages();
        } else {
          showMessage('imagesMessage', '\u5220\u9664\u5931\u8D25\uFF01', 'error');
        }
      } catch (err) {
        showMessage('imagesMessage', '\u8BF7\u6C42\u5931\u8D25', 'error');
      }
    }

    async function cleanUnusedImages() {
      try {
        showMessage('imagesMessage', '\u6B63\u5728\u626B\u63CF\u672A\u4F7F\u7528\u7684\u56FE\u7247...', 'success');
        const res = await fetch('/api/images');
        const images = await res.json();
        const unused = images.filter(img => !img.used);
        
        if (unused.length === 0) {
          showMessage('imagesMessage', '\u6CA1\u6709\u53D1\u73B0\u672A\u4F7F\u7528\u7684\u56FE\u7247\uFF01', 'success');
          return;
        }
        
        if (!confirm(\`\u53D1\u73B0 \${unused.length} \u5F20\u672A\u4F7F\u7528\u7684\u56FE\u7247\uFF0C\u786E\u5B9A\u8981\u4E00\u952E\u6E05\u7406\u5417\uFF1F\u6E05\u7406\u540E\u5C06\u65E0\u6CD5\u6062\u590D\uFF01\`)) return;
        
        showMessage('imagesMessage', \`\u6B63\u5728\u6E05\u7406 \${unused.length} \u5F20\u56FE\u7247\uFF0C\u8BF7\u7A0D\u5019...\`, 'success');
        let successCount = 0;
        for (const img of unused) {
          try {
            const dRes = await fetch('/api/images/' + img.name, { method: 'DELETE' });
            if ((await dRes.json()).success) {
              successCount++;
              recentlyDeletedImages.add(img.name);
            }
          } catch (e) {
            console.error('Failed to delete', img.name);
          }
        }
        showMessage('imagesMessage', \`\u6E05\u7406\u5B8C\u6210\uFF01\u6210\u529F\u5220\u9664\u4E86 \${successCount} \u5F20\u56FE\u7247\u3002\`, 'success');
        loadImages();
      } catch (err) {
        showMessage('imagesMessage', '\u6E05\u7406\u8FC7\u7A0B\u53D1\u751F\u9519\u8BEF: ' + err.message, 'error');
      }
    }
  <\/script>
</body>
</html>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-cache, no-store, must-revalidate" }
  });
}
__name(serveAdminPanel, "serveAdminPanel");
async function handlePetRequest(url, request, env) {
  if (request.method === "GET") {
    try {
      const { results } = await env.DB.prepare("SELECT * FROM pet_state WHERE id = 1").all();
      let pet = results[0];
      if (!pet) {
        pet = { name: "Cloud Cat", exp: 0, level: 1 };
      }
      return new Response(JSON.stringify(pet), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }
  if (request.method === "POST") {
    try {
      const body = await request.json();
      const action = body.action || "feed";
      const expGain = action === "feed" ? 10 : action === "play" ? 15 : 5;
      const { results } = await env.DB.prepare("SELECT exp FROM pet_state WHERE id = 1").all();
      let currentExp = results[0] ? results[0].exp : 0;
      currentExp += expGain;
      const level = Math.floor(currentExp / 100) + 1;
      await env.DB.prepare("UPDATE pet_state SET exp = ?, level = ? WHERE id = 1").bind(currentExp, level).run();
      return new Response(JSON.stringify({ success: true, exp: currentExp, level }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }
  return new Response("Method not allowed", { status: 405 });
}
__name(handlePetRequest, "handlePetRequest");
var worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    if (!pathname.startsWith("/api/") && pathname !== "/admin") {
      const ip = request.headers.get("cf-connecting-ip") || "unknown";
      const userAgent = request.headers.get("user-agent") || "unknown";
      const referer = request.headers.get("referer") || "";
      ctx.waitUntil(
        env.DB.prepare(
          "INSERT INTO visits (path, ip, user_agent, referer) VALUES (?, ?, ?, ?)"
        ).bind(pathname, ip, userAgent, referer).run().catch((e) => console.error("Log error", e))
      );
    }
    if (pathname.startsWith("/api/")) {
      try {
        return await handleApi(request, env, pathname);
      } catch (error) {
        ctx.waitUntil(
          env.DB.prepare(
            "INSERT INTO logs (level, message, source) VALUES (?, ?, ?)"
          ).bind("error", String(error.stack || error.message).substring(0, 500), "api").run().catch(() => {
          })
        );
        return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), { status: 500 });
      }
    }
    if (pathname === "/admin") {
      return await serveAdminPanel(request, env);
    }
    if (pathname === "/") {
      return await serveHomepage(request, env);
    }
    return new Response("Not Found", { status: 404 });
  }
};
async function handleApi(request, env, pathname) {
  const method = request.method;
  if (pathname.startsWith("/api/pet")) {
    return handlePetRequest(new URL(request.url), request, env);
  }
  if (pathname === "/api/guestbook" && method === "GET") {
    if (!isAuthenticated(request)) return new Response("Unauthorized", { status: 401 });
    const result = await env.DB.prepare("SELECT * FROM guestbook ORDER BY created_at DESC").all();
    return new Response(JSON.stringify(result.results || []), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/guestbook" && method === "POST") {
    const { author, message, x: x2, y: y2, color } = await request.json();
    if (!author || !message) return new Response(JSON.stringify({ success: false, message: "\u6635\u79F0\u548C\u7559\u8A00\u4E0D\u80FD\u4E3A\u7A7A" }), { status: 400 });
    const posX = x2 !== void 0 ? parseInt(x2) : -1;
    const posY = y2 !== void 0 ? parseInt(y2) : -1;
    const clr = color || "yellow";
    await env.DB.prepare("INSERT INTO guestbook (author, message, x, y, color) VALUES (?, ?, ?, ?, ?)").bind(author, message, posX, posY, clr).run();
    return new Response(JSON.stringify({ success: true }));
  }
  if (pathname.match(/^\/api\/guestbook\/\d+\/position$/) && method === "PATCH") {
    const id = pathname.split("/")[3];
    const { x: x2, y: y2 } = await request.json();
    await env.DB.prepare("UPDATE guestbook SET x = ?, y = ? WHERE id = ?").bind(parseInt(x2), parseInt(y2), id).run();
    return new Response(JSON.stringify({ success: true }));
  }
  if (pathname.startsWith("/api/guestbook/") && method === "DELETE") {
    if (!isAuthenticated(request)) return new Response("Unauthorized", { status: 401 });
    const id = pathname.split("/").pop();
    await env.DB.prepare("DELETE FROM guestbook WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true }));
  }
  if (pathname.startsWith("/api/guestbook/") && method === "PUT") {
    if (!isAuthenticated(request)) return new Response("Unauthorized", { status: 401 });
    const id = pathname.split("/").pop();
    const { message } = await request.json();
    await env.DB.prepare("UPDATE guestbook SET message = ? WHERE id = ?").bind(message, id).run();
    return new Response(JSON.stringify({ success: true }));
  }
  if (pathname === "/api/login" && method === "POST") {
    const { password } = await request.json();
    const settingsResult = await env.DB.prepare("SELECT value FROM settings WHERE key = 'admin_password'").first();
    const validPassword = settingsResult && settingsResult.value ? settingsResult.value : "admin123";
    if (password === validPassword) {
      const response = new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
      setCookie(response, "admin_token", "secret-admin-token", 7);
      return response;
    }
    return new Response(JSON.stringify({ success: false, message: "\u5BC6\u7801\u9519\u8BEF" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname.startsWith("/api/images/") && method === "GET") {
    const imageName = pathname.split("/api/images/")[1];
    const image = await env.IMAGE_KV.get(imageName, { type: "arrayBuffer" });
    if (!image) {
      return new Response("Image not found", { status: 404 });
    }
    const ext = imageName.split(".").pop().toLowerCase();
    const contentTypes = {
      "png": "image/png",
      "gif": "image/gif",
      "webp": "image/webp",
      "svg": "image/svg+xml",
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg"
    };
    return new Response(image, {
      headers: {
        "Content-Type": contentTypes[ext] || "image/jpeg",
        "Cache-Control": "public, max-age=31536000"
      }
    });
  }
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "\u672A\u6388\u6743" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/posts" && method === "GET") {
    const result = await env.DB.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
    return new Response(JSON.stringify(result.results), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/posts" && method === "POST") {
    const { title, content, imageUrl, imageUrls } = await request.json();
    let finalImageValue = null;
    if (imageUrls && imageUrls.length > 0) {
      finalImageValue = JSON.stringify(imageUrls);
    } else if (imageUrl) {
      finalImageValue = imageUrl;
    }
    const result = await env.DB.prepare(
      "INSERT INTO posts (title, content, image_url) VALUES (?, ?, ?)"
    ).bind(title, content, finalImageValue).run();
    return new Response(JSON.stringify({
      success: true,
      id: result.meta?.last_row_id || result.lastRowId || null
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname.startsWith("/api/posts/") && method === "PUT") {
    const id = pathname.split("/")[3];
    const { title, content, imageUrl, imageUrls } = await request.json();
    let finalImageValue = null;
    if (imageUrls && imageUrls.length > 0) {
      finalImageValue = JSON.stringify(imageUrls);
    } else if (imageUrl) {
      finalImageValue = imageUrl;
    }
    await env.DB.prepare(
      "UPDATE posts SET title = ?, content = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(title, content, finalImageValue, id).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname.startsWith("/api/posts/") && method === "DELETE") {
    const id = pathname.split("/")[3];
    await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/logs" && method === "GET") {
    const logs = await env.DB.prepare("SELECT * FROM logs ORDER BY created_at DESC LIMIT 50").all();
    return new Response(JSON.stringify(logs.results || []), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/logs" && method === "DELETE") {
    await env.DB.prepare("DELETE FROM logs").run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/stats" && method === "GET") {
    const totalPosts = await env.DB.prepare("SELECT COUNT(*) as count FROM posts").first();
    const totalVisits = await env.DB.prepare("SELECT COUNT(*) as count FROM visits").first();
    const uniqueIPs = await env.DB.prepare("SELECT COUNT(DISTINCT ip) as count FROM visits").first();
    const recentVisits = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM visits WHERE visit_time >= datetime("now", "-1 day")'
    ).first();
    const topPages = await env.DB.prepare(
      "SELECT path, COUNT(*) as count FROM visits GROUP BY path ORDER BY count DESC LIMIT 10"
    ).all();
    const todayVisits = await env.DB.prepare(
      "SELECT DATE(visit_time) as day, COUNT(*) as count FROM visits GROUP BY DATE(visit_time) ORDER BY day DESC LIMIT 7"
    ).all();
    return new Response(JSON.stringify({
      totalPosts: totalPosts.count || 0,
      totalVisits: totalVisits.count || 0,
      uniqueIPs: uniqueIPs.count || 0,
      todayVisits: recentVisits.count || 0,
      topPages: topPages.results || [],
      weeklyVisits: todayVisits.results || []
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/visits" && method === "GET") {
    const visits = await env.DB.prepare(
      "SELECT * FROM visits ORDER BY visit_time DESC LIMIT 100"
    ).all();
    return new Response(JSON.stringify(visits.results || []), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/upload" && method === "POST") {
    const formData = await request.formData();
    const file = formData.get("image");
    if (!file) {
      return new Response(JSON.stringify({ error: "No image provided" }), { status: 400 });
    }
    const buffer = await file.arrayBuffer();
    const filename = formData.get("filename") || file.name;
    const ext = filename?.split(".").pop() || "jpg";
    const uniqueName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    await env.IMAGE_KV.put(uniqueName, buffer, {
      expirationTtl: 365 * 24 * 60 * 60
      // 1 year
    });
    const publicUrl = `/api/images/${uniqueName}`;
    return new Response(JSON.stringify({
      success: true,
      url: publicUrl,
      filename: uniqueName
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/images" && method === "GET") {
    const kvList = await env.IMAGE_KV.list();
    const postsWithImages = await env.DB.prepare("SELECT image_url FROM posts WHERE image_url IS NOT NULL").all();
    const aboutImageSetting = await env.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("about_image_url").first();
    const usedUrls = /* @__PURE__ */ new Set();
    postsWithImages.results.forEach((r) => {
      const urlStr = r.image_url;
      if (!urlStr) return;
      if (urlStr.startsWith("[")) {
        try {
          JSON.parse(urlStr).forEach((u) => usedUrls.add(u));
        } catch (e) {
          usedUrls.add(urlStr);
        }
      } else {
        usedUrls.add(urlStr);
      }
    });
    if (aboutImageSetting && aboutImageSetting.value) {
      usedUrls.add(aboutImageSetting.value);
    }
    const images = kvList.keys.map((k) => {
      const url = `/api/images/${k.name}`;
      return {
        name: k.name,
        url,
        used: usedUrls.has(url)
      };
    });
    return new Response(JSON.stringify(images), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname.startsWith("/api/images/") && method === "DELETE") {
    const imageName = pathname.split("/api/images/")[1];
    await env.IMAGE_KV.delete(imageName);
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/settings" && method === "GET") {
    const settings = await env.DB.prepare("SELECT * FROM settings").all();
    const result = {};
    if (settings.results) {
      settings.results.forEach((row) => {
        result[row.key] = row.value;
      });
    }
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/settings" && method === "POST") {
    const data = await request.json();
    for (const [key, value] of Object.entries(data)) {
      await env.DB.prepare(
        "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
      ).bind(key, String(value)).run();
    }
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response("API endpoint not found", { status: 404 });
}
__name(handleApi, "handleApi");
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
