# -*- coding: utf-8 -*-
"""
Full Document Generator:
Produces:
1. Thuyet_Trinh_Cay_Thu_Muc_Project.docx (Microsoft Word Document)
2. THUYET_MINH_CAY_THU_MUC.md (Markdown Document)
"""

import os
import sys
import shutil
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

# Import database
from codebase_data import PROJECT_METADATA, SECTIONS

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'  <w:top w:w="{top}" w:type="dxa"/>'
        f'  <w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'  <w:left w:w="{left}" w:type="dxa"/>'
        f'  <w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_cell_left_border(cell, color_hex="2563EB", size="36"):
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'  <w:top w:val="none"/>'
        f'  <w:left w:val="single" w:sz="{size}" w:space="0" w:color="{color_hex}"/>'
        f'  <w:bottom w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

def set_table_borders(table, border_color="CBD5E1"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'  <w:top w:val="single" w:sz="6" w:space="0" w:color="{border_color}"/>'
        f'  <w:left w:val="none"/>'
        f'  <w:bottom w:val="single" w:sz="8" w:space="0" w:color="{border_color}"/>'
        f'  <w:right w:val="none"/>'
        f'  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="{border_color}"/>'
        f'  <w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def add_heading_1(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(16)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(30, 58, 138) # Navy Blue
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = RGBColor(37, 99, 235) # Royal Blue
    return p

def add_heading_3(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(10.5)
    r.font.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42) # Slate 900
    return p

def add_paragraph(doc, text="", space_before=2, space_after=4, line_spacing=1.15, align=WD_ALIGN_PARAGRAPH.LEFT, bold=False, italic=False, color_rgb=None, size=10):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    if text:
        r = p.add_run(text)
        r.font.name = "Times New Roman"
        r.font.size = Pt(size)
        r.font.bold = bold
        r.font.italic = italic
        if color_rgb:
            r.font.color.rgb = color_rgb
        else:
            r.font.color.rgb = RGBColor(30, 41, 59)
    return p

def create_callout_box(doc, text_runs, border_color="2563EB", bg_color="F8FAFC"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    cell = tbl.rows[0].cells[0]
    cell.width = Inches(6.8)
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=120, bottom=120, left=160, right=160)
    set_cell_left_border(cell, color_hex=border_color, size="36")
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    
    for r_text, r_bold, r_italic, r_color, r_size in text_runs:
        r = p.add_run(r_text)
        r.font.name = "Times New Roman"
        r.font.bold = r_bold
        r.font.italic = r_italic
        if r_color:
            r.font.color.rgb = r_color
        if r_size:
            r.font.size = Pt(r_size)
        else:
            r.font.size = Pt(9.5)
            
    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(2)

def add_file_entry(doc, file_info):
    """Render a comprehensive file entry in the walkthrough document."""
    add_heading_2(doc, f"📄 {file_info['path']}")
    
    # Meta table (Path, Owner, Layer, Requirement)
    tbl = doc.add_table(rows=4, cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    set_table_borders(tbl, "E2E8F0")
    
    col_widths = [Inches(1.8), Inches(5.0)]
    meta_rows = [
        ("Phân tầng kiến trúc:", file_info['layer']),
        ("Thành viên phụ trách:", file_info['owner']),
        ("Tiêu chí đồ án đáp ứng:", file_info['requirement']),
        ("Mục đích cốt lõi:", file_info['purpose'])
    ]
    
    for i, (k, v) in enumerate(meta_rows):
        row = tbl.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width, c1.width = col_widths[0], col_widths[1]
        set_cell_margins(c0, 60, 60, 100, 100)
        set_cell_margins(c1, 60, 60, 100, 100)
        set_cell_background(c0, "F1F5F9")
        set_cell_background(c1, "FFFFFF" if i % 2 == 0 else "F8FAFC")
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(1)
        p0.paragraph_format.space_after = Pt(1)
        r0 = p0.add_run(k)
        r0.font.name = "Times New Roman"
        r0.font.bold = True
        r0.font.size = Pt(9)
        r0.font.color.rgb = RGBColor(71, 85, 105)
        
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_before = Pt(1)
        p1.paragraph_format.space_after = Pt(1)
        r1 = p1.add_run(v)
        r1.font.name = "Times New Roman"
        r1.font.size = Pt(9)
        r1.font.color.rgb = RGBColor(15, 23, 42)
        if "TV1" in v or "Trần Bảo Trâm" in v:
            r1.font.bold = True
        elif "TV2" in v or "Nguyễn Thị Hương Giang" in v:
            r1.font.bold = True
            
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(1)
    p_sp.paragraph_format.space_after = Pt(1)

    # Key Code Highlights
    if file_info.get('key_code'):
        add_heading_3(doc, "🔍 Điểm Nhấn Kỹ Thuật & Logic Cốt Lõi Trong File:")
        for sym_name, sym_desc in file_info['key_code']:
            p_sym = doc.add_paragraph()
            p_sym.paragraph_format.space_before = Pt(1)
            p_sym.paragraph_format.space_after = Pt(1)
            p_sym.paragraph_format.left_indent = Inches(0.2)
            
            r_bullet = p_sym.add_run("• ")
            r_bullet.font.bold = True
            r_bullet.font.color.rgb = RGBColor(37, 99, 235)
            
            r_sym = p_sym.add_run(f"[{sym_name}]: ")
            r_sym.font.name = "Times New Roman"
            r_sym.font.bold = True
            r_sym.font.size = Pt(9.5)
            r_sym.font.color.rgb = RGBColor(30, 58, 138)
            
            r_desc = p_sym.add_run(sym_desc)
            r_desc.font.name = "Times New Roman"
            r_desc.font.size = Pt(9.5)
            r_desc.font.color.rgb = RGBColor(51, 65, 85)

    # Presentation Speech Box
    if file_info.get('presentation_speech'):
        create_callout_box(
            doc,
            [
                ("🗣️ LỜI THOẠI THUYẾT TRÌNH MẪU KHI CHIẾU FILE NÀY:\n", True, False, RGBColor(5, 150, 105), 10),
                (f'"{file_info["presentation_speech"]}"', False, True, RGBColor(15, 23, 42), 9.5)
            ],
            border_color="059669", # Emerald Green
            bg_color="F0FDF4"
        )

    # Viva Trap & Answer Box
    if file_info.get('viva_trap'):
        trap = file_info['viva_trap']
        create_callout_box(
            doc,
            [
                ("🎯 BẪY VẤN ĐÁP CỦA THẦY VINH & CÁCH TRẢ LỜI ĐẠT ĐIỂM 10:\n", True, False, RGBColor(180, 83, 9), 10),
                ("❓ Thầy hỏi: ", True, False, RGBColor(180, 83, 9), 9.5),
                (f'"{trap["question"]}"\n', True, True, RGBColor(180, 83, 9), 9.5),
                ("💡 Câu trả lời chuẩn xác: ", True, False, RGBColor(30, 58, 138), 9.5),
                (f'"{trap["answer"]}"', False, False, RGBColor(15, 23, 42), 9.5)
            ],
            border_color="D97706", # Amber
            bg_color="FFFBEB"
        )
    
    # Separator line
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_before = Pt(2)
    p_div.paragraph_format.space_after = Pt(4)
    r_div = p_div.add_run("· " * 42)
    r_div.font.color.rgb = RGBColor(203, 213, 225)
    p_div.alignment = WD_ALIGN_PARAGRAPH.CENTER

def build_walkthrough_document(output_docx_path, output_md_path):
    doc = docx.Document()
    
    # Set standard margins (0.7 inch top/bottom, 0.75 left/right)
    for section in doc.sections:
        section.top_margin = Inches(0.7)
        section.bottom_margin = Inches(0.7)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
    # COVER / HEADER BLOCK
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_after = Pt(2)
    r_inst = p_inst.add_run(PROJECT_METADATA["university"].upper() + "\nBỘ MÔN CÔNG NGHỆ PHẦN MỀM & KỸ THUẬT DỮ LIỆU")
    r_inst.font.name = "Times New Roman"
    r_inst.font.size = Pt(10)
    r_inst.font.bold = True
    r_inst.font.color.rgb = RGBColor(100, 116, 139)
    
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(6)
    p_title.paragraph_format.space_after = Pt(4)
    r_title = p_title.add_run("HỒ SƠ THUYẾT MINH CHI TIẾT THEO CÂY THƯ MỤC DỰ ÁN\n(CODEBASE WALKTHROUGH & ARCHITECTURAL SPECIFICATION)")
    r_title.font.name = "Times New Roman"
    r_title.font.size = Pt(15)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(30, 58, 138)
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(6)
    r_sub = p_sub.add_run(
        f"{PROJECT_METADATA['topic']} | Môn: {PROJECT_METADATA['course']}\n"
        f"Giảng viên hướng dẫn & chấm thi: {PROJECT_METADATA['instructor']}\n"
        f"Sinh viên thực hiện: {PROJECT_METADATA['member1']}\n"
        f"                   {PROJECT_METADATA['member2']}\n"
        f"Phiên bản: {PROJECT_METADATA['version']} | Kho mã nguồn Git: {PROJECT_METADATA['repo']}"
    )
    r_sub.font.name = "Times New Roman"
    r_sub.font.size = Pt(9.5)
    r_sub.font.italic = True
    r_sub.font.color.rgb = RGBColor(71, 85, 105)
    
    # Top Divider
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_after = Pt(8)
    r_div = p_div.add_run("═" * 56)
    r_div.font.color.rgb = RGBColor(148, 163, 184)
    p_div.alignment = WD_ALIGN_PARAGRAPH.CENTER

    # INTRODUCTION & ARCHITECTURAL PHILOSOPHY
    add_heading_1(doc, "TỔNG QUAN KIẾN TRÚC PHÂN TẦNG (LAYERED ARCHITECTURE)")
    
    add_paragraph(
        doc,
        "Dự án Study Planner được kiến trúc hóa nghiêm ngặt theo mô hình 4 tầng phân lập rõ ràng (Clean Layered Architecture) "
        "thay vì code dồn cục vào các màn hình. Mỗi thư mục và từng file trong cây thư mục đều giữ một trách nhiệm duy nhất (Single Responsibility Principle):",
        space_before=2, space_after=4
    )
    
    # Layer table
    tbl_layers = doc.add_table(rows=5, cols=3)
    tbl_layers.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_layers.autofit = False
    set_table_borders(tbl_layers, "CBD5E1")
    
    l_widths = [Inches(1.8), Inches(2.2), Inches(2.8)]
    headers = ["Phân tầng kiến trúc", "Thư mục tương ứng", "Trách nhiệm & Quy tắc cốt lõi"]
    for j, h in enumerate(headers):
        cell = tbl_layers.rows[0].cells[j]
        cell.width = l_widths[j]
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, 80, 80, 100, 100)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.font.name = "Times New Roman"
        r.font.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)
        
    layer_data = [
        ("1. Presentation Layer\n(Tầng Hiển thị & Điều hướng)", "app/\nsrc/components/ui/\nsrc/components/features/", "Expo Router v3 (file-based routing), Tabs, Modals. Tuân thủ triệt để Luật Zero-Hex và Touch Target >= 44x44pt."),
        ("2. Application & State Layer\n(Tầng Ứng dụng & Trạng thái)", "src/store/\nsrc/hooks/", "Zustand auth store kết hợp SecureStore mã hóa phần cứng. TanStack Query v5 quản lý server state, cache và optimistic updates."),
        ("3. Domain & Logic Layer\n(Tầng Nghiệp vụ & Dữ liệu)", "src/types/\nsrc/utils/", "Chứa các TypeScript Interfaces và hàm toán học/thời gian thuần túy (startOfDay, computeCourseProgress O(N))."),
        ("4. Testing & Infrastructure\n(Tầng Kiểm thử & Vận hành)", "__tests__/\nscripts/\npackage.json", "Jest automated tests đạt 10/10 PASS. Tự động hóa đóng gói phát hành ZIP < 1MB sạch sẽ.")
    ]
    
    for i, row_data in enumerate(layer_data):
        row = tbl_layers.rows[i + 1]
        for j, val in enumerate(row_data):
            cell = row.cells[j]
            cell.width = l_widths[j]
            set_cell_margins(cell, 60, 60, 100, 100)
            set_cell_background(cell, "F8FAFC" if i % 2 == 1 else "FFFFFF")
            p = cell.paragraphs[0]
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(9)
            if j == 0:
                r.font.bold = True
                r.font.color.rgb = RGBColor(30, 58, 138)
            else:
                r.font.color.rgb = RGBColor(30, 41, 59)
                
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(4)
    p_sp.paragraph_format.space_after = Pt(4)

    # ASCII TREE DIAGRAM
    add_heading_1(doc, "SƠ ĐỒ HÌNH CÂY TOÀN BỘ CẤU TRÚC PROJECT (DIRECTORY TREE)")
    
    ascii_tree = (
        "1923050181_1923051154_StudyPlanner/\n"
        "├── app/                            # Expo Router v3 File-based Navigation\n"
        "│   ├── _layout.tsx                 # Root Layout, QueryClient, Notification Listener, Theme\n"
        "│   ├── +not-found.tsx              # 404 Deep link fallback screen\n"
        "│   ├── (auth)/\n"
        "│   │   ├── _layout.tsx             # Unauthenticated Stack Layout\n"
        "│   │   └── sign-in.tsx             # Login form, sample accounts, SecureStore session\n"
        "│   └── (app)/\n"
        "│       ├── _layout.tsx             # Protected Route Guard (redirects if !user)\n"
        "│       ├── (tabs)/\n"
        "│       │   ├── _layout.tsx         # 3-Tab Bar Layout (Home, Schedule, Courses) 44x44pt\n"
        "│       │   ├── index.tsx           # Tab 1: Home Dashboard, Due 48h Widget, Quick Stats\n"
        "│       │   ├── schedule.tsx        # Tab 2: Schedule, Weekly Calendar & List dual view\n"
        "│       │   └── courses.tsx         # Tab 3: Courses Progress % (Computed dynamic), Logout\n"
        "│       ├── assignments/\n"
        "│       │   └── [id].tsx            # Dynamic Route: Detail, Deep Link Banner, Photo preview\n"
        "│       └── modal/\n"
        "│           └── new-assignment.tsx  # Modal: Month Calendar ◀/▶, Stepper ±, Quick Presets\n"
        "├── src/\n"
        "│   ├── constants/\n"
        "│   │   └── tokens.ts               # Design Tokens: Zero-Hex, Semantic Palette, TouchTarget >= 44pt\n"
        "│   ├── components/\n"
        "│   │   ├── ui/                     # Atomic UI Components\n"
        "│   │   │   ├── ThemedText.tsx      # Adaptive typography (auto light/dark)\n"
        "│   │   │   ├── ThemedView.tsx      # Adaptive container view\n"
        "│   │   │   ├── AccessibleButton.tsx# Min 44x44pt touch target button (WCAG 2.1 AA)\n"
        "│   │   │   ├── StateHandler.tsx    # 4-States Handler (Loading, Empty, Error+Retry, Content)\n"
        "│   │   │   └── OfflineBanner.tsx   # Real-time Offline Timestamp Alert Banner\n"
        "│   │   └── features/               # Feature-specific Domain Components\n"
        "│   │       ├── AssignmentCard.tsx  # Color strip, 44x44pt checkbox, strike-through, optimistic\n"
        "│   │       ├── Due48hWidget.tsx    # 48-Hour deadline sliding window widget\n"
        "│   │       └── WeeklyCalendar.tsx  # 7-day strip (Mon-Sun), status dot indicators\n"
        "│   ├── store/\n"
        "│   │   └── authStore.ts            # Zustand Auth Store backed by expo-secure-store\n"
        "│   ├── hooks/\n"
        "│   │   ├── useThemeColor.ts        # Theme hook resolving light/dark color tokens\n"
        "│   │   ├── useAssignments.ts       # TanStack Query CRUD, Optimistic Update, Offline Cache\n"
        "│   │   ├── useCourses.ts           # Courses query hook\n"
        "│   │   └── useNotifications.ts     # Expo notifications scheduling, Deep Link payload\n"
        "│   ├── types/\n"
        "│   │   ├── study.ts                # TypeScript domain models (Assignment, Course, User)\n"
        "│   │   └── testing.d.ts            # TypeScript declarations for Jest test environment\n"
        "│   └── utils/\n"
        "│       ├── dateUtils.ts            # Pure functions: startOfDay timezone, 48h sliding window\n"
        "│       └── statsUtils.ts           # Pure functions: computeCourseProgress O(N) derived math\n"
        "├── __tests__/                      # Automated Unit & Component Tests (10/10 PASS)\n"
        "│   ├── statsUtils.test.ts          # Critical path logic test: Derived course progress %\n"
        "│   ├── dateUtils.test.ts           # Pure logic test: 48h window & startOfDay calendar boundary\n"
        "│   └── AssignmentCard.test.tsx     # Component accessibility test: 44x44pt touch & checkbox toggle\n"
        "├── scripts/                        # Automation & Packaging Scripts\n"
        "│   ├── create_project_zip.py       # Clean submission ZIP packaging (< 1MB)\n"
        "│   ├── generate_reflection_docx.py # One-page reflection Word generator\n"
        "│   └── patch-ws-tunnel.js          # WebSocket tunnel patch script\n"
        "└── Root Configurations & Transparency\n"
        "    ├── README.md                   # Clean-machine setup & running documentation\n"
        "    ├── AI_LOG.md                   # Transparent AI Collaboration Log (Prompt/Accept/Reject)\n"
        "    ├── REFLECTION.md               # One-Page Reflection (Markdown)\n"
        "    ├── OnePage_Reflection.docx     # One-Page Reflection (Word)\n"
        "    ├── package.json                # Project dependencies, scripts, postinstall hook\n"
        "    └── tsconfig.json & jest.config.js # Strict typecheck & test runner configs"
    )
    
    # ASCII box
    tbl_tree = doc.add_table(rows=1, cols=1)
    tbl_tree.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_tree.autofit = False
    c_tree = tbl_tree.rows[0].cells[0]
    c_tree.width = Inches(6.8)
    set_cell_background(c_tree, "0F172A") # Dark background
    set_cell_margins(c_tree, 120, 120, 140, 140)
    p_t = c_tree.paragraphs[0]
    r_t = p_t.add_run(ascii_tree)
    r_t.font.name = "Courier New"
    r_t.font.size = Pt(8.5)
    r_t.font.color.rgb = RGBColor(226, 232, 240)
    
    p_div2 = doc.add_paragraph()
    p_div2.paragraph_format.space_after = Pt(8)

    # NOW RENDER EACH SECTION & ITS FILES
    for sec in SECTIONS:
        add_heading_1(doc, sec["title"])
        add_paragraph(doc, sec["desc"], italic=True, color_rgb=RGBColor(71, 85, 105), space_before=2, space_after=6)
        
        for file_info in sec["files"]:
            add_file_entry(doc, file_info)

    # FINAL SECTION: FAST RESPONSE MATRIX (VIVA CHEAT-SHEET)
    add_heading_1(doc, "MA TRẬN PHẢN ỨNG NHANH CHO BÀN VẤN ĐÁP (VIVA QUICK CHEAT-SHEET)")
    add_paragraph(
        doc,
        "Bảng tra cứu tốc hành: Khi Thầy Nguyễn Xuân Vinh chỉ chuột vào bất kỳ file nào trong danh sách dưới đây, "
        "sinh viên mở ngay dòng code chỉ định và trả lời đúng từ khóa trọng tâm để đạt điểm 10/10:",
        space_before=2, space_after=6
    )
    
    tbl_cheat = doc.add_table(rows=14, cols=4)
    tbl_cheat.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_cheat.autofit = False
    set_table_borders(tbl_cheat, "CBD5E1")
    
    ch_widths = [Inches(1.5), Inches(1.0), Inches(1.8), Inches(2.5)]
    ch_headers = ["File Thầy chỉ vào", "Người trả lời", "Dòng code mở ngay", "Từ khóa trả lời ghi điểm tuyệt đối"]
    
    for j, h in enumerate(ch_headers):
        cell = tbl_cheat.rows[0].cells[j]
        cell.width = ch_widths[j]
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, 80, 80, 80, 80)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.font.name = "Times New Roman"
        r.font.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(255, 255, 255)
        
    cheat_data = [
        ("app/_layout.tsx", "Cả 2", "Dòng 29-42 (QueryClient)\nDòng 50 (Listener)", "'Root Layout không bao giờ bị unmount, bảo toàn cache và đón nhận Deep Link toàn cục.'"),
        ("app/(auth)/sign-in.tsx", "TV2 (Giang)", "Dòng 30-45 (Login action)", "'Token được mã hóa bằng chip phần cứng SecureStore, survive app restart, tuyệt đối không dùng AsyncStorage.'"),
        ("app/(app)/(tabs)/schedule.tsx", "TV1 (Trâm)", "Dòng 40-70 (WeeklyCalendar)", "'Lịch tuần 7 ngày T2-CN theo chuẩn Việt Nam, có chấm tròn đỏ cam báo hiệu ngày có bài tập.'"),
        ("app/(app)/(tabs)/courses.tsx", "TV2 (Giang)", "Dòng 50-80 (computeCourseProgress)", "'Tiến độ là Derived State O(N) tính toán động, không lưu cứng percentage trong DB để tránh Data Inconsistency.'"),
        ("app/(app)/modal/new-assignment.tsx", "TV1 (Trâm)", "Dòng 50-120 (Calendar ◀/▶ & Stepper ±)", "'Dựng lưới lịch tháng trực quan và bộ tăng giảm giờ phút độc quyền, chuẩn 44x44pt và Zero-Hex.'"),
        ("src/constants/tokens.ts", "TV1 (Trâm)", "Dòng 20-55 (ThemeTokens)", "'File DUY NHẤT chứa mã hex trong toàn bộ dự án, Single Source of Truth cho Dark/Light mode.'"),
        ("src/components/ui/AccessibleButton.tsx", "TV1 (Trâm)", "Dòng 25-35 (minHeight: 44)", "'Ép buộc kích thước vùng chạm tối thiểu 44x44pt và accessibilityRole button theo chuẩn WCAG 2.1 AA.'"),
        ("src/components/ui/StateHandler.tsx", "TV2 (Giang)", "Dòng 30-65 (4 states)", "'Xử lý đủ 4 trạng thái: Loading, Empty, Error có nút Thử lại gọi refetch thật sự, và Content.'"),
        ("src/components/ui/OfflineBanner.tsx", "Cả 2", "Dòng 20-40 (cachedTime)", "'Banner hổ phách hiển thị CHÍNH XÁC THỜI GIAN THỰC TẾ (toLocaleTimeString) khi lưu offline.'"),
        ("src/hooks/useAssignments.ts", "TV2 (Giang)", "Dòng 130-180 (onMutate/onError)", "'Cập nhật lạc quan: onMutate lưu snapshot previous -> onError rollback -> onSettled invalidate sync server.'"),
        ("src/utils/dateUtils.ts", "TV2 (Giang)", "Dòng 10-30 (startOfDay)", "'Đưa mốc thời gian về 00:00:00 ngày lịch để so sánh hạn 48 giờ chính xác, không phụ thuộc giờ mở app.'"),
        ("src/utils/statsUtils.ts", "TV2 (Giang)", "Dòng 15-40 (computeCourseProgress)", "'Hàm thuần túy O(N) xử lý an toàn mọi trường hợp biên: danh sách rỗng, chia cho 0 ra 0% thay vì NaN.'"),
        ("__tests__/AssignmentCard.test.tsx", "TV1 (Trâm)", "Dòng 20-45 (expect minHeight)", "'Kiểm thử tự động bằng Jest xác minh nút bấm đạt 44x44pt và click checkbox kích hoạt onToggle.'")
    ]
    
    for i, row_data in enumerate(cheat_data):
        row = tbl_cheat.rows[i + 1]
        for j, val in enumerate(row_data):
            cell = row.cells[j]
            cell.width = ch_widths[j]
            set_cell_margins(cell, 60, 60, 80, 80)
            set_cell_background(cell, "F8FAFC" if i % 2 == 1 else "FFFFFF")
            p = cell.paragraphs[0]
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(8.5)
            if j == 0:
                r.font.bold = True
                r.font.color.rgb = RGBColor(30, 58, 138)
            elif j == 1:
                r.font.bold = True
                r.font.color.rgb = RGBColor(5, 150, 105) if "Trâm" in val else RGBColor(37, 99, 235)
            elif j == 3:
                r.font.italic = True
                r.font.color.rgb = RGBColor(15, 23, 42)
                
    doc.save(output_docx_path)
    print(f"Word document saved to: {output_docx_path}")
    
    # ALSO BUILD COMPREHENSIVE MARKDOWN DOCUMENT
    md_content = build_markdown_document()
    with open(output_md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    print(f"Markdown document saved to: {output_md_path}")

def build_markdown_document():
    lines = []
    lines.append(f"# {PROJECT_METADATA['topic'].upper()}")
    lines.append(f"## HỒ SƠ THUYẾT MINH CHI TIẾT THEO CÂY THƯ MỤC DỰ ÁN (CODEBASE WALKTHROUGH)")
    lines.append("")
    lines.append(f"> **Môn học**: {PROJECT_METADATA['course']}  ")
    lines.append(f"> **Đơn vị đào tạo**: {PROJECT_METADATA['university']}  ")
    lines.append(f"> **Giảng viên hướng dẫn & chấm thi**: **{PROJECT_METADATA['instructor']}**  ")
    lines.append(f"> **Sinh viên thực hiện**:  ")
    lines.append(f"> - **{PROJECT_METADATA['member1']}**  ")
    lines.append(f"> - **{PROJECT_METADATA['member2']}**  ")
    lines.append(f"> **Phiên bản**: {PROJECT_METADATA['version']} | **Kho mã nguồn Git**: [{PROJECT_METADATA['repo']}]({PROJECT_METADATA['repo']})  ")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 1. TỔNG QUAN KIẾN TRÚC PHÂN TẦNG (CLEAN LAYERED ARCHITECTURE)")
    lines.append("")
    lines.append("Dự án được xây dựng dựa trên 4 tầng kiến trúc phân lập nghiêm ngặt theo chuẩn công nghiệp:")
    lines.append("1. **Presentation Layer (`app/`, `src/components/ui/`, `src/components/features/`)**: Quản lý giao diện, màn hình, điều hướng (Expo Router v3). Tuân thủ tuyệt đối **Luật Zero-Hex** và tiêu chuẩn **Touch Target $\\ge 44 \\times 44$ pt**.")
    lines.append("2. **Application & State Layer (`src/store/`, `src/hooks/`)**: Quản lý trạng thái client bằng **Zustand**, bảo mật token bằng chip mã hóa phần cứng **`expo-secure-store`**. Tầng dữ liệu mạng do **TanStack Query v5** phụ trách (Cache, Optimistic Updates, Offline Sync).")
    lines.append("3. **Domain & Core Logic Layer (`src/types/`, `src/utils/`)**: Chứa các TypeScript Interfaces chặt chẽ và hàm tính toán thời gian, tiến độ môn học thuần túy (`startOfDay`, `computeCourseProgress` $O(N)$).")
    lines.append("4. **Testing & Infrastructure Layer (`__tests__/`, `scripts/`, `package.json`)**: Hạ tầng kiểm thử tự động Jest đạt **10/10 PASS**, các script đóng gói ZIP sạch dưới 1MB và tài liệu minh bạch AI.")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 2. SƠ ĐỒ CÂY THƯ MỤC TOÀN BỘ DỰ ÁN")
    lines.append("")
    lines.append("```text")
    lines.append("1923050181_1923051154_StudyPlanner/")
    lines.append("├── app/                            # Expo Router v3 File-based Navigation")
    lines.append("│   ├── _layout.tsx                 # Root Layout, QueryClient, Notification Listener, Theme")
    lines.append("│   ├── +not-found.tsx              # 404 Deep link fallback screen")
    lines.append("│   ├── (auth)/")
    lines.append("│   │   ├── _layout.tsx             # Unauthenticated Stack Layout")
    lines.append("│   │   └── sign-in.tsx             # Login form, sample accounts, SecureStore session")
    lines.append("│   └── (app)/")
    lines.append("│       ├── _layout.tsx             # Protected Route Guard (redirects if !user)")
    lines.append("│       ├── (tabs)/")
    lines.append("│       │   ├── _layout.tsx         # 3-Tab Bar Layout (Home, Schedule, Courses) 44x44pt")
    lines.append("│       │   ├── index.tsx           # Tab 1: Home Dashboard, Due 48h Widget, Quick Stats")
    lines.append("│       │   ├── schedule.tsx        # Tab 2: Schedule, Weekly Calendar & List dual view")
    lines.append("│       │   └── courses.tsx         # Tab 3: Courses Progress % (Computed dynamic), Logout")
    lines.append("│       ├── assignments/")
    lines.append("│       │   └── [id].tsx            # Dynamic Route: Detail, Deep Link Banner, Photo preview")
    lines.append("│       └── modal/")
    lines.append("│           └── new-assignment.tsx  # Modal: Month Calendar ◀/▶, Stepper ±, Quick Presets")
    lines.append("├── src/")
    lines.append("│   ├── constants/")
    lines.append("│   │   └── tokens.ts               # Design Tokens: Zero-Hex, Semantic Palette, TouchTarget >= 44pt")
    lines.append("│   ├── components/")
    lines.append("│   │   ├── ui/                     # Atomic UI Components")
    lines.append("│   │   │   ├── ThemedText.tsx      # Adaptive typography (auto light/dark)")
    lines.append("│   │   │   ├── ThemedView.tsx      # Adaptive container view")
    lines.append("│   │   │   ├── AccessibleButton.tsx# Min 44x44pt touch target button (WCAG 2.1 AA)")
    lines.append("│   │   │   ├── StateHandler.tsx    # 4-States Handler (Loading, Empty, Error+Retry, Content)")
    lines.append("│   │   └── OfflineBanner.tsx   # Real-time Offline Timestamp Alert Banner")
    lines.append("│   │   └── features/               # Feature-specific Domain Components")
    lines.append("│   │       ├── AssignmentCard.tsx  # Color strip, 44x44pt checkbox, strike-through, optimistic")
    lines.append("│   │       ├── Due48hWidget.tsx    # 48-Hour deadline sliding window widget")
    lines.append("│   │       └── WeeklyCalendar.tsx  # 7-day strip (Mon-Sun), status dot indicators")
    lines.append("│   ├── store/")
    lines.append("│   │   └── authStore.ts            # Zustand Auth Store backed by expo-secure-store")
    lines.append("│   ├── hooks/")
    lines.append("│   │   ├── useThemeColor.ts        # Theme hook resolving light/dark color tokens")
    lines.append("│   │   ├── useAssignments.ts       # TanStack Query CRUD, Optimistic Update, Offline Cache")
    lines.append("│   │   ├── useCourses.ts           # Courses query hook")
    lines.append("│   │   └── useNotifications.ts     # Expo notifications scheduling, Deep Link payload")
    lines.append("│   ├── types/")
    lines.append("│   │   ├── study.ts                # TypeScript domain models (Assignment, Course, User)")
    lines.append("│   │   └── testing.d.ts            # TypeScript declarations for Jest test environment")
    lines.append("│   └── utils/")
    lines.append("│       ├── dateUtils.ts            # Pure functions: startOfDay timezone, 48h sliding window")
    lines.append("│       └── statsUtils.ts           # Pure functions: computeCourseProgress O(N) derived math")
    lines.append("├── __tests__/                      # Automated Unit & Component Tests (10/10 PASS)")
    lines.append("│   ├── statsUtils.test.ts          # Critical path logic test: Derived course progress %")
    lines.append("│   ├── dateUtils.test.ts           # Pure logic test: 48h window & startOfDay calendar boundary")
    lines.append("│   └── AssignmentCard.test.tsx     # Component accessibility test: 44x44pt touch & checkbox toggle")
    lines.append("├── scripts/                        # Automation & Packaging Scripts")
    lines.append("│   ├── create_project_zip.py       # Clean submission ZIP packaging (< 1MB)")
    lines.append("│   ├── generate_reflection_docx.py # One-page reflection Word generator")
    lines.append("│   └── patch-ws-tunnel.js          # WebSocket tunnel patch script")
    lines.append("└── Root Configurations & Transparency")
    lines.append("    ├── README.md                   # Clean-machine setup & running documentation")
    lines.append("    ├── AI_LOG.md                   # Transparent AI Collaboration Log (Prompt/Accept/Reject)")
    lines.append("    ├── REFLECTION.md               # One-Page Reflection (Markdown)")
    lines.append("    ├── OnePage_Reflection.docx     # One-Page Reflection (Word)")
    lines.append("    ├── package.json                # Project dependencies, scripts, postinstall hook")
    lines.append("    └── tsconfig.json & jest.config.js # Strict typecheck & test runner configs")
    lines.append("```")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 3. THUYẾT MINH CHI TIẾT TỪNG FILE THEO CÂY THƯ MỤC")
    lines.append("")
    
    for sec in SECTIONS:
        lines.append(f"### {sec['title']}")
        lines.append(f"*{sec['desc']}*")
        lines.append("")
        for f in sec['files']:
            lines.append(f"#### 📄 `{f['path']}` — {f['name']}")
            lines.append(f"- **Phân tầng kiến trúc**: {f['layer']}")
            lines.append(f"- **Thành viên phụ trách**: **{f['owner']}**")
            lines.append(f"- **Tiêu chí đồ án đáp ứng**: {f['requirement']}")
            lines.append(f"- **Mục đích cốt lõi**: {f['purpose']}")
            lines.append("")
            lines.append("##### 🔍 Điểm Nhấn Kỹ Thuật & Logic Trong File:")
            for sym, desc in f.get('key_code', []):
                lines.append(f"- **`[{sym}]`**: {desc}")
            lines.append("")
            if f.get('presentation_speech'):
                lines.append("> **🗣️ Lời thoại thuyết trình mẫu khi chiếu file này:**")
                lines.append(f"> *\"{f['presentation_speech']}\"*")
                lines.append("")
            if f.get('viva_trap'):
                trap = f['viva_trap']
                lines.append("> **🎯 Bẫy vấn đáp của Thầy Vinh & Cách trả lời đạt điểm 10:**")
                lines.append(f"> - **Thầy hỏi**: *\"{trap['question']}\"*")
                lines.append(f"> - **Sinh viên trả lời**: *\"{trap['answer']}\"*")
                lines.append("")
            lines.append("---")
            lines.append("")

    lines.append("## 4. MA TRẬN PHẢN ỨNG NHANH CHO BÀN VẤN ĐÁP (VIVA QUICK CHEAT-SHEET)")
    lines.append("")
    lines.append("| File Thầy chỉ vào | Người trả lời | Dòng code mở ngay | Từ khóa trả lời ghi điểm tuyệt đối |")
    lines.append("| :--- | :---: | :--- | :--- |")
    lines.append("| `app/_layout.tsx` | Cả 2 | Dòng 29-42 (QueryClient)<br>Dòng 50 (Listener) | *Root Layout không bao giờ bị unmount, bảo toàn cache và đón nhận Deep Link toàn cục.* |")
    lines.append("| `app/(auth)/sign-in.tsx` | TV2 (Giang) | Dòng 30-45 (Login action) | *Token được mã hóa bằng chip phần cứng SecureStore, survive app restart, tuyệt đối không dùng AsyncStorage.* |")
    lines.append("| `app/(app)/(tabs)/schedule.tsx` | TV1 (Trâm) | Dòng 40-70 (WeeklyCalendar) | *Lịch tuần 7 ngày T2-CN theo chuẩn Việt Nam, có chấm tròn đỏ cam báo hiệu ngày có bài tập.* |")
    lines.append("| `app/(app)/(tabs)/courses.tsx` | TV2 (Giang) | Dòng 50-80 (computeCourseProgress) | *Tiến độ là Derived State O(N) tính toán động, không lưu cứng percentage trong DB để tránh Data Inconsistency.* |")
    lines.append("| `app/(app)/modal/new-assignment.tsx` | TV1 (Trâm) | Dòng 50-120 (Calendar ◀/▶ & Stepper ±) | *Dựng lưới lịch tháng trực quan và bộ tăng giảm giờ phút độc quyền, chuẩn 44x44pt và Zero-Hex.* |")
    lines.append("| `src/constants/tokens.ts` | TV1 (Trâm) | Dòng 20-55 (ThemeTokens) | *File DUY NHẤT chứa mã hex trong toàn bộ dự án, Single Source of Truth cho Dark/Light mode.* |")
    lines.append("| `src/components/ui/AccessibleButton.tsx` | TV1 (Trâm) | Dòng 25-35 (minHeight: 44) | *Ép buộc kích thước vùng chạm tối thiểu 44x44pt và accessibilityRole button theo chuẩn WCAG 2.1 AA.* |")
    lines.append("| `src/components/ui/StateHandler.tsx` | TV2 (Giang) | Dòng 30-65 (4 states) | *Xử lý đủ 4 trạng thái: Loading, Empty, Error có nút Thử lại gọi refetch thật sự, và Content.* |")
    lines.append("| `src/components/ui/OfflineBanner.tsx` | Cả 2 | Dòng 20-40 (cachedTime) | *Banner hổ phách hiển thị CHÍNH XÁC THỜI GIAN THỰC TẾ (toLocaleTimeString) khi lưu offline.* |")
    lines.append("| `src/hooks/useAssignments.ts` | TV2 (Giang) | Dòng 130-180 (onMutate/onError) | *Cập nhật lạc quan: onMutate lưu snapshot previous -> onError rollback -> onSettled invalidate sync server.* |")
    lines.append("| `src/utils/dateUtils.ts` | TV2 (Giang) | Dòng 10-30 (startOfDay) | *Đưa mốc thời gian về 00:00:00 ngày lịch để so sánh hạn 48 giờ chính xác, không phụ thuộc giờ mở app.* |")
    lines.append("| `src/utils/statsUtils.ts` | TV2 (Giang) | Dòng 15-40 (computeCourseProgress) | *Hàm thuần túy O(N) xử lý an toàn mọi trường hợp biên: danh sách rỗng, chia cho 0 ra 0% thay vì NaN.* |")
    lines.append("| `__tests__/AssignmentCard.test.tsx` | TV1 (Trâm) | Dòng 20-45 (expect minHeight) | *Kiểm thử tự động bằng Jest xác minh nút bấm đạt 44x44pt và click checkbox kích hoạt onToggle.* |")
    lines.append("")
    lines.append("---")
    lines.append("*Hồ sơ được biên soạn phục vụ buổi bảo vệ Đồ án Mobile Final Project — DNTU 2026.*")
    return "\n".join(lines)

if __name__ == "__main__":
    base_dir = r"c:\CaNhan\LapTrinhMobile\1923050181_1923051154_StudyPlanner"
    output_docx = os.path.join(base_dir, "Thuyet_Trinh_Cay_Thu_Muc_Project.docx")
    output_md = os.path.join(base_dir, "THUYET_MINH_CAY_THU_MUC.md")
    
    build_walkthrough_document(output_docx, output_md)
    
    # Also copy docx to parent folder for quick access
    parent_docx = r"c:\CaNhan\LapTrinhMobile\Thuyet_Trinh_Cay_Thu_Muc_Project.docx"
    try:
        shutil.copyfile(output_docx, parent_docx)
        print(f"Copied to parent directory: {parent_docx}")
    except Exception as e:
        print(f"Notice on copy to parent: {e}")
