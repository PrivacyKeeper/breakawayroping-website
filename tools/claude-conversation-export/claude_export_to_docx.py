#!/usr/bin/env python3
"""
claude_export_to_docx.py - turn a Claude data export into one Word document
per conversation.

Requires nothing but Python 3.8+. No pip install, no network access; your
conversations never leave the machine you run this on.

Usage
-----
    python3 claude_export_to_docx.py data-export.zip
    python3 claude_export_to_docx.py conversations.json -o ~/ClaudeArchive

See README.md for how to obtain the export file.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import glob
import json
import os
import re
import sys
import unicodedata
import zipfile
from typing import Any

# --------------------------------------------------------------------------
# Appearance
# --------------------------------------------------------------------------

BODY_FONT = "Calibri"
CODE_FONT = "Consolas"
HUMAN_COLOR = "1F4E79"      # deep blue
ASSISTANT_COLOR = "8A4B08"  # burnt orange
META_COLOR = "6E6E6E"
RULE_COLOR = "D9D9D9"
CODE_FILL = "F4F4F4"

ROLE_LABELS = {
    "human": "You",
    "user": "You",
    "assistant": "Claude",
}

# --------------------------------------------------------------------------
# XML helpers
# --------------------------------------------------------------------------

# Codepoints XML 1.0 cannot carry. Word rejects the entire file if one slips
# through, so they are dropped rather than escaped.
ILLEGAL_XML_RE = re.compile(
    "[^" + "\\x09\\x0a\\x0d\\x20-\\ud7ff\\ue000-\\ufffd\\U00010000-\\U0010ffff" + "]"
)


def esc(text: str) -> str:
    """Escape text for XML character data, dropping codepoints XML forbids."""
    text = ILLEGAL_XML_RE.sub("", text)
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


class Rels:
    """Collects external hyperlink relationships for one document."""

    def __init__(self) -> None:
        self._by_target: dict[str, str] = {}
        self._order: list[tuple[str, str]] = []

    def link(self, url: str) -> str:
        if url not in self._by_target:
            rid = "rId%d" % (len(self._order) + 100)
            self._by_target[url] = rid
            self._order.append((rid, url))
        return self._by_target[url]

    def xml(self) -> str:
        parts = [
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
            '<Relationship Id="rId1" '
            'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" '
            'Target="styles.xml"/>',
        ]
        for rid, url in self._order:
            parts.append(
                '<Relationship Id="%s" '
                'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" '
                'Target="%s" TargetMode="External"/>' % (rid, esc(url))
            )
        parts.append("</Relationships>")
        return "".join(parts)


def run(
    text: str,
    *,
    bold: bool = False,
    italic: bool = False,
    strike: bool = False,
    mono: bool = False,
    size: int | None = None,
    color: str | None = None,
    caps: bool = False,
    underline: bool = False,
) -> str:
    """One <w:r> run. `size` is in half-points (22 == 11pt)."""
    props: list[str] = []
    if mono:
        props.append(
            '<w:rFonts w:ascii="%s" w:hAnsi="%s" w:cs="%s"/>'
            % (CODE_FONT, CODE_FONT, CODE_FONT)
        )
    if bold:
        props.append("<w:b/>")
    if italic:
        props.append("<w:i/>")
    if strike:
        props.append("<w:strike/>")
    if caps:
        props.append("<w:smallCaps/>")
    if underline:
        props.append('<w:u w:val="single"/>')
    if color:
        props.append('<w:color w:val="%s"/>' % color)
    if size:
        props.append('<w:sz w:val="%d"/><w:szCs w:val="%d"/>' % (size, size))
    rpr = "<w:rPr>%s</w:rPr>" % "".join(props) if props else ""

    # Word needs line breaks and tabs as elements, not as characters.
    body: list[str] = []
    for i, chunk in enumerate(text.split("\n")):
        if i:
            body.append("<w:br/>")
        for j, cell in enumerate(chunk.split("\t")):
            if j:
                body.append("<w:tab/>")
            if cell:
                body.append('<w:t xml:space="preserve">%s</w:t>' % esc(cell))
    return "<w:r>%s%s</w:r>" % (rpr, "".join(body))


def para(
    runs: str,
    *,
    style: str | None = None,
    indent: int = 0,
    hanging: int = 0,
    space_before: int = 0,
    space_after: int = 120,
    shade: str | None = None,
    rule_below: bool = False,
    left_bar: bool = False,
    keep_next: bool = False,
    align: str | None = None,
) -> str:
    """One <w:p>. Indents and spacing are in twips (1440 per inch)."""
    props: list[str] = []
    if style:
        props.append('<w:pStyle w:val="%s"/>' % style)
    if keep_next:
        props.append("<w:keepNext/><w:keepLines/>")
    if shade:
        props.append('<w:shd w:val="clear" w:color="auto" w:fill="%s"/>' % shade)
    borders: list[str] = []
    if left_bar:
        borders.append(
            '<w:left w:val="single" w:sz="18" w:space="8" w:color="%s"/>' % RULE_COLOR
        )
    if rule_below:
        borders.append(
            '<w:bottom w:val="single" w:sz="6" w:space="6" w:color="%s"/>' % RULE_COLOR
        )
    if borders:
        props.append("<w:pBdr>%s</w:pBdr>" % "".join(borders))
    if indent or hanging:
        props.append(
            '<w:ind w:left="%d"%s/>'
            % (indent, ' w:hanging="%d"' % hanging if hanging else "")
        )
    props.append('<w:spacing w:before="%d" w:after="%d"/>' % (space_before, space_after))
    if align:
        props.append('<w:jc w:val="%s"/>' % align)
    ppr = "<w:pPr>%s</w:pPr>" % "".join(props)
    return "<w:p>%s%s</w:p>" % (ppr, runs)


STYLES_XML = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr>
<w:rFonts w:ascii="{body}" w:hAnsi="{body}" w:eastAsia="{body}" w:cs="{body}"/>
<w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="en-US"/>
</w:rPr></w:rPrDefault>
<w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault>
</w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal">
<w:name w:val="Normal"/><w:qFormat/></w:style>
<w:style w:type="paragraph" w:styleId="Title">
<w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:qFormat/>
<w:pPr><w:spacing w:before="0" w:after="80"/></w:pPr>
<w:rPr><w:b/><w:sz w:val="44"/><w:szCs w:val="44"/><w:color w:val="1A1A1A"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1">
<w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:qFormat/>
<w:pPr><w:keepNext/><w:outlineLvl w:val="0"/><w:spacing w:before="280" w:after="120"/></w:pPr>
<w:rPr><w:b/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2">
<w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:qFormat/>
<w:pPr><w:keepNext/><w:outlineLvl w:val="1"/><w:spacing w:before="240" w:after="100"/></w:pPr>
<w:rPr><w:b/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading3">
<w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:qFormat/>
<w:pPr><w:keepNext/><w:outlineLvl w:val="2"/><w:spacing w:before="200" w:after="80"/></w:pPr>
<w:rPr><w:b/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading4">
<w:name w:val="heading 4"/><w:basedOn w:val="Normal"/><w:qFormat/>
<w:pPr><w:keepNext/><w:outlineLvl w:val="3"/><w:spacing w:before="180" w:after="80"/></w:pPr>
<w:rPr><w:b/><w:i/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr></w:style>
<w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/>
<w:tblPr><w:tblBorders>
<w:top w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>
<w:left w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>
<w:bottom w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>
<w:right w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>
<w:insideH w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>
<w:insideV w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>
</w:tblBorders></w:tblPr></w:style>
</w:styles>""".format(body=BODY_FONT)

