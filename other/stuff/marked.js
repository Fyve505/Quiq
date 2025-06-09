(function () {
  const editorId = 'gfm-editor';

  // Load marked and CSS
  const markedScript = document.createElement('script');
  markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
  markedScript.onload = initEditor;
  document.head.appendChild(markedScript);

  const ghCss = document.createElement('link');
  ghCss.rel = 'stylesheet';
  ghCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css';
  document.head.appendChild(ghCss);

  const styles = `
    #${editorId} {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: #f2f3f5;
      border: 1px solid #ccc;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    #${editorId} header {
      background: #1d1f21;
      color: white;
      padding: 12px 20px;
      font-weight: bold;
    }

    #${editorId} .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 10px;
      background: #fff;
      border-bottom: 1px solid #ddd;
    }

    #${editorId} .toolbar button {
      padding: 6px 10px;
      font-size: 13px;
      border: 1px solid #ccc;
      background: #e3e5e8;
      cursor: pointer;
      border-radius: 6px;
    }

    #${editorId} .editor-body {
      display: flex;
      height: 400px;
    }

    #${editorId} textarea {
      width: 50%;
      padding: 12px;
      border: none;
      resize: none;
      font-size: 14px;
      line-height: 1.5;
      font-family: monospace;
      background: #fff;
      outline: none;
    }

    #${editorId} .preview {
      width: 50%;
      padding: 16px;
      background: #fafafa;
      overflow-y: auto;
    }

    #${editorId} .hidden {
      display: none !important;
    }
  `;

  function injectStyles(cssText) {
    const style = document.createElement('style');
    style.textContent = cssText;
    document.head.appendChild(style);
  }

  function initEditor() {
    const container = document.getElementById(editorId);
    if (!container) {
      console.error(`[GFM Editor] Element with id="${editorId}" not found.`);
      return;
    }

    injectStyles(styles);

    container.innerHTML = `
      <header>GFM Markdown Editor</header>
      <div class="toolbar">
        <button onclick="gfmInsert('# Heading')">H1</button>
        <button onclick="gfmInsert('## Heading 2')">H2</button>
        <button onclick="gfmInsert('### Heading 3')">H3</button>
        <button onclick="gfmInsert('**bold**')">Bold</button>
        <button onclick="gfmInsert('_italic_')">Italic</button>
        <button onclick="gfmInsert('> Quote')">Quote</button>
        <button onclick="gfmInsert('- List item')">List</button>
        <button onclick="gfmInsert('- [ ] Task')">Task</button>
        <button onclick="gfmInsert('\\\`\\\`\\\`js\\nconsole.log(\\\"Hello\\\");\\n\\\`\\\`\\\`')">Code</button>
        <button onclick="gfmInsert('| A | B |\\n|---|---|\\n| 1 | 2 |')">Table</button>
        <button onclick="gfmInsert('<details>\\n<summary>Spoiler</summary>\\n\\nHidden content\\n\\n</details>')">Spoiler</button>
        <button onclick="gfmInsert('---')">HR</button>
        <button onclick="gfmTogglePreview()">Toggle Preview</button>
      </div>
      <div class="editor-body">
        <textarea id="gfm-text" placeholder="Write markdown here...">
# Hello World

Use **bold**, _italic_, and more...

<details>
<summary>Click to expand</summary>

Spoiler content

</details>
        </textarea>
        <div id="gfm-preview" class="preview markdown-body hidden"></div>
      </div>
    `;

    window.gfmInsert = function (text) {
      const input = document.getElementById('gfm-text');
      const start = input.selectionStart;
      const end = input.selectionEnd;
      input.value = input.value.substring(0, start) + text + '\n' + input.value.substring(end);
      input.focus();
      input.selectionStart = input.selectionEnd = start + text.length + 1;
      renderMarkdown();
    };

    window.gfmTogglePreview = function () {
      const input = document.getElementById('gfm-text');
      const preview = document.getElementById('gfm-preview');
      const isPreviewing = !preview.classList.contains('hidden');

      if (isPreviewing) {
        preview.classList.add('hidden');
        input.classList.remove('hidden');
      } else {
        renderMarkdown();
        preview.classList.remove('hidden');
        input.classList.add('hidden');
      }
    };

    function renderMarkdown() {
      const raw = document.getElementById('gfm-text').value;
      document.getElementById('gfm-preview').innerHTML = marked.parse(raw);
    }

    document.getElementById('gfm-text').addEventListener('input', renderMarkdown);
    renderMarkdown();
  }
})();
