"""Ensambla las páginas internas: tools/head.html + tools/pages/*.html + tools/foot.html -> raíz.
Uso: python tools/build.py   (index.html se edita directamente)
"""
import pathlib
import re

root = pathlib.Path(__file__).resolve().parent.parent
head = (root / "tools/head.html").read_text(encoding="utf-8")
foot = (root / "tools/foot.html").read_text(encoding="utf-8")
for f in sorted((root / "tools/pages").glob("*.html")):
    src = f.read_text(encoding="utf-8")
    meta = dict(re.findall(r"<!--(\w+)=(.*?)-->", src))
    body = re.sub(r"<!--\w+=.*?-->\n?", "", src)
    h = head.replace("{{TITLE}}", meta["TITLE"]).replace("{{DESC}}", meta["DESC"]).replace("{{PAGE}}", meta["PAGE"])
    (root / f.name).write_text(h + "\n" + body + "\n" + foot, encoding="utf-8", newline="\n")
    print("built", f.name)