CONTENT_TYPES_XML = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    '<Default Extension="xml" ContentType="application/xml"/>'
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
    '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'
    '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
    '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
    "</Types>"
)

ROOT_RELS_XML = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
    '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
    '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
    "</Relationships>"
)

APP_XML = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" '
    'xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
    "<Application>claude_export_to_docx.py</Application></Properties>"
)

SECT_PR = (
    "<w:sectPr>"
    '<w:pgSz w:w="12240" w:h="15840"/>'
    '<w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080" '
    'w:header="720" w:footer="720" w:gutter="0"/>'
    "</w:sectPr>"
)


def core_xml(title: str, created: str, modified: str) -> str:
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" '
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
        "<dc:title>%s</dc:title><dc:creator>Claude conversation export</dc:creator>"
        '<dcterms:created xsi:type="dcterms:W3CDTF">%s</dcterms:created>'
        '<dcterms:modified xsi:type="dcterms:W3CDTF">%s</dcterms:modified>'
        "</cp:coreProperties>" % (esc(title), created, modified)
    )


def utc_stamp(d: dt.datetime | None) -> str:
    d = d or dt.datetime.now(dt.timezone.utc)
    if d.tzinfo is None:
        d = d.replace(tzinfo=dt.timezone.utc)
    return d.astimezone(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def write_docx(
    path: str,
    body_xml: str,
    rels: Rels,
    title: str,
    created: dt.datetime | None,
    modified: dt.datetime | None,
) -> None:
    doc = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        "<w:body>%s%s</w:body></w:document>" % (body_xml, SECT_PR)
    )
    tmp = path + ".part"
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", CONTENT_TYPES_XML)
        z.writestr("_rels/.rels", ROOT_RELS_XML)
        z.writestr(
            "docProps/core.xml", core_xml(title, utc_stamp(created), utc_stamp(modified))
        )
        z.writestr("docProps/app.xml", APP_XML)
        z.writestr("word/_rels/document.xml.rels", rels.xml())
        z.writestr("word/styles.xml", STYLES_XML)
        z.writestr("word/document.xml", doc)
    os.replace(tmp, path)


# --------------------------------------------------------------------------
# Markdown -> OOXML (a pragmatic subset: what Claude actually emits)
# --------------------------------------------------------------------------

INLINE_RE = re.compile(
    r"(?P<ctick>`+)(?P<code>.+?)(?P=ctick)"
    r"|!?\[(?P<ltext>[^\]]*)\]\((?P<lurl>[^)\s]+)(?:\s+\"[^\"]*\")?\)"
    r"|(?P<bmark>\*\*|__)(?P<bold>.+?)(?P=bmark)"
    r"|(?P<smark>~~)(?P<strike>.+?)(?P=smark)"
    r"|(?<![\w*])\*(?P<em>[^*\n]+)\*(?![\w*])"
    r"|(?<![\w_])_(?P<em2>[^_\n]+)_(?![\w_])",
    re.S,
)

BARE_URL_RE = re.compile(
    r"(?<![\w@/=\"'])(https?://[^\s<>\"'\)\]]+[^\s<>\"'\)\].,;:!?])"
)


