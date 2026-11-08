(() => {
  const KEY = "markdown-notes-v1";
  const $ = (id) => document.getElementById(id);
  const listEl = $("note-list"), editor = $("editor"), preview = $("preview");
  const titleEl = $("title"), searchEl = $("search");

  let notes = [];
  let activeId = null;

  function load() {
    try { notes = JSON.parse(localStorage.getItem(KEY)) || []; } catch { notes = []; }
    if (!notes.length) notes.push(makeNote("Welcome", "# Welcome\n\nWrite **Markdown** on the left, see it on the right.\n\n- Notes save automatically\n- Everything stays in your browser\n\n```js\nconsole.log('hello');\n```"));
    activeId = notes[0].id;
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(notes)); } catch { /* storage unavailable */ }
  }

  function makeNote(title = "", body = "") {
    return { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), title, body, updated: Date.now() };
  }

  const active = () => notes.find((n) => n.id === activeId);

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function inline(s) {
    return s
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  }

  // Minimal Markdown renderer. Input is escaped first, so it is safe to inject.
  function render(md) {
    const lines = escapeHtml(md).split("\n");
    const out = [];
    let inCode = false, listType = null, para = [];

    const flushPara = () => { if (para.length) { out.push("<p>" + inline(para.join(" ")) + "</p>"); para = []; } };
    const closeList = () => { if (listType) { out.push(`</${listType}>`); listType = null; } };

    for (const line of lines) {
      if (line.startsWith("```")) {
        flushPara(); closeList();
        out.push(inCode ? "</code></pre>" : "<pre><code>");
        inCode = !inCode;
        continue;
      }
      if (inCode) { out.push(line + "\n"); continue; }

      let m;
      if ((m = line.match(/^(#{1,6})\s+(.*)$/))) {
        flushPara(); closeList();
        out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`);
      } else if ((m = line.match(/^\s*[-*]\s+(.*)$/))) {
        flushPara();
        if (listType !== "ul") { closeList(); out.push("<ul>"); listType = "ul"; }
        out.push(`<li>${inline(m[1])}</li>`);
      } else if ((m = line.match(/^\s*\d+\.\s+(.*)$/))) {
        flushPara();
        if (listType !== "ol") { closeList(); out.push("<ol>"); listType = "ol"; }
        out.push(`<li>${inline(m[1])}</li>`);
      } else if ((m = line.match(/^&gt;\s?(.*)$/))) {
        flushPara(); closeList();
        out.push(`<blockquote>${inline(m[1])}</blockquote>`);
      } else if (/^\s*$/.test(line)) {
        flushPara(); closeList();
      } else {
        closeList(); para.push(line.trim());
      }
    }
    flushPara(); closeList();
    if (inCode) out.push("</code></pre>");
    return out.join("\n");
  }

  function renderList() {
    const q = searchEl.value.trim().toLowerCase();
    listEl.innerHTML = "";
    notes
      .filter((n) => !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q))
      .sort((a, b) => b.updated - a.updated)
      .forEach((n) => {
        const li = document.createElement("li");
        if (n.id === activeId) li.className = "active";
        const t = document.createElement("strong");
        t.textContent = n.title || "Untitled note";
        const d = document.createElement("small");
        d.textContent = new Date(n.updated).toLocaleString();
        li.append(t, d);
        li.onclick = () => { activeId = n.id; show(); };
        listEl.appendChild(li);
      });
  }

  function show() {
    const n = active();
    titleEl.value = n ? n.title : "";
    editor.value = n ? n.body : "";
    preview.innerHTML = n ? render(n.body) : "";
    renderList();
  }

  function touch() {
    const n = active();
    if (!n) return;
    n.title = titleEl.value;
    n.body = editor.value;
    n.updated = Date.now();
    preview.innerHTML = render(n.body);
    save();
    renderList();
  }

  $("new-note").onclick = () => { const n = makeNote(); notes.push(n); activeId = n.id; save(); show(); titleEl.focus(); };
  $("delete-note").onclick = () => {
    const n = active();
    if (!n || !confirm(`Delete "${n.title || "Untitled note"}"?`)) return;
    notes = notes.filter((x) => x.id !== n.id);
    if (!notes.length) notes.push(makeNote());
    activeId = notes[0].id;
    save(); show();
  };
  editor.addEventListener("input", touch);
  titleEl.addEventListener("input", touch);
  searchEl.addEventListener("input", renderList);

  load();
  show();
})();
