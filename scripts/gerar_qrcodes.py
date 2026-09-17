#!/usr/bin/env python3
from __future__ import annotations

import json
import os
from pathlib import Path
from urllib.parse import urljoin

import qrcode
from qrcode.constants import ERROR_CORRECT_Q
from qrcode.image.svg import SvgPathImage

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "produtos.json"
CONFIG_PATH = ROOT / "config" / "qrcodes.json"


def carregar_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def normalizar_base(url: str | None) -> str | None:
    if not url:
        return None
    return url.rstrip("/") + "/"


def slug_arquivo(texto: str) -> str:
    permitido = "abcdefghijklmnopqrstuvwxyz0123456789-"
    texto = texto.lower().strip().replace(" ", "-")
    texto = "".join(c for c in texto if c in permitido)
    while "--" in texto:
        texto = texto.replace("--", "-")
    return texto.strip("-") or "equipamento"


def gerar_qr_svg(url: str, destino: Path) -> None:
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_Q,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    image = qr.make_image(image_factory=SvgPathImage)
    destino.parent.mkdir(parents=True, exist_ok=True)
    image.save(str(destino))


def main() -> None:
    catalogo = carregar_json(DATA_PATH)
    config = carregar_json(CONFIG_PATH)

    site_url = normalizar_base(
        os.getenv("CATALOGO_SITE_URL") or config.get("siteUrl")
    )
    catalogo_url = (
        os.getenv("CATALOGO_URL")
        or config.get("catalogoUrl")
        or (urljoin(site_url, "catalogo.html") if site_url else None)
    )

    if not site_url:
        raise SystemExit(
            "CATALOGO_SITE_URL não configurada. Defina a URL pública antes de gerar QR Codes."
        )

    if not catalogo_url:
        raise SystemExit(
            "CATALOGO_URL não configurada. Defina a URL pública de catalogo.html."
        )

    output_dir = ROOT / config.get("diretorioSaida", "arquivos/qrcodes")
    output_dir.mkdir(parents=True, exist_ok=True)

    gerar_qr_svg(site_url, output_dir / "site.svg")
    gerar_qr_svg(catalogo_url, output_dir / "catalogo.svg")

    incluir_inativos = config.get("incluirProdutosInativos") is True
    produtos = [
        produto
        for produto in catalogo.get("produtos", [])
        if incluir_inativos or produto.get("ativoNoSite") is True
    ]

    manifest = {
        "site": site_url,
        "catalogo": catalogo_url,
        "produtos": [],
    }

    for produto in produtos:
        id_produto = produto.get("id")
        if not isinstance(id_produto, int):
            continue

        nome = str(produto.get("nome") or f"produto-{id_produto}")
        destino_url = urljoin(site_url, f"produto.html?id={id_produto}")
        arquivo = f"produto-{id_produto:03d}-{slug_arquivo(nome)}.svg"

        gerar_qr_svg(destino_url, output_dir / arquivo)
        manifest["produtos"].append(
            {
                "id": id_produto,
                "nome": nome,
                "url": destino_url,
                "arquivo": arquivo,
            }
        )

    (output_dir / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"QR Codes gerados em: {output_dir}")
    print(f"Produtos incluídos: {len(manifest['produtos'])}")


if __name__ == "__main__":
    main()
