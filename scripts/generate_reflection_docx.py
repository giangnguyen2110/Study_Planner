import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def create_reflection_docx(output_path):
    doc = docx.Document()

    # Set margins 0.75 inch for a clean 1-page fit
    for section in doc.sections:
        section.top_margin = Inches(0.7)
        section.bottom_margin = Inches(0.7)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)

    # Header institution
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_after = Pt(2)
    run_inst = p_inst.add_run("TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐỒNG NAI — KHOA CÔNG NGHỆ THÔNG TIN\nBỘ MÔN CÔNG NGHỆ PHẦN MỀM & KỸ THUẬT DỮ LIỆU")
    run_inst.font.name = "Times New Roman"
    run_inst.font.size = Pt(10)
    run_inst.font.bold = True
    run_inst.font.color.rgb = RGBColor(100, 116, 139)

    # Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(6)
    p_title.paragraph_format.space_after = Pt(4)
    run_title = p_title.add_run("ONE-PAGE REFLECTION — BẢN ĐÚC KẾT DỰ ÁN CUỐI KỲ")
    run_title.font.name = "Times New Roman"
    run_title.font.size = Pt(16)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(15, 23, 42)

    # Subtitle Info Box
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(8)
    run_sub = p_sub.add_run("Đề tài 01: Study Planner | Môn: Lập trình Mobile (TH7011101 - 23DTH1) | GV: Thầy Nguyễn Xuân Vinh\nSinh viên: Trần Bảo Trâm (MSSV: 1923050181 - TV1) — Nguyễn Thị Hương Giang (MSSV: 1923051154 - TV2)")
    run_sub.font.name = "Times New Roman"
    run_sub.font.size = Pt(10.5)
    run_sub.font.italic = True
    run_sub.font.color.rgb = RGBColor(71, 85, 105)

    # Divider
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_after = Pt(6)
    r_div = p_div.add_run("—" * 58)
    r_div.font.color.rgb = RGBColor(203, 213, 225)
    p_div.alignment = WD_ALIGN_PARAGRAPH.CENTER

    def add_heading_styled(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(3)
        run = p.add_run(text)
        run.font.name = "Times New Roman"
        run.font.size = Pt(12)
        run.font.bold = True
        run.font.color.rgb = RGBColor(30, 58, 138)
        return p

    def add_bullet_point(title, text):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        r_t = p.add_run(title + ": ")
        r_t.font.name = "Times New Roman"
        r_t.font.size = Pt(10.5)
        r_t.font.bold = True
        r_t.font.color.rgb = RGBColor(15, 23, 42)
        r_c = p.add_run(text)
        r_c.font.name = "Times New Roman"
        r_c.font.size = Pt(10.5)
        r_c.font.color.rgb = RGBColor(51, 65, 85)

    def add_body(text, bold_prefix=""):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_b = p.add_run(bold_prefix)
            r_b.font.name = "Times New Roman"
            r_b.font.size = Pt(10.5)
            r_b.font.bold = True
            r_b.font.color.rgb = RGBColor(15, 23, 42)
        r = p.add_run(text)
        r.font.name = "Times New Roman"
        r.font.size = Pt(10.5)
        r.font.color.rgb = RGBColor(51, 65, 85)

    # Section 1
    add_heading_styled("1. NHỮNG ĐIỀU NHÓM SẼ LÀM KHÁC ĐI NẾU BẮT ĐẦU LẠI DỰ ÁN")
    add_bullet_point("Khóa chặt Hợp đồng Dữ liệu (API Contract & TypeScript Types) trước khi gõ UI",
                     "Giai đoạn đầu hai thành viên làm song song khiến tên trường dữ liệu bị lệch (dueDate vs dueAt, photo vs photoUri), mất thời gian refactor. Nếu làm lại, nhóm sẽ dành trọn 2 tiếng đầu tiên thống nhất file types/study.ts và Mock API trước.")
    add_bullet_point("Thiết lập Tự động hóa Kiểm thử (Automated Test Pipeline) ngay từ Commit #1",
                     "Viết UI trước rồi mới cấu hình Jest khiến một số component bị thiếu mock native. Nhóm sẽ áp dụng TDD hoặc cấu hình Jest xanh lét ngay từ commit đầu để phát hiện sớm các lỗi hồi quy.")
    add_bullet_point("Tách State bộ lọc sang Zustand Store sớm hơn",
                     "Ban đầu nhóm lưu filter trong Local State của màn hình Schedule khiến Dashboard không truyền được filter qua. Đưa vào Zustand đã giải quyết triệt để và giúp nhóm hiểu sâu tư duy State Management của Thầy.")

    # Section 2
    add_heading_styled("2. MỘT LỖI SAI CỦA TRỢ LÝ AI MÀ NHÓM ĐÃ TỰ TAY BẮT ĐƯỢC")
    add_body("Khi nhóm yêu cầu AI hỗ trợ viết Store xác thực với yêu cầu 'App tắt đi bật lại vẫn nhớ đăng nhập', AI đã tự động sinh đoạn mã dùng middleware persist của Zustand kết hợp với AsyncStorage:", "Tình huống thực tế: ")

    p_code = doc.add_paragraph()
    p_code.paragraph_format.space_before = Pt(2)
    p_code.paragraph_format.space_after = Pt(4)
    r_code = p_code.add_run("❌ Code sai lầm do AI sinh ra: getStorage: () => AsyncStorage  // Lỗi bảo mật tử huyệt!")
    r_code.font.name = "Consolas"
    r_code.font.size = Pt(9.5)
    r_code.font.color.rgb = RGBColor(185, 28, 28)

    add_body("Trong bài Lab 08 và Handout đồ án, Thầy Nguyễn Xuân Vinh đã dặn rất kỹ: 'Secrets in SecureStore only. A sign-in screen, a session store, and the token in SecureStore — never in AsyncStorage'. AsyncStorage lưu trữ Plain Text không mã hóa, ai cũng có thể đọc trộm JWT Token. Nếu không tỉnh táo bắt được lỗi này, nhóm sẽ bị 0 điểm phần Auth.", "Lý do AI sai nghiêm trọng: ")
    add_body("Nhóm đã kiên quyết từ chối đoạn code của AI và tự tay viết lại tầng lưu trữ bằng expo-secure-store (lưu qua Keychain trên iOS và Keystore trên Android được mã hóa phần cứng AES-256) kèm hàm restoreSession() khôi phục phiên an toàn.", "Cách nhóm xử lý: ")

    # Section 3
    add_heading_styled("3. LỜI KẾT")
    add_body("Dự án giúp nhóm em rèn luyện tư duy phản biện công nghệ quan trọng: Sử dụng AI như một người cộng sự hỗ trợ thông minh, nhưng tuyệt đối không phụ thuộc mù quáng; luôn kiểm chứng, làm chủ từng dòng mã nguồn và bảo vệ sản phẩm bằng kiến thức thực chất của chính mình!")

    doc.save(output_path)
    print("Saved successfully to:", output_path)

if __name__ == "__main__":
    create_reflection_docx("c:/CaNhan/LapTrinhMobile/1923050181_1923051154_StudyPlanner/OnePage_Reflection.docx")
    create_reflection_docx("c:/CaNhan/LapTrinhMobile/OnePage_Reflection.docx")
