/* eslint-disable @typescript-eslint/no-explicit-any */
export type Lang = "en" | "vi" | "jp";

export const translations = {
  en: {
    role: "Software Engineer",
    nav_home: "Home",
    nav_about: "About",
    nav_profile: "Profile",
    nav_cert: "Certificates",
    nav_career: "Career",
    nav_achievements: "Achievements",
    nav_skills: "Skills",
    nav_exp: "Experience",
    nav_proj: "Projects",
    nav_gallery: "Gallery",
    nav_contact: "Contact",
    nav_blog: "Blog", 

    hero_greeting: "HELLO, WORLD!",
    hero_iam: "I am a",
    hero_desc: "Passionate about building world-class web applications and secure systems.",
    btn_view_project: "View Projects",
    btn_contact: "Contact Me",
    
    lbl_en_name: "English Name:",
    lbl_jp_name: "Japanese Name:",
    
    sec_about: "01. ABOUT ME",
    about_line1: "I am a third-year IT student at UTH University with a strong passion for coding and problem-solving. And I love mathematics too.",
    about_line2: "I love turning complex ideas into reality through elegant code.",
    
    sec_profile: "02. PROFILE",
    box_personal: "Personal Info",
    lbl_name: "Name:",
    lbl_dob: "Birthday:",
    lbl_age: "Age:",
    lbl_nation: "Nationality:",
    val_nation: "Vietnam",
    lbl_job: "Job:",
    val_job: "Student / Freelancer",
    
    box_status: "Status",
    lbl_address: "Address:",
    val_address: "Ho Chi Minh City",
    lbl_lang: "Languages:",
    val_lang: "Vietnamese, English, Japanese",
    lbl_status: "Status:",
    val_status: "Available for work",

    // 2. Thêm box Other cho Profile
    box_other: "Other Info",
    lbl_other_1: "Interests:",
    val_other_1: "Research, Travel",
    lbl_other_2: "Soft Skills:",
    val_other_2: "Leadership, Teamwork",
    
    sec_cert: "03. CERTIFICATES",
    cat_lang: "Language Certificates",
    cat_tech: "Technical Certificates",
    lbl_click_detail: "(Click to view details)",
    
    sec_career: "04. CAREER GOALS",
    career_desc: "To become a Full-stack Developer and a Cyber Security Expert in the next 5 years.",
    
    sec_achievements: "05. ACHIEVEMENTS", // Thay cho sec_hobby
    achievements_desc: "Competitions and academic events I have participated in.",
    
    sec_skills: "06. SKILLS",
    
    sec_exp: "07. EXPERIENCE",
    box_it_exp: "IT Experience",
    exp_time_1: "2023 - Present:",
    exp_role_1: "Freelance Web Developer",
    exp_desc_1: "Building responsive websites and web applications for clients.",
    exp_role_2: "IT Club Member",
    exp_desc_2: "Participated in university coding contests and workshops.",
    
    box_non_it_exp: "Non-IT Experience",
    exp_role_3: "Sales Assistant",
    exp_desc_3: "Learned communication and teamwork skills.",
    exp_role_4: "Volunteer",
    exp_desc_4: "Supported local community events.",
    
    sec_proj: "08. PROJECTS",
    cat_uni_proj: "University Projects",
    cat_personal_proj: "Personal Projects",
    
    sec_gallery: "09. GALLERY",
    cat_it_event: "IT Events",
    lbl_view_album: "(View Album)",
    
    sec_contact: "10. CONTACT",
    box_contact_direct: "Direct Contact",
    box_social: "Social Networks",
    
    typewriter_texts: ["Software Engineer", "Web Developer", "Security Enthusiast", "Gamer"]
  },
  vi: {
    role: "Kỹ Sư Phần Mềm",
    nav_home: "Trang Chủ",
    nav_about: "Giới Thiệu",
    nav_profile: "Hồ Sơ",
    nav_cert: "Chứng Chỉ",
    nav_career: "Sự Nghiệp",
    nav_achievements: "Thành Tựu",
    nav_skills: "Kỹ Năng",
    nav_exp: "Kinh Nghiệm",
    nav_proj: "Dự Án",
    nav_gallery: "Thư Viện",
    nav_contact: "Liên Hệ",
    nav_blog: "Bài Viết", 

    hero_greeting: "XIN CHÀO!",
    hero_iam: "Tôi là một",
    hero_desc: "Đam mê xây dựng các ứng dụng web đẳng cấp và hệ thống bảo mật an toàn.",
    btn_view_project: "Xem Dự Án",
    btn_contact: "Liên Hệ",
    
    lbl_en_name: "Tên Tiếng Anh:",
    lbl_jp_name: "Tên Tiếng Nhật:",
    
    sec_about: "01. GIỚI THIỆU",
    about_line1: "Tôi là sinh viên năm 3 ngành CNTT tại UTH với niềm đam mê mãnh liệt với lập trình. Và tôi cũng rất thích toán học.",
    about_line2: "Tôi thích biến những ý tưởng phức tạp thành hiện thực thông qua những dòng code tinh tế.",
    
    
    sec_profile: "02. HỒ SƠ",
    box_personal: "Thông Tin Cá Nhân",
    lbl_name: "Họ Tên:",
    lbl_dob: "Ngày Sinh:",
    lbl_age: "Tuổi:",
    lbl_nation: "Quốc Tịch:",
    val_nation: "Việt Nam",
    lbl_job: "Nghề Nghiệp:",
    val_job: "Sinh Viên / Freelancer",
    
    box_status: "Trạng Thái",
    lbl_address: "Địa Chỉ:",
    val_address: "TP. Hồ Chí Minh",
    lbl_lang: "Ngôn Ngữ:",
    val_lang: "Tiếng Việt, Anh, Nhật",
    lbl_status: "Trạng Thái:",
    val_status: "Đang tìm việc",

    box_other: "Thông Tin Khác",
    lbl_other_1: "Sở thích:",
    val_other_1: "Nghiên cứu, Du lịch",
    lbl_other_2: "Kỹ năng mềm:",
    val_other_2: "Lãnh đạo, Làm việc nhóm",
    
    sec_cert: "03. CHỨNG CHỈ",
    cat_lang: "Chứng Chỉ Ngoại Ngữ",
    cat_tech: "Chứng Chỉ Chuyên Môn",
    lbl_click_detail: "(Nhấn để xem chi tiết)",
    
    sec_career: "04. MỤC TIÊU NGHỀ NGHIỆP",
    career_desc: "Trở thành Full-stack Developer và Chuyên gia An ninh mạng trong 5 năm tới.",
    
    sec_achievements: "05. THÀNH TỰU",
    achievements_desc: "Các cuộc thi và sự kiện học thuật tôi đã tham gia (Không quan trọng giải thưởng).",
    
    sec_skills: "06. KỸ NĂNG",
    
    sec_exp: "07. KINH NGHIỆM",
    box_it_exp: "Kinh Nghiệm IT",
    exp_time_1: "2023 - Hiện tại:",
    exp_role_1: "Lập trình viên Web Freelance",
    exp_desc_1: "Xây dựng website responsive và ứng dụng web cho khách hàng.",
    exp_role_2: "Thành viên CLB IT",
    exp_desc_2: "Tham gia các cuộc thi lập trình và workshop tại trường.",
    
    box_non_it_exp: "Kinh Nghiệm Khác",
    exp_role_3: "Nhân viên bán hàng",
    exp_desc_3: "Rèn luyện kỹ năng giao tiếp và làm việc nhóm.",
    exp_role_4: "Tình nguyện viên",
    exp_desc_4: "Hỗ trợ các sự kiện cộng đồng địa phương.",
    
    sec_proj: "08. DỰ ÁN",
    cat_uni_proj: "Dự Án Đại Học",
    cat_personal_proj: "Dự Án Cá Nhân",
    
    sec_gallery: "09. THƯ VIỆN ẢNH",
    cat_it_event: "Sự Kiện IT",
    lbl_view_album: "(Xem Album)",
    
    sec_contact: "10. CONTACT",
    box_contact_direct: "Liên Hệ Trực Tiếp",
    box_social: "Mạng Xã Hội",
    
    typewriter_texts: ["Kỹ Sư Phần Mềm", "Lập Trình Viên Web", "Chuyên Gia Bảo Mật", "Game Thủ"]
  },
  jp: {
    role: "ソフトウェアエンジニア",
    nav_home: "ホーム",
    nav_about: "私について",
    nav_profile: "プロフィール",
    nav_cert: "証明書",
    nav_career: "キャリア",
    nav_achievements: "実績",
    nav_skills: "スキル",
    nav_exp: "経験",
    nav_proj: "プロジェクト",
    nav_gallery: "ギャラリー",
    nav_contact: "連絡先",
    nav_blog: "ブログ", 

    hero_greeting: "こんにちは!",
    hero_iam: "私は",
    hero_desc: "世界クラスのWebアプリケーションと安全なシステムの構築に情熱を注いでいます。",
    btn_view_project: "プロジェクトを見る",
    btn_contact: "連絡する",
    
    lbl_en_name: "英語名:",
    lbl_jp_name: "日本名:",
    
    sec_about: "01. 私について",
    about_line1: "私はUTH大学の3年生で、コーディングと問題解決に強い情熱を持っています。数学も好きです。",
    about_line2: "複雑なアイデアをエレガントなコードで実現することが大好きです。",
    
    sec_profile: "02. プロフィール",
    box_personal: "個人情報",
    lbl_name: "名前:",
    lbl_dob: "生年月日:",
    lbl_age: "年齢:",
    lbl_nation: "国籍:",
    val_nation: "ベトナム",
    lbl_job: "職業:",
    val_job: "学生 / フリーランサー",
    
    box_status: "ステータス",
    lbl_address: "住所:",
    val_address: "ホーチミン市",
    lbl_lang: "言語:",
    val_lang: "ベトナム語, 英語, 日本語",
    lbl_status: "ステータス:",
    val_status: "仕事募集中",

    box_other: "その他",
    lbl_other_1: "興味:",
    val_other_1: "研究, 旅行",
    lbl_other_2: "ソフトスキル:",
    val_other_2: "リーダーシップ, チームワーク",
    
    sec_cert: "03. 証明書",
    cat_lang: "語学証明書",
    cat_tech: "技術証明書",
    lbl_click_detail: "(詳細を見る)",
    
    sec_career: "04. キャリア目標",
    career_desc: "今後5年でフルスタック開発者およびサイバーセキュリティの専門家になること。",
    
    sec_achievements: "05. 実績",
    achievements_desc: "私が参加したコンテストや学術イベント。",
    
    sec_skills: "06. スキル",
    
    sec_exp: "07. 経験",
    box_it_exp: "IT経験",
    exp_time_1: "2023 - 現在:",
    exp_role_1: "Web開発フリーランサー",
    exp_desc_1: "クライアント向けのレスポンシブWebサイトの構築。",
    exp_role_2: "ITクラブメンバー",
    exp_desc_2: "大学のコーディングコンテストやワークショップに参加。",
    
    box_non_it_exp: "その他の経験",
    exp_role_3: "販売アシスタント",
    exp_desc_3: "コミュニケーションとチームワークのスキルを習得。",
    exp_role_4: "ボランティア",
    exp_desc_4: "地域コミュニティイベントのサポート。",
    
    sec_proj: "08. プロジェクト",
    cat_uni_proj: "大学プロジェクト",
    cat_personal_proj: "個人プロジェクト",
    
    sec_gallery: "09. ギャラリー",
    cat_it_event: "ITイベント",
    lbl_view_album: "(アルバムを見る)",
    
    sec_contact: "10. 連絡先",
    box_contact_direct: "直接連絡",
    box_social: "ソーシャルネットワーク",
    
    typewriter_texts: ["ソフトウェアエンジニア", "Web開発者", "セキュリティ愛好家", "ゲーマー"]
  }
};
