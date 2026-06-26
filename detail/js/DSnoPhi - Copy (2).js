const contentDiv = document.getElementById('news-link');
const paginationDiv = document.getElementById('pagination');

const ROWS_PER_PAGE = 100;
let dataList = [];
let filteredList = [];
let currentPage = 1;

function loadXMLAndDisplay() {
  fetch('DSnoPhi.xml')
    .then(response => response.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(data => {
      const rows = data.getElementsByTagName('Row');
      for (let row of rows) {
        const STT = row.getElementsByTagName('STT')[0]?.textContent || '';
        const MaDV = row.getElementsByTagName('MaDV')[0]?.textContent || '';
        const TenDV = row.getElementsByTagName('TenDV')[0]?.textContent || '';
        const TongTien = row.getElementsByTagName('TongTien')[0]?.textContent || '';
        dataList.push({ STT, MaDV, TenDV, TongTien });
      }
      filteredList = [...dataList]; // ban đầu hiển thị tất cả
      displayPage(1);
      createPagination(1);
    });
}

function displayPage(page) {
  currentPage = page;
  const start = (page - 1) * ROWS_PER_PAGE;
  const end = start + ROWS_PER_PAGE;
  const pageData = filteredList.slice(start, end);

  contentDiv.innerHTML = `
    <p><strong>Dưới đây là danh sách chi tiết tính đến thời điểm 25/03/2025 (Trang ${page}):</strong></p><br/>
    <p>Tìm kiếm nhanh: 
      <input type="text" id="searchBox" placeholder="Nhập Mã DV hoặc Tên DV..." style="padding: 6px; width: 300px;">
      <button onclick="performSearch()" style="padding: 6px 12px; margin-left: 5px;">Tìm kiếm</button>
	  <button onclick="resetSearch()" style="padding: 6px 12px; margin-left: 5px;">Hiển thị tất cả</button>
    </p><br/>
    <table border="1" width="100%">
      <tr style="background-color: #007bff; color: white;">
        <th>STT</th><th>Mã DV</th><th>Tên DV</th><th>Tổng Tiền</th>
      </tr>
      ${pageData.map(item => `
        <tr>
          <td>${item.STT}</td>
          <td>${item.MaDV}</td>
          <td>${item.TenDV}</td>
          <td>${Number(item.TongTien).toLocaleString('vi-VN')}</td>
        </tr>`).join('')}
    </table>
  `;

  // Gắn lại sự kiện Enter sau khi render lại ô input
  document.getElementById("searchBox").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      performSearch();
    }
  });
}

function createPagination(currentPage = 1) {
  const totalPages = Math.ceil(filteredList.length / ROWS_PER_PAGE);
  const maxVisiblePages = 5;
  paginationDiv.innerHTML = '';

  const addButton = (text, page, disabled = false) => {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.disabled = disabled;
    btn.className = 'page-btn';
    btn.onclick = () => {
      displayPage(page);
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
      displayPage(i);
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
  const query = document.getElementById('searchBox').value.toLowerCase().trim();
  filteredList = dataList.filter(item =>
    item.MaDV.toLowerCase().includes(query) ||
    item.TenDV.toLowerCase().includes(query)
  );
  displayPage(1);
  createPagination(1);
}

loadXMLAndDisplay();
