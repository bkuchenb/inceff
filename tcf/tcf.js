//Global variables.
//var home = 'http://localhost/inceff/tcf/index.php';
var home = 'http://www.increase-efficiency.net/tcf/index.php';
var sport = '';
var year = '';
var letter = '';
var row_num = 0;
//Make the logo reset the web page when clicked.
document.getElementById('btn_logo').addEventListener('click', function(event){
	event.preventDefault();
	window.location.href = home;
}, false);
//Create the sport buttons.
cr_btns_sport();
function cL_btns_letter(btn_temp){
	btn_temp.addEventListener('click', function(event){
		event.preventDefault();
		//Save the name of the chosen letter.
		letter = btn_temp.innerHTML;
		//Update the navbar.
		document.getElementById('link_letter').innerHTML = letter;
		document.getElementById('link_letter').addEventListener('click', function(event){
			//Clear the buttons.
			c3_C_r2.innerHTML = '';
			//Create the letter buttons to allow the user to re-choose the letter.
			cr_btns_letter();
		}, false);
		//Clear the buttons.
		document.getElementById('c3_C_r2').innerHTML = '';
		var column_names = ['Year', 'Set', 'Location', 'Sales'];
		//Create the tables needed to display the set data.
		cr_layout_tcf(column_names);
		//Get the sets that that correspond to the chosen buttons.
		get_set_list2();
		
	}, false);
}
function cL_btn_sport(btn_temp){
	btn_temp.addEventListener('click', function(event){
		event.preventDefault();
		//Save the name of the chosen sport.
		sport = btn_temp.innerHTML;
		//Update the navbar.
		document.getElementById('link_sport').innerHTML = sport;
		document.getElementById('link_sport').addEventListener('click', function(event){
			//Return to the homepage and reset all data.
			window.location.href = home;
		}, false);
		//Clear the buttons.
		document.getElementById('c3_C_r2').innerHTML = '';
		//Create the year buttons.
		cr_btns_year();
	}, false);
}
function cL_btn_year(btn_temp){
	btn_temp.addEventListener('click', function(event){
		event.preventDefault();
		//Save the name of the chosen year.
		year = btn_temp.innerHTML;
		//Update the navbar.
		document.getElementById('link_year').innerHTML = year;
		document.getElementById('link_year').addEventListener('click', function(event){
			//Clear the buttons.
			document.getElementById('c3_C_r2').innerHTML = '';
			//Create the year buttons to allow the user to re-choose the year.
			cr_btns_year();
		}, false);
		//Clear the buttons.
		document.getElementById('c3_C_r2').innerHTML = '';
		//Create the letter buttons.
		cr_btns_letter();
	}, false);
}
function cr_btns_letter(){
	var btn_list = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
	'M','N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ', '%'];
	var row = 0;
	var div_temp = '';
	for(var i = 0; i < btn_list.length; i++){
		var btn_temp = document.createElement('button');
		//Add an action listener to each button.
		cL_btns_letter(btn_temp);
		btn_temp.className = 'medium green button';
		if(btn_list[i] == ' '){
			btn_temp.className += ' btn_hidden';
		}
		btn_temp.innerHTML = btn_list[i];
		//Create a new row after 7 buttons are created.
		if(i % 7 == 0){
			//Create a new row.
			div_temp = document.createElement('div');
			div_temp.id = 'btn_row_' + row;
			div_temp.className = 'div_btn_letter';
			row++;
			//Add the button to the row.
			div_temp.appendChild(btn_temp);
			//Add the row the the center div.
			document.getElementById('c3_C_r2').appendChild(div_temp);
		}
		else{
			//Add the row the the center div.
			div_temp.appendChild(btn_temp);
		}
	}	
}
function cr_btns_sport(){
	var btn_list = ['Baseball', 'Football', 'Basketball', 'Hockey',
						  'Nonsports', 'Multisport', 'Racing', 'Wrestling',
						  'Soccer', 'Golf', 'Magic', 'YuGiOh',
						  'Pokemon', 'Gaming', 'Diecast', ' '];
	//Used to name the button rows.
	var row = 0;
	var div_temp = '';
	for(var i = 0; i < btn_list.length; i++){
		var btn_temp = document.createElement('button');
		btn_temp.className = 'xlarge green button';
		if(btn_list[i] == ' '){
			btn_temp.className += ' btn_hidden';
		}
		btn_temp.innerHTML = btn_list[i];
		//Add a listener to each button.
		cL_btn_sport(btn_temp);
		//Create a new row after 4 buttons are created.
		if(i % 4 == 0){
			div_temp = document.createElement('div');
			div_temp.id = 'btn_row_' + row;
			div_temp.className = 'div_btn_sport';
			row++;
			//Add the button to the row.
			div_temp.appendChild(btn_temp);
			//Add the row to the center div.
			document.getElementById('c3_C_r2').appendChild(div_temp);
		}
		else{
			//Add the button to the row.
			div_temp.appendChild(btn_temp);
		}
	}
}
function cr_btns_year(){
	var row = 0;
	var div_temp = '';
	for(var i = 1930; i < 2020; i++){
		var btn_temp = document.createElement('button');
		//Add a listener to each button.
		cL_btn_year(btn_temp);
		btn_temp.className = 'large green button';
		btn_temp.innerHTML = i;
		//Create a new row after 10 buttons are created.
		if(i % 10 == 0){
			//Create a new row.
			div_temp = document.createElement('div');
			div_temp.id = 'btn_row_' + row;
			div_temp.className = 'div_btn_year';
			row++;
			//Add the button to the row.
			div_temp.appendChild(btn_temp);
			//Add the row to the center div.
			document.getElementById('c3_C_r2').appendChild(div_temp);
		}
		else{
			//Add the button to the row.
			div_temp.appendChild(btn_temp);
		}
	}	
}
function cr_layout_tcf(column_names){
	//Clear the area where two tables will go.
	var c3_C_r1 = document.getElementById('c3_C_r1');
	c3_C_r1.innerHTML = '';
	c3_C_r1.className = 'c3_C_r1_tcf';
	var c3_C_r2 = document.getElementById('c3_C_r2');
	c3_C_r2.innerHTML = '';
	//Create table1.
	var temp_div_table = document.createElement('div');
	temp_div_table.id = 'table1';
	temp_div_table.className = 'table';
	var temp_div_thead = document.createElement('div');
	temp_div_thead.id = 'thead';
	var temp_div_tr = document.createElement('div');
	temp_div_tr.id = 'thead_tr';
	temp_div_tr.className = 'tr';
	//Create the cells for the thead_row.
	for(var i = 0; i < column_names.length; i++){
		var temp_div_th = document.createElement('div');
		temp_div_th.id = 'th' + i;
		temp_div_th.className = 'th';
		temp_div_th.innerHTML = column_names[i];
		temp_div_tr.appendChild(temp_div_th);
	}
	//Add the elements to the layout.
	temp_div_thead.appendChild(temp_div_tr);
	temp_div_table.appendChild(temp_div_thead);
	c3_C_r1.appendChild(temp_div_table);
	
	//Create table2.
	var temp_div_table = document.createElement('div');
	temp_div_table.id = 'table2';
	temp_div_table.className = 'table';
	var temp_div_tbody = document.createElement('div');
	temp_div_tbody.id = 'tbody';
	//Add the elements to the layout.
	temp_div_table.appendChild(temp_div_tbody);
	c3_C_r2.appendChild(temp_div_table);
}
function cr_row_tcf(temp_list){
	//Create a new row.
	var temp_div_tr = document.createElement('div');
	temp_div_tr.id = 'tbody_tr' + row_num;
	temp_div_tr.className = 'tr tbody_tr';
	//Create the cells for the tbody_tr.
	for(var i = 0; i < 4; i++){
		//Create the cell.
		var temp_div_td = document.createElement('div');
		temp_div_td.className = 'td td' + i;
		temp_div_td.innerHTML = temp_list[i];
		//Add the cell to the row.
		temp_div_tr.appendChild(temp_div_td);
	}
	//Add the row to table2.
	document.getElementById('tbody').appendChild(temp_div_tr);
	//Update the row number.
	row_num++;
}
function get_set_list(){
	var xhttp = new XMLHttpRequest();
	var post_data = 'category=' + sport + '&year=' + year + '&letter=' + letter;
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState == 4 && xhttp.status == 200){
			//Get the set list with sales totals.
			var json_list = JSON.parse(xhttp.responseText);
			//Add the data to table2.
			for(var i = 0; i < json_list.length; i++){
				cr_row_tcf(json_list[i]);
			}
		}
	}
	xhttp.open("POST", "ajax.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(post_data);
}
function get_set_list2(){
	var json_list = [{'set_year': '1990', 'set_name': 'Topps', 'total': '19.47', 'location': '267'},
				{'set_year': '1991', 'set_name': 'Topps', 'total': '20.47', 'location': 'top loader'},
				{'set_year': '1992', 'set_name': 'Topps', 'total': '21.47', 'location': ''},
				{'set_year': '1993', 'set_name': 'Topps', 'total': '22.47', 'location': '27'}]
	//Add the data to table2.
	for(var i = 0; i < json_list.length; i++){
		var temp_list = Object.keys(json_list[i]).map(function(key){
			return json_list[i][key];
		});
		cr_row_tcf(temp_list);
	}
}
function create_table(parent_node_id, column_names, json_list, json_list_keys){
	//Clear the area where the table will go.
	var parent_node = document.getElementById(parent_node_id);
	parent_node.innerHTML = '';
	//Create a table with and associated elements.
	var temp_table = document.createElement('table');
	temp_table.id = 'table_1';
	temp_table.className = 'table_1';
	var temp_thead = document.createElement('thead');
	var temp_row = document.createElement('tr');
	temp_row.id = 'thead_row';
	temp_row.className = 'thead_row';
	//Create the th cells for the thead_row.
	for(var i = 0; i < column_names.length; i++){
		var temp_th = document.createElement('th');
		temp_th.innerHTML = column_names[i];
		temp_th.className = 'th_' + i;
		temp_row.appendChild(temp_th);
	}
	//Add the thead elements to table.
	temp_thead.appendChild(temp_row);
	temp_table.appendChild(temp_thead);
	var temp_tbody = document.createElement('tbody');
	//Create a new row for each entry in the json_list.
	for(var i = 0; i < json_list.length; i++){
		var temp_row = document.createElement('tr');
		temp_row.id = 'tbody_row_' + i
		temp_row.className = 'tbody_row';
		//Create alternate striping for the rows.
		if (!(i % 2 === 0)){
			temp_row.style.backgroundColor = '#D3D3D3';
		}
		//Create cells for the row and populate with the data.
		for(var j = 0; j < json_list_keys.length; j++){
			var temp_td = document.createElement('td');
			temp_th.className = 'td_' + j;
			temp_td.innerHTML = json_list[i][json_list_keys[j]];
			temp_row.appendChild(temp_td);
		}
		temp_tbody.appendChild(temp_row);
	}
	//Add the tbody element to the table.
	temp_table.appendChild(temp_tbody);
	//Add the table to the parent_node.
	parent_node.appendChild(temp_table);
}