def hyperlink(rels: Rels, text: str, url: str) -> str:
    rid = rels.link(url)
    return '<w:hyperlink r:id="%s">%s</w:hyperlink>' % (
        rid,
        run(text, color="0563C1", underline=True),
    )


def plain(text: str, rels: Rels, **base: Any) -> str:
    """Literal text, but turn bare URLs into real links."""
    out: list[str] = []
    pos = 0
    for m in BARE_URL_RE.finditer(text):
        if m.start() > pos:
            out.append(run(text[pos : m.start()], **base))
        out.append(hyperlink(rels, m.group(1), m.group(1)))
        pos = m.end()
    if pos < len(text):
        out.append(run(text[pos:], **base))
    return "".join(out)


def inline(text: str, rels: Rels, **base: Any) -> str:
    """Render inline markdown to a string of runs."""
    out: list[str] = []
    pos = 0
    for m in INLINE_RE.finditer(text):
        if m.start() > pos:
            out.append(plain(text[pos : m.start()], rels, **base))
        if m.group("code") is not None:
            kw = dict(base)
            kw.pop("mono", None)
            out.append(run(m.group("code"), mono=True, **kw))
        elif m.group("lurl") is not None:
            out.append(
                hyperlink(rels, m.group("ltext") or m.group("lurl"), m.group("lurl"))
            )
        elif m.group("bold") is not None:
            out.append(inline(m.group("bold"), rels, **{**base, "bold": True}))
        elif m.group("strike") is not None:
            out.append(inline(m.group("strike"), rels, **{**base, "strike": True}))
        elif m.group("em") is not None:
            out.append(inline(m.group("em"), rels, **{**base, "italic": True}))
        elif m.group("em2") is not None:
            out.append(inline(m.group("em2"), rels, **{**base, "italic": True}))
        pos = m.end()
    if pos < len(text):
        out.append(plain(text[pos:], rels, **base))
    return "".join(out)


BULLET_RE = re.compile(r"^(\s*)([-*+]|\d{1,3}[.)])\s+(.*)$")
HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)$")
FENCE_RE = re.compile(r"^\s*(```+|~~~+)\s*([\w+#.-]*)\s*$")
QUOTE_RE = re.compile(r"^\s*>\s?(.*)$")
HR_RE = re.compile(r"^\s*(?:-{3,}|\*{3,}|_{3,})\s*$")
TABLE_SEP_RE = re.compile(r"^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$")


def split_row(line: str) -> list[str]:
    line = line.strip()
    if line.startswith("|"):
        line = line[1:]
    if line.endswith("|"):
        line = line[:-1]
    return [c.strip() for c in re.split(r"(?<!\\)\|", line)]


def table_xml(rows: list[list[str]], rels: Rels) -> str:
    ncols = max(len(r) for r in rows)
    width = 9360  # printable width in twips at 0.75" margins
    col = width // ncols
    grid = "".join('<w:gridCol w:w="%d"/>' % col for _ in range(ncols))
    out = [
        '<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/>'
        '<w:tblW w:w="%d" w:type="dxa"/>'
        "<w:tblBorders>"
        '<w:top w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>'
        '<w:left w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>'
        '<w:bottom w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>'
        '<w:right w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>'
        '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>'
        '<w:insideV w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>'
        "</w:tblBorders></w:tblPr>"
        "<w:tblGrid>%s</w:tblGrid>" % (width, grid)
    ]
    for i, row in enumerate(rows):
        cells = []
        for c in range(ncols):
            text = (
                (row[c] if c < len(row) else "")
                .replace("<br>", "\n")
                .replace("\\|", "|")
            )
            shading = (
                '<w:shd w:val="clear" w:color="auto" w:fill="F2F2F2"/>' if i == 0 else ""
            )
            body = para(inline(text, rels, bold=(i == 0)), space_after=0, space_before=0)
            cells.append(
                '<w:tc><w:tcPr><w:tcW w:w="%d" w:type="dxa"/>%s</w:tcPr>%s</w:tc>'
                % (col, shading, body)
            )
        header = "<w:trPr><w:tblHeader/></w:trPr>" if i == 0 else ""
        out.append("<w:tr>%s%s</w:tr>" % (header, "".join(cells)))
    out.append("</w:tbl>")
    out.append(para("", space_after=80))  # Word wants a paragraph after a table
    return "".join(out)


