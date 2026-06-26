const contentDiv = document.getElementById("targetkv4");
const paginationDiv = document.getElementById('pagination');

const ROWS_PER_PAGE = 100;
let originalData = []; // Dữ liệu gốc từ XML
let currentData = [];  // Dữ liệu hiện tại (có thể đã lọc)

function loadXMLAndDisplay() {
  fetch('DSnoPhiKV4.xml')
    .then(response => response.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(data => {
      const rows = data.getElementsByTagName('Row');
      for (let row of rows) {
        const STT = row.getElementsByTagName('STT')[0]?.textContent || '';
        const MaDV = row.getElementsByTagName('MaDV')[0]?.textContent || '';
        const TenDV = row.getElementsByTagName('TenDV')[0]?.textContent || '';
        const TongTien = row.getElementsByTagName('TongTien')[0]?.textContent || '';
		const TenHQ = row.getElementsByTagName('TenHQ')[0]?.textContent || '';
        originalData.push({ STT, MaDV, TenDV, TongTien, TenHQ });
      }
      currentData = [...originalData]; // Ban đầu giống nhau
      displayPage(1, false);
      createPagination(1);
    });
}

function displayPage(page, isFiltered = false) {
  const start = (page - 1) * ROWS_PER_PAGE;
  const end = start + ROWS_PER_PAGE;
  const pageData = currentData.slice(start, end);
  const showResetBtn = isFiltered;

  contentDiv.innerHTML = `
    <p><strong>Dưới đây là danh sách nợ lệ phí quá hạn 60 ngày, tính đến thời điểm 18/11/2025 (Trang ${page}):</strong></p>
	<p><i>(Các đơn vị vui lòng liên hệ với Đội Hải quan ngoài cửa khẩu thuộc Chi cục Hải quan khu vực IV để được xác định cụ thể các tờ khai đang nợ lệ phí)</i></p><br/>
    <p>
      Tìm kiếm nhanh: 
      <input type="text" id="searchBox" placeholder="Nhập Mã DV hoặc Tên DV..." style="padding: 6px; width: 300px;">
      <button onclick="performSearch()" style="padding: 6px 12px; margin-left: 5px;">Tìm kiếm</button>
      ${showResetBtn ? `<button onclick="resetSearch()" style="padding: 6px 12px; margin-left: 5px;">Reset</button>` : ''}
    </p><br/>
    <table border="1" width="100%" style="table-layout:auto;">
      <tr style="background-color: #5EB7F8; color: white; align:center;">
        <th style="text-align: center;">STT</th><th style="text-align: center;">Mã DV</th><th  style="text-align: center;">Tên đơn vị</th><th style="text-align: center;">Lệ phí nợ (VNĐ)</th><th style="text-align: center;" >Tên Hải quan</th>
      </tr>
      ${pageData.map(item => `
        <tr>
          <td>${item.STT}</td>
          <td>${item.MaDV}</td>
          <td style="text-align: left;">${item.TenDV}</td>
          <td style="text-align: right;">${Number(item.TongTien).toLocaleString('vi-VN')}</td>
		  <td style="text-align: left;">${item.TenHQ}</td>
        </tr>`).join('')}
    </table>
  `;

  // Kích hoạt sự kiện Enter sau khi DOM được cập nhật
  const searchBox = document.getElementById("searchBox");
  searchBox.addEventListener("keypress", function (e) {
    if (e.key === "Enter") performSearch();
  });
}

function createPagination(currentPage = 1) {
  const totalPages = Math.ceil(currentData.length / ROWS_PER_PAGE);
  const maxVisiblePages = 5;
  paginationDiv.innerHTML = '';

  const addButton = (text, page, disabled = false) => {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.disabled = disabled;
    btn.className = 'page-btn';
    btn.onclick = () => {
      displayPage(page, currentData !== originalData);
      createPagination(page);
    };
    paginationDiv.appendChild(btn);
  };

  addButton('<<', 1, currentPage === 1);
  addButton('<', currentPage - 1, currentPage === 1);

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement('button');
    btn.innerText = i;
    btn.className = 'page-btn';
    if (i === currentPage) btn.style.fontWeight = 'bold';
    btn.onclick = () => {
      displayPage(i, currentData !== originalData);
      createPagination(i);
    };
    paginationDiv.appendChild(btn);
  }

  if (endPage < totalPages) {
    const ellipsis = document.createElement('span');
    ellipsis.innerText = ' ... ';
    paginationDiv.appendChild(ellipsis);
  }

  addButton('>', currentPage + 1, currentPage === totalPages);
  addButton('>>', totalPages, currentPage === totalPages);
}

function performSearch() {
  const query = document.getElementById("searchBox").value.toLowerCase().trim();
  if (!query) return;

  currentData = originalData.filter(item =>
    item.MaDV.toLowerCase().includes(query) ||
    item.TenDV.toLowerCase().includes(query)
  );
  displayPage(1, true);
  createPagination(1);
}

function resetSearch() {
  document.getElementById("searchBox").value = '';
  currentData = [...originalData];
  displayPage(1, false);
  createPagination(1);
}

loadXMLAndDisplay();

