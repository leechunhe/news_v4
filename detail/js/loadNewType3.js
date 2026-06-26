   fetch('data.xml')
	  .then(response => response.text())
	  .then(data => {
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(data, 'text/xml');
		const newsList = xmlDoc.getElementsByTagName('new');
	
		const container = document.querySelector('#news-link');
		const table = document.createElement('table');
		table.setAttribute('border', '0');
		table.setAttribute('width', '100%');

		for (let i = 0; i < newsList.length; i++) {
		  const newElem = newsList[i];
		  const type = newElem.querySelector('type').textContent;
      
      	if (type === '3') {
		  const type = newElem.querySelector('type').textContent;
		  const date = newElem.querySelector('date').textContent;
		  const links = newElem.querySelector('links').textContent;
		  const title = newElem.querySelector('title').textContent;
		  const quote = newElem.querySelector('quote').textContent;
		  const imgSrc = newElem.querySelector('imgs').textContent;
		  const isImp = newElem.querySelector('isImp') ? newElem.querySelector('isImp').textContent : '0';
      
      	  const titleStyle = isImp === '1' ? 'style="color: red; font-weight: bold; font-family:tahoma;"' : '';
	
		  const tr1 = document.createElement('tr');
		  tr1.innerHTML = `<td width="100%" colspan="3"><div class="maunennews"><img src="Images/calendar-16.png" id="no-border">&nbsp;Ngày đăng: ${date}</div></td>`;
	
		  const tr2 = document.createElement('tr');
		  tr2.innerHTML = `
			<td><a href="${links}" ${titleStyle} ><strong>${title}</strong></a><br></td>
			<td width="5px" rowspan="2">&nbsp; &nbsp; &nbsp; &nbsp;</td>
			<td width="25%" rowspan="2"><a href="${links}"><img src="${imgSrc}" height="140px" width="100%" id="no-border"></a></td>
		  `;
	
		  const tr3 = document.createElement('tr');
		  tr3.innerHTML = `
			<td valign="top">
			  <div class="Doanvannd-e"><a href="${links}">${quote}</a></div>
			</td>
		  `;
	
		  table.appendChild(tr1);
		  table.appendChild(tr2);
		  table.appendChild(tr3);
		  const br = document.createElement('br'); // Thêm thẻ <br>
          table.appendChild(br);
		}
		}
	
		container.appendChild(table);
	  })
	  .catch(error => console.error('Error:', error));