def markdown_body(text: str, rels: Rels, indent: int = 0) -> str:
    """Render a markdown block into paragraph XML."""
    lines = text.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    out: list[str] = []
    i = 0
    n = len(lines)
    while i < n:
        line = lines[i]

        fence = FENCE_RE.match(line)
        if fence:
            marker = fence.group(1)[0] * 3
            lang = fence.group(2)
            i += 1
            buf: list[str] = []
            while i < n and not re.match(r"^\s*%s+\s*$" % re.escape(marker), lines[i]):
                buf.append(lines[i])
                i += 1
            i += 1  # closing fence
            if lang:
                out.append(
                    para(
                        run(lang, mono=True, size=16, color=META_COLOR, caps=True),
                        indent=indent + 120,
                        space_before=120,
                        space_after=0,
                    )
                )
            while buf and not buf[-1].strip():
                buf.pop()
            for code_line in buf or [""]:
                out.append(
                    para(
                        run(code_line or " ", mono=True, size=19),
                        indent=indent + 120,
                        shade=CODE_FILL,
                        space_before=0,
                        space_after=0,
                    )
                )
            out.append(para("", space_after=60, space_before=0))
            continue

        if not line.strip():
            i += 1
            continue

        if HR_RE.match(line):
            out.append(para("", rule_below=True, space_after=140, space_before=60))
            i += 1
            continue

        head = HEADING_RE.match(line)
        if head:
            level = min(len(head.group(1)), 4)
            out.append(
                para(
                    inline(head.group(2).rstrip("#").strip(), rels),
                    style="Heading%d" % level,
                    indent=indent,
                )
            )
            i += 1
            continue

        # Pipe table: a header row followed by a |---|---| separator.
        if "|" in line and i + 1 < n and TABLE_SEP_RE.match(lines[i + 1]):
            rows = [split_row(line)]
            i += 2
            while i < n and "|" in lines[i] and lines[i].strip():
                rows.append(split_row(lines[i]))
                i += 1
            out.append(table_xml(rows, rels))
            continue

        quote = QUOTE_RE.match(line)
        if quote:
            buf = [quote.group(1)]
            i += 1
            while i < n:
                nxt = QUOTE_RE.match(lines[i])
                if not nxt:
                    break
                buf.append(nxt.group(1))
                i += 1
            out.append(
                para(
                    inline("\n".join(buf).strip(), rels, italic=True, color="454545"),
                    indent=indent + 260,
                    left_bar=True,
                    space_before=60,
                )
            )
            continue

        bullet = BULLET_RE.match(line)
        if bullet:
            lead, marker, rest = bullet.groups()
            depth = min(len(lead.replace("\t", "    ")) // 2, 4)
            ordered = marker[0].isdigit()
            glyph = marker if ordered else ("•", "◦", "▪")[depth % 3]
            # Fold hanging continuation lines into the same item.
            i += 1
            while (
                i < n
                and lines[i].strip()
                and lines[i].startswith((" ", "\t"))
                and not BULLET_RE.match(lines[i])
                and not HEADING_RE.match(lines[i])
                and not FENCE_RE.match(lines[i])
            ):
                rest += " " + lines[i].strip()
                i += 1
            left = indent + 360 + depth * 340
            out.append(
                para(
                    run(glyph + "\t", bold=ordered) + inline(rest, rels),
                    indent=left,
                    hanging=340,
                    space_after=60,
                )
            )
            continue

        # Plain paragraph: gather until a blank line or the start of a block.
        buf = [line]
        i += 1
        while i < n and lines[i].strip():
            nxt = lines[i]
            if (
                BULLET_RE.match(nxt)
                or HEADING_RE.match(nxt)
                or FENCE_RE.match(nxt)
                or QUOTE_RE.match(nxt)
                or HR_RE.match(nxt)
                or (i + 1 < n and "|" in nxt and TABLE_SEP_RE.match(lines[i + 1]))
            ):
                break
            buf.append(nxt)
            i += 1
        out.append(para(inline("\n".join(buf).strip(), rels), indent=indent))
    return "".join(out)


# --------------------------------------------------------------------------
# Reading the export
# --------------------------------------------------------------------------


def parse_ts(value: Any) -> dt.datetime | None:
    if not value:
        return None
    if isinstance(value, (int, float)):
        try:
            return dt.datetime.fromtimestamp(value, dt.timezone.utc)
        except (ValueError, OSError, OverflowError):
            return None
    if not isinstance(value, str):
        return None
    text = value.strip().replace("Z", "+00:00")
    text = re.sub(r"(\.\d{6})\d+", r"\1", text)
    try:
        parsed = dt.datetime.fromisoformat(text)
    except ValueError:
        for fmt in ("%Y-%m-%dT%H:%M:%S.%f%z", "%Y-%m-%dT%H:%M:%S%z", "%Y-%m-%d"):
            try:
                parsed = dt.datetime.strptime(text, fmt)
                break
            except ValueError:
                continue
        else:
            return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=dt.timezone.utc)
    return parsed


def fmt_ts(d: dt.datetime | None, tz: dt.tzinfo | None) -> str:
    if not d:
        return "unknown date"
    local = d.astimezone(tz) if tz else d.astimezone()
    if os.name == "nt":
        return local.strftime("%B %d, %Y at %I:%M %p")
    return local.strftime("%B %-d, %Y at %-I:%M %p")


def block_text(block: Any, include_tools: bool) -> str:
    """Pull display text out of one content block."""
    if isinstance(block, str):
        return block
    if not isinstance(block, dict):
        return ""
    kind = block.get("type")
    if kind in (None, "text"):
        return block.get("text") or ""
    if kind == "thinking":
        return ""
    if kind == "tool_use" and include_tools:
        payload = block.get("input")
        name = block.get("name", "tool")
        if isinstance(payload, dict) and len(payload) == 1:
            payload = next(iter(payload.values()))
        body = payload if isinstance(payload, str) else json.dumps(payload, indent=2)
        return "```\n[tool: %s]\n%s\n```" % (name, (body or "").strip())
    if kind == "tool_result" and include_tools:
        content = block.get("content")
        if isinstance(content, list):
            content = "\n".join(block_text(c, True) for c in content)
        return "```\n[tool result]\n%s\n```" % str(content or "").strip()
    return ""


def message_text(msg: dict, include_tools: bool) -> str:
    content = msg.get("content")
    parts: list[str] = []
    if isinstance(content, list):
        parts = [block_text(b, include_tools) for b in content]
    elif isinstance(content, str):
        parts = [content]
    joined = "\n\n".join(p for p in parts if p and p.strip()).strip()
    return joined or (msg.get("text") or "").strip()


