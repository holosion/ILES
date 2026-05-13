from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


BASE_DIR = Path(__file__).resolve().parent
SOURCE = BASE_DIR / "ILES_FRONTEND_DETAILED_DOCUMENTATION.md"
OUTPUT = BASE_DIR / "ILES_FRONTEND_DETAILED_DOCUMENTATION.pdf"


def build_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="CoverTitle",
            parent=styles["Title"],
            alignment=TA_CENTER,
            fontSize=24,
            leading=30,
            textColor=colors.HexColor("#102133"),
            spaceAfter=18,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CoverSubtitle",
            parent=styles["Normal"],
            alignment=TA_CENTER,
            fontSize=12,
            leading=18,
            textColor=colors.HexColor("#314359"),
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="DocHeading1",
            parent=styles["Heading1"],
            fontSize=17,
            leading=22,
            textColor=colors.HexColor("#006a75"),
            spaceBefore=12,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="DocHeading2",
            parent=styles["Heading2"],
            fontSize=13,
            leading=17,
            textColor=colors.HexColor("#102133"),
            spaceBefore=10,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="DocBody",
            parent=styles["BodyText"],
            fontSize=9.5,
            leading=14,
            alignment=TA_LEFT,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="DocBullet",
            parent=styles["BodyText"],
            fontSize=9.5,
            leading=14,
            leftIndent=14,
            firstLineIndent=-8,
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Small",
            parent=styles["BodyText"],
            fontSize=8,
            leading=11,
            textColor=colors.HexColor("#60748b"),
        )
    )
    return styles


def clean_inline(text):
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("**", "")
        .replace("`", "")
    )


def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#60748b"))
    canvas.drawRightString(A4[0] - 0.55 * inch, 0.38 * inch, f"Page {doc.page}")
    canvas.drawString(0.55 * inch, 0.38 * inch, "ILES Frontend Documentation")
    canvas.restoreState()


def markdown_to_story(markdown_text, styles):
    story = []
    in_code = False
    code_lines = []

    for raw_line in markdown_text.splitlines():
        line = raw_line.rstrip()

        if line.startswith("```"):
            if in_code:
                code_text = "\n".join(code_lines) or " "
                story.append(
                    Preformatted(
                        code_text,
                        ParagraphStyle(
                            name="CodeBlock",
                            fontName="Courier",
                            fontSize=7.2,
                            leading=9.5,
                            leftIndent=6,
                            rightIndent=6,
                            borderWidth=0.5,
                            borderColor=colors.HexColor("#d6e0ea"),
                            borderPadding=7,
                            backColor=colors.HexColor("#f4f8fb"),
                            spaceBefore=4,
                            spaceAfter=8,
                        ),
                    )
                )
                code_lines = []
                in_code = False
            else:
                in_code = True
            continue

        if in_code:
            code_lines.append(line)
            continue

        if not line:
            story.append(Spacer(1, 4))
            continue

        if line.startswith("# "):
            story.append(Paragraph(clean_inline(line[2:]), styles["CoverTitle"]))
            continue

        if line.startswith("## "):
            heading = clean_inline(line[3:])
            story.append(Paragraph(heading, styles["DocHeading1"]))
            continue

        if line.startswith("### "):
            story.append(Paragraph(clean_inline(line[4:]), styles["DocHeading2"]))
            continue

        if line.startswith("- "):
            story.append(Paragraph(f"• {clean_inline(line[2:])}", styles["DocBullet"]))
            continue

        if line[0:2].isdigit() and ". " in line[:5]:
            story.append(Paragraph(clean_inline(line), styles["DocBullet"]))
            continue

        story.append(Paragraph(clean_inline(line), styles["DocBody"]))

    return story


def build_pdf():
    markdown_text = SOURCE.read_text(encoding="utf-8")
    styles = build_styles()
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=0.55 * inch,
        leftMargin=0.55 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.6 * inch,
        title="ILES Frontend Detailed Documentation",
        author="CSC 1202 ILES Team",
    )

    story = [
        Spacer(1, 1.6 * inch),
        Paragraph("Internship Logging & Evaluation System", styles["CoverTitle"]),
        Paragraph("Detailed Frontend Documentation", styles["CoverSubtitle"]),
        Paragraph("CSC 1202: Software Development Project (2026)", styles["CoverSubtitle"]),
        Spacer(1, 0.25 * inch),
        Table(
            [
                ["Frontend", "React + Vite"],
                ["Purpose", "Explain the ILES interface and important code clearly"],
                ["Audience", "Beginners, students, supervisors, and technical defence panel"],
            ],
            colWidths=[1.4 * inch, 4.6 * inch],
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f4f8fb")),
                    ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#006a75")),
                    ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#d6e0ea")),
                    ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("PADDING", (0, 0), (-1, -1), 8),
                ]
            ),
        ),
        PageBreak(),
    ]
    story.extend(markdown_to_story(markdown_text, styles))
    doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)


if __name__ == "__main__":
    build_pdf()
    print(OUTPUT)
