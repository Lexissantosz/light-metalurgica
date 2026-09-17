#!/usr/bin/env python3
from __future__ import annotations

import json
import os
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin

from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.platypus import (
    Flowable,
    HRFlowable,
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "produtos.json"
CONFIG_PATH = ROOT / "config" / "catalogo.json"


def carregar_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def url_base(valor: str | None) -> str | None:
    if not valor:
        return None
    return valor.rstrip("/") + "/"


def data_ptbr(valor: str | None) -> str:
    if not valor:
        return datetime.now().strftime("%d/%m/%Y")
    try:
        return datetime.fromisoformat(valor).strftime("%d/%m/%Y")
    except ValueError:
        return valor


def preco_ptbr(valor: object) -> str | None:
    if not isinstance(valor, (int, float)):
        return None
    texto = f"{valor:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return f"R$ {texto}"


def caminho_local(valor: str | None) -> Path | None:
    if not valor:
        return None
    return ROOT / valor.removeprefix("./")


def qr_drawing(url: str, tamanho: float = 26 * mm) -> Drawing:
    qr = QrCodeWidget(url)
    x1, y1, x2, y2 = qr.getBounds()
    largura = x2 - x1
    altura = y2 - y1
    drawing = Drawing(
        tamanho,
        tamanho,
        transform=[tamanho / largura, 0, 0, tamanho / altura, 0, 0],
    )
    drawing.add(qr)
    return drawing


class PlaceholderImagem(Flowable):
    def __init__(self, width: float, height: float, texto: str = "Imagem em preparação"):
        super().__init__()
        self.width = width
        self.height = height
        self.texto = texto

    def draw(self):
        canvas = self.canv
        canvas.saveState()
        canvas.setFillColor(HexColor("#111318"))
        canvas.setStrokeColor(HexColor("#2A2D33"))
        canvas.roundRect(0, 0, self.width, self.height, 5, fill=1, stroke=1)
        canvas.setFillColor(HexColor("#8D9198"))
        canvas.setFont("Helvetica", 8)
        canvas.drawCentredString(self.width / 2, self.height / 2, self.texto)
        canvas.restoreState()


def imagem_produto(produto: dict, width: float, height: float) -> Flowable:
    path = caminho_local(produto.get("imagem"))
    if not path or not path.exists():
        return PlaceholderImagem(width, height)

    try:
        reader = ImageReader(str(path))
        img_w, img_h = reader.getSize()
        ratio = min(width / img_w, height / img_h)
        image = Image(str(path), width=img_w * ratio, height=img_h * ratio)
        image.hAlign = "CENTER"
        return image
    except Exception:
        return PlaceholderImagem(width, height, "Imagem indisponível")


def estilos(cor_primaria: HexColor, cor_fundo: HexColor) -> dict:
    base = getSampleStyleSheet()
    return {
        "cover_badge": ParagraphStyle(
            "cover_badge", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=9, leading=11, textColor=cor_primaria, spaceAfter=10,
        ),
        "cover_title": ParagraphStyle(
            "cover_title", parent=base["Title"], fontName="Helvetica-Bold",
            fontSize=30, leading=32, textColor=colors.white, spaceAfter=12,
        ),
        "cover_subtitle": ParagraphStyle(
            "cover_subtitle", parent=base["Normal"], fontName="Helvetica",
            fontSize=11, leading=16, textColor=HexColor("#B9BDC4"), spaceAfter=18,
        ),
        "section_title": ParagraphStyle(
            "section_title", parent=base["Heading1"], fontName="Helvetica-Bold",
            fontSize=22, leading=24, textColor=cor_fundo, spaceAfter=8,
        ),
        "section_text": ParagraphStyle(
            "section_text", parent=base["BodyText"], fontName="Helvetica",
            fontSize=9, leading=13, textColor=HexColor("#535861"),
        ),
        "category": ParagraphStyle(
            "category", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=8, leading=10, textColor=cor_primaria, spaceAfter=5,
        ),
        "product_title": ParagraphStyle(
            "product_title", parent=base["Heading2"], fontName="Helvetica-Bold",
            fontSize=16, leading=18, textColor=cor_fundo, spaceAfter=7,
        ),
        "body": ParagraphStyle(
            "body", parent=base["BodyText"], fontName="Helvetica",
            fontSize=8.5, leading=12, textColor=HexColor("#555A61"), spaceAfter=8,
        ),
        "meta": ParagraphStyle(
            "meta", parent=base["BodyText"], fontName="Helvetica",
            fontSize=7.5, leading=10, textColor=HexColor("#6D7279"),
        ),
        "index": ParagraphStyle(
            "index", parent=base["BodyText"], fontName="Helvetica-Bold",
            fontSize=10, leading=13, textColor=cor_fundo,
        ),
        "index_count": ParagraphStyle(
            "index_count", parent=base["BodyText"], fontName="Helvetica-Bold",
            fontSize=10, leading=13, textColor=cor_primaria,
        ),
        "small": ParagraphStyle(
            "small", parent=base["BodyText"], fontName="Helvetica",
            fontSize=6.8, leading=9, textColor=HexColor("#6D7279"),
        ),
    }


def url_produto(produto: dict, site_url: str | None) -> str | None:
    base = url_base(site_url)
    if not base:
        return None
    return urljoin(base, f"produto.html?id={produto['id']}")


def bloco_produto(produto: dict, st: dict, config: dict) -> Table:
    largura_total = A4[0] - 32 * mm
    largura_imagem = 67 * mm
    altura_imagem = 52 * mm
    largura_texto = largura_total - largura_imagem - 10 * mm

    imagem = imagem_produto(produto, largura_imagem, altura_imagem)
    itens = [
        Paragraph(str(produto.get("categoria") or "Categoria"), st["category"]),
        Paragraph(str(produto.get("nome") or "Equipamento"), st["product_title"]),
        Paragraph(str(produto.get("descricaoCurta") or "Informações sob consulta."), st["body"]),
    ]

    meta = []
    if produto.get("codigo") and produto.get("codigoValidado") is True:
        meta.append(f"Código: {produto['codigo']}")

    preco = preco_ptbr(produto.get("precoPublico")) if produto.get("exibirPreco") is True else None
    meta.append(f"Valor: {preco}" if preco else "Orçamento: sob consulta")
    meta.append("Informações técnicas: sob consulta")
    itens.append(Paragraph("<br/>".join(meta), st["meta"]))

    site_url = os.getenv("CATALOGO_SITE_URL") or config.get("siteBaseUrl")
    link_produto = url_produto(produto, site_url)
    if link_produto:
        qr = qr_drawing(link_produto, 20 * mm)
        qr_table = Table(
            [[qr, Paragraph("Acesse este equipamento no catálogo online.", st["small"]) ]],
            colWidths=[22 * mm, largura_texto - 22 * mm],
        )
        qr_table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]))
        itens.append(qr_table)

    right = Table([[item] for item in itens], colWidths=[largura_texto])
    right.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))

    tabela = Table([[imagem, right]], colWidths=[largura_imagem, largura_texto], rowHeights=[58 * mm])
    tabela.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.5, HexColor("#D9DCE1")),
        ("LEFTPADDING", (0, 0), (0, 0), 4 * mm),
        ("RIGHTPADDING", (0, 0), (0, 0), 4 * mm),
        ("TOPPADDING", (0, 0), (0, 0), 3 * mm),
        ("BOTTOMPADDING", (0, 0), (0, 0), 3 * mm),
        ("LEFTPADDING", (1, 0), (1, 0), 5 * mm),
        ("RIGHTPADDING", (1, 0), (1, 0), 5 * mm),
        ("TOPPADDING", (1, 0), (1, 0), 4 * mm),
        ("BOTTOMPADDING", (1, 0), (1, 0), 4 * mm),
    ]))
    return tabela