def conversation_records(obj: Any) -> list[dict]:
    """Accept the several shapes an export can arrive in."""
    if isinstance(obj, list):
        return [c for c in obj if isinstance(c, dict)]
    if isinstance(obj, dict):
        for key in ("conversations", "chats", "data", "items"):
            if isinstance(obj.get(key), list):
                return [c for c in obj[key] if isinstance(c, dict)]
        if "chat_messages" in obj or "messages" in obj:
            return [obj]
    return []


def load_conversations(path: str) -> tuple[list[dict], dict[str, str]]:
    """Return (conversations, project_uuid -> project name)."""
    projects: dict[str, str] = {}

    def read_projects(raw: bytes) -> None:
        try:
            data = json.loads(raw.decode("utf-8"))
        except Exception:
            return
        if isinstance(data, list):
            for p in data:
                if isinstance(p, dict) and p.get("uuid"):
                    projects[p["uuid"]] = p.get("name") or ""

    if zipfile.is_zipfile(path):
        with zipfile.ZipFile(path) as z:
            names = z.namelist()
            conv_name = next(
                (n for n in names if os.path.basename(n) == "conversations.json"), None
            )
            if not conv_name:
                conv_name = next(
                    (
                        n
                        for n in names
                        if n.lower().endswith(".json") and "conversation" in n.lower()
                    ),
                    None,
                )
            if not conv_name:
                raise SystemExit(
                    "No conversations.json inside %s. Files present: %s"
                    % (path, ", ".join(names[:20]) or "(empty)")
                )
            proj_name = next(
                (n for n in names if os.path.basename(n) == "projects.json"), None
            )
            if proj_name:
                read_projects(z.read(proj_name))
            data = json.loads(z.read(conv_name).decode("utf-8"))
    else:
        with open(path, "r", encoding="utf-8") as fh:
            data = json.load(fh)
        sibling = os.path.join(os.path.dirname(os.path.abspath(path)), "projects.json")
        if os.path.exists(sibling):
            with open(sibling, "rb") as fh:
                read_projects(fh.read())

    convos = conversation_records(data)
    if not convos:
        raise SystemExit(
            "Could not find any conversations in %s (top-level type: %s)."
            % (path, type(data).__name__)
        )
    return convos, projects


# --------------------------------------------------------------------------
# Claude Code transcripts (~/.claude/projects/**/*.jsonl)
#
# A different archive from the claude.ai export: these are the terminal / IDE
# sessions, stored locally as one JSON object per line. They get normalised
# into the same shape as an exported conversation so the rest of the pipeline
# does not need to care where a conversation came from.
# --------------------------------------------------------------------------

SYSTEM_NOISE_RE = re.compile(r"<system-reminder>.*?</system-reminder>\s*", re.S)


def scrub(value: Any) -> Any:
    """Strip harness bookkeeping that was never part of the conversation."""
    if isinstance(value, str):
        return SYSTEM_NOISE_RE.sub("", value).strip()
    if isinstance(value, list):
        out = []
        for block in value:
            if isinstance(block, dict) and block.get("type") == "text":
                block = dict(block, text=SYSTEM_NOISE_RE.sub("", block.get("text") or "").strip())
                if not block["text"]:
                    continue
            out.append(block)
        return out
    return value


def claude_code_title(turns: list[dict], cwd: str) -> str:
    """Name a session after its first real human prompt."""
    for turn in turns:
        if (turn.get("sender") or "").lower() not in ("user", "human"):
            continue
        text = message_text(turn, False).strip()
        if not text or text.startswith("<"):
            continue
        text = re.sub(r"\s+", " ", text)
        if len(text) > 70:
            text = text[:70].rsplit(" ", 1)[0] + "..."
        return text
    return "Claude Code session in %s" % (os.path.basename(cwd.rstrip("/")) or "unknown folder")


def load_claude_code_sessions(paths: list[str], include_sidechains: bool) -> list[dict]:
    sessions: list[dict] = []
    for path in paths:
        turns: list[dict] = []
        session_id = os.path.splitext(os.path.basename(path))[0]
        cwd = branch = ""
        first_ts = last_ts = None
        try:
            fh = open(path, "r", encoding="utf-8", errors="replace")
        except OSError as exc:
            print("  ! cannot read %s: %s" % (path, exc), file=sys.stderr)
            continue
        with fh:
            for line in fh:
                line = line.strip()
                if not line:
                    continue
                try:
                    rec = json.loads(line)
                except ValueError:
                    continue
                if not isinstance(rec, dict) or rec.get("type") not in ("user", "assistant"):
                    continue
                if rec.get("isSidechain") and not include_sidechains:
                    continue
                msg = rec.get("message")
                if not isinstance(msg, dict):
                    continue
                ts = rec.get("timestamp")
                if ts and not first_ts:
                    first_ts = ts
                if ts:
                    last_ts = ts
                cwd = cwd or rec.get("cwd") or ""
                branch = branch or rec.get("gitBranch") or ""
                session_id = rec.get("sessionId") or session_id
                turns.append(
                    {
                        "uuid": rec.get("uuid") or "",
                        "sender": msg.get("role") or rec.get("type"),
                        "created_at": ts,
                        "content": scrub(msg.get("content")),
                    }
                )
        if not turns:
            continue
        sessions.append(
            {
                "uuid": session_id,
                "name": claude_code_title(turns, cwd),
                "created_at": first_ts,
                "updated_at": last_ts,
                "chat_messages": turns,
                "_claude_code": True,
                "_cwd": cwd,
                "_branch": branch,
            }
        )
    return sessions


