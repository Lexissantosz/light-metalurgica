from __future__ import annotations

import json
import os
from pathlib import Path
from urllib.parse import quote
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "produtos.json"


def normalizar_base(url: str) -> str:
    return url.strip().rstrip("/")


def url(base: str, caminho: str) -> str:
    return f"{base}/{caminho.lstrip('/')}"


def carregar_produtos_publicos() -> list[dict]:
    dados = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    produtos = dados.get("produtos", [])
    return [p for p in produtos if p.get("ativoNoSite") is True]


def gerar_sitemap(base: str) -> str:
    paginas = [
        url(base, ""),
        url(base, "produtos.html"),
        url(base, "catalogo.html"),
        url(base, "sobre.html"),
        url(base, "contato.html"),
    ]

    for produto in carregar_produtos_publicos():
        produto_id = produto.get("id")
        if produto_id:
            paginas.append(url(base, f"produto.html?id={quote(str(produto_id))}"))

    urls = "\n".join(
        f"  <url><loc>{escape(item)}</loc></url>" for item in paginas
    )

    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{urls}\n"
        "</urlset>\n"
    )


def gerar_robots(base: str) -> str:
    return (
        "User-agent: *\n"
        "Allow: /\n\n"
        f"Sitemap: {url(base, 'sitemap.xml')}\n"
    )


def main() -> None:
    base = normalizar_base(os.getenv("SITE_URL", ""))
    if not base.startswith(("https://", "http://")):
        raise SystemExit(
            "SITE_URL precisa ser uma URL pública absoluta, por exemplo https://exemplo.com"
        )

    (ROOT / "sitemap.xml").write_text(gerar_sitemap(base), encoding="utf-8")
    (ROOT / "robots.txt").write_text(gerar_robots(base), encoding="utf-8")

    print(f"SEO de publicação gerado para {base}")


if __name__ == "__main__":
    main()
