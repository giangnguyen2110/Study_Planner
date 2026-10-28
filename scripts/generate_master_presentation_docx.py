# -*- coding: utf-8 -*-
"""
Master Document Generator:
Consolidates EVERYTHING into ONE single comprehensive Word document (.docx)
and Markdown document (.md) for the Study Planner final project defense.
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

from codebase_data import PROJECT_METADATA, SECTIONS
from architecture_deepdive_data import ARCHITECTURAL_ISSUES

DEMO_INTERACTION_POINTS = [
    {
        "num": 1,
        "title": "Màn hình Đăng nhập & Quản lý Phiên (Auth Session)",
        "action": "Bấm nút '⚡ Đăng nhập nhanh (Tài khoản SV)' để vào Trang chủ ngay lập tức (không cần gõ phím).",
        "ui_file": "app/(auth)/sign-in.tsx",
        "logic_file": "src/store/authStore.ts",
        "key_points": "Token được mã hóa phần cứng qua SecureStore (Keychain/Keystore), có cơ chế Survive App Restart."
    },
    {
        "num": 2,
        "title": "Widget Khẩn Cấp 48 Giờ (48-Hour Deadline Widget)",
        "action": "Tại Trang chủ (Tab 1), chỉ tay vào khối Banner trên cùng có huy hiệu 'GẤP' màu đỏ cam.",
        "ui_file": "app/(app)/(tabs)/index.tsx",
        "logic_file": "src/components/features/Due48hWidget.tsx\nsrc/utils/dateUtils.ts",
        "key_points": "Thuật toán cửa sổ trượt 48h dựa trên hàm startOfDay đưa về 00:00:00 ngày lịch địa phương, không bị lỗi múi giờ."
    },
    {
        "num": 3,
        "title": "Cập Nhật Lạc Quan (Optimistic Update) & Checkbox >= 44x44pt",
        "action": "Chạm vào ô checkbox tròn của bài tập: giao diện đổi trạng thái tức thì (0ms, chữ gạch ngang).",
        "ui_file": "src/components/features/AssignmentCard.tsx",
        "logic_file": "src/hooks/useAssignments.ts (hàm useToggleAssignment)",
        "key_points": "onMutate lưu snapshot cache cũ -> onError tự động rollback nếu mạng lỗi -> onSettled đồng bộ server."
    },
    {
        "num": 4,
        "title": "Lịch Học Tuần (Weekly Calendar T2 đến CN) & Chấm Tròn Trạng Thái",
        "action": "Chuyển sang Tab 2 (Lịch học): Bấm vào các ngày trong dải lịch 7 ngày T2-CN có chấm đỏ cam.",
        "ui_file": "app/(app)/(tabs)/schedule.tsx",
        "logic_file": "src/components/features/WeeklyCalendar.tsx",
        "key_points": "Dải lịch tuần theo văn hóa Việt Nam (Thứ 2 đến Chủ Nhật), chấm tròn hiển thị nếu ngày đó có bài tập."
    },
    {
        "num": 5,
        "title": "Modal Tạo Bài Mới (Lịch Tháng ◀/▶, Chỉnh Giờ/Phút ±, Presets 23:59/17:00, Ảnh)",
        "action": "Bấm nút dấu cộng '+' màu xanh: Chuyển tháng ◀/▶, chỉnh giờ phút bằng nút ±, bấm phím tắt 23:59, đính kèm ảnh.",
        "ui_file": "app/(app)/modal/new-assignment.tsx",
        "logic_file": "src/hooks/useAssignments.ts (hàm useCreateAssignment)",
        "key_points": "Tự dựng lịch tháng và stepper giờ phút để kiểm soát 100% chuẩn 44x44pt và Luật Zero-Hex trên mọi máy."
    },
    {
        "num": 6,
        "title": "Nhắc Nhở Deadline & Deep Linking (Bấm Thông Báo Nhảy Vào Bài Tập)",
        "action": "Mở chi tiết bài tập -> Bấm '🔔 Bật Nhắc Nhở Deadline' -> Sau 2s chạm vào thông báo -> App nhảy vào chi tiết kèm Banner.",
        "ui_file": "app/(app)/assignments/[id].tsx",
        "logic_file": "src/hooks/useNotifications.ts (triggerImmediateDemoNotification)\napp/_layout.tsx (useNotificationListener)",
        "key_points": "Payload notification chứa { data: { assignmentId } }, Root Layout điều hướng Deep Link kèm banner xác nhận."
    },
    {
        "num": 7,
        "title": "Chế Độ Ngoại Tuyến (Offline Tolerance) & Banner Mốc Thời Gian Thực",
        "action": "Tắt Wi-Fi / bật Offline: Banner hổ phách hiện trên đầu trang chủ kèm mốc giờ thực 'Lưu cục bộ lúc HH:MM:SS'.",
        "ui_file": "src/components/ui/OfflineBanner.tsx",
        "logic_file": "src/hooks/useAssignments.ts (useNetworkStore & AsyncStorage)",
        "key_points": "Mốc thời gian lấy bằng new Date().toLocaleTimeString('vi-VN') theo thời gian thực tế, dữ liệu lưu AsyncStorage."
    },
    {
        "num": 8,
        "title": "Tiến Độ Môn Học (%) - Derived State & Đăng Xuất",
        "action": "Chuyển sang Tab 3 (Tiến độ): Xem thanh % đổi màu (cam <50%, xanh >80%) và bấm nút Đăng Xuất.",
        "ui_file": "app/(app)/(tabs)/courses.tsx",
        "logic_file": "src/utils/statsUtils.ts (computeCourseProgress O(N))\nsrc/store/authStore.ts (signOut)",
        "key_points": "Tiến độ % là Derived State tính toán động, KHÔNG lưu cứng trong DB để triệt tiêu Data Inconsistency."
    },
    {
        "num": 9,
        "title": "Đổi Giao Diện Sáng / Tối (Dark / Light Mode) & Luật Zero-Hex",
        "action": "Tại Tab 3, bấm các nút '🌙 Tối', '☀️ Sáng', '⚙️ Hệ thống' để thấy toàn bộ giao diện đổi màu mượt mà.",
        "ui_file": "app/(app)/(tabs)/courses.tsx",
        "logic_file": "src/constants/tokens.ts (ThemeTokens)\nsrc/hooks/useThemeColor.ts",
        "key_points": "File tokens.ts là nơi DUY NHẤT chứa mã hex. Toàn bộ UI dùng Semantic Tokens tự động đổi màu."
    },
    {
        "num": 10,
        "title": "Chạy Kiểm Thử Tự Động Jest (10/10 PASS) Cho Thầy Xem",
        "action": "Mở Terminal gõ lệnh: npm test -> Kết quả xanh lá 10/10 PASS trên cả 3 test suites.",
        "ui_file": "Terminal Command Line: npm test",
        "logic_file": "__tests__/statsUtils.test.ts\n__tests__/dateUtils.test.ts\n__tests__/AssignmentCard.test.tsx",
        "key_points": "Bao phủ đầy đủ Unit Test logic toán học, ranh giới múi giờ startOfDay và Component Test vùng chạm 44x44pt."
    }
]

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

def build_master_document(output_docx_path, output_md_path):
    doc = docx.Document()
    
    # Page setup
    for section in doc.sections:
        section.top_margin = Inches(0.7)
        section.bottom_margin = Inches(0.7)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
    # COVER BLOCK
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
    r_title = p_title.add_run("TÀI LIỆU TOÀN DIỆN THUYẾT MINH, DEMO & VẤN ĐÁP BẢO VỆ ĐỒ ÁN\n(MASTER SPECIFICATION: DEMO GUIDE, ARCHITECTURE & CODEBASE WALKTHROUGH)")
    r_title.font.name = "Times New Roman"
    r_title.font.size = Pt(14)
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
    
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_after = Pt(8)
    r_div = p_div.add_run("═" * 56)
    r_div.font.color.rgb = RGBColor(148, 163, 184)
    p_div.alignment = WD_ALIGN_PARAGRAPH.CENTER

    # =========================================================================
    # PHẦN 1: HƯỚNG DẪN DEMO THỰC TẾ & BẢN ĐỒ TƯƠNG TÁC
    # =========================================================================
    add_heading_1(doc, "PHẦN 1: HƯỚNG DẪN DEMO THỰC TẾ & BẢN ĐỒ TƯƠNG TÁC")
    add_paragraph(
        doc,
        "Phần này cung cấp toàn bộ thông tin tài khoản đăng nhập mẫu, các điểm chạm tương tác "
        "và kịch bản 6 bước thao tác thần tốc 'bấm đâu trúng đó' phục vụ buổi demo trực tiếp trước Thầy Vinh.",
        space_before=2, space_after=4
    )

    # 1.1 Bảng tài khoản
    add_heading_2(doc, "1.1 Bảng Tài Khoản & Mật Khẩu Đăng Nhập Demo")
    
    tbl_acc = doc.add_table(rows=3, cols=3)
    tbl_acc.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_acc.autofit = False
    set_table_borders(tbl_acc, "CBD5E1")
    
    acc_widths = [Inches(2.0), Inches(2.2), Inches(2.6)]
    acc_headers = ["Phương thức đăng nhập", "Thông tin nhập / Thao tác", "File giao diện & Nơi lưu trữ"]
    for j, h in enumerate(acc_headers):
        c = tbl_acc.rows[0].cells[j]
        c.width = acc_widths[j]
        set_cell_background(c, "1E3A8A")
        set_cell_margins(c, 70, 70, 80, 80)
        p = c.paragraphs[0]; r = p.add_run(h)
        r.font.name = "Times New Roman"; r.font.bold = True; r.font.size = Pt(9); r.font.color.rgb = RGBColor(255, 255, 255)
        
    acc_rows = [
        ("Nút bấm 1-Click Demo\n(Khuyên dùng)", "Bấm nút: '⚡ Đăng nhập nhanh (Tài khoản SV)'\n-> Tự động nạp session sinh viên mẫu", "app/(auth)/sign-in.tsx (Dòng 83-100)\nLưu token vào expo-secure-store"),
        ("Tài khoản nhập tay\n(Tự gõ phím)", "Email: 1923051154@dntu.edu.vn (hoặc bất kỳ)\nMật khẩu: 123456 (hoặc bất kỳ)", "app/(auth)/sign-in.tsx (Dòng 125-162)\nLưu token vào expo-secure-store")
    ]
    for i, (col0, col1, col2) in enumerate(acc_rows):
        row = tbl_acc.rows[i + 1]
        for j, val in enumerate([col0, col1, col2]):
            c = row.cells[j]; c.width = acc_widths[j]
            set_cell_margins(c, 50, 50, 80, 80)
            set_cell_background(c, "F8FAFC" if i % 2 == 1 else "FFFFFF")
            p = c.paragraphs[0]; r = p.add_run(val)
            r.font.name = "Times New Roman"; r.font.size = Pt(8.5)
            if j == 0:
                r.font.bold = True; r.font.color.rgb = RGBColor(30, 58, 138)

    p_sp1 = doc.add_paragraph(); p_sp1.paragraph_format.space_before = Pt(4); p_sp1.paragraph_format.space_after = Pt(4)

    # 1.2 Bản đồ 10 điểm tương tác demo
    add_heading_2(doc, "1.2 Bản Đồ 10 Điểm Tương Tác Demo Trực Tiếp Trên App")
    
    tbl_demo = doc.add_table(rows=len(DEMO_INTERACTION_POINTS) + 1, cols=4)
    tbl_demo.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_demo.autofit = False
    set_table_borders(tbl_demo, "CBD5E1")
    
    d_widths = [Inches(0.5), Inches(2.1), Inches(2.2), Inches(2.0)]
    d_headers = ["STT", "Tính năng tương tác Demo", "Thao tác thực tế trên màn hình", "File giao diện & File logic"]
    for j, h in enumerate(d_headers):
        c = tbl_demo.rows[0].cells[j]; c.width = d_widths[j]
        set_cell_background(c, "1E3A8A"); set_cell_margins(c, 70, 70, 80, 80)
        p = c.paragraphs[0]; r = p.add_run(h)
        r.font.name = "Times New Roman"; r.font.bold = True; r.font.size = Pt(9); r.font.color.rgb = RGBColor(255, 255, 255)
        
    for i, pt in enumerate(DEMO_INTERACTION_POINTS):
        row = tbl_demo.rows[i + 1]
        c0, c1, c2, c3 = row.cells[0], row.cells[1], row.cells[2], row.cells[3]
        c0.width, c1.width, c2.width, c3.width = d_widths[0], d_widths[1], d_widths[2], d_widths[3]
        for c in [c0, c1, c2, c3]:
            set_cell_margins(c, 50, 50, 80, 80)
            set_cell_background(c, "F8FAFC" if i % 2 == 1 else "FFFFFF")
            
        r0 = c0.paragraphs[0].add_run(f"{pt['num']:02d}")
        r0.font.name = "Times New Roman"; r0.font.size = Pt(8.5); r0.font.bold = True
        
        r1 = c1.paragraphs[0].add_run(pt['title'])
        r1.font.name = "Times New Roman"; r1.font.size = Pt(8.5); r1.font.bold = True
        r1.font.color.rgb = RGBColor(30, 58, 138)
        
        r2 = c2.paragraphs[0].add_run(pt['action'])
        r2.font.name = "Times New Roman"; r2.font.size = Pt(8.5)
        
        r3 = c3.paragraphs[0].add_run(f"UI: {pt['ui_file']}\nLogic: {pt['logic_file']}")
        r3.font.name = "Times New Roman"; r3.font.size = Pt(8.0); r3.font.color.rgb = RGBColor(71, 85, 105)

    p_sp2 = doc.add_paragraph(); p_sp2.paragraph_format.space_before = Pt(4); p_sp2.paragraph_format.space_after = Pt(4)

    # 1.3 Kịch bản 6 bước thần tốc
    add_heading_2(doc, "1.3 Kịch Bản Thao Tác Nhanh 6 Bước 'Bấm Đâu Trúng Đó'")
    
    script_steps = [
        ("Bước 1: Đăng nhập", "Mở app -> Bấm nút '⚡ Đăng nhập nhanh' -> Vào Trang chủ ngay lập tức trong 1 giây."),
        ("Bước 2: Trang chủ & 48h & Checkbox", "Chỉ Thầy thấy Widget 48h trên cùng -> Bấm tick thử vào một bài tập để Thầy thấy Cập nhật lạc quan (0ms, chữ gạch ngang)."),
        ("Bước 3: Lịch học tuần", "Chuyển sang Tab 2 (Lịch học) -> Bấm thử Thứ 2, Thứ 3 xem các chấm đỏ cam lọc bài tập -> Bấm nút chuyển sang Danh sách."),
        ("Bước 4: Tạo bài tập & Ảnh", "Bấm nút '+' -> Bấm ◀ / ▶ trên cuốn lịch tháng, bấm nút + / - chỉnh giờ phút, bấm phím tắt 23:59, đính kèm 1 ảnh -> Bấm 'Lưu bài tập'."),
        ("Bước 5: Deep Linking đỉnh cao", "Bấm vào bài tập vừa tạo -> Bấm '🔔 Bật Nhắc Nhở Deadline' -> Bấm 'Về Trang Chủ để chờ' -> Sau đúng 2 giây thông báo nổ ra -> Chạm vào thông báo -> App nhảy vèo vào chi tiết kèm Banner '🎯 DEEP LINKING THÀNH CÔNG!'."),
        ("Bước 6: Tiến độ môn & Dark Mode", "Sang Tab 3 (Tiến độ) -> Giải thích tiến độ % là Derived State O(N) không lưu trong DB -> Bấm nút '🌙 Tối' (Dark Mode đổi tức thì theo Luật Zero-Hex) -> Bấm 'Đăng xuất' hoàn tất bài thi!")
    ]
    
    for s_title, s_desc in script_steps:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(1); p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.left_indent = Inches(0.2)
        r_b = p.add_run("• "); r_b.font.bold = True; r_b.font.color.rgb = RGBColor(5, 150, 105)
        r_t = p.add_run(f"[{s_title}]: "); r_t.font.name = "Times New Roman"; r_t.font.bold = True; r_t.font.size = Pt(9.5); r_t.font.color.rgb = RGBColor(30, 58, 138)
        r_d = p.add_run(s_desc); r_d.font.name = "Times New Roman"; r_d.font.size = Pt(9.5); r_d.font.color.rgb = RGBColor(51, 65, 85)

    p_div_sec1 = doc.add_paragraph(); p_div_sec1.paragraph_format.space_before = Pt(4); p_div_sec1.paragraph_format.space_after = Pt(8)
    r_d1 = p_div_sec1.add_run("═" * 56); r_d1.font.color.rgb = RGBColor(148, 163, 184); p_div_sec1.alignment = WD_ALIGN_PARAGRAPH.CENTER

    # =========================================================================
    # PHẦN 2: CHUYÊN ĐỀ 12 VẤN ĐỀ KIẾN TRÚC & LƯU TRỮ DỮ LIỆU CỐT LÕI
    # =========================================================================
    add_heading_1(doc, "PHẦN 2: CHUYÊN ĐỀ 12 VẤN ĐỀ KIẾN TRÚC & LƯU TRỮ DỮ LIỆU CỐT LÕI")
    add_paragraph(
        doc,
        "Phần này phân tích sâu 12 câu hỏi hóc búa nhất về kiến trúc hệ thống, vòng đời dữ liệu, "
        "bảo mật phần cứng và các bẫy phản biện của Giảng viên Nguyễn Xuân Vinh:",
        space_before=2, space_after=4
    )

    for issue in ARCHITECTURAL_ISSUES:
        add_heading_2(doc, f"VẤN ĐỀ {issue['num']:02d}: {issue['title']}")
        
        # Meta table
        tbl = doc.add_table(rows=3, cols=2)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER; tbl.autofit = False; set_table_borders(tbl, "E2E8F0")
        col_widths = [Inches(1.8), Inches(5.0)]
        meta_rows = [
            ("Lĩnh vực chuyên sâu:", issue['category']),
            ("Thành viên phụ trách:", issue['owner']),
            ("Tiêu chuẩn đồ án đáp ứng:", issue['requirement'])
        ]
        for i, (k, v) in enumerate(meta_rows):
            row = tbl.rows[i]; c0, c1 = row.cells[0], row.cells[1]
            c0.width, c1.width = col_widths[0], col_widths[1]
            set_cell_margins(c0, 50, 50, 100, 100); set_cell_margins(c1, 50, 50, 100, 100)
            set_cell_background(c0, "F1F5F9"); set_cell_background(c1, "FFFFFF" if i % 2 == 0 else "F8FAFC")
            p0 = c0.paragraphs[0]; r0 = p0.add_run(k); r0.font.name = "Times New Roman"; r0.font.bold = True; r0.font.size = Pt(8.5); r0.font.color.rgb = RGBColor(71, 85, 105)
            p1 = c1.paragraphs[0]; r1 = p1.add_run(v); r1.font.name = "Times New Roman"; r1.font.size = Pt(8.5); r1.font.color.rgb = RGBColor(15, 23, 42)
            if "TV1" in v or "Trâm" in v: r1.font.bold = True
            elif "TV2" in v or "Giang" in v: r1.font.bold = True
            
        p_sp = doc.add_paragraph(); p_sp.paragraph_format.space_before = Pt(2); p_sp.paragraph_format.space_after = Pt(2)

        add_heading_3(doc, "1. Vấn Đề Đặt Ra & Nguy Cơ Tiềm Ẩn:")
        add_paragraph(doc, issue['problem_statement'], space_before=1, space_after=2)

        add_heading_3(doc, "2. Dữ Liệu Được Lưu Ở Đâu & Công Nghệ Áp Dụng:")
        add_paragraph(doc, issue['storage_location'], space_before=1, space_after=2, color_rgb=RGBColor(30, 58, 138))

        add_heading_3(doc, "3. Phản Biện Giải Pháp & Tại Sao Không Chọn Công Nghệ Khác:")
        add_paragraph(doc, issue['why_not_alternative'], space_before=1, space_after=2, color_rgb=RGBColor(51, 65, 85))

        if issue.get('technical_mechanism'):
            add_heading_3(doc, "4. Cơ Chế Hoạt Động & Điểm Nhấn Mã Nguồn:")
            for sym_name, sym_desc in issue['technical_mechanism']:
                p_sym = doc.add_paragraph()
                p_sym.paragraph_format.space_before = Pt(1); p_sym.paragraph_format.space_after = Pt(1); p_sym.paragraph_format.left_indent = Inches(0.2)
                r_bullet = p_sym.add_run("• "); r_bullet.font.bold = True; r_bullet.font.color.rgb = RGBColor(37, 99, 235)
                r_sym = p_sym.add_run(f"[{sym_name}]: "); r_sym.font.name = "Times New Roman"; r_sym.font.bold = True; r_sym.font.size = Pt(9); r_sym.font.color.rgb = RGBColor(30, 58, 138)
                r_desc = p_sym.add_run(sym_desc); r_desc.font.name = "Times New Roman"; r_desc.font.size = Pt(9); r_desc.font.color.rgb = RGBColor(51, 65, 85)

        if issue.get('speech'):
            create_callout_box(
                doc,
                [
                    ("🗣️ LỜI THOẠI THUYẾT TRÌNH MẪU KHI TRÌNH BÀY VẤN ĐỀ NÀY:\n", True, False, RGBColor(5, 150, 105), 9.5),
                    (f'"{issue["speech"]}"', False, True, RGBColor(15, 23, 42), 9)
                ],
                border_color="059669", bg_color="F0FDF4"
            )

        if issue.get('viva_qna'):
            trap = issue['viva_qna']
            create_callout_box(
                doc,
                [
                    ("🎯 BẪY VẤN ĐÁP CỦA THẦY NGUYỄN XUÂN VINH & CÁCH TRẢ LỜI ĐẠT ĐIỂM 10:\n", True, False, RGBColor(180, 83, 9), 9.5),
                    ("❓ Thầy hỏi: ", True, False, RGBColor(180, 83, 9), 9),
                    (f'"{trap["question"]}"\n', True, True, RGBColor(180, 83, 9), 9),
                    ("💡 Trả lời tự tin: ", True, False, RGBColor(30, 58, 138), 9),
                    (f'"{trap["answer"]}"', False, False, RGBColor(15, 23, 42), 9)
                ],
                border_color="D97706", bg_color="FFFBEB"
            )
        
        p_div_sub = doc.add_paragraph(); p_div_sub.paragraph_format.space_before = Pt(3); p_div_sub.paragraph_format.space_after = Pt(4)
        r_div_s = p_div_sub.add_run("· " * 42); r_div_s.font.color.rgb = RGBColor(203, 213, 225); p_div_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER

    # =========================================================================
    # PHẦN 3: HỒ SƠ THUYẾT MINH CHI TIẾT THEO CÂY THƯ MỤC DỰ ÁN
    # =========================================================================
    add_heading_1(doc, "PHẦN 3: HỒ SƠ THUYẾT MINH CHI TIẾT THEO CÂY THƯ MỤC DỰ ÁN")
    add_paragraph(
        doc,
        "Duyệt qua từng file trong toàn bộ cây thư mục mã nguồn: Phân tầng kiến trúc, Người phụ trách, "
        "Tiêu chuẩn đồ án đáp ứng, Điểm nhấn code, Lời thoại thuyết trình và Câu hỏi bẫy phản biện tương ứng.",
        space_before=2, space_after=4
    )

    for sec in SECTIONS:
        add_heading_2(doc, sec["title"])
        add_paragraph(doc, sec["desc"], italic=True, color_rgb=RGBColor(71, 85, 105), space_before=1, space_after=4)
        
        for file_info in sec["files"]:
            add_heading_3(doc, f"📄 {file_info['path']} — {file_info['name']}")
            
            # File Meta
            tbl = doc.add_table(rows=4, cols=2)
            tbl.alignment = WD_TABLE_ALIGNMENT.CENTER; tbl.autofit = False; set_table_borders(tbl, "E2E8F0")
            col_widths = [Inches(1.8), Inches(5.0)]
            meta_rows = [
                ("Phân tầng kiến trúc:", file_info['layer']),
                ("Thành viên phụ trách:", file_info['owner']),
                ("Tiêu chí đồ án đáp ứng:", file_info['requirement']),
                ("Mục đích cốt lõi:", file_info['purpose'])
            ]
            for i, (k, v) in enumerate(meta_rows):
                row = tbl.rows[i]; c0, c1 = row.cells[0], row.cells[1]
                c0.width, c1.width = col_widths[0], col_widths[1]
                set_cell_margins(c0, 45, 45, 100, 100); set_cell_margins(c1, 45, 45, 100, 100)
                set_cell_background(c0, "F1F5F9"); set_cell_background(c1, "FFFFFF" if i % 2 == 0 else "F8FAFC")
                p0 = c0.paragraphs[0]; r0 = p0.add_run(k); r0.font.name = "Times New Roman"; r0.font.bold = True; r0.font.size = Pt(8.5); r0.font.color.rgb = RGBColor(71, 85, 105)
                p1 = c1.paragraphs[0]; r1 = p1.add_run(v); r1.font.name = "Times New Roman"; r1.font.size = Pt(8.5); r1.font.color.rgb = RGBColor(15, 23, 42)
                if "TV1" in v or "Trâm" in v: r1.font.bold = True
                elif "TV2" in v or "Giang" in v: r1.font.bold = True

            p_sp_f = doc.add_paragraph(); p_sp_f.paragraph_format.space_before = Pt(2); p_sp_f.paragraph_format.space_after = Pt(2)

            if file_info.get('key_code'):
                p_c_title = doc.add_paragraph()
                p_c_title.paragraph_format.space_before = Pt(2); p_c_title.paragraph_format.space_after = Pt(2)
                r_ct = p_c_title.add_run("Điểm Nhấn Kỹ Thuật & Logic Trong File:"); r_ct.font.bold = True; r_ct.font.size = Pt(9.5); r_ct.font.color.rgb = RGBColor(30, 58, 138)
                
                for sym_name, sym_desc in file_info['key_code']:
                    p_sym = doc.add_paragraph()
                    p_sym.paragraph_format.space_before = Pt(1); p_sym.paragraph_format.space_after = Pt(1); p_sym.paragraph_format.left_indent = Inches(0.2)
                    r_b = p_sym.add_run("• "); r_b.font.bold = True; r_b.font.color.rgb = RGBColor(37, 99, 235)
                    r_s = p_sym.add_run(f"[{sym_name}]: "); r_s.font.name = "Times New Roman"; r_s.font.bold = True; r_s.font.size = Pt(9); r_s.font.color.rgb = RGBColor(30, 58, 138)
                    r_d = p_sym.add_run(sym_desc); r_d.font.name = "Times New Roman"; r_d.font.size = Pt(9); r_d.font.color.rgb = RGBColor(51, 65, 85)

            if file_info.get('presentation_speech'):
                create_callout_box(
                    doc,
                    [
                        ("🗣️ LỜI THOẠI THUYẾT TRÌNH MẪU KHI CHIẾU FILE NÀY:\n", True, False, RGBColor(5, 150, 105), 9.5),
                        (f'"{file_info["presentation_speech"]}"', False, True, RGBColor(15, 23, 42), 9)
                    ],
                    border_color="059669", bg_color="F0FDF4"
                )

            if file_info.get('viva_trap'):
                trap = file_info['viva_trap']
                create_callout_box(
                    doc,
                    [
                        ("🎯 BẪY VẤN ĐÁP CỦA THẦY VINH & CÁCH TRẢ LỜI ĐẠT ĐIỂM 10:\n", True, False, RGBColor(180, 83, 9), 9.5),
                        ("❓ Thầy hỏi: ", True, False, RGBColor(180, 83, 9), 9),
                        (f'"{trap["question"]}"\n', True, True, RGBColor(180, 83, 9), 9),
                        ("💡 Câu trả lời chuẩn xác: ", True, False, RGBColor(30, 58, 138), 9),
                        (f'"{trap["answer"]}"', False, False, RGBColor(15, 23, 42), 9)
                    ],
                    border_color="D97706", bg_color="FFFBEB"
                )

            p_div_sub2 = doc.add_paragraph(); p_div_sub2.paragraph_format.space_before = Pt(2); p_div_sub2.paragraph_format.space_after = Pt(4)
            r_d_s2 = p_div_sub2.add_run("· " * 42); r_d_s2.font.color.rgb = RGBColor(203, 213, 225); p_div_sub2.alignment = WD_ALIGN_PARAGRAPH.CENTER

    # =========================================================================
    # PHẦN 4: MA TRẬN PHẢN ỨNG NHANH CHO BÀN VẤN ĐÁP (VIVA GOLDEN CHEAT-SHEET)
    # =========================================================================
    add_heading_1(doc, "PHẦN 4: MA TRẬN PHẢN ỨNG NHANH CHO BÀN VẤN ĐÁP (GOLDEN CHEAT-SHEET)")
    add_paragraph(
        doc,
        "Bảng tra cứu tốc độ 3 giây: Khi Thầy hỏi câu nào hoặc chỉ vào file nào, mở ngay dòng code và nói câu tương ứng:",
        space_before=2, space_after=4
    )

    tbl_gold = doc.add_table(rows=14, cols=4)
    tbl_gold.alignment = WD_TABLE_ALIGNMENT.CENTER; tbl_gold.autofit = False; set_table_borders(tbl_gold, "CBD5E1")
    g_widths = [Inches(1.8), Inches(1.1), Inches(1.5), Inches(2.4)]
    g_headers = ["Câu hỏi / File Thầy chỉ", "Người đáp", "Dòng code mở ngay", "Từ khóa trả lời ghi điểm tuyệt đối"]
    
    for j, h in enumerate(g_headers):
        c = tbl_gold.rows[0].cells[j]; c.width = g_widths[j]
        set_cell_background(c, "1E3A8A"); set_cell_margins(c, 70, 70, 80, 80)
        p = c.paragraphs[0]; r = p.add_run(h)
        r.font.name = "Times New Roman"; r.font.bold = True; r.font.size = Pt(8.5); r.font.color.rgb = RGBColor(255, 255, 255)
        
    cheat_data = [
        ("Token đăng nhập lưu ở đâu?\n(app/(auth)/sign-in.tsx)", "TV2 (Giang)", "src/store/authStore.ts\nDòng 50-80", "'Token lưu trong chip mã hóa SecureStore (Keychain/Keystore), survive app restart, tuyệt đối cấm AsyncStorage.'"),
        ("Dữ liệu bài tập lưu ở đâu?\n(src/hooks/useAssignments.ts)", "TV2 (Giang)", "src/hooks/useAssignments.ts\nDòng 35-50", "'Lưu trong bộ nhớ đệm RAM TanStack Query v5 với staleTime 1 phút và retry 2 lần khi mạng chập chờn.'"),
        ("Mất mạng dữ liệu lưu ở đâu?\n(src/components/ui/OfflineBanner.tsx)", "Cả 2", "src/hooks/useAssignments.ts\nDòng 60-80", "'Lưu trong AsyncStorage kèm mốc thời gian thực tế (toLocaleTimeString) hiển thị trên Banner hổ phách.'"),
        ("Optimistic Update hoạt động ra sao?\n(src/hooks/useAssignments.ts)", "TV2 (Giang)", "src/hooks/useAssignments.ts\nDòng 130-180", "'onMutate lưu snapshot cache cũ -> onError tự động rollback -> onSettled đồng bộ server.'"),
        ("Tiến độ % lưu ở đâu trong DB?\n(app/(app)/(tabs)/courses.tsx)", "TV2 (Giang)", "src/utils/statsUtils.ts\nDòng 15-40", "'Không lưu trong DB! Là Derived State O(N) tính toán động để triệt tiêu nguy cơ bất đồng bộ dữ liệu.'"),
        ("Ảnh đính kèm lưu ở đâu?\n(app/(app)/modal/new-assignment.tsx)", "TV1 (Trâm)", "app/(app)/modal/new-assignment.tsx\nDòng 120-150", "'Lưu đường dẫn Local URI file:/// trong sandbox app, không lưu Base64 để tránh làm nghẽn RAM.'"),
        ("Tại sao không lỗi múi giờ 48h?\n(src/utils/dateUtils.ts)", "TV2 (Giang)", "src/utils/dateUtils.ts\nDòng 10-30", "'Dùng hàm startOfDay đưa thời gian về 00:00:00 ngày lịch địa phương, không cộng trừ mili-giây chay.'"),
        ("Deep Link hoạt động thế nào?\n(src/hooks/useNotifications.ts)", "TV1 (Trâm)", "app/_layout.tsx\nDòng 50 (Listener)", "'Payload notification chứa assignmentId, Listener ở Root Layout đón nhận điều hướng sang [id].'"),
        ("Luật Zero-Hex hoạt động ra sao?\n(src/constants/tokens.ts)", "TV1 (Trâm)", "src/constants/tokens.ts\nDòng 20-55", "'Mã hex tập trung duy nhất ở tokens.ts, UI dùng Semantic Tokens qua useThemeColor đổi Dark Mode tự động.'"),
        ("Vùng chạm 44x44pt ở đâu?\n(src/components/ui/AccessibleButton.tsx)", "TV1 (Trâm)", "src/components/ui/AccessibleButton.tsx\nDòng 25-35", "'Cố định minHeight/minWidth 44pt tại AccessibleButton và ô checkbox, đạt chuẩn Apple HIG & WCAG 2.1 AA.'"),
        ("StateHandler làm nhiệm vụ gì?\n(src/components/ui/StateHandler.tsx)", "TV2 (Giang)", "src/components/ui/StateHandler.tsx\nDòng 30-65", "'Xử lý đủ 4 trạng thái: Loading, Empty, Error có nút Retry gọi refetch thật sự, và Content.'"),
        ("Tại sao phân tách 4 vùng state?", "Cả 2", "Kiến trúc tổng thể", "'Phân tách Separation of Concerns: Server State (TanStack), Client State (Zustand), Offline (AsyncStorage), Secure (SecureStore).'")
    ]
    
    for i, row_data in enumerate(cheat_data):
        row = tbl_gold.rows[i + 1]
        for j, val in enumerate(row_data):
            c = row.cells[j]; c.width = g_widths[j]
            set_cell_margins(c, 50, 50, 80, 80)
            set_cell_background(c, "F8FAFC" if i % 2 == 1 else "FFFFFF")
            p = c.paragraphs[0]; r = p.add_run(val)
            r.font.name = "Times New Roman"; r.font.size = Pt(8.0)
            if j == 0: r.font.bold = True; r.font.color.rgb = RGBColor(30, 58, 138)
            elif j == 1:
                r.font.bold = True
                r.font.color.rgb = RGBColor(5, 150, 105) if "Trâm" in val else RGBColor(37, 99, 235)
            elif j == 3: r.font.italic = True; r.font.color.rgb = RGBColor(15, 23, 42)

    # Save Word document
    doc.save(output_docx_path)
    print(f"Master Word document saved: {output_docx_path}")
    
    # Save Markdown document
    md_content = build_master_markdown_document()
    with open(output_md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    print(f"Master Markdown document saved: {output_md_path}")

def build_master_markdown_document():
    lines = []
    lines.append(f"# {PROJECT_METADATA['topic'].upper()}")
    lines.append("## TÀI LIỆU TOÀN DIỆN THUYẾT MINH, DEMO & VẤN ĐÁP BẢO VỆ ĐỒ ÁN")
    lines.append("### (MASTER SPECIFICATION: DEMO GUIDE, ARCHITECTURE & CODEBASE WALKTHROUGH)")
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
    
    # SECTION 1: DEMO
    lines.append("## PHẦN 1: HƯỚNG DẪN DEMO THỰC TẾ & BẢN ĐỒ TƯƠNG TÁC")
    lines.append("")
    lines.append("### 1.1 Bảng Tài Khoản & Mật Khẩu Đăng Nhập Demo")
    lines.append("- **Nút 1-Click Demo (Khuyên dùng)**: Bấm nút `⚡ Đăng nhập nhanh (Tài khoản SV)` tại màn hình đăng nhập để vào thẳng Trang chủ.")
    lines.append("- **Tài khoản nhập tay**: Email `1923051154@dntu.edu.vn` (hoặc email bất kỳ), Mật khẩu `123456`.")
    lines.append("- **Nơi lưu trữ**: Mã hóa phần cứng qua `expo-secure-store` tại `src/store/authStore.ts`.")
    lines.append("")
    lines.append("### 1.2 Bản Đồ 10 Điểm Tương Tác Demo Trực Tiếp Trên App")
    lines.append("| STT | Tính năng tương tác Demo | Thao tác thực tế trên màn hình | File UI & File Logic |")
    lines.append("| :---: | :--- | :--- | :--- |")
    for pt in DEMO_INTERACTION_POINTS:
        lines.append(f"| {pt['num']:02d} | **{pt['title']}** | {pt['action']} | UI: `{pt['ui_file']}`<br>Logic: `{pt['logic_file']}` |")
    lines.append("")
    lines.append("### 1.3 Kịch Bản Thao Tác Nhanh 6 Bước 'Bấm Đâu Trúng Đó'")
    lines.append("1. **Bước 1 (Đăng nhập)**: Mở app -> Bấm `⚡ Đăng nhập nhanh` -> Vào Trang chủ ngay.")
    lines.append("2. **Bước 2 (Trang chủ & 48h & Checkbox)**: Chỉ Widget 48h -> Tick thử 1 bài tập (Cập nhật lạc quan 0ms).")
    lines.append("3. **Bước 3 (Lịch tuần)**: Sang Tab 2 -> Bấm các ngày có chấm đỏ cam -> Chuyển sang Danh sách.")
    lines.append("4. **Bước 4 (Tạo bài & Ảnh)**: Bấm '+' -> Chuyển tháng ◀/▶, chỉnh giờ phút ±, bấm phím tắt 23:59, chọn ảnh -> Lưu.")
    lines.append("5. **Bước 5 (Deep Linking)**: Bấm bài vừa tạo -> Bấm `🔔 Bật Nhắc Nhở Deadline` -> Sau 2s chạm thông báo -> App nhảy vào chi tiết kèm Banner.")
    lines.append("6. **Bước 6 (Tiến độ & Dark Mode)**: Sang Tab 3 -> Giải thích Derived State % -> Bấm nút `🌙 Tối` (Dark Mode) -> Bấm Đăng xuất.")
    lines.append("")
    lines.append("---")
    lines.append("")
    
    # SECTION 2: 12 ARCHITECTURAL ISSUES
    lines.append("## PHẦN 2: CHUYÊN ĐỀ 12 VẤN ĐỀ KIẾN TRÚC & LƯU TRỮ DỮ LIỆU CỐT LÕI")
    lines.append("")
    for issue in ARCHITECTURAL_ISSUES:
        lines.append(f"### 📌 VẤN ĐỀ {issue['num']:02d}: {issue['title']}")
        lines.append(f"- **Lĩnh vực chuyên sâu**: {issue['category']}")
        lines.append(f"- **Thành viên phụ trách**: **{issue['owner']}**")
        lines.append(f"- **Tiêu chuẩn đồ án đáp ứng**: {issue['requirement']}")
        lines.append("")
        lines.append("#### 1. Vấn Đề Đặt Ra & Nguy Cơ Tiềm Ẩn:")
        lines.append(issue['problem_statement'])
        lines.append("")
        lines.append("#### 2. Dữ Liệu Được Lưu Ở Đâu & Công Nghệ Áp Dụng:")
        lines.append(issue['storage_location'])
        lines.append("")
        lines.append("#### 3. Phản Biện Giải Pháp & Tại Sao Không Chọn Công Nghệ Khác:")
        lines.append(issue['why_not_alternative'])
        lines.append("")
        lines.append("#### 4. Cơ Chế Hoạt Động & Điểm Nhấn Mã Nguồn:")
        for sym, desc in issue.get('technical_mechanism', []):
            lines.append(f"- **`[{sym}]`**: {desc}")
        lines.append("")
        if issue.get('speech'):
            lines.append("> **🗣️ Lời thoại thuyết trình mẫu:**")
            lines.append(f"> *\"{issue['speech']}\"*")
            lines.append("")
        if issue.get('viva_qna'):
            trap = issue['viva_qna']
            lines.append("> **🎯 Bẫy vấn đáp của Thầy Nguyễn Xuân Vinh & Cách trả lời đạt điểm 10:**")
            lines.append(f"> - **Thầy hỏi**: *\"{trap['question']}\"*")
            lines.append(f"> - **Sinh viên trả lời**: *\"{trap['answer']}\"*")
            lines.append("")
        lines.append("---")
        lines.append("")

    # SECTION 3: FILE BY FILE
    lines.append("## PHẦN 3: HỒ SƠ THUYẾT MINH CHI TIẾT THEO CÂY THƯ MỤC DỰ ÁN")
    lines.append("")
    for sec in SECTIONS:
        lines.append(f"### {sec['title']}")
        lines.append(f"*{sec['desc']}*")
        lines.append("")
        for f in sec['files']:
            lines.append(f"#### 📄 `{f['path']}` — {f['name']}")
            lines.append(f"- **Phân tầng**: {f['layer']} | **Phụ trách**: **{f['owner']}** | **Đáp ứng**: {f['requirement']}")
            lines.append(f"- **Mục đích**: {f['purpose']}")
            lines.append("")
            lines.append("##### 🔍 Điểm Nhấn Kỹ Thuật:")
            for sym, desc in f.get('key_code', []):
                lines.append(f"- **`[{sym}]`**: {desc}")
            lines.append("")
            if f.get('presentation_speech'):
                lines.append(f"> **🗣️ Lời thoại**: *\"{f['presentation_speech']}\"*")
                lines.append("")
            if f.get('viva_trap'):
                trap = f['viva_trap']
                lines.append(f"> **🎯 Vấn đáp Thầy Vinh**: *\"{trap['question']}\"* -> *\"{trap['answer']}\"*")
                lines.append("")
            lines.append("---")
            lines.append("")

    # SECTION 4: CHEAT SHEET
    lines.append("## PHẦN 4: MA TRẬN PHẢN ỨNG NHANH CHO BÀN VẤN ĐÁP (GOLDEN CHEAT-SHEET)")
    lines.append("")
    lines.append("| Câu hỏi / File Thầy chỉ | Người đáp | Dòng code mở ngay | Từ khóa trả lời ghi điểm tuyệt đối |")
    lines.append("| :--- | :---: | :--- | :--- |")
    golden_answers = [
        ("Token đăng nhập lưu ở đâu?", "TV2 (Giang)", "src/store/authStore.ts", "*Lưu trong chip mã hóa phần cứng SecureStore (Keychain/Keystore), survive app restart, tuyệt đối cấm AsyncStorage.*"),
        ("Dữ liệu bài tập lưu ở đâu?", "TV2 (Giang)", "src/hooks/useAssignments.ts", "*Lưu trong bộ nhớ đệm RAM TanStack Query v5 với staleTime 1 phút và retry 2 lần.*"),
        ("Mất mạng dữ liệu lưu ở đâu?", "Cả 2", "src/components/ui/OfflineBanner.tsx", "*Lưu trong AsyncStorage kèm mốc thời gian thực tế hiển thị trên Banner hổ phách.*"),
        ("Optimistic Update hoạt động ra sao?", "TV2 (Giang)", "src/hooks/useAssignments.ts", "*onMutate chụp snapshot cache cũ -> onError tự động rollback -> onSettled đồng bộ server.*"),
        ("Tiến độ % lưu ở đâu trong DB?", "TV2 (Giang)", "src/utils/statsUtils.ts", "*Không lưu trong DB! Là Derived State O(N) tính toán động để triệt tiêu Data Inconsistency.*"),
        ("Ảnh đính kèm lưu ở đâu?", "TV1 (Trâm)", "app/(app)/modal/new-assignment.tsx", "*Lưu đường dẫn Local URI file:/// trong sandbox app, không lưu Base64 tránh nghẽn RAM.*"),
        ("Tại sao không lỗi múi giờ 48h?", "TV2 (Giang)", "src/utils/dateUtils.ts", "*Dùng hàm startOfDay đưa thời gian về 00:00:00 ngày lịch địa phương, không cộng trừ mili-giây chay.*"),
        ("Deep Link hoạt động thế nào?", "TV1 (Trâm)", "app/_layout.tsx", "*Payload notification chứa assignmentId, Listener ở Root Layout đón nhận điều hướng sang [id].*"),
        ("Luật Zero-Hex hoạt động ra sao?", "TV1 (Trâm)", "src/constants/tokens.ts", "*Mã hex tập trung duy nhất ở tokens.ts, UI dùng Semantic Tokens qua useThemeColor đổi Dark Mode tự động.*"),
        ("Vùng chạm 44x44pt ở đâu?", "TV1 (Trâm)", "src/components/ui/AccessibleButton.tsx", "*Cố định minHeight/minWidth 44pt tại AccessibleButton và ô checkbox, đạt chuẩn Apple HIG & WCAG 2.1 AA.*"),
        ("StateHandler làm nhiệm vụ gì?", "TV2 (Giang)", "src/components/ui/StateHandler.tsx", "*Xử lý đủ 4 trạng thái: Loading, Empty, Error có nút Retry gọi refetch thật sự, và Content.*"),
        ("Tại sao phân tách 4 vùng state?", "Cả 2", "Kiến trúc tổng thể", "*Phân tách Separation of Concerns: Server State (TanStack), Client State (Zustand), Offline (AsyncStorage), Secure (SecureStore).*")
    ]
    for q, m, d, a in golden_answers:
        lines.append(f"| {q} | {m} | `{d}` | {a} |")
    lines.append("")
    lines.append("---")
    lines.append("*Tài liệu tổng hợp duy nhất phục vụ bảo vệ Đồ án Mobile Final Project — DNTU 2026.*")
    return "\n".join(lines)

if __name__ == "__main__":
    base_dir = r"c:\CaNhan\LapTrinhMobile\1923050181_1923051154_StudyPlanner"
    output_docx = os.path.join(base_dir, "Tong_Hop_Thuyet_Trinh_Va_Bao_Ve_Do_An_StudyPlanner.docx")
    output_md = os.path.join(base_dir, "TONG_HOP_THUYET_TRINH_VA_BAO_VE_DO_AN.md")
    
    build_master_document(output_docx, output_md)
    
    # Also copy to parent
    parent_docx = r"c:\CaNhan\LapTrinhMobile\Tong_Hop_Thuyet_Trinh_Va_Bao_Ve_Do_An_StudyPlanner.docx"
    try:
        shutil.copyfile(output_docx, parent_docx)
        print(f"Copied master document to parent: {parent_docx}")
    except Exception as e:
        print(f"Notice on copy to parent: {e}")