def resolve_source(opts: argparse.Namespace) -> tuple[list[dict], dict[str, str]]:
    """Work out what kind of archive we were pointed at and load it."""
    src = opts.source
    if os.path.isdir(src):
        found = sorted(glob.glob(os.path.join(src, "**", "*.jsonl"), recursive=True))
        if found:
            print("Reading %d Claude Code transcript(s) under %s ..." % (len(found), src))
            return load_claude_code_sessions(found, opts.include_sidechains), {}
        raise SystemExit(
            "%s is a folder with no .jsonl transcripts in it. Point me at the "
            "export .zip, at conversations.json, or at ~/.claude/projects." % src
        )
    if src.lower().endswith(".jsonl"):
        print("Reading Claude Code transcript %s ..." % src)
        return load_claude_code_sessions([src], opts.include_sidechains), {}
    print("Reading %s ..." % src)
    return load_conversations(src)


def project_of(convo: dict, projects: dict[str, str]) -> str:
    uuid = convo.get("project_uuid")
    if not uuid and isinstance(convo.get("project"), dict):
        uuid = convo["project"].get("uuid")
        if not uuid:
            return convo["project"].get("name") or ""
    return projects.get(uuid or "", "")


# --------------------------------------------------------------------------
# Filenames
# --------------------------------------------------------------------------

UNSAFE_RE = re.compile("[<>:\"/|?*\\\\" + "\\x00-\\x1f" + "]")
RESERVED = {
    "CON",
    "PRN",
    "AUX",
    "NUL",
    *("COM%d" % i for i in range(1, 10)),
    *("LPT%d" % i for i in range(1, 10)),
}


def safe_name(title: str, when: dt.datetime | None, uuid: str, datestamp: bool) -> str:
    title = unicodedata.normalize("NFC", (title or "").strip())
    title = UNSAFE_RE.sub(" ", title)
    title = title.replace("’", "'").replace("“", '"').replace("”", '"')
    title = re.sub(r"\s+", " ", title).strip(" .")
    if not title or title.upper() in RESERVED:
        title = "Untitled conversation"
    if len(title) > 90:
        title = title[:90].rsplit(" ", 1)[0].rstrip(" ,;:-") or title[:90]
    prefix = ""
    if datestamp:
        prefix = (when.astimezone().strftime("%Y-%m-%d") + " ") if when else "0000-00-00 "
    return "%s%s [%s]" % (prefix, title, (uuid or "nouuid")[:8])


# --------------------------------------------------------------------------
# Document assembly
# --------------------------------------------------------------------------


def conversation_turns(convo: dict, opts: argparse.Namespace) -> list[dict]:
    """Flatten a conversation into the turns worth printing.

    Messages that carry no visible text and no attachments are dropped (they
    are tool plumbing, or a thinking block we are not showing), and runs of
    consecutive messages from the same speaker are merged so the document
    reads as a conversation rather than a log.
    """
    turns: list[dict] = []
    for msg in convo.get("chat_messages") or convo.get("messages") or []:
        if not isinstance(msg, dict):
            continue
        sender = (msg.get("sender") or msg.get("role") or "").lower()
        label = ROLE_LABELS.get(sender, sender.title() or "Message")
        text = message_text(msg, opts.include_tool_calls)

        attachments = [a for a in (msg.get("attachments") or []) if isinstance(a, dict)]
        files = [f for f in (msg.get("files") or []) if isinstance(f, dict)]
        names = [
            a.get("file_name") or a.get("name")
            for a in attachments + files
            if a.get("file_name") or a.get("name")
        ]

        if not text and not names:
            continue

        if turns and turns[-1]["label"] == label and not turns[-1]["names"] and not names:
            turns[-1]["text"] = (turns[-1]["text"] + "\n\n" + text).strip()
            continue

        turns.append(
            {
                "label": label,
                "when": parse_ts(msg.get("created_at") or msg.get("timestamp")),
                "text": text,
                "names": names,
                "attachments": attachments,
            }
        )
    return turns


