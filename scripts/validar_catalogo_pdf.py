#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "arquivos" / "catalogo-light-metalurgica.pdf"

if not PDF.exists():
    raise SystemExit("PDF não encontrado: arquivos/catalogo-light-metalurgica.pdf")

conteudo = PDF.read_bytes()

if len(conteudo) < 1024:
    raise SystemExit("PDF inválido: arquivo muito pequeno")

if not conteudo.startswith(b"%PDF-"):
    raise SystemExit("PDF inválido: assinatura %PDF ausente")

if b"%%EOF" not in conteudo[-2048:]:
    raise SystemExit("PDF inválido: marcador %%EOF ausente no final do arquivo")

print(f"PDF válido: {PDF} ({len(conteudo)} bytes)")
