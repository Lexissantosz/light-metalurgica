#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image as PilImage

import gerar_catalogo_pdf as gerador

ROOT = Path(__file__).resolve().parents[1]
ORIGINAL_DATA = ROOT / "data" / "produtos.json"
BUILD_DIR = ROOT / ".catalogo-build"
IMAGES_DIR = BUILD_DIR / "imagens"
OPTIMIZED_DATA = BUILD_DIR / "produtos-otimizado.json"

MAX_WIDTH = 1400
MAX_HEIGHT = 1100
JPEG_QUALITY = 82


def otimizar_imagem(origem: Path, destino: Path) -> bool:
    try:
        with PilImage.open(origem) as imagem:
            imagem.load()
            imagem.thumbnail((MAX_WIDTH, MAX_HEIGHT), PilImage.Resampling.LANCZOS)

            if imagem.mode in ("RGBA", "LA"):
                fundo = PilImage.new("RGB", imagem.size, (255, 255, 255))
                alpha = imagem.getchannel("A")
                fundo.paste(imagem.convert("RGB"), mask=alpha)
                imagem = fundo
            elif imagem.mode != "RGB":
                imagem = imagem.convert("RGB")

            destino.parent.mkdir(parents=True, exist_ok=True)
            imagem.save(
                destino,
                format="JPEG",
                quality=JPEG_QUALITY,
                optimize=True,
                progressive=True,
                subsampling="4:2:0",
            )
            return True
    except Exception as exc:
        print(f"Aviso: não foi possível otimizar {origem}: {exc}")
        return False


def preparar_dados() -> Path:
    catalogo = json.loads(ORIGINAL_DATA.read_text(encoding="utf-8"))
    produtos = catalogo.get("produtos", [])

    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    otimizadas = 0
    bytes_originais = 0
    bytes_otimizados = 0

    for produto in produtos:
        if produto.get("ativoNoSite") is not True:
            continue

        valor = produto.get("imagem")
        if not valor:
            continue

        origem = ROOT / str(valor).removeprefix("./")
        if not origem.exists():
            continue

        destino = IMAGES_DIR / f"produto-{produto.get('id', 'sem-id')}.jpg"
        bytes_originais += origem.stat().st_size

        if otimizar_imagem(origem, destino):
            produto["imagem"] = str(destino.relative_to(ROOT)).replace("\\", "/")
            otimizadas += 1
            bytes_otimizados += destino.stat().st_size

    BUILD_DIR.mkdir(parents=True, exist_ok=True)
    OPTIMIZED_DATA.write_text(
        json.dumps(catalogo, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    if bytes_originais:
        reducao = 100 - (bytes_otimizados / bytes_originais * 100)
        print(
            f"Imagens otimizadas: {otimizadas} | "
            f"{bytes_originais / 1024 / 1024:.1f} MB -> "
            f"{bytes_otimizados / 1024 / 1024:.1f} MB "
            f"({reducao:.1f}% de redução)"
        )

    return OPTIMIZED_DATA


def main() -> None:
    dados_otimizados = preparar_dados()
    gerador.DATA_PATH = dados_otimizados
    output = gerador.gerar_catalogo()
    print(f"PDF otimizado: {output.stat().st_size / 1024 / 1024:.1f} MB")


if __name__ == "__main__":
    main()