def build_conversation_doc(
    convo: dict, opts: argparse.Namespace, project_name: str, tz: dt.tzinfo | None
) -> tuple[str, Rels, str, dt.datetime | None, dt.datetime | None]:
    rels = Rels()
    title = (convo.get("name") or "").strip() or "Untitled conversation"
    uuid = convo.get("uuid") or convo.get("id") or ""
    created = parse_ts(convo.get("created_at"))
    updated = parse_ts(convo.get("updated_at")) or created

    turns = conversation_turns(convo, opts)

    body: list[str] = [
        para(run(title, size=44, bold=True), style="Title", space_after=60)
    ]

    meta_bits = [fmt_ts(created, tz)]
    if updated and created and abs((updated - created).total_seconds()) > 60:
        meta_bits.append("last updated " + fmt_ts(updated, tz))
    meta_bits.append("%d message%s" % (len(turns), "" if len(turns) == 1 else "s"))
    if project_name:
        meta_bits.append("project: " + project_name)
    if convo.get("_cwd"):
        meta_bits.append("folder: " + convo["_cwd"])
    if convo.get("_branch"):
        meta_bits.append("branch: " + convo["_branch"])
    body.append(
        para(run("   ·   ".join(meta_bits), size=18, color=META_COLOR), space_after=40)
    )
    if uuid and not convo.get("_claude_code"):
        link = "https://claude.ai/chat/%s" % uuid
        body.append(
            para(
                run("Original: ", size=18, color=META_COLOR)
                + hyperlink(rels, link, link),
                space_after=0,
                rule_below=True,
            )
        )
    else:
        body.append(
            para(
                run("Session %s" % uuid, size=18, color=META_COLOR),
                space_after=0,
                rule_below=True,
            )
        )
    body.append(para("", space_after=160, space_before=0))

    if not turns:
        body.append(
            para(
                run(
                    "This conversation contains no messages.",
                    italic=True,
                    color=META_COLOR,
                )
            )
        )

    for turn in turns:
        label = turn["label"]
        color = HUMAN_COLOR if label == "You" else ASSISTANT_COLOR
        when = turn["when"]

        header = run(label, bold=True, size=22, color=color, caps=True)
        if when and not opts.no_message_times:
            header += run("      " + fmt_ts(when, tz), size=16, color=META_COLOR)
        body.append(para(header, space_before=280, space_after=80, keep_next=True))

        if turn["text"]:
            body.append(markdown_body(turn["text"], rels, indent=200))

        attachments = turn["attachments"]
        names = turn["names"]
        if names:
            body.append(
                para(
                    run("Attached: ", bold=True, size=18, color=META_COLOR)
                    + run(", ".join(names), size=18, color=META_COLOR),
                    indent=200,
                    space_before=40,
                )
            )
        if opts.include_attachment_text:
            for a in attachments:
                extracted = (a.get("extracted_content") or "").strip()
                if not extracted:
                    continue
                body.append(
                    para(
                        run(
                            "Contents of %s" % (a.get("file_name") or "attachment"),
                            bold=True,
                            size=18,
                            color=META_COLOR,
                        ),
                        indent=320,
                        space_before=80,
                        space_after=40,
                    )
                )
                for line in extracted.split("\n"):
                    body.append(
                        para(
                            run(line or " ", mono=True, size=17),
                            indent=320,
                            shade=CODE_FILL,
                            space_before=0,
                            space_after=0,
                        )
                    )
                body.append(para("", space_after=60, space_before=0))

    return "".join(body), rels, title, created, updated


def build_index_doc(rows: list[dict], tz: dt.tzinfo | None) -> tuple[str, Rels]:
    rels = Rels()
    body = [
        para(run("Claude Conversation Archive", size=44, bold=True), style="Title"),
        para(
            run(
                "%d conversation%s   ·   exported %s"
                % (
                    len(rows),
                    "" if len(rows) == 1 else "s",
                    dt.datetime.now().strftime("%B %d, %Y"),
                ),
                size=18,
                color=META_COLOR,
            ),
            rule_below=True,
            space_after=240,
        ),
    ]
    oldest = dt.datetime.min.replace(tzinfo=dt.timezone.utc)
    by_month: dict[str, list[dict]] = {}
    for r in rows:
        when = r["created"]
        key = when.astimezone(tz).strftime("%B %Y") if when else "Undated"
        by_month.setdefault(key, []).append(r)

    def month_key(item: tuple[str, list[dict]]) -> tuple:
        first = item[1][0]["created"]
        return (0, -first.timestamp()) if first else (1, 0.0)

    for month, group in sorted(by_month.items(), key=month_key):
        body.append(para(run(month, bold=True, size=26), style="Heading2"))
        for r in sorted(group, key=lambda x: x["created"] or oldest, reverse=True):
            body.append(
                para(
                    run(r["title"], bold=True)
                    + run("      %d msg" % r["messages"], size=17, color=META_COLOR),
                    indent=200,
                    space_after=20,
                )
            )
            detail = "%s   ·   %s.docx" % (fmt_ts(r["created"], tz), r["filename"])
            if r.get("project"):
                detail = "%s   ·   %s" % (r["project"], detail)
            body.append(
                para(run(detail, size=17, color=META_COLOR), indent=200, space_after=120)
            )
    return "".join(body), rels


