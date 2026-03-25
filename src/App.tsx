/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="header-left">
          <h1><i className="fas fa-laptop-code fa-beat" style={{color: '#ffeb3b', marginRight: '8px'}}></i> TIN HỌC 4</h1>
          <h2>Bộ sách: Chân Trời Sáng Tạo</h2>
        </div>
        <div className="header-right">
          <div className="teacher-name">GV - Nguyễn Đình Bạch Long</div>
        </div>
      </header>

      <main className="container">
        <h2 className="sitemap-title">Sơ đồ bài học</h2>

        <div className="topic-grid">
          <div className="topic-card">
            <div className="topic-header"><i className="fas fa-desktop"></i> Chủ đề A: Máy tính và em</div>
            <ul className="lesson-list">
              <li><a href="SGK/bai1.html" className="lesson-link"><i className="fas fa-play-circle"></i> Bài 1: Phần cứng và phần mềm máy tính</a></li>
              <li><a href="SGK/bai2.html" className="lesson-link"><i className="fas fa-play-circle"></i> Bài 2: Gõ bàn phím đúng cách</a></li>
            </ul>
          </div>

          <div className="topic-card">
            <div className="topic-header"><i className="fas fa-network-wired"></i> Chủ đề B: Mạng máy tính và Internet</div>
            <ul className="lesson-list">
              <li><a href="SGK/bai3.html" className="lesson-link"><i className="fas fa-play-circle"></i> Bài 3: Thông tin trên trang web</a></li>
            </ul>
          </div>

          <div className="topic-card">
            <div className="topic-header"><i className="fas fa-folder-open"></i> Chủ đề C: Tổ chức lưu trữ, tìm kiếm...</div>
            <ul className="lesson-list">
              <li><a href="SGK/bai4.html" className="lesson-link"><i className="fas fa-play-circle"></i> Bài 4: Tìm kiếm thông tin trên Internet</a></li>
              <li><a href="SGK/bai5.html" className="lesson-link"><i className="fas fa-play-circle"></i> Bài 5: Thao tác với thư mục, tệp</a></li>
            </ul>
          </div>

          <div className="topic-card">
            <div className="topic-header"><i className="fas fa-user-shield"></i> Chủ đề D: Đạo đức, Pháp luật & Văn hóa số</div>
            <ul className="lesson-list">
              <li><a href="SGK/bai6.html" className="lesson-link"><i className="fas fa-play-circle"></i> Bài 6: Sử dụng phần mềm khi được phép</a></li>
            </ul>
          </div>

          <div className="topic-card">
            <div className="topic-header"><i className="fas fa-laptop-house"></i> Chủ đề E: Ứng dụng tin học</div>
            <ul className="lesson-list">
              <li><a href="SGK/bai7.html" className="lesson-link"><i className="fas fa-play-circle"></i> Bài 7: Soạn thảo văn bản tiếng Việt</a></li>
              <li><a href="SGK/bai8.html" className="lesson-link"><i className="fas fa-play-circle"></i> Bài 8: Chèn hình ảnh, sao chép, di chuyển, xoá văn bản</a></li>
              <li><a href="SGK/bai9.html" className="lesson-link"><i className="fas fa-play-circle"></i> Bài 9: Bài trình chiếu của em</a></li>
              <li><a href="SGK/bai10.html" className="lesson-link"><i className="fas fa-play-circle"></i> Bài 10: Định dạng, tạo hiệu ứng cho trang chiếu</a></li>
              <li><a href="SGK/bai11a.html" className="lesson-link"><i className="fas fa-play-circle"></i> Bài 11A: Xem video về lịch sử, văn hoá</a></li>
              <li><a href="SGK/bai11b.html" className="lesson-link"><i className="fas fa-play-circle"></i> Bài 11B: Thực hành luyện tập gõ bàn phím</a></li>
            </ul>
          </div>

          <div className="topic-card">
            <div className="topic-header"><i className="fas fa-code"></i> Chủ đề F: Giải quyết vấn đề với máy tính</div>
            <ul className="lesson-list">
              <li><a href="SGK/bai12.html" className="lesson-link"><i className="fas fa-play-circle"></i> Bài 12: Làm quen với Scratch</a></li>
              <li><a href="SGK/bai13.html" className="lesson-link"><i className="fas fa-play-circle"></i> Bài 13: Tạo chương trình máy tính để kể chuyện</a></li>
              <li><a href="SGK/bai14.html" className="lesson-link"><i className="fas fa-play-circle"></i> Bài 14: Điều khiển nhân vật chuyển động trên sân khấu</a></li>
            </ul>
          </div>

          <div className="topic-card review-card">
            <div className="topic-header"><i className="fas fa-star"></i> Ôn tập Học kì 1</div>
            <ul className="lesson-list">
              <li><a href="/VBT/vbtontaphk1.html" className="lesson-link"><i className="fas fa-book-open"></i> Vở bài tập</a></li>
              <li><a href="SGK/ontaphk1.html" className="lesson-link"><i className="fas fa-check-square"></i> Trắc nghiệm</a></li>
            </ul>
          </div>

          <div className="topic-card review-card">
            <div className="topic-header"><i className="fas fa-star"></i> Ôn tập Học kì 2</div>
            <ul className="lesson-list">
              <li><a href="/VBT/vbtontaphk2.html" className="lesson-link"><i className="fas fa-book-open"></i> Vở bài tập</a></li>
              <li><a href="SGK/ontaphk2.html" className="lesson-link"><i className="fas fa-check-square"></i> Trắc nghiệm</a></li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        &copy; 2025 - Website hỗ trợ học tập Tin học 4 | GV Nguyễn Đình Bạch Long
        <div>Email: dinhlongcntt20119@gmail.com  |  SĐT: 0937438939</div>
        <div>STK: 0937438939  |  Ngân hàng: Vietinbank</div>
      </footer>
    </>
  );
}

