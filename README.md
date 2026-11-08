<div align="center">

<img src="assets/banner.svg" alt="markdown-notes-web - a tiny Markdown notes app" width="100%"/>

<br/>

![HTML](https://img.shields.io/badge/HTML5-e34f26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572b6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)
![Dependencies](https://img.shields.io/badge/dependencies-none-28c840?style=for-the-badge)

</div>

A tiny Markdown notes app that runs entirely in the browser. No build step, no dependencies.

## ✨ Features

| | Feature | Description |
|---|---|---|
| 📝 | **Live preview** | Headings, bold/italic, lists, quotes, code blocks and links |
| 🗂️ | **Multiple notes** | Keep as many notes as you like, with search |
| 💾 | **Auto-save** | Saved to your browser's localStorage as you type |
| 🌗 | **Light & dark mode** | Follows your system theme |
| 📱 | **Responsive** | Works on desktop and mobile |

<div align="center">

<img src="assets/saved.svg" alt="Auto-saved locally" width="60%"/>

</div>

## 🚀 Run it

Just open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## 📁 Project structure

```text
.
├── index.html   # markup
├── style.css    # styles (light + dark)
├── app.js       # notes logic + Markdown rendering
└── assets/      # README graphics
```

## 🔒 Privacy

Your notes never leave your device.