# --------------------------------------------------------------------------
# CLI
# --------------------------------------------------------------------------


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(
        description="Turn a Claude data export into one Word document per conversation.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  python3 claude_export_to_docx.py data-2026-09-05.zip\n"
            "  python3 claude_export_to_docx.py conversations.json -o ~/ClaudeArchive\n"
            "  python3 claude_export_to_docx.py export.zip --since 2025-01-01 --datestamp\n"
        ),
    )
    ap.add_argument(
        "source",
        help="the export .zip, the conversations.json inside it, or a folder of "
        "Claude Code .jsonl transcripts (e.g. ~/.claude/projects)",
    )
    ap.add_argument(
        "-o",
        "--out",
        default="ClaudeConversations",
        help="output folder (default: ./ClaudeConversations)",
    )
    ap.add_argument(
        "--since", metavar="YYYY-MM-DD", help="only conversations created on/after this date"
    )
    ap.add_argument(
        "--until", metavar="YYYY-MM-DD", help="only conversations created before this date"
    )
    ap.add_argument(
        "--search", metavar="TEXT", help="only conversations whose title or text contains TEXT"
    )
    ap.add_argument(
        "--limit", type=int, help="stop after N conversations (handy for a test run)"
    )
    ap.add_argument(
        "--datestamp",
        action="store_true",
        help="prefix filenames with the date, so they sort chronologically",
    )
    ap.add_argument(
        "--folders-by-month",
        action="store_true",
        help="group output into YYYY-MM subfolders",
    )
    ap.add_argument(
        "--skip-empty", action="store_true", help="skip conversations with no messages"
    )
    ap.add_argument(
        "--include-tool-calls",
        action="store_true",
        help="include tool / code-execution blocks",
    )
    ap.add_argument(
        "--include-attachment-text",
        action="store_true",
        help="include the extracted text of uploaded files",
    )
    ap.add_argument(
        "--include-sidechains",
        action="store_true",
        help="Claude Code only: also include subagent side conversations",
    )
    ap.add_argument(
        "--no-message-times", action="store_true", help="omit the per-message timestamps"
    )
    ap.add_argument(
        "--no-index", action="store_true", help="skip the index document and CSV"
    )
    ap.add_argument(
        "--overwrite", action="store_true", help="rewrite documents that already exist"
    )
    opts = ap.parse_args(argv)

    if not os.path.exists(opts.source):
        print("No such file: %s" % opts.source, file=sys.stderr)
        return 2

    tz = dt.datetime.now().astimezone().tzinfo
    since = parse_ts(opts.since) if opts.since else None
    until = parse_ts(opts.until) if opts.until else None
    if opts.since and not since:
        print("Could not read --since %r as a date." % opts.since, file=sys.stderr)
        return 2
    if opts.until and not until:
        print("Could not read --until %r as a date." % opts.until, file=sys.stderr)
        return 2

    convos, projects = resolve_source(opts)
    print("Found %d conversations." % len(convos))

    os.makedirs(opts.out, exist_ok=True)

    oldest = dt.datetime.min.replace(tzinfo=dt.timezone.utc)
    convos.sort(key=lambda c: parse_ts(c.get("created_at")) or oldest)

    rows: list[dict] = []
    used: set[str] = set()
    written = skipped = failed = 0

    for convo in convos:
        created = parse_ts(convo.get("created_at"))
        if since and created and created < since:
            continue
        if until and created and created >= until:
            continue

        turns = conversation_turns(convo, opts)
        if opts.skip_empty and not turns:
            skipped += 1
            continue
        if opts.search:
            needle = opts.search.lower()
            if needle not in (convo.get("name") or "").lower():
                blob = " ".join(t["text"].lower() for t in turns)
                if needle not in blob:
                    continue

        uuid = convo.get("uuid") or convo.get("id") or ""
        project = project_of(convo, projects)

        stem = safe_name(convo.get("name"), created, uuid, opts.datestamp)
        candidate, bump = stem, 2
        while candidate.lower() in used:
            candidate = "%s (%d)" % (stem, bump)
            bump += 1
        used.add(candidate.lower())

        folder = opts.out
        if opts.folders_by_month:
            sub = created.astimezone(tz).strftime("%Y-%m") if created else "undated"
            folder = os.path.join(opts.out, sub)
            os.makedirs(folder, exist_ok=True)
        path = os.path.join(folder, candidate + ".docx")

        row = {
            "title": (convo.get("name") or "").strip() or "Untitled conversation",
            "filename": candidate,
            "path": path,
            "created": created,
            "updated": parse_ts(convo.get("updated_at")) or created,
            "messages": len(turns),
            "uuid": uuid,
            "project": project,
        }

        if os.path.exists(path) and not opts.overwrite:
            rows.append(row)
            skipped += 1
        else:
            try:
                body, rels, title, c, u = build_conversation_doc(convo, opts, project, tz)
                write_docx(path, body, rels, title, c, u)
                rows.append(row)
                written += 1
            except Exception as exc:  # one bad conversation must not sink the run
                failed += 1
                print(
                    "  ! %s - %s: %s" % (candidate, type(exc).__name__, exc),
                    file=sys.stderr,
                )

        done = written + skipped
        if done and done % 50 == 0:
            print("  %d done ..." % done)

        if opts.limit and written >= opts.limit:
            break

    if rows and not opts.no_index:
        body, rels = build_index_doc(rows, tz)
        now = dt.datetime.now(dt.timezone.utc)
        write_docx(
            os.path.join(opts.out, "000 Index of conversations.docx"),
            body,
            rels,
            "Claude Conversation Archive",
            now,
            now,
        )
        with open(
            os.path.join(opts.out, "000 Index of conversations.csv"),
            "w",
            newline="",
            encoding="utf-8-sig",
        ) as fh:
            w = csv.writer(fh)
            w.writerow(
                [
                    "Title",
                    "Created",
                    "Updated",
                    "Messages",
                    "Project",
                    "File",
                    "Conversation ID",
                ]
            )
            for r in rows:
                w.writerow(
                    [
                        r["title"],
                        r["created"].astimezone(tz).isoformat() if r["created"] else "",
                        r["updated"].astimezone(tz).isoformat() if r["updated"] else "",
                        r["messages"],
                        r["project"],
                        r["filename"] + ".docx",
                        r["uuid"],
                    ]
                )

    print(
        "\nDone. %d written, %d skipped%s.\nFolder: %s"
        % (
            written,
            skipped,
            ", %d failed" % failed if failed else "",
            os.path.abspath(opts.out),
        )
    )
    return 1 if failed and not written else 0


if __name__ == "__main__":
    sys.exit(main())