def cabecalho_rodape(canvas, doc, empresa: str, cor_primaria: HexColor):
    if doc.page <= 1:
        return

    width, height = A4
    canvas.saveState()
    canvas.setStrokeColor(HexColor("#E0E2E5"))
    canvas.setLineWidth(0.4)
    canvas.line(16 * mm, height - 13 * mm, width - 16 * mm, height - 13 * mm)
    canvas.setFillColor(HexColor("#696E75"))
    canvas.setFont("Helvetica", 7)
    canvas.drawString(16 * mm, height - 10 * mm, empresa)
    canvas.setFillColor(cor_primaria)
    canvas.setFont("Helvetica-Bold", 7)
    canvas.drawRightString(width - 16 * mm, 10 * mm, f"{doc.page:02d}")
    canvas.restoreState()


def gerar_catalogo() -> Path:
    catalogo = carregar_json(DATA_PATH)
    config = carregar_json(CONFIG_PATH)
    produtos = [p for p in catalogo.get("produtos", []) if p.get("ativoNoSite") is True]
    produtos.sort(key=lambda p: (str(p.get("categoria", "")), str(p.get("nome", ""))))

    output = ROOT / (config.get("arquivoPdf") or "arquivos/catalogo-light-metalurgica.pdf")
    output.parent.mkdir(parents=True, exist_ok=True)

    cor_primaria = HexColor(config.get("corPrimaria") or "#FF6A00")
    cor_fundo = HexColor(config.get("corFundo") or "#0B0D10")
    empresa = config.get("empresa") or "Light Metalúrgica"
    st = estilos(cor_primaria, cor_fundo)

    doc = SimpleDocTemplate(
        str(output), pagesize=A4,
        rightMargin=16 * mm, leftMargin=16 * mm,
        topMargin=18 * mm, bottomMargin=16 * mm,
        title=f"Catálogo Digital - {empresa}",
        author=empresa,
        subject="Catálogo de equipamentos",
    )

    story = []

    capa = Table([
        [Paragraph("CATÁLOGO DIGITAL", st["cover_badge"])],
        [Paragraph(empresa, st["cover_title"])],
        [Paragraph(
            config.get("subtitulo") or "Equipamentos de musculação para academias e espaços fitness",
            st["cover_subtitle"],
        )],
    ], colWidths=[A4[0] - 32 * mm], rowHeights=[18 * mm, 40 * mm, 26 * mm])
    capa.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), cor_fundo),
        ("LEFTPADDING", (0, 0), (-1, -1), 12 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12 * mm),
        ("TOPPADDING", (0, 0), (-1, -1), 5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5 * mm),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.extend([Spacer(1, 24 * mm), capa, Spacer(1, 18 * mm)])

    resumo = Table([
        [Paragraph("Equipamentos publicados", st["meta"]), Paragraph(str(len(produtos)), st["index_count"])],
        [Paragraph("Atualização", st["meta"]), Paragraph(data_ptbr(catalogo.get("atualizadoEm")), st["index_count"])],
        [Paragraph("Versão de dados", st["meta"]), Paragraph(str(catalogo.get("versao", 1)), st["index_count"])],
    ], colWidths=[55 * mm, 30 * mm])
    resumo.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, HexColor("#D9DCE1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, HexColor("#E7E9EC")),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
    ]))

    catalogo_url = os.getenv("CATALOGO_URL") or config.get("catalogoUrl")
    if catalogo_url:
        cover_info = Table([[resumo, qr_drawing(catalogo_url, 30 * mm)]], colWidths=[100 * mm, 36 * mm])
        cover_info.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ]))
        story.append(cover_info)
    else:
        story.append(resumo)

    contatos = []
    for rotulo, chave, env in [
        ("WhatsApp", "whatsapp", "CATALOGO_WHATSAPP"),
        ("Instagram", "instagram", "CATALOGO_INSTAGRAM"),
        ("E-mail", "email", "CATALOGO_EMAIL"),
    ]:
        valor = os.getenv(env) or config.get(chave)
        if valor:
            contatos.append(f"{rotulo}: {valor}")
    if config.get("localizacao"):
        contatos.append(f"Localização: {config['localizacao']}")
    if contatos:
        story.extend([Spacer(1, 12 * mm), Paragraph("<br/>".join(contatos), st["meta"])])

    story.append(PageBreak())
    story.append(Paragraph("Índice por categoria", st["section_title"]))
    story.append(Paragraph(
        "Os itens abaixo vêm da mesma base de dados usada pelo site. Informações técnicas não confirmadas permanecem sob consulta.",
        st["section_text"],
    ))
    story.append(Spacer(1, 7 * mm))

    categorias = {}
    for produto in produtos:
        categoria = produto.get("categoria") or "Outros"
        categorias[categoria] = categorias.get(categoria, 0) + 1

    linhas = [[Paragraph(cat, st["index"]), Paragraph(str(total), st["index_count"])] for cat, total in sorted(categorias.items())]
    if linhas:
        tabela_indice = Table(linhas, colWidths=[130 * mm, 30 * mm])
        tabela_indice.setStyle(TableStyle([
            ("LINEBELOW", (0, 0), (-1, -1), 0.4, HexColor("#E0E2E5")),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
        ]))
        story.append(tabela_indice)
    else:
        story.append(Paragraph("Nenhum equipamento publicado.", st["section_text"]))

    story.append(PageBreak())

    categoria_atual = None
    for produto in produtos:
        categoria = produto.get("categoria") or "Outros"
        bloco = bloco_produto(produto, st, config)
        bloco_com_espaco = [bloco, Spacer(1, 6 * mm)]

        if categoria != categoria_atual:
            story.append(KeepTogether([
                Paragraph(categoria, st["section_title"]),
                HRFlowable(width="100%", thickness=1.2, color=cor_primaria, spaceAfter=6 * mm),
                *bloco_com_espaco,
            ]))
            categoria_atual = categoria
        else:
            story.append(KeepTogether(bloco_com_espaco))

    if not produtos:
        story.append(Paragraph("Nenhum equipamento público disponível.", st["section_text"]))

    doc.build(
        story,
        onFirstPage=lambda c, d: cabecalho_rodape(c, d, empresa, cor_primaria),
        onLaterPages=lambda c, d: cabecalho_rodape(c, d, empresa, cor_primaria),
    )

    if not output.exists() or output.stat().st_size < 1024:
        raise RuntimeError("O PDF foi gerado com tamanho inválido.")

    print(f"Catálogo gerado: {output}")
    print(f"Produtos incluídos: {len(produtos)}")
    return output


if __name__ == "__main__":
    gerar_catalogo()
