// JavaScript Document
// Load dữ liệu từ file XML bằng JavaScript
    fetch('../vbpl-data.xml')
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'application/xml');
        const rows = xmlDoc.getElementsByTagName('vbpl');
        const tableBody = document.getElementById('table-body');

        for (let i = 0; i < rows.length; i++) {
		  const type = rows[i].getElementsByTagName('type')[0].textContent;
      
      	  if (type === '1') {		
          const date = rows[i].getElementsByTagName('date')[0].textContent;
          const links = rows[i].getElementsByTagName('links')[0].textContent;
		  const organ = rows[i].getElementsByTagName('organ')[0].textContent;
          const quote = rows[i].getElementsByTagName('quote')[0].textContent;
		  const sohieu = rows[i].getElementsByTagName('sohieu')[0].textContent;

          const row = `
            <tr>
              <td valign ="midle" align ="center"><a href="${links}">${organ}</a></td>
              <td valign ="midle" align ="center"><a href="${links}">${sohieu}</a></td>
			  <td valign ="midle"><a href="${links}">${quote}</a></td>
              <td valign ="midle" align ="center">${date}</td>
            </tr>
          `;
		  
          tableBody.innerHTML += row;
        }
		}
      });