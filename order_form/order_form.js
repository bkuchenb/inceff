/*jshint maxerr:200 */
/* Naming Conventions:
cL = create listener
cr = create
"layout" refers to the initial div elements that are present
 when the page loads */
//Global variables.
var row_num = 0;
var in_list = false;
var match_found = false;
//(1)function call------------------------------------------------------------>
console.log('(1)function call');
cr_options();
//Load the inventory. This will be replaced with an ajax call.
var inventory = get_inventory();
/* Create a drop down box and radio buttons to allow the user to select
their cost center and the type of order they would like to place. */
/* //Create the initial table for order entry.
create_table('c3_center', column_names);
//Create flags for items in formulary and already scanned.
var in_formulary = false;
var found_match = false; */
/* //Get the first item element.
var items = document.getElementsByClassName('items');
var item = items[items.length - 1];
//Place the cursor in the first empty cell.
item.focus();
//Add an action listener to the item_number field (ClassName = items).
create_listener_input_item_number(item);
//Create an action listener for the first button.
create_listener_btn_delete(document.getElementById('btn_0')); */
function create_listener_btn_delete(btn_delete){
	//When clicked, remove the element.
	btn_delete.addEventListener('click', function(event){
		event.preventDefault();
		//Get the tr element that should be deleted.
		var row_id = btn_delete.id.replace('btn_', '');
		console.log('Row ' + row_id + ' has been deleted.');
		//Delete the row.
		document.getElementById('table_body').deleteRow(row_id);
		//Get the remaining delete buttons.
		var btns_remain = document.getElementsByClassName('btn_delete');
		//Re-number the delete buttons.
		for(var y = 0; y < btns_remain.length; y++){
			btns_remain[y].id = ('btn_' + y);
		}
	}, false);
}
function cL_btn_load_order_form(temp_btn){
	//When clicked, load the order form.
	temp_btn.addEventListener('click', function(event){
		//Change the temp_btn name to Reset.
		temp_btn.innerHTML = 'Reset Order Form';
		//Create the order form layout and the first row.
//(3)function call------------------------------------------------------------>
		console.log('(3)function call');
		cr_order_form_layout();
	}, false);
}
function cL_btn_print(temp_btn){
	//Add an event listener to the print button.
	temp_btn.addEventListener('click', function(event){
		/* //Get all the items that need to be printed.
		var row_list = document.getElementsByClassName('row');
		var item_number_list = document.getElementsByClassName('item_number');
		var item_order_list = document.getElementsByClassName('item_order');
		var desc_order = document.getElementsByClassName('desc_order');
		var source_order_list = document.getElementsByClassName('source_order');
		var qty_list = document.getElementsByClassName('qty');
		var location_list = document.getElementsByClassName('location');
		var uom_order_list = document.getElementsByClassName('uom_order');
		//Create a variable to store price information
		var total_price = 0;
		//Create a csv list of all the data.
		var csv = [];
		for(var i = 0; i < item_order_list.length - 1; i++){
			csv.push(location_list[i + 1].innerHTML + ',' + item_order_list[i].innerHTML
			+ ',' + desc_order[i].innerHTML	+ ',' + source_order_list[i].innerHTML
			+ ',' + qty_list[i].value + ',' + row_list[i].id + ',' + uom_order_list[i].innerHTML);
		}
		//Reorder the items in the csv list.
		var sorted_locations = sortAlphaNum(csv);
		//Cycle through the sorted list.
		for(var j = 0; j < sorted_locations.length; j++){
			//Split the array.
			var row_array = sorted_locations[j].split(',');
			//Update each field in the order form.
			if(row_array[0].slice(0, 1) == '0'){
				location_list[j + 1].innerHTML = row_array[0].slice(1);
			}
			else{
				location_list[j + 1].innerHTML = row_array[0];
			}
			item_order_list[j].innerHTML = row_array[1];
			desc_order[j].innerHTML = row_array[2];
			source_order_list[j].innerHTML = row_array[3];
			qty_list[j].value = row_array[4];
			item_number_list[j + 1].innerHTML = row_array[5];
			uom_order_list[j].innerHTML = row_array[6];
			//Calculate the total cost for the order.
			for(i = 0; i < formulary.length; i++){
				if(formulary[i]['ItemNumber'] == row_array[5]){
					total_price = total_price + (formulary[i]['Price'] * row_array[4])
				}
			}
			/* //Replace the item_number value with line #.
			item_number_list[j + 1].innerHTML = j + 1;
		}
		//Get the cost center from the drop box.
		var cost_center = document.getElementsByTagName('select')[0].value;
		//Add the cost center and total price under the table.
		var temp_element = document.createElement('p')
		temp_element.innerHTML = 'Total for cost center ' + cost_center
											+ ' = ' + '$' + total_price.toFixed(2);
		temp_element.style.fontWeight = 'bold';
		document.getElementById('c3_center').appendChild(temp_element);
		/* //Update the item_number column heading.
		item_number_list[0].innerHTML = 'Line';
		window.print(); */
	}, false);
}
function cL_btn_delete(temp_btn){
	//When clicked, remove the element.
	temp_btn.addEventListener('click', function(event){
		//Get the tr element that should be deleted.
		var row_id = temp_btn.id.replace('_btn_delete', '');
		var tbody = document.getElementById('tbody');
		//Delete the row.
		for(var i = 0; i < tbody.childNodes.length; i++){
			if(tbody.childNodes[i].id == row_id){
				tbody.removeChild(tbody.childNodes[i]);
			}
		}
		//Re-number the rows and buttons. Re-stripe the rows.
		var tr_list = document.getElementsByClassName('tbody_tr');
		var btn_list = document.getElementsByClassName('btn_delete');
		var td0_input_list = document.getElementsByClassName('td0_input');
		var td5_input_list = document.getElementsByClassName('td5_input');
		for(var i = 0; i < tr_list.length; i++){
			tr_list[i].id = 'tbody_tr' + (i);
			//Don't stripe the last row.
			if(i != tr_list.length - 1){
				//Get the row number.
				var tr_num = parseInt(tr_list[i].id.replace('tbody_tr', ''));
				//Cycle through the td elements in the row.
				for(var j = 0; j < tr_list[i].childNodes.length - 1; j++){
					//Get the className and either add or remove "odd_row".
					temp_str = tr_list[i].childNodes[j].className;
					//Check to see if row is even.
					if(tr_num % 2 === 0){
						//Remove className "odd_row" if found.
						if(temp_str.indexOf('odd_row') !== -1){
							temp_str = temp_str.replace(' odd_row', '');
							tr_list[i].childNodes[j].className = temp_str;
						}	
					}
					//Row is odd.
					else{
						if(temp_str.indexOf('odd_row') === -1){
							tr_list[i].childNodes[j].className += ' odd_row';
						}
					}
				}
			}
			//Reset the button id, td0_input, and td5_input.
			btn_list[i].id = tr_list[i].id + '_btn_delete';
			td0_input_list[i].id = tr_list[i].id + '_td0_input';
			td5_input_list[i].id = tr_list[i].id + '_td5_input';
		}
		//Reset the row_num.
		if(row_num > 1){
			row_num = tr_list.length - 1;
		}
	}, false);
}
function cL_td0_input(temp_input){
	//Add an event listener to the input cell.
	temp_input.addEventListener('keyup', function(event){
		event.preventDefault();
		if(event.keyCode == 13){
			match_found = false;
			//Update the item details.
//(8)function call------------------------------------------------------------>
			console.log('(8)function call');
			get_item_data(temp_input);
			//Get the navbar element.
			var navbar = document.getElementById('navbar');
			//Create a button for printing the order.
			if(!navbar.contains(document.getElementById('btn_print'))){
				var temp_btn = document.createElement('button');
				temp_btn.id = 'btn_print';
				temp_btn.innerHTML = 'Print Pick List';
				//Create an action listener for the print button.
//(9)function call------------------------------------------------------------>
				console.log('(9)function call');
				cL_btn_print(temp_btn);
				//Add the button to the navbar.
				navbar.appendChild(temp_btn);
			}
		}
	}, false);
}
function cL_td5_input(temp_input){
	//Add an event listener to the input cell.
	temp_input.addEventListener('keyup', function(event){
		event.preventDefault();
		if(event.keyCode == 13){
			//Get all the td0_input elements.
			td0_input_list = document.getElementsByClassName('td0_input');
			//Check the ItemNumber to see if it has already been added.
			temp_str = td0_input_list[td0_input_list.length - 1].value;
			//Cycle through the elments to see if there is a match.
			//Skip the last element.
			for(var i = 0; i < td0_input_list.length - 1; i ++){
				//If there is a match, update the original and remove the data.
				if(td0_input_list[i].value == temp_str && td0_input_list.length > 1){
					//Get the input for the Order Qty that is in the same row.
					td5_input_list = document.getElementsByClassName('td5_input');
					//Update the original qty.
					temp_qty = parseInt(td5_input_list[i].value);
					temp_qty += parseInt(temp_input.value);
					td5_input_list[i].value = temp_qty;
					//Delete the last entry.
					tbody = document.getElementById('tbody');
					tbody.removeChild(tbody.childNodes[tbody.childNodes.length - 1]);
					//Reset the row_num.
					row_num--;
				}
			}
			//Create a new row.
			cr_order_form_row();
		}
	}, false);
}
function cr_options(){
	//Clear the parent_node.
	var c3_L_r1 = document.getElementById('c3_L_r1');
	c3_L_r1.innerHTML = '';
	//Create a drop down box for the cost center.
	var temp_div = document.createElement('div');
	temp_div.className = 'c3_L_r1_div1';
	temp_div.innerHTML = 'Please select your cost center';
	var temp_select = document.createElement('select');
	temp_select.className = 'c3_L_r1_select1';
	//Create a cost center list.
	var temp_list = ['', '1234', '2345', '3456', '4567', '5678', '6789'];
	for(var i = 0; i < temp_list.length; i++){
		var temp_option = document.createElement('option');
		temp_option.value = temp_list[i];
		temp_option.innerHTML = temp_list[i];
		temp_select.appendChild(temp_option);
	}
	temp_div.appendChild(temp_select);
	c3_L_r1.appendChild(temp_div);
	
	//Create a drop down box for the order type.
	var temp_div = document.createElement('div');
	temp_div.className = 'c3_L_r1_div2';
	temp_div.innerHTML = 'Please select your order type';
	var temp_select = document.createElement('select');
	temp_select.id = 'c3_L_r1_select2';
	temp_select.className = 'c3_L_r1_select2';
	//Create an order type list.
	var temp_list = ['INV', 'W/S'];
	for(var i = 0; i < temp_list.length; i++){
		var temp_option = document.createElement('option');
		temp_option.value = temp_list[i];
		temp_option.innerHTML = temp_list[i];
		temp_select.appendChild(temp_option);
	}
	temp_div.appendChild(temp_select);
	c3_L_r1.appendChild(temp_div);
	
	//Create a button to load the order form.
	var temp_div = document.createElement('div');
	temp_div.className = 'c3_L_r1_div3';
	var temp_btn = document.createElement('button');
	temp_btn.id = 'btn_loadOrderForm';
	temp_btn.className = 'c3_L_r1_btn1';
	temp_btn.innerHTML = 'Load Order Form';
	//Create a listener for the button.
//(2)function call------------------------------------------------------------>
	console.log('(2)function call');
	cL_btn_load_order_form(temp_btn);
	temp_div.appendChild(temp_btn);
	c3_L_r1.appendChild(temp_div);
}
function cr_order_form_layout(){
	//Clear the area where two tables will go.
	var c3_C_r1 = document.getElementById('c3_C_r1');
	c3_C_r1.innerHTML = '';
	c3_C_r1.className = 'c3_C_r1_orderForm';
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
	var column_names = ['Item Number', 'Vendor Number', 'Description',
					'Source', 'Unit Of Measure', 'Order Qty', 'Delete'];
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
	//Create the first row in the order form.
//(4)function call------------------------------------------------------------>
	console.log('(4)function call');
	cr_order_form_row();
}
function cr_order_form_row(){
	var temp_div_tr = document.createElement('div');
	temp_div_tr.id = 'tbody_tr' + row_num;
	temp_div_tr.className = 'tr tbody_tr';
	//Create the cells for the tbody_tr.
	for(var i = 0; i < 7; i++){
		var temp_div_td = document.createElement('div');
		temp_div_td.className = 'td td' + i;
		temp_div_tr.appendChild(temp_div_td);
	}
	document.getElementById('tbody').appendChild(temp_div_tr);
	
	//Create the input for td0.
	var temp_input = document.createElement('input');
	//Set the id number, className and type.
	temp_input.id = temp_div_tr.id + '_td0_input';
	temp_input.className = 'td_input td0_input';
	temp_input.type = 'text';
	
	//Add the input to the first cell.
	var td0_list = document.getElementsByClassName('td0');
	td0_list[td0_list.length - 1].appendChild(temp_input);
	//Set the focus.
	temp_input.focus();
	//Create a listener for the input.
//(5)function call------------------------------------------------------------>
	console.log('(5)function call');
	cL_td0_input(temp_input);
	
	//Create the input for td5.
	var temp_input = document.createElement('input');
	//Set the id number, className and type.
	temp_input.id = temp_div_tr.id + '_td5_input';
	temp_input.className = 'td_input td5_input';
	temp_input.type = 'text';
	
	//Add the input to cell 5.
	var td5_list = document.getElementsByClassName('td5');
	td5_list[td5_list.length - 1].appendChild(temp_input);
	
	//Create a delete button to remove a row.
	var temp_btn = document.createElement('button');
	//Set the id, className and innerHTML
	temp_btn.id = temp_div_tr.id + '_btn_delete';
	temp_btn.className = 'btn_delete';
	temp_btn.innerHTML = 'Delete';
	//Add the button to cell 6.
	var td6_list = document.getElementsByClassName('td6');
	td6_list[td6_list.length - 1].appendChild(temp_btn);
	//Create a listener for the input.
//(6)function call------------------------------------------------------------>
	console.log('(6)function call');
	cL_td5_input(temp_input);
	//Create a listener for the delete button.
//(7)function call------------------------------------------------------------>
	console.log('(7)function call');
	cL_btn_delete(temp_btn);
	//Update the row number.
	row_num++;
}
function get_item_data(temp_input){
  var item_data = '';
  var in_list = false;
	//Check the inventory (MedId) for a matching ItemNumber.
	for(var i = 0; i < inventory.length; i++){
		if(inventory[i].MedId == temp_input.value){
			item_data = inventory[i];
			in_list = true;
			console.log(inventory[i].MedId
			+ ' was entered in the Item Number input.');
		}
	}
	if(!in_list){
		//Check the inventory (ItemNumber) for a matching ItemNumber.
		for(var i = 0; i < inventory.length; i++){
			if(inventory[i].ItemNumber == temp_input.value){
				item_data = inventory[i];
				in_list = true;
				console.log(inventory[i].ItemNumber
				+ ' was entered in the Item Number input.');
			}
		}
	}
	//No matching MedId or ItemNumber.
	if(!in_list){
		item_data = {
			"MedId": temp_input.value,
			"ItemNumber": temp_input.value,
			"VendNumber": "N/A",
			"ItemDescription": "Invalid ID Number",
			"UOM": "N/A",
			"Source": "N/A",
			"OrderQty": "N/A"};
	}
	//Get all the td elements.
	td_list = document.getElementsByClassName('td');
	//If the row_num is odd, set the backgroundColor to grey.
	if(row_num % 2 === 0){
		for(var i = td_list.length - 7; i < td_list.length - 1; i++){
			td_list[i].className = td_list[i].className + ' odd_row';
		}
	}
	//Get the type of order chosen.
	var order_type = document.getElementById('c3_L_r1_select2');
	//If the Source is W/S set the backgroundColor to red.
	if(item_data.Source == 'W/S' || item_data.Source == 'N/A'){
		for(var i = td_list.length - 7; i < td_list.length - 1; i++){
			td_list[i].className = td_list[i].className + ' invalid_type';
		}
	}
	//Add the item data to the empty cells.
	td_list[td_list.length - 6].innerHTML = item_data.VendNumber;
	td_list[td_list.length - 5].innerHTML = item_data.ItemDescription;
	td_list[td_list.length - 4].innerHTML = item_data.Source;
	td_list[td_list.length - 3].innerHTML = item_data.UOM;
	//Set the focus to the td5_input.
	var td5_input_list = document.getElementsByClassName('td5_input');
	td5_input_list[td5_input_list.length - 1].focus();
}
function create_listener_btn_load_table(btn){
	btn.addEventListener('click', function(event){
		var column_names = ['ID', 'Item Number', 'Vendor Number', 'Item Description', 'UOM',
				   'Order Qty', 'Source', 'Location', 'Price'];
		var json_list = formulary;
		var json_list_keys = ['MedId', 'ItemNumber', 'VendNumber', 'ItemDescription',
					'UOM', 'OrderQty', 'Source', 'Location', 'Price'];
		create_table('c3_center', column_names, json_list, json_list_keys);
	}, false);
}
function create_listener_btn_print(btn_print){
	//Add an event listener to the print button.
	btn_print.addEventListener('click', function(event){
		//Get all the items that need to be printed.
		var row_list = document.getElementsByClassName('row');
		var item_number_list = document.getElementsByClassName('item_number');
		var item_order_list = document.getElementsByClassName('item_order');
		var desc_order = document.getElementsByClassName('desc_order');
		var source_order_list = document.getElementsByClassName('source_order');
		var qty_list = document.getElementsByClassName('qty');
		var location_list = document.getElementsByClassName('location');
		var uom_order_list = document.getElementsByClassName('uom_order');
		//Create a variable to store price information
		var total_price = 0;
		//Create a csv list of all the data.
		var csv = [];
		for(var i = 0; i < item_order_list.length - 1; i++){
			csv.push(location_list[i + 1].innerHTML + ',' + item_order_list[i].innerHTML
			+ ',' + desc_order[i].innerHTML	+ ',' + source_order_list[i].innerHTML
			+ ',' + qty_list[i].value + ',' + row_list[i].id + ',' + uom_order_list[i].innerHTML);
		}
		//Reorder the items in the csv list.
		var sorted_locations = sortAlphaNum(csv);
		//Cycle through the sorted list.
		for(var j = 0; j < sorted_locations.length; j++){
			//Split the array.
			var row_array = sorted_locations[j].split(',');
			//Update each field in the order form.
			if(row_array[0].slice(0, 1) == '0'){
				location_list[j + 1].innerHTML = row_array[0].slice(1);
			}
			else{
				location_list[j + 1].innerHTML = row_array[0];
			}
			item_order_list[j].innerHTML = row_array[1];
			desc_order[j].innerHTML = row_array[2];
			source_order_list[j].innerHTML = row_array[3];
			qty_list[j].value = row_array[4];
			item_number_list[j + 1].innerHTML = row_array[5];
			uom_order_list[j].innerHTML = row_array[6];
			//Calculate the total cost for the order.
			for(i = 0; i < formulary.length; i++){
				if(formulary[i]['ItemNumber'] == row_array[5]){
					total_price = total_price + (formulary[i]['Price'] * row_array[4])
				}
			}
			/* //Replace the item_number value with line #.
			item_number_list[j + 1].innerHTML = j + 1; */
		}
		//Get the cost center from the drop box.
		var cost_center = document.getElementsByTagName('select')[0].value;
		//Add the cost center and total price under the table.
		var temp_element = document.createElement('p')
		temp_element.innerHTML = 'Total for cost center ' + cost_center
											+ ' = ' + '$' + total_price.toFixed(2);
		temp_element.style.fontWeight = 'bold';
		document.getElementById('c3_center').appendChild(temp_element);
		/* //Update the item_number column heading.
		item_number_list[0].innerHTML = 'Line'; */
		window.print();
	}, false);
}
function create_listener_input_order_qty(order_qty_cell){
	//Add an event listener to the input cell.
	order_qty_cell.addEventListener('keyup', function(event){
		event.preventDefault();
		if(event.keyCode == 13){
			//Get all the items inputs.
			var focus_cell = document.getElementsByClassName('items');
			//Move focus to the next items input.
			focus_cell[focus_cell.length - 1].focus();
		}
	}, false);
}
function create_table(parent_node_id, column_names, json_list, json_list_keys){
	//Clear the area where the table will go.
	var parent_node = document.getElementById(parent_node_id);
	parent_node.innerHTML = '';
	var temp_div = document.createElement('div');
	temp_div.id = 'c3_center_row_1';
	//Create a table with only the thead and associated elements.
	var temp_table = document.createElement('table');
	temp_table.id = 'table_1';
	var temp_thead = document.createElement('thead');
	var temp_row = document.createElement('tr');
	temp_row.id = 'thead_row';
	//Create the th cells for the thead_row.
	for(var i = 0; i < column_names.length; i++){
		var temp_th = document.createElement('th');
		temp_th.innerHTML = column_names[i];
		temp_th.id = 'th_' + i;
		temp_row.appendChild(temp_th);
	}
	//Add the thead elements to table.
	temp_thead.appendChild(temp_row);
	temp_table.appendChild(temp_thead);
	//Add the table to the parent_node.
	temp_div.appendChild(temp_table);
	parent_node.appendChild(temp_div);
	
	var temp_div = document.createElement('div');
	temp_div.id = 'c3_center_row_2';
	//Create a table with the tbody and associated elements.
	var temp_table = document.createElement('table');
	temp_table.id = 'table_2';
	var temp_tbody = document.createElement('tbody');
	//Create a new row for each entry in the json_list.
	for(var i = 0; i < json_list.length; i++){
		var temp_row = document.createElement('tr');
		temp_row.id = 'tbody_row_' + i;
		//Create alternate striping for the rows.
		if (!(i % 2 === 0)){
			temp_row.style.backgroundColor = '#D3D3D3';
		}
		//Create cells for the row and populate with the data.
		for(var j = 0; j < json_list_keys.length; j++){
			var temp_td = document.createElement('td');
			temp_td.className = 'td_' + j;
			temp_td.innerHTML = json_list[i][json_list_keys[j]];
			temp_row.appendChild(temp_td);
		}
		temp_tbody.appendChild(temp_row);
	}
	//Add the tbody element to the table.
	temp_table.appendChild(temp_tbody);
	//Add the table to the parent_node.
	temp_div.appendChild(temp_table);
	parent_node.appendChild(temp_div);
}
function create_table(parent_node_id, column_names){
	//Clear the area where the table will go.
	var parent_node = document.getElementById(parent_node_id);
	parent_node.innerHTML = '';
	var temp_div = document.createElement('div');
	temp_div.id = 'c3_center_row_1';
	//Create a table with only the thead and associated elements.
	var temp_table = document.createElement('table');
	temp_table.id = 'table_1';
	var temp_thead = document.createElement('thead');
	var temp_row = document.createElement('tr');
	temp_row.id = 'thead_row';
	//Create the th cells for the thead_row.
	for(var i = 0; i < column_names.length; i++){
		var temp_th = document.createElement('th');
		temp_th.innerHTML = column_names[i];
		temp_th.id = 'th_' + i;
		temp_row.appendChild(temp_th);
	}
	//Add the thead elements to table.
	temp_thead.appendChild(temp_row);
	temp_table.appendChild(temp_thead);
	//Add the table to the parent_node.
	temp_div.appendChild(temp_table);
	parent_node.appendChild(temp_div);
	
	var temp_div = document.createElement('div');
	temp_div.id = 'c3_center_row_2';
	//Create a table with the tbody and associated elements.
	var temp_table = document.createElement('table');
	temp_table.id = 'table_2';
	var temp_tbody = document.createElement('tbody');
	//Create a single row for order entry.
	var temp_row = document.createElement('tr');
	temp_row.id = 'tbody_row_0';
	temp_row.className = 'empty_row';
	//Create alternate striping for the rows.
	if (!(i % 2 === 0)){
		temp_row.style.backgroundColor = '#D3D3D3';
	}
	//Create cells for the row and populate with the data.
	for(var j = 0; j < column_names.length; j++){
		var temp_td = document.createElement('td');
		temp_td.className = 'td_' + j;
		temp_row.appendChild(temp_td);
	}
	temp_tbody.appendChild(temp_row);
	//Add the tbody element to the table.
	temp_table.appendChild(temp_tbody);
	//Add the table to the parent_node.
	temp_div.appendChild(temp_table);
	parent_node.appendChild(temp_div);
	set_row(temp_row.id);
}
function create_row(item){
	//Find the tbody element.
	var tbody = document.getElementById('table_body');
	//Create a new row in the table.
	var row = document.createElement('tr');
	//Set the class name for the row.
	row.className = 'empty_row';
	//Create cells for the next item.
	var cell_0 = document.createElement('td');
	//Set the class name for the item_number cell.
	cell_0.className = 'item_number';
	var cell_1 = document.createElement('td');
	//Set the class name for the item number cell.
	cell_1.className = 'item_order';
	var cell_2 = document.createElement('td');
	//Set the class name for the description cell.
	cell_2.className = 'desc_order';
	var cell_3 = document.createElement('td');
	//Set the class name for the source cell.
	cell_3.className = 'source_order';
	var cell_4 = document.createElement('td');
	//Set the class name for the uom cell.
	cell_4.className = 'uom_order';
	var cell_5 = document.createElement('td');
	var cell_6 = document.createElement('td');
	//Set the class name for the delete button cell.
	cell_6.className = 'delete';
	var cell_7 = document.createElement('td');
	//Set the class name for the location cell.
	cell_7.className = 'location';
	//Create an input for the next item_number.
	var next_item = document.createElement('input');
	//Set the id number, className and type.
	next_item.id = parseInt(item.id) + 1;
	next_item.className = 'items';
	next_item.type = 'text';
	//Create an input for the OrderQty.
	var next_order_qty = document.createElement('input');
	//Create a delete button to remove the next_item.
	var btn_delete = document.createElement('button');
	//Set the className, id and innerHTML
	btn_delete.className = 'btn_delete';
	btn_delete.innerHTML = 'Delete';
	btn_delete.id = 'btn_' + item.id;
	//Set the className and type for the OrderQty input.
	next_order_qty.className = 'qty';
	next_order_qty.type = 'text';
	//Add the item_number input to the first cell.
	cell_0.appendChild(next_item);
	//Add the OrderQty input to the sixth cell.
	cell_5.appendChild(next_order_qty);
	//Add the delete button to the last cell.
	cell_6.appendChild(btn_delete);
	//Add all the cells to the row.
	row.appendChild(cell_0);
	row.appendChild(cell_1);
	row.appendChild(cell_2);
	row.appendChild(cell_3);
	row.appendChild(cell_4);
	row.appendChild(cell_5);
	row.appendChild(cell_6);
	row.appendChild(cell_7);
	//Add the row to the tbody.
	tbody.appendChild(row);
	//Move the cursor to the order qty line.
	var order_qty = document.getElementsByClassName('qty');
	order_qty[order_qty.length - 2].focus();
	//Add an action listener to the new inputs.
	create_listener_input_item_number(next_item);
	create_listener_input_order_qty(order_qty[order_qty.length - 2]);
	//Create a listener for the delete button.
	create_listener_btn_delete(btn_delete);
}
function check_rows(num, qty){
	//Get all the td elements.
	cells = document.getElementsByTagName('td');
	//Cycle through the elments to see if there is a match.
	for(i = 1; i < cells.length; i += 8){
		//If there is a match, update the original and remove the data.
		if(cells[i].innerHTML == num && num != 'N/A'){
			found_match = true;
			//Get the input that corresponds to the matching row.
			update_input = cells[i + 4].getElementsByClassName('qty');
			//Update the original qty.
			update_input[0].value = parseInt(update_input[0].value) + qty;
			//Refresh the list of item elements.
			items = document.getElementsByClassName('items');
			//Delete the last entry
			items[items.length -1].value = '';
			//Set the focus on the first cell of the last row.
			items[items.length -1].focus();
		}
	}
}
function set_row(tr_id){
	//Create an input for the Item Number.
	var temp_input = document.createElement('input');
	//Set the id number, className and type.
	temp_input.id = tr_id + '_td_0';
	temp_input.className = 'td_0_input td_input';
	temp_input.type = 'text';
	//Create a listener for the Item Number input.
	create_listener_input_item_number(temp_input);
	//Add the input to the first cell.
	var td_0_list = document.getElementsByClassName('td_0');
	td_0_list[td_0_list.length - 1].appendChild(temp_input);
	//Set the focus.
	temp_input.focus();
	
	//Create an input for the Order Qty.
	var temp_input = document.createElement('input');
	//Set the className and type for the OrderQty input.
	temp_input.className = 'td_5_input td_input';
	temp_input.type = 'text';
	//Create a listener for the Order Qty input.
	create_listener_input_order_qty(temp_input);
	//Add the input to cell 5.
	var td_5_list = document.getElementsByClassName('td_5');
	td_5_list[td_5_list.length - 1].appendChild(temp_input);
	
	//Create a delete button to remove a row.
	var temp_btn = document.createElement('button');
	//Set the id, className and innerHTML
	temp_btn.id = tr_id + '_td_6';
	temp_btn.className = 'btn_delete';
	temp_btn.innerHTML = 'Delete';
	//Create a listener for the delete button.
	create_listener_btn_delete(temp_btn);
	//Add the button to cell 6.
	var td_6_list = document.getElementsByClassName('td_6');
	td_6_list[td_6_list.length - 1].appendChild(temp_btn);
}
function get_data(item){
  var entry = '';
  var in_formulary = false;
	//Replace the first part of the item_number.
	var med_id = item.value.replace('(S)', '');
	//Check the formulary for a matching MedId.
	for(var k = 0; k < formulary.length; k++){
		if(formulary[k].MedId == med_id){
			entry = formulary[k];
			in_formulary = true;
			console.log(formulary[k].MedId);
		}
	}
	if(!in_formulary){
		//Check the formulary for a matching ItemNumber.
		for(var k = 0; k < formulary.length; k++){
			if(formulary[k].ItemNumber == med_id){
				entry = formulary[k];
				in_formulary = true;
				console.log(formulary[k].ItemNumber);
			}
		}
	}
	//No matching MedId or ItemNumber.
	if(!in_formulary){
		entry = {"MedId": med_id,
		"ItemNumber": "N/A",
		"ItemDescription": "Invalid ID Number",
		"UOM": "N/A",
		"Source": "N/A",
		"OrderQty": "N/A"};
	}
	//Get all the td elements.
	cells = document.getElementsByTagName('td');
	//Check to see if this is a duplicate value.
	check_rows(entry.VendNumber, entry.OrderQty);
	if(!found_match){
		create_row(item);
		//Get the last tr element.
		rows = document.getElementsByTagName('tr');
		//Set the row id to the ItemNumber.
		rows[rows.length - 2].id = entry.ItemNumber;
		//Change the className of the row.
		rows[rows.length - 2].className = 'row';
		//If the row number is even set the backgroundColor to grey.
		if((rows.length - 2) % 2 === 0){
			for(j = 11; j <= 16; j++){
				cells[cells.length - j].style.backgroundColor = '#D3D3D3';
			}
		}
		//If the Source is W/S set the backgroundColor to red.
		if(entry.Source == 'W/S' || entry.Source == 'N/A'){
			for(j = 11; j <= 16; j++){
				cells[cells.length - j].style.backgroundColor = 'Red';
			}
		}
		//Add the data to the cells.
		cells[cells.length - 15].innerHTML = entry.VendNumber;
		cells[cells.length - 14].innerHTML = entry.ItemDescription;
		cells[cells.length - 13].innerHTML = entry.Source;
		cells[cells.length - 12].innerHTML = entry.UOM;
		cells[cells.length - 9].innerHTML = entry.Location;
		/* //Get all the qty inputs.
		quantities = document.getElementsByClassName('qty');
		quantities[quantities.length - 2].value = entry.OrderQty; */
	}
}
function sortAlphaNum(list){
	//Create an aray to temporarily store list entries.
	var temp = [];
	//Cycle through the list.
	for(var x = 0; x < list.length; x++){
		//Get the first two characters.
		var chars = list[x].slice(0, 2);
		//If they are numbers add the entry.
		if(parseInt(chars) > 9){
			temp.push(list[x]);
		}
		//If not, add a leading zero.
		else{
			temp.push('0' + list[x]);
		}
	}
	return temp.sort();
}
function local_compare(temp_list, index){
	temp_list = temp_list.sort(function compare(a,b){
		if(order == 'descending'){
			var temp = a[index].localeCompare(b[index], undefined,
				{numeric: true, sensitivity: 'base'});
			if(temp == 1){return -1;}
			else if(temp == -1){return 1;}
			else{return 0;}
		}
		else{
			return(a[index].localeCompare(b[index], undefined,
				{numeric: true, sensitivity: 'base'}));
		}
	});
	if(order == 'descending'){
		order = 'ascending';
	}
	else{
		order = 'descending';
	}	
}
function get_inventory(){
	var inventory = [
		{"MedId": "", "ItemNumber": "100135", "ItemDescription": "MASK TB N95 REG CONE TEAL", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100161", "ItemDescription": "CA DISOD VERSEN AMP 2.5ML", "UOM": "10 AMPS/CT", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100162", "ItemDescription": "FLECAINIDE TAB 100MG", "UOM": "60 TABS/BO", "Price": 30.4998, "Source": "W/S", "VendNumber": "716629", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100283", "ItemDescription": "BUPIV/EPI .25% 10ML", "UOM": "10 VIALS/CT", "Price": 36.76, "Source": "INV", "VendNumber": "384966", "OrderQty": 10, "Location": "3D6A"},
		{"MedId": "", "ItemNumber": "100285", "ItemDescription": "KIT LARYNGOTRACHEAL ANES", "UOM": "25 KITS/CA", "Price": 460.49, "Source": "INV", "VendNumber": "176615", "OrderQty": 25, "Location": "7F2A"},
		{"MedId": "", "ItemNumber": "100293", "ItemDescription": "DRUG ERYTHRO VL 500MG", "UOM": "10 VIALS/CT", "Price": 597.75, "Source": "INV", "VendNumber": "150813", "OrderQty": 10, "Location": "4B6A"},
		{"MedId": "", "ItemNumber": "100297", "ItemDescription": "CLINDAMYCIN VL 9GM/60ML VIAL", "UOM": "None", "Price": 11.97, "Source": "W/S", "VendNumber": "3977774", "OrderQty": 1, "Location": "3F2B"},
		{"MedId": "", "ItemNumber": "100298", "ItemDescription": "BLEOMYCIN VL 15 UNITS", "UOM": "None", "Price": 34.62, "Source": "INV", "VendNumber": "958801", "OrderQty": 1, "Location": "11C1B"},
		{"MedId": "", "ItemNumber": "100300", "ItemDescription": "NITROPRESS VL 50MG 2ML", "UOM": "None", "Price": 161.87, "Source": "INV", "VendNumber": "429086", "OrderQty": 1, "Location": "5B1A"},
		{"MedId": "", "ItemNumber": "100303", "ItemDescription": "FAMOTIDINE VL 20MG 2ML", "UOM": "25 VIALS/CT", "Price": 16.12, "Source": "INV", "VendNumber": "515938", "OrderQty": 25, "Location": "11E1A"},
		{"MedId": "", "ItemNumber": "100304", "ItemDescription": "FUROSEM VL 100MG 10ML", "UOM": "25 VIALS/CT", "Price": 42.42, "Source": "INV", "VendNumber": "319582", "OrderQty": 25, "Location": "4C3D"},
		{"MedId": "", "ItemNumber": "100305", "ItemDescription": "DRUG LABETALOL VL 100MG 20ML", "UOM": "None", "Price": 2.72, "Source": "INV", "VendNumber": "020313", "OrderQty": 1, "Location": "4D6A"},
		{"MedId": "", "ItemNumber": "100306", "ItemDescription": "NITROGLY VL 50MG", "UOM": "25 VIALS/CT", "Price": 157.75, "Source": "W/S", "VendNumber": "3453784", "OrderQty": 1, "Location": "5B1A"},
		{"MedId": "", "ItemNumber": "100307", "ItemDescription": "METHYLPRED VL 40MG 2ML", "UOM": "25 VIALS/BX", "Price": 103.77, "Source": "INV", "VendNumber": "079158", "OrderQty": 25, "Location": "4F5A"},
		{"MedId": "", "ItemNumber": "100308", "ItemDescription": "DRUG FUROSEM SYR 40MG 4ML", "UOM": "10 SYR/CT", "Price": 91.46, "Source": "INV", "VendNumber": "947820", "OrderQty": 10, "Location": "4C4A"},
		{"MedId": "", "ItemNumber": "100309", "ItemDescription": "NOREPINEPH INJ 4MG 4ML", "UOM": "10 VIALS/CT", "Price": 57.57, "Source": "INV", "VendNumber": "175784", "OrderQty": 10, "Location": "5B1B"},
		{"MedId": "", "ItemNumber": "100311", "ItemDescription": "CALCITRIOL INJ 1MCG/ML", "UOM": "10 VIALS/CT", "Price": 35, "Source": "W/S", "VendNumber": "4537460", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100314", "ItemDescription": "DRUG SUCCINYLCHO FTV200MG/10ML", "UOM": "25 VIALS/CT", "Price": 448.09, "Source": "INV", "VendNumber": "158576", "OrderQty": 25, "Location": "11F1A"},
		{"MedId": "", "ItemNumber": "100318", "ItemDescription": "MEPERIDINE VL 25MG", "UOM": "25 VIALS/CT", "Price": 21.88, "Source": "W/S", "VendNumber": "142354", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100320", "ItemDescription": "LIDOCAINE W/EPI 1% 20ML", "UOM": "25 VIALS/CT", "Price": 25.33, "Source": "INV", "VendNumber": "63323-0482-27", "OrderQty": 25, "Location": "4E4A"},
		{"MedId": "", "ItemNumber": "100321", "ItemDescription": "LIDOCAINE W/EPI 2% 20ML", "UOM": "25 VIALS/CT", "Price": 34.09, "Source": "INV", "VendNumber": "133475", "OrderQty": 25, "Location": "4E5A"},
		{"MedId": "", "ItemNumber": "100323", "ItemDescription": "LIDOCAINE VL 2% 20ML", "UOM": "25 VIALS/CT", "Price": 25, "Source": "INV", "VendNumber": "63323-0486-27", "OrderQty": 25, "Location": "7E3A"},
		{"MedId": "", "ItemNumber": "100326", "ItemDescription": "KETAMINE VL 500MG 5ML", "UOM": "10 VIALS/CT", "Price": 75.78, "Source": "W/S", "VendNumber": "074666", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100327", "ItemDescription": "DOXORUBICIN VL 50MG 25ML", "UOM": "None", "Price": 15.44, "Source": "INV", "VendNumber": "125310", "OrderQty": 1, "Location": "11C2B"},
		{"MedId": "", "ItemNumber": "100328", "ItemDescription": "ERYTHRO BASE TAB 250MG", "UOM": "100 TABS/BO", "Price": 616.86, "Source": "INV", "VendNumber": "143014", "OrderQty": 100, "Location": "2C3E"},
		{"MedId": "", "ItemNumber": "100329", "ItemDescription": "ERYTHRO LIQ 200MG 100ML", "UOM": "None", "Price": 287.27, "Source": "INV", "VendNumber": "572382", "OrderQty": 1, "Location": "6A6D"},
		{"MedId": "", "ItemNumber": "100330", "ItemDescription": "DRUG AMICAR VL 5GM/20ML", "UOM": "25 VIALS/CT", "Price": 131.25, "Source": "INV", "VendNumber": "088789", "OrderQty": 25, "Location": "3C2A"},
		{"MedId": "", "ItemNumber": "100331", "ItemDescription": "KCL FTV 40MEQ 20ML", "UOM": "25 VIALS/CT", "Price": 26.02, "Source": "INV", "VendNumber": "755777", "OrderQty": 25, "Location": "8D1A"},
		{"MedId": "", "ItemNumber": "100332", "ItemDescription": "SOD CHL BACT FTV 30ML", "UOM": "25 VIALS/CT", "Price": 17.5, "Source": "INV", "VendNumber": "160416", "OrderQty": 25, "Location": "9B3A"},
		{"MedId": "", "ItemNumber": "100334", "ItemDescription": "ISOPROTER AMP 1MG 5ML", "UOM": "10 AMPS/CT", "Price": 9071.85, "Source": "INV", "VendNumber": "429100", "OrderQty": 10, "Location": "4D4G"},
		{"MedId": "", "ItemNumber": "100336", "ItemDescription": "MEPERIDINE VL 50MG", "UOM": "25 VIALS/CT", "Price": 23, "Source": "W/S", "VendNumber": "4551180", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100337", "ItemDescription": "DEXTROSE SYR 50% 50ML", "UOM": "10 SYR/CT", "Price": 64.2, "Source": "INV", "VendNumber": "774604", "OrderQty": 10, "Location": "6F2A"},
		{"MedId": "", "ItemNumber": "100338", "ItemDescription": "LIDOCAINE 2% SYR 100MG/5M", "UOM": "10 SYR/CT", "Price": 33.8, "Source": "INV", "VendNumber": "200182", "OrderQty": 10, "Location": "7F1A"},
		{"MedId": "", "ItemNumber": "100339", "ItemDescription": "DRUG AMINOPHY VL 500MG", "UOM": "25 VIALS/CT", "Price": 140, "Source": "INV", "VendNumber": "165910", "OrderQty": 25, "Location": "3C3A"},
		{"MedId": "", "ItemNumber": "100340", "ItemDescription": "SOD BICARB SYR 50ML", "UOM": "10 SYR/CT", "Price": 89.8, "Source": "INV", "VendNumber": "200451", "OrderQty": 10, "Location": "9A1A"},
		{"MedId": "", "ItemNumber": "100341", "ItemDescription": "MEPIVACAINE VL 1%  30ML", "UOM": "None", "Price": 4.28, "Source": "INV", "VendNumber": "2727188", "OrderQty": 1, "Location": "4F3A"},
		{"MedId": "", "ItemNumber": "100344", "ItemDescription": "HEPARIN VL 100U/ML 5ML", "UOM": "25 VIALS/CT", "Price": 32.02, "Source": "INV", "VendNumber": "754945", "OrderQty": 25, "Location": "4D2B"},
		{"MedId": "", "ItemNumber": "100345", "ItemDescription": "DRUG VIT K AMP 10MG 1ML", "UOM": "25 AMPS/CT", "Price": 966.59, "Source": "INV", "VendNumber": "385674", "OrderQty": 25, "Location": "5F4A"},
		{"MedId": "", "ItemNumber": "100346", "ItemDescription": "DRUG SOD BICARB SYR 10MEQ", "UOM": "10 SYR/CT", "Price": 101.9, "Source": "INV", "VendNumber": "2400455", "OrderQty": 10, "Location": "5D5C"},
		{"MedId": "", "ItemNumber": "100348", "ItemDescription": "DRUG HYDROMORP VL 4MG 1ML", "UOM": "10 VIALS/CT", "Price": 18.25, "Source": "W/S", "VendNumber": "477671", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100351", "ItemDescription": "DRUG VERAPAMIL VL 10MG", "UOM": "5 VIALS/CT", "Price": 127.33, "Source": "INV", "VendNumber": "376277", "OrderQty": 5, "Location": "5F3A"},
		{"MedId": "", "ItemNumber": "100353", "ItemDescription": "CLARITHRO TAB 250MG", "UOM": "60 TABS/BO", "Price": 32.4996, "Source": "W/S", "VendNumber": "800589", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100355", "ItemDescription": "KETOROLAC VL 30MG 1ML", "UOM": "25 VIALS/CT", "Price": 20.09, "Source": "INV", "VendNumber": "3239837", "OrderQty": 25, "Location": "4D5B"},
		{"MedId": "", "ItemNumber": "100357", "ItemDescription": "REMIFENTANIL AMP 1MG", "UOM": "10 AMPS/CT", "Price": 547.56, "Source": "W/S", "VendNumber": "782631", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100358", "ItemDescription": "TAMSULOSIN CAP 0.4MG", "UOM": "100 CAPS/BO", "Price": 28.46, "Source": "INV", "VendNumber": "083605", "OrderQty": 100, "Location": "3B1E"},
		{"MedId": "", "ItemNumber": "100359", "ItemDescription": "METHYLPRED VL 125MG", "UOM": "25 VIALS/CT", "Price": 165.22, "Source": "INV", "VendNumber": "079160", "OrderQty": 25, "Location": "5A1A"},
		{"MedId": "", "ItemNumber": "100368", "ItemDescription": "DRUG ENALAPRIL VL 2.5MG 2ML", "UOM": "10 VIALS/CT", "Price": 18.67, "Source": "INV", "VendNumber": "274449", "OrderQty": 10, "Location": "4A4A"},
		{"MedId": "", "ItemNumber": "100370", "ItemDescription": "DIVALPROEX TAB 125MG", "UOM": "100 TABS/BO", "Price": 3.74, "Source": "W/S", "VendNumber": "4097523", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100371", "ItemDescription": "DIVALPROEX SPRNK 125MG", "UOM": "100 CAPS/BX", "Price": 65.58, "Source": "INV", "VendNumber": "275818", "OrderQty": 100, "Location": "2C2B"},
		{"MedId": "", "ItemNumber": "100374", "ItemDescription": "DIVALPROEX SODIUM TAB SR 250MG", "UOM": "80 TABS/BX", "Price": 96.544, "Source": "W/S", "VendNumber": "521601", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100376", "ItemDescription": "SEVOFLURANE 250ML", "UOM": "6 BOTTLES/CT", "Price": 436.56, "Source": "INV", "VendNumber": "485305", "OrderQty": 6, "Location": "9C4B"},
		{"MedId": "", "ItemNumber": "100377", "ItemDescription": "DIVALPROIC ACID TAB SR 500MG", "UOM": "80 TABS/BO", "Price": 160.8, "Source": "INV", "VendNumber": "521524", "OrderQty": 80, "Location": "2C2D"},
		{"MedId": "", "ItemNumber": "100382", "ItemDescription": "MEPIVACAINE VL 2% 20ML", "UOM": "None", "Price": 4, "Source": "INV", "VendNumber": "2727204", "OrderQty": 1, "Location": "4F3B"},
		{"MedId": "", "ItemNumber": "100387", "ItemDescription": "CISATRACURIUM VL 20ML(OR)", "UOM": "10 VIALS/CT", "Price": 1336.28, "Source": "W/S", "VendNumber": "419527", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100388", "ItemDescription": "CLARITHRO LIQ 125MG 50ML", "UOM": "None", "Price": 15.68, "Source": "W/S", "VendNumber": "4022471", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100394", "ItemDescription": "DRUG MORPHINE VL 50MG/ML 50ML", "UOM": "None", "Price": 20.9, "Source": "W/S", "VendNumber": "526436", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100395", "ItemDescription": "DIVALPROEX SODIUM TAB EC 250MG", "UOM": "100 TABS/BO", "Price": 14.14, "Source": "INV", "VendNumber": "378962", "OrderQty": 100, "Location": "2C2C"},
		{"MedId": "", "ItemNumber": "100396", "ItemDescription": "SOL KCL INJ 250ML", "UOM": "12 BOTTLES/CA", "Price": 160.26, "Source": "INV", "VendNumber": "035600", "OrderQty": 12, "Location": "8D2A"},
		{"MedId": "", "ItemNumber": "100397", "ItemDescription": "ACETYLCYS SOL 20% 30ML", "UOM": "3 VIALS/CT", "Price": 16.4001, "Source": "INV", "VendNumber": "4754388", "OrderQty": 3, "Location": "1B3B"},
		{"MedId": "", "ItemNumber": "100398", "ItemDescription": "DRUG GENTAMICIN VL 80MG 2ML", "UOM": "25 VIALS/CT", "Price": 19.11, "Source": "INV", "VendNumber": "053280", "OrderQty": 25, "Location": "4C4D"},
		{"MedId": "", "ItemNumber": "100404", "ItemDescription": "METHYLPRED VL 1GM", "UOM": "None", "Price": 10.98, "Source": "INV", "VendNumber": "030837", "OrderQty": 1, "Location": "4F6A"},
		{"MedId": "", "ItemNumber": "100407", "ItemDescription": "PHENYTOIN INJ. 250MG", "UOM": "25 VIALS/CT", "Price": 28.97, "Source": "INV", "VendNumber": "535872", "OrderQty": 25, "Location": "5C5B"},
		{"MedId": "", "ItemNumber": "100409", "ItemDescription": "DRUG CHROMIUM TRACE VL 10ML", "UOM": "25 VIALS/CT", "Price": 618.75, "Source": "W/S", "VendNumber": "1579770", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100411", "ItemDescription": "DRUG DOBUTAMINE VL 250MG/20ML", "UOM": "10 VIALS/CT", "Price": 44.5, "Source": "INV", "VendNumber": "1320365", "OrderQty": 10, "Location": "3F6B"},
		{"MedId": "", "ItemNumber": "100413", "ItemDescription": "BUPIV TTV .25% 30ML", "UOM": "25 VIALS/CT", "Price": 27.57, "Source": "INV", "VendNumber": "253221", "OrderQty": 25, "Location": "7B5A"},
		{"MedId": "", "ItemNumber": "100414", "ItemDescription": "BUPIVACAINE TTV .5% 30ML", "UOM": "25 VIALS /CT", "Price": 28.81, "Source": "INV", "VendNumber": "253233", "OrderQty": 25, "Location": "3E1A"},
		{"MedId": "", "ItemNumber": "100415", "ItemDescription": "FUROSEM VL 40MG 4ML", "UOM": "25 VIALS/CT", "Price": 33.45, "Source": "INV", "VendNumber": "319576", "OrderQty": 25, "Location": "7C1A"},
		{"MedId": "", "ItemNumber": "100418", "ItemDescription": "METOPROLOL VL 5MG 5ML", "UOM": "10 VIALS/CT", "Price": 4.42, "Source": "INV", "VendNumber": "292180", "OrderQty": 10, "Location": "8B1A"},
		{"MedId": "", "ItemNumber": "100419", "ItemDescription": "ERYTHRO TAB 333MG", "UOM": "100 TABS/BO", "Price": 787.81, "Source": "W/S", "VendNumber": "4438149", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100420", "ItemDescription": "RITONAVIR TAB 100MG", "UOM": "30 TABS/BO", "Price": 236.94, "Source": "W/S", "VendNumber": "014332", "OrderQty": 1, "Location": "10C7B"},
		{"MedId": "", "ItemNumber": "100421", "ItemDescription": "PARICALCITOL VL 2MCG 1ML", "UOM": "25 VIALS/CT", "Price": 144, "Source": "W/S", "VendNumber": "3581667", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100423", "ItemDescription": "DRUG PROCAINAM VL 1GM 2ML", "UOM": "25 VIALS/CT", "Price": 1212.5, "Source": "W/S", "VendNumber": "1139278", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100440", "ItemDescription": "FORMULA SIM H20 2OZ", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100459", "ItemDescription": "LITHIUM TAB 300MG", "UOM": "100 TABS/BX", "Price": 13.67, "Source": "INV", "VendNumber": "576744", "OrderQty": 100, "Location": "2D6C"},
		{"MedId": "", "ItemNumber": "100460", "ItemDescription": "DIPHENOX/ATROP TAB", "UOM": "100 TABS/BO", "Price": 58.04, "Source": "W/S", "VendNumber": "132878", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100492", "ItemDescription": "BOTULINUM TOXIN VL 100U", "UOM": "Dr. W. NOTIS - GI", "Price": 601, "Source": "INV", "VendNumber": "584011", "OrderQty": 1, "Location": "10A2A"},
		{"MedId": "", "ItemNumber": "100493", "ItemDescription": "OFLOX OPH SOL 0.3% 5ML", "UOM": "None", "Price": 54, "Source": "INV", "VendNumber": "404595", "OrderQty": 1, "Location": "1A5D"},
		{"MedId": "", "ItemNumber": "100497", "ItemDescription": "PREDLONE OPH .12% 5ML", "UOM": "None", "Price": 118.36, "Source": "W/S", "VendNumber": "1094408", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100500", "ItemDescription": "MEDIA GROWTH GROMED TSB", "UOM": "None", "Price": 80.3, "Source": "INV", "VendNumber": "GM1400", "OrderQty": 1, "Location": "4C6B"},
		{"MedId": "", "ItemNumber": "100522", "ItemDescription": "ARTIFICIAL TRS 15ML", "UOM": "None", "Price": 1.64, "Source": "INV", "VendNumber": "497883", "OrderQty": 1, "Location": "1A2A"},
		{"MedId": "", "ItemNumber": "100523", "ItemDescription": "GENTAMICIN OPH SOL 5ML", "UOM": "None", "Price": 3.21, "Source": "INV", "VendNumber": "113528", "OrderQty": 1, "Location": "1A4F"},
		{"MedId": "", "ItemNumber": "100524", "ItemDescription": "GENTAMICIN OPH OINT 3.5GM", "UOM": "None", "Price": 13.21, "Source": "INV", "VendNumber": "832956", "OrderQty": 1, "Location": "1A4E"},
		{"MedId": "", "ItemNumber": "100525", "ItemDescription": "ERYTHRO OPH OINT TUBE", "UOM": "None", "Price": 5.95, "Source": "INV", "VendNumber": "831925", "OrderQty": 1, "Location": "1A4B"},
		{"MedId": "", "ItemNumber": "100526", "ItemDescription": "SOD CHL OPH SOL 5% 15ML", "UOM": "None", "Price": 6.19, "Source": "INV", "VendNumber": "698498", "OrderQty": 1, "Location": "1A5G"},
		{"MedId": "", "ItemNumber": "100527", "ItemDescription": "SOD CHL OPH OINT 5% 3.5GM", "UOM": "None", "Price": 6.33, "Source": "INV", "VendNumber": "698399", "OrderQty": 1, "Location": "1A5F"},
		{"MedId": "", "ItemNumber": "100529", "ItemDescription": "FLOURETS OPH STRIPS 100", "UOM": "None", "Price": 8.85, "Source": "INV", "VendNumber": "842649", "OrderQty": 1, "Location": "1A4D"},
		{"MedId": "", "ItemNumber": "100530", "ItemDescription": "ARTIFICIAL TRS OINT 3.5GM", "UOM": "None", "Price": 1.86, "Source": "INV", "VendNumber": "497909", "OrderQty": 1, "Location": "1A1A"},
		{"MedId": "", "ItemNumber": "100532", "ItemDescription": "ROCURONIUM VL 10ML 10 VIALS/CT", "UOM": "None", "Price": 46, "Source": "INV", "VendNumber": "ROC022610", "OrderQty": 1, "Location": "11E5A"},
		{"MedId": "", "ItemNumber": "100554", "ItemDescription": "FLUORESCEIN VL 10% 5ML", "UOM": "12 VIALS/CT", "Price": 220.8204, "Source": "INV", "VendNumber": "861005", "OrderQty": 12, "Location": "4C3B"},
		{"MedId": "", "ItemNumber": "100555", "ItemDescription": "SOL BSS 30ML", "UOM": "None", "Price": 70.02, "Source": "W/S", "VendNumber": "1396647", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100558", "ItemDescription": "SOL IRRIG EYE STREAM 30ML", "UOM": "None", "Price": 1.66, "Source": "INV", "VendNumber": "417139", "OrderQty": 1, "Location": "1A4C"},
		{"MedId": "", "ItemNumber": "100600", "ItemDescription": "TRIAMCIN OINT .1% 80GM", "UOM": "None", "Price": 5, "Source": "INV", "VendNumber": "488403", "OrderQty": 1, "Location": "1F6E"},
		{"MedId": "", "ItemNumber": "100602", "ItemDescription": "MICONAZOLE 7 VAG CR", "UOM": "None", "Price": 2.95, "Source": "INV", "VendNumber": "943456", "OrderQty": 1, "Location": "1B2I"},
		{"MedId": "", "ItemNumber": "100608", "ItemDescription": "HYDROCOD/HOMATROPINE LIQ 16OZ", "UOM": "None", "Price": 35.18, "Source": "W/S", "VendNumber": "5019484", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100609", "ItemDescription": "MICONAZOLE VAG SUPP", "UOM": "7 SUPP/BX", "Price": 2.8098, "Source": "INV", "VendNumber": "025630", "OrderQty": 7, "Location": "1B2J"},
		{"MedId": "", "ItemNumber": "100610", "ItemDescription": "CHLORHEX ORAL RINSE 16OZ", "UOM": "None", "Price": 2.37, "Source": "INV", "VendNumber": "642633", "OrderQty": 1, "Location": "6A4A"},
		{"MedId": "", "ItemNumber": "100612", "ItemDescription": "LACTULOSE LIQ 16OZ", "UOM": "None", "Price": 4.66, "Source": "INV", "VendNumber": "073135", "OrderQty": 1, "Location": "6B3A"},
		{"MedId": "", "ItemNumber": "100616", "ItemDescription": "DILTIAZEM CD 120MG", "UOM": "90 CAPS/BO", "Price": 19.656, "Source": "INV", "VendNumber": "571310", "OrderQty": 90, "Location": "2C1B"},
		{"MedId": "", "ItemNumber": "100618", "ItemDescription": "DILTIAZEM CD 240MG", "UOM": "100 CAPS/BO", "Price": 31.32, "Source": "INV", "VendNumber": "603011", "OrderQty": 100, "Location": "2C1D"},
		{"MedId": "", "ItemNumber": "100619", "ItemDescription": "DILTIAZEM CD 300MG", "UOM": "90 CAPS/BO", "Price": 49.96, "Source": "W/S", "VendNumber": "199208", "OrderQty": 1, "Location": "2C1E"},
		{"MedId": "", "ItemNumber": "100620", "ItemDescription": "THIAMINE VL 100MG 2ML", "UOM": "25 VIALS/CT", "Price": 143.45, "Source": "INV", "VendNumber": "755512", "OrderQty": 25, "Location": "5E4C"},
		{"MedId": "", "ItemNumber": "100621", "ItemDescription": "PROTAMINE VL 50MG/5ML", "UOM": "25 VIALS/CT", "Price": 186.97, "Source": "INV", "VendNumber": "600460", "OrderQty": 25, "Location": "5D2B"},
		{"MedId": "", "ItemNumber": "100622", "ItemDescription": "OXYTOCIN VL 10U 1ML", "UOM": "25 VIALS/CT", "Price": 33.45, "Source": "INV", "VendNumber": "368865", "OrderQty": 25, "Location": "5B6C"},
		{"MedId": "", "ItemNumber": "100623", "ItemDescription": "CYANOCOBAL VL 1MG 1ML", "UOM": "25 VIALS/BX", "Price": 87.27, "Source": "INV", "VendNumber": "754770", "OrderQty": 25, "Location": "3F2D"},
		{"MedId": "", "ItemNumber": "100624", "ItemDescription": "FOLIC ACID VL 50MG 10ML", "UOM": "None", "Price": 21.22, "Source": "INV", "VendNumber": "050914", "OrderQty": 1, "Location": "4C3C"},
		{"MedId": "", "ItemNumber": "100625", "ItemDescription": "HEPARIN VL 1KU/ML 10ML", "UOM": "25 VIALS/CT", "Price": 43.52, "Source": "INV", "VendNumber": "465476", "OrderQty": 25, "Location": "4D1C"},
		{"MedId": "", "ItemNumber": "100626", "ItemDescription": "HYDRALAZINE VL 20MG 1ML", "UOM": "25 VIALS/CT", "Price": 52.96, "Source": "INV", "VendNumber": "408864", "OrderQty": 25, "Location": "4D3A"},
		{"MedId": "", "ItemNumber": "100627", "ItemDescription": "PROPRAN VL 1MG 1ML", "UOM": "10 VIALS/CT", "Price": 18.7, "Source": "INV", "VendNumber": "4070280", "OrderQty": 10, "Location": "5D1C"},
		{"MedId": "", "ItemNumber": "100628", "ItemDescription": "MAG SUL FTV 50% 10ML", "UOM": "25 VIALS/CT", "Price": 31.55, "Source": "INV", "VendNumber": "052407", "OrderQty": 25, "Location": "4F1A"},
		{"MedId": "", "ItemNumber": "100630", "ItemDescription": "DIPHENHYD VL 50MG 1ML", "UOM": "25 VIALS/CT", "Price": 13.82, "Source": "INV", "VendNumber": "558623", "OrderQty": 25, "Location": "3F6A"},
		{"MedId": "", "ItemNumber": "100631", "ItemDescription": "POTASSIUM ACET FTV 40MEQ 20ML", "UOM": "25 VIALS/CT", "Price": 74.61, "Source": "INV", "VendNumber": "469189", "OrderQty": 25, "Location": "5C6B"},
		{"MedId": "", "ItemNumber": "100632", "ItemDescription": "VINBLASTINE VL 10MG", "UOM": "None", "Price": 31.12, "Source": "INV", "VendNumber": "980870", "OrderQty": 1, "Location": "11C5A"},
		{"MedId": "", "ItemNumber": "100633", "ItemDescription": "ACYCLOVIR VL 500MG", "UOM": "10 VIALS/CT", "Price": 27.77, "Source": "INV", "VendNumber": "252064", "OrderQty": 10, "Location": "3C1B"},
		{"MedId": "", "ItemNumber": "100634", "ItemDescription": "HEPARIN VL 10KU/ML 1ML", "UOM": "25 VIALS/CT", "Price": 42.38, "Source": "INV", "VendNumber": "103663", "OrderQty": 25, "Location": "4D1B"},
		{"MedId": "", "ItemNumber": "100635", "ItemDescription": "DEXAMETH VL 4MG/1ML", "UOM": "25 VIALS/CT", "Price": 17.73, "Source": "INV", "VendNumber": "053033", "OrderQty": 25, "Location": "3F3A"},
		{"MedId": "", "ItemNumber": "100636", "ItemDescription": "CEFOXITIN VL 1GM", "UOM": "25 VIALS/CT", "Price": 69.08, "Source": "INV", "VendNumber": "141119", "OrderQty": 25, "Location": "3E5C"},
		{"MedId": "", "ItemNumber": "100637", "ItemDescription": "SELENIUM VL 400MCG/10ML", "UOM": "25 VIALS/CT", "Price": 408.24, "Source": "W/S", "VendNumber": "561233", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100638", "ItemDescription": "FLUPHENAZINE DEC 125MG5ML", "UOM": "None", "Price": 68.7, "Source": "W/S", "VendNumber": "1452101", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100639", "ItemDescription": "VANCOMYCIN VL 10GM", "UOM": "None", "Price": 29.94, "Source": "INV", "VendNumber": "224717", "OrderQty": 1, "Location": "9C1A"},
		{"MedId": "", "ItemNumber": "100640", "ItemDescription": "DEXAMETH VL 20MG/5ML(MDV)", "UOM": "25 VIALS/CT", "Price": 18.5, "Source": "INV", "VendNumber": "1370667", "OrderQty": 25, "Location": "3F5A"},
		{"MedId": "", "ItemNumber": "100642", "ItemDescription": "IFOSFAMIDE VL 1GM", "UOM": "None", "Price": 22.83, "Source": "INV", "VendNumber": "3396280", "OrderQty": 1, "Location": "9D5A"},
		{"MedId": "", "ItemNumber": "100643", "ItemDescription": "HEPARIN VL 1000U/ML 2MLPF", "UOM": "25 VIALS/CT", "Price": 124.34, "Source": "INV", "VendNumber": "026427", "OrderQty": 25, "Location": "4D1A"},
		{"MedId": "", "ItemNumber": "100647", "ItemDescription": "FLUPHENAZINE VL 25MG 10ML", "UOM": "None", "Price": 80.73, "Source": "W/S", "VendNumber": "1432707", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100648", "ItemDescription": "PROTAMINE SDV 250MG 25ML", "UOM": "None", "Price": 22.45, "Source": "INV", "VendNumber": "600478", "OrderQty": 1, "Location": "5D2A"},
		{"MedId": "", "ItemNumber": "100649", "ItemDescription": "MAG SUL VL 50% 2ML", "UOM": "25 VIALS/CT", "Price": 25.1, "Source": "INV", "VendNumber": "192781", "OrderQty": 25, "Location": "4E6B"},
		{"MedId": "", "ItemNumber": "100650", "ItemDescription": "HEPARIN CARDIAC 30KU/30ML", "UOM": "25 VIALS/CT", "Price": 95.79, "Source": "INV", "VendNumber": "465765", "OrderQty": 25, "Location": "4D2A"},
		{"MedId": "", "ItemNumber": "100651", "ItemDescription": "PYRIDOXINE VL 100MG/ML", "UOM": "25 VIALS/CT", "Price": 186.28, "Source": "W/S", "VendNumber": "754499", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100652", "ItemDescription": "VASOPRESSIN VL 20U", "UOM": "25 VIALS/CT", "Price": 3297.18, "Source": "INV", "VendNumber": "354597", "OrderQty": 25, "Location": "11F2A"},
		{"MedId": "", "ItemNumber": "100653", "ItemDescription": "VIAL STERILE EMPTY 30ML", "UOM": "None", "Price": 22.8, "Source": "INV", "VendNumber": "754846", "OrderQty": 1, "Location": "5F3C"},
		{"MedId": "", "ItemNumber": "100655", "ItemDescription": "CA GLUC SDV 10% 10ML", "UOM": "25 VIALS/CT", "Price": 99.01, "Source": "INV", "VendNumber": "389837", "OrderQty": 25, "Location": "3E4B"},
		{"MedId": "", "ItemNumber": "100656", "ItemDescription": "WATER INJ STER 20ML SD", "UOM": "25 VIALS/CT", "Price": 26.94, "Source": "INV", "VendNumber": "162149", "OrderQty": 25, "Location": "5F5A"},
		{"MedId": "", "ItemNumber": "100657", "ItemDescription": "GENTAMICIN PFV20MG/2ML", "UOM": "25 VIALS/CT", "Price": 34.54, "Source": "INV", "VendNumber": "931816", "OrderQty": 25, "Location": "4C4C"},
		{"MedId": "", "ItemNumber": "100658", "ItemDescription": "SOD CHL SDV 10ML", "UOM": "25 VIALS/CT", "Price": 14.97, "Source": "INV", "VendNumber": "162438", "OrderQty": 25, "Location": "5E1A"},
		{"MedId": "", "ItemNumber": "100659", "ItemDescription": "SOD BICARB SDV 4% 5ML", "UOM": "25 VIALS/CT", "Price": 166.94, "Source": "INV", "VendNumber": "158543", "OrderQty": 25, "Location": "5D6A"},
		{"MedId": "", "ItemNumber": "100660", "ItemDescription": "OXYTOCIN VL 10ML", "UOM": "25 VIALS/CT", "Price": 114.21, "Source": "INV", "VendNumber": "754614", "OrderQty": 25, "Location": "5B6B"},
		{"MedId": "", "ItemNumber": "100661", "ItemDescription": "CEFAZOLIN VL 10GM BULK", "UOM": "10 VIALS/CT", "Price": 77.2, "Source": "INV", "VendNumber": "4791687", "OrderQty": 10, "Location": "6E2A"},
		{"MedId": "", "ItemNumber": "100662", "ItemDescription": "TERBUTALINE VL 1MG 1ML", "UOM": "10 VIALS/CT", "Price": 10.77, "Source": "INV", "VendNumber": "4274650", "OrderQty": 10, "Location": "5E4B"},
		{"MedId": "", "ItemNumber": "100663", "ItemDescription": "TOBRAMYCIN VL 80MG 2ML", "UOM": "25 VIALS/CT", "Price": 18.2, "Source": "INV", "VendNumber": "5012992", "OrderQty": 25, "Location": "5E4F"},
		{"MedId": "", "ItemNumber": "100674", "ItemDescription": "WATER INJ BACT VL 30ML", "UOM": "25 VIALS/CT", "Price": 25.79, "Source": "INV", "VendNumber": "161679", "OrderQty": 25, "Location": "5F6A"},
		{"MedId": "", "ItemNumber": "100675", "ItemDescription": "POT PHOS VL 45MM 15ML", "UOM": "25 VIALS/CT", "Price": 318.67, "Source": "INV", "VendNumber": "100675", "OrderQty": 25, "Location": "5C6C"},
		{"MedId": "", "ItemNumber": "100676", "ItemDescription": "DRUG SOD ACETATE VL 40MEQ", "UOM": "25 VIALS/CT", "Price": 69.08, "Source": "INV", "VendNumber": "00409-7299-73", "OrderQty": 25, "Location": "5D5A"},
		{"MedId": "", "ItemNumber": "100678", "ItemDescription": "CA GLUC VL 10% 50ML", "UOM": "25 VIALS/CT", "Price": 162.38, "Source": "INV", "VendNumber": "389841", "OrderQty": 25, "Location": "3E4A"},
		{"MedId": "", "ItemNumber": "100679", "ItemDescription": "DRUG DOPAMINE VL 400MG", "UOM": "25 VIALS/CT", "Price": 38.31, "Source": "INV", "VendNumber": "156604", "OrderQty": 25, "Location": "7A2B"},
		{"MedId": "", "ItemNumber": "100680", "ItemDescription": "DRUG SOD BICARB VL 8.4% 50ML", "UOM": "25 VIALS/CT", "Price": 200.78, "Source": "INV", "VendNumber": "384008", "OrderQty": 25, "Location": "8F5A"},
		{"MedId": "", "ItemNumber": "100681", "ItemDescription": "MAG SUL VL 50% 50ML IVRM", "UOM": "25 VIALS/CT", "Price": 296.11, "Source": "INV", "VendNumber": "541540", "OrderQty": 25, "Location": "4F1B"},
		{"MedId": "", "ItemNumber": "100682", "ItemDescription": "MULTITRACE-4 VL 2ML", "UOM": "25 VIALS/CT", "Price": 130.56, "Source": "INV", "VendNumber": "498410", "OrderQty": 25, "Location": "5A3E"},
		{"MedId": "", "ItemNumber": "100683", "ItemDescription": "IRON SUCROSE VL 20MG 5ML", "UOM": "10 VIALS/CT", "Price": 285.51, "Source": "INV", "VendNumber": "184531", "OrderQty": 10, "Location": "4D4F"},
		{"MedId": "", "ItemNumber": "100684", "ItemDescription": "CA CL SDV 10 10ML", "UOM": "25 VIALS/CT", "Price": 284.82, "Source": "INV", "VendNumber": "555094", "OrderQty": 25, "Location": "3E3A"},
		{"MedId": "", "ItemNumber": "100686", "ItemDescription": "DRUG SOD PHOS FTV 15ML", "UOM": "25 VIALS/CT", "Price": 346, "Source": "INV", "VendNumber": "100686", "OrderQty": 25, "Location": "5E3A"},
		{"MedId": "", "ItemNumber": "100688", "ItemDescription": "DRUG MANNITOL VL 25 50ML", "UOM": "25 VIALS/CT", "Price": 43.75, "Source": "INV", "VendNumber": "088777", "OrderQty": 25, "Location": "4F2B"},
		{"MedId": "", "ItemNumber": "100690", "ItemDescription": "MULTITRACE-5 VL 10ML", "UOM": "25 VIALS/CT", "Price": 261.11, "Source": "INV", "VendNumber": "546671", "OrderQty": 25, "Location": "5A4A"},
		{"MedId": "", "ItemNumber": "100695", "ItemDescription": "ETANERCEPT VL 25MG", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100702", "ItemDescription": "CORTROSYN VL .25MG", "UOM": "10 VIALS/CT", "Price": 981.61, "Source": "INV", "VendNumber": "705595", "OrderQty": 10, "Location": "3F2C"},
		{"MedId": "", "ItemNumber": "100715", "ItemDescription": "GLIPIZIDE TAB XL 2.5MG", "UOM": "30 TABS/BO", "Price": 4.32, "Source": "INV", "VendNumber": "743284", "OrderQty": 30, "Location": "2C6F"},
		{"MedId": "", "ItemNumber": "100777", "ItemDescription": "PAROXETINE TAB 30MG", "UOM": "100 TABS/BX", "Price": 41.45, "Source": "INV", "VendNumber": "895969", "OrderQty": 100, "Location": "2F4E"},
		{"MedId": "", "ItemNumber": "100815", "ItemDescription": "SILVER NITRATE APP STICK", "UOM": "100 STICKS/VIAL", "Price": 21.49, "Source": "INV", "VendNumber": "600759", "OrderQty": 100, "Location": "1F5C"},
		{"MedId": "", "ItemNumber": "100816", "ItemDescription": "MEROPENEM VL 500MG", "UOM": "10 VIALS/CT", "Price": 50, "Source": "INV", "VendNumber": "63323-0507-20", "OrderQty": 10, "Location": "4F4A"},
		{"MedId": "", "ItemNumber": "100817", "ItemDescription": "LIDOCAINE JELLY 2% 30GM", "UOM": "None", "Price": 6.66, "Source": "INV", "VendNumber": "866069", "OrderQty": 1, "Location": "1E3A"},
		{"MedId": "", "ItemNumber": "100821", "ItemDescription": "METOPROLOL TAB XL 100MG", "UOM": "100 TABS/BO", "Price": 49.01, "Source": "INV", "VendNumber": "252268", "OrderQty": 100, "Location": "2E4D"},
		{"MedId": "", "ItemNumber": "100822", "ItemDescription": "ZAFIRLUKAST TAB 20MG", "UOM": "60 TABS/BO", "Price": 50.4, "Source": "W/S", "VendNumber": "4356853", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100823", "ItemDescription": "BICALUTAMIDE TAB 50MG", "UOM": "100 TABS/BO", "Price": 21.8, "Source": "W/S", "VendNumber": "4237269", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100824", "ItemDescription": "ANASTRAZOLE TAB 1MG", "UOM": "90 TABS/BO", "Price": 9.351, "Source": "W/S", "VendNumber": "4381794", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100826", "ItemDescription": "BUDESONIDE INH 120 DOSE", "UOM": "120 DOSE", "Price": 197.41, "Source": "INV", "VendNumber": "844973", "OrderQty": 120, "Location": "1C4B"},
		{"MedId": "", "ItemNumber": "100827", "ItemDescription": "QUETIAPINE TAB 25MG", "UOM": "100 TABS/BO", "Price": 7.27, "Source": "INV", "VendNumber": "278388", "OrderQty": 100, "Location": "3A3A"},
		{"MedId": "", "ItemNumber": "100828", "ItemDescription": "QUETIAPINE TAB 100MG", "UOM": "100 TABS/BO", "Price": 12.45, "Source": "INV", "VendNumber": "278440", "OrderQty": 100, "Location": "3A3C"},
		{"MedId": "", "ItemNumber": "100831", "ItemDescription": "BUDESONIDE 0.5MG/2ML NEB", "UOM": "30 NEBS/CT", "Price": 93.57, "Source": "INV", "VendNumber": "549741", "OrderQty": 30, "Location": "1C4A"},
		{"MedId": "", "ItemNumber": "100832", "ItemDescription": "ROPIVAC VL 10MG/ML 20ML", "UOM": "25 VIALS/BX", "Price": 153.81, "Source": "INV", "VendNumber": "208413", "OrderQty": 25, "Location": "5D4A"},
		{"MedId": "", "ItemNumber": "100833", "ItemDescription": "METOPROLOL TAB XL 200MG", "UOM": "100 TABS/BO", "Price": 82.7, "Source": "INV", "VendNumber": "252275", "OrderQty": 100, "Location": "2E4E"},
		{"MedId": "", "ItemNumber": "100845", "ItemDescription": "PINDOLOL TAB 5MG", "UOM": "100 TABS/BO", "Price": 87.94, "Source": "W/S", "VendNumber": "4971800", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100846", "ItemDescription": "BUDESONIDE CAP EC 3MG", "UOM": "100 CAPS/BO", "Price": 622.56, "Source": "W/S", "VendNumber": "606970", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100847", "ItemDescription": "FULVESTRANT KIT 250MG/5ML X 2", "UOM": "None", "Price": 1724.53, "Source": "W/S", "VendNumber": "036691", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100856", "ItemDescription": "ROLL ROBOT-AMBER 2.5IN", "UOM": "None", "Price": 210, "Source": "W/S", "VendNumber": "155802", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100862", "ItemDescription": "HAEMOPHILUS B VL(ACTHIB)", "UOM": "5 VIALS/BX", "Price": 47.55, "Source": "INV", "VendNumber": "554493", "OrderQty": 5, "Location": "10A6C"},
		{"MedId": "", "ItemNumber": "100865", "ItemDescription": "TUBERSOL 5ML", "UOM": "None", "Price": 245.28, "Source": "INV", "VendNumber": "380853", "OrderQty": 1, "Location": "10C8E"},
		{"MedId": "", "ItemNumber": "100867", "ItemDescription": "ACELLULAR DPT(INFANRIX)", "UOM": "10 VIALS/CT", "Price": 170.53, "Source": "INV", "VendNumber": "053153", "OrderQty": 10, "Location": "10A1B"},
		{"MedId": "", "ItemNumber": "100868", "ItemDescription": "TETANUS/DIP ADULT 0.5ML", "UOM": "10 VIALS/CT", "Price": 201.13, "Source": "INV", "VendNumber": "500064", "OrderQty": 10, "Location": "10C8C"},
		{"MedId": "", "ItemNumber": "100871", "ItemDescription": "ENOXAPARIN SYR 40MG/0.4ML", "UOM": "10 SYR/CT", "Price": 42, "Source": "INV", "VendNumber": "381277", "OrderQty": 10, "Location": "7A3A"},
		{"MedId": "", "ItemNumber": "100873", "ItemDescription": "GLIMEPIRIDE TAB 1MG", "UOM": "100 TABS/BO", "Price": 7.49, "Source": "W/S", "VendNumber": "280870", "OrderQty": 1, "Location": "2C6E"},
		{"MedId": "", "ItemNumber": "100876", "ItemDescription": "ENOXAPARIN SYR 100MG/ML", "UOM": "10 SYR/CT", "Price": 107.62, "Source": "INV", "VendNumber": "381297", "OrderQty": 10, "Location": "4B2A"},
		{"MedId": "", "ItemNumber": "100877", "ItemDescription": "ENOXAPARIN SYR 60MG/0.6ML", "UOM": "10 SYR/CT", "Price": 64.75, "Source": "INV", "VendNumber": "381280", "OrderQty": 10, "Location": "4A6A"},
		{"MedId": "", "ItemNumber": "100878", "ItemDescription": "ENOXAPARIN SYR 80MG/0.8ML", "UOM": "10 SYR/CT", "Price": 83.12, "Source": "INV", "VendNumber": "381293", "OrderQty": 10, "Location": "4B1A"},
		{"MedId": "", "ItemNumber": "100880", "ItemDescription": "LEFLUNOMIDE TAB 20MG", "UOM": "30 TABS/BO", "Price": 84.531, "Source": "W/S", "VendNumber": "393189", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100881", "ItemDescription": "GLIMEPIRIDE TAB 2MG", "UOM": "100 TABS/BO", "Price": 10.19, "Source": "W/S", "VendNumber": "280883", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100882", "ItemDescription": "GLIMEPIRIDE TAB 4MG", "UOM": "100 TABS/BO", "Price": 20.15, "Source": "W/S", "VendNumber": "3691458", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100885", "ItemDescription": "LEFLUNOMIDE TAB 10MG", "UOM": "30 TABS/BO", "Price": 142.5, "Source": "W/S", "VendNumber": "5138904", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100886", "ItemDescription": "ENOXAPARIN SYR 120MG", "UOM": "10 SYR/CT", "Price": 126, "Source": "INV", "VendNumber": "381301", "OrderQty": 10, "Location": "4B3A"},
		{"MedId": "", "ItemNumber": "100887", "ItemDescription": "ENOXAPARIN SYR 150MG", "UOM": "10 SYR/CT", "Price": 161.87, "Source": "INV", "VendNumber": "381309", "OrderQty": 10, "Location": "4B3B"},
		{"MedId": "", "ItemNumber": "100889", "ItemDescription": "ENOXAPARIN SYR 30MG/0.3ML", "UOM": "10 SYR/CT", "Price": 30.97, "Source": "INV", "VendNumber": "381273", "OrderQty": 10, "Location": "4A5A"},
		{"MedId": "", "ItemNumber": "100903", "ItemDescription": "DICYCLOMINE LIQ 16OZ", "UOM": "None", "Price": 106.04, "Source": "W/S", "VendNumber": "3679644", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "100993", "ItemDescription": "FILTER DISK 5.0 MICRON", "UOM": "None", "Price": 54.79, "Source": "W/S", "VendNumber": "415008", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101010", "ItemDescription": "SOL IV D 5% 500ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101011", "ItemDescription": "FILTER TRANSFER DEVICE", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101021", "ItemDescription": "NEEDLE FILTER 19GA X 1", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101028", "ItemDescription": "FLORINEF TAB 0.1MG", "UOM": "100 TABS/BO", "Price": 31.62, "Source": "INV", "VendNumber": "863345", "OrderQty": 100, "Location": "2C4D"},
		{"MedId": "", "ItemNumber": "101029", "ItemDescription": "MEDROXYPROG TAB 2.5MG", "UOM": "100 TABS/BO", "Price": 10, "Source": "W/S", "VendNumber": "1907773", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101032", "ItemDescription": "ETHAMBUTOL TAB 400MG", "UOM": "100 TABS/BO", "Price": 59.6, "Source": "W/S", "VendNumber": "026906", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101034", "ItemDescription": "ATROPINE OPH SOL 1% 5ML", "UOM": "None", "Price": 43.73, "Source": "INV", "VendNumber": "5046206", "OrderQty": 1, "Location": "1A3A"},
		{"MedId": "", "ItemNumber": "101035", "ItemDescription": "BACITRACIN/POLY O/O 3.5G", "UOM": "None", "Price": 6.63, "Source": "W/S", "VendNumber": "362537", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101036", "ItemDescription": "NEO/POLY/DEX OPH OI 3.5GM", "UOM": "None", "Price": 7.02, "Source": "W/S", "VendNumber": "327767", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101042", "ItemDescription": "DEXAMETH OPH SOL .1% 5ML", "UOM": "None", "Price": 49.49, "Source": "INV", "VendNumber": "915462", "OrderQty": 1, "Location": "1A3G"},
		{"MedId": "", "ItemNumber": "101044", "ItemDescription": "PILOCARP OPH SOL 1% 15ML", "UOM": "None", "Price": 71.53, "Source": "W/S", "VendNumber": "254847", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101045", "ItemDescription": "SULFAC/PREDLONE OPH SOL", "UOM": "None", "Price": 14.94, "Source": "W/S", "VendNumber": "2449270", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101046", "ItemDescription": "ERYTHRO OPH OINT 1GM", "UOM": "50/BOX", "Price": 110.07, "Source": "INV", "VendNumber": "356865", "OrderQty": 50, "Location": "1A4A"},
		{"MedId": "", "ItemNumber": "101047", "ItemDescription": "ATROPINE OPH 1% 3.75GM", "UOM": "None", "Price": 15.92, "Source": "W/S", "VendNumber": "1161934", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101050", "ItemDescription": "DESMOPRESS NASAL SPR 5ML", "UOM": "None", "Price": 51.9, "Source": "INV", "VendNumber": "525386", "OrderQty": 1, "Location": "1C4C"},
		{"MedId": "", "ItemNumber": "101051", "ItemDescription": "SOL OPHTH NACL 2% 15ML", "UOM": "None", "Price": 13.94, "Source": "W/S", "VendNumber": "614651", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101053", "ItemDescription": "SYR ORAL DISP LIQ AMB .5ML", "UOM": "50EA/BG", "Price": 118.1, "Source": "W/S", "VendNumber": "8500", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101054", "ItemDescription": "SYR ORAL DISP LIQ AMB 5ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101055", "ItemDescription": "SYR ORAL DISP LIQ AMB 3ML", "UOM": "None", "Price": 112, "Source": "W/S", "VendNumber": "H9388503", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101056", "ItemDescription": "TAMPER EVIDENT CAPS", "UOM": "100 CAPS/CA", "Price": 34, "Source": "W/S", "VendNumber": "H93852300", "OrderQty": 1, "Location": "9F1C"},
		{"MedId": "", "ItemNumber": "101057", "ItemDescription": "MIDAZOLAM VL 2MG 2ML", "UOM": "25 VIALS/CT", "Price": 7.54, "Source": "W/S", "VendNumber": "157836", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101058", "ItemDescription": "SCOPOLAMINE PATCH", "UOM": "4 PATCH/BX", "Price": 65.7, "Source": "INV", "VendNumber": "593691", "OrderQty": 4, "Location": "1F5B"},
		{"MedId": "", "ItemNumber": "101060", "ItemDescription": "DRUG FENTANYL AMP .1MG 2ML", "UOM": "10 AMPS/CT", "Price": 5.35, "Source": "W/S", "VendNumber": "003754", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101063", "ItemDescription": "PROMETHAZINE VL  25MG", "UOM": "25 VIALS/BX", "Price": 21.98, "Source": "INV", "VendNumber": "535567", "OrderQty": 25, "Location": "5D1B"},
		{"MedId": "", "ItemNumber": "101064", "ItemDescription": "PROCHLORPER 10MG INJ", "UOM": "10 VIALS/CT", "Price": 92.1, "Source": "INV", "VendNumber": "260707", "OrderQty": 10, "Location": "5D1A"},
		{"MedId": "", "ItemNumber": "101065", "ItemDescription": "CHLORPROM AMP 50MG 2ML", "UOM": "25 AMPS/BX", "Price": 574.89, "Source": "W/S", "VendNumber": "535138", "OrderQty": 1, "Location": "3F1E"},
		{"MedId": "", "ItemNumber": "101066", "ItemDescription": "PHENOBARB VL 130MG 1ML", "UOM": "25 VIALS/CT", "Price": 1080.87, "Source": "W/S", "VendNumber": "535286", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101067", "ItemDescription": "ATROPINE VL .4MG 1ML", "UOM": "25 VIALS/BX", "Price": 76.19, "Source": "INV", "VendNumber": "561118", "OrderQty": 25, "Location": "3D1C"},
		{"MedId": "", "ItemNumber": "101068", "ItemDescription": "MORPHINE VL 10MG", "UOM": "25 VIALS/CT", "Price": 22.08, "Source": "W/S", "VendNumber": "470575", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101069", "ItemDescription": "DEXAMETH VL 10MG 1ML", "UOM": "25 VIALS/CT", "Price": 19.69, "Source": "INV", "VendNumber": "536722", "OrderQty": 25, "Location": "3F5B"},
		{"MedId": "", "ItemNumber": "101070", "ItemDescription": "SUFENTANIL AMP 250MCG 5ML", "UOM": "10 AMPS/CT", "Price": 70.46, "Source": "W/S", "VendNumber": "153332", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101071", "ItemDescription": "DRUG FENTANYL AMP 1MG 20ML", "UOM": "5 AMPS/CT", "Price": 9.21, "Source": "W/S", "VendNumber": "480463", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101072", "ItemDescription": "DRUG FENTANYL AMP .25MG 5ML", "UOM": "10 AMPS/CT", "Price": 8.94, "Source": "W/S", "VendNumber": "034924", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101073", "ItemDescription": "MIDAZOLAM VL 5MG 5ML", "UOM": "10 VIALS/CT", "Price": 4.86, "Source": "W/S", "VendNumber": "157842", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101074", "ItemDescription": "DRUG HYDROMORP VL 2MG", "UOM": "25 VIALS/CT", "Price": 10.87, "Source": "W/S", "VendNumber": "903144", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101078", "ItemDescription": "MIDAZOLAM VL 50MG 10ML", "UOM": "10 VIALS/CT", "Price": 16.94, "Source": "W/S", "VendNumber": "157867", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101080", "ItemDescription": "PROPOFOL VL 50ML", "UOM": "20 VIALS/CT", "Price": 105.92, "Source": "INV", "VendNumber": "627657", "OrderQty": 20, "Location": "8E1A"},
		{"MedId": "", "ItemNumber": "101083", "ItemDescription": "SUPRANE 240ML", "UOM": "6 BOTTLES/CT", "Price": 742.1502, "Source": "INV", "VendNumber": "225607", "OrderQty": 6, "Location": "9C5A"},
		{"MedId": "", "ItemNumber": "101084", "ItemDescription": "DRUG SUFENTANIL AMP 50MCG 1ML", "UOM": "10 AMPS/CT", "Price": 17.51, "Source": "W/S", "VendNumber": "3685369", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101085", "ItemDescription": "AMPICILLIN/SULB VL 15GM", "UOM": "None", "Price": 10.95, "Source": "INV", "VendNumber": "180772", "OrderQty": 1, "Location": "3C6A"},
		{"MedId": "", "ItemNumber": "101086", "ItemDescription": "PROPOFOL VL 100ML", "UOM": "10 VIALS/CT", "Price": 105.92, "Source": "INV", "VendNumber": "333864", "OrderQty": 10, "Location": "8F1A"},
		{"MedId": "", "ItemNumber": "101087", "ItemDescription": "ISOFLURANE 250ML", "UOM": "6 BOTTLES/CS", "Price": 96.1002, "Source": "INV", "VendNumber": "360305", "OrderQty": 6, "Location": "9C4A"},
		{"MedId": "", "ItemNumber": "101088", "ItemDescription": "ATROPINE VL 1MG 1ML", "UOM": "25 VIALS/CT", "Price": 119.68, "Source": "INV", "VendNumber": "561126", "OrderQty": 25, "Location": "3D1D"},
		{"MedId": "", "ItemNumber": "101089", "ItemDescription": "LORAZEPAM VL 2MG 1ML", "UOM": "25 VIALS/CT", "Price": 12.64, "Source": "W/S", "VendNumber": "171126", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101090", "ItemDescription": "MIDAZOLAM VL 5MG 1ML", "UOM": "10 VIALS/CT", "Price": 6.05, "Source": "W/S", "VendNumber": "158117", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101094", "ItemDescription": "PHENYLEPH VL 1% 1ML", "UOM": "25 VIALS/CT", "Price": 100.2, "Source": "INV", "VendNumber": "351635", "OrderQty": 25, "Location": "5C4C"},
		{"MedId": "", "ItemNumber": "101095", "ItemDescription": "GLYCOPYROLATE VL .2MG 1ML", "UOM": "25 VIALS/CT", "Price": 137.2, "Source": "INV", "VendNumber": "557835", "OrderQty": 25, "Location": "7C2B"},
		{"MedId": "", "ItemNumber": "101097", "ItemDescription": "ESMOLOL VL 100MG 10ML", "UOM": "25 VIALS/CT", "Price": 53.42, "Source": "INV", "VendNumber": "515433", "OrderQty": 25, "Location": "4C1A"},
		{"MedId": "", "ItemNumber": "101100", "ItemDescription": "HETASTARCH BAG 6% 500ML", "UOM": "12 EACH/CA", "Price": 149.15, "Source": "W/S", "VendNumber": "2279792", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101101", "ItemDescription": "BUMETANIDE VL 1MG 4ML", "UOM": "10 VIALS/CT", "Price": 15.32, "Source": "INV", "VendNumber": "169391", "OrderQty": 10, "Location": "3D5A"},
		{"MedId": "", "ItemNumber": "101102", "ItemDescription": "DILTIAZEM VL 125MG 25ML", "UOM": "10 VIALS/CT", "Price": 35, "Source": "INV", "VendNumber": "349098", "OrderQty": 10, "Location": "11D3A"},
		{"MedId": "", "ItemNumber": "101107", "ItemDescription": "SODIUM CITRATE BG 500ML", "UOM": "24 BAGS/CA", "Price": 178.32, "Source": "INV", "VendNumber": "4B7889Q", "OrderQty": 24, "Location": "12A5A"},
		{"MedId": "", "ItemNumber": "101121", "ItemDescription": "SOL  D 70% 2000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101132", "ItemDescription": "SOL NACL .9% 250ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101164", "ItemDescription": "SOL CLINISOL 15% 2000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101169", "ItemDescription": "SOL NACL INJ 3% 500ML", "UOM": "24 BAGS/CA", "Price": 43.68, "Source": "W/S", "VendNumber": "2126571", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101184", "ItemDescription": "GENTAMICIN PB 80MG 50ML", "UOM": "EA/CA24", "Price": 51.5496, "Source": "INV", "VendNumber": "590026", "OrderQty": 24, "Location": "7C2A"},
		{"MedId": "", "ItemNumber": "101194", "ItemDescription": "SOL D 2.5% NACL .45% 1000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101247", "ItemDescription": "INFUVITE ADL IV 2X5ML", "UOM": "5 DOSES/CT", "Price": 29.93, "Source": "INV", "VendNumber": "168219", "OrderQty": 5, "Location": "11D6A"},
		{"MedId": "", "ItemNumber": "101249", "ItemDescription": "METRONIDAZ PB 500MG 100ML", "UOM": "24 BAGS/BX", "Price": 25.6392, "Source": "INV", "VendNumber": "163055", "OrderQty": 24, "Location": "8A1A"},
		{"MedId": "", "ItemNumber": "101256", "ItemDescription": "FAT EMULSION 20% 250ML", "UOM": "10 BOTTLES/CA", "Price": 120.53, "Source": "INV", "VendNumber": "487173", "OrderQty": 10, "Location": "7B3A"},
		{"MedId": "", "ItemNumber": "101260", "ItemDescription": "SOL DNL LOW CA UBG 2.5% 2L", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101261", "ItemDescription": "SOL DNL LOW CA UBG 1.5%  2L", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101281", "ItemDescription": "PHENYLEPH NAS SP .5 15ML", "UOM": "None", "Price": 3.49, "Source": "INV", "VendNumber": "468160", "OrderQty": 1, "Location": "1D2C"},
		{"MedId": "", "ItemNumber": "101283", "ItemDescription": "ACARBOSE TAB 50MG", "UOM": "100 TABS/BO", "Price": 74, "Source": "W/S", "VendNumber": "4784005", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101284", "ItemDescription": "DACARBAZINE VL 200MG", "UOM": "10 VIALS/CT", "Price": 55.26, "Source": "INV", "VendNumber": "734244", "OrderQty": 10, "Location": "11C2A"},
		{"MedId": "", "ItemNumber": "101286", "ItemDescription": "NIMOTOP CAP 30MG", "UOM": "30 CAPS/BO", "Price": 85.779, "Source": "W/S", "VendNumber": "511063", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101289", "ItemDescription": "TETANUS IMMUNE GLOB 250U", "UOM": "None", "Price": 404.88, "Source": "W/S", "VendNumber": "IMM3063402", "OrderQty": 1, "Location": "10C8B"},
		{"MedId": "", "ItemNumber": "101290", "ItemDescription": "HEP-B IMMUNE GLOB VL 5ML", "UOM": "None", "Price": 650.18, "Source": "INV", "VendNumber": "636-05", "OrderQty": 1, "Location": "10A6F"},
		{"MedId": "", "ItemNumber": "101368", "ItemDescription": "SYR 60ML LUER LOCK", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101371", "ItemDescription": "SYR 10ML LUER LOCK", "UOM": "None", "Price": 26.63, "Source": "W/S", "VendNumber": "BF309604", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101408", "ItemDescription": "SYR 60ML CATH TIP", "UOM": "None", "Price": 11.725, "Source": "W/S", "VendNumber": "BF309620", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101436", "ItemDescription": "SYR 1ML ORAL W/TIP CAP AMBER", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101463", "ItemDescription": "CANNULA IV BLUNT F/INTERLINK", "UOM": "None", "Price": 132, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101469", "ItemDescription": "SYR TB 1CC 27GA X .5", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101504", "ItemDescription": "CONTAINER CHEMO XLG 5GAL", "UOM": "None", "Price": 54.08, "Source": "W/S", "VendNumber": "BF305493", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101507", "ItemDescription": "SYR 1ML 25GAX5/8IN NDL", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101517", "ItemDescription": "NEEDLE HYPO 19GAX1IN", "UOM": "None", "Price": 4.89, "Source": "INV", "VendNumber": "BF305188", "OrderQty": 1, "Location": "5A5D"},
		{"MedId": "", "ItemNumber": "101518", "ItemDescription": "SYR TB 1ML  25GAX5/8IN NDL", "UOM": "None", "Price": 6.02, "Source": "INV", "VendNumber": "284588", "OrderQty": 1, "Location": "5E4A"},
		{"MedId": "", "ItemNumber": "101537", "ItemDescription": "METHOTREXATE VL 250MG10ML", "UOM": "None", "Price": 3.53, "Source": "INV", "VendNumber": "279281", "OrderQty": 1, "Location": "9E1C"},
		{"MedId": "", "ItemNumber": "101538", "ItemDescription": "ETOMIDATE VL 20MG 10ML", "UOM": "10 VL/CT", "Price": 33.43, "Source": "INV", "VendNumber": "405629", "OrderQty": 10, "Location": "4C1B"},
		{"MedId": "", "ItemNumber": "101541", "ItemDescription": "ACETAZOL VL 500MG/10ML", "UOM": "None", "Price": 15.2, "Source": "INV", "VendNumber": "740761", "OrderQty": 1, "Location": "3C1A"},
		{"MedId": "", "ItemNumber": "101543", "ItemDescription": "CYCLOSPORINE VL 250MG/5ML", "UOM": "10 VIALS/CT", "Price": 189, "Source": "W/S", "VendNumber": "2929560", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101544", "ItemDescription": "RIFAMPIN VL 600MG", "UOM": "None", "Price": 68.62, "Source": "W/S", "VendNumber": "360164", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101545", "ItemDescription": "CLADRIBINE INJ 10MG", "UOM": "None", "Price": 175.21, "Source": "W/S", "VendNumber": "3600665", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101547", "ItemDescription": "POLYMIXIN B VL 500000U", "UOM": "10 VIALS/CT", "Price": 48.82, "Source": "INV", "VendNumber": "495069", "OrderQty": 10, "Location": "5C6A"},
		{"MedId": "", "ItemNumber": "101550", "ItemDescription": "KETOROLAC VL 60MG", "UOM": "25 VIALS/CT", "Price": 23.72, "Source": "INV", "VendNumber": "077709", "OrderQty": 25, "Location": "4D4H"},
		{"MedId": "", "ItemNumber": "101551", "ItemDescription": "VALPROIC ACID VL 500MG", "UOM": "10 VIALS/CT", "Price": 18.06, "Source": "INV", "VendNumber": "861649", "OrderQty": 10, "Location": "5E6A"},
		{"MedId": "", "ItemNumber": "101553", "ItemDescription": "PAMIDRONATE VL 30MG", "UOM": "None", "Price": 9.17, "Source": "INV", "VendNumber": "322313", "OrderQty": 1, "Location": "5B6D"},
		{"MedId": "", "ItemNumber": "101556", "ItemDescription": "DOXORUBICIN VL PWD 50MG", "UOM": "None", "Price": 242.26, "Source": "INV", "VendNumber": "294777", "OrderQty": 1, "Location": "9D3F"},
		{"MedId": "", "ItemNumber": "101558", "ItemDescription": "DIHYDROER 45 VL 1MG/1ML", "UOM": "10 VIALS/CT", "Price": 1001.8, "Source": "INV", "VendNumber": "3564754", "OrderQty": 10, "Location": "3F5E"},
		{"MedId": "", "ItemNumber": "101559", "ItemDescription": "MITOMYCIN VL 20MG", "UOM": "None", "Price": 533.56, "Source": "INV", "VendNumber": "727396", "OrderQty": 1, "Location": "9E1G"},
		{"MedId": "", "ItemNumber": "101561", "ItemDescription": "BUTORPHANOL VL 2MG 1ML", "UOM": "10 VIALS/CT", "Price": 42.83, "Source": "W/S", "VendNumber": "643817", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101574", "ItemDescription": "ESTRADIOL PATCH 0.05MG", "UOM": "8 PATCH/BX", "Price": 63.36, "Source": "W/S", "VendNumber": "5048004", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101576", "ItemDescription": "ESTRADIOL PATCH 0.1MG", "UOM": "8 PATCH/BX", "Price": 61.88, "Source": "W/S", "VendNumber": "365407", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101577", "ItemDescription": "FLUDARABINE VL 50MG", "UOM": "None", "Price": 65.48, "Source": "W/S", "VendNumber": "4140406", "OrderQty": 1, "Location": "11C3A"},
		{"MedId": "", "ItemNumber": "101581", "ItemDescription": "DIGOXIN TAB .25MG", "UOM": "100 TABS/BO", "Price": 94.38, "Source": "INV", "VendNumber": "4248472", "OrderQty": 100, "Location": "2B6G"},
		{"MedId": "", "ItemNumber": "101582", "ItemDescription": "DIGOXIN TAB .125MG", "UOM": "100 TABS/BO", "Price": 93.03, "Source": "INV", "VendNumber": "093237", "OrderQty": 100, "Location": "2B6F"},
		{"MedId": "", "ItemNumber": "101583", "ItemDescription": "PERMETHRIN CR 5% 60GM", "UOM": "None", "Price": 39.59, "Source": "INV", "VendNumber": "762462", "OrderQty": 1, "Location": "1F4G"},
		{"MedId": "", "ItemNumber": "101585", "ItemDescription": "BENZOCAINE SPRAY 20% KIT", "UOM": "None", "Price": 11.88, "Source": "INV", "VendNumber": "277032", "OrderQty": 1, "Location": "1D5A"},
		{"MedId": "", "ItemNumber": "101646", "ItemDescription": "ASA/DIPYRID CAP 25/200", "UOM": "60 CAPS/BO", "Price": 224.16, "Source": "W/S", "VendNumber": "609347", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101647", "ItemDescription": "CLONIDINE PATCH .2MG U/D", "UOM": "4 PATCH/BX", "Price": 75.97, "Source": "INV", "VendNumber": "578854", "OrderQty": 4, "Location": "1D5H"},
		{"MedId": "", "ItemNumber": "101648", "ItemDescription": "CLONIDINE PATCH .3MG U/D", "UOM": "4 PATCH/BX", "Price": 97.31, "Source": "INV", "VendNumber": "619858", "OrderQty": 4, "Location": "1D5I"},
		{"MedId": "", "ItemNumber": "101649", "ItemDescription": "CLONIDINE PATCH 0.1MG U/D", "UOM": "4 PATCH/BX", "Price": 51.61, "Source": "INV", "VendNumber": "622316", "OrderQty": 4, "Location": "1D5G"},
		{"MedId": "", "ItemNumber": "101651", "ItemDescription": "NEVIRAPINE TAB 200MG", "UOM": "60 TABS/BO", "Price": 580.8, "Source": "W/S", "VendNumber": "3263902", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101653", "ItemDescription": "PRAMIPEXOLE TAB .25MG", "UOM": "90 TABS/BO", "Price": 4.4595, "Source": "W/S", "VendNumber": "022301", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101654", "ItemDescription": "IPRATROPIUM INHALER", "UOM": "None", "Price": 306.45, "Source": "INV", "VendNumber": "041931", "OrderQty": 1, "Location": "1D1B"},
		{"MedId": "", "ItemNumber": "101655", "ItemDescription": "PRAMIPEXOLE TAB 0.5MG", "UOM": "90 TABS/BO", "Price": 5.01, "Source": "W/S", "VendNumber": "4395026", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "101657", "ItemDescription": "TIOTROPIUM INHALER", "UOM": "None", "Price": 36.84, "Source": "INV", "VendNumber": "658777", "OrderQty": 1, "Location": "1D3A"},
		{"MedId": "", "ItemNumber": "102187", "ItemDescription": "ELECTROLYTE BOWEL SOL 4L", "UOM": "None", "Price": 10.27, "Source": "INV", "VendNumber": "598961", "OrderQty": 1, "Location": "7B1A"},
		{"MedId": "", "ItemNumber": "102194", "ItemDescription": "TRIAMCIN ACET VL 40MG 5ML", "UOM": "None", "Price": 42.36, "Source": "INV", "VendNumber": "059576", "OrderQty": 1, "Location": "5E5B"},
		{"MedId": "", "ItemNumber": "102239", "ItemDescription": "DRUG WARFARIN TAB 5MG", "UOM": "100 TABS/BX", "Price": 23.03, "Source": "INV", "VendNumber": "580694", "OrderQty": 100, "Location": "3B6A"},
		{"MedId": "", "ItemNumber": "102240", "ItemDescription": "DRUG WARFARIN TAB 2.5MG", "UOM": "100 TABS/BX", "Price": 22.11, "Source": "INV", "VendNumber": "580567", "OrderQty": 100, "Location": "3B5C"},
		{"MedId": "", "ItemNumber": "102241", "ItemDescription": "DRUG WARFARIN TAB 7.5MG", "UOM": "100 TABS/BO", "Price": 5.05, "Source": "INV", "VendNumber": "1318807", "OrderQty": 100, "Location": "3B6B"},
		{"MedId": "", "ItemNumber": "102242", "ItemDescription": "DRUG WARFARIN TAB 1MG", "UOM": "100 TABS/BO", "Price": 3.33, "Source": "INV", "VendNumber": "386714", "OrderQty": 100, "Location": "3B5A"},
		{"MedId": "", "ItemNumber": "102243", "ItemDescription": "DRUG WARFARIN TAB 3MG", "UOM": "100 TABS/BO", "Price": 33.23, "Source": "INV", "VendNumber": "017006", "OrderQty": 100, "Location": "3B5D"},
		{"MedId": "", "ItemNumber": "102246", "ItemDescription": "TRI VI SOL DROPS 50ML", "UOM": "None", "Price": 2.46, "Source": "W/S", "VendNumber": "1096007", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "102247", "ItemDescription": "DRUG WARFARIN TAB 2MG", "UOM": "100 TABS/BX", "Price": 21.19, "Source": "INV", "VendNumber": "580516", "OrderQty": 100, "Location": "3B5B"},
		{"MedId": "", "ItemNumber": "102248", "ItemDescription": "DRUG WARFARIN TAB 10MG", "UOM": "100 TABS/BO", "Price": 33.23, "Source": "INV", "VendNumber": "014528", "OrderQty": 100, "Location": "3B6C"},
		{"MedId": "", "ItemNumber": "102252", "ItemDescription": "CYCLOPHOSPHA VL 500MG", "UOM": "None", "Price": 222.2, "Source": "INV", "VendNumber": "358127", "OrderQty": 1, "Location": "9D3B"},
		{"MedId": "", "ItemNumber": "102253", "ItemDescription": "DRUG TRIAMCIN SPRAY 63GM", "UOM": "None", "Price": 184.15, "Source": "W/S", "VendNumber": "391735", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "102256", "ItemDescription": "PRAVASTATIN TAB 10MG", "UOM": "90 TABS/BO", "Price": 14.904, "Source": "INV", "VendNumber": "065351", "OrderQty": 90, "Location": "3A1A"},
		{"MedId": "", "ItemNumber": "102257", "ItemDescription": "PRAVASTATIN TAB 20MG", "UOM": "90 TABS/BO", "Price": 13.293, "Source": "INV", "VendNumber": "064651", "OrderQty": 90, "Location": "3A1B"},
		{"MedId": "", "ItemNumber": "102264", "ItemDescription": "DRUG MITOTANE TAB 500MG", "UOM": "100 TABS/BO", "Price": 433.56, "Source": "W/S", "VendNumber": "1260207", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "102265", "ItemDescription": "IRBESARTAN TAB 75MG", "UOM": "90 TABS/BO", "Price": 5.11, "Source": "W/S", "VendNumber": "324208", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "102267", "ItemDescription": "IRBESARTAN TAB 150MG", "UOM": "90 TABS/BO", "Price": 8.082, "Source": "INV", "VendNumber": "159347", "OrderQty": 90, "Location": "2D3B"},
		{"MedId": "", "ItemNumber": "102270", "ItemDescription": "DRUG CETUXIMAB VL 100MG", "UOM": "None", "Price": 542.86, "Source": "INV", "VendNumber": "092573", "OrderQty": 1, "Location": "11C1C"},
		{"MedId": "", "ItemNumber": "102271", "ItemDescription": "DRUG EFAVIRENZ TAB 600MG", "UOM": "30 TABS/BO", "Price": 863.1, "Source": "W/S", "VendNumber": "3330289", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "102272", "ItemDescription": "ARIPIPRAZOLE TAB 10MG", "UOM": "30 TABS/BO", "Price": 29.91, "Source": "INV", "VendNumber": "393126", "OrderQty": 30, "Location": "2A3E"},
		{"MedId": "", "ItemNumber": "102273", "ItemDescription": "ARIPIPRAZOLE TAB 15MG", "UOM": "30 TABS/BO", "Price": 84.429, "Source": "INV", "VendNumber": "5118500", "OrderQty": 30, "Location": "999A"},
		{"MedId": "", "ItemNumber": "102276", "ItemDescription": "CEFPROZIL LIQ 250MG/5ML 50ML", "UOM": "None", "Price": 29.31, "Source": "W/S", "VendNumber": "3703519", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "102277", "ItemDescription": "CEFPROZIL LIQ 125MG 75ML", "UOM": "None", "Price": 20.24, "Source": "W/S", "VendNumber": "4061594", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "102299", "ItemDescription": "CLONAZEPAM TAB 0.5MG", "UOM": "100 TABS/BO", "Price": 3.69, "Source": "W/S", "VendNumber": "154935", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "102729", "ItemDescription": "SOD POLYSTY SUSP 60ML U/D", "UOM": "10BOTTLES/CT", "Price": 39.42, "Source": "INV", "VendNumber": "416693", "OrderQty": 10, "Location": "6C3H"},
		{"MedId": "", "ItemNumber": "102739", "ItemDescription": "MELPHALEN TAB 2MG", "UOM": "50 TABS/BO", "Price": 390.04, "Source": "W/S", "VendNumber": "4457669", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "102741", "ItemDescription": "HYDROCODONE-CHLORPH SUSP 4OZ.", "UOM": "None", "Price": 41.54, "Source": "W/S", "VendNumber": "349934", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "102743", "ItemDescription": "TIAGABINE TAB 2MG", "UOM": "30 TABS/BO", "Price": 158.6, "Source": "W/S", "VendNumber": "4805271", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "102744", "ItemDescription": "TIAGABINE TAB 4MG", "UOM": "30 TABS/BO", "Price": 133.5, "Source": "W/S", "VendNumber": "4805388", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "102745", "ItemDescription": "TIAGABINE TAB 12 MG", "UOM": "30 TABS/BO", "Price": 323, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "102754", "ItemDescription": "RABIES VACCINE HUMAN 1ML", "UOM": "None", "Price": 257.88, "Source": "INV", "VendNumber": "002168", "OrderQty": 1, "Location": "10C6C"},
		{"MedId": "", "ItemNumber": "102806", "ItemDescription": "HEMORRHOIDAL SUPP HC", "UOM": "12 SUPP/BX", "Price": 83.4996, "Source": "INV", "VendNumber": "633289", "OrderQty": 12, "Location": "1B2D"},
		{"MedId": "", "ItemNumber": "102807", "ItemDescription": "TRIAMCIN OINT .025% 80GM", "UOM": "None", "Price": 5.03, "Source": "W/S", "VendNumber": "488419", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "102813", "ItemDescription": "BAG PLSTC 18 X 24IN", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "102929", "ItemDescription": "FERRIC SUBSULFATE AQUEOUS", "UOM": "12 BO/CA", "Price": 146.07, "Source": "INV", "VendNumber": "936781", "OrderQty": 12, "Location": "1E1B"},
		{"MedId": "", "ItemNumber": "103017", "ItemDescription": "CALAMINE LOTION 4OZ", "UOM": "None", "Price": 1.38, "Source": "INV", "VendNumber": "213140", "OrderQty": 1, "Location": "1D5B"},
		{"MedId": "", "ItemNumber": "103021", "ItemDescription": "CEFUROXIME VL 750MG", "UOM": "25 VIALS/CT", "Price": 39.62, "Source": "INV", "VendNumber": "637715", "OrderQty": 25, "Location": "3F1D"},
		{"MedId": "", "ItemNumber": "103130", "ItemDescription": "PORACTANT VL 3ML", "UOM": "None", "Price": 647.69, "Source": "INV", "VendNumber": "075358", "OrderQty": 1, "Location": "10C5D"},
		{"MedId": "", "ItemNumber": "103131", "ItemDescription": "PORACTANT VL 1.5ML", "UOM": "None", "Price": 356.32, "Source": "INV", "VendNumber": "069484", "OrderQty": 1, "Location": "10C5C"},
		{"MedId": "", "ItemNumber": "103193", "ItemDescription": "A+D OINT", "UOM": "None", "Price": 1.96, "Source": "INV", "VendNumber": "1122126", "OrderQty": 1, "Location": "1D4A"},
		{"MedId": "", "ItemNumber": "103194", "ItemDescription": "TRIAMCIN CR .025% 80GM", "UOM": "None", "Price": 4.65, "Source": "W/S", "VendNumber": "3909892", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103195", "ItemDescription": "ZINC OXIDE OINT 1OZ", "UOM": "None", "Price": 2.37, "Source": "INV", "VendNumber": "363630", "OrderQty": 1, "Location": "1F6G"},
		{"MedId": "", "ItemNumber": "103196", "ItemDescription": "ANALGESIC BALM 1OZ", "UOM": "None", "Price": 1, "Source": "INV", "VendNumber": "284893", "OrderQty": 1, "Location": "1D4D"},
		{"MedId": "", "ItemNumber": "103197", "ItemDescription": "TRIAMCIN CR .025% 15GM", "UOM": "None", "Price": 2.04, "Source": "INV", "VendNumber": "293811", "OrderQty": 1, "Location": "1F6A"},
		{"MedId": "", "ItemNumber": "103199", "ItemDescription": "TOLNAFTATE CR 1% 15GM", "UOM": "None", "Price": 1.1, "Source": "W/S", "VendNumber": "515999", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103200", "ItemDescription": "TRIAMCIN CR .1% 15GM", "UOM": "None", "Price": 2.02, "Source": "INV", "VendNumber": "293910", "OrderQty": 1, "Location": "1F6B"},
		{"MedId": "", "ItemNumber": "103201", "ItemDescription": "TRIAMCIN OINT .1% 15GM", "UOM": "None", "Price": 2.06, "Source": "INV", "VendNumber": "488395", "OrderQty": 1, "Location": "1F6D"},
		{"MedId": "", "ItemNumber": "103202", "ItemDescription": "NYSTATIN OINT 15GM", "UOM": "None", "Price": 7.59, "Source": "INV", "VendNumber": "912246", "OrderQty": 1, "Location": "1F4D"},
		{"MedId": "", "ItemNumber": "103204", "ItemDescription": "FLUOCIDE OINT .05% 15GM", "UOM": "None", "Price": 19.69, "Source": "INV", "VendNumber": "669473", "OrderQty": 1, "Location": "1E1D"},
		{"MedId": "", "ItemNumber": "103206", "ItemDescription": "HYDROCORT CR .5% 1OZ", "UOM": "None", "Price": 2.33, "Source": "INV", "VendNumber": "363788", "OrderQty": 1, "Location": "1E2A"},
		{"MedId": "", "ItemNumber": "103207", "ItemDescription": "HYDROCORT CR 2.5% 30GM", "UOM": "None", "Price": 2.24, "Source": "INV", "VendNumber": "276162", "OrderQty": 1, "Location": "1E2C"},
		{"MedId": "", "ItemNumber": "103209", "ItemDescription": "GENTAMICIN CR .1% 15GM", "UOM": "None", "Price": 31.72, "Source": "W/S", "VendNumber": "2134534", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103210", "ItemDescription": "GENTAMICIN OINT .1% 15GM", "UOM": "None", "Price": 31.67, "Source": "W/S", "VendNumber": "2134542", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103212", "ItemDescription": "HYDROCORT CR 1% 1OZ", "UOM": "None", "Price": 1.09, "Source": "INV", "VendNumber": "981118", "OrderQty": 1, "Location": "1E2B"},
		{"MedId": "", "ItemNumber": "103213", "ItemDescription": "NYSTATIN/TRIAMC OINT 15GM", "UOM": "None", "Price": 38.01, "Source": "INV", "VendNumber": "912428", "OrderQty": 1, "Location": "1F4F"},
		{"MedId": "", "ItemNumber": "103215", "ItemDescription": "LIDOCAINE OINT 5% 35GM", "UOM": "None", "Price": 18.41, "Source": "INV", "VendNumber": "407759", "OrderQty": 1, "Location": "1E4A"},
		{"MedId": "", "ItemNumber": "103218", "ItemDescription": "HYDROCORT LOT 1% 4OZ", "UOM": "None", "Price": 8.03, "Source": "W/S", "VendNumber": "435024", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103219", "ItemDescription": "MICONAZOLE CR 2% 30GM", "UOM": "None", "Price": 1.95, "Source": "INV", "VendNumber": "912261", "OrderQty": 1, "Location": "1E6D"},
		{"MedId": "", "ItemNumber": "103220", "ItemDescription": "HYDROCORTISONE OINT 1%", "UOM": "None", "Price": 1.43, "Source": "INV", "VendNumber": "292011", "OrderQty": 1, "Location": "1E2D"},
		{"MedId": "", "ItemNumber": "103221", "ItemDescription": "CLOTRI 1%-BETAMET CR 15GM", "UOM": "None", "Price": 4.96, "Source": "INV", "VendNumber": "092902", "OrderQty": 1, "Location": "1D5J"},
		{"MedId": "", "ItemNumber": "103290", "ItemDescription": "AZTREONAM VL 1GM", "UOM": "10 VIALS/CT", "Price": 249.04, "Source": "INV", "VendNumber": "027722", "OrderQty": 10, "Location": "3D3A"},
		{"MedId": "", "ItemNumber": "103293", "ItemDescription": "GEMCITABINE VL 1GM", "UOM": "None", "Price": 22.17, "Source": "INV", "VendNumber": "181976", "OrderQty": 1, "Location": "9D4F"},
		{"MedId": "", "ItemNumber": "103294", "ItemDescription": "RALOXIFENE TAB 60MG", "UOM": "30 TABS/BO", "Price": 65.84, "Source": "INV", "VendNumber": "5299466", "OrderQty": 30, "Location": "3A3H"},
		{"MedId": "", "ItemNumber": "103295", "ItemDescription": "OLANZAPINE TAB 5MG", "UOM": "30 TABS/BO", "Price": 2.571, "Source": "INV", "VendNumber": "261586", "OrderQty": 30, "Location": "2F2E"},
		{"MedId": "", "ItemNumber": "103296", "ItemDescription": "OLANZAPINE TAB 2.5MG", "UOM": "30 TABS/BO", "Price": 2.031, "Source": "INV", "VendNumber": "4584108", "OrderQty": 30, "Location": "2F2C"},
		{"MedId": "", "ItemNumber": "103297", "ItemDescription": "OLANZAPINE TAB 7.5MG", "UOM": "30 TABS/BO", "Price": 2.76, "Source": "W/S", "VendNumber": "4952065", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103298", "ItemDescription": "GEMCITABINE VL 200MG", "UOM": "None", "Price": 5.63, "Source": "INV", "VendNumber": "201280", "OrderQty": 1, "Location": "9D4E"},
		{"MedId": "", "ItemNumber": "103299", "ItemDescription": "OLANZAPINE TAB 10MG", "UOM": "30 TABS/BO", "Price": 4.701, "Source": "INV", "VendNumber": "261608", "OrderQty": 30, "Location": "2F3A"},
		{"MedId": "", "ItemNumber": "103303", "ItemDescription": "TERIPARATIDE PEN 750MCG", "UOM": "None", "Price": 1145.3, "Source": "W/S", "VendNumber": "4119863", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103307", "ItemDescription": "OLANZAPINE VL 10MG", "UOM": "None", "Price": 22.17, "Source": "INV", "VendNumber": "180289", "OrderQty": 1, "Location": "5B2A"},
		{"MedId": "", "ItemNumber": "103308", "ItemDescription": "OLANZAPINE DISIN TAB 5MG", "UOM": "30 TABS/BX", "Price": 31.401, "Source": "INV", "VendNumber": "322091", "OrderQty": 30, "Location": "2F2D"},
		{"MedId": "", "ItemNumber": "103309", "ItemDescription": "OLANZAPINE DISIN TAB 10MG", "UOM": "30 TABS/BX", "Price": 41.52, "Source": "INV", "VendNumber": "427104", "OrderQty": 30, "Location": "2F2F"},
		{"MedId": "", "ItemNumber": "103314", "ItemDescription": "CARBI/LEVO TAB 10/100", "UOM": "100 TABS/BO", "Price": 11.81, "Source": "W/S", "VendNumber": "175943", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103315", "ItemDescription": "CARBI/LEVO TAB 25/250", "UOM": "100 TABS/BO", "Price": 12.85, "Source": "INV", "VendNumber": "346049", "OrderQty": 100, "Location": "2B1C"},
		{"MedId": "", "ItemNumber": "103316", "ItemDescription": "CARBI/LEVO TAB 25/100MG", "UOM": "500 TABS/BO", "Price": 45.7, "Source": "INV", "VendNumber": "346023", "OrderQty": 500, "Location": "2B1A"},
		{"MedId": "", "ItemNumber": "103317", "ItemDescription": "LIDOCAINE PATCH 700MG", "UOM": "30 PATCH/BX", "Price": 80.391, "Source": "INV", "VendNumber": "242565", "OrderQty": 30, "Location": "1E5A"},
		{"MedId": "", "ItemNumber": "103318", "ItemDescription": "NALOXONE SYR 2MG 2ML", "UOM": "10 EA/CT", "Price": 273.73, "Source": "INV", "VendNumber": "171761", "OrderQty": 10, "Location": "5A5C"},
		{"MedId": "", "ItemNumber": "103320", "ItemDescription": "CYTARABINE LIPO VL 50MGDS", "UOM": "None", "Price": 2545, "Source": "W/S", "VendNumber": "3487147", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103322", "ItemDescription": "MIDODRINE TAB 2.5MG", "UOM": "100 TABS/BO", "Price": 38.29, "Source": "INV", "VendNumber": "045106", "OrderQty": 100, "Location": "2E5C"},
		{"MedId": "", "ItemNumber": "103324", "ItemDescription": "TIZANIDINE TAB 4MG", "UOM": "150 TABS/BO", "Price": 17.77, "Source": "INV", "VendNumber": "422257", "OrderQty": 150, "Location": "3B2D"},
		{"MedId": "", "ItemNumber": "103329", "ItemDescription": "BUMETANIDE TAB 2MG", "UOM": "100 TABS/BO", "Price": 96.36, "Source": "INV", "VendNumber": "609339", "OrderQty": 100, "Location": "2A5E"},
		{"MedId": "", "ItemNumber": "103330", "ItemDescription": "BUMETANIDE TAB 1MG", "UOM": "100 TABS/BO", "Price": 52.56, "Source": "INV", "VendNumber": "2601730", "OrderQty": 100, "Location": "2A5D"},
		{"MedId": "", "ItemNumber": "103331", "ItemDescription": "METOLAZONE TAB 5MG", "UOM": "100 TABS/B0", "Price": 101.89, "Source": "INV", "VendNumber": "014302", "OrderQty": 100, "Location": "2E3B"},
		{"MedId": "", "ItemNumber": "103332", "ItemDescription": "METOLAZONE TAB 10MG", "UOM": "100 TABS/BO", "Price": 128, "Source": "W/S", "VendNumber": "3663101", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103333", "ItemDescription": "METOLAZONE TAB 2.5MG", "UOM": "100 TABS/BO", "Price": 104.12, "Source": "W/S", "VendNumber": "014353", "OrderQty": 1, "Location": "2E3A"},
		{"MedId": "", "ItemNumber": "103336", "ItemDescription": "NALTREXONE TAB 50MG", "UOM": "30 TABS/BO", "Price": 19.98, "Source": "W/S", "VendNumber": "753038", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103337", "ItemDescription": "INDOMETHACIN SR CAP 75MG", "UOM": "30 CAPS/BO", "Price": 61.3, "Source": "W/S", "VendNumber": "4283792", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103372", "ItemDescription": "NICARDIPINE AMP 25MG 10ML", "UOM": "10 VIALS/CT", "Price": 147.24, "Source": "INV", "VendNumber": "173676", "OrderQty": 10, "Location": "5A6A"},
		{"MedId": "", "ItemNumber": "103373", "ItemDescription": "NITROGLY SL 0.4MG (BO OF25)", "UOM": "4 BOTTLES/BX", "Price": 52.27, "Source": "INV", "VendNumber": "546155", "OrderQty": 4, "Location": "2F2A"},
		{"MedId": "", "ItemNumber": "103375", "ItemDescription": "MORPHINE SOL 20MG/ML 8 OZ", "UOM": "None", "Price": 57.4, "Source": "W/S", "VendNumber": "4023347", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103376", "ItemDescription": "BUSPIRONE TAB 5MG", "UOM": "100 TABS/BO", "Price": 3.19, "Source": "INV", "VendNumber": "603407", "OrderQty": 100, "Location": "2A5I"},
		{"MedId": "", "ItemNumber": "103377", "ItemDescription": "BUSPIRONE TAB 10MG", "UOM": "100 TABS/BO", "Price": 4.58, "Source": "W/S", "VendNumber": "619874", "OrderQty": 1, "Location": "2A5J"},
		{"MedId": "", "ItemNumber": "103378", "ItemDescription": "PROPAFENONE TAB 150MG", "UOM": "100 TABS/BO", "Price": 16.26, "Source": "W/S", "VendNumber": "3525946", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103379", "ItemDescription": "PREDNISOLONE LIQ 15MG/5ML BULK", "UOM": "None", "Price": 13.36, "Source": "INV", "VendNumber": "041246", "OrderQty": 1, "Location": "6C3B"},
		{"MedId": "", "ItemNumber": "103380", "ItemDescription": "ISOSORBIDE MONO TAB 60MG", "UOM": "100 TABS/BO", "Price": 12.13, "Source": "INV", "VendNumber": "212118", "OrderQty": 100, "Location": "2D3F"},
		{"MedId": "", "ItemNumber": "103381", "ItemDescription": "ISOSORBIDE MONO 30MG", "UOM": "100 TABS/BO", "Price": 30.4, "Source": "INV", "VendNumber": "207860", "OrderQty": 100, "Location": "2D3E"},
		{"MedId": "", "ItemNumber": "103382", "ItemDescription": "POT CHL CAP 10MEQ", "UOM": "100 CAPS/BO", "Price": 39.86, "Source": "W/S", "VendNumber": "331462", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103384", "ItemDescription": "MORPHINE TAB 15MG", "UOM": "100 TABS/BO", "Price": 17.42, "Source": "W/S", "VendNumber": "527251", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103385", "ItemDescription": "MORPHINE TAB 30MG", "UOM": "100 TABS/BO", "Price": 34.19, "Source": "W/S", "VendNumber": "527236", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103389", "ItemDescription": "MORPHINE SOL 20MG/ML 30ML", "UOM": "None", "Price": 6.52, "Source": "W/S", "VendNumber": "661379", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103390", "ItemDescription": "MORPHINE SOL 20MG/ML 4 OZ", "UOM": "None", "Price": 28.24, "Source": "W/S", "VendNumber": "4023362", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103391", "ItemDescription": "OXYCODONE TAB 5MG", "UOM": "100 TABS/BO", "Price": 8.11, "Source": "W/S", "VendNumber": "030445", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103405", "ItemDescription": "NEO/POLY/DEX OPH SUSP 5ML", "UOM": "None", "Price": 13, "Source": "W/S", "VendNumber": "2508042", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103406", "ItemDescription": "TOBRAMYCIN 0.3% DROP 5ML", "UOM": "None", "Price": 3.34, "Source": "INV", "VendNumber": "362665", "OrderQty": 1, "Location": "1A6C"},
		{"MedId": "", "ItemNumber": "103407", "ItemDescription": "BRIMONIDINE O/S 0.20 5ML", "UOM": "None", "Price": 3.37, "Source": "INV", "VendNumber": "750707", "OrderQty": 1, "Location": "1A3C"},
		{"MedId": "", "ItemNumber": "103409", "ItemDescription": "NEO/POLY/HC OPH SUS 7.5ML", "UOM": "None", "Price": 95.99, "Source": "INV", "VendNumber": "3478203", "OrderQty": 1, "Location": "1A5C"},
		{"MedId": "", "ItemNumber": "103411", "ItemDescription": "PILOCARP OPH SOL 4% 15ML", "UOM": "None", "Price": 78.02, "Source": "W/S", "VendNumber": "2508075", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103412", "ItemDescription": "TROPICAMIDE OPH .5% 15ML", "UOM": "None", "Price": 5.04, "Source": "W/S", "VendNumber": "1168913", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103414", "ItemDescription": "PROPARACAINE OPH .5% 15ML", "UOM": "None", "Price": 21.2, "Source": "INV", "VendNumber": "804658", "OrderQty": 1, "Location": "10C6B"},
		{"MedId": "", "ItemNumber": "103415", "ItemDescription": "TROPICAMIDE OPH 1% 15ML", "UOM": "None", "Price": 4.65, "Source": "W/S", "VendNumber": "1168129", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103416", "ItemDescription": "TRIFLURIDINE OPH 1% 7.5ML", "UOM": "None", "Price": 119.06, "Source": "W/S", "VendNumber": "082343", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103419", "ItemDescription": "LMX 5 GM TUBE", "UOM": "5 TUBES/CT", "Price": 14.95, "Source": "INV", "VendNumber": "295175", "OrderQty": 5, "Location": "1E6A"},
		{"MedId": "", "ItemNumber": "103423", "ItemDescription": "HEP-B IMMUNE GLOB VL 1ML", "UOM": "None", "Price": 139.62, "Source": "W/S", "VendNumber": "268843", "OrderQty": 1, "Location": "10A6E"},
		{"MedId": "", "ItemNumber": "103425", "ItemDescription": "NITROLINGUAL SPR .4MG", "UOM": "None", "Price": 97.04, "Source": "INV", "VendNumber": "555847", "OrderQty": 1, "Location": "1F4B"},
		{"MedId": "", "ItemNumber": "103455", "ItemDescription": "LEVOTHYROX TAB 150MCG", "UOM": "100 TABS/BO", "Price": 49.26, "Source": "INV", "VendNumber": "845622", "OrderQty": 100, "Location": "2D5I"},
		{"MedId": "", "ItemNumber": "103456", "ItemDescription": "LEVOTHYROX TAB 25MCG 90 TABS/B", "UOM": "O", "Price": 11.178, "Source": "INV", "VendNumber": "109652", "OrderQty": 1, "Location": "2D5A"},
		{"MedId": "", "ItemNumber": "103457", "ItemDescription": "LEVOTHYROX TAB 50MCG", "UOM": "100 TABS/BO", "Price": 13.11, "Source": "INV", "VendNumber": "297705", "OrderQty": 100, "Location": "2D5B"},
		{"MedId": "", "ItemNumber": "103458", "ItemDescription": "LEVOTHYRO TAB 100MCG", "UOM": "100 TABS/BO", "Price": 40.81, "Source": "INV", "VendNumber": "838197", "OrderQty": 100, "Location": "2D5E"},
		{"MedId": "", "ItemNumber": "103459", "ItemDescription": "LEVOTHYROX TAB 88MCG 90 TABS/B", "UOM": "O", "Price": 13.05, "Source": "W/S", "VendNumber": "109708", "OrderQty": 1, "Location": "2D5D"},
		{"MedId": "", "ItemNumber": "103460", "ItemDescription": "LEVOTHYROX TAB 112MCG", "UOM": "90 TABS/BO", "Price": 14.913, "Source": "W/S", "VendNumber": "109746", "OrderQty": 1, "Location": "2D5F"},
		{"MedId": "", "ItemNumber": "103465", "ItemDescription": "FOSFOMYCIN PWD 3GM", "UOM": "None", "Price": 66.77, "Source": "INV", "VendNumber": "374830", "OrderQty": 1, "Location": "2C4H"},
		{"MedId": "", "ItemNumber": "103467", "ItemDescription": "LEVOTHYROX TAB 125MCG", "UOM": "100 TABS/BO", "Price": 47.95, "Source": "INV", "VendNumber": "838209", "OrderQty": 100, "Location": "2D5G"},
		{"MedId": "", "ItemNumber": "103469", "ItemDescription": "DINOPROSTONE VAG INSERT", "UOM": "None", "Price": 320.68, "Source": "INV", "VendNumber": "484659", "OrderQty": 1, "Location": "10B1A"},
		{"MedId": "", "ItemNumber": "103470", "ItemDescription": "LEVOTHYROX TAB 75MCG", "UOM": "100 TABS/BX", "Price": 39.82, "Source": "W/S", "VendNumber": "838173", "OrderQty": 1, "Location": "2D5C"},
		{"MedId": "", "ItemNumber": "103473", "ItemDescription": "THYROID TAB 30MG", "UOM": "100 TABS/BO", "Price": 58.75, "Source": "W/S", "VendNumber": "1112549", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103477", "ItemDescription": "CHARCOAL CHERRY AQU 25GM", "UOM": "None", "Price": 14.5, "Source": "INV", "VendNumber": "4076220", "OrderQty": 1, "Location": "6A3F"},
		{"MedId": "", "ItemNumber": "103483", "ItemDescription": "TACROLIMUS CAP 1MG", "UOM": "100 CAPS/BO", "Price": 97.98, "Source": "W/S", "VendNumber": "4353462", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103492", "ItemDescription": "FENOFIBRATE CAP 200 MG", "UOM": "100 CAPS/BO", "Price": 142.73, "Source": "INV", "VendNumber": "666608", "OrderQty": 100, "Location": "2C3K"},
		{"MedId": "", "ItemNumber": "103512", "ItemDescription": "DORNASE ALPHA AMP 2.5MG", "UOM": "30 AMPS/CT", "Price": 3201.33, "Source": "W/S", "VendNumber": "319319", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103513", "ItemDescription": "RITUXIMAB VL 100MG", "UOM": "None", "Price": 868.63, "Source": "INV", "VendNumber": "276713", "OrderQty": 1, "Location": "11C4A"},
		{"MedId": "", "ItemNumber": "103514", "ItemDescription": "RITUXIMAB VL 500MG", "UOM": "None", "Price": 4343.15, "Source": "INV", "VendNumber": "276720", "OrderQty": 1, "Location": "11C4B"},
		{"MedId": "", "ItemNumber": "103516", "ItemDescription": "BEVACIZUMAB VL 100MG", "UOM": "None", "Price": 758.54, "Source": "INV", "VendNumber": "276687", "OrderQty": 1, "Location": "11C1A"},
		{"MedId": "", "ItemNumber": "103517", "ItemDescription": "ALTEPLASE VL 100MG", "UOM": "None", "Price": 8330.44, "Source": "INV", "VendNumber": "354779", "OrderQty": 1, "Location": "3C1F"},
		{"MedId": "", "ItemNumber": "103518", "ItemDescription": "ALTEPLASE VL 50 MG", "UOM": "None", "Price": 4165.22, "Source": "INV", "VendNumber": "330696", "OrderQty": 1, "Location": "3C1E"},
		{"MedId": "", "ItemNumber": "103529", "ItemDescription": "SEVELAMER TAB 400MG", "UOM": "360 TABS/BO", "Price": 1169.748, "Source": "W/S", "VendNumber": "897959", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103530", "ItemDescription": "SEVELAMER TAB 800MG", "UOM": "180 TABS/BO", "Price": 1169.748, "Source": "INV", "VendNumber": "897983", "OrderQty": 180, "Location": "3A5E"},
		{"MedId": "", "ItemNumber": "103535", "ItemDescription": "AQUAPHOR 100GM JAR(NICU)", "UOM": "None", "Price": 3.92, "Source": "INV", "VendNumber": "924126", "OrderQty": 1, "Location": "1D4F"},
		{"MedId": "", "ItemNumber": "103536", "ItemDescription": "EUCERIN CREAM 4OZ", "UOM": "None", "Price": 3.47, "Source": "INV", "VendNumber": "601866", "OrderQty": 1, "Location": "1E1A"},
		{"MedId": "", "ItemNumber": "103537", "ItemDescription": "SARNA LOTION 7.5OZGEQ", "UOM": "None", "Price": 1.98, "Source": "INV", "VendNumber": "170790", "OrderQty": 1, "Location": "1F5A"},
		{"MedId": "", "ItemNumber": "103538", "ItemDescription": "EUCERIN CREAM 1LB", "UOM": "None", "Price": 3.06, "Source": "INV", "VendNumber": "2305811", "OrderQty": 1, "Location": "1D6G"},
		{"MedId": "", "ItemNumber": "103540", "ItemDescription": "CIDOFOVIR VL 375MG", "UOM": "None", "Price": 710.47, "Source": "W/S", "VendNumber": "2481158", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103541", "ItemDescription": "TENOFIVIR TAB 300MG", "UOM": "30 TABS/BO", "Price": 933, "Source": "W/S", "VendNumber": "3303435", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103553", "ItemDescription": "DIGOXIN PED AMP .1MG 1ML", "UOM": "10 AMPS/CT", "Price": 714.44, "Source": "W/S", "VendNumber": "224586", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103554", "ItemDescription": "CHLORAMBUCIL TAB 2MG", "UOM": "50 TABS/BO", "Price": 939.79, "Source": "W/S", "VendNumber": "4602702", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103555", "ItemDescription": "BUSULFAN TAB 2MG", "UOM": "25 TABS/BO", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103556", "ItemDescription": "ALUM HYDROX/MAG TRIL CHEW 100", "UOM": "TABS/BO", "Price": 7.8, "Source": "W/S", "VendNumber": "4872958", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103557", "ItemDescription": "AMOX/CLAV TAB 250MG", "UOM": "30 TABS/BO", "Price": 128.229, "Source": "W/S", "VendNumber": "3710266", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103561", "ItemDescription": "CARVEDILOL TAB 12.5MG", "UOM": "100 TABS/BO", "Price": 8.57, "Source": "INV", "VendNumber": "373209", "OrderQty": 100, "Location": "2B1G"},
		{"MedId": "", "ItemNumber": "103562", "ItemDescription": "CARVEDILOL TAB 6.25MG", "UOM": "100 TABS/BO", "Price": 8.57, "Source": "INV", "VendNumber": "373201", "OrderQty": 100, "Location": "2B1F"},
		{"MedId": "", "ItemNumber": "103563", "ItemDescription": "CARVEDILOL TAB 3.125MG", "UOM": "100 TABS/BO", "Price": 8.57, "Source": "INV", "VendNumber": "623905", "OrderQty": 100, "Location": "2B1E"},
		{"MedId": "", "ItemNumber": "103564", "ItemDescription": "LAMIVUDINE TAB 150MG", "UOM": "60 TABS/BO", "Price": 192.678, "Source": "W/S", "VendNumber": "4542130", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103565", "ItemDescription": "CEFUROXIME LIQ 125/5 100M", "UOM": "None", "Price": 132.43, "Source": "INV", "VendNumber": "542675", "OrderQty": 1, "Location": "6A3D"},
		{"MedId": "", "ItemNumber": "103566", "ItemDescription": "SUMATRIPTAN TAB 50MG", "UOM": "9 TABS/BX", "Price": 5.1201, "Source": "INV", "VendNumber": "011809", "OrderQty": 9, "Location": "3B1B"},
		{"MedId": "", "ItemNumber": "103567", "ItemDescription": "SUMATRIPTAN TAB 25MG", "UOM": "9 TABS/BX", "Price": 4.7304, "Source": "INV", "VendNumber": "011650", "OrderQty": 9, "Location": "3B1A"},
		{"MedId": "", "ItemNumber": "103568", "ItemDescription": "ROPINIROLE TAB 0.25MG", "UOM": "100 TABS/BO", "Price": 6.9, "Source": "W/S", "VendNumber": "093688", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103569", "ItemDescription": "FLUTICASONE NASAL SPRAY", "UOM": "None", "Price": 4.31, "Source": "INV", "VendNumber": "776144", "OrderQty": 1, "Location": "1C6A"},
		{"MedId": "", "ItemNumber": "103571", "ItemDescription": "ROPINIROLE TAB 1MG", "UOM": "100 TABS/BO", "Price": 5.96, "Source": "W/S", "VendNumber": "518134", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103573", "ItemDescription": "LAMOTRIGINE TAB 25MG", "UOM": "100 TABS/BO", "Price": 3.18, "Source": "INV", "VendNumber": "412924", "OrderQty": 100, "Location": "2D4A"},
		{"MedId": "", "ItemNumber": "103574", "ItemDescription": "LAMOTRIGINE TAB 100MG", "UOM": "100 TABS/BO", "Price": 10.78, "Source": "INV", "VendNumber": "043208", "OrderQty": 100, "Location": "2D4B"},
		{"MedId": "", "ItemNumber": "103577", "ItemDescription": "LAMOTRIGINE TAB 200MG", "UOM": "60 TABS/BO", "Price": 3.72, "Source": "INV", "VendNumber": "413070", "OrderQty": 60, "Location": "2D4C"},
		{"MedId": "", "ItemNumber": "103578", "ItemDescription": "ZIDOVUDINE LIQ 8OZ.", "UOM": "None", "Price": 48.12, "Source": "W/S", "VendNumber": "4765798", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103579", "ItemDescription": "VALACYCLOVIR TAB 1GM", "UOM": "30 TABS/BO", "Price": 18.18, "Source": "INV", "VendNumber": "281477", "OrderQty": 30, "Location": "3B3C"},
		{"MedId": "", "ItemNumber": "103580", "ItemDescription": "VALACYCLOVIR TAB 500MG", "UOM": "30 TABS/BO", "Price": 10.359, "Source": "INV", "VendNumber": "199422", "OrderQty": 30, "Location": "3B3B"},
		{"MedId": "", "ItemNumber": "103583", "ItemDescription": "COMBIVIR TAB 150/300", "UOM": "60 TABS/BO", "Price": 464.4, "Source": "W/S", "VendNumber": "5027198", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103584", "ItemDescription": "ROPINIROLE TAB 2MG", "UOM": "100 TABS/BO", "Price": 7.71, "Source": "W/S", "VendNumber": "093724", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103585", "ItemDescription": "SUMATRIPTAN TAB 100MG", "UOM": "9 TABS/PK", "Price": 4.72, "Source": "INV", "VendNumber": "796003", "OrderQty": 9, "Location": "3B1C"},
		{"MedId": "", "ItemNumber": "103588", "ItemDescription": "AMOX LIQ 250MG 100ML", "UOM": "None", "Price": 1.74, "Source": "INV", "VendNumber": "501627", "OrderQty": 1, "Location": "6A2C"},
		{"MedId": "", "ItemNumber": "103589", "ItemDescription": "SUMATRIPTAN VL 6MG/.5ML", "UOM": "5 VIALS/CT", "Price": 802.79, "Source": "INV", "VendNumber": "439356", "OrderQty": 5, "Location": "5E3D"},
		{"MedId": "", "ItemNumber": "103590", "ItemDescription": "TOPOTECAN VL 4MG", "UOM": "None", "Price": 39.79, "Source": "W/S", "VendNumber": "248240", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103592", "ItemDescription": "ZIDOVUDINE VL 200MG", "UOM": "10 VIALS/CT", "Price": 272.34, "Source": "W/S", "VendNumber": "4378402", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103593", "ItemDescription": "CEFTAZIDIME VL 1GM", "UOM": "25 VIALS/BX", "Price": 75.76, "Source": "INV", "VendNumber": "922854", "OrderQty": 25, "Location": "3E6C"},
		{"MedId": "", "ItemNumber": "103596", "ItemDescription": "NICOTINE GUM 2MG U/D", "UOM": "50 STICKS/BX", "Price": 9.21, "Source": "W/S", "VendNumber": "047915", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103599", "ItemDescription": "ZIDOVUDINE CAP 100MG", "UOM": "100 CAPS/BO", "Price": 58, "Source": "W/S", "VendNumber": "4765723", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103600", "ItemDescription": "ROPINIROLE TAB 4MG", "UOM": "100 TABS/BO", "Price": 6.63, "Source": "W/S", "VendNumber": "097497", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103611", "ItemDescription": "TERBUTALINE TAB 2.5MG", "UOM": "100 TABS/BO", "Price": 6.5, "Source": "W/S", "VendNumber": "4066510", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103612", "ItemDescription": "TERBUTALINE TAB 5MG", "UOM": "100 TABS/BO", "Price": 153, "Source": "W/S", "VendNumber": "3669447", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103615", "ItemDescription": "DEMECLOCYCLINE TAB 150MG", "UOM": "100 TABS/BO", "Price": 392.49, "Source": "INV", "VendNumber": "4040614", "OrderQty": 100, "Location": "2B6B"},
		{"MedId": "", "ItemNumber": "103799", "ItemDescription": "GLYCERIN SUPP ADULT U/D", "UOM": "10 SUPP/BX", "Price": 5.81, "Source": "W/S", "VendNumber": "391896", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103801", "ItemDescription": "TRIPLE ANTIB OINT 1OZ", "UOM": "None", "Price": 1.46, "Source": "INV", "VendNumber": "294017", "OrderQty": 1, "Location": "1F6F"},
		{"MedId": "", "ItemNumber": "103803", "ItemDescription": "ACETAMIN SUPP 120MG U/D", "UOM": "12 SUPP/BX", "Price": 4.47, "Source": "INV", "VendNumber": "391755", "OrderQty": 12, "Location": "1B1A"},
		{"MedId": "", "ItemNumber": "103805", "ItemDescription": "BACITRACIN OINT 1OZ", "UOM": "None", "Price": 1.41, "Source": "INV", "VendNumber": "294496", "OrderQty": 1, "Location": "1D4G"},
		{"MedId": "", "ItemNumber": "103806", "ItemDescription": "ACETAMIN SUPP 325MG U/D", "UOM": "12 SUPP/BX", "Price": 5.1, "Source": "INV", "VendNumber": "137695", "OrderQty": 12, "Location": "1B1B"},
		{"MedId": "", "ItemNumber": "103808", "ItemDescription": "PROMETHAZINE SUPP 25MG", "UOM": "12 SUPP/BX", "Price": 72.4296, "Source": "INV", "VendNumber": "420378", "OrderQty": 12, "Location": "10C6A"},
		{"MedId": "", "ItemNumber": "103908", "ItemDescription": "IMMUNE GLOBULIN VL IM 2ML", "UOM": "None", "Price": 62.62, "Source": "W/S", "VendNumber": "2700-1", "OrderQty": 1, "Location": "10A7A"},
		{"MedId": "", "ItemNumber": "103921", "ItemDescription": "THERAPEUT VIT LIQ 8OZ", "UOM": "None", "Price": 7.12, "Source": "INV", "VendNumber": "222543", "OrderQty": 1, "Location": "6C4C"},
		{"MedId": "", "ItemNumber": "103922", "ItemDescription": "POLY-VI-SOL 50ML", "UOM": "None", "Price": 2.52, "Source": "W/S", "VendNumber": "1283175", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "103923", "ItemDescription": "SULFAM/TRI LIQ 16OZ.", "UOM": "None", "Price": 80.56, "Source": "INV", "VendNumber": "231373", "OrderQty": 1, "Location": "6C4B"},
		{"MedId": "", "ItemNumber": "103924", "ItemDescription": "ALBUTEROL SOL 20ML BOT", "UOM": "None", "Price": 24.88, "Source": "INV", "VendNumber": "486589", "OrderQty": 1, "Location": "1B3D"},
		{"MedId": "", "ItemNumber": "103926", "ItemDescription": "POLY VI FLOR 0.25MG 50ML", "UOM": "None", "Price": 2.94, "Source": "W/S", "VendNumber": "1731355", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104004", "ItemDescription": "LACTOSE POWDER 16OZ", "UOM": "None", "Price": 25.01, "Source": "W/S", "VendNumber": "1316173", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104006", "ItemDescription": "IODINE TINCTURE 2% PTS", "UOM": "None", "Price": 21.32, "Source": "W/S", "VendNumber": "1334952", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104088", "ItemDescription": "SYR CA CL 10ML", "UOM": "10 SYR/CT", "Price": 54.34, "Source": "INV", "VendNumber": "517854", "OrderQty": 10, "Location": "7C4A"},
		{"MedId": "", "ItemNumber": "104089", "ItemDescription": "EPINEPHRINE SYR 10ML", "UOM": "10 SYR/CT", "Price": 53.24, "Source": "INV", "VendNumber": "194220", "OrderQty": 10, "Location": "7B2B"},
		{"MedId": "", "ItemNumber": "104090", "ItemDescription": "ATROPINE SYR 1MG/10ML", "UOM": "10 SYR/CT", "Price": 40.34, "Source": "INV", "VendNumber": "913398", "OrderQty": 10, "Location": "3D1B"},
		{"MedId": "", "ItemNumber": "104092", "ItemDescription": "EPINEPHRINE INJ 30MG/30ML", "UOM": "None", "Price": 49.97, "Source": "INV", "VendNumber": "190389", "OrderQty": 1, "Location": "4B5A"},
		{"MedId": "", "ItemNumber": "104093", "ItemDescription": "DRUG SOD BICARB SYR 4.2% 10ML", "UOM": "10 SYR/CT", "Price": 82.25, "Source": "INV", "VendNumber": "125666", "OrderQty": 10, "Location": "5D5B"},
		{"MedId": "", "ItemNumber": "104099", "ItemDescription": "FERRO-SEQUEL CAP U/D", "UOM": "30 CAPS/BX", "Price": 6.9, "Source": "W/S", "VendNumber": "2601433", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104103", "ItemDescription": "CEPHALEXIN CAP 500MG", "UOM": "500 CAPS/BO", "Price": 41.44, "Source": "INV", "VendNumber": "048809", "OrderQty": 500, "Location": "2B2G"},
		{"MedId": "", "ItemNumber": "104104", "ItemDescription": "CEPHALEXIN CAP 250MG", "UOM": "100 CAPS/BO", "Price": 10.63, "Source": "INV", "VendNumber": "1543354", "OrderQty": 100, "Location": "2B2F"},
		{"MedId": "", "ItemNumber": "104107", "ItemDescription": "NITROFURAN CAP 100MG (BID)", "UOM": "100 CAPS/BO", "Price": 230.25, "Source": "INV", "VendNumber": "028302", "OrderQty": 100, "Location": "2F1E"},
		{"MedId": "", "ItemNumber": "104109", "ItemDescription": "METHYLDOPA TAB 250MG", "UOM": "100 TABS/BO", "Price": 13.81, "Source": "INV", "VendNumber": "119297", "OrderQty": 100, "Location": "2E2C"},
		{"MedId": "", "ItemNumber": "104110", "ItemDescription": "INDOMETHACIN CAP 25MG", "UOM": "100 CAPS/BO", "Price": 4, "Source": "W/S", "VendNumber": "4039293", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104111", "ItemDescription": "PROPRAN TAB 40MG", "UOM": "100 TABS/BO", "Price": 29.08, "Source": "W/S", "VendNumber": "107209", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104113", "ItemDescription": "NADOLOL TAB 40MG", "UOM": "100 TABS/BO", "Price": 166.34, "Source": "W/S", "VendNumber": "630804", "OrderQty": 1, "Location": "2E6F"},
		{"MedId": "", "ItemNumber": "104114", "ItemDescription": "FERROUS SUL TAB 325MG", "UOM": "1000 TABS/BO", "Price": 8.55, "Source": "INV", "VendNumber": "589376", "OrderQty": 1000, "Location": "2C3M"},
		{"MedId": "", "ItemNumber": "104115", "ItemDescription": "ASPIRIN TAB BUFF 325MG", "UOM": "100 TABS/BO", "Price": 2, "Source": "INV", "VendNumber": "2812444", "OrderQty": 100, "Location": "2A3I"},
		{"MedId": "", "ItemNumber": "104117", "ItemDescription": "BENAZEPRIL TAB 10MG", "UOM": "100 TABS/BO", "Price": 8.6, "Source": "INV", "VendNumber": "4972550", "OrderQty": 100, "Location": "2A4F"},
		{"MedId": "", "ItemNumber": "104118", "ItemDescription": "BENAZEPRIL TAB 20MG", "UOM": "100 TABS/BO", "Price": 3.87, "Source": "INV", "VendNumber": "409920", "OrderQty": 100, "Location": "2A4G"},
		{"MedId": "", "ItemNumber": "104121", "ItemDescription": "VITAMIN E CAP 1000IU", "UOM": "100 CAPS/BO", "Price": 10, "Source": "W/S", "VendNumber": "2307023", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104124", "ItemDescription": "BISMUTH LIQ 16OZ", "UOM": "None", "Price": 3.72, "Source": "INV", "VendNumber": "3610268", "OrderQty": 1, "Location": "6A3B"},
		{"MedId": "", "ItemNumber": "104125", "ItemDescription": "CALCIUM D TAB 250MG", "UOM": "1000 TABS/BO", "Price": 7, "Source": "INV", "VendNumber": "460956", "OrderQty": 1000, "Location": "2A6A"},
		{"MedId": "", "ItemNumber": "104127", "ItemDescription": "SALINE MIST 50ML", "UOM": "None", "Price": 0.66, "Source": "INV", "VendNumber": "527150", "OrderQty": 1, "Location": "1D2F"},
		{"MedId": "", "ItemNumber": "104128", "ItemDescription": "ACYCLOVIR CAP 200MG", "UOM": "100 CAPS/BO", "Price": 9.09, "Source": "INV", "VendNumber": "546313", "OrderQty": 100, "Location": "2A1C"},
		{"MedId": "", "ItemNumber": "104130", "ItemDescription": "MULTIVIT W/ZINC TAB", "UOM": "60 TABS/BO", "Price": 2.292, "Source": "INV", "VendNumber": "673020", "OrderQty": 60, "Location": "2E6E"},
		{"MedId": "", "ItemNumber": "104135", "ItemDescription": "CYANOCOBAL TAB 1000MCG", "UOM": "100 TABS/BO", "Price": 2.92, "Source": "INV", "VendNumber": "693317", "OrderQty": 100, "Location": "2B5F"},
		{"MedId": "", "ItemNumber": "104138", "ItemDescription": "DAPSONE TAB 100MG", "UOM": "30 TABS/BO", "Price": 77.3898, "Source": "W/S", "VendNumber": "553511", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104139", "ItemDescription": "PONARIS NASAL EMOLLIENT", "UOM": "None", "Price": 10.17, "Source": "INV", "VendNumber": "083055", "OrderQty": 1, "Location": "1D2D"},
		{"MedId": "", "ItemNumber": "104141", "ItemDescription": "MONISTAT 3 DUAL PAK", "UOM": "None", "Price": 6.36, "Source": "W/S", "VendNumber": "2939866", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104658", "ItemDescription": "COLLAGEN FLOUR JAR 0.5GM", "UOM": "6 JARS/BX", "Price": 337.2, "Source": "INV", "VendNumber": "505511", "OrderQty": 6, "Location": "1D6A"},
		{"MedId": "", "ItemNumber": "104709", "ItemDescription": "ACETAMIN TAB 80MG", "UOM": "30 TABS/BO", "Price": 0.9, "Source": "W/S", "VendNumber": "2163442", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104710", "ItemDescription": "FENTANYL PATCH 100MCG UD", "UOM": "5 PATCH/BX", "Price": 35.81, "Source": "W/S", "VendNumber": "086544", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104711", "ItemDescription": "FENTANYL PATCH 50MCG U/D", "UOM": "5 PATCH/BX", "Price": 16.67, "Source": "W/S", "VendNumber": "220739", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104712", "ItemDescription": "FENTANYL PATCH 25MCG U/D", "UOM": "5 PATCH/BX", "Price": 9.26, "Source": "W/S", "VendNumber": "086518", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104713", "ItemDescription": "FENTANYL PATCH 75MCG U/D", "UOM": "5 PATCH/BX", "Price": 26.43, "Source": "W/S", "VendNumber": "086532", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104715", "ItemDescription": "ITRACONAZOLE CAP 100MG", "UOM": "30 CAPS/BO", "Price": 147.3, "Source": "W/S", "VendNumber": "4728747", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104718", "ItemDescription": "POT CITR PKT 30MEQ", "UOM": "100 PKT/BX", "Price": 86.24, "Source": "W/S", "VendNumber": "2861474", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104719", "ItemDescription": "LEVOFLOXACIN TAB 250MG", "UOM": "100 TABS/BO", "Price": 17.27, "Source": "INV", "VendNumber": "128629", "OrderQty": 100, "Location": "2D4H"},
		{"MedId": "", "ItemNumber": "104722", "ItemDescription": "LEVOFLOXACIN MB 500MG 100", "UOM": "24 BAGS/CA", "Price": 48.17, "Source": "INV", "VendNumber": "569975", "OrderQty": 24, "Location": "7D2A"},
		{"MedId": "", "ItemNumber": "104724", "ItemDescription": "INFLIXIMAB VL 100MG", "UOM": "None", "Price": 1035.58, "Source": "W/S", "VendNumber": "015016", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104726", "ItemDescription": "ACETAMIN TAB 500MG", "UOM": "1000 TABS/BO", "Price": 22.75, "Source": "INV", "VendNumber": "586107", "OrderQty": 1000, "Location": "2A1A"},
		{"MedId": "", "ItemNumber": "104730", "ItemDescription": "POLYCITRA LIQ 500ML", "UOM": "None", "Price": 10.34, "Source": "W/S", "VendNumber": "2752111", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104732", "ItemDescription": "ITRACONAZOLE SOL 150ML", "UOM": "None", "Price": 281.9, "Source": "W/S", "VendNumber": "2544633", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104733", "ItemDescription": "EPOETIN VL 2000U 1ML", "UOM": "6 VIALS/CT", "Price": 278.05, "Source": "W/S", "VendNumber": "1889013", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104734", "ItemDescription": "EPOETIN VL 4000U 1ML", "UOM": "6 VIALS/CT", "Price": 568.04, "Source": "INV", "VendNumber": "1889039", "OrderQty": 6, "Location": "10A4C"},
		{"MedId": "", "ItemNumber": "104735", "ItemDescription": "EPOETIN VL 20000U 1ML", "UOM": "4 VIALS/CT", "Price": 1013.66, "Source": "INV", "VendNumber": "660757", "OrderQty": 4, "Location": "10A4E"},
		{"MedId": "", "ItemNumber": "104736", "ItemDescription": "EPOETIN VL 40000U 1ML", "UOM": "4 VIALS/CT", "Price": 1984.69, "Source": "INV", "VendNumber": "2838514", "OrderQty": 4, "Location": "10A4F"},
		{"MedId": "", "ItemNumber": "104737", "ItemDescription": "GALANTAMINE TAB 4MG", "UOM": "60 TABS/BO", "Price": 54.34, "Source": "INV", "VendNumber": "041707", "OrderQty": 60, "Location": "2C6C"},
		{"MedId": "", "ItemNumber": "104738", "ItemDescription": "GALANTAMINE TAB 8MG", "UOM": "60 TABS/BO", "Price": 37.6296, "Source": "INV", "VendNumber": "070488", "OrderQty": 60, "Location": "2C6D"},
		{"MedId": "", "ItemNumber": "104739", "ItemDescription": "NESIRITIDE VL 1.5MG/5ML", "UOM": "None", "Price": 759.56, "Source": "W/S", "VendNumber": "3282134", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104741", "ItemDescription": "LEVOFLOXACIN PB 250MG", "UOM": "24 BAGS/BX", "Price": 39.7896, "Source": "INV", "VendNumber": "319552", "OrderQty": 24, "Location": "7D1D"},
		{"MedId": "", "ItemNumber": "104742", "ItemDescription": "CYCLOBENZAPRINE TAB 5MG", "UOM": "1000 TABS/BO", "Price": 27.03, "Source": "INV", "VendNumber": "256089", "OrderQty": 1000, "Location": "2B5G"},
		{"MedId": "", "ItemNumber": "104743", "ItemDescription": "LEVOFLOXACIN PB 750MG", "UOM": "24 BAGS/CA", "Price": 53.96, "Source": "INV", "VendNumber": "569982", "OrderQty": 24, "Location": "7D4A"},
		{"MedId": "", "ItemNumber": "104744", "ItemDescription": "KETOCONAZOLE SHAMPOO 2%", "UOM": "None", "Price": 9.61, "Source": "W/S", "VendNumber": "3542099", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104745", "ItemDescription": "EPOETIN VL 3000U 1ML", "UOM": "6 VIALS/CT", "Price": 417.07, "Source": "INV", "VendNumber": "1889021", "OrderQty": 6, "Location": "10A4B"},
		{"MedId": "", "ItemNumber": "104746", "ItemDescription": "EPOETIN VL 10000U 1ML", "UOM": "6 VIALS/CT", "Price": 760.2498, "Source": "INV", "VendNumber": "209189", "OrderQty": 6, "Location": "10A4D"},
		{"MedId": "", "ItemNumber": "104823", "ItemDescription": "NIACIN TAB SR 500MG", "UOM": "90 TABS/BO", "Price": 59.1, "Source": "W/S", "VendNumber": "245126", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104849", "ItemDescription": "GANCICLOVIR VL 500MG", "UOM": "25 VIALS/BX", "Price": 1682.5, "Source": "W/S", "VendNumber": "4334108", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104850", "ItemDescription": "TORSEMIDE TAB 10MG", "UOM": "100 TABS/BO", "Price": 5.23, "Source": "W/S", "VendNumber": "4251104", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104855", "ItemDescription": "OSELVTAMIVIR CAP 75MG BUL", "UOM": "10 CAPS/BX", "Price": 124.44, "Source": "W/S", "VendNumber": "5308697", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104856", "ItemDescription": "CAPECITABINE TAB 500MG", "UOM": "20 TABS/BO", "Price": 515.93, "Source": "W/S", "VendNumber": "5012851", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104857", "ItemDescription": "MYCOPHENOLATE VL 500MG", "UOM": "4 VIALS/CT", "Price": 234.86, "Source": "W/S", "VendNumber": "590273", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104858", "ItemDescription": "MYCOPHENOLATE CAP 250MG", "UOM": "100 CAPS/BO", "Price": 29.02, "Source": "W/S", "VendNumber": "370150", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104859", "ItemDescription": "FLUMAZENIL VL 0.5MG 5ML", "UOM": "10 VIALS/CT", "Price": 37.34, "Source": "INV", "VendNumber": "323978", "OrderQty": 10, "Location": "4C3A"},
		{"MedId": "", "ItemNumber": "104862", "ItemDescription": "CEFTRIAXONE VL 250MG", "UOM": "10 VIALS/BX", "Price": 6.54, "Source": "INV", "VendNumber": "480867", "OrderQty": 10, "Location": "3F1A"},
		{"MedId": "", "ItemNumber": "104869", "ItemDescription": "PRIMIDONE TAB 50MG", "UOM": "100 TABS/BO", "Price": 6.78, "Source": "INV", "VendNumber": "092895", "OrderQty": 100, "Location": "3A1L"},
		{"MedId": "", "ItemNumber": "104870", "ItemDescription": "LANOLIN TENDER CARE 0.3OZ", "UOM": "50 TUBES/CA", "Price": 91.98, "Source": "INV", "VendNumber": "87121", "OrderQty": 50, "Location": "1E2F"},
		{"MedId": "", "ItemNumber": "104884", "ItemDescription": "LACTOBICILLUS CAP", "UOM": "100 CAPS/BO", "Price": 2.09, "Source": "W/S", "VendNumber": "512632", "OrderQty": 1, "Location": "2D3J"},
		{"MedId": "", "ItemNumber": "104885", "ItemDescription": "CHOLECALCIFEROL CAP 400IU", "UOM": "100 CAPS/BO", "Price": 1.14, "Source": "INV", "VendNumber": "761484", "OrderQty": 100, "Location": "2B2H"},
		{"MedId": "", "ItemNumber": "104889", "ItemDescription": "HEMORRHOIDAL SUPP PLAIN", "UOM": "12 SUPP/BX", "Price": 1.0704, "Source": "INV", "VendNumber": "2163434", "OrderQty": 12, "Location": "1B2C"},
		{"MedId": "", "ItemNumber": "104891", "ItemDescription": "BISACODYL TAB 5MG", "UOM": "100 TABS/BO", "Price": 2.17, "Source": "INV", "VendNumber": "367370", "OrderQty": 100, "Location": "2A5B"},
		{"MedId": "", "ItemNumber": "104892", "ItemDescription": "BUTALBITAL/APAP/CAF TAB", "UOM": "100 TABS/BO", "Price": 53.9, "Source": "W/S", "VendNumber": "900506", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104894", "ItemDescription": "DIPHENHYD CAP 50MG U/D", "UOM": "100 CAPS/BX", "Price": 3, "Source": "INV", "VendNumber": "723916", "OrderQty": 100, "Location": "2C1G"},
		{"MedId": "", "ItemNumber": "104896", "ItemDescription": "CARBAMIDE PEROXIDE 15ML", "UOM": "None", "Price": 0.94, "Source": "INV", "VendNumber": "278782", "OrderQty": 1, "Location": "1A6D"},
		{"MedId": "", "ItemNumber": "104898", "ItemDescription": "SULFACET OPH SOL 10% 1 BOT", "UOM": "None", "Price": 34.19, "Source": "INV", "VendNumber": "757183", "OrderQty": 1, "Location": "1A5H"},
		{"MedId": "", "ItemNumber": "104899", "ItemDescription": "VERAPAMIL TAB 120MG", "UOM": "100 TABS/BO", "Price": 8.41, "Source": "INV", "VendNumber": "713727", "OrderQty": 100, "Location": "3B4C"},
		{"MedId": "", "ItemNumber": "104900", "ItemDescription": "VIT E CAP 400 IU", "UOM": "100 CAPS/BO", "Price": 4.08, "Source": "INV", "VendNumber": "724401", "OrderQty": 100, "Location": "3B4H"},
		{"MedId": "", "ItemNumber": "104901", "ItemDescription": "NTG PATCH 0.2MG/HR", "UOM": "30 PATCH/BX", "Price": 13.8, "Source": "W/S", "VendNumber": "627133", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104902", "ItemDescription": "NTG PATCH 0.4MG/HR", "UOM": "30 PATCH/BX", "Price": 14.1099, "Source": "W/S", "VendNumber": "627113", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104903", "ItemDescription": "MULTIVIT THERAP TAB", "UOM": "1000 TABS/BO", "Price": 15.73, "Source": "INV", "VendNumber": "462754", "OrderQty": 1000, "Location": "2E6C"},
		{"MedId": "", "ItemNumber": "104904", "ItemDescription": "SELEGILINE TAB 5MG", "UOM": "60 TABS/BO", "Price": 71.4, "Source": "W/S", "VendNumber": "2953792", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104905", "ItemDescription": "VIT A CAP 10000U", "UOM": "100 CAPS/BO", "Price": 2, "Source": "W/S", "VendNumber": "2306850", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104907", "ItemDescription": "MAGNESIUM 500MG (SLO-MAG)", "UOM": "60 TABS/BO", "Price": 4.548, "Source": "INV", "VendNumber": "123620", "OrderQty": 60, "Location": "2D6J"},
		{"MedId": "", "ItemNumber": "104908", "ItemDescription": "VIT B W/VIT C CAP", "UOM": "130 CAPS/BO", "Price": 2.795, "Source": "INV", "VendNumber": "762062", "OrderQty": 130, "Location": "3B4G"},
		{"MedId": "", "ItemNumber": "104910", "ItemDescription": "VIT E CAP 200 IU", "UOM": "100 CAPS/BO", "Price": 2, "Source": "W/S", "VendNumber": "2163004", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104911", "ItemDescription": "NIACIN TAB 500 MG", "UOM": "100 TABS/BO", "Price": 1.98, "Source": "W/S", "VendNumber": "2162527", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104912", "ItemDescription": "GEMFIBROZIL TAB 600MG", "UOM": "500 TABS/BO", "Price": 53.69, "Source": "INV", "VendNumber": "546510", "OrderQty": 500, "Location": "2C6E"},
		{"MedId": "", "ItemNumber": "104914", "ItemDescription": "BISMUTH TAB", "UOM": "30 TABS/BO", "Price": 1.671, "Source": "INV", "VendNumber": "2236560", "OrderQty": 30, "Location": "2A5C"},
		{"MedId": "", "ItemNumber": "104915", "ItemDescription": "LACTAID TAB", "UOM": "60 TABS/BO", "Price": 3.912, "Source": "INV", "VendNumber": "346973", "OrderQty": 60, "Location": "2D3I"},
		{"MedId": "", "ItemNumber": "104923", "ItemDescription": "SENNA TAB BULK", "UOM": "1000 TABS/BO", "Price": 6.5, "Source": "INV", "VendNumber": "408708", "OrderQty": 1000, "Location": "3A5A"},
		{"MedId": "", "ItemNumber": "104931", "ItemDescription": "NAPROSYN TAB 500MG", "UOM": "100 TABS/BO", "Price": 5.01, "Source": "INV", "VendNumber": "430557", "OrderQty": 100, "Location": "2E6G"},
		{"MedId": "", "ItemNumber": "104934", "ItemDescription": "ASPIRIN TAB 325MG", "UOM": "500 TABS/BO", "Price": 3.1, "Source": "INV", "VendNumber": "391971", "OrderQty": 500, "Location": "2A3H"},
		{"MedId": "", "ItemNumber": "104935", "ItemDescription": "SENNA LIQ. 8 OZ.", "UOM": "None", "Price": 11, "Source": "INV", "VendNumber": "356154", "OrderQty": 1, "Location": "6C3E"},
		{"MedId": "", "ItemNumber": "104936", "ItemDescription": "ASPIRIN TAB CHEW 81MG", "UOM": "750 TABS/BO", "Price": 22.425, "Source": "INV", "VendNumber": "622492", "OrderQty": 750, "Location": "6D4A"},
		{"MedId": "", "ItemNumber": "104937", "ItemDescription": "TRIPROL/PSEUDO TAB U/D", "UOM": "24 TABS/BO", "Price": 1.2, "Source": "W/S", "VendNumber": "2163780", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104941", "ItemDescription": "SIMETHICONE DROPS 30ML", "UOM": "None", "Price": 1.69, "Source": "INV", "VendNumber": "456525", "OrderQty": 1, "Location": "6C3G"},
		{"MedId": "", "ItemNumber": "104942", "ItemDescription": "CAPTOPRIL TAB 25MG", "UOM": "100 TABS/BO", "Price": 91, "Source": "INV", "VendNumber": "2427680", "OrderQty": 100, "Location": "2A6G"},
		{"MedId": "", "ItemNumber": "104943", "ItemDescription": "PSEUDOEPED TAB 30MG", "UOM": "24 TABS/BO", "Price": 0.9504, "Source": "INV", "VendNumber": "738336", "OrderQty": 24, "Location": "3A2G"},
		{"MedId": "", "ItemNumber": "104944", "ItemDescription": "PSEUDOEPED TAB 60MG", "UOM": "100 TABS/BO", "Price": 2.79, "Source": "INV", "VendNumber": "739722", "OrderQty": 100, "Location": "3A2H"},
		{"MedId": "", "ItemNumber": "104946", "ItemDescription": "ISOSORBIDE TAB 5MG", "UOM": "100 TABS/BO", "Price": 43.31, "Source": "W/S", "VendNumber": "280669", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104947", "ItemDescription": "DIMENHYDR TAB 50MG", "UOM": "100 TABS/BO", "Price": 1, "Source": "W/S", "VendNumber": "2164192", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104948", "ItemDescription": "AMITRIPTY TAB 75MG", "UOM": "100 TABS/BO", "Price": 70.46, "Source": "INV", "VendNumber": "278143", "OrderQty": 100, "Location": "2A2D"},
		{"MedId": "", "ItemNumber": "104949", "ItemDescription": "MAG HYDROX PLUS LIQ 12OZ.", "UOM": "None", "Price": 1.72, "Source": "INV", "VendNumber": "797449", "OrderQty": 1, "Location": "6B5B"},
		{"MedId": "", "ItemNumber": "104952", "ItemDescription": "DICYCLOMINE TAB 20MG", "UOM": "100 TABS/BO", "Price": 24.86, "Source": "INV", "VendNumber": "945089", "OrderQty": 100, "Location": "2B6E"},
		{"MedId": "", "ItemNumber": "104953", "ItemDescription": "NTG PATCH 0.6MG/HR", "UOM": "30 PATCH/BX", "Price": 22.2, "Source": "W/S", "VendNumber": "3302148", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104954", "ItemDescription": "LORAZEPAM TAB 1MG", "UOM": "100 TABS/BO", "Price": 6.32, "Source": "W/S", "VendNumber": "286518", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "104971", "ItemDescription": "METHOTREXATE VL 1GM", "UOM": "None", "Price": 14.91, "Source": "INV", "VendNumber": "279299", "OrderQty": 1, "Location": "9E1D"},
		{"MedId": "", "ItemNumber": "104972", "ItemDescription": "CYTARABINE VL 2GM", "UOM": "None", "Price": 11.75, "Source": "INV", "VendNumber": "3561065", "OrderQty": 1, "Location": "9D3C"},
		{"MedId": "", "ItemNumber": "104974", "ItemDescription": "FLUCONAZOLE PB 400MG", "UOM": "6 BAGS/CT", "Price": 22.6602, "Source": "INV", "VendNumber": "246052", "OrderQty": 6, "Location": "4C2A"},
		{"MedId": "", "ItemNumber": "104975", "ItemDescription": "HYDROMORP VL HP 50MG 5ML", "UOM": "10 VIALS/CT", "Price": 53.61, "Source": "W/S", "VendNumber": "070565", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105009", "ItemDescription": "CAP PORT ADAPTR M F LUERLK RED", "UOM": "None", "Price": 11.52, "Source": "W/S", "VendNumber": "MX491-01", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105047", "ItemDescription": "BIVALIRUDIN VL 250MG", "UOM": "10 VIALS/CT", "Price": 1326.24, "Source": "INV", "VendNumber": "416394", "OrderQty": 10, "Location": "3D3C"},
		{"MedId": "", "ItemNumber": "105048", "ItemDescription": "CICLOPIROX CR 0.77% 15GM", "UOM": "None", "Price": 3.94, "Source": "INV", "VendNumber": "492823", "OrderQty": 1, "Location": "1D5D"},
		{"MedId": "", "ItemNumber": "105049", "ItemDescription": "PALIVIZUMAB VL 100MG", "UOM": "None", "Price": 2338.09, "Source": "W/S", "VendNumber": "3698123", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105050", "ItemDescription": "PALIVIZUMAB VL 50MG", "UOM": "None", "Price": 1372.71, "Source": "W/S", "VendNumber": "3698131", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105052", "ItemDescription": "AMBER BAG 5X7.5  (IV)", "UOM": "None", "Price": 37, "Source": "W/S", "VendNumber": "541-SUPBD", "OrderQty": 1, "Location": "9F1A"},
		{"MedId": "", "ItemNumber": "105063", "ItemDescription": "BENZOCAINE SPRAY 2OZ", "UOM": "None", "Price": 59.7996, "Source": "INV", "VendNumber": "471920", "OrderQty": 1, "Location": "6D4B"},
		{"MedId": "", "ItemNumber": "105280", "ItemDescription": "MMR II VL (MEAS/MUMP/RUB", "UOM": "10 VIALS/CT", "Price": 619.1, "Source": "INV", "VendNumber": "092023", "OrderQty": 10, "Location": "10C2A"},
		{"MedId": "", "ItemNumber": "105283", "ItemDescription": "CHICKEN POX VACCINE", "UOM": "10 VIALS/CT", "Price": 1151.53, "Source": "INV", "VendNumber": "039321", "OrderQty": 10, "Location": "10B1B"},
		{"MedId": "", "ItemNumber": "105284", "ItemDescription": "DORZOLAMIDE OPHTH 10ML", "UOM": "None", "Price": 8.54, "Source": "INV", "VendNumber": "176438", "OrderQty": 1, "Location": "1A3H"},
		{"MedId": "", "ItemNumber": "105286", "ItemDescription": "ERTAPENEM VL 1GM", "UOM": "10 VIALS/CT", "Price": 1078.17, "Source": "INV", "VendNumber": "347841", "OrderQty": 10, "Location": "4B5C"},
		{"MedId": "", "ItemNumber": "105287", "ItemDescription": "EZETIMIDE TAB 10MG", "UOM": "90 TABS/BO", "Price": 35.577, "Source": "INV", "VendNumber": "600027", "OrderQty": 90, "Location": "2C3I"},
		{"MedId": "", "ItemNumber": "105291", "ItemDescription": "INDOMETHACIN VL 1MG", "UOM": "None", "Price": 353.56, "Source": "INV", "VendNumber": "63323-0659-03", "OrderQty": 1, "Location": "4D4C"},
		{"MedId": "", "ItemNumber": "105292", "ItemDescription": "PHYTONADIONE TAB 5MG", "UOM": "100 TABS/BO", "Price": 5413.57, "Source": "INV", "VendNumber": "230831", "OrderQty": 100, "Location": "2F5F"},
		{"MedId": "", "ItemNumber": "105293", "ItemDescription": "ETHACRYNIC ACID VL 50MG", "UOM": "None", "Price": 729.85, "Source": "W/S", "VendNumber": "4039020", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105295", "ItemDescription": "DACTINOMYCIN VL .5MG 3ML", "UOM": "None", "Price": 1117, "Source": "W/S", "VendNumber": "41728", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105296", "ItemDescription": "CHLOROTHIAZIDE VL INJECT 500MG", "UOM": "None", "Price": 54.45, "Source": "W/S", "VendNumber": "5150230", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105300", "ItemDescription": "ALENDRONATE TAB 10MG", "UOM": "20 TABS/BO", "Price": 8.2, "Source": "W/S", "VendNumber": "246819", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105302", "ItemDescription": "LOSARTAN TAB 25MG", "UOM": "90 TABS/BO", "Price": 2.322, "Source": "INV", "VendNumber": "602918", "OrderQty": 90, "Location": "2D6G"},
		{"MedId": "", "ItemNumber": "105304", "ItemDescription": "ALENDRONATE TAB 5MG", "UOM": "30 TABS/BO", "Price": 3.9, "Source": "W/S", "VendNumber": "4044954", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105305", "ItemDescription": "MONTELUKAST TAB 5MG BULK", "UOM": "30 TABS/BO", "Price": 6.07, "Source": "W/S", "VendNumber": "4728556", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105313", "ItemDescription": "ALENDRONATE TAB 70MG", "UOM": "20 TABS/BO", "Price": 7.48, "Source": "INV", "VendNumber": "480006", "OrderQty": 20, "Location": "2A1D"},
		{"MedId": "", "ItemNumber": "105317", "ItemDescription": "PNEUMOCOCCOL VAC VL", "UOM": "10 VIALS/CT", "Price": 798.56, "Source": "INV", "VendNumber": "124834", "OrderQty": 10, "Location": "10C5A"},
		{"MedId": "", "ItemNumber": "105327", "ItemDescription": "PILOCARP TAB 5MG", "UOM": "100 TABS/BO", "Price": 94.72, "Source": "W/S", "VendNumber": "502068", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105357", "ItemDescription": "POT CITR TAB 5MEQ", "UOM": "100 TABS/BO", "Price": 76.86, "Source": "INV", "VendNumber": "347548", "OrderQty": 100, "Location": "2F6C"},
		{"MedId": "", "ItemNumber": "105361", "ItemDescription": "LIOTHYRONINE TAB 25MCG", "UOM": "100 TABS/BO", "Price": 68, "Source": "W/S", "VendNumber": "4797213", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105363", "ItemDescription": "EPINEPHRINE SOL 1:1000 OZ", "UOM": "None", "Price": 90.76, "Source": "INV", "VendNumber": "071340", "OrderQty": 1, "Location": "1D6F"},
		{"MedId": "", "ItemNumber": "105365", "ItemDescription": "PCN/BENZATHINE LA 2.4MU", "UOM": "10 SYR/CT", "Price": 2713.53, "Source": "W/S", "VendNumber": "561790", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105366", "ItemDescription": "RAMIPRIL CAP 1.25MG", "UOM": "30 CAPS/BO", "Price": 3.7698, "Source": "W/S", "VendNumber": "255442", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105367", "ItemDescription": "RAMIPRIL CAP 5MG", "UOM": "100 CAPS/BO", "Price": 10.96, "Source": "INV", "VendNumber": "998054", "OrderQty": 100, "Location": "3A3I"},
		{"MedId": "", "ItemNumber": "105369", "ItemDescription": "SYNERCID VL 500MG", "UOM": "10 VIALS/CT", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105371", "ItemDescription": "METHOHEXITAL VL 500MG", "UOM": "None", "Price": 54.9, "Source": "W/S", "VendNumber": "123984", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105372", "ItemDescription": "THROMBIN KIT 20 UNIT", "UOM": "None", "Price": 177.92, "Source": "INV", "VendNumber": "531061", "OrderQty": 1, "Location": "9B5B"},
		{"MedId": "", "ItemNumber": "105374", "ItemDescription": "PCN/BENZATHINE LA 1.2MU", "UOM": "10 SYR/CT", "Price": 1324.1, "Source": "W/S", "VendNumber": "561783", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105375", "ItemDescription": "THROMBIN TOPICAL 5000U", "UOM": "None", "Price": 43.83, "Source": "INV", "VendNumber": "621255", "OrderQty": 1, "Location": "1F5G"},
		{"MedId": "", "ItemNumber": "105376", "ItemDescription": "TRIMETHOBENZ VL 200MG", "UOM": "25 VL/CT", "Price": 676.02, "Source": "W/S", "VendNumber": "743714", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105377", "ItemDescription": "NYSTATIN SUSP 16OZ", "UOM": "None", "Price": 26.81, "Source": "INV", "VendNumber": "173777", "OrderQty": 1, "Location": "6B6C"},
		{"MedId": "", "ItemNumber": "105379", "ItemDescription": "VALPROIC ACID SYR 16 OZ", "UOM": "None", "Price": 5.37, "Source": "INV", "VendNumber": "864579", "OrderQty": 1, "Location": "6C4D"},
		{"MedId": "", "ItemNumber": "105381", "ItemDescription": "FERROUS SUL DROPS 50ML", "UOM": "None", "Price": 2.65, "Source": "INV", "VendNumber": "017311", "OrderQty": 1, "Location": "6A6E"},
		{"MedId": "", "ItemNumber": "105382", "ItemDescription": "ACETIC ACID OTIC 2% 15ML", "UOM": "None", "Price": 14.09, "Source": "W/S", "VendNumber": "4277976", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105383", "ItemDescription": "HALOPERIDOL TAB .5MG", "UOM": "100 TABS/BO", "Price": 21.9, "Source": "W/S", "VendNumber": "1669852", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105384", "ItemDescription": "HALOPERIDOL TAB 1MG", "UOM": "100 TABS/BO", "Price": 33.43, "Source": "W/S", "VendNumber": "948260", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105385", "ItemDescription": "HALOPERIDOL TAB 2MG", "UOM": "100 TABS/BO", "Price": 42, "Source": "W/S", "VendNumber": "1669837", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105386", "ItemDescription": "HALOPERIDOL TAB 5MG", "UOM": "100 TABS/BO", "Price": 23.23, "Source": "W/S", "VendNumber": "1737030", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105387", "ItemDescription": "LOPERAMIDE CAP 2MG", "UOM": "100 CAPS/BO", "Price": 23.94, "Source": "W/S", "VendNumber": "606137", "OrderQty": 1, "Location": "2D6D"},
		{"MedId": "", "ItemNumber": "105389", "ItemDescription": "NTG PATCH 0.1MG/HR", "UOM": "30 PATCH/BX", "Price": 15.3, "Source": "W/S", "VendNumber": "2737310", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105391", "ItemDescription": "CARBI/LEVO CR 50/200", "UOM": "100 TABS/BO", "Price": 16.82, "Source": "INV", "VendNumber": "4058491", "OrderQty": 100, "Location": "2B1D"},
		{"MedId": "", "ItemNumber": "105394", "ItemDescription": "ENALAPRIL TAB 2.5MG", "UOM": "100 TABS/BO", "Price": 10.34, "Source": "INV", "VendNumber": "692285", "OrderQty": 100, "Location": "2C3A"},
		{"MedId": "", "ItemNumber": "105395", "ItemDescription": "CARBI/LEVO CR 25/100", "UOM": "100 TABS/BO", "Price": 63.63, "Source": "INV", "VendNumber": "278887", "OrderQty": 100, "Location": "2B1B"},
		{"MedId": "", "ItemNumber": "105396", "ItemDescription": "BUPROPRION TAB 75MG", "UOM": "100 TABS/BO", "Price": 18.76, "Source": "W/S", "VendNumber": "2939213", "OrderQty": 1, "Location": "2A5F"},
		{"MedId": "", "ItemNumber": "105397", "ItemDescription": "BUPROPRION TAB 100MG", "UOM": "100 TABS/BO", "Price": 37.79, "Source": "INV", "VendNumber": "633941", "OrderQty": 100, "Location": "2A5G"},
		{"MedId": "", "ItemNumber": "105398", "ItemDescription": "ESTRADIOL TAB 1MG", "UOM": "50 TABS/BO", "Price": 13.17, "Source": "W/S", "VendNumber": "553099", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105402", "ItemDescription": "GLYBURIDE TAB 3MG", "UOM": "100 TABS/BO", "Price": 11, "Source": "W/S", "VendNumber": "3254935", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105403", "ItemDescription": "GLYBURIDE TAB 1.5 MG", "UOM": "100 TABS/BO", "Price": 8.26, "Source": "W/S", "VendNumber": "3169000", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105405", "ItemDescription": "CALCIUM ACET CAP 667MG", "UOM": "200 CAPS/BO", "Price": 59.86, "Source": "INV", "VendNumber": "138805", "OrderQty": 200, "Location": "2A5L"},
		{"MedId": "", "ItemNumber": "105416", "ItemDescription": "RACEMIC EPI INH NEB 2.25%", "UOM": "30 NEBS/BX", "Price": 41.439, "Source": "INV", "VendNumber": "055520", "OrderQty": 30, "Location": "1D2E"},
		{"MedId": "", "ItemNumber": "105422", "ItemDescription": "MICONAZOLE 2% PWD 2.5OZ", "UOM": "None", "Price": 2.31, "Source": "INV", "VendNumber": "025609", "OrderQty": 1, "Location": "1F1A"},
		{"MedId": "", "ItemNumber": "105423", "ItemDescription": "NICOTINE PATCH 21MG", "UOM": "14 PATCH/BX", "Price": 23.8602, "Source": "INV", "VendNumber": "414969", "OrderQty": 14, "Location": "1F3C"},
		{"MedId": "", "ItemNumber": "105425", "ItemDescription": "NICOTINE PATCH 14MG", "UOM": "14 PATCH/BX", "Price": 23.8602, "Source": "INV", "VendNumber": "414957", "OrderQty": 14, "Location": "1F3B"},
		{"MedId": "", "ItemNumber": "105427", "ItemDescription": "NAPHAZOL PHENIRA OPH SOL", "UOM": "None", "Price": 5.34, "Source": "INV", "VendNumber": "838944", "OrderQty": 1, "Location": "1A5B"},
		{"MedId": "", "ItemNumber": "105429", "ItemDescription": "MCT OIL 32OZ", "UOM": "None", "Price": 43.99, "Source": "W/S", "VendNumber": "3621224", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105430", "ItemDescription": "AMPICILLIN 250MG/5 100ML", "UOM": "None", "Price": 5.59, "Source": "W/S", "VendNumber": "3684115", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105431", "ItemDescription": "IMIPRAMINE TAB 25MG", "UOM": "100 TABS/BO", "Price": 11.32, "Source": "W/S", "VendNumber": "1411412", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105432", "ItemDescription": "AMPICILLIN VL 1GM", "UOM": "10 VIALS/CT", "Price": 15.43, "Source": "INV", "VendNumber": "177826", "OrderQty": 10, "Location": "3C5A"},
		{"MedId": "", "ItemNumber": "105433", "ItemDescription": "AMPICILLIN VL 500MG", "UOM": "10 VIALS/CT", "Price": 11.52, "Source": "INV", "VendNumber": "199481", "OrderQty": 10, "Location": "3C4B"},
		{"MedId": "", "ItemNumber": "105435", "ItemDescription": "ATENOLOL TAB 50MG", "UOM": "1000 TABS/BO", "Price": 17.41, "Source": "INV", "VendNumber": "3913225", "OrderQty": 1000, "Location": "2A3L"},
		{"MedId": "", "ItemNumber": "105436", "ItemDescription": "ATENOLOL TAB 25MG", "UOM": "100 TABS/BO", "Price": 1.89, "Source": "INV", "VendNumber": "695320", "OrderQty": 100, "Location": "2A3K"},
		{"MedId": "", "ItemNumber": "105440", "ItemDescription": "NAFCILLIN VL 2GM", "UOM": "10 VIALS/CT", "Price": 78.29, "Source": "INV", "VendNumber": "203493", "OrderQty": 10, "Location": "5A4C"},
		{"MedId": "", "ItemNumber": "105442", "ItemDescription": "IMIPRAMINE TAB 50MG", "UOM": "100 TABS/BO", "Price": 15.58, "Source": "W/S", "VendNumber": "532717", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105443", "ItemDescription": "BROMOCRIPTINE TAB 2.5MG", "UOM": "30 TABS/BO", "Price": 79.71, "Source": "W/S", "VendNumber": "4123295", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105444", "ItemDescription": "CEFAZOLIN VL 1GM", "UOM": "25 VIALS/CT", "Price": 20.04, "Source": "INV", "VendNumber": "200717", "OrderQty": 25, "Location": "6E1A"},
		{"MedId": "", "ItemNumber": "105448", "ItemDescription": "DEFEROXAMINE AMP 500MG", "UOM": "None", "Price": 8.8, "Source": "INV", "VendNumber": "071600", "OrderQty": 1, "Location": "3F2E"},
		{"MedId": "", "ItemNumber": "105449", "ItemDescription": "METHERGINE AMP 1ML", "UOM": "20 AMPS/CT", "Price": 255.31, "Source": "INV", "VendNumber": "094672", "OrderQty": 20, "Location": "10C1D"},
		{"MedId": "", "ItemNumber": "105450", "ItemDescription": "CYCLOSPOR CAP 25MG U/D", "UOM": "30 CAPS/BX", "Price": 67.239, "Source": "W/S", "VendNumber": "364687", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105451", "ItemDescription": "CYCLOSPOR CAP 100MG U/D", "UOM": "30 CAPS/BX", "Price": 372.3, "Source": "W/S", "VendNumber": "1810266", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105452", "ItemDescription": "VALSARTAN CAP 80MG", "UOM": "90 CAPS/BO", "Price": 7.488, "Source": "INV", "VendNumber": "498873", "OrderQty": 90, "Location": "3B3E"},
		{"MedId": "", "ItemNumber": "105453", "ItemDescription": "VALSARTAN CAP 160MG", "UOM": "90 CAPS/BO", "Price": 9.189, "Source": "INV", "VendNumber": "498899", "OrderQty": 90, "Location": "3B3F"},
		{"MedId": "", "ItemNumber": "105454", "ItemDescription": "CYCLOSPOR MICRO CAP 25MG", "UOM": "30 CAPS/BX", "Price": 53.529, "Source": "W/S", "VendNumber": "393298", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105455", "ItemDescription": "CYCLOSPOR MICRO CAP 100MG", "UOM": "30 CAPS/BX", "Price": 51.75, "Source": "W/S", "VendNumber": "436624", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105456", "ItemDescription": "LETROZOLE TAB 2.5MG", "UOM": "30 TABS/BO", "Price": 2.56, "Source": "W/S", "VendNumber": "130702", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105457", "ItemDescription": "RIVASTIGMINE CAP 3MG", "UOM": "60 CAPS/BO", "Price": 63.6, "Source": "W/S", "VendNumber": "4725552", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105458", "ItemDescription": "RIVASTIGMINE CAP 1.5MG", "UOM": "60 CAPS/BO", "Price": 63.6, "Source": "W/S", "VendNumber": "4725545", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105460", "ItemDescription": "CARBAMAZEP TAB SR 400MG", "UOM": "30 TABS/BO", "Price": 138.6, "Source": "W/S", "VendNumber": "4556361", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105463", "ItemDescription": "CARBAMAZEP TAB SR 100MG", "UOM": "100 TABS/BO", "Price": 64.2, "Source": "W/S", "VendNumber": "521346", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105464", "ItemDescription": "NATEGLINIDE TAB 120MG", "UOM": "100 TABS/BO", "Price": 53.5, "Source": "INV", "VendNumber": "020154", "OrderQty": 100, "Location": "2E6I"},
		{"MedId": "", "ItemNumber": "105465", "ItemDescription": "VALSARTAN TAB 40MG", "UOM": "30 TABS/BO", "Price": 3.369, "Source": "INV", "VendNumber": "324975", "OrderQty": 30, "Location": "3B3D"},
		{"MedId": "", "ItemNumber": "105466", "ItemDescription": "OXCARBAZEPINE TAB 300MG", "UOM": "100 TABS/BO", "Price": 32.59, "Source": "W/S", "VendNumber": "359493", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105468", "ItemDescription": "OCTREOTIDE VL 100MCG 1ML", "UOM": "10 VIALS/CT", "Price": 25.7, "Source": "INV", "VendNumber": "637569", "OrderQty": 10, "Location": "10C3A"},
		{"MedId": "", "ItemNumber": "105470", "ItemDescription": "CALCITONIN VL 400MRC UNIT", "UOM": "None", "Price": 2103.1, "Source": "INV", "VendNumber": "569889", "OrderQty": 1, "Location": "10A2C"},
		{"MedId": "", "ItemNumber": "105476", "ItemDescription": "REPAGLINIDE TAB 1MG", "UOM": "100 TABS/BO", "Price": 22.88, "Source": "W/S", "VendNumber": "234928", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105477", "ItemDescription": "REPAGLINIDE TAB 2MG", "UOM": "100 TABS/BO", "Price": 37.38, "Source": "W/S", "VendNumber": "4900114", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105478", "ItemDescription": "REPAGLINIDE TAB 0.5MG", "UOM": "100 TABS/BO", "Price": 23.3799, "Source": "W/S", "VendNumber": "237565", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105479", "ItemDescription": "INSULIN NOVOLIN R", "UOM": "None", "Price": 13.13, "Source": "INV", "VendNumber": "030890", "OrderQty": 1, "Location": "10A8D"},
		{"MedId": "", "ItemNumber": "105480", "ItemDescription": "INSULIN NOVOLIN N", "UOM": "None", "Price": 13.13, "Source": "INV", "VendNumber": "030908", "OrderQty": 1, "Location": "10A8A"},
		{"MedId": "", "ItemNumber": "105503", "ItemDescription": "CILOSTAZOL TAB 100 MG", "UOM": "60 TABS/BO", "Price": 6.258, "Source": "INV", "VendNumber": "194704", "OrderQty": 60, "Location": "2B3C"},
		{"MedId": "", "ItemNumber": "105504", "ItemDescription": "CILOSTAZOL TAB 50MG", "UOM": "60 TABS/BO", "Price": 6.8598, "Source": "W/S", "VendNumber": "195339", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105509", "ItemDescription": "PROCHLORPER SUPP 25MG", "UOM": "12 SUPP/BX", "Price": 78.36, "Source": "INV", "VendNumber": "337170", "OrderQty": 12, "Location": "1B2H"},
		{"MedId": "", "ItemNumber": "105510", "ItemDescription": "ASPIRIN SUPP 600MG U/D", "UOM": "12 SUPP/BX", "Price": 13.3296, "Source": "INV", "VendNumber": "461467", "OrderQty": 12, "Location": "10A1F"},
		{"MedId": "", "ItemNumber": "105513", "ItemDescription": "VEHICLE COMPOUNDING 16OZ", "UOM": "None", "Price": 10.23, "Source": "INV", "VendNumber": "540942", "OrderQty": 1, "Location": "6C4E"},
		{"MedId": "", "ItemNumber": "105514", "ItemDescription": "HYDROCORT ENEMA 100MG", "UOM": "7 BOTTLES/CT", "Price": 37.8903, "Source": "INV", "VendNumber": "718775", "OrderQty": 7, "Location": "1B2E"},
		{"MedId": "", "ItemNumber": "105516", "ItemDescription": "GEL GLUCOSE ORAL GLUTOSE 15", "UOM": "None", "Price": 8.3901, "Source": "INV", "VendNumber": "173179", "OrderQty": 1, "Location": "6B1B"},
		{"MedId": "", "ItemNumber": "105522", "ItemDescription": "MECLIZINE TAB 12.5MG", "UOM": "100 TABS/BO", "Price": 2.75, "Source": "INV", "VendNumber": "324660", "OrderQty": 100, "Location": "2E1A"},
		{"MedId": "", "ItemNumber": "105523", "ItemDescription": "DOXEPIN CAP 25MG", "UOM": "100 CAPS/BO", "Price": 57.24, "Source": "W/S", "VendNumber": "115618", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105524", "ItemDescription": "AMILORIDE TAB 5MG", "UOM": "100 TABS/BO", "Price": 40.73, "Source": "W/S", "VendNumber": "375626", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105525", "ItemDescription": "PAROXETINE TAB 20MG", "UOM": "100 TABS/BO", "Price": 15.2, "Source": "INV", "VendNumber": "895932", "OrderQty": 100, "Location": "2F4D"},
		{"MedId": "", "ItemNumber": "105526", "ItemDescription": "ACYCLOVIR TAB 800MG", "UOM": "100 TABS/BO", "Price": 12, "Source": "W/S", "VendNumber": "4935771", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105527", "ItemDescription": "SOTALOL TAB 80MG", "UOM": "100 TABS/BO", "Price": 5.39, "Source": "INV", "VendNumber": "871121", "OrderQty": 100, "Location": "3A6D"},
		{"MedId": "", "ItemNumber": "105528", "ItemDescription": "SOTALOL TAB 120MG", "UOM": "100 TABS/BO", "Price": 11.97, "Source": "INV", "VendNumber": "639676", "OrderQty": 100, "Location": "3A6E"},
		{"MedId": "", "ItemNumber": "105529", "ItemDescription": "PAROXETINE TAB 10MG", "UOM": "100 TABS/BO", "Price": 39.61, "Source": "W/S", "VendNumber": "913900", "OrderQty": 1, "Location": "2F4D"},
		{"MedId": "", "ItemNumber": "105530", "ItemDescription": "MEGESTROL TAB 40MG", "UOM": "100 TABS/BO", "Price": 19.18, "Source": "W/S", "VendNumber": "114999", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105531", "ItemDescription": "DOXEPIN CAP 50MG", "UOM": "100 CAPS/BO", "Price": 73, "Source": "W/S", "VendNumber": "1570027", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105532", "ItemDescription": "MINOXIDIL TAB 2.5MG", "UOM": "100 TABS/BO", "Price": 11.86, "Source": "INV", "VendNumber": "3275690", "OrderQty": 100, "Location": "2E5F"},
		{"MedId": "", "ItemNumber": "105533", "ItemDescription": "IMIPRAMINE TAB 10MG", "UOM": "100 TABS/BO", "Price": 8.28, "Source": "W/S", "VendNumber": "532693", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105534", "ItemDescription": "FLUPHENAZINE TAB 1MG U/D", "UOM": "100 TABS/BX", "Price": 34.02, "Source": "W/S", "VendNumber": "1226802", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105535", "ItemDescription": "HYDROXYUREA CAP 500MG", "UOM": "100 CAPS/BO", "Price": 62.1, "Source": "W/S", "VendNumber": "873356", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105548", "ItemDescription": "GRISEOFULVIN TAB 250MG", "UOM": "100 TABS/BO", "Price": 392, "Source": "W/S", "VendNumber": "4781845", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105553", "ItemDescription": "GABAPENTIN CAP 400MG", "UOM": "100 CAPS/BO", "Price": 12.64, "Source": "INV", "VendNumber": "620056", "OrderQty": 100, "Location": "2C6A"},
		{"MedId": "", "ItemNumber": "105554", "ItemDescription": "HEMORRHOIDAL  OINT 2OZ.", "UOM": "None", "Price": 1.84, "Source": "INV", "VendNumber": "328423", "OrderQty": 1, "Location": "1B2B"},
		{"MedId": "", "ItemNumber": "105557", "ItemDescription": "PEN G POT VL 20MU", "UOM": "None", "Price": 30.26, "Source": "INV", "VendNumber": "065698", "OrderQty": 1, "Location": "5C4B"},
		{"MedId": "", "ItemNumber": "105560", "ItemDescription": "PHENYTOIN CAP 30MG", "UOM": "100 CAPS/BO", "Price": 57, "Source": "W/S", "VendNumber": "4243473", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105561", "ItemDescription": "METHYLPRED (DEPO) 40MG/ML", "UOM": "25 VIALS/CT", "Price": 140, "Source": "INV", "VendNumber": "295741", "OrderQty": 25, "Location": "4F6B"},
		{"MedId": "", "ItemNumber": "105562", "ItemDescription": "METHYLPRED (DEPO) 80MG/ML", "UOM": "25 VIALS/CT", "Price": 286.53, "Source": "W/S", "VendNumber": "295766", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105563", "ItemDescription": "ESTRAMUSTINE CAP 140MG", "UOM": "100 CAPS/BX", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105564", "ItemDescription": "LUBRIDERM LOT 480ML", "UOM": "None", "Price": 2.85, "Source": "INV", "VendNumber": "636647", "OrderQty": 1, "Location": "1E6B"},
		{"MedId": "", "ItemNumber": "105565", "ItemDescription": "CARBOPROST VL 250MCG", "UOM": "10 VIALS/BO", "Price": 3238.36, "Source": "INV", "VendNumber": "483784", "OrderQty": 10, "Location": "10A2D"},
		{"MedId": "", "ItemNumber": "105567", "ItemDescription": "HYDROCORT VL 100MG PF", "UOM": "None", "Price": 8.14, "Source": "INV", "VendNumber": "291161", "OrderQty": 1, "Location": "4D3B"},
		{"MedId": "", "ItemNumber": "105574", "ItemDescription": "ATORVASTATIN TAB 10MG", "UOM": "90 TABS/BO", "Price": 5.211, "Source": "INV", "VendNumber": "180059", "OrderQty": 90, "Location": "2A3M"},
		{"MedId": "", "ItemNumber": "105576", "ItemDescription": "GABAPENTIN CAP 100MG", "UOM": "100 CAPS/BO", "Price": 6.64, "Source": "INV", "VendNumber": "619960", "OrderQty": 100, "Location": "2C5A"},
		{"MedId": "", "ItemNumber": "105578", "ItemDescription": "LATANOPROST OPH SOL 2.5ML", "UOM": "None", "Price": 4.92, "Source": "INV", "VendNumber": "089639", "OrderQty": 1, "Location": "10C1A"},
		{"MedId": "", "ItemNumber": "105579", "ItemDescription": "QUINAPRIL TAB 10MG", "UOM": "90 TABS/BO", "Price": 9.693, "Source": "INV", "VendNumber": "280634", "OrderQty": 90, "Location": "3A3F"},
		{"MedId": "", "ItemNumber": "105580", "ItemDescription": "QUINAPRIL TAB 20MG", "UOM": "90 TABS/BO", "Price": 10.836, "Source": "INV", "VendNumber": "280636", "OrderQty": 90, "Location": "3A3G"},
		{"MedId": "", "ItemNumber": "105582", "ItemDescription": "DEPO PROVERA VL 150MG/1ML", "UOM": "None", "Price": 73.38, "Source": "W/S", "VendNumber": "3611993", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105584", "ItemDescription": "AMLODIPINE TAB 2.5MG", "UOM": "90 TABS/BO", "Price": 1.26, "Source": "INV", "VendNumber": "657630", "OrderQty": 90, "Location": "2A2E"},
		{"MedId": "", "ItemNumber": "105586", "ItemDescription": "AZITHRO VL 500MG", "UOM": "10 VIALS/CT", "Price": 20.68, "Source": "INV", "VendNumber": "420596", "OrderQty": 10, "Location": "3D2A"},
		{"MedId": "", "ItemNumber": "105587", "ItemDescription": "VORICONAZOLE TAB 50MG", "UOM": "30 TABS/BO", "Price": 161.2299, "Source": "W/S", "VendNumber": "260042", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105591", "ItemDescription": "VORICONAZOLE TAB 200MG", "UOM": "30 TABS/BO", "Price": 552.6, "Source": "W/S", "VendNumber": "173854", "OrderQty": 1, "Location": "3B4I"},
		{"MedId": "", "ItemNumber": "105592", "ItemDescription": "LINEZOLID IV 600MG/300ML", "UOM": "10 EACHS/CA", "Price": 354.59, "Source": "INV", "VendNumber": "521967", "OrderQty": 10, "Location": "4E6A"},
		{"MedId": "", "ItemNumber": "105594", "ItemDescription": "NICOTINE INHALER 10MG", "UOM": "None", "Price": 355.7, "Source": "W/S", "VendNumber": "4063194", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105595", "ItemDescription": "DOFETILIDE TAB 500MCG W/SAMPLE", "UOM": "40 TABS/BX", "Price": 376.06, "Source": "W/S", "VendNumber": "311391", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105596", "ItemDescription": "DOFETILIDE TAB 250MCG W/SAMPLE", "UOM": "40 TABS/BX", "Price": 376.06, "Source": "W/S", "VendNumber": "311403", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105597", "ItemDescription": "DOFETILIDE TAB 125MCG W/SAMPLE", "UOM": "40 TABS/BX", "Price": 343.62, "Source": "W/S", "VendNumber": "3406576", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105598", "ItemDescription": "SERTRALINE TAB 25MG", "UOM": "100 TABS/BO", "Price": 12.44, "Source": "INV", "VendNumber": "607838", "OrderQty": 100, "Location": "3A5B"},
		{"MedId": "", "ItemNumber": "105599", "ItemDescription": "IRINOTECAN VL 40MG", "UOM": "None", "Price": 6.24, "Source": "INV", "VendNumber": "128482", "OrderQty": 1, "Location": "9D5B"},
		{"MedId": "", "ItemNumber": "105600", "ItemDescription": "QUINAPRIL TAB 5MG", "UOM": "90 TABS/BO", "Price": 14.99, "Source": "INV", "VendNumber": "4578399", "OrderQty": 90, "Location": "3A3E"},
		{"MedId": "", "ItemNumber": "105602", "ItemDescription": "EXEMESTANE TAB 25MG", "UOM": "30 TABS/BO", "Price": 101.7, "Source": "W/S", "VendNumber": "091475", "OrderQty": 1, "Location": "9D4B"},
		{"MedId": "", "ItemNumber": "105604", "ItemDescription": "GABAPENTIN TAB 600MG", "UOM": "500 TABS/BO", "Price": 63.75, "Source": "INV", "VendNumber": "236909", "OrderQty": 500, "Location": "2C6B"},
		{"MedId": "", "ItemNumber": "105607", "ItemDescription": "VORICONAZOLE VL 200MG/20M", "UOM": "None", "Price": 29.01, "Source": "W/S", "VendNumber": "176812", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105608", "ItemDescription": "ATORVASTATIN TAB 80MG", "UOM": "90 TABS/BO", "Price": 10.611, "Source": "INV", "VendNumber": "180070", "OrderQty": 90, "Location": "2A4B"},
		{"MedId": "", "ItemNumber": "105609", "ItemDescription": "ZIPRASIDONE CAP 20MG", "UOM": "60 CAPS/BO", "Price": 19.2, "Source": "W/S", "VendNumber": "5028071", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105610", "ItemDescription": "ZIPRASIDONE CAP 40MG", "UOM": "60 CAPS/BO", "Price": 27.97, "Source": "W/S", "VendNumber": "5028097", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105611", "ItemDescription": "AZITHROMYCIN SUSP 40MG/ML", "UOM": "None", "Price": 11.48, "Source": "INV", "VendNumber": "896643", "OrderQty": 1, "Location": "6A3A"},
		{"MedId": "", "ItemNumber": "105612", "ItemDescription": "CLINDAMYCIN VAG CR 40GM", "UOM": "None", "Price": 66.21, "Source": "W/S", "VendNumber": "4164059", "OrderQty": 1, "Location": "1B2I"},
		{"MedId": "", "ItemNumber": "105613", "ItemDescription": "FOSPHENYTOIN VL 10ML", "UOM": "10 VIALS/BX", "Price": 200.32, "Source": "INV", "VendNumber": "564013", "OrderQty": 10, "Location": "10A5B"},
		{"MedId": "", "ItemNumber": "105614", "ItemDescription": "IBUTALIDE VL 1MG 10ML", "UOM": "None", "Price": 63.02, "Source": "W/S", "VendNumber": "2459402", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105615", "ItemDescription": "CELECOXIB CAP 100MG", "UOM": "100 CAPS/BX", "Price": 99, "Source": "W/S", "VendNumber": "5045893", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105616", "ItemDescription": "CELECOXIB CAP 200MG", "UOM": "100 CAPS/BX", "Price": 44.62, "Source": "W/S", "VendNumber": "468951", "OrderQty": 1, "Location": "2B2D"},
		{"MedId": "", "ItemNumber": "105617", "ItemDescription": "IRINOTECAN VL 100MG", "UOM": "None", "Price": 12.76, "Source": "INV", "VendNumber": "128488", "OrderQty": 1, "Location": "9D5C"},
		{"MedId": "", "ItemNumber": "105620", "ItemDescription": "METHYLPRED TAB 16MG", "UOM": "50 TABS/BO", "Price": 89.69, "Source": "W/S", "VendNumber": "610035", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105622", "ItemDescription": "HYDROCORT TAB 10MG", "UOM": "100 TABS/BO", "Price": 23.02, "Source": "W/S", "VendNumber": "284125", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105633", "ItemDescription": "DOCUSATE SF 100MG 10ML", "UOM": "100 CUPS/CA", "Price": 46.4, "Source": "INV", "VendNumber": "591735", "OrderQty": 100, "Location": "6A6B"},
		{"MedId": "", "ItemNumber": "105635", "ItemDescription": "GUAIFENESIN LIQ 15ML U/D 100 C", "UOM": "UPS/CA", "Price": 55.35, "Source": "INV", "VendNumber": "689489", "OrderQty": 1, "Location": "6B1D"},
		{"MedId": "", "ItemNumber": "105640", "ItemDescription": "POT CHL LIQ 40MEQ/30ML UD", "UOM": "50 CUPS/BX", "Price": 826.91, "Source": "INV", "VendNumber": "578183", "OrderQty": 50, "Location": "6C2D"},
		{"MedId": "", "ItemNumber": "105641", "ItemDescription": "GUAIFENESIN LIQ 10ML U/D", "UOM": "10 CUPS/SLEEVE", "Price": 60.94, "Source": "INV", "VendNumber": "630107", "OrderQty": 10, "Location": "6B1C"},
		{"MedId": "", "ItemNumber": "105644", "ItemDescription": "SORBITAL 70% SOL 30ML U/D", "UOM": "10 CUPS/BX", "Price": 10.61, "Source": "W/S", "VendNumber": "208454", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105646", "ItemDescription": "GUAIFENESIN/COD LIQ 5ML", "UOM": "100 CUPS/CA", "Price": 56, "Source": "W/S", "VendNumber": "3868569", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105647", "ItemDescription": "CIMETIDINE LIQ. 8OZ.", "UOM": "None", "Price": 12.15, "Source": "W/S", "VendNumber": "2911303", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105650", "ItemDescription": "METOCLOPRAM LIQ 10MG U/D", "UOM": "10 CUPS/SLEEVE", "Price": 41.86, "Source": "INV", "VendNumber": "3644820", "OrderQty": 10, "Location": "6B6A"},
		{"MedId": "", "ItemNumber": "105671", "ItemDescription": "PROPRAN TAB 10MG", "UOM": "100 TABS/BO", "Price": 15.34, "Source": "W/S", "VendNumber": "5252473", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105672", "ItemDescription": "TRIAM/HCTZ TAB 37.5/25", "UOM": "100 TABS/BO", "Price": 25.32, "Source": "INV", "VendNumber": "279976", "OrderQty": 100, "Location": "3B2K"},
		{"MedId": "", "ItemNumber": "105674", "ItemDescription": "TRAZODONE TAB 100MG", "UOM": "100 TABS/BO", "Price": 8.48, "Source": "INV", "VendNumber": "115290", "OrderQty": 100, "Location": "3B2J"},
		{"MedId": "", "ItemNumber": "105675", "ItemDescription": "HYDROXYZINE TAB 10MG", "UOM": "100 TABS/BO", "Price": 5.4, "Source": "W/S", "VendNumber": "380154", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105676", "ItemDescription": "BENZONATATE CAP 100MG", "UOM": "500 CAPS/BO", "Price": 62.8, "Source": "INV", "VendNumber": "4326740", "OrderQty": 500, "Location": "2A4H"},
		{"MedId": "", "ItemNumber": "105677", "ItemDescription": "FLUOXETINE CAP 20MG", "UOM": "100 CAPS/BO", "Price": 2.25, "Source": "INV", "VendNumber": "348856", "OrderQty": 100, "Location": "2C4F"},
		{"MedId": "", "ItemNumber": "105678", "ItemDescription": "HYDRALAZINE TAB 10MG", "UOM": "100 TABS/BO", "Price": 3.18, "Source": "INV", "VendNumber": "095737", "OrderQty": 100, "Location": "2D1C"},
		{"MedId": "", "ItemNumber": "105679", "ItemDescription": "TRIAM/HCTZ TAB 75/50", "UOM": "100 TABS/BO", "Price": 15, "Source": "W/S", "VendNumber": "1472984", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105681", "ItemDescription": "METRONIDAZ TAB 250MG", "UOM": "250 TABS/BO", "Price": 52.5, "Source": "W/S", "VendNumber": "2127777", "OrderQty": 1, "Location": "2E5A"},
		{"MedId": "", "ItemNumber": "105682", "ItemDescription": "BENZTROPINE TAB 1MG", "UOM": "100 TABS/BO", "Price": 26.94, "Source": "W/S", "VendNumber": "073465", "OrderQty": 1, "Location": "2A5A"},
		{"MedId": "", "ItemNumber": "105683", "ItemDescription": "PROPRAN TAB 20MG", "UOM": "100 TABS/BO", "Price": 22.43, "Source": "INV", "VendNumber": "107161", "OrderQty": 100, "Location": "3A2F"},
		{"MedId": "", "ItemNumber": "105684", "ItemDescription": "METRONIDAZ TAB 500MG", "UOM": "500 TABS/BO", "Price": 180.05, "Source": "INV", "VendNumber": "387977", "OrderQty": 500, "Location": "2E5B"},
		{"MedId": "", "ItemNumber": "105685", "ItemDescription": "OXYBUTYNIN TAB 5MG", "UOM": "100 TABS/BO", "Price": 37.77, "Source": "INV", "VendNumber": "014845", "OrderQty": 100, "Location": "2F3F"},
		{"MedId": "", "ItemNumber": "105686", "ItemDescription": "HYDRALAZINE TAB 50MG", "UOM": "100 TABS/BO", "Price": 4.58, "Source": "INV", "VendNumber": "095778", "OrderQty": 100, "Location": "2D1E"},
		{"MedId": "", "ItemNumber": "105687", "ItemDescription": "HYDRALAZINE TAB 25MG U/D", "UOM": "100 TABS/BO", "Price": 3.83, "Source": "INV", "VendNumber": "095752", "OrderQty": 100, "Location": "2D1D"},
		{"MedId": "", "ItemNumber": "105689", "ItemDescription": "KETOCONAZOLE TAB 200MG", "UOM": "100 TABS/BO", "Price": 15, "Source": "W/S", "VendNumber": "2942795", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105690", "ItemDescription": "FLUOXETINE CAP 10MG", "UOM": "100 CAPS/BO", "Price": 2.46, "Source": "INV", "VendNumber": "469712", "OrderQty": 100, "Location": "2C4E"},
		{"MedId": "", "ItemNumber": "105713", "ItemDescription": "MESALAMINE EC CAP 400MG", "UOM": "180 CAPS/BO", "Price": 536.13, "Source": "INV", "VendNumber": "552005", "OrderQty": 180, "Location": "2E1E"},
		{"MedId": "", "ItemNumber": "105715", "ItemDescription": "DANTROLENE CAP 25MG U/D", "UOM": "30 CAPS/BX", "Price": 24.43, "Source": "W/S", "VendNumber": "908863", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105723", "ItemDescription": "LABETALOL TAB 100MG", "UOM": "100 TABS/BO", "Price": 20.17, "Source": "INV", "VendNumber": "280045", "OrderQty": 100, "Location": "2D3G"},
		{"MedId": "", "ItemNumber": "105724", "ItemDescription": "LABETALOL TAB 200MG", "UOM": "100 TABS/BO", "Price": 27.07, "Source": "INV", "VendNumber": "280057", "OrderQty": 100, "Location": "2D3H"},
		{"MedId": "", "ItemNumber": "105733", "ItemDescription": "OXYCONTIN C/R 80MG TAB", "UOM": "100 TABS/BO", "Price": 819.67, "Source": "W/S", "VendNumber": "365736", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105734", "ItemDescription": "OXYCODONE TAB 40MG CR", "UOM": "100 TABS/BO", "Price": 441.31, "Source": "W/S", "VendNumber": "365734", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105735", "ItemDescription": "OXYCOCONE TAB 20MG CR", "UOM": "100 TABS/BO", "Price": 394.83, "Source": "W/S", "VendNumber": "385620", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105736", "ItemDescription": "OXYCODONE TAB 10MG CR", "UOM": "100 TABS/BO", "Price": 209.05, "Source": "W/S", "VendNumber": "385613", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105737", "ItemDescription": "NIFEDIPINE CAP 10MG", "UOM": "100 CAPS/BO", "Price": 42.78, "Source": "INV", "VendNumber": "625491", "OrderQty": 100, "Location": "2F1C"},
		{"MedId": "", "ItemNumber": "105738", "ItemDescription": "CLONIDINE TAB 0.1MG", "UOM": "100 TABS/BX", "Price": 4.94, "Source": "INV", "VendNumber": "119230", "OrderQty": 100, "Location": "2B4B"},
		{"MedId": "", "ItemNumber": "105739", "ItemDescription": "CLONIDINE TAB 0.2MG", "UOM": "100 TABS/BO", "Price": 6.56, "Source": "INV", "VendNumber": "119255", "OrderQty": 100, "Location": "2B5A"},
		{"MedId": "", "ItemNumber": "105740", "ItemDescription": "METHYLPRED DOSPAK #21", "UOM": "None", "Price": 9.2, "Source": "INV", "VendNumber": "242331", "OrderQty": 1, "Location": "2E2D"},
		{"MedId": "", "ItemNumber": "105741", "ItemDescription": "COLCHICINE TAB 0.6MG", "UOM": "100 TABS/BO", "Price": 507.68, "Source": "W/S", "VendNumber": "369561", "OrderQty": 1, "Location": "2B5D"},
		{"MedId": "", "ItemNumber": "105742", "ItemDescription": "SORE THROAT SPRAY 6OZ", "UOM": "None", "Price": 1.39, "Source": "INV", "VendNumber": "292197", "OrderQty": 1, "Location": "6C4A"},
		{"MedId": "", "ItemNumber": "105743", "ItemDescription": "HCTZ TAB 25MG", "UOM": "100 TABS/BO", "Price": 1.52, "Source": "INV", "VendNumber": "327484", "OrderQty": 100, "Location": "2D1G"},
		{"MedId": "", "ItemNumber": "105745", "ItemDescription": "SIMETHICONE TAB 80MG", "UOM": "100 TABS/BO", "Price": 1.5, "Source": "W/S", "VendNumber": "703447", "OrderQty": 1, "Location": "3A5G"},
		{"MedId": "", "ItemNumber": "105746", "ItemDescription": "HCTZ TAB 50MG", "UOM": "100 TABS/BO", "Price": 1.96, "Source": "W/S", "VendNumber": "339341", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105748", "ItemDescription": "AMITRIPTY TAB 10MG", "UOM": "100 TABS/BO", "Price": 9.16, "Source": "W/S", "VendNumber": "119552", "OrderQty": 1, "Location": "2A2A"},
		{"MedId": "", "ItemNumber": "105749", "ItemDescription": "AMITRIPTY TAB 50MG", "UOM": "100 TABS/BO", "Price": 36.64, "Source": "INV", "VendNumber": "116830", "OrderQty": 100, "Location": "2A2C"},
		{"MedId": "", "ItemNumber": "105750", "ItemDescription": "AMITRIPTY TAB 25MG", "UOM": "100 TABS/BO", "Price": 19.48, "Source": "W/S", "VendNumber": "116822", "OrderQty": 1, "Location": "2A2B"},
		{"MedId": "", "ItemNumber": "105752", "ItemDescription": "CAPSAICIN CR .025% 60GM", "UOM": "None", "Price": 3.07, "Source": "INV", "VendNumber": "666750", "OrderQty": 1, "Location": "1D5C"},
		{"MedId": "", "ItemNumber": "105755", "ItemDescription": "PERPHENAZINE TAB 2MG", "UOM": "100 TABS/BO", "Price": 78.91, "Source": "INV", "VendNumber": "329540", "OrderQty": 100, "Location": "2F5C"},
		{"MedId": "", "ItemNumber": "105757", "ItemDescription": "PREDNISONE TAB 5MG", "UOM": "100 TABS/BO", "Price": 12.9, "Source": "INV", "VendNumber": "257741", "OrderQty": 100, "Location": "3A1G"},
		{"MedId": "", "ItemNumber": "105759", "ItemDescription": "METHYLPRED TAB 4MG", "UOM": "100 TABS/BO", "Price": 64.47, "Source": "INV", "VendNumber": "556530", "OrderQty": 100, "Location": "2E2E"},
		{"MedId": "", "ItemNumber": "105761", "ItemDescription": "HYDROMORP TAB 4MG", "UOM": "100 TABS/BO", "Price": 7.69, "Source": "W/S", "VendNumber": "566568", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105763", "ItemDescription": "NIACIN 250MG(SLO-NIACIN)", "UOM": "100 CAPS/BO", "Price": 3, "Source": "W/S", "VendNumber": "2091742", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105774", "ItemDescription": "BETHANECHOL TAB 25MG", "UOM": "100 TABS/BO", "Price": 63.88, "Source": "W/S", "VendNumber": "4118857", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105775", "ItemDescription": "CLINDAMYCIN CAP 150MG", "UOM": "100 CAPS/BO", "Price": 11.22, "Source": "INV", "VendNumber": "787499", "OrderQty": 100, "Location": "2B4A"},
		{"MedId": "", "ItemNumber": "105776", "ItemDescription": "CEFUROXIME TAB 250MG", "UOM": "20 TABS/BO", "Price": 12.6, "Source": "INV", "VendNumber": "430215", "OrderQty": 20, "Location": "2B2B"},
		{"MedId": "", "ItemNumber": "105777", "ItemDescription": "AMOX/CLAV TAB 500MG", "UOM": "20 TABS/BO", "Price": 7.48, "Source": "INV", "VendNumber": "217588", "OrderQty": 20, "Location": "2A2J"},
		{"MedId": "", "ItemNumber": "105778", "ItemDescription": "CEFUROXIME TAB 500MG", "UOM": "20 TABS/BO", "Price": 16.28, "Source": "INV", "VendNumber": "430231", "OrderQty": 20, "Location": "2B2C"},
		{"MedId": "", "ItemNumber": "105782", "ItemDescription": "AMOX/CLAV LIQ 400MG/5ML", "UOM": "None", "Price": 5.97, "Source": "INV", "VendNumber": "699640", "OrderQty": 1, "Location": "6A2E"},
		{"MedId": "", "ItemNumber": "105783", "ItemDescription": "AMOX/CLAV LIQ 200MG/5ML", "UOM": "None", "Price": 4.58, "Source": "INV", "VendNumber": "693921", "OrderQty": 1, "Location": "6A2D"},
		{"MedId": "", "ItemNumber": "105784", "ItemDescription": "AMOX CAP 500MG", "UOM": "50 CAPS/BO", "Price": 5.95, "Source": "W/S", "VendNumber": "501494", "OrderQty": 1, "Location": "2A2I"},
		{"MedId": "", "ItemNumber": "105786", "ItemDescription": "BAG PLSTC 6 X 9IN", "UOM": "None", "Price": 12.96, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105839", "ItemDescription": "SECRETIN VL 16MCG", "UOM": "None", "Price": 525, "Source": "W/S", "VendNumber": "4059184", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105871", "ItemDescription": "MAG OXIDE TAB 400MG", "UOM": "120 TABS/BO", "Price": 2.724, "Source": "W/S", "VendNumber": "606850", "OrderQty": 1, "Location": "2D6K"},
		{"MedId": "", "ItemNumber": "105875", "ItemDescription": "CLOTRIMAZOLE TROC 10MG", "UOM": "140 TROCS/BO", "Price": 51.079, "Source": "INV", "VendNumber": "014170", "OrderQty": 140, "Location": "2B5C"},
		{"MedId": "", "ItemNumber": "105876", "ItemDescription": "DIGOXIN EL 60ML", "UOM": "None", "Price": 34.45, "Source": "W/S", "VendNumber": "3634367", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105877", "ItemDescription": "CODEINE TAB 30MG U/D", "UOM": "100 TABS/BX", "Price": 40.57, "Source": "W/S", "VendNumber": "042572", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105878", "ItemDescription": "LIDOCAINE TOP SOL 4% 50ML", "UOM": "None", "Price": 28.99, "Source": "INV", "VendNumber": "317875", "OrderQty": 1, "Location": "1E4B"},
		{"MedId": "", "ItemNumber": "105880", "ItemDescription": "DEXAMETH TAB 1.5MG U/D", "UOM": "100 TABS/BX", "Price": 11, "Source": "W/S", "VendNumber": "1118678", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105881", "ItemDescription": "LIDOCAINE VISC 2% 100ML", "UOM": "None", "Price": 9.32, "Source": "INV", "VendNumber": "941088", "OrderQty": 1, "Location": "6B5A"},
		{"MedId": "", "ItemNumber": "105882", "ItemDescription": "PREDNISONE TAB 50MG", "UOM": "100 TABS/BO", "Price": 22.48, "Source": "INV", "VendNumber": "258202", "OrderQty": 100, "Location": "3A1J"},
		{"MedId": "", "ItemNumber": "105883", "ItemDescription": "PREDNISONE TAB 2.5MG", "UOM": "100 TABS/BO", "Price": 10.38, "Source": "INV", "VendNumber": "256909", "OrderQty": 100, "Location": "3A1F"},
		{"MedId": "", "ItemNumber": "105887", "ItemDescription": "PREDNISONE TAB 10MG", "UOM": "100 TABS/BO", "Price": 12.72, "Source": "INV", "VendNumber": "257881", "OrderQty": 100, "Location": "3A1H"},
		{"MedId": "", "ItemNumber": "105888", "ItemDescription": "DEXAMETH TAB .5MG U/D", "UOM": "100 TABS/BX", "Price": 6.39, "Source": "W/S", "VendNumber": "1118629", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105889", "ItemDescription": "SALIVA SUBST 1% 60ML", "UOM": "None", "Price": 5.25, "Source": "INV", "VendNumber": "245829", "OrderQty": 1, "Location": "6C3D"},
		{"MedId": "", "ItemNumber": "105892", "ItemDescription": "DICLOFENAC TAB 75MG", "UOM": "100 TABS/BO", "Price": 16.44, "Source": "W/S", "VendNumber": "261651", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105893", "ItemDescription": "LEUCOVORIN TAB 5MG", "UOM": "30 TABS/BO", "Price": 28.03, "Source": "INV", "VendNumber": "1999234", "OrderQty": 30, "Location": "2D4D"},
		{"MedId": "", "ItemNumber": "105897", "ItemDescription": "PROPRAN SOL 20MG/5 500ML", "UOM": "None", "Price": 45.18, "Source": "W/S", "VendNumber": "1442383", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105898", "ItemDescription": "MEGESTROL LIQ 8OZ", "UOM": "None", "Price": 14.71, "Source": "INV", "VendNumber": "101384", "OrderQty": 1, "Location": "9D5E"},
		{"MedId": "", "ItemNumber": "105899", "ItemDescription": "PREDNISONE TAB 20MG", "UOM": "100 TABS/BO", "Price": 14.56, "Source": "INV", "VendNumber": "467233", "OrderQty": 100, "Location": "3A1I"},
		{"MedId": "", "ItemNumber": "105900", "ItemDescription": "DICLOFENAC TAB 50MG", "UOM": "100 TABS/BO", "Price": 26, "Source": "W/S", "VendNumber": "4307583", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105903", "ItemDescription": "MERCAPTOPURINE TAB 50MG", "UOM": "25 TABS/BO", "Price": 25.58, "Source": "INV", "VendNumber": "965140", "OrderQty": 25, "Location": "9D5F"},
		{"MedId": "", "ItemNumber": "105906", "ItemDescription": "DEXAMETH TAB 4MG", "UOM": "100 TABS/BO", "Price": 11.72, "Source": "INV", "VendNumber": "258731", "OrderQty": 100, "Location": "2B6C"},
		{"MedId": "", "ItemNumber": "105907", "ItemDescription": "FUROSEM TAB 20MG U/D", "UOM": "100 TABS/BO", "Price": 4.73, "Source": "INV", "VendNumber": "117465", "OrderQty": 100, "Location": "2C4I"},
		{"MedId": "", "ItemNumber": "105908", "ItemDescription": "PREDNISONE TAB 1MG", "UOM": "100 TABS/BO", "Price": 10.13, "Source": "INV", "VendNumber": "331033", "OrderQty": 100, "Location": "3A1E"},
		{"MedId": "", "ItemNumber": "105909", "ItemDescription": "MIRTAZAPINE TAB 45MG", "UOM": "100 TABS/BO", "Price": 19.87, "Source": "INV", "VendNumber": "051678", "OrderQty": 100, "Location": "2E5J"},
		{"MedId": "", "ItemNumber": "105911", "ItemDescription": "MEXILETINE CAP 200MG", "UOM": "100 CAPS/BO", "Price": 68.9, "Source": "W/S", "VendNumber": "127908", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105912", "ItemDescription": "MEXILETINE CAP 150MG", "UOM": "100 CAPS/BO", "Price": 47.34, "Source": "W/S", "VendNumber": "954578", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105936", "ItemDescription": "PYRIDOSTIG AMP 5MG/ML", "UOM": "10 AMPS/CT", "Price": 257, "Source": "W/S", "VendNumber": "3668894", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105959", "ItemDescription": "ZOLPIDEM TAB 5MG", "UOM": "100 TABS/BO", "Price": 5.78, "Source": "W/S", "VendNumber": "098947", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105960", "ItemDescription": "OXALIPLATIN VL 50MG", "UOM": "None", "Price": 8, "Source": "INV", "VendNumber": "0233-10", "OrderQty": 1, "Location": "9E2A"},
		{"MedId": "", "ItemNumber": "105963", "ItemDescription": "DIGOXIN IMMUNE FAB 40MG", "UOM": "None", "Price": 3113.91, "Source": "INV", "VendNumber": "031146", "OrderQty": 1, "Location": "10A3C"},
		{"MedId": "", "ItemNumber": "105966", "ItemDescription": "PHENYLEPH NAS SP .25%15ML", "UOM": "None", "Price": 3.86, "Source": "INV", "VendNumber": "1094424", "OrderQty": 1, "Location": "1D2B"},
		{"MedId": "", "ItemNumber": "105967", "ItemDescription": "BETAMETH VL 6MG/ML 5ML", "UOM": "None", "Price": 32.24, "Source": "INV", "VendNumber": "080061", "OrderQty": 1, "Location": "3D3B"},
		{"MedId": "", "ItemNumber": "105969", "ItemDescription": "EPTIFIBATIDE VL 10ML", "UOM": "None", "Price": 70, "Source": "INV", "VendNumber": "497776", "OrderQty": 1, "Location": "11D4A"},
		{"MedId": "", "ItemNumber": "105970", "ItemDescription": "EPTIFIBATIDE VL 100ML", "UOM": "None", "Price": 225.65, "Source": "INV", "VendNumber": "497719", "OrderQty": 1, "Location": "11D4B"},
		{"MedId": "", "ItemNumber": "105971", "ItemDescription": "TEMOZOLOMIDE CAP 20MG", "UOM": "5 CAPS/BO", "Price": 215.6, "Source": "W/S", "VendNumber": "4907457", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105972", "ItemDescription": "TEMOZOLOMIDE CAP 100MG", "UOM": "5 CAPS/BO", "Price": 1100.85, "Source": "W/S", "VendNumber": "4907531", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105974", "ItemDescription": "FLUTAMIDE CAP 125MG U/D", "UOM": "180 CAPS/BO", "Price": 88.2, "Source": "W/S", "VendNumber": "4548236", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105975", "ItemDescription": "PRAMOXINE/HC RECTAL FOAM", "UOM": "None", "Price": 120.61, "Source": "INV", "VendNumber": "353882", "OrderQty": 1, "Location": "1B2G"},
		{"MedId": "", "ItemNumber": "105977", "ItemDescription": "LEVALBUTEROL NEB 0.63MG", "UOM": "24 NEBS/CT", "Price": 34.32, "Source": "W/S", "VendNumber": "4825980", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105981", "ItemDescription": "MITOXANTRONE VL 20MG", "UOM": "None", "Price": 96.63, "Source": "W/S", "VendNumber": "3724069", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105985", "ItemDescription": "MESALAMINE CAP CR 250MG", "UOM": "240 CAPS/BO", "Price": 567.25, "Source": "W/S", "VendNumber": "1335132", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105986", "ItemDescription": "ANAGRELIDE CAP 0.5MG", "UOM": "100 CAPS/BO", "Price": 45, "Source": "W/S", "VendNumber": "3661360", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105987", "ItemDescription": "DRUG PANCURONIUM VL 10ML", "UOM": "25 VIALS/BX", "Price": 105.25, "Source": "W/S", "VendNumber": "1736933", "OrderQty": 1, "Location": "10C3E"},
		{"MedId": "", "ItemNumber": "105988", "ItemDescription": "HALOPERIDOL VL 5MG 1ML", "UOM": "25 VIALS/CT", "Price": 14.05, "Source": "INV", "VendNumber": "406769", "OrderQty": 25, "Location": "4C6C"},
		{"MedId": "", "ItemNumber": "105989", "ItemDescription": "STREPTOZOCIN VL 1GM", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "105990", "ItemDescription": "DESMOPRESS VL 4MCG 1ML", "UOM": "10 VIALS/CT", "Price": 427.81, "Source": "INV", "VendNumber": "398622", "OrderQty": 10, "Location": "11D2A"},
		{"MedId": "", "ItemNumber": "105991", "ItemDescription": "AMIKACIN VL 500MG", "UOM": "10 VIALS/CT", "Price": 87.5, "Source": "INV", "VendNumber": "5256110", "OrderQty": 10, "Location": "3C2B"},
		{"MedId": "", "ItemNumber": "105992", "ItemDescription": "IDARUBICIN VL 10MG", "UOM": "None", "Price": 55.62, "Source": "INV", "VendNumber": "669782", "OrderQty": 1, "Location": "11C3B"},
		{"MedId": "", "ItemNumber": "105993", "ItemDescription": "VINORELBINE VL 10MG", "UOM": "None", "Price": 23.02, "Source": "INV", "VendNumber": "027102", "OrderQty": 1, "Location": "11C6A"},
		{"MedId": "", "ItemNumber": "105994", "ItemDescription": "METOCLOPRAM VL 10MG 2ML", "UOM": "25 VIALS/CT", "Price": 23.72, "Source": "INV", "VendNumber": "335224", "OrderQty": 25, "Location": "5A2A"},
		{"MedId": "", "ItemNumber": "105995", "ItemDescription": "ETOPOSIDE VL 100MG", "UOM": "None", "Price": 5.28, "Source": "INV", "VendNumber": "095733", "OrderQty": 1, "Location": "9D3G"},
		{"MedId": "", "ItemNumber": "105996", "ItemDescription": "SULFAM/TRI VL 10ML", "UOM": "10 VIALS/CT", "Price": 113.15, "Source": "INV", "VendNumber": "335331", "OrderQty": 10, "Location": "5E3C"},
		{"MedId": "", "ItemNumber": "105997", "ItemDescription": "FLUOROURACIL VL 500MG", "UOM": "10 VIALS/CA", "Price": 16.66, "Source": "INV", "VendNumber": "279323", "OrderQty": 10, "Location": "9D4D"},
		{"MedId": "", "ItemNumber": "106001", "ItemDescription": "MESNA VL 1GM", "UOM": "None", "Price": 10.28, "Source": "INV", "VendNumber": "4360541", "OrderQty": 1, "Location": "9D5G"},
		{"MedId": "", "ItemNumber": "106005", "ItemDescription": "LEVOCARNITINE VL 1GM/5ML", "UOM": "5 VIALS/BX", "Price": 154.6, "Source": "W/S", "VendNumber": "2988293", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106023", "ItemDescription": "MATULANE CAP 50MG", "UOM": "100 CAPS/BO", "Price": 5362.34, "Source": "W/S", "VendNumber": "54482-0053-01", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106036", "ItemDescription": "LORAZEPAM TAB .5MG", "UOM": "100 TABS/BO", "Price": 13.36, "Source": "W/S", "VendNumber": "286512", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106179", "ItemDescription": "BAG PAPR 20LB", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106300", "ItemDescription": "MESALAMINE ENEMA 4GM 7", "UOM": "7 BOTTLES/BX", "Price": 69.37, "Source": "W/S", "VendNumber": "4281481", "OrderQty": 1, "Location": "1B2F"},
		{"MedId": "", "ItemNumber": "106446", "ItemDescription": "PIOGLITAZONE TAB 15MG", "UOM": "30  TABS/BO", "Price": 2.3298, "Source": "W/S", "VendNumber": "407609", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106447", "ItemDescription": "PIOGLITAZONE TAB 30MG", "UOM": "30 EA/BO", "Price": 3.5298, "Source": "W/S", "VendNumber": "392365", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106448", "ItemDescription": "PIOGLITAZONE TAB 45MG", "UOM": "30 EA/BO", "Price": 3.49, "Source": "W/S", "VendNumber": "4832812", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106453", "ItemDescription": "LEUPROLIDE INJ 3.75MG", "UOM": "None", "Price": 1030.83, "Source": "W/S", "VendNumber": "740530", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106454", "ItemDescription": "LEUPROLIDE INJ 7.5MG", "UOM": "None", "Price": 124.34, "Source": "INV", "VendNumber": "262212", "OrderQty": 1, "Location": "4E2A"},
		{"MedId": "", "ItemNumber": "106457", "ItemDescription": "TRIAMCIN DENTAL 0.1% 5GM", "UOM": "None", "Price": 30.22, "Source": "INV", "VendNumber": "365411", "OrderQty": 1, "Location": "1F6C"},
		{"MedId": "", "ItemNumber": "106459", "ItemDescription": "NYSTATIN/TRIAMC CR 15GM", "UOM": "None", "Price": 42.12, "Source": "INV", "VendNumber": "365338", "OrderQty": 1, "Location": "1F4E"},
		{"MedId": "", "ItemNumber": "106460", "ItemDescription": "KETOCONAZOLE CR 15GM", "UOM": "None", "Price": 18.11, "Source": "INV", "VendNumber": "709838", "OrderQty": 1, "Location": "1E2E"},
		{"MedId": "", "ItemNumber": "106463", "ItemDescription": "CARBAMAZEP SUSP 16OZ", "UOM": "None", "Price": 45.64, "Source": "INV", "VendNumber": "3408432", "OrderQty": 1, "Location": "6A3C"},
		{"MedId": "", "ItemNumber": "106467", "ItemDescription": "CARBAMAZEP TAB 200MG", "UOM": "100 TABS/BO", "Price": 51.6, "Source": "INV", "VendNumber": "278648", "OrderQty": 100, "Location": "2A6I"},
		{"MedId": "", "ItemNumber": "106468", "ItemDescription": "DIMERCAPROL AMP 300MG 3ML", "UOM": "10 AMPS/CT", "Price": 841.13, "Source": "W/S", "VendNumber": "4601688", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106475", "ItemDescription": "CEPHALEXIN LQ 250MG 100ML", "UOM": "None", "Price": 12.73, "Source": "INV", "VendNumber": "326819", "OrderQty": 1, "Location": "6A3E"},
		{"MedId": "", "ItemNumber": "106476", "ItemDescription": "HYDROXYCHQUINE TAB 200MG", "UOM": "100 TABS/BO", "Price": 45.36, "Source": "INV", "VendNumber": "348476", "OrderQty": 100, "Location": "2D1H"},
		{"MedId": "", "ItemNumber": "106477", "ItemDescription": "AMPICILLIN CAP 500MG", "UOM": "100 CAPS/BO", "Price": 18.15, "Source": "INV", "VendNumber": "3541968", "OrderQty": 100, "Location": "2A2L"},
		{"MedId": "", "ItemNumber": "106479", "ItemDescription": "FLUOCIDE CR .05% 15GM", "UOM": "None", "Price": 12.75, "Source": "INV", "VendNumber": "641098", "OrderQty": 1, "Location": "1E1C"},
		{"MedId": "", "ItemNumber": "106480", "ItemDescription": "HALOPERIDOL CONC 120ML", "UOM": "None", "Price": 9.34, "Source": "W/S", "VendNumber": "646950", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106483", "ItemDescription": "FOSINOPRIL TAB 10MG", "UOM": "90 TABS/BO", "Price": 8.6598, "Source": "W/S", "VendNumber": "546958", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106484", "ItemDescription": "URSODIOL CAP 300MG", "UOM": "100 CAPS/BO", "Price": 235.33, "Source": "INV", "VendNumber": "004236", "OrderQty": 100, "Location": "3B3A"},
		{"MedId": "", "ItemNumber": "106488", "ItemDescription": "TORSEMIDE TAB 20MG", "UOM": "100 TABS/BO", "Price": 7.16, "Source": "INV", "VendNumber": "569501", "OrderQty": 100, "Location": "3B2H"},
		{"MedId": "", "ItemNumber": "106489", "ItemDescription": "FOSINOPRIL TAB 20MG", "UOM": "90 TABS/BO", "Price": 9.6894, "Source": "W/S", "VendNumber": "546960", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106490", "ItemDescription": "FOSINOPRIL TAB 40MG", "UOM": "90 TABS/BO", "Price": 11.4399, "Source": "W/S", "VendNumber": "546965", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106492", "ItemDescription": "NAPROSYN TAB 375MG", "UOM": "100 TABS/BO", "Price": 4, "Source": "W/S", "VendNumber": "4588752", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106493", "ItemDescription": "CARBAMAZEP CHEW 100MG", "UOM": "100 TABS/BO", "Price": 33.16, "Source": "INV", "VendNumber": "2471571", "OrderQty": 100, "Location": "2A6H"},
		{"MedId": "", "ItemNumber": "106494", "ItemDescription": "DILTIAZEM TAB 90MG", "UOM": "100 TABS/BO", "Price": 16.59, "Source": "W/S", "VendNumber": "499871", "OrderQty": 1, "Location": "2C1B"},
		{"MedId": "", "ItemNumber": "106495", "ItemDescription": "GLYBURIDE TAB 5MG U/D", "UOM": "100 TABS/BO", "Price": 3.85, "Source": "INV", "VendNumber": "3217031", "OrderQty": 100, "Location": "2C6J"},
		{"MedId": "", "ItemNumber": "106496", "ItemDescription": "GLYBURIDE TAB 2.5MG", "UOM": "100 TABS/BO", "Price": 4, "Source": "INV", "VendNumber": "3174570", "OrderQty": 100, "Location": "2C6I"},
		{"MedId": "", "ItemNumber": "106497", "ItemDescription": "NAPROSYN TAB 250MG", "UOM": "100 TABS/BO", "Price": 3.06, "Source": "W/S", "VendNumber": "430532", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106498", "ItemDescription": "DICLOX CAP 250MG", "UOM": "100 CAPS/BO", "Price": 29, "Source": "W/S", "VendNumber": "1415496", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106500", "ItemDescription": "CALCITROL CAP .25MCG", "UOM": "100 CAPS/BO", "Price": 22.37, "Source": "INV", "VendNumber": "376491", "OrderQty": 100, "Location": "2A5K"},
		{"MedId": "", "ItemNumber": "106501", "ItemDescription": "NEOMYCIN TAB 500MG", "UOM": "100 TABS/BO", "Price": 73.07, "Source": "W/S", "VendNumber": "4368692", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106502", "ItemDescription": "AMOX CAP 250MG", "UOM": "100 CAPS/BO", "Price": 4.55, "Source": "INV", "VendNumber": "759704", "OrderQty": 100, "Location": "2A2H"},
		{"MedId": "", "ItemNumber": "106504", "ItemDescription": "DILTIAZEM TAB 60MG", "UOM": "100 TABS/BO", "Price": 11.93, "Source": "W/S", "VendNumber": "621336", "OrderQty": 1, "Location": "2C1A"},
		{"MedId": "", "ItemNumber": "106505", "ItemDescription": "SULFAM/TRI TAB 400/80", "UOM": "100 TABS/BO", "Price": 6.07, "Source": "W/S", "VendNumber": "698548", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106507", "ItemDescription": "MUPIROCIN OINT 2% 22GM", "UOM": "None", "Price": 5.15, "Source": "INV", "VendNumber": "155788", "OrderQty": 1, "Location": "1F2A"},
		{"MedId": "", "ItemNumber": "106508", "ItemDescription": "DILTIAZEM TAB 30MG U/D", "UOM": "100 TABS/BO", "Price": 7.44, "Source": "INV", "VendNumber": "621312", "OrderQty": 100, "Location": "2B6H"},
		{"MedId": "", "ItemNumber": "106509", "ItemDescription": "AMOX LIQ 125MG 150ML", "UOM": "None", "Price": 2.74, "Source": "INV", "VendNumber": "1415397", "OrderQty": 1, "Location": "6A2B"},
		{"MedId": "", "ItemNumber": "106847", "ItemDescription": "ACETAMIN/COD #3 TAB U/D", "UOM": "100 TABS/BX", "Price": 11.88, "Source": "W/S", "VendNumber": "351181", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106848", "ItemDescription": "METHADONE TAB 10MG", "UOM": "100 TABS/BO", "Price": 10.13, "Source": "W/S", "VendNumber": "650663", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106861", "ItemDescription": "OXYCODONE/ACET TAB 5/325", "UOM": "100 TABS/BO", "Price": 23.75, "Source": "W/S", "VendNumber": "2409266", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106927", "ItemDescription": "LEVETIRACETAM TAB 250MG", "UOM": "100 TABS/BO", "Price": 11.06, "Source": "INV", "VendNumber": "363236", "OrderQty": 100, "Location": "2D4E"},
		{"MedId": "", "ItemNumber": "106930", "ItemDescription": "CHLORDIAZ CAP 25MG", "UOM": "100 CAPS/BO", "Price": 7.08, "Source": "W/S", "VendNumber": "759613", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106931", "ItemDescription": "PROCHLORPERAZINE TAB 10MG", "UOM": "100 TABS/BO", "Price": 5.58, "Source": "INV", "VendNumber": "893156", "OrderQty": 100, "Location": "3A2D"},
		{"MedId": "", "ItemNumber": "106932", "ItemDescription": "CHLORPROM TAB 50MG", "UOM": "100 TABS/BO", "Price": 400.27, "Source": "W/S", "VendNumber": "428144", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106933", "ItemDescription": "CHLORPROM TAB 25MG", "UOM": "100 TABS/BO", "Price": 296.19, "Source": "W/S", "VendNumber": "428136", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106934", "ItemDescription": "DIAZEPAM TAB 5MG", "UOM": "100 TABS/BO", "Price": 4.4, "Source": "W/S", "VendNumber": "446146", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106935", "ItemDescription": "DIAZEPAM TAB 10MG U/D", "UOM": "100 TABS/BX", "Price": 6.2, "Source": "W/S", "VendNumber": "837260", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106936", "ItemDescription": "DIPHENHYD CAP 25MGU/D", "UOM": "100 CAPS/BX", "Price": 2.98, "Source": "INV", "VendNumber": "092496", "OrderQty": 100, "Location": "2C1F"},
		{"MedId": "", "ItemNumber": "106938", "ItemDescription": "CHLORPHENIR TAB 4MG", "UOM": "100 TABS/BO", "Price": 3, "Source": "W/S", "VendNumber": "2629194", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106939", "ItemDescription": "DIAZEPAM TAB 2MG U/D", "UOM": "100 TABS/BX", "Price": 5.51, "Source": "W/S", "VendNumber": "837286", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106940", "ItemDescription": "THIORIDAZINE TAB 10MG U/D", "UOM": "100 TABS/BX", "Price": 15, "Source": "W/S", "VendNumber": "1157130", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106941", "ItemDescription": "INDOMETHACIN CAP 50MG", "UOM": "100 CAPS/BO", "Price": 5, "Source": "W/S", "VendNumber": "4039350", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106942", "ItemDescription": "VALPROIC ACID CAP 250MG", "UOM": "100 CAPS/BX", "Price": 16, "Source": "W/S", "VendNumber": "4019204", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106943", "ItemDescription": "CHLORDIAZ CAP 10MG", "UOM": "100 CAPS/BO", "Price": 6.78, "Source": "W/S", "VendNumber": "762112", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106945", "ItemDescription": "VERAPAMIL TAB SR 120MG", "UOM": "100 TABS/BO", "Price": 17.28, "Source": "INV", "VendNumber": "284190", "OrderQty": 100, "Location": "3B4D"},
		{"MedId": "", "ItemNumber": "106947", "ItemDescription": "VERAPAMIL TAB SR 180MG", "UOM": "100 TABS/BO", "Price": 12.51, "Source": "INV", "VendNumber": "183879", "OrderQty": 100, "Location": "3B4E"},
		{"MedId": "", "ItemNumber": "106948", "ItemDescription": "VERAPAMIL TAB SR 240MG", "UOM": "100 TABS/BO", "Price": 10.33, "Source": "W/S", "VendNumber": "4732202", "OrderQty": 1, "Location": "3B4F"},
		{"MedId": "", "ItemNumber": "106949", "ItemDescription": "NORTRIPTYL CAP 10MG", "UOM": "100 CAPS/BO", "Price": 7.56, "Source": "W/S", "VendNumber": "506832", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106950", "ItemDescription": "PRAZOSIN CAP 1MG", "UOM": "100 CAPS/BO", "Price": 41.93, "Source": "W/S", "VendNumber": "507442", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106952", "ItemDescription": "PRAZOSIN CAP 5MG", "UOM": "100 CAPS/BO", "Price": 82.16, "Source": "W/S", "VendNumber": "3948981", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106953", "ItemDescription": "CHLORTHAL TAB 25MG", "UOM": "100 TABS/BX", "Price": 77.61, "Source": "W/S", "VendNumber": "456533", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106954", "ItemDescription": "THIOTHIXENE CAP 1MG", "UOM": "100 CAPS/BO", "Price": 70.02, "Source": "W/S", "VendNumber": "900738", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106956", "ItemDescription": "THIOTHIXENE CAP 5MG", "UOM": "100 CAPS/BO", "Price": 96, "Source": "W/S", "VendNumber": "1205939", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106957", "ItemDescription": "DISOPYRAMIDE CAP 100MG", "UOM": "100 CAPS/BO", "Price": 133.79, "Source": "W/S", "VendNumber": "506394", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106958", "ItemDescription": "DOXEPIN CAP 10MG", "UOM": "100 CAPS/BO", "Price": 43.41, "Source": "W/S", "VendNumber": "115592", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106959", "ItemDescription": "CYCLOBENZAPR TAB 10MG", "UOM": "1000 TABS/BO", "Price": 18.5, "Source": "INV", "VendNumber": "256103", "OrderQty": 1000, "Location": "2B5H"},
		{"MedId": "", "ItemNumber": "106960", "ItemDescription": "DIPYRIDAMOLE TAB 25MG", "UOM": "100 TABS/BO", "Price": 4.35, "Source": "W/S", "VendNumber": "3946589", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106963", "ItemDescription": "TRIFLUOPERAZINE TAB 1MG U", "UOM": "100 TABS/BX", "Price": 91.16, "Source": "W/S", "VendNumber": "481663", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106964", "ItemDescription": "LOVASTATIN TAB 20MG", "UOM": "60 TABS/BO", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106965", "ItemDescription": "TEMAZEPAM CAP 15MG U/D", "UOM": "100 CAPS/BX", "Price": 9.31, "Source": "W/S", "VendNumber": "596916", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106966", "ItemDescription": "INDAPAMIDE TAB 2.5MG", "UOM": "100 TABS/BX", "Price": 11, "Source": "W/S", "VendNumber": "2483758", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106967", "ItemDescription": "ALPRAZOLAM TAB .5MG U/D", "UOM": "100 TABS/BX", "Price": 5.59, "Source": "W/S", "VendNumber": "239517", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106968", "ItemDescription": "ALPRAZOLAM TAB .25MG", "UOM": "100 TABS/BO", "Price": 9.21, "Source": "W/S", "VendNumber": "239384", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106969", "ItemDescription": "DRONABINOL CAP 2.5MG", "UOM": "60 CAPS/BO", "Price": 156.552, "Source": "W/S", "VendNumber": "773965", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106971", "ItemDescription": "NEO/POLY/HC OTIC SUS 10ML", "UOM": "None", "Price": 42.43, "Source": "INV", "VendNumber": "713661", "OrderQty": 1, "Location": "1A6E"},
		{"MedId": "", "ItemNumber": "106972", "ItemDescription": "SPIRONOLACTONE TAB 25MG", "UOM": "100 TABS/BO", "Price": 10.47, "Source": "INV", "VendNumber": "117218", "OrderQty": 100, "Location": "3A6F"},
		{"MedId": "", "ItemNumber": "106973", "ItemDescription": "SULFAM/TRI TAB DS", "UOM": "100 TABS/BO", "Price": 8.63, "Source": "INV", "VendNumber": "701805", "OrderQty": 100, "Location": "3A6I"},
		{"MedId": "", "ItemNumber": "106974", "ItemDescription": "ZINC SULFATE CAP 220MG", "UOM": "100 CAPS/BO", "Price": 2.02, "Source": "INV", "VendNumber": "2912715", "OrderQty": 100, "Location": "3B6D"},
		{"MedId": "", "ItemNumber": "106975", "ItemDescription": "METHENAMINE TAB 1 GM", "UOM": "100 TABS/BO", "Price": 138.19, "Source": "W/S", "VendNumber": "020909", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106977", "ItemDescription": "QUINAGLUTE DURA 324MG", "UOM": "100 TABS/BO", "Price": 508.13, "Source": "W/S", "VendNumber": "2124220", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106980", "ItemDescription": "SODIUM BICARBONATE TAB 650MG", "UOM": "1000 TABS/BO", "Price": 10.68, "Source": "W/S", "VendNumber": "4725669", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106982", "ItemDescription": "BISACODYL SUPP 10MG", "UOM": "100 SUPP/BX", "Price": 6.42, "Source": "INV", "VendNumber": "391888", "OrderQty": 100, "Location": "1B1D"},
		{"MedId": "", "ItemNumber": "106983", "ItemDescription": "CHOLESTYRAMINE PWD PK 4GM", "UOM": "60 PKTS/BX", "Price": 100.392, "Source": "INV", "VendNumber": "193557", "OrderQty": 60, "Location": "6A4B"},
		{"MedId": "", "ItemNumber": "106985", "ItemDescription": "BACLOFEN TAB 20MG", "UOM": "100 TABS/BO", "Price": 32.42, "Source": "W/S", "VendNumber": "1805027", "OrderQty": 1, "Location": "2A4E"},
		{"MedId": "", "ItemNumber": "106987", "ItemDescription": "POT IODIDE 1GM/ML 30ML", "UOM": "None", "Price": 10.18, "Source": "W/S", "VendNumber": "1365634", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106989", "ItemDescription": "PENTOXIFYL TAB 400MG", "UOM": "100 TABS/BO", "Price": 12.47, "Source": "INV", "VendNumber": "218172", "OrderQty": 100, "Location": "2F5B"},
		{"MedId": "", "ItemNumber": "106990", "ItemDescription": "BACLOFEN TAB 10MG", "UOM": "100 TABS/BO", "Price": 12.4, "Source": "INV", "VendNumber": "623777", "OrderQty": 100, "Location": "2A4D"},
		{"MedId": "", "ItemNumber": "106991", "ItemDescription": "FERROUS GLU TAB 325MG UD", "UOM": "100 TABS/BX", "Price": 2.62, "Source": "INV", "VendNumber": "503793", "OrderQty": 100, "Location": "2C3L"},
		{"MedId": "", "ItemNumber": "106992", "ItemDescription": "AMANTADINE CAP 100MG", "UOM": "50 CAPS/BO", "Price": 65.27, "Source": "W/S", "VendNumber": "4989505", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106993", "ItemDescription": "CHLORPROM TAB 10MG", "UOM": "100 TABS/BO", "Price": 224.69, "Source": "W/S", "VendNumber": "200519", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106996", "ItemDescription": "PYRIDOSTIG TAB SR 180MG", "UOM": "20 TABS/BO", "Price": 704.21, "Source": "W/S", "VendNumber": "2578003", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "106999", "ItemDescription": "CITRA PH 30ML", "UOM": "100 CUPS/CA", "Price": 121.05, "Source": "INV", "VendNumber": "642619", "OrderQty": 100, "Location": "6A5A"},
		{"MedId": "", "ItemNumber": "107008", "ItemDescription": "RIFAMPIN CAP 300MG", "UOM": "60 CAPS/BO", "Price": 28.572, "Source": "INV", "VendNumber": "230096", "OrderQty": 60, "Location": "3A4A"},
		{"MedId": "", "ItemNumber": "107009", "ItemDescription": "PYRAZINAMIDE TAB 500MG", "UOM": "60 TABS/BO", "Price": 206.32, "Source": "W/S", "VendNumber": "083006", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107012", "ItemDescription": "CHARCOAL ACTIV/AQUA 50GM", "UOM": "None", "Price": 18.05, "Source": "INV", "VendNumber": "748412", "OrderQty": 1, "Location": "6A3G"},
		{"MedId": "", "ItemNumber": "107015", "ItemDescription": "ACETYLCYSTEINE CAP 600MG", "UOM": "60 CAPS/BO", "Price": 7.8, "Source": "INV", "VendNumber": "3478864", "OrderQty": 60, "Location": "2A1B"},
		{"MedId": "", "ItemNumber": "107020", "ItemDescription": "SOD BICARB TAB 5GR", "UOM": "1000 TABS/BO", "Price": 10, "Source": "W/S", "VendNumber": "1773183", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107021", "ItemDescription": "MULTIVIT H TAB", "UOM": "100 TABS/BO", "Price": 1.57, "Source": "W/S", "VendNumber": "731141", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107022", "ItemDescription": "ALLOPURINOL TAB 100MG", "UOM": "100 TABS/BO", "Price": 11.1, "Source": "INV", "VendNumber": "720284", "OrderQty": 100, "Location": "2A1E"},
		{"MedId": "", "ItemNumber": "107023", "ItemDescription": "VERAPAMIL TAB 80MG U/D", "UOM": "100 TABS/BO", "Price": 6.8, "Source": "INV", "VendNumber": "462697", "OrderQty": 100, "Location": "3B4B"},
		{"MedId": "", "ItemNumber": "107024", "ItemDescription": "PROMETHAZINE TAB 25MG", "UOM": "100 TABS/BO", "Price": 6.74, "Source": "INV", "VendNumber": "254656", "OrderQty": 100, "Location": "3A2E"},
		{"MedId": "", "ItemNumber": "107025", "ItemDescription": "GLIPIZIDE TAB 5MG U/D", "UOM": "100 TABS/BO", "Price": 23.84, "Source": "W/S", "VendNumber": "036020", "OrderQty": 1, "Location": "2C6G"},
		{"MedId": "", "ItemNumber": "107026", "ItemDescription": "OGESTREL 0.5/50 3 X 28", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107027", "ItemDescription": "GLIPIZIDE TAB 10MG", "UOM": "100 TABS/BO", "Price": 1.97, "Source": "INV", "VendNumber": "3465176", "OrderQty": 100, "Location": "2C6H"},
		{"MedId": "", "ItemNumber": "107028", "ItemDescription": "CA GLUB LIQ 1.8GM/5ML PT", "UOM": "None", "Price": 12.92, "Source": "W/S", "VendNumber": "1134428", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107030", "ItemDescription": "VERAPAMIL TAB 40MG", "UOM": "100 TABS/BO", "Price": 12.47, "Source": "INV", "VendNumber": "447516", "OrderQty": 100, "Location": "3B4A"},
		{"MedId": "", "ItemNumber": "107031", "ItemDescription": "NORTRIPT CAP 25MG", "UOM": "100 CAPS/BO", "Price": 10.95, "Source": "INV", "VendNumber": "506838", "OrderQty": 100, "Location": "2F2B"},
		{"MedId": "", "ItemNumber": "107032", "ItemDescription": "DISOPYRAMIDE CAP 150MG", "UOM": "100 CAPS/BO", "Price": 143.77, "Source": "W/S", "VendNumber": "1543339", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107033", "ItemDescription": "ALLOPURINOL TAB 300MG", "UOM": "100 TABS/BO", "Price": 20.99, "Source": "W/S", "VendNumber": "720300", "OrderQty": 1, "Location": "2A1F"},
		{"MedId": "", "ItemNumber": "107034", "ItemDescription": "SULFUR SHAMPOO 2% 4OZ", "UOM": "None", "Price": 1.51, "Source": "INV", "VendNumber": "1775402", "OrderQty": 1, "Location": "1F5F"},
		{"MedId": "", "ItemNumber": "107035", "ItemDescription": "MINOXIDIL TAB 10MG", "UOM": "100 TABS/BO", "Price": 22, "Source": "W/S", "VendNumber": "3275682", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107036", "ItemDescription": "MINOCYCLINE CAP 50MG", "UOM": "100 CAPS/BO", "Price": 19.53, "Source": "INV", "VendNumber": "550947", "OrderQty": 100, "Location": "2E5E"},
		{"MedId": "", "ItemNumber": "107037", "ItemDescription": "GLIPIZIDE TAB XL 5MG", "UOM": "100 TABS/BO", "Price": 11, "Source": "W/S", "VendNumber": "5107701", "OrderQty": 1, "Location": "2C6I"},
		{"MedId": "", "ItemNumber": "107038", "ItemDescription": "GLIPIZIDE TAB XL 10MG", "UOM": "100 TABS/BO", "Price": 44.32, "Source": "W/S", "VendNumber": "4094991", "OrderQty": 1, "Location": "2C6I"},
		{"MedId": "", "ItemNumber": "107040", "ItemDescription": "IRON DEXTRAN VL 2ML", "UOM": "10VIALS/CT", "Price": 232.51, "Source": "INV", "VendNumber": "046284", "OrderQty": 10, "Location": "4D4D"},
		{"MedId": "", "ItemNumber": "107042", "ItemDescription": "ACETAZOL TAB 250MG", "UOM": "100 TABS/BO", "Price": 140.75, "Source": "W/S", "VendNumber": "453548", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107053", "ItemDescription": "TRIAMTERENE CAP 50MG", "UOM": "100 CAPS/BO", "Price": 895.25, "Source": "W/S", "VendNumber": "1199942", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107054", "ItemDescription": "PHENOXYBENZAMINE CAP 10MG", "UOM": "100 CAPS/BO", "Price": 7096.98, "Source": "W/S", "VendNumber": "1259233", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107055", "ItemDescription": "CAPTOPRIL TAB 12.5MG", "UOM": "100 TABS/BO", "Price": 85, "Source": "INV", "VendNumber": "2427706", "OrderQty": 100, "Location": "2A6F"},
		{"MedId": "", "ItemNumber": "107056", "ItemDescription": "PHENOBARB TAB 32.4MG", "UOM": "100 TABS/BO", "Price": 29.21, "Source": "W/S", "VendNumber": "623126", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107058", "ItemDescription": "PROP-THIOURACIL TAB 50MG", "UOM": "100 TABS/BO", "Price": 62, "Source": "W/S", "VendNumber": "2075711", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107059", "ItemDescription": "HYDROCORT TAB 20MG", "UOM": "100 TABS/BO", "Price": 48.14, "Source": "W/S", "VendNumber": "4832317", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107060", "ItemDescription": "METHOCARBAMOL TAB 750MG", "UOM": "100 TABS/BO", "Price": 14.74, "Source": "W/S", "VendNumber": "231136", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107061", "ItemDescription": "ASPIRIN-CAFF-BUTAL TAB", "UOM": "100 TABS/BO", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107062", "ItemDescription": "ISONIAZID TAB 300MG", "UOM": "100 TABS/BO", "Price": 13.63, "Source": "W/S", "VendNumber": "1210632", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107064", "ItemDescription": "ISOSORBIDE TAB 20MG", "UOM": "100 TABS/BO", "Price": 67.71, "Source": "INV", "VendNumber": "1280239", "OrderQty": 100, "Location": "2D3D"},
		{"MedId": "", "ItemNumber": "107066", "ItemDescription": "DICYCLOMINE CAP 10MG", "UOM": "100 CAPS/BO", "Price": 3.92, "Source": "INV", "VendNumber": "942946", "OrderQty": 100, "Location": "2B6D"},
		{"MedId": "", "ItemNumber": "107067", "ItemDescription": "ISOSORBIDE TAB 10MG", "UOM": "100 TABS/BO", "Price": 48.17, "Source": "INV", "VendNumber": "280693", "OrderQty": 100, "Location": "2D3C"},
		{"MedId": "", "ItemNumber": "107068", "ItemDescription": "ENEMEEZ W/BENZ ENEMA", "UOM": "30 EACH/JR", "Price": 65.7, "Source": "W/S", "VendNumber": "3419884", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107136", "ItemDescription": "CON ESTROG VL 25MG", "UOM": "None", "Price": 265.4, "Source": "INV", "VendNumber": "265108", "OrderQty": 1, "Location": "10A3A"},
		{"MedId": "", "ItemNumber": "107140", "ItemDescription": "CON ESTROGEN TAB 0.3MG", "UOM": "100 TABS/BO", "Price": 478.84, "Source": "W/S", "VendNumber": "336469", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107142", "ItemDescription": "ANBESOL LIQ 1 OZ.", "UOM": "None", "Price": 4.4, "Source": "INV", "VendNumber": "549860", "OrderQty": 1, "Location": "1D4E"},
		{"MedId": "", "ItemNumber": "107143", "ItemDescription": "VENLAFAXINE TAB 25MG", "UOM": "100 TABS/BO", "Price": 26.21, "Source": "W/S", "VendNumber": "3736493", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107144", "ItemDescription": "VENLAFAXINE CAP XR 150MG", "UOM": "90 TABS/BX", "Price": 15.588, "Source": "INV", "VendNumber": "105193", "OrderQty": 90, "Location": "3B3J"},
		{"MedId": "", "ItemNumber": "107145", "ItemDescription": "VENLAFAXINE TAB 75MG XRUD", "UOM": "90 CAPS/BO", "Price": 11.304, "Source": "INV", "VendNumber": "105078", "OrderQty": 90, "Location": "3B3I"},
		{"MedId": "", "ItemNumber": "107146", "ItemDescription": "VENLAFAXINE TAB 50MG", "UOM": "100 TABS/BO", "Price": 24.4, "Source": "W/S", "VendNumber": "250915", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107147", "ItemDescription": "VENLAFAXINE XR 37.5MG UD", "UOM": "90 CAPS/BO", "Price": 9.0099, "Source": "W/S", "VendNumber": "105054", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107148", "ItemDescription": "VENLAFAXINE TAB 37.5MG", "UOM": "100 TABS/BO", "Price": 20.74, "Source": "INV", "VendNumber": "250928", "OrderQty": 100, "Location": "3B3H"},
		{"MedId": "", "ItemNumber": "107150", "ItemDescription": "SIROLIMUS CAP 1MG", "UOM": "100 CAPS/BO", "Price": 1293, "Source": "W/S", "VendNumber": "4759940", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107153", "ItemDescription": "PROPRAN CAP SA 80MG", "UOM": "100 CAPS/BO", "Price": 179.66, "Source": "W/S", "VendNumber": "138901", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107155", "ItemDescription": "CON ESTROG TAB .625MG", "UOM": "100 TABS/BO", "Price": 485.86, "Source": "W/S", "VendNumber": "3706249", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107156", "ItemDescription": "PANTOPRAZOLE VL 40MG", "UOM": "10 VIALS/CT", "Price": 28.56, "Source": "INV", "VendNumber": "021910", "OrderQty": 10, "Location": "5C1A"},
		{"MedId": "", "ItemNumber": "107157", "ItemDescription": "AMICAR TAB 500MG", "UOM": "30 TABS/BO", "Price": 549, "Source": "W/S", "VendNumber": "5106455", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107159", "ItemDescription": "STREPTOMYCIN VL 1GM", "UOM": "10 VIALS/BX", "Price": 110.4, "Source": "W/S", "VendNumber": "2833010", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107161", "ItemDescription": "AMPHOTER VL 50MG", "UOM": "None", "Price": 35.46, "Source": "W/S", "VendNumber": "1199140", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107192", "ItemDescription": "DRUG VINCRISTINE VL 2MG", "UOM": "None", "Price": 9.36, "Source": "INV", "VendNumber": "955724", "OrderQty": 1, "Location": "11C5B"},
		{"MedId": "", "ItemNumber": "107193", "ItemDescription": "DILTIAZEM VL 5MG/ML 5ML", "UOM": "10 VIALS/CT", "Price": 12.9, "Source": "INV", "VendNumber": "833347", "OrderQty": 10, "Location": "11D2B"},
		{"MedId": "", "ItemNumber": "107194", "ItemDescription": "KETOROLAC VL 15MG", "UOM": "25 VIALS/CT", "Price": 17.96, "Source": "INV", "VendNumber": "077697", "OrderQty": 25, "Location": "4D5A"},
		{"MedId": "", "ItemNumber": "107195", "ItemDescription": "DEXAMETH VL 100MG/10ML", "UOM": "10 VIALS/CT", "Price": 15.94, "Source": "INV", "VendNumber": "547048", "OrderQty": 10, "Location": "3F5C"},
		{"MedId": "", "ItemNumber": "107198", "ItemDescription": "DAUNORUBICIN VL 20MG", "UOM": "10 VIALS/CT", "Price": 537.66, "Source": "W/S", "VendNumber": "2973303", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107766", "ItemDescription": "THEOPHYL EL BULK", "UOM": "None", "Price": 187, "Source": "W/S", "VendNumber": "4338026", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107767", "ItemDescription": "WHITE PETROLATUM LB", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107768", "ItemDescription": "FLUCONAZOLE PB 200MG", "UOM": "6 BAGS/BX", "Price": 18.0702, "Source": "INV", "VendNumber": "246049", "OrderQty": 6, "Location": "4C1D"},
		{"MedId": "", "ItemNumber": "107770", "ItemDescription": "HYDROMORP LIQ 1MG/ML 16OZ", "UOM": "None", "Price": 125.98, "Source": "W/S", "VendNumber": "4755393", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107771", "ItemDescription": "PYRIDOSTIG LIQ 16OZ", "UOM": "None", "Price": 1003.1, "Source": "W/S", "VendNumber": "1298512", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107772", "ItemDescription": "RIFAXIMIN TAB 200MG", "UOM": "30 TABS/BO", "Price": 475.71, "Source": "INV", "VendNumber": "3587524", "OrderQty": 30, "Location": "3A4B"},
		{"MedId": "", "ItemNumber": "107773", "ItemDescription": "ACETYLCYSTEINE VL 6G/30ML", "UOM": "4 VIALS/CT", "Price": 295.53, "Source": "W/S", "VendNumber": "416743", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107775", "ItemDescription": "OINTMENT JAR 8OZ", "UOM": "None", "Price": 16.84, "Source": "W/S", "VendNumber": "1182765", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107776", "ItemDescription": "OINTMENT JAR 4OZ", "UOM": "None", "Price": 11.54, "Source": "W/S", "VendNumber": "960187", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107777", "ItemDescription": "OINTMENT JAR 2OZ", "UOM": "None", "Price": 6.91, "Source": "W/S", "VendNumber": "960179", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107778", "ItemDescription": "OINTMENT JAR 1OZ", "UOM": "None", "Price": 5.9, "Source": "W/S", "VendNumber": "1182724", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107781", "ItemDescription": "FERRIS SUBSULFATE SOL 500", "UOM": "None", "Price": 31.5, "Source": "W/S", "VendNumber": "3479748", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107783", "ItemDescription": "SOD BICARB POWDER 500GM", "UOM": "None", "Price": 14.06, "Source": "W/S", "VendNumber": "1338292", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107789", "ItemDescription": "CADD TUBING SET", "UOM": "None", "Price": 6.6, "Source": "W/S", "VendNumber": "21-7106-24", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107790", "ItemDescription": "POLY-VI-SOL W/IRON 50ML", "UOM": "None", "Price": 2.12, "Source": "W/S", "VendNumber": "1041664", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107792", "ItemDescription": "COCOA BUTTER BAR 1OZ", "UOM": "None", "Price": 2.1, "Source": "W/S", "VendNumber": "2874964", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107793", "ItemDescription": "CAFF/SOD BENZ AMP 2ML", "UOM": "10 AMPS/CT", "Price": 128.94, "Source": "W/S", "VendNumber": "577841", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107794", "ItemDescription": "ASCORB ACID TAB 500MG", "UOM": "1000 TABS/BO", "Price": 16.14, "Source": "INV", "VendNumber": "522334", "OrderQty": 1000, "Location": "2A3F"},
		{"MedId": "", "ItemNumber": "107795", "ItemDescription": "METHYLPHENIDATE TAB 10MG", "UOM": "100 TABS/BO", "Price": 39, "Source": "W/S", "VendNumber": "420968", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107796", "ItemDescription": "METHIMAZOLE TAB 10MG", "UOM": "100 TABS/BO", "Price": 9.27, "Source": "W/S", "VendNumber": "338350", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107798", "ItemDescription": "MEDROXYPROGESTER TAB 10MG", "UOM": "100 TABS/BO", "Price": 5.75, "Source": "W/S", "VendNumber": "2529485", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107800", "ItemDescription": "CEPACOL LOZENGE 384/BX", "UOM": "384 LOZ/BX", "Price": 36.96, "Source": "INV", "VendNumber": "503888", "OrderQty": 384, "Location": "2B2E"},
		{"MedId": "", "ItemNumber": "107801", "ItemDescription": "LINDANE SHAMPOO 2OZ", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107803", "ItemDescription": "PEN VK TAB 500MG", "UOM": "100 TABS/BO", "Price": 12.58, "Source": "W/S", "VendNumber": "558551", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107806", "ItemDescription": "OATMEAL BATH COLLOID PKT", "UOM": "8 PKTS/BX", "Price": 5.76, "Source": "W/S", "VendNumber": "1115500", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107807", "ItemDescription": "QUINIDINE TAB 200MG", "UOM": "100 TABS/BO", "Price": 22.7, "Source": "W/S", "VendNumber": "309278", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107808", "ItemDescription": "PRIMIDONE TAB 250MG", "UOM": "100 TABS/BO", "Price": 11.25, "Source": "W/S", "VendNumber": "627844", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107810", "ItemDescription": "PEN G SOD VL 5MU", "UOM": "10 VIALS/CT", "Price": 403.16, "Source": "W/S", "VendNumber": "448790", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107813", "ItemDescription": "METHADONE TAB 5MG 100S", "UOM": "100 TABS/BO", "Price": 11.87, "Source": "W/S", "VendNumber": "008363", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107814", "ItemDescription": "GLUCAGON VL 1MG", "UOM": "None", "Price": 97.63, "Source": "INV", "VendNumber": "393525", "OrderQty": 1, "Location": "4C6A"},
		{"MedId": "", "ItemNumber": "107815", "ItemDescription": "FOLIC ACID TAB 1MG", "UOM": "1000 TABS/BO", "Price": 10.7, "Source": "INV", "VendNumber": "107730", "OrderQty": 1000, "Location": "2C4G"},
		{"MedId": "", "ItemNumber": "107816", "ItemDescription": "METHOCARBAMOL TAB 500MG", "UOM": "100 TABS/BO", "Price": 10.74, "Source": "W/S", "VendNumber": "2129732", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107818", "ItemDescription": "PEN VK TAB 250MG", "UOM": "100 TABS/BO", "Price": 6, "Source": "W/S", "VendNumber": "1545219", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107819", "ItemDescription": "QUINIDINE TAB SA 300MG", "UOM": "100 TABS/BO", "Price": 45, "Source": "W/S", "VendNumber": "2246999", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107820", "ItemDescription": "TRIFLUOPERA TAB 2MG U/D", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107821", "ItemDescription": "PROCHLORPER TAB 5MG", "UOM": "100 TABS/BO", "Price": 4.28, "Source": "W/S", "VendNumber": "854422", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107823", "ItemDescription": "SOD CHL TAB 1GM (NOT EC)", "UOM": "1000 TABS/BO", "Price": 91.9, "Source": "W/S", "VendNumber": "629290", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107824", "ItemDescription": "THIORIDAZINE TAB 50MG", "UOM": "100 TABS/BO", "Price": 26.05, "Source": "W/S", "VendNumber": "118349", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107826", "ItemDescription": "DOXYCYCLINE VL 100MG", "UOM": "10 VIALS/CT", "Price": 170.39, "Source": "INV", "VendNumber": "916751", "OrderQty": 10, "Location": "4A2A"},
		{"MedId": "", "ItemNumber": "107827", "ItemDescription": "DOXYCYCLINE CAP 50MG", "UOM": "100 CAPS/BO", "Price": 14.32, "Source": "W/S", "VendNumber": "3277381", "OrderQty": 1, "Location": "999B"},
		{"MedId": "", "ItemNumber": "107829", "ItemDescription": "HYDROMORP TAB 2MG 100S", "UOM": "100 TABS/BO", "Price": 6.35, "Source": "W/S", "VendNumber": "566556", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107831", "ItemDescription": "PROPRAN CAP SA 120MG", "UOM": "100 CAPS/BO", "Price": 196, "Source": "W/S", "VendNumber": "4834909", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107832", "ItemDescription": "LITHIUM LIQ 8MEQ/5ML 16OZ", "UOM": "None", "Price": 10.11, "Source": "W/S", "VendNumber": "1047380", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107833", "ItemDescription": "METHYLPHEN TAB 20MG", "UOM": "100 TABS/BO", "Price": 85, "Source": "W/S", "VendNumber": "4468914", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107834", "ItemDescription": "ALPROSTADIL VL 500MCG", "UOM": "5 VIALS/CT", "Price": 483.69, "Source": "INV", "VendNumber": "297945", "OrderQty": 5, "Location": "10A1C"},
		{"MedId": "", "ItemNumber": "107835", "ItemDescription": "FLUOCINONIDE SOL 0.05% 60ML", "UOM": "None", "Price": 66.19, "Source": "W/S", "VendNumber": "1218080", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107836", "ItemDescription": "DESIPRAMINE TAB 10MG", "UOM": "100 TABS/BO", "Price": 78, "Source": "W/S", "VendNumber": "423107", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107842", "ItemDescription": "DOXEPIN CONC 10MG/ML 4OZ.", "UOM": "None", "Price": 6.28, "Source": "W/S", "VendNumber": "591362", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107844", "ItemDescription": "SILVER SULF 85GM TUBE", "UOM": "None", "Price": 14.02, "Source": "INV", "VendNumber": "3348125", "OrderQty": 1, "Location": "1F5E"},
		{"MedId": "", "ItemNumber": "107848", "ItemDescription": "SUCCIMER CAP 100MG", "UOM": "100 CAPS/BO", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107849", "ItemDescription": "SOTALOL TAB 160MG", "UOM": "100 TABS/BO", "Price": 17.86, "Source": "W/S", "VendNumber": "3626405", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107850", "ItemDescription": "BENAZEPRIL TAB 5MG", "UOM": "100 TABS/BO", "Price": 3.75, "Source": "W/S", "VendNumber": "409906", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107852", "ItemDescription": "METFORMIN TAB 500MG", "UOM": "100 TABS/BO", "Price": 5.03, "Source": "INV", "VendNumber": "506956", "OrderQty": 100, "Location": "2E1G"},
		{"MedId": "", "ItemNumber": "107853", "ItemDescription": "METFORMIN TAB 850MG", "UOM": "100 TABS/BO", "Price": 6.35, "Source": "W/S", "VendNumber": "4910543", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107856", "ItemDescription": "CLOZAPINE TAB 25MG", "UOM": "100 TABS/BO", "Price": 27, "Source": "W/S", "VendNumber": "2921989", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107857", "ItemDescription": "CLOZAPINE TAB 100MG", "UOM": "100 TABS/BO", "Price": 79.08, "Source": "W/S", "VendNumber": "074411", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107861", "ItemDescription": "LAMIVUDINE LIQ 240ML", "UOM": "None", "Price": 76.6, "Source": "W/S", "VendNumber": "383048", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107862", "ItemDescription": "LEUPROLIDE INJ 22.5MG", "UOM": "None", "Price": 373.01, "Source": "W/S", "VendNumber": "567586", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107868", "ItemDescription": "GUAIFENESIN TAB 600MG SA", "UOM": "500 TABS/BO", "Price": 201.25, "Source": "INV", "VendNumber": "742003", "OrderQty": 500, "Location": "2C6L"},
		{"MedId": "", "ItemNumber": "107869", "ItemDescription": "OCTREOTIDE LAR DEP 20MG", "UOM": "None", "Price": 3583.12, "Source": "W/S", "VendNumber": "603720", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107870", "ItemDescription": "DESMOPRES ACE TAB 0.2MG", "UOM": "100 TABS/BO", "Price": 80.58, "Source": "W/S", "VendNumber": "279556", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107872", "ItemDescription": "PNEUMO/DIPHT CONJ VAC VL", "UOM": "10 VIALS/CT", "Price": 1558.05, "Source": "INV", "VendNumber": "153546", "OrderQty": 10, "Location": "10C4C"},
		{"MedId": "", "ItemNumber": "107876", "ItemDescription": "MODAFINIL TAB 200MG", "UOM": "30 TABS/BO", "Price": 43.68, "Source": "W/S", "VendNumber": "344890", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107877", "ItemDescription": "FLUCONAZOLE TAB 50MG", "UOM": "30 TABS/BO", "Price": 21.2199, "Source": "INV", "VendNumber": "285767", "OrderQty": 30, "Location": "2C4A"},
		{"MedId": "", "ItemNumber": "107880", "ItemDescription": "RIBAVIRIN CAP 200MG", "UOM": "50 CAPS/BO", "Price": 78.5, "Source": "W/S", "VendNumber": "3930989", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107881", "ItemDescription": "MORPHINE SR TAB 200MG", "UOM": "100 TABS/BO", "Price": 534.15, "Source": "W/S", "VendNumber": "3500717", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107887", "ItemDescription": "PRAMIPEXOLE TAB 1MG", "UOM": "90 TABS/BO", "Price": 5.42, "Source": "W/S", "VendNumber": "4395083", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107889", "ItemDescription": "IMMUNE GLOB VL 1GM", "UOM": "None", "Price": 66.79, "Source": "W/S", "VendNumber": "954110", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107890", "ItemDescription": "VALGANCICLOVIR TAB 450MG", "UOM": "60 TABS/BO", "Price": 2330.4, "Source": "W/S", "VendNumber": "5040514", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107892", "ItemDescription": "LORAZEPAM VL 2MG/ML 10ML", "UOM": "10 VIALS/CT", "Price": 43.77, "Source": "W/S", "VendNumber": "198028", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107893", "ItemDescription": "OXYCODONE SOL 20MG/ML 30ML", "UOM": "None", "Price": 89.09, "Source": "W/S", "VendNumber": "417402", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107896", "ItemDescription": "ENALAPRIL TAB 20MG", "UOM": "100 TABS/BO", "Price": 57.57, "Source": "W/S", "VendNumber": "522821", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107897", "ItemDescription": "METHYLPHENIDATE TAB 5MG", "UOM": "100 TABS/BO", "Price": 30, "Source": "W/S", "VendNumber": "4468856", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107898", "ItemDescription": "OPIUM/BELLADONNA SUPP 30MG", "UOM": "None", "Price": 230.28, "Source": "W/S", "VendNumber": "2559219", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107899", "ItemDescription": "MORPHINE SUPP 10MG 12'S", "UOM": "12 SUPP/BX", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107900", "ItemDescription": "MORPHINE SR TAB 60MG 100", "UOM": "100 TABS/BO", "Price": 65.77, "Source": "W/S", "VendNumber": "851050", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107901", "ItemDescription": "MORPHINE SR TAB 100MG", "UOM": "100 TABS/BO", "Price": 99.23, "Source": "W/S", "VendNumber": "850457", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107902", "ItemDescription": "MORPHINE ER TAB 15MG", "UOM": "100 TABS/BO", "Price": 49.89, "Source": "W/S", "VendNumber": "135968", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107903", "ItemDescription": "METHYLPHENSR TAB 20MG", "UOM": "100 TABS/BO", "Price": 220, "Source": "W/S", "VendNumber": "3949534", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107904", "ItemDescription": "EMLA CREAM ER PYXIS", "UOM": "5 TUBES/BX", "Price": 35.62, "Source": "INV", "VendNumber": "481919", "OrderQty": 5, "Location": "1D6E"},
		{"MedId": "", "ItemNumber": "107905", "ItemDescription": "TESTOST DEPO VL 1GM/10ML", "UOM": "None", "Price": 34.96, "Source": "W/S", "VendNumber": "1081256", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107906", "ItemDescription": "DILUENT-ORAL CHERRY 500ML", "UOM": "None", "Price": 10.02, "Source": "INV", "VendNumber": "591537", "OrderQty": 1, "Location": "6A5B"},
		{"MedId": "", "ItemNumber": "107908", "ItemDescription": "PSEUDOPHED 30MG/5ML 4OZ", "UOM": "None", "Price": 1.62, "Source": "W/S", "VendNumber": "1331040", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107909", "ItemDescription": "TRI VL FLOR .25MG 50ML", "UOM": "None", "Price": 2.66, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107910", "ItemDescription": "ALBUTEROL LIQ. 16OZ.", "UOM": "None", "Price": 4.26, "Source": "W/S", "VendNumber": "2782506", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107914", "ItemDescription": "SALMETEROL DISKUS 28 DOSE", "UOM": "None", "Price": 189.28, "Source": "W/S", "VendNumber": "592345", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107915", "ItemDescription": "GOSERELIN SYR 3.6MG", "UOM": "None", "Price": 495.92, "Source": "W/S", "VendNumber": "751805", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107916", "ItemDescription": "TUBERSOL 5TU-10 1ML P.P.", "UOM": "None", "Price": 62.96, "Source": "INV", "VendNumber": "535559", "OrderQty": 1, "Location": "10C8D"},
		{"MedId": "", "ItemNumber": "107920", "ItemDescription": "EPOPROSTENOL VL 1.5MG", "UOM": "None", "Price": 56.4, "Source": "W/S", "VendNumber": "0401-01", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107921", "ItemDescription": "BOTTLES AMBER PLAST 2OZ", "UOM": "None", "Price": 39.05, "Source": "W/S", "VendNumber": "958272", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107922", "ItemDescription": "BOTTLES AMBER PLASTIC 4OZ", "UOM": "None", "Price": 55.41, "Source": "W/S", "VendNumber": "1035443", "OrderQty": 1, "Location": "9F1B"},
		{"MedId": "", "ItemNumber": "107923", "ItemDescription": "BOTTLES AMBER PLAST 8OZ", "UOM": "None", "Price": 33.37, "Source": "W/S", "VendNumber": "958355", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107926", "ItemDescription": "VIALS AMBER PLASTIC 8D", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107927", "ItemDescription": "CHEMO PREP MAT 16X22 50'S", "UOM": "None", "Price": 56.15, "Source": "W/S", "VendNumber": "473561", "OrderQty": 1, "Location": "9E4B"},
		{"MedId": "", "ItemNumber": "107929", "ItemDescription": "SINGLE LD TUBE SET 30/CS", "UOM": "None", "Price": 361.136, "Source": "W/S", "VendNumber": "EXCPA01", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107933", "ItemDescription": "ROBOT-ELTRON BARCODE LABL", "UOM": "None", "Price": 25, "Source": "W/S", "VendNumber": "992123", "OrderQty": 1, "Location": "9F2B"},
		{"MedId": "", "ItemNumber": "107934", "ItemDescription": "CADD CASSETTE 100ML", "UOM": "None", "Price": 27.68, "Source": "W/S", "VendNumber": "21-7002-04", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107936", "ItemDescription": "DIAZEPAM VL 50MG/10ML", "UOM": "10 VIALS/CT", "Price": 296.61, "Source": "W/S", "VendNumber": "764249", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107937", "ItemDescription": "ENALAPRIL TAB 5MG", "UOM": "100 TABS/BO", "Price": 33.62, "Source": "INV", "VendNumber": "522425", "OrderQty": 100, "Location": "2C3B"},
		{"MedId": "", "ItemNumber": "107938", "ItemDescription": "MORPHINE SR TAB 30MG 100", "UOM": "100 TABS/BO", "Price": 32.54, "Source": "W/S", "VendNumber": "851042", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107939", "ItemDescription": "ASPIRIN TAB EC 325MG", "UOM": "100 TABS/BO", "Price": 0.99, "Source": "W/S", "VendNumber": "721522", "OrderQty": 1, "Location": "2A3J"},
		{"MedId": "", "ItemNumber": "107940", "ItemDescription": "THIAMINE TAB 100MG", "UOM": "1000 TABS/BO", "Price": 8.3, "Source": "INV", "VendNumber": "691246", "OrderQty": 1000, "Location": "3B2B"},
		{"MedId": "", "ItemNumber": "107941", "ItemDescription": "NIFEDIPINE CAP 20MG", "UOM": "100 CAPS/BO", "Price": 148.02, "Source": "W/S", "VendNumber": "044933", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107942", "ItemDescription": "ENALAPRIL TAB 10MG", "UOM": "100 TABS/BO", "Price": 31.78, "Source": "INV", "VendNumber": "504852", "OrderQty": 100, "Location": "2C3C"},
		{"MedId": "", "ItemNumber": "107943", "ItemDescription": "PYRIDOXINE TAB 50MG", "UOM": "100 TABS/BO", "Price": 1.21, "Source": "INV", "VendNumber": "773168", "OrderQty": 100, "Location": "3A2J"},
		{"MedId": "", "ItemNumber": "107944", "ItemDescription": "CIPRO TAB 250MG", "UOM": "100 TABS/BO", "Price": 10.09, "Source": "INV", "VendNumber": "3995016", "OrderQty": 100, "Location": "2B3E"},
		{"MedId": "", "ItemNumber": "107945", "ItemDescription": "CIPRO TAB 750MG", "UOM": "50 TABS/BO", "Price": 8.74, "Source": "INV", "VendNumber": "393475", "OrderQty": 50, "Location": "2B3G"},
		{"MedId": "", "ItemNumber": "107946", "ItemDescription": "CIPROFLOXACIN TAB 500MG U/D", "UOM": "100 TABS/BO", "Price": 12.46, "Source": "INV", "VendNumber": "4422671", "OrderQty": 100, "Location": "2B3F"},
		{"MedId": "", "ItemNumber": "107948", "ItemDescription": "RABIES IMMUNE GLOB 2ML", "UOM": "None", "Price": 484.58, "Source": "INV", "VendNumber": "268856", "OrderQty": 1, "Location": "10C7A"},
		{"MedId": "", "ItemNumber": "107949", "ItemDescription": "DESIPRAMINE TAB 25MG", "UOM": "100 TABLETS/BO", "Price": 86, "Source": "W/S", "VendNumber": "4507323", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107950", "ItemDescription": "DICLOFENAC TAB 25MG", "UOM": "100 TABS/BO", "Price": 91, "Source": "W/S", "VendNumber": "2379865", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107951", "ItemDescription": "PROPRAN CAP SA 60MG", "UOM": "100 CAPS/BO", "Price": 84.47, "Source": "W/S", "VendNumber": "724500", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107952", "ItemDescription": "VECURONIUM VL 10MG 10ML", "UOM": "10 VIALS/CT", "Price": 46.26, "Source": "INV", "VendNumber": "706432", "OrderQty": 10, "Location": "5F2A"},
		{"MedId": "", "ItemNumber": "107953", "ItemDescription": "NACL INJ 5% 500ML", "UOM": "24 BAGS/CS", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107954", "ItemDescription": "ZINC OXIDE POWDER 5OZ", "UOM": "None", "Price": 3.8, "Source": "INV", "VendNumber": "1022383", "OrderQty": 1, "Location": "1F6H"},
		{"MedId": "", "ItemNumber": "107955", "ItemDescription": "TRIHEXYPHEN TAB 2MG", "UOM": "100 TABS/BO", "Price": 3.98, "Source": "W/S", "VendNumber": "733063", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107958", "ItemDescription": "GLYCERIN USP 16OZ", "UOM": "None", "Price": 12.19, "Source": "W/S", "VendNumber": "1195379", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107960", "ItemDescription": "PHYSOSTIGMINE AMP 2MG 2ML", "UOM": "10 AMPS/CT", "Price": 359.13, "Source": "W/S", "VendNumber": "4335956", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107961", "ItemDescription": "POT CHL TAB EFF 25MEQ", "UOM": "30 TABS/BX", "Price": 32.1, "Source": "W/S", "VendNumber": "2212496", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107962", "ItemDescription": "OPIUM/BELLA SUPP 60MG", "UOM": "12 SUPP/BX", "Price": 280.56, "Source": "W/S", "VendNumber": "2199024", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107965", "ItemDescription": "CLONAZEPAM TAB 1MG", "UOM": "100 TABS/BO", "Price": 5.64, "Source": "W/S", "VendNumber": "033377", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107966", "ItemDescription": "QUINIDINE TAB 300MG", "UOM": "100 TABS/BO", "Price": 32.7, "Source": "W/S", "VendNumber": "309344", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107967", "ItemDescription": "ISOSORBIDE TAB SA 40MG", "UOM": "100 TABS/BO", "Price": 50.99, "Source": "W/S", "VendNumber": "4301560", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107968", "ItemDescription": "METOPROLOL TAB 50MG", "UOM": "1000 TABS/BO", "Price": 16.72, "Source": "INV", "VendNumber": "440115", "OrderQty": 1000, "Location": "2E4A"},
		{"MedId": "", "ItemNumber": "107969", "ItemDescription": "METOPROLOL TAB 100MG", "UOM": "1000 TABS/BO", "Price": 36.77, "Source": "INV", "VendNumber": "4235859", "OrderQty": 1000, "Location": "2E4C"},
		{"MedId": "", "ItemNumber": "107971", "ItemDescription": "PSYLLIUM S/F INSTANT U/D", "UOM": "30 PACKETS/BX", "Price": 12.18, "Source": "INV", "VendNumber": "623785", "OrderQty": 30, "Location": "6C3C"},
		{"MedId": "", "ItemNumber": "107972", "ItemDescription": "DANTROLENE VL 20MG 70ML", "UOM": "6 VIALS/CT", "Price": 388.5, "Source": "W/S", "VendNumber": "182877", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107973", "ItemDescription": "TRIMETHOPRIM TAB 100MG", "UOM": "100 TABS/BO", "Price": 16.55, "Source": "W/S", "VendNumber": "733238", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107974", "ItemDescription": "DANAZOL CAP 200MG", "UOM": "60 CAPS/BO", "Price": 258, "Source": "W/S", "VendNumber": "2502433", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107977", "ItemDescription": "CYPROHEPTA TAB 4MG", "UOM": "100 TABS/BO", "Price": 28, "Source": "W/S", "VendNumber": "4221099", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107978", "ItemDescription": "NITROGLY TD CAP 6.5MG", "UOM": "100 CAPS/BO", "Price": 28.78, "Source": "W/S", "VendNumber": "2103000", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107979", "ItemDescription": "NITROGLY TD CAP 2.5MG", "UOM": "60 CAPS/BO", "Price": 17.73, "Source": "W/S", "VendNumber": "2102978", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107980", "ItemDescription": "DIPYRIDAMOLE TAB 50MG", "UOM": "100 TABS/BO", "Price": 8, "Source": "W/S", "VendNumber": "4140125", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107981", "ItemDescription": "DIPYRIDAMOLE TAB 75MG", "UOM": "100 TABS/BO", "Price": 39, "Source": "W/S", "VendNumber": "1109560", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107982", "ItemDescription": "QUETIAPINE TAB 200MG U/D", "UOM": "100 TABS/BO", "Price": 20.84, "Source": "INV", "VendNumber": "278477", "OrderQty": 100, "Location": "3A3D"},
		{"MedId": "", "ItemNumber": "107983", "ItemDescription": "THIORIDIZINE TAB 25MG", "UOM": "100 TABS/BO", "Price": 21, "Source": "W/S", "VendNumber": "1157171", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107984", "ItemDescription": "ACETAMIN TAB 325MG U/D", "UOM": "100 TABS/BX", "Price": 2, "Source": "INV", "VendNumber": "2162691", "OrderQty": 100, "Location": "6C5A"},
		{"MedId": "", "ItemNumber": "107986", "ItemDescription": "AMPICILLIN CAP 250MG", "UOM": "100 CAPS/BO", "Price": 11.22, "Source": "W/S", "VendNumber": "3699782", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107987", "ItemDescription": "PROBENECID TAB 500 MG", "UOM": "100 TABS/BO", "Price": 47, "Source": "W/S", "VendNumber": "2760908", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "107988", "ItemDescription": "PYRIDOSTIG TAB 60MG", "UOM": "100 TABS/BO", "Price": 96.71, "Source": "INV", "VendNumber": "141162", "OrderQty": 100, "Location": "3A2I"},
		{"MedId": "", "ItemNumber": "107993", "ItemDescription": "MISOPROSTOL TAB 100MCG", "UOM": "60 TABS/BO", "Price": 23.022, "Source": "INV", "VendNumber": "647242", "OrderQty": 60, "Location": "2E5K"},
		{"MedId": "", "ItemNumber": "110402", "ItemDescription": "PAD ADHESIVE TAPE REMOVER", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "111569", "ItemDescription": "SYR 1ML LUER LOCK STERILE", "UOM": "None", "Price": 181.02, "Source": "W/S", "VendNumber": "BF30962812", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "114246", "ItemDescription": "NEEDLE BLD COL MULTI SMPL 21GA", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "117079", "ItemDescription": "SOL IRRIG LR 1000ML  7154", "UOM": "None", "Price": 37.9, "Source": "W/S", "VendNumber": "2F7154", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "117125", "ItemDescription": "SET PUMP ADMIN 100IN", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "119933", "ItemDescription": "CUP FOAM WHITE 6OZ", "UOM": "None", "Price": 14.87, "Source": "W/S", "VendNumber": "12500212", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "127498", "ItemDescription": "SOL D5% MINIBAG + 50ML", "UOM": "None", "Price": 232, "Source": "INV", "VendNumber": "2B0040", "OrderQty": 1, "Location": "6F3A"},
		{"MedId": "", "ItemNumber": "127513", "ItemDescription": "DIBUCAINE OINT 1% 1OZ", "UOM": "None", "Price": 5.69, "Source": "INV", "VendNumber": "261552", "OrderQty": 1, "Location": "1D6D"},
		{"MedId": "", "ItemNumber": "132954", "ItemDescription": "SOL INJ  NACL MINIBAG+ 50ML", "UOM": "80 BAGS/CA", "Price": 232, "Source": "W/S", "VendNumber": "2B0042", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "132955", "ItemDescription": "SOL INJ  NACL MINIBAG+ 100ML", "UOM": "None", "Price": 232, "Source": "W/S", "VendNumber": "2B0043", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "136283", "ItemDescription": "SYR 10ML 20GAX1.0IN NDL LL", "UOM": "None", "Price": 44.55, "Source": "W/S", "VendNumber": "BF309644", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "136790", "ItemDescription": "SYR 5ML 20GAX1.0IN NDL LL", "UOM": "None", "Price": 40.15, "Source": "W/S", "VendNumber": "BF309634", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "140700", "ItemDescription": "DEVICE IV BAG ACCESS", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "142611", "ItemDescription": "CONTAINER IV INTRV  250ML EMPT", "UOM": "None", "Price": 150.66, "Source": "W/S", "VendNumber": "2B8012", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "142639", "ItemDescription": "VANCOMYCIN 1GM/DEXT 200ML FROZ", "UOM": "None", "Price": 61, "Source": "INV", "VendNumber": "2G3552", "OrderQty": 1, "Location": "10B4B"},
		{"MedId": "", "ItemNumber": "145369", "ItemDescription": "SOL IRRIG NACL 0.9%  500ML BTL", "UOM": "None", "Price": 22.32, "Source": "W/S", "VendNumber": "613803", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "145800", "ItemDescription": "SOL IV 20MEQ KCL D5% NACL 0.9%", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "145801", "ItemDescription": "SOL IV 40MEQ KCL D5% NACL 0.9%", "UOM": "None", "Price": 18, "Source": "W/S", "VendNumber": "710909", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "145816", "ItemDescription": "SOL IV 20MEQ KCL NACL 0.9%", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "145818", "ItemDescription": "SOL IV 40MEQ KCL  NACL 0.9%", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146159", "ItemDescription": "SOL IV 20MEQ KCL D5 0.225%", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146166", "ItemDescription": "SOL IV 40MEQ KCL D5 NACL 0.45%", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146167", "ItemDescription": "SOL IV 20MEQ KCL D5% 1000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146173", "ItemDescription": "SOL IV D5% LC LF 250ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146174", "ItemDescription": "SOL IV D5% LC LF 500ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146175", "ItemDescription": "SOL IV D5% LC LF 1000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146176", "ItemDescription": "SOL IV D5%  PF LC 50ML", "UOM": "None", "Price": 68.8, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146177", "ItemDescription": "SOL IV D5%  PF LC 100ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146180", "ItemDescription": "SOL IV D5% NACL 0.225% 1000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146181", "ItemDescription": "SOL IV D5% NACL 0.33% 1000ML", "UOM": "None", "Price": 12.72, "Source": "W/S", "VendNumber": "792509", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146184", "ItemDescription": "SOL IV D5% NACL 0.45% 1000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146186", "ItemDescription": "SOL IV D5% LR 1000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146189", "ItemDescription": "SOL IV D10% 1000ML", "UOM": "None", "Price": 14.16, "Source": "W/S", "VendNumber": "793009", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146194", "ItemDescription": "SOL IV D5% NACL 0.9% 1000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146221", "ItemDescription": "SOL IV NACL 0.9% 250ML BG", "UOM": "None", "Price": 22.32, "Source": "W/S", "VendNumber": "798302", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146222", "ItemDescription": "SOL IV NACL 0.9% 500ML", "UOM": "None", "Price": 22.32, "Source": "W/S", "VendNumber": "798303", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146228", "ItemDescription": "SOL IV NACL 0.9% 1000ML", "UOM": "None", "Price": 11.52, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146231", "ItemDescription": "SOL IV NACL 0.9%  150ML", "UOM": "None", "Price": 30.08, "Source": "W/S", "VendNumber": "798361", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146250", "ItemDescription": "SOL IV NACL 0.9% 50ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146251", "ItemDescription": "SOL IV NACL 0.9% 100ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146256", "ItemDescription": "SOL IV NACL 0.45% 500ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146257", "ItemDescription": "SOL IV NACL 0.45% 1000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146275", "ItemDescription": "SOL INJ H2O ST 1000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "146280", "ItemDescription": "SOL IV 10MEQ KCL D5 NACL 0.45%", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "150297", "ItemDescription": "PKG BLSTR MEDI-CUP", "UOM": "None", "Price": 30.4, "Source": "W/S", "VendNumber": "MD405", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "152989", "ItemDescription": "BATTERY ENERGIZER AA ALK 1.5V", "UOM": "None", "Price": 23.7, "Source": "W/S", "VendNumber": "EN91C", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "152998", "ItemDescription": "BASIN WASH 6QT GRAPHITE", "UOM": "None", "Price": 15.24, "Source": "W/S", "VendNumber": "DYND80347A", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "182061", "ItemDescription": "SOL D 5% 10% LMD 500ML", "UOM": "None", "Price": 201.48, "Source": "INV", "VendNumber": "F000208427", "OrderQty": 1, "Location": "6F1A"},
		{"MedId": "", "ItemNumber": "182777", "ItemDescription": "PAD WITCH HAZEL", "UOM": "None", "Price": 1.75, "Source": "INV", "VendNumber": "601732", "OrderQty": 1, "Location": "9C3A"},
		{"MedId": "", "ItemNumber": "187288", "ItemDescription": "BAG PAPER BROWN #5", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "187723", "ItemDescription": "PAPER 20# 8.5X11 BLUE", "UOM": "None", "Price": 44.9, "Source": "W/S", "VendNumber": "WBM-22202", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "189144", "ItemDescription": "SYR 20ML LUER LOCK", "UOM": "None", "Price": 7.99, "Source": "W/S", "VendNumber": "BF302830", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200042", "ItemDescription": "CON ESTROG TAB 1.25MG", "UOM": "None", "Price": 309, "Source": "W/S", "VendNumber": "3606811", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200044", "ItemDescription": "CYCLOPHOSPHAMIDE CAP 50MG", "UOM": "100 CAPS/BO", "Price": 1115.57, "Source": "W/S", "VendNumber": "4998126", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200253", "ItemDescription": "INSULIN NOVOLOG", "UOM": "None", "Price": 42.05, "Source": "INV", "VendNumber": "104822", "OrderQty": 1, "Location": "10A7D"},
		{"MedId": "", "ItemNumber": "200255", "ItemDescription": "SOL IV NACL 0.9% 100ML", "UOM": "None", "Price": 79.0195, "Source": "W/S", "VendNumber": "2107027", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200345", "ItemDescription": "ADENOSINE VL 90MG 30ML", "UOM": "None", "Price": 62.17, "Source": "INV", "VendNumber": "245629", "OrderQty": 1, "Location": "3C1D"},
		{"MedId": "", "ItemNumber": "200346", "ItemDescription": "HEPATASOL IV 8% 500ML", "UOM": "None", "Price": 328.38, "Source": "W/S", "VendNumber": "2542355", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200347", "ItemDescription": "MAG SUL CRYSTALS 16OZ", "UOM": "None", "Price": 10.96, "Source": "W/S", "VendNumber": "224592", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200348", "ItemDescription": "PEG BOWEL (MIRALAX)  238GM", "UOM": "None", "Price": 4.38, "Source": "INV", "VendNumber": "129953", "OrderQty": 1, "Location": "6C2A"},
		{"MedId": "", "ItemNumber": "200364", "ItemDescription": "FOSPHENYTOIN VL 2ML", "UOM": "25 VIALS/CT", "Price": 38.62, "Source": "W/S", "VendNumber": "5280706", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200368", "ItemDescription": "MINERAL OIL STERILE 25ML", "UOM": "25 VIALS/PK", "Price": 98.08, "Source": "INV", "VendNumber": "005126", "OrderQty": 25, "Location": "5A3D"},
		{"MedId": "", "ItemNumber": "200378", "ItemDescription": "METHADONE VL 200MG/20ML", "UOM": "None", "Price": 363.5, "Source": "W/S", "VendNumber": "4303400", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200384", "ItemDescription": "SERTRALINE CONC 60ML", "UOM": "None", "Price": 43.68, "Source": "INV", "VendNumber": "001343", "OrderQty": 1, "Location": "6C3F"},
		{"MedId": "", "ItemNumber": "200385", "ItemDescription": "RIBN PYXIS PARX CII SAFE SYS", "UOM": "None", "Price": 7, "Source": "W/S", "VendNumber": "115440-01", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200386", "ItemDescription": "LABELS PYXIS PARX CII SAFE SYS", "UOM": "6 ROLLS/CA", "Price": 124.9998, "Source": "W/S", "VendNumber": "113115-01", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200401", "ItemDescription": "METHACHOLINE VL 100MG", "UOM": "6 VIALS/CT", "Price": 276.03, "Source": "W/S", "VendNumber": "738062", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200422", "ItemDescription": "MESALAMINE CAP CR 500MG", "UOM": "120 CAPS/BO", "Price": 601.296, "Source": "INV", "VendNumber": "3612934", "OrderQty": 120, "Location": "2E1F"},
		{"MedId": "", "ItemNumber": "200450", "ItemDescription": "DEXTROSE SYR 25% 10ML", "UOM": "10 SYRINGES/CT", "Price": 68.03, "Source": "W/S", "VendNumber": "2892610", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200460", "ItemDescription": "ATOMOXETINE CAP 10MG 30 CAPS/B", "UOM": "O", "Price": 364.17, "Source": "W/S", "VendNumber": "693147", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200461", "ItemDescription": "ATOMOXETINE CAP 18MG 30 CAPS/B", "UOM": "O", "Price": 346.41, "Source": "W/S", "VendNumber": "3446465", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200462", "ItemDescription": "ATOMOXETINE CAP 25MG 30 CAPS/B", "UOM": "O", "Price": 93.87, "Source": "W/S", "VendNumber": "667461", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200463", "ItemDescription": "ATOMOXETINE CAP 40MG 30 CAPS/B", "UOM": "O", "Price": 341.1, "Source": "W/S", "VendNumber": "3446481", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200466", "ItemDescription": "ACAMPROSATE TAB 333MG", "UOM": "180 TABS/BO", "Price": 235.53, "Source": "W/S", "VendNumber": "240965", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200467", "ItemDescription": "SALINE NASAL GEL 0.5OZ", "UOM": "None", "Price": 2.83, "Source": "INV", "VendNumber": "175182", "OrderQty": 1, "Location": "1D2G"},
		{"MedId": "", "ItemNumber": "200491", "ItemDescription": "ENTACAPONE TAB 200MG", "UOM": "100 TABS/BO", "Price": 140.4, "Source": "INV", "VendNumber": "217873", "OrderQty": 100, "Location": "2C3D"},
		{"MedId": "", "ItemNumber": "200492", "ItemDescription": "EMTRICITABINE CAP 200MG", "UOM": "30 CAPS/BO", "Price": 475.2, "Source": "W/S", "VendNumber": "3505120", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200519", "ItemDescription": "NEEDLE HYPO BVL 16GAX1.0IN", "UOM": "None", "Price": 51.73, "Source": "W/S", "VendNumber": "BF305197", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200521", "ItemDescription": "DIPHENHYD ELIX 25MG 10ML", "UOM": "100 CUPS/BX", "Price": 140.49, "Source": "INV", "VendNumber": "589903", "OrderQty": 100, "Location": "6A6A"},
		{"MedId": "", "ItemNumber": "200522", "ItemDescription": "MENINGOCOC. VAC(MENACTRA)", "UOM": "5 VIALS/CT", "Price": 505.3, "Source": "INV", "VendNumber": "946881", "OrderQty": 5, "Location": "10C1B"},
		{"MedId": "", "ItemNumber": "200523", "ItemDescription": "ACETYLCYS SOL 10% 4ML", "UOM": "25 VIALS/CT", "Price": 121.35, "Source": "INV", "VendNumber": "333260", "OrderQty": 25, "Location": "1B3A"},
		{"MedId": "", "ItemNumber": "200534", "ItemDescription": "EPIRUBICIN SDV 50MG", "UOM": "None", "Price": 28.01, "Source": "W/S", "VendNumber": "2911196", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200535", "ItemDescription": "CINACALCET TAB 30MG", "UOM": "30 TABS/BO", "Price": 786.54, "Source": "INV", "VendNumber": "979967", "OrderQty": 30, "Location": "2B3D"},
		{"MedId": "", "ItemNumber": "200540", "ItemDescription": "PRIMAQUINE TAB 26.3MG", "UOM": "100 TABS/BO", "Price": 157.16, "Source": "W/S", "VendNumber": "1259209", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200543", "ItemDescription": "ARGATROGAN VL 250MG 2.5ML", "UOM": "None", "Price": 223.21, "Source": "INV", "VendNumber": "412619", "OrderQty": 1, "Location": "3D1A"},
		{"MedId": "", "ItemNumber": "200548", "ItemDescription": "DAKINS SOL 1/4 16OZ", "UOM": "None", "Price": 6.96, "Source": "W/S", "VendNumber": "178061", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200549", "ItemDescription": "DAKINS SOL 1/2% 16OZ", "UOM": "None", "Price": 6.54, "Source": "W/S", "VendNumber": "178057", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200779", "ItemDescription": "EPIPEN AUTOINJECTOR", "UOM": "2 EACH/BX", "Price": 262.49, "Source": "W/S", "VendNumber": "602698", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200780", "ItemDescription": "EPIPEN JR AUTOINJECTOR", "UOM": "2 SYRINGES/CT", "Price": 262.49, "Source": "W/S", "VendNumber": "602678", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200781", "ItemDescription": "METHADONE CONC 1000ML", "UOM": "None", "Price": 49.71, "Source": "W/S", "VendNumber": "912089", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200783", "ItemDescription": "CAP ADDITIVE F/VIAFLEX CNT NS", "UOM": "3 BOXES/CS", "Price": 259.49, "Source": "W/S", "VendNumber": "2B8066", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200789", "ItemDescription": "AMPICILLIN VL 2GM", "UOM": "10 VIALS/CT", "Price": 32.7, "Source": "INV", "VendNumber": "199500", "OrderQty": 10, "Location": "3C5B"},
		{"MedId": "", "ItemNumber": "200857", "ItemDescription": "ACELLULAR DPT (ADACEL)", "UOM": "10 VIALS/CT", "Price": 319.36, "Source": "INV", "VendNumber": "440887", "OrderQty": 10, "Location": "10A1A"},
		{"MedId": "", "ItemNumber": "200871", "ItemDescription": "CONTRAST GASTROGRAFIN 24X30ML", "UOM": "None", "Price": 182.28, "Source": "W/S", "VendNumber": "3658358", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200881", "ItemDescription": "SACCHAROMYCES CAP 250MG", "UOM": "50 CAPS/BO", "Price": 31.19, "Source": "INV", "VendNumber": "898611", "OrderQty": 50, "Location": "3A4I"},
		{"MedId": "", "ItemNumber": "200882", "ItemDescription": "FENTANYL PATCH 12MCG", "UOM": "5 PATCH/BX", "Price": 41.75, "Source": "W/S", "VendNumber": "416786", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200883", "ItemDescription": "TACROLIMUS CAP 0.5MG", "UOM": "100 CAPS/BO", "Price": 105.6, "Source": "W/S", "VendNumber": "4356820", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200894", "ItemDescription": "SOL SUCROSE NAT SWEET-EASE", "UOM": "None", "Price": 105.02, "Source": "W/S", "VendNumber": "99044", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200899", "ItemDescription": "MESALAMINE SUPP 1GM", "UOM": "30 SUPP/BX", "Price": 829.5, "Source": "W/S", "VendNumber": "3640638", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200902", "ItemDescription": "BUPROPION TAB SR 100MG", "UOM": "100 TAB/BO", "Price": 35.35, "Source": "W/S", "VendNumber": "387908", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200904", "ItemDescription": "INSULIN NOVOLOG 70/30", "UOM": "None", "Price": 42.05, "Source": "INV", "VendNumber": "707327", "OrderQty": 1, "Location": "10A7E"},
		{"MedId": "", "ItemNumber": "200906", "ItemDescription": "TIGECYCLINE VL 50MG", "UOM": "10 VIALS/CT", "Price": 1197.69, "Source": "INV", "VendNumber": "075630", "OrderQty": 10, "Location": "5E4D"},
		{"MedId": "", "ItemNumber": "200907", "ItemDescription": "ATAZANAVIR CAP 150MG", "UOM": "60 CAPS/BO", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200913", "ItemDescription": "HEPATITIS B PEDI (NYS PGM)", "UOM": "GLAXOSMITH BRAND ONLY", "Price": 0, "Source": "INV", "VendNumber": "0820-11", "OrderQty": 1, "Location": "11D5A"},
		{"MedId": "", "ItemNumber": "200914", "ItemDescription": "ADAPT FOR FILL SYRG", "UOM": "None", "Price": 162.5, "Source": "W/S", "VendNumber": "SA250", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "200944", "ItemDescription": "MIRTAZAPINE OD TAB 15MG", "UOM": "30 TABS/BO", "Price": 17.481, "Source": "INV", "VendNumber": "656948", "OrderQty": 30, "Location": "2E5G"},
		{"MedId": "", "ItemNumber": "200945", "ItemDescription": "MIRTAZAPINE OD TAB 30MG U/D", "UOM": "30 TABS/BO", "Price": 18.65, "Source": "W/S", "VendNumber": "606273", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "201027", "ItemDescription": "HYOSCYAMINE TABSL 0.125MG", "UOM": "100TABS/BO", "Price": 31.06, "Source": "INV", "VendNumber": "4584884", "OrderQty": 100, "Location": "2D1K"},
		{"MedId": "", "ItemNumber": "201028", "ItemDescription": "LITHIUM TAB ER 300MG", "UOM": "100TABS/BO", "Price": 17, "Source": "W/S", "VendNumber": "3623303", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "201029", "ItemDescription": "LITHIUM TAB ER 450MG", "UOM": "100TABS/BO", "Price": 20, "Source": "W/S", "VendNumber": "3545985", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "201030", "ItemDescription": "CALCITONIN NASAL SPR-RDNA", "UOM": "None", "Price": 16.25, "Source": "INV", "VendNumber": "297051", "OrderQty": 1, "Location": "10A2B"},
		{"MedId": "", "ItemNumber": "201031", "ItemDescription": "METRONIDAZ TOP GEL 0.75%", "UOM": "None", "Price": 63.34, "Source": "INV", "VendNumber": "618052", "OrderQty": 1, "Location": "1E6C"},
		{"MedId": "", "ItemNumber": "201038", "ItemDescription": "HYALURONIDASE VL 150U", "UOM": "4 VIALS/CT", "Price": 191.72, "Source": "W/S", "VendNumber": "5103106", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "201040", "ItemDescription": "LBL SYRINGE FLAG", "UOM": "None", "Price": 34.065, "Source": "W/S", "VendNumber": "6026", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "201178", "ItemDescription": "MAG HYDROX PLUS 30ML", "UOM": "10 CUPS/SLEEVE", "Price": 132.54, "Source": "INV", "VendNumber": "947477", "OrderQty": 10, "Location": "7F4A"},
		{"MedId": "", "ItemNumber": "201179", "ItemDescription": "MILK OF MAG 30ML", "UOM": "10 CUPS/SLEEVE", "Price": 127.79, "Source": "INV", "VendNumber": "590190", "OrderQty": 10, "Location": "8B4A"},
		{"MedId": "", "ItemNumber": "201180", "ItemDescription": "BENZTROPINE AMP 2MG/2ML", "UOM": "5 AMPS/CT", "Price": 163.4, "Source": "W/S", "VendNumber": "4266953", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "201313", "ItemDescription": "RITON/LOPIN CAP 50/200", "UOM": "120 TABS/BO", "Price": 861.516, "Source": "W/S", "VendNumber": "3695178", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "201314", "ItemDescription": "IBUPROFEN LIQ 5ML U/D", "UOM": "50/CA", "Price": 30.23, "Source": "INV", "VendNumber": "922455", "OrderQty": 50, "Location": "6B2C"},
		{"MedId": "", "ItemNumber": "201315", "ItemDescription": "GUAIFENESIN DM 10ML U/D", "UOM": "10 CUPS/SLEEVE", "Price": 56.26, "Source": "INV", "VendNumber": "174995", "OrderQty": 10, "Location": "6B2A"},
		{"MedId": "", "ItemNumber": "201317", "ItemDescription": "FLUPHENAZINE TAB 2.5MG", "UOM": "100 TABS/BO", "Price": 40.56, "Source": "W/S", "VendNumber": "1226554", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "201320", "ItemDescription": "FILTER EPIDRL 0.2U AIR ELIM", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "201321", "ItemDescription": "ACETAMIN EL 650MG 20.3ML", "UOM": "100 CUPS/CA", "Price": 123.04, "Source": "INV", "VendNumber": "616813", "OrderQty": 100, "Location": "6A1B"},
		{"MedId": "", "ItemNumber": "201323", "ItemDescription": "CISPLATIN VL 100MG", "UOM": "None", "Price": 16.65, "Source": "INV", "VendNumber": "2895852", "OrderQty": 1, "Location": "9D2A"},
		{"MedId": "", "ItemNumber": "205001", "ItemDescription": "CEFPODOXIME TAB 100MG", "UOM": "20 TABS/BO", "Price": 81.68, "Source": "W/S", "VendNumber": "415195", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "205002", "ItemDescription": "CEFPODOXIME TAB 200MG", "UOM": "20 TABS/BO", "Price": 99.25, "Source": "INV", "VendNumber": "415149", "OrderQty": 20, "Location": "2B2A"},
		{"MedId": "", "ItemNumber": "205004", "ItemDescription": "COLESEVELAM TAB 625MG", "UOM": "180 TABS/BO", "Price": 547.08, "Source": "INV", "VendNumber": "399279", "OrderQty": 180, "Location": "2B5E"},
		{"MedId": "", "ItemNumber": "205009", "ItemDescription": "PREGABALIN CAP 25MG", "UOM": "90 CAPS/BO", "Price": 529.299, "Source": "W/S", "VendNumber": "3682994", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "205010", "ItemDescription": "PREGABALIN CAP 100MG", "UOM": "90 CAPS/BO", "Price": 529.299, "Source": "W/S", "VendNumber": "3683026", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "205018", "ItemDescription": "TRUVADA TAB 200/300", "UOM": "30 TABS/BO", "Price": 1443.78, "Source": "W/S", "VendNumber": "572812", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "205032", "ItemDescription": "BORTEZOMIB VL 3.5MG", "UOM": "None", "Price": 1603, "Source": "INV", "VendNumber": "781878", "OrderQty": 1, "Location": "9D1C"},
		{"MedId": "", "ItemNumber": "205064", "ItemDescription": "AMPHOTER VL LIPO 50MG", "UOM": "None", "Price": 46.08, "Source": "W/S", "VendNumber": "2613164", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "205069", "ItemDescription": "LBL RX PFW 2.4 X 3", "UOM": "12 ROLLS/CA", "Price": 98.52, "Source": "W/S", "VendNumber": "03-02-1521", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "205070", "ItemDescription": "QUETIAPINE TAB 50MG", "UOM": "100 TABS/BO", "Price": 6.77, "Source": "INV", "VendNumber": "166811", "OrderQty": 100, "Location": "3A3B"},
		{"MedId": "", "ItemNumber": "205072", "ItemDescription": "SAQUINAVIR TAB 500MG", "UOM": "120 TABS/BO", "Price": 1094.72, "Source": "W/S", "VendNumber": "3642493", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "205074", "ItemDescription": "SYR HEP FLUSH 10U/5ML", "UOM": "None", "Price": 30.02, "Source": "INV", "VendNumber": "078175", "OrderQty": 1, "Location": "9B5A"},
		{"MedId": "", "ItemNumber": "205706", "ItemDescription": "CISPLATIN VL 200MG", "UOM": "None", "Price": 40.5, "Source": "INV", "VendNumber": "63323-0103-64", "OrderQty": 1, "Location": "9D3A"},
		{"MedId": "", "ItemNumber": "205746", "ItemDescription": "SYR ORAL 1ML NARC", "UOM": "None", "Price": 690, "Source": "W/S", "VendNumber": "H93884201", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "205748", "ItemDescription": "METHYLCELLULOSE PWD 16OZ", "UOM": "None", "Price": 4.93, "Source": "INV", "VendNumber": "012144", "OrderQty": 1, "Location": "6B5C"},
		{"MedId": "", "ItemNumber": "205923", "ItemDescription": "TALC STRL VL", "UOM": "10 VIALS/CT", "Price": 1030, "Source": "W/S", "VendNumber": "1690", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "205925", "ItemDescription": "SEALS PULL YEL", "UOM": "None", "Price": 13.42, "Source": "W/S", "VendNumber": "RDPR24", "OrderQty": 1, "Location": "9F5B"},
		{"MedId": "", "ItemNumber": "205941", "ItemDescription": "32 ATOMZR", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "205984", "ItemDescription": "PREGABALIN CAP 50MG", "UOM": "90 CAPS/BO", "Price": 529.299, "Source": "W/S", "VendNumber": "3683000", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "205987", "ItemDescription": "PEMETREXED VL 500MG", "UOM": "None", "Price": 3009.14, "Source": "W/S", "VendNumber": "961401", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "206024", "ItemDescription": "INSULIN DETEMIR VL 100U", "UOM": "None", "Price": 91.55, "Source": "INV", "VendNumber": "443832", "OrderQty": 1, "Location": "10A8C"},
		{"MedId": "", "ItemNumber": "206026", "ItemDescription": "RANOLAZINE TAB 500MG", "UOM": "60 TABS/BO", "Price": 328.67, "Source": "W/S", "VendNumber": "167502", "OrderQty": 1, "Location": "3A3J"},
		{"MedId": "", "ItemNumber": "206027", "ItemDescription": "FONDAPARINUX SYR 2.5MG", "UOM": "10 SYR/CT", "Price": 93.4, "Source": "W/S", "VendNumber": "145292", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "206031", "ItemDescription": "DAKINS SOL 1/8% 16OZ", "UOM": "None", "Price": 6.96, "Source": "INV", "VendNumber": "201079", "OrderQty": 1, "Location": "1D6C"},
		{"MedId": "", "ItemNumber": "206084", "ItemDescription": "MAG SUL 4GM/WATER 100ML", "UOM": "24 EA/CT", "Price": 126.66, "Source": "INV", "VendNumber": "546580", "OrderQty": 24, "Location": "7F5A"},
		{"MedId": "", "ItemNumber": "206124", "ItemDescription": "PACLITAXEL PR-BD VL 100MG", "UOM": "None", "Price": 1138, "Source": "W/S", "VendNumber": "529805", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "206176", "ItemDescription": "DOXERCALCIFEROL CAP .5MCG", "UOM": "50 CAPS/BO", "Price": 523, "Source": "INV", "VendNumber": "4945671", "OrderQty": 50, "Location": "2C2K"},
		{"MedId": "", "ItemNumber": "206179", "ItemDescription": "ANTITHROM III VL +500IU", "UOM": "None", "Price": 2082.92, "Source": "INV", "VendNumber": "39819", "OrderQty": 1, "Location": "10A1E"},
		{"MedId": "", "ItemNumber": "207707", "ItemDescription": "NICARDIPINE CAP 30MG", "UOM": "90 CAPS/BO", "Price": 51.3, "Source": "W/S", "VendNumber": "2487973", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "207758", "ItemDescription": "CYCLOMYDRIL OPHTH 2ML", "UOM": "None", "Price": 24.06, "Source": "INV", "VendNumber": "618249", "OrderQty": 1, "Location": "1A3F"},
		{"MedId": "", "ItemNumber": "207911", "ItemDescription": "VARENICLINE TAB 0.5MG", "UOM": "56 TABS/BO", "Price": 337.7898, "Source": "W/S", "VendNumber": "009276", "OrderQty": 1, "Location": "3B3G"},
		{"MedId": "", "ItemNumber": "207912", "ItemDescription": "VARENICLINE TAB 1MG", "UOM": "56 TABS/BO", "Price": 337.68, "Source": "W/S", "VendNumber": "009389", "OrderQty": 1, "Location": "3B3G"},
		{"MedId": "", "ItemNumber": "207913", "ItemDescription": "IBUPROFEN LYSINE VL 20MG", "UOM": "3 VIALS/CT", "Price": 912.58, "Source": "INV", "VendNumber": "542423", "OrderQty": 3, "Location": "4D4A"},
		{"MedId": "", "ItemNumber": "207914", "ItemDescription": "CYTOGAM VL 2500MG 50ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "207929", "ItemDescription": "SET ADMIN W/BAG SPIKE 108IN", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "207930", "ItemDescription": "SET ADMIN W/BAG SPIKE 112IN", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "207951", "ItemDescription": "ONDANSETRON VL 40MG 20ML", "UOM": "None", "Price": 1.02, "Source": "INV", "VendNumber": "220723", "OrderQty": 1, "Location": "5B6A"},
		{"MedId": "", "ItemNumber": "207997", "ItemDescription": "CLOFARABINE VL 20MG", "UOM": "None", "Price": 2433.38, "Source": "W/S", "VendNumber": "3914454", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208055", "ItemDescription": "TEMOZOLOMIDE CAP 5MG", "UOM": "5 CAPS/BO", "Price": 53.5, "Source": "W/S", "VendNumber": "4907432", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208144", "ItemDescription": "SITAGLIPTIN TAB 25MG", "UOM": "30 TABS/BO", "Price": 311.421, "Source": "INV", "VendNumber": "787174", "OrderQty": 30, "Location": "3A6A"},
		{"MedId": "", "ItemNumber": "208145", "ItemDescription": "SITAGLIPTIN TAB 50MG", "UOM": "30 TABS/BO", "Price": 311.421, "Source": "W/S", "VendNumber": "788644", "OrderQty": 1, "Location": "3A6B"},
		{"MedId": "", "ItemNumber": "208146", "ItemDescription": "SITAGLIPTIN TAB 100MG", "UOM": "90 TABS/BO", "Price": 934.263, "Source": "INV", "VendNumber": "798292", "OrderQty": 90, "Location": "3A6C"},
		{"MedId": "", "ItemNumber": "208148", "ItemDescription": "PRAMIPEXOLE TAB .125MG", "UOM": "90 TABS/BO", "Price": 5.013, "Source": "W/S", "VendNumber": "4394904", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208222", "ItemDescription": "MMR+VARICELLA  PF VL", "UOM": "10 VIALS/CT", "Price": 1911.13, "Source": "INV", "VendNumber": "424059", "OrderQty": 10, "Location": "10B1C"},
		{"MedId": "", "ItemNumber": "208282", "ItemDescription": "NATEGLINIDE TAB 60MG", "UOM": "100 TABS/BO", "Price": 50.52, "Source": "INV", "VendNumber": "020131", "OrderQty": 100, "Location": "2E6H"},
		{"MedId": "", "ItemNumber": "208284", "ItemDescription": "LEVOTHYROX TAB 137MCG 90 TABS/", "UOM": "BO", "Price": 15.849, "Source": "INV", "VendNumber": "109850", "OrderQty": 1, "Location": "2D5H"},
		{"MedId": "", "ItemNumber": "208523", "ItemDescription": "ARIPIPRAZOLE TAB 2MG", "UOM": "30 TABS/BO", "Price": 27.62, "Source": "INV", "VendNumber": "393108", "OrderQty": 30, "Location": "2A3C"},
		{"MedId": "", "ItemNumber": "208524", "ItemDescription": "ARIPIPRAZOLE TAB 5MG", "UOM": "30 TABS/BO", "Price": 32.3, "Source": "INV", "VendNumber": "393116", "OrderQty": 30, "Location": "2A3D"},
		{"MedId": "", "ItemNumber": "208525", "ItemDescription": "ARIPIPRAZOLE LIQ 150ML", "UOM": "None", "Price": 367.57, "Source": "W/S", "VendNumber": "391037", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208527", "ItemDescription": "BALSALAZIDE CAP 750MG", "UOM": "280CAPS/BO", "Price": 90.7676, "Source": "W/S", "VendNumber": "772552", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208528", "ItemDescription": "OXCARBAZEPINE TAB 150MG", "UOM": "100TABS/BO", "Price": 18, "Source": "W/S", "VendNumber": "5045752", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208529", "ItemDescription": "CONIVAPTAN BAG 20MG/D5W 100ML", "UOM": "None", "Price": 533.69, "Source": "W/S", "VendNumber": "5087804", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208619", "ItemDescription": "LABEL DOT MATRIX FL PNK", "UOM": "None", "Price": 10.55, "Source": "W/S", "VendNumber": "LPFPP01", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208620", "ItemDescription": "LABEL DOT MATRIX FL YEL", "UOM": "None", "Price": 10.55, "Source": "W/S", "VendNumber": "LPFYP02", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208621", "ItemDescription": "LABEL DOT MATRIX FL GRN", "UOM": "None", "Price": 9.97, "Source": "W/S", "VendNumber": "LPFGP02", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208634", "ItemDescription": "SOAP LIQ ANBAC CAL STAT+ 33OZ", "UOM": "None", "Price": 62.38, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208661", "ItemDescription": "LUBIPROSTONE CAP 24MCG", "UOM": "60 CAPS/BO", "Price": 322.44, "Source": "INV", "VendNumber": "761357", "OrderQty": 60, "Location": "2D6I"},
		{"MedId": "", "ItemNumber": "208664", "ItemDescription": "MONTELUKAST PKT 4MG", "UOM": "30 PKT/BX", "Price": 6.07, "Source": "W/S", "VendNumber": "4728549", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208665", "ItemDescription": "FOSAMPRENAVIR TAB 700MG", "UOM": "60 TABS/BO", "Price": 1001.4, "Source": "W/S", "VendNumber": "4359998", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208667", "ItemDescription": "ATAZANAVIR CAP 300MG", "UOM": "30 CAPS/BO", "Price": 1280.55, "Source": "W/S", "VendNumber": "3880382", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208668", "ItemDescription": "PARICALCITOL CAP 1MG", "UOM": "30 CAPS/BO", "Price": 90.21, "Source": "INV", "VendNumber": "326843", "OrderQty": 30, "Location": "2F4C"},
		{"MedId": "", "ItemNumber": "208673", "ItemDescription": "SET VALVE EXACTA-MIX INLET 24", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208674", "ItemDescription": "INLET NVNT HI VOL F/BAG OR BTL", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208675", "ItemDescription": "INLET VNT HI VOL F/NVNT BTL", "UOM": "None", "Price": 123.5, "Source": "W/S", "VendNumber": "H938174", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208676", "ItemDescription": "INLET VNT MICRO VOL F/SM VIALS", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208677", "ItemDescription": "INLET PVC F/USE W/SYRINGES", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208680", "ItemDescription": "BAG CMPD EVA TPN 500ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208681", "ItemDescription": "BAG CMPD EVA TPN 1000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208682", "ItemDescription": "BAG CMPD EVA TPN 2000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208685", "ItemDescription": "MORPHINE SOL 20MG/ML 15ML", "UOM": "None", "Price": 3.11, "Source": "W/S", "VendNumber": "1962968", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208846", "ItemDescription": "ONDANSETRON VL 4MG 2ML", "UOM": "25 VIALS/CT", "Price": 7.14, "Source": "INV", "VendNumber": "636415", "OrderQty": 25, "Location": "5B3A"},
		{"MedId": "", "ItemNumber": "208964", "ItemDescription": "PACLITAXEL VL 300MG 50ML", "UOM": "None", "Price": 40.04, "Source": "INV", "VendNumber": "029603", "OrderQty": 1, "Location": "9E3A"},
		{"MedId": "", "ItemNumber": "208965", "ItemDescription": "LEUPROLIDE INJ 11.25MG", "UOM": "None", "Price": 3137.84, "Source": "W/S", "VendNumber": "4227872", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "208973", "ItemDescription": "SOD CHL VL 4MEQ/ML 100ML", "UOM": "25 VIALS/CT", "Price": 66.55, "Source": "INV", "VendNumber": "170464", "OrderQty": 25, "Location": "9B1A"},
		{"MedId": "", "ItemNumber": "208974", "ItemDescription": "INFUVITE VL 100ML", "UOM": "None", "Price": 50.39, "Source": "INV", "VendNumber": "201277", "OrderQty": 1, "Location": "11D6B"},
		{"MedId": "", "ItemNumber": "208981", "ItemDescription": "ONDANSETRON TAB 4MG", "UOM": "30 TABS/BO", "Price": 3.5799, "Source": "INV", "VendNumber": "138615", "OrderQty": 30, "Location": "2F3D"},
		{"MedId": "", "ItemNumber": "209017", "ItemDescription": "SYR SALINE FLUSH 10ML", "UOM": "None", "Price": 114.95, "Source": "W/S", "VendNumber": "EMZE010001", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "209045", "ItemDescription": "LBL BAXA COMPOUNDER 4X6", "UOM": "None", "Price": 108, "Source": "W/S", "VendNumber": "S-6802", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "209047", "ItemDescription": "ONDANSETRON OD TAB 4MG", "UOM": "30 TABS/BO", "Price": 8.32, "Source": "INV", "VendNumber": "821017", "OrderQty": 30, "Location": "2F3C"},
		{"MedId": "", "ItemNumber": "209226", "ItemDescription": "CARVEDILOL TAB 25MG", "UOM": "100 TABS/BO", "Price": 8.57, "Source": "INV", "VendNumber": "373213", "OrderQty": 100, "Location": "2B1H"},
		{"MedId": "", "ItemNumber": "209367", "ItemDescription": "BANDAID STRP CLOTH 3/4X3IN", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "209395", "ItemDescription": "LEVETIRACETAM LIQ 500ML", "UOM": "None", "Price": 14.73, "Source": "INV", "VendNumber": "323050", "OrderQty": 1, "Location": "6B4A"},
		{"MedId": "", "ItemNumber": "209426", "ItemDescription": "LABEL DOT MATRIX 3.5X15/16 WHT", "UOM": "None", "Price": 13.83, "Source": "W/S", "VendNumber": "GDLT611", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "209427", "ItemDescription": "PROCARDIA (GEQ) TAB XL 30MG", "UOM": "100 TABS/BO", "Price": 69.08, "Source": "INV", "VendNumber": "179416", "OrderQty": 100, "Location": "3A2A"},
		{"MedId": "", "ItemNumber": "209696", "ItemDescription": "POSACONAZOLE LIQ 105ML", "UOM": "None", "Price": 899.2, "Source": "W/S", "VendNumber": "3780798", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "209771", "ItemDescription": "IXABEPILONE KIT 15MG", "UOM": "None", "Price": 1123.84, "Source": "W/S", "VendNumber": "4526711", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "210186", "ItemDescription": "HAND ANTISEP CALSTAT+ PMP 15OZ", "UOM": "None", "Price": 76.73, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "210189", "ItemDescription": "SYR ORAL 10ML", "UOM": "500 SYR/CA", "Price": 155, "Source": "W/S", "VendNumber": "H9388510", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "210195", "ItemDescription": "MOMETASONE INH (14 DOSE)", "UOM": "None", "Price": 51.09, "Source": "INV", "VendNumber": "239566", "OrderQty": 1, "Location": "1D1C"},
		{"MedId": "", "ItemNumber": "210452", "ItemDescription": "CEFEPIME VL 2GM", "UOM": "10 VIALS/CT", "Price": 67.88, "Source": "INV", "VendNumber": "252686", "OrderQty": 10, "Location": "3E5A"},
		{"MedId": "", "ItemNumber": "210859", "ItemDescription": "LABEL DOT MATRIX 3.5X7/16 WHT", "UOM": "10K/CA", "Price": 24.9, "Source": "W/S", "VendNumber": "GDLT41", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "210971", "ItemDescription": "ESMOLOL BAG 2500MG/250ML", "UOM": "10BAGS/CT", "Price": 3326.01, "Source": "INV", "VendNumber": "314062", "OrderQty": 10, "Location": "7B2A"},
		{"MedId": "", "ItemNumber": "211011", "ItemDescription": "FONDAPARINUX SYR 5MG", "UOM": "10 SYR/CT", "Price": 382.2, "Source": "W/S", "VendNumber": "4550349", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211012", "ItemDescription": "FONDAPARINUX SYR 7.5MG", "UOM": "2 SYR/CT", "Price": 60.37, "Source": "W/S", "VendNumber": "4501326", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211013", "ItemDescription": "FONDAPARINUX SYR 10MG", "UOM": "10 SYR/CT", "Price": 268.84, "Source": "W/S", "VendNumber": "145342", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211066", "ItemDescription": "CAP TAMPER EVIDENT", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211110", "ItemDescription": "LBL LSR BLU DOT", "UOM": "None", "Price": 31.2, "Source": "W/S", "VendNumber": "MD240", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211281", "ItemDescription": "NEEDLE HYPO SAFE EDGE 19GAX1", "UOM": "None", "Price": 159.78, "Source": "W/S", "VendNumber": "SM401910", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211285", "ItemDescription": "NEEDLE HYPO SAFE EDGE 25GAX5/8", "UOM": "None", "Price": 160.86, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211289", "ItemDescription": "INDOMETHACIN SUPP 50MG", "UOM": "30 SUPPS/BX", "Price": 767.889, "Source": "INV", "VendNumber": "166702", "OrderQty": 30, "Location": "10A7C"},
		{"MedId": "", "ItemNumber": "211297", "ItemDescription": "CYANOKIT INJ 5GM", "UOM": "None", "Price": 711.04, "Source": "W/S", "VendNumber": "4522108", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211336", "ItemDescription": "PAMIDRONATE VL 90MG", "UOM": "None", "Price": 27.36, "Source": "INV", "VendNumber": "332114", "OrderQty": 1, "Location": "5B6E"},
		{"MedId": "", "ItemNumber": "211337", "ItemDescription": "TREPROSTINIL VL 20MG", "UOM": "None", "Price": 1473.75, "Source": "W/S", "VendNumber": "98260", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211344", "ItemDescription": "ZONISAMIDE CAP 100MG", "UOM": "100 CAPS/BO", "Price": 41.49, "Source": "W/S", "VendNumber": "3706744", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211369", "ItemDescription": "OXCARBAZEPINE LIQ 250ML", "UOM": "None", "Price": 85.76, "Source": "W/S", "VendNumber": "196752", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211370", "ItemDescription": "ZOLEDRONIC ACID VL 4MG", "UOM": "None", "Price": 43.75, "Source": "INV", "VendNumber": "214411", "OrderQty": 1, "Location": "5F6C"},
		{"MedId": "", "ItemNumber": "211449", "ItemDescription": "FAMOTIDINE VL 200MG 20ML", "UOM": "VI/CT10", "Price": 35.92, "Source": "INV", "VendNumber": "076711", "OrderQty": 10, "Location": "10A5A"},
		{"MedId": "", "ItemNumber": "211450", "ItemDescription": "DOXORUB LIPO VL 20MG 10ML", "UOM": "None", "Price": 788.22, "Source": "W/S", "VendNumber": "107918", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211451", "ItemDescription": "DOXORUB LIPO VL 50MG 25ML", "UOM": "None", "Price": 1970.54, "Source": "W/S", "VendNumber": "097422", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211635", "ItemDescription": "IODINE STRONG (ORAL) 5% 15ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211731", "ItemDescription": "LEVOTHYROX TAB 175MCG 90 TABS/", "UOM": "BO", "Price": 93.08, "Source": "W/S", "VendNumber": "109900", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211732", "ItemDescription": "ALISKIREN TAB 300MG", "UOM": "30 TABS/BO", "Price": 194.6, "Source": "W/S", "VendNumber": "3948189", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211733", "ItemDescription": "ALISKIREN TAB 150MG", "UOM": "30 TABS/BO", "Price": 154.25, "Source": "W/S", "VendNumber": "3948171", "OrderQty": 1, "Location": "2A2A"},
		{"MedId": "", "ItemNumber": "211737", "ItemDescription": "ROPINIROLE TAB 0.5MG", "UOM": "100 TABS/BO", "Price": 6.18, "Source": "W/S", "VendNumber": "094007", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211815", "ItemDescription": "ETHACRYNIC ACID TAB 25MG", "UOM": "100 TABS/BO", "Price": 2095.62, "Source": "W/S", "VendNumber": "4755930", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "211854", "ItemDescription": "SYR 3ML 20GAX1.0IN NDL LL", "UOM": "None", "Price": 37.03, "Source": "W/S", "VendNumber": "BF309578", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "212873", "ItemDescription": "INTERFERON A-2B VL 18MU", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "213383", "ItemDescription": "BETAXOLOL OPHTH SUSP 0.5% 5ML", "UOM": "None", "Price": 33.65, "Source": "W/S", "VendNumber": "467324", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "213572", "ItemDescription": "TEMOZOLAMIDE CAP 140MG", "UOM": "5 CAPS/BO", "Price": 762.15, "Source": "W/S", "VendNumber": "4907499", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "213573", "ItemDescription": "HYDROCOD/APAP TAB 7.5/325", "UOM": "100 TABS/BO", "Price": 12.72, "Source": "W/S", "VendNumber": "350126", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "213574", "ItemDescription": "DOXAZOSIN TAB 1MG", "UOM": "100 TABS/BO", "Price": 37.37, "Source": "INV", "VendNumber": "650426", "OrderQty": 100, "Location": "2C2G"},
		{"MedId": "", "ItemNumber": "213575", "ItemDescription": "DOXAZOSIN TAB 2MG", "UOM": "100 TABS/BO", "Price": 31.59, "Source": "W/S", "VendNumber": "650438", "OrderQty": 1, "Location": "2C2H"},
		{"MedId": "", "ItemNumber": "213576", "ItemDescription": "DOXAZOSIN TAB 4MG", "UOM": "100 TABS/BO", "Price": 23.11, "Source": "INV", "VendNumber": "505131", "OrderQty": 100, "Location": "2C2I"},
		{"MedId": "", "ItemNumber": "213577", "ItemDescription": "DOXAZOSIN TAB 8MG", "UOM": "100 TABS/BO", "Price": 29.35, "Source": "INV", "VendNumber": "505139", "OrderQty": 100, "Location": "2C2J"},
		{"MedId": "", "ItemNumber": "213578", "ItemDescription": "MELOXICAM TAB 7.5MG", "UOM": "500 TABS/BO", "Price": 8.65, "Source": "W/S", "VendNumber": "3903770", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "213579", "ItemDescription": "MELOXICAM TAB 15MG", "UOM": "500 TABS/BO", "Price": 10, "Source": "W/S", "VendNumber": "3903804", "OrderQty": 1, "Location": "2E1C"},
		{"MedId": "", "ItemNumber": "213580", "ItemDescription": "ESTRADIOL PATCH 0.025MG", "UOM": "8 PATCH/BX", "Price": 61.04, "Source": "W/S", "VendNumber": "5047964", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "213582", "ItemDescription": "CALCIUM CARB-VIT D TAB 600MG", "UOM": "150 TABS/BO", "Price": 2.295, "Source": "INV", "VendNumber": "522995", "OrderQty": 150, "Location": "2A6B"},
		{"MedId": "", "ItemNumber": "213583", "ItemDescription": "CALCIUM CARB TAB 600MG", "UOM": "100 TABS/BO", "Price": 2.59, "Source": "INV", "VendNumber": "735472", "OrderQty": 100, "Location": "2A6D"},
		{"MedId": "", "ItemNumber": "213584", "ItemDescription": "AMANTADINE LIQ 50MG/5ML 16OZ", "UOM": "None", "Price": 5.68, "Source": "W/S", "VendNumber": "2386084", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "213585", "ItemDescription": "OXYBUTYNIN PATCH 3.9MG/24HR", "UOM": "8 PATCH/BX", "Price": 508.24, "Source": "W/S", "VendNumber": "3481439", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "213586", "ItemDescription": "MARAVIROC TAB 150MG", "UOM": "60 TABS/BO", "Price": 1289.16, "Source": "W/S", "VendNumber": "140032", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "213587", "ItemDescription": "ETRAVIRINE TAB 100MG", "UOM": "120 TABS/BO", "Price": 1122.61, "Source": "W/S", "VendNumber": "4043758", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "213588", "ItemDescription": "RALTEGRAVIR TAB 400MG", "UOM": "60 TABS/BO", "Price": 1279.83, "Source": "W/S", "VendNumber": "660201", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "213589", "ItemDescription": "DARUNAVIR TAB 600MG", "UOM": "60 TABS/BO", "Price": 1398.13, "Source": "W/S", "VendNumber": "4081105", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "213810", "ItemDescription": "AMIODARONE 50MG/ML 9ML", "UOM": "10 VIALS/CT", "Price": 19.16, "Source": "INV", "VendNumber": "935496", "OrderQty": 10, "Location": "3C3B"},
		{"MedId": "", "ItemNumber": "213812", "ItemDescription": "DEXAMETH TAB 1MG", "UOM": "100 TABS/BO", "Price": 22.39, "Source": "W/S", "VendNumber": "258707", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "214285", "ItemDescription": "ALCOHOL ISOPROPYL 70% 16OZ", "UOM": "None", "Price": 12.39, "Source": "W/S", "VendNumber": "MDS098003Z", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "214858", "ItemDescription": "MICAFUNGIN VL 100MG", "UOM": "None", "Price": 68.04, "Source": "INV", "VendNumber": "845038", "OrderQty": 1, "Location": "5A3A"},
		{"MedId": "", "ItemNumber": "214859", "ItemDescription": "MICAFUNGIN VL 50MG", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "215491", "ItemDescription": "BEVACIZUMAB VL400MG", "UOM": "None", "Price": 3034.16, "Source": "W/S", "VendNumber": "276699", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "215492", "ItemDescription": "OCTREOTIDE LAR SYR 10MG", "UOM": "None", "Price": 2607.1, "Source": "W/S", "VendNumber": "390587", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "215609", "ItemDescription": "ALBUTEROL SOL 2.5MG 3ML SINGLE", "UOM": "30 NEBS/CT", "Price": 4.509, "Source": "INV", "VendNumber": "326020", "OrderQty": 30, "Location": "6C6A"},
		{"MedId": "", "ItemNumber": "215610", "ItemDescription": "IPRATROPIUM NEB .5MG 2.5ML SGL", "UOM": "30 NEBS/CT", "Price": 5.799, "Source": "INV", "VendNumber": "326013", "OrderQty": 30, "Location": "1D1A"},
		{"MedId": "", "ItemNumber": "215787", "ItemDescription": "CONTAINER BREAST MILK 70ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "216552", "ItemDescription": "NEUTROPHOS TAB 250MG", "UOM": "100 TABS/BO", "Price": 20.98, "Source": "INV", "VendNumber": "626911", "OrderQty": 100, "Location": "2F1A"},
		{"MedId": "", "ItemNumber": "216553", "ItemDescription": "METHYLNALTREXONE VL 12MG", "UOM": "None", "Price": 92.09, "Source": "W/S", "VendNumber": "138204", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "216566", "ItemDescription": "SOL AMINOSYN-PF IV 7% 500ML", "UOM": "None", "Price": 281.76, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "216568", "ItemDescription": "SOL 20MEQ IV 50ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "216569", "ItemDescription": "SOL IV INJ H2O 2000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "216570", "ItemDescription": "SOL DEXTROSE 70% IV 2000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "216573", "ItemDescription": "SOL MANNITOL 20% IV 500ML", "UOM": "None", "Price": 205.32, "Source": "W/S", "VendNumber": "771503", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "216577", "ItemDescription": "SOL LACTATED RINGER IV 250ML", "UOM": "None", "Price": 21.84, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "216578", "ItemDescription": "SOL NACL .9% IV 25ML", "UOM": "None", "Price": 46.08, "Source": "W/S", "VendNumber": "798420", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "216581", "ItemDescription": "NICARDIPINE PREMX 20MG 200ML", "UOM": "EA/CT10", "Price": 438.17, "Source": "INV", "VendNumber": "275762", "OrderQty": 10, "Location": "12A3A"},
		{"MedId": "", "ItemNumber": "216771", "ItemDescription": "ACETAMIN SUPP 650MG", "UOM": "12 SUPP/BX", "Price": 4.9404, "Source": "INV", "VendNumber": "391789", "OrderQty": 12, "Location": "1B1C"},
		{"MedId": "", "ItemNumber": "216773", "ItemDescription": "DOBUTAMINE 500MG/D5W 250ML", "UOM": "12 BAGS/CA", "Price": 116.7096, "Source": "INV", "VendNumber": "687731", "OrderQty": 12, "Location": "6F4A"},
		{"MedId": "", "ItemNumber": "216775", "ItemDescription": "DPT POLIO VACCINE VL (KINRIX)", "UOM": "10 VIALS/CT", "Price": 366.88, "Source": "INV", "VendNumber": "612770", "OrderQty": 10, "Location": "10A3D"},
		{"MedId": "", "ItemNumber": "216781", "ItemDescription": "SOL IV NACL 100ML SGL", "UOM": "None", "Price": 104.64, "Source": "W/S", "VendNumber": "798423", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "216783", "ItemDescription": "SOL IV D5% 100ML SGL", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "217175", "ItemDescription": "BUTALBITAL/APAP TAB 50/325", "UOM": "100 TABS/BO", "Price": 116.81, "Source": "W/S", "VendNumber": "2846624", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "218032", "ItemDescription": "SOL INJ 20MQ KCL45% NACL1000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "218089", "ItemDescription": "OXYCODONE TAB 15MG", "UOM": "100 TABS/BO", "Price": 14.79, "Source": "W/S", "VendNumber": "030502", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "218091", "ItemDescription": "COLLAGENASE OINT 30GM", "UOM": "None", "Price": 168.34, "Source": "INV", "VendNumber": "551499", "OrderQty": 1, "Location": "1D6B"},
		{"MedId": "", "ItemNumber": "218092", "ItemDescription": "LEUPROLIDE KIT 30MG", "UOM": "None", "Price": 497.34, "Source": "W/S", "VendNumber": "343616", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "218170", "ItemDescription": "PAK-MED AMBER ROLL", "UOM": "None", "Price": 140, "Source": "W/S", "VendNumber": "367116", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "218391", "ItemDescription": "CLINDAMYCIN LIQ 75MG/5ML 100ML", "UOM": "None", "Price": 27.04, "Source": "W/S", "VendNumber": "4328498", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "218742", "ItemDescription": "POT CHL TAB 10MEQ", "UOM": "100 TABS/BO", "Price": 20.86, "Source": "INV", "VendNumber": "577837", "OrderQty": 100, "Location": "2F6A"},
		{"MedId": "", "ItemNumber": "219424", "ItemDescription": "ROMIPLOSTIM VL 250MCG/0.5ML", "UOM": "None", "Price": 1522.24, "Source": "W/S", "VendNumber": "55513-0221-01", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "219965", "ItemDescription": "PACK COLD INSTANT STD 5.75X9IN", "UOM": "None", "Price": 8.1, "Source": "W/S", "VendNumber": "MDS137000", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "220023", "ItemDescription": "REGADENOSON SYR 0.4MG/5ML", "UOM": "None", "Price": 203.03, "Source": "INV", "VendNumber": "637037", "OrderQty": 1, "Location": "5D3A"},
		{"MedId": "", "ItemNumber": "220024", "ItemDescription": "PEGFILGRASTIM VL 6MG", "UOM": "None", "Price": 4888.03, "Source": "W/S", "VendNumber": "398952", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "220026", "ItemDescription": "INSULIN HUM REG 500U/ML 20ML", "UOM": "None", "Price": 1356.28, "Source": "W/S", "VendNumber": "552828", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "220590", "ItemDescription": "FILTER TRANSFER  0.22UM 25MM", "UOM": "None", "Price": 180, "Source": "W/S", "VendNumber": "SLGL0250S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "221321", "ItemDescription": "EDROPHONIUM VL 150MG/15ML", "UOM": "None", "Price": 73.71, "Source": "W/S", "VendNumber": "4119566", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "221917", "ItemDescription": "SOL INJ 5% D VISIV 250ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "221918", "ItemDescription": "SOL INJ NACL 0.9% VISIV 250ML", "UOM": "None", "Price": 27.36, "Source": "W/S", "VendNumber": "798325", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "222176", "ItemDescription": "CHOLECALCIFEROL TAB 1000IU", "UOM": "180 TABS/BO", "Price": 2.214, "Source": "INV", "VendNumber": "393413", "OrderQty": 180, "Location": "2B3A"},
		{"MedId": "", "ItemNumber": "222270", "ItemDescription": "CON ESTROG TAB 0.45MG", "UOM": "100 TABS/BO", "Price": 338, "Source": "W/S", "VendNumber": "3706272", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "222271", "ItemDescription": "CARBIDOPA TAB 25MG", "UOM": "100 TABS/BO", "Price": 431.93, "Source": "W/S", "VendNumber": "282689", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "222306", "ItemDescription": "LISINOPRIL TAB 10MG U/D", "UOM": "100 TABS/BX", "Price": 6.68, "Source": "INV", "VendNumber": "258451", "OrderQty": 100, "Location": "2D6A"},
		{"MedId": "", "ItemNumber": "222309", "ItemDescription": "HCTZ CAP 12.5MG U/D", "UOM": "100 CAPS/BX", "Price": 9.3, "Source": "INV", "VendNumber": "917714", "OrderQty": 100, "Location": "2D1F"},
		{"MedId": "", "ItemNumber": "222388", "ItemDescription": "MIRTAZAPINE TAB 15MG U/D", "UOM": "100 TABS/BX", "Price": 11.28, "Source": "INV", "VendNumber": "741862", "OrderQty": 100, "Location": "2E5H"},
		{"MedId": "", "ItemNumber": "222683", "ItemDescription": "ALBUTEROL/IPRATROP INH 3ML", "UOM": "30 EACH/CT", "Price": 7.68, "Source": "INV", "VendNumber": "230894", "OrderQty": 30, "Location": "6D1A"},
		{"MedId": "", "ItemNumber": "222907", "ItemDescription": "CEFIXIME TAB 400MG", "UOM": "10 TABS/BO", "Price": 177.9, "Source": "W/S", "VendNumber": "4890026", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "222909", "ItemDescription": "PRASUGREL TAB 10MG", "UOM": "90 TABS/BO", "Price": 1268.217, "Source": "INV", "VendNumber": "172991", "OrderQty": 90, "Location": "2F6D"},
		{"MedId": "", "ItemNumber": "222910", "ItemDescription": "DRONEDARONE TAB 400MG", "UOM": "60 TABS/BO", "Price": 538.02, "Source": "W/S", "VendNumber": "290429", "OrderQty": 1, "Location": "2C2M"},
		{"MedId": "", "ItemNumber": "223048", "ItemDescription": "OCTREOTIDE LAR SYR 30MG", "UOM": "None", "Price": 5365.46, "Source": "W/S", "VendNumber": "603779", "OrderQty": 1, "Location": "10C2E"},
		{"MedId": "", "ItemNumber": "223049", "ItemDescription": "ALVIMOPAN CAP 12MG", "UOM": "30 CAPS/BO", "Price": 3959.1, "Source": "W/S", "VendNumber": "4761771", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "223054", "ItemDescription": "LABEL DOT MATRIX LAC 3X1-15/16", "UOM": "None", "Price": 51.04, "Source": "W/S", "VendNumber": "TPWHP17", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "223269", "ItemDescription": "RIVASTIGMINE PATCH 4.6MG", "UOM": "30 EA/BO", "Price": 205.4199, "Source": "W/S", "VendNumber": "428040", "OrderQty": 1, "Location": "1F4H"},
		{"MedId": "", "ItemNumber": "223270", "ItemDescription": "RIVASTIGMINE PATCH 9.5MG", "UOM": "30 EA/BO", "Price": 191.0598, "Source": "INV", "VendNumber": "428052", "OrderQty": 30, "Location": "1F4H"},
		{"MedId": "", "ItemNumber": "223271", "ItemDescription": "ESTRADIOL TAB 0.5MG", "UOM": "50 TABS/BO", "Price": 13.48, "Source": "W/S", "VendNumber": "4962510", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "223272", "ItemDescription": "COLISTIMETHATE VL 150MG", "UOM": "None", "Price": 8.9, "Source": "W/S", "VendNumber": "4601522", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "223349", "ItemDescription": "MOXIFLOXACIN TAB 400MG", "UOM": "30 TABS/BO", "Price": 139.9998, "Source": "INV", "VendNumber": "332122", "OrderQty": 30, "Location": "2E6B"},
		{"MedId": "", "ItemNumber": "223363", "ItemDescription": "PIPER/TAZOBACT VL 3.375GM", "UOM": "10 VIALS/CT", "Price": 32.02, "Source": "INV", "VendNumber": "177853", "OrderQty": 10, "Location": "8C1A"},
		{"MedId": "", "ItemNumber": "223365", "ItemDescription": "PIPER/TAZOBACT VL 4.5GM", "UOM": "10 VIALS/CT", "Price": 58.09, "Source": "W/S", "VendNumber": "4264586", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "223614", "ItemDescription": "SOL DEXTROSE  5% VISIV 100ML", "UOM": "None", "Price": 107.4, "Source": "W/S", "VendNumber": "792311", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "223615", "ItemDescription": "SOL SODIUM CL .09% VISIV 100ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "223621", "ItemDescription": "VEHICLE SWEETENED CMPD 16OZ", "UOM": "None", "Price": 11.86, "Source": "W/S", "VendNumber": "1860931", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "223763", "ItemDescription": "OMEPRAZOLE CAP 20MG", "UOM": "100 CAPS/BX", "Price": 5.02, "Source": "W/S", "VendNumber": "647634", "OrderQty": 1, "Location": "2F3B"},
		{"MedId": "", "ItemNumber": "224194", "ItemDescription": "NITROGLY OINT 2% FOIL PK", "UOM": "48EA/CT", "Price": 70.92, "Source": "INV", "VendNumber": "167039", "OrderQty": 48, "Location": "1F4A"},
		{"MedId": "", "ItemNumber": "224872", "ItemDescription": "NEBIVOLOL TAB 20MG", "UOM": "30 TABS/BO", "Price": 81, "Source": "W/S", "VendNumber": "4194114", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "224873", "ItemDescription": "CARB/LEVO ODT 25/100", "UOM": "100 TABS/BO", "Price": 82.22, "Source": "W/S", "VendNumber": "4262549", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "224874", "ItemDescription": "KETOTIFEN OPH DROP 0.025%", "UOM": "None", "Price": 5.94, "Source": "INV", "VendNumber": "619229", "OrderQty": 1, "Location": "1A4H"},
		{"MedId": "", "ItemNumber": "225517", "ItemDescription": "VITS/MINS/COQ10 LIQ 60ML(NICU)", "UOM": "None", "Price": 24.52, "Source": "W/S", "VendNumber": "3922127", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "225518", "ItemDescription": "IBUPROFEN TAB 200MG", "UOM": "500 TABS/BO", "Price": 5, "Source": "W/S", "VendNumber": "2284149", "OrderQty": 1, "Location": "2D2C"},
		{"MedId": "", "ItemNumber": "225725", "ItemDescription": "TREPROSTINIL VL 200MG 20ML", "UOM": "None", "Price": 14737.5, "Source": "W/S", "VendNumber": "2830", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "225726", "ItemDescription": "FLUCONAZOLE PB 100MG", "UOM": "10 BAGS/CT", "Price": 50.66, "Source": "INV", "VendNumber": "463846", "OrderQty": 10, "Location": "4C1C"},
		{"MedId": "", "ItemNumber": "226040", "ItemDescription": "SOD THIOSULFATE VL 12.5GM/50ML", "UOM": "None", "Price": 81, "Source": "W/S", "VendNumber": "4575387", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "227021", "ItemDescription": "LUBIPROSTONE CAP 8MCG", "UOM": "60 CAPS/BO", "Price": 322.5396, "Source": "W/S", "VendNumber": "629129", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "227027", "ItemDescription": "ABATACEPT VL 250MG", "UOM": "None", "Price": 639.5, "Source": "W/S", "VendNumber": "3743523", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "227028", "ItemDescription": "OXALIPLATIN VL 100MG", "UOM": "None", "Price": 53.42, "Source": "INV", "VendNumber": "0233-20", "OrderQty": 1, "Location": "9E2B"},
		{"MedId": "", "ItemNumber": "227030", "ItemDescription": "HEPARIN VL 5KU/ML 1 ML", "UOM": "25 VIALS/CT", "Price": 23.95, "Source": "INV", "VendNumber": "103263", "OrderQty": 25, "Location": "7C3A"},
		{"MedId": "", "ItemNumber": "227031", "ItemDescription": "ASPIRIN TAB EC 81MG", "UOM": "1000 TABS/BO", "Price": 5.5, "Source": "INV", "VendNumber": "516542", "OrderQty": 1000, "Location": "2A3G"},
		{"MedId": "", "ItemNumber": "227592", "ItemDescription": "GOWN ISOL FLUID PROOF", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "228299", "ItemDescription": "ENFAMIL D-SOL 50ML", "UOM": "None", "Price": 7.85, "Source": "INV", "VendNumber": "337337", "OrderQty": 1, "Location": "6A6C"},
		{"MedId": "", "ItemNumber": "228400", "ItemDescription": "AMIODARONE VL 150MG/3ML", "UOM": "25 VIALS/CT", "Price": 17.35, "Source": "INV", "VendNumber": "641391", "OrderQty": 25, "Location": "3C4A"},
		{"MedId": "", "ItemNumber": "228418", "ItemDescription": "SYR LUER-LOK 5ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "228420", "ItemDescription": "BUPRENORPHINE TAB 2MG", "UOM": "30 TABS/BO", "Price": 0.8057, "Source": "W/S", "VendNumber": "5066634", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "228499", "ItemDescription": "LACOSAMIDE TAB 50MG", "UOM": "60 TABS/BO", "Price": 444.87, "Source": "W/S", "VendNumber": "389256", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "229049", "ItemDescription": "MOXIFLOXACIN PB 400MG", "UOM": "12 BAGS/CT", "Price": 370.2504, "Source": "INV", "VendNumber": "425095", "OrderQty": 12, "Location": "8B5A"},
		{"MedId": "", "ItemNumber": "229051", "ItemDescription": "CIPRO PB 400MG 200ML", "UOM": "24 EA/BX", "Price": 50.4, "Source": "INV", "VendNumber": "762120", "OrderQty": 24, "Location": "6E3A"},
		{"MedId": "", "ItemNumber": "229052", "ItemDescription": "CIPRO PB 200MG 100ML", "UOM": "24 EA/BX", "Price": 39.57, "Source": "INV", "VendNumber": "742775", "OrderQty": 24, "Location": "3F2B"},
		{"MedId": "", "ItemNumber": "229136", "ItemDescription": "CA CARB TAB 500MG", "UOM": "300 TABS/BO", "Price": 3.69, "Source": "INV", "VendNumber": "429001", "OrderQty": 300, "Location": "2A6C"},
		{"MedId": "", "ItemNumber": "229137", "ItemDescription": "MORPHINE PF VIAL 10MG 10ML", "UOM": "10 VIALS/CT", "Price": 29.12, "Source": "W/S", "VendNumber": "3673878", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "229138", "ItemDescription": "NYSTATIN SUSP 5ML", "UOM": "100 CUPS/CA", "Price": 72.36, "Source": "INV", "VendNumber": "173789", "OrderQty": 100, "Location": "6B6B"},
		{"MedId": "", "ItemNumber": "229139", "ItemDescription": "LIDOCAINE VL 1% 20ML", "UOM": "25 VIALS/CT", "Price": 22.57, "Source": "INV", "VendNumber": "117119", "OrderQty": 25, "Location": "7E1A"},
		{"MedId": "", "ItemNumber": "229140", "ItemDescription": "DOCUSATE CAP 100MG U/D", "UOM": "750 CAPS/BX", "Price": 17.4, "Source": "INV", "VendNumber": "082602", "OrderQty": 750, "Location": "6F5A"},
		{"MedId": "", "ItemNumber": "229142", "ItemDescription": "PAROXETINE TAB 40MG", "UOM": "100 TABS/BX", "Price": 47.25, "Source": "W/S", "VendNumber": "895983", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "229152", "ItemDescription": "MEROPENEM VL 500MG", "UOM": "25 VIALS/CT", "Price": 81.97, "Source": "INV", "VendNumber": "094654", "OrderQty": 25, "Location": "4F4A"},
		{"MedId": "", "ItemNumber": "229157", "ItemDescription": "GLYCERIN SUPP INFANT U/D", "UOM": "10 SUPP/CT", "Price": 4.6, "Source": "INV", "VendNumber": "1758317", "OrderQty": 10, "Location": "1B2A"},
		{"MedId": "", "ItemNumber": "229175", "ItemDescription": "LACTULOSE LIQ 30ML", "UOM": "100 CUPS/BX", "Price": 35.46, "Source": "INV", "VendNumber": "100317", "OrderQty": 100, "Location": "6B3B"},
		{"MedId": "", "ItemNumber": "229184", "ItemDescription": "RECOMBINANT COAG NOVO7 5MG", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "229206", "ItemDescription": "CONTRAST MRI EOVIST 5X10ML", "UOM": "None", "Price": 628.583, "Source": "INV", "VendNumber": "872978", "OrderQty": 1, "Location": "4B4A"},
		{"MedId": "", "ItemNumber": "229414", "ItemDescription": "TRAZODONE TAB 50MG", "UOM": "500 TABS/BO", "Price": 23.8, "Source": "INV", "VendNumber": "095935", "OrderQty": 500, "Location": "3B2I"},
		{"MedId": "", "ItemNumber": "229469", "ItemDescription": "GLOVE CHEMO NITRILE PF LG", "UOM": "None", "Price": 56.52, "Source": "W/S", "VendNumber": "MDS195186", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "229470", "ItemDescription": "GLOVE CHEMO NITRILE PF MED", "UOM": "None", "Price": 56.52, "Source": "W/S", "VendNumber": "MDS195185", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "229471", "ItemDescription": "GLOVE CHEMO NITRILE PF SM", "UOM": "None", "Price": 56.52, "Source": "W/S", "VendNumber": "MDS195184", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "229499", "ItemDescription": "DILTIAZEM CD 180MG", "UOM": "100 CAPS/BO", "Price": 23.4, "Source": "INV", "VendNumber": "603019", "OrderQty": 100, "Location": "2C1C"},
		{"MedId": "", "ItemNumber": "229747", "ItemDescription": "RIBBON ZEBRA 3842 MC RX", "UOM": "1 ROLL/EA", "Price": 14, "Source": "W/S", "VendNumber": "255607", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "229748", "ItemDescription": "LABEL TADPOLE ZEBRA MCK RX", "UOM": "1 ROLL/EA", "Price": 110, "Source": "W/S", "VendNumber": "255606", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "229905", "ItemDescription": "PANCRELIPASE CAP 5000U", "UOM": "100 CAPS/BO", "Price": 130.12, "Source": "INV", "VendNumber": "365833", "OrderQty": 100, "Location": "2F3H"},
		{"MedId": "", "ItemNumber": "230001", "ItemDescription": "FUROSEM TAB 40MG", "UOM": "100 TABS/BX", "Price": 3.91, "Source": "INV", "VendNumber": "604350", "OrderQty": 100, "Location": "2C4J"},
		{"MedId": "", "ItemNumber": "230068", "ItemDescription": "SUBOXONE FILM TAB 8/2", "UOM": "30 TABS/BO", "Price": 214.41, "Source": "W/S", "VendNumber": "018549", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "230069", "ItemDescription": "SUBOXONE FILM TAB 2/0.5", "UOM": "30 TABS/BO", "Price": 119.69, "Source": "W/S", "VendNumber": "018541", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "230070", "ItemDescription": "POT CHL TAB SR 20MEQ", "UOM": "100 TABS/BO", "Price": 29.66, "Source": "W/S", "VendNumber": "326862", "OrderQty": 1, "Location": "2F6B"},
		{"MedId": "", "ItemNumber": "230142", "ItemDescription": "OXYMETAZO SPRAY .05% 15ML", "UOM": "None", "Price": 0.69, "Source": "INV", "VendNumber": "573618", "OrderQty": 1, "Location": "8B5C"},
		{"MedId": "", "ItemNumber": "230251", "ItemDescription": "METOCLOPRAM TAB 10MG", "UOM": "100 TABS/BX", "Price": 3.08, "Source": "INV", "VendNumber": "320440", "OrderQty": 100, "Location": "2E2G"},
		{"MedId": "", "ItemNumber": "230252", "ItemDescription": "LEVETIRACETAM TAB 500MG U/D", "UOM": "100 TABS/BX", "Price": 13.79, "Source": "INV", "VendNumber": "363248", "OrderQty": 100, "Location": "2D4F"},
		{"MedId": "", "ItemNumber": "230253", "ItemDescription": "OCTREOTIDE VL 500MCG/ML", "UOM": "10 VIALS/CT", "Price": 120.19, "Source": "INV", "VendNumber": "637126", "OrderQty": 10, "Location": "10C3B"},
		{"MedId": "", "ItemNumber": "230571", "ItemDescription": "CABAZITAXEL VL 60MG", "UOM": "None", "Price": 9104.92, "Source": "W/S", "VendNumber": "107363", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "230572", "ItemDescription": "AZACITIDINE VL 100MG", "UOM": "None", "Price": 105, "Source": "W/S", "VendNumber": "606202", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "230573", "ItemDescription": "DECITABINE VL 50MG", "UOM": "None", "Price": 1087.76, "Source": "W/S", "VendNumber": "4897401", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "230574", "ItemDescription": "OXYCODONE TAB 30MG CR", "UOM": "100TABS/BO", "Price": 744.57, "Source": "W/S", "VendNumber": "4328662", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "230575", "ItemDescription": "OXYCODONE TAB 60MG CR", "UOM": "100 TABS/BO", "Price": 1418.44, "Source": "W/S", "VendNumber": "4328704", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "230578", "ItemDescription": "NADOLOL TAB 20MG", "UOM": "100 TABS/BO", "Price": 149.26, "Source": "W/S", "VendNumber": "630798", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "230775", "ItemDescription": "LIOTHYONINE TAB 5MCG", "UOM": "100 TABS/BO", "Price": 54, "Source": "W/S", "VendNumber": "4211777", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "230825", "ItemDescription": "PANCRELIPASE CAP 24KU", "UOM": "250 CAPS/BO", "Price": 1230.15, "Source": "W/S", "VendNumber": "375378", "OrderQty": 1, "Location": "2F4A"},
		{"MedId": "", "ItemNumber": "230834", "ItemDescription": "METHIMAZOLE TAB 5MG", "UOM": "100 TABS/BO", "Price": 5, "Source": "W/S", "VendNumber": "4576195", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "230954", "ItemDescription": "OFATUMUMAB VL 3X100MG LOAD", "UOM": "3 VIALS/CT", "Price": 1320, "Source": "W/S", "VendNumber": "4495834", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "230955", "ItemDescription": "OFATUMUMAB VL 1GM (MAINT)", "UOM": "V1/1", "Price": 4588.82, "Source": "W/S", "VendNumber": "4495974", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "231095", "ItemDescription": "TOCILIZUMAB VL 200MG", "UOM": "None", "Price": 694.55, "Source": "W/S", "VendNumber": "4277422", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "231412", "ItemDescription": "SEALS PULL LOCKS WHITE", "UOM": "100/CASE", "Price": 13.9, "Source": "W/S", "VendNumber": "R23", "OrderQty": 1, "Location": "9F5A"},
		{"MedId": "", "ItemNumber": "231414", "ItemDescription": "BUBBLE GUM FLAVOR CONC 2OZ", "UOM": "None", "Price": 54.99, "Source": "W/S", "VendNumber": "497673", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "231415", "ItemDescription": "CHOCOLATE FLAVOR CONC 2OZ", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "231417", "ItemDescription": "RIFAXIMIN TAB 550MG", "UOM": "60 TABS/BO", "Price": 1842.72, "Source": "W/S", "VendNumber": "081529", "OrderQty": 1, "Location": "3A4C"},
		{"MedId": "", "ItemNumber": "231418", "ItemDescription": "DIAZEPAM SYRINGE 10MG 2ML", "UOM": "10 EA/CT", "Price": 219.27, "Source": "W/S", "VendNumber": "3684172", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "231909", "ItemDescription": "RILUZOLE TAB 50MG", "UOM": "60 TABS/BO", "Price": 208.83, "Source": "W/S", "VendNumber": "4891149", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "231912", "ItemDescription": "DABIGATRAN CAP 75MG", "UOM": "60 TABS/BO", "Price": 307.44, "Source": "INV", "VendNumber": "142063", "OrderQty": 60, "Location": "2B5I"},
		{"MedId": "", "ItemNumber": "231913", "ItemDescription": "DABIGATRAN CAP 150MG", "UOM": "60 TABS/BO", "Price": 307.44, "Source": "W/S", "VendNumber": "036251", "OrderQty": 1, "Location": "2B6A"},
		{"MedId": "", "ItemNumber": "231928", "ItemDescription": "SYR 3ML LUER LOCK", "UOM": "None", "Price": 7.03, "Source": "W/S", "VendNumber": "309657", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "232179", "ItemDescription": "DONEPEZIL TAB 23MG", "UOM": "30 TABS/BO", "Price": 41.1198, "Source": "W/S", "VendNumber": "275446", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "232270", "ItemDescription": "FLUZONE SYR (INFANT) 0.25ML", "UOM": "EA/CT10", "Price": 163.75, "Source": "INV", "VendNumber": "517-25", "OrderQty": 10, "Location": "11A1B"},
		{"MedId": "", "ItemNumber": "232589", "ItemDescription": "OXYCODONE/ACET TAB 10/325", "UOM": "100 TABS/BO", "Price": 27.85, "Source": "W/S", "VendNumber": "414538", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "232779", "ItemDescription": "RASBURICASE VL 7.5MG", "UOM": "None", "Price": 3593.29, "Source": "W/S", "VendNumber": "405105", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "233702", "ItemDescription": "ALBUTEROL HFA INHALER (OR/ICU)", "UOM": "None", "Price": 51.77, "Source": "INV", "VendNumber": "199794", "OrderQty": 1, "Location": "1B3C"},
		{"MedId": "", "ItemNumber": "233902", "ItemDescription": "SOL AMINOSYN II 15% IV 2000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "234874", "ItemDescription": "DOCETAXEL VL 160MG", "UOM": "None", "Price": 204.19, "Source": "INV", "VendNumber": "228142", "OrderQty": 1, "Location": "9D3E"},
		{"MedId": "", "ItemNumber": "235206", "ItemDescription": "TENECTEPLASE VL 50MG", "UOM": "None", "Price": 4701.93, "Source": "W/S", "VendNumber": "4540894", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "235208", "ItemDescription": "MAG SUL 20GM 500ML", "UOM": "24 BAGS/CT", "Price": 58.8, "Source": "INV", "VendNumber": "2365187", "OrderQty": 24, "Location": "7F5B"},
		{"MedId": "", "ItemNumber": "235250", "ItemDescription": "TEMSIROLIMUS VL 25MG", "UOM": "None", "Price": 1566.36, "Source": "W/S", "VendNumber": "3994282", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "235290", "ItemDescription": "FLECAINIDE TAB 50MG", "UOM": "100 TABS/BO", "Price": 52.81, "Source": "W/S", "VendNumber": "3458189", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "235765", "ItemDescription": "LEUCOVORIN VL 350MG", "UOM": "None", "Price": 13.36, "Source": "INV", "VendNumber": "561738", "OrderQty": 1, "Location": "4E1B"},
		{"MedId": "", "ItemNumber": "235918", "ItemDescription": "NEOSTIGMINE VL 10MG 10ML", "UOM": "10 VIALS/CT", "Price": 386.82, "Source": "INV", "VendNumber": "667618", "OrderQty": 10, "Location": "5A5E"},
		{"MedId": "", "ItemNumber": "236385", "ItemDescription": "PREDNISONE DOSPAK 5MG #21", "UOM": "None", "Price": 10.22, "Source": "W/S", "VendNumber": "3514957", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "236386", "ItemDescription": "CARBOPLATIN VL 600MG", "UOM": "None", "Price": 37.5, "Source": "INV", "VendNumber": "583144", "OrderQty": 1, "Location": "9D1E"},
		{"MedId": "", "ItemNumber": "236529", "ItemDescription": "TOURNIQUET FLAT 1X18 ORG", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "236671", "ItemDescription": "NYSTATIN CR 15GM", "UOM": "None", "Price": 4.19, "Source": "INV", "VendNumber": "488217", "OrderQty": 1, "Location": "1F4C"},
		{"MedId": "", "ItemNumber": "236673", "ItemDescription": "ZINC SULFATE FTV 25MG 5ML", "UOM": "25 VIALS/CT", "Price": 863.44, "Source": "INV", "VendNumber": "561050", "OrderQty": 25, "Location": "5F6B"},
		{"MedId": "", "ItemNumber": "236865", "ItemDescription": "SYR RHOPHYLAC 1500IU", "UOM": "10 SYR/CT", "Price": 702, "Source": "INV", "VendNumber": "981504", "OrderQty": 10, "Location": "11E4A"},
		{"MedId": "", "ItemNumber": "237238", "ItemDescription": "PEG BOWEL (MIRALAX) 510GM", "UOM": "None", "Price": 7.37, "Source": "INV", "VendNumber": "129960", "OrderQty": 1, "Location": "6C2B"},
		{"MedId": "", "ItemNumber": "237858", "ItemDescription": "SELENIUM SHAMPOO 1%", "UOM": "None", "Price": 2.25, "Source": "W/S", "VendNumber": "707414", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "237859", "ItemDescription": "PEMETREXED VL 100MG", "UOM": "None", "Price": 601.83, "Source": "W/S", "VendNumber": "773940", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "237881", "ItemDescription": "BACITRACIN VL 50KU", "UOM": "10 VIALS/CT", "Price": 40.53, "Source": "INV", "VendNumber": "485843", "OrderQty": 10, "Location": "11D1A"},
		{"MedId": "", "ItemNumber": "238248", "ItemDescription": "CHLOROPROC VL 3% 20ML", "UOM": "25 VIALS/CT", "Price": 463.88, "Source": "INV", "VendNumber": "4572681", "OrderQty": 25, "Location": "3F2A"},
		{"MedId": "", "ItemNumber": "238249", "ItemDescription": "GLIADEL WAFER IMPLANT 8/BX", "UOM": "None", "Price": 30486.23, "Source": "W/S", "VendNumber": "5012000", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "238254", "ItemDescription": "ATORVASTATIN TAB 20MG", "UOM": "90 TABLETS/BO", "Price": 8.019, "Source": "INV", "VendNumber": "180063", "OrderQty": 90, "Location": "2A3N"},
		{"MedId": "", "ItemNumber": "238255", "ItemDescription": "PRAVASTATIN TAB 40MG", "UOM": "90 TABLETS/BO", "Price": 13.302, "Source": "INV", "VendNumber": "064675", "OrderQty": 90, "Location": "3A1C"},
		{"MedId": "", "ItemNumber": "238256", "ItemDescription": "PRAVASTATIN TAB 80MG", "UOM": "90 TABLETS/BO", "Price": 22.3398, "Source": "INV", "VendNumber": "064523", "OrderQty": 90, "Location": "3A1D"},
		{"MedId": "", "ItemNumber": "238749", "ItemDescription": "OXYCODONE TAB 15MG CR", "UOM": "100 TABS/BO", "Price": 423, "Source": "W/S", "VendNumber": "4328613", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "239688", "ItemDescription": "SUCRALFATE TAB 1GM", "UOM": "500 TABS/BO", "Price": 93.15, "Source": "INV", "VendNumber": "627575", "OrderQty": 500, "Location": "3A6H"},
		{"MedId": "", "ItemNumber": "239702", "ItemDescription": "CEFTRIAXONE VL 10GM", "UOM": "None", "Price": 11.82, "Source": "INV", "VendNumber": "443111", "OrderQty": 1, "Location": "3F1C"},
		{"MedId": "", "ItemNumber": "239703", "ItemDescription": "TETRACAINE AMP 20MG 2ML", "UOM": "25 AMPS/CT", "Price": 839.73, "Source": "W/S", "VendNumber": "4335543", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "239817", "ItemDescription": "BOOSTRIX VACCINE 0.5ML", "UOM": "10 EACH/CT", "Price": 301.94, "Source": "INV", "VendNumber": "041689", "OrderQty": 10, "Location": "10A1G"},
		{"MedId": "", "ItemNumber": "239818", "ItemDescription": "ETOPOSIDE VL 500MG", "UOM": "None", "Price": 28.9, "Source": "INV", "VendNumber": "131870", "OrderQty": 1, "Location": "9D4A"},
		{"MedId": "", "ItemNumber": "239957", "ItemDescription": "ERIBULIN VL 1MG 2ML", "UOM": "None", "Price": 999, "Source": "W/S", "VendNumber": "4358305", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "240098", "ItemDescription": "CAP DISINFCT SWAB IV POLE", "UOM": "25/BG", "Price": 592.42, "Source": "W/S", "VendNumber": "SCXT3-2400", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "240274", "ItemDescription": "CEFTAROLINE VL 600MG", "UOM": "10 VIALS/CT", "Price": 1180.59, "Source": "INV", "VendNumber": "053518", "OrderQty": 10, "Location": "3E6B"},
		{"MedId": "", "ItemNumber": "240328", "ItemDescription": "ALTEPLASE VI 2MG (CATHFLOW)", "UOM": "None", "Price": 143.5, "Source": "INV", "VendNumber": "121172", "OrderQty": 1, "Location": "10A1D"},
		{"MedId": "", "ItemNumber": "240375", "ItemDescription": "MASK FLUID RESIS SURG TIE", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "240458", "ItemDescription": "APPLICATOR SKN DRMBND 0.7ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "240470", "ItemDescription": "MELATONIN TAB 3MG", "UOM": "60 TABLETS/BO", "Price": 1.062, "Source": "INV", "VendNumber": "566760", "OrderQty": 60, "Location": "2E1B"},
		{"MedId": "", "ItemNumber": "240471", "ItemDescription": "DENOSUMAB VL 60MG", "UOM": "None", "Price": 1100, "Source": "W/S", "VendNumber": "091658", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "240472", "ItemDescription": "DENOSUMAB VL 120MG", "UOM": "None", "Price": 2100.87, "Source": "W/S", "VendNumber": "049369", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "240518", "ItemDescription": "CONTRAST GADAVIST INJ 7.5ML", "UOM": "20 VIALS/CT", "Price": 486.13, "Source": "W/S", "VendNumber": "4429015", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "240519", "ItemDescription": "CONTRAST GADAVIST INJ 10ML", "UOM": "20 VIALS/CT", "Price": 647.98, "Source": "W/S", "VendNumber": "4429114", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "240641", "ItemDescription": "ROTAVIRUS VAC 1ML (ROTARIX)", "UOM": "10 EA/CT", "Price": 839.22, "Source": "W/S", "VendNumber": "129601", "OrderQty": 1, "Location": "10C7D"},
		{"MedId": "", "ItemNumber": "240827", "ItemDescription": "MASK FACE PROC PLEATED STD YEL", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "240830", "ItemDescription": "SOL IV D5% VISIV 100ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "241135", "ItemDescription": "HEPATITIS A(HAVRIX) 720U 0.5ML", "UOM": "10 SYRINGES/CT", "Price": 215.19, "Source": "INV", "VendNumber": "652453", "OrderQty": 10, "Location": "10A6D"},
		{"MedId": "", "ItemNumber": "241136", "ItemDescription": "HEPATITIS B (ENGERIX-B) 10MCG", "UOM": "10 VIALS/CT", "Price": 115.54, "Source": "INV", "VendNumber": "034611", "OrderQty": 10, "Location": "10A6G"},
		{"MedId": "", "ItemNumber": "241232", "ItemDescription": "IPILIMUMAB VL 50 MG 10ML", "UOM": "None", "Price": 6860.34, "Source": "W/S", "VendNumber": "4522314", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "241233", "ItemDescription": "TICAGRELOR TAB 90MG", "UOM": "100 TABS/BO", "Price": 508.52, "Source": "INV", "VendNumber": "132314", "OrderQty": 100, "Location": "3B2C"},
		{"MedId": "", "ItemNumber": "241234", "ItemDescription": "FIDAXOMICIN TAB 200MG", "UOM": "20 TABS/BO", "Price": 1545.48, "Source": "W/S", "VendNumber": "4502886", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "241235", "ItemDescription": "BESIFLOXACIN 0.6% EYE DROP 5ML", "UOM": "None", "Price": 135.01, "Source": "INV", "VendNumber": "190850", "OrderQty": 1, "Location": "1A3B"},
		{"MedId": "", "ItemNumber": "241236", "ItemDescription": "CIPROFLOXACIN 0.3% EYE OINT", "UOM": "None", "Price": 185.39, "Source": "INV", "VendNumber": "640045", "OrderQty": 1, "Location": "1A3E"},
		{"MedId": "", "ItemNumber": "241238", "ItemDescription": "KETOROLAC 0.5% EYE DROP", "UOM": "None", "Price": 3.55, "Source": "INV", "VendNumber": "051458", "OrderQty": 1, "Location": "1A4I"},
		{"MedId": "", "ItemNumber": "241239", "ItemDescription": "TIMOLOL 0.25% EYE DROP 5ML", "UOM": "None", "Price": 2.29, "Source": "INV", "VendNumber": "002865", "OrderQty": 1, "Location": "1A6A"},
		{"MedId": "", "ItemNumber": "241240", "ItemDescription": "TIMOLOL 0.5% EYE DROP 5ML", "UOM": "None", "Price": 3.14, "Source": "INV", "VendNumber": "002873", "OrderQty": 1, "Location": "1A6B"},
		{"MedId": "", "ItemNumber": "241251", "ItemDescription": "GENTEAL EYE GEL 10GM", "UOM": "None", "Price": 7.15, "Source": "INV", "VendNumber": "067052", "OrderQty": 1, "Location": "1A4G"},
		{"MedId": "", "ItemNumber": "241324", "ItemDescription": "LOTEPREDNOL 0.5% EYE OINT3.5GM", "UOM": "None", "Price": 213.93, "Source": "INV", "VendNumber": "133215", "OrderQty": 1, "Location": "1A5A"},
		{"MedId": "", "ItemNumber": "241485", "ItemDescription": "FLUVOXAMINE TAB 50MG", "UOM": "100 TABS/BO", "Price": 0.01, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "241487", "ItemDescription": "CPD ANTICOAG BLOOD PACK", "UOM": "24 PACKS/CT", "Price": 240, "Source": "W/S", "VendNumber": "4R0499", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "241608", "ItemDescription": "WIPE CLOTH SANI GRMCDL BLCH", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "241972", "ItemDescription": "ENALAPRIL VL 1.25MG 1ML", "UOM": "10 VIALS/CT", "Price": 9.54, "Source": "INV", "VendNumber": "261669", "OrderQty": 10, "Location": "4A3B"},
		{"MedId": "", "ItemNumber": "242065", "ItemDescription": "ETOPOSIDE CAP 50MG", "UOM": "20 CAPS/BO", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "242284", "ItemDescription": "OXYCODONE/ACET TAB 7.5-325", "UOM": "100 TABS/BO", "Price": 19.65, "Source": "W/S", "VendNumber": "468734", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "242537", "ItemDescription": "RIVAROXABAN TAB 20MG", "UOM": "100 TABS/BO", "Price": 1261.07, "Source": "W/S", "VendNumber": "145387", "OrderQty": 1, "Location": "3A4H"},
		{"MedId": "", "ItemNumber": "242538", "ItemDescription": "RIVAROXABAN TAB 15MG", "UOM": "100 TABS/BO", "Price": 1261.07, "Source": "INV", "VendNumber": "145370", "OrderQty": 100, "Location": "3A4G"},
		{"MedId": "", "ItemNumber": "242539", "ItemDescription": "RIVAROXABAN TAB 10MG", "UOM": "None", "Price": 1261.07, "Source": "W/S", "VendNumber": "130252", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "243155", "ItemDescription": "CEFOXITIN VL 10GM", "UOM": "10 VIALS/CT", "Price": 276.3, "Source": "INV", "VendNumber": "185715", "OrderQty": 10, "Location": "3E6A"},
		{"MedId": "", "ItemNumber": "243165", "ItemDescription": "MYCOPHENOLATE TAB 500MG", "UOM": "100 TABS/BO", "Price": 20.28, "Source": "W/S", "VendNumber": "067583", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "243333", "ItemDescription": "PALONOSETRON VL 0.25MG 5ML", "UOM": "None", "Price": 264.2, "Source": "W/S", "VendNumber": "871867", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "243460", "ItemDescription": "LEVOFLOXACIN TAB 750MG", "UOM": "100 TABS/BO", "Price": 32.15, "Source": "INV", "VendNumber": "128684", "OrderQty": 100, "Location": "2D4J"},
		{"MedId": "", "ItemNumber": "243471", "ItemDescription": "CA GLUC VL 10% 100ML", "UOM": "40 VIALS/CT", "Price": 535.66, "Source": "INV", "VendNumber": "584201", "OrderQty": 40, "Location": "6D5A"},
		{"MedId": "", "ItemNumber": "243473", "ItemDescription": "MIDAZOLAM SYRUP 2MG/ML 118ML", "UOM": "None", "Price": 42.69, "Source": "W/S", "VendNumber": "3708963", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "244164", "ItemDescription": "DEGARELIX KIT 240MG (2X120MG)", "UOM": "None", "Price": 800.29, "Source": "W/S", "VendNumber": "4894218", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "244165", "ItemDescription": "PHENOBARB EL 16OZ", "UOM": "None", "Price": 63.55, "Source": "W/S", "VendNumber": "2089019", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "244166", "ItemDescription": "DIAZOXIDE SUSP 50MG/ML 30ML", "UOM": "None", "Price": 265.87, "Source": "W/S", "VendNumber": "1684133", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "244506", "ItemDescription": "ATORVASTATIN TAB 40MG", "UOM": "90 TABS/BO", "Price": 8.757, "Source": "INV", "VendNumber": "180067", "OrderQty": 90, "Location": "2A4A"},
		{"MedId": "", "ItemNumber": "244507", "ItemDescription": "AMMONIUM LACTATE LOT 225GM", "UOM": "None", "Price": 2.91, "Source": "INV", "VendNumber": "448803", "OrderQty": 1, "Location": "1D4C"},
		{"MedId": "", "ItemNumber": "244541", "ItemDescription": "PROPOFOL VL 20ML", "UOM": "10 VIALS/CT", "Price": 21.19, "Source": "INV", "VendNumber": "215798", "OrderQty": 10, "Location": "8D3A"},
		{"MedId": "", "ItemNumber": "244735", "ItemDescription": "PEDIARIX VL", "UOM": "10 VIALS/CT", "Price": 522.72, "Source": "INV", "VendNumber": "090464", "OrderQty": 10, "Location": "10C4B"},
		{"MedId": "", "ItemNumber": "244866", "ItemDescription": "IBUPROFEN LIQ 8OZ", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "244882", "ItemDescription": "AMIODARONE TAB 200MG", "UOM": "500 TABS/BO", "Price": 54.35, "Source": "INV", "VendNumber": "555161", "OrderQty": 500, "Location": "2A1G"},
		{"MedId": "", "ItemNumber": "244884", "ItemDescription": "VIAL STERILE EMPTY 10ML", "UOM": "25 VIALS/CT", "Price": 27.39, "Source": "INV", "VendNumber": "383141", "OrderQty": 25, "Location": "5F3B"},
		{"MedId": "", "ItemNumber": "244885", "ItemDescription": "DIPHENHYD ELIX 16OZ", "UOM": "None", "Price": 1.91, "Source": "W/S", "VendNumber": "737544", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "244886", "ItemDescription": "NAFCILLIN 1GM", "UOM": "10 VIALS/CT", "Price": 47.91, "Source": "INV", "VendNumber": "4806279", "OrderQty": 10, "Location": "5A4B"},
		{"MedId": "", "ItemNumber": "244887", "ItemDescription": "ONDANSETRON TAB 8MG", "UOM": "30 TABS/BO", "Price": 5.199, "Source": "INV", "VendNumber": "4518643", "OrderQty": 30, "Location": "2F3E"},
		{"MedId": "", "ItemNumber": "244941", "ItemDescription": "CONTRAST PROHANCE 279.3MG 20ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "245004", "ItemDescription": "ABACAVIR/LAMIVUD TAB 600/300", "UOM": "30 TABS/BO", "Price": 193.77, "Source": "W/S", "VendNumber": "572321", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "245005", "ItemDescription": "ABACAVIR/LAMIVUD/ZIDO TAB", "UOM": "60 TABS/BO", "Price": 1321.2, "Source": "W/S", "VendNumber": "4880118", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "245006", "ItemDescription": "EMTRICITABINE RILPIV/TENOF TAB", "UOM": "30 TABS/BO", "Price": 1916.4, "Source": "W/S", "VendNumber": "4511390", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "245007", "ItemDescription": "EFAVIRENZ/EMTRICIT/TENOF TAB", "UOM": "30 TABS/BO", "Price": 2347.6998, "Source": "W/S", "VendNumber": "031430", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "245008", "ItemDescription": "NELFINAVIR TAB 625MG", "UOM": "120 TABS/BO", "Price": 909.6, "Source": "W/S", "VendNumber": "3574647", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "245036", "ItemDescription": "HYDROXYZINE PAM CAP 25MG", "UOM": "500 CAPS/BO", "Price": 24.45, "Source": "INV", "VendNumber": "334476", "OrderQty": 500, "Location": "2D1I"},
		{"MedId": "", "ItemNumber": "245037", "ItemDescription": "HYDROXYZINE PAM CAP 50MG", "UOM": "500 CAPS/BO", "Price": 31.28, "Source": "INV", "VendNumber": "304493", "OrderQty": 500, "Location": "2D1J"},
		{"MedId": "", "ItemNumber": "245039", "ItemDescription": "DOPAMINE 400MG/D5W 250ML", "UOM": "18 BAGS/CS", "Price": 162.1206, "Source": "INV", "VendNumber": "2126548", "OrderQty": 18, "Location": "7A1B"},
		{"MedId": "", "ItemNumber": "245058", "ItemDescription": "BUMETANIDE VL 2.5MG 10ML", "UOM": "10 VIALS/CT", "Price": 16.63, "Source": "INV", "VendNumber": "169399", "OrderQty": 10, "Location": "3D4A"},
		{"MedId": "", "ItemNumber": "245059", "ItemDescription": "FERROUS SULF LIQ 16OZ", "UOM": "None", "Price": 2.81, "Source": "INV", "VendNumber": "370692", "OrderQty": 1, "Location": "6A6F"},
		{"MedId": "", "ItemNumber": "245095", "ItemDescription": "FLUIDOSE SMALL CUP 15ML", "UOM": "2000/CA", "Price": 180, "Source": "W/S", "VendNumber": "5002-BN", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "245096", "ItemDescription": "FLUIDOSE LARGE CUP 35ML", "UOM": "2000/CA", "Price": 190, "Source": "W/S", "VendNumber": "5007-BN", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "245097", "ItemDescription": "FLUIDOSE LIDSTOCK", "UOM": "1000/RL 4/CA", "Price": 215, "Source": "W/S", "VendNumber": "5001", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "245098", "ItemDescription": "FLUIDOSE THERMAL RIBBON", "UOM": "6RL/CA", "Price": 185, "Source": "W/S", "VendNumber": "T002P", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "245102", "ItemDescription": "VANCOMYCIN ADV 500MG PS2", "UOM": "25 VI/CT", "Price": 43.29, "Source": "INV", "VendNumber": "051144", "OrderQty": 25, "Location": "5E6B"},
		{"MedId": "", "ItemNumber": "245351", "ItemDescription": "ALBENDAZOLE TAB 200MG", "UOM": "2 TABLETS/CT", "Price": 336.76, "Source": "W/S", "VendNumber": "149993", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "245352", "ItemDescription": "COCAINE TOPICAL SOL 4% 4ML", "UOM": "None", "Price": 74.87, "Source": "W/S", "VendNumber": "4136529", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "245726", "ItemDescription": "HAEMOPHILUS B VL (PEDVAXHIB)", "UOM": "10 VIALS/CT", "Price": 233.13, "Source": "INV", "VendNumber": "568360", "OrderQty": 10, "Location": "10A6B"},
		{"MedId": "", "ItemNumber": "245824", "ItemDescription": "PERTUZUMAB VL 420MG 14ML", "UOM": "None", "Price": 4724.82, "Source": "W/S", "VendNumber": "206342", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "245883", "ItemDescription": "NITROGLY 25MG/D5W 250ML", "UOM": "12 BOTTLES/CA", "Price": 87.87, "Source": "INV", "VendNumber": "546945", "OrderQty": 12, "Location": "8B5B"},
		{"MedId": "", "ItemNumber": "246235", "ItemDescription": "POLIOVIRUS VAC VL (10 DOSE)", "UOM": "None", "Price": 272.66, "Source": "INV", "VendNumber": "395608", "OrderQty": 1, "Location": "10C5B"},
		{"MedId": "", "ItemNumber": "246460", "ItemDescription": "CLOPIDOGREL TAB 75 MG", "UOM": "90 TABS/BO", "Price": 7.08, "Source": "INV", "VendNumber": "186395", "OrderQty": 90, "Location": "2B5B"},
		{"MedId": "", "ItemNumber": "246658", "ItemDescription": "CALCIUM CARBONATE CHEW 1000MG", "UOM": "72 TABS/BO", "Price": 1.368, "Source": "INV", "VendNumber": "443317", "OrderQty": 72, "Location": "2A6E"},
		{"MedId": "", "ItemNumber": "246659", "ItemDescription": "GLOVE W/SLEEVE F/ISOLATOR 8IN", "UOM": "None", "Price": 153.47, "Source": "W/S", "VendNumber": "40698", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "246955", "ItemDescription": "ROPIVAC VL 0.5% 20ML", "UOM": "25 VIALS/CT", "Price": 105.69, "Source": "INV", "VendNumber": "194249", "OrderQty": 25, "Location": "5D3C"},
		{"MedId": "", "ItemNumber": "246956", "ItemDescription": "PHARM WIPE NONLINT 12", "UOM": "1500/CASE", "Price": 17.31, "Source": "W/S", "VendNumber": "028706", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "246973", "ItemDescription": "CARFILZOMIB VL 60MG", "UOM": "None", "Price": 2048.38, "Source": "W/S", "VendNumber": "184341", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "246974", "ItemDescription": "BRENTUXIMAB VL 50MG", "UOM": "None", "Price": 5862, "Source": "W/S", "VendNumber": "4515011", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "247013", "ItemDescription": "AMOX/CLAV TAB 875MG", "UOM": "100 TABS/BO", "Price": 40.47, "Source": "W/S", "VendNumber": "968329", "OrderQty": 1, "Location": "2A2K"},
		{"MedId": "", "ItemNumber": "247038", "ItemDescription": "PAD PREP ALCOHOL MED 2-PLY ST", "UOM": "None", "Price": 20.27, "Source": "W/S", "VendNumber": "KC5750", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "247051", "ItemDescription": "SYR LUER-LOK TIP 30ML", "UOM": "None", "Price": 42.7, "Source": "W/S", "VendNumber": "BF302832", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "247073", "ItemDescription": "ETHANOL 98% VL 5ML", "UOM": "10 VIALS/CT", "Price": 865.74, "Source": "W/S", "VendNumber": "150925", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "247407", "ItemDescription": "AMLODIPINE TAB 5MG", "UOM": "500 TABS/BO", "Price": 7.1, "Source": "INV", "VendNumber": "467567", "OrderQty": 500, "Location": "2A2F"},
		{"MedId": "", "ItemNumber": "247749", "ItemDescription": "FAMOTIDINE TAB 20MG", "UOM": "500 TABS/BO", "Price": 23.66, "Source": "W/S", "VendNumber": "075111", "OrderQty": 1, "Location": "2C3J"},
		{"MedId": "", "ItemNumber": "247750", "ItemDescription": "METHYLERGONO TAB .2MG", "UOM": "28 TABS/BO", "Price": 1604.39, "Source": "W/S", "VendNumber": "525372", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "247783", "ItemDescription": "DEGARELIX VL 80MG", "UOM": "None", "Price": 283, "Source": "W/S", "VendNumber": "4894200", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "247784", "ItemDescription": "ADO-TRASTUZUMAB VL 100MG", "UOM": "None", "Price": 2900.25, "Source": "W/S", "VendNumber": "213797", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "247785", "ItemDescription": "ADO-TRASTUZUMAB VL 160MG", "UOM": "None", "Price": 4437.71, "Source": "W/S", "VendNumber": "4831608", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "247922", "ItemDescription": "CONTAINER SHARP CHEMO 18GAL", "UOM": "None", "Price": 85.21, "Source": "W/S", "VendNumber": "8939PG2", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "248030", "ItemDescription": "LEVOTHYROX VL 100MCG", "UOM": "None", "Price": 87.5, "Source": "INV", "VendNumber": "553521", "OrderQty": 1, "Location": "4E3A"},
		{"MedId": "", "ItemNumber": "248031", "ItemDescription": "SUFENTANIL VL 100MCG 2ML", "UOM": "10 VIALS/CT", "Price": 31.93, "Source": "W/S", "VendNumber": "077730", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "248114", "ItemDescription": "LACOSAMIDE VL 200MG 20ML", "UOM": "10 VIALS/CT", "Price": 346.77, "Source": "W/S", "VendNumber": "389820", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "248115", "ItemDescription": "APIXABAN TAB 2.5MG", "UOM": "100 TABS/BO", "Price": 447.12, "Source": "W/S", "VendNumber": "203618", "OrderQty": 1, "Location": "2A3A"},
		{"MedId": "", "ItemNumber": "248116", "ItemDescription": "APIXABAN TAB 5MG", "UOM": "100 TABS/BO", "Price": 447.12, "Source": "W/S", "VendNumber": "203606", "OrderQty": 1, "Location": "2A3B"},
		{"MedId": "", "ItemNumber": "248117", "ItemDescription": "TOLVAPTAN TAB 15MG", "UOM": "10 TABS/BO", "Price": 3685.42, "Source": "W/S", "VendNumber": "357835", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "248118", "ItemDescription": "TOLVAPTAN TAB 30MG", "UOM": "10 TABS/BO", "Price": 3344, "Source": "W/S", "VendNumber": "4228276", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "248140", "ItemDescription": "CONTRAST PROHANCE 279.3MG 10ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "248141", "ItemDescription": "CONTRAST PROHANCE MPK 50ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "248526", "ItemDescription": "CINACALCET TAB 60MG", "UOM": "30 TABS/BO", "Price": 1573.071, "Source": "W/S", "VendNumber": "979979", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "248527", "ItemDescription": "CINACALCET TAB 90MG", "UOM": "30 TABS/BO", "Price": 2309.991, "Source": "W/S", "VendNumber": "3565884", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "248756", "ItemDescription": "CLEAN ROOM WIPE 9X9", "UOM": "12 EA/CA", "Price": 19.09, "Source": "W/S", "VendNumber": "279463", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "248757", "ItemDescription": "CLEAN ROOM TACKY MAT 18X36", "UOM": "None", "Price": 57.06, "Source": "W/S", "VendNumber": "4454138", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "248851", "ItemDescription": "TRANEXAMIC AMP 1000MG 10ML", "UOM": "10 VIALS/CT", "Price": 119.27, "Source": "INV", "VendNumber": "236364", "OrderQty": 10, "Location": "5E5A"},
		{"MedId": "", "ItemNumber": "249054", "ItemDescription": "PAPAVERINE VL 60MG 2ML", "UOM": "25 VIALS/CT", "Price": 304.86, "Source": "INV", "VendNumber": "880620", "OrderQty": 25, "Location": "5C4A"},
		{"MedId": "", "ItemNumber": "249462", "ItemDescription": "DOXYCYCLINE CAP 100MG", "UOM": "50 CAPS/BO", "Price": 14.83, "Source": "W/S", "VendNumber": "534966", "OrderQty": 1, "Location": "2C2L"},
		{"MedId": "", "ItemNumber": "249463", "ItemDescription": "LACOSAMIDE TAB 100MG", "UOM": "60 TABS/BO", "Price": 765.12, "Source": "W/S", "VendNumber": "190532", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "249601", "ItemDescription": "BAG ZIPLOCK 10X8 2ML CLR", "UOM": "None", "Price": 24.44, "Source": "W/S", "VendNumber": "RDPA29", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "249674", "ItemDescription": "TREPROSTINIL (TYVASO) NEB", "UOM": "4 NEBS/CT", "Price": 2216.24, "Source": "W/S", "VendNumber": "A-4 NEB", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "249979", "ItemDescription": "DOPAMINE 800MG/D5W 250ML", "UOM": "18 BAGS/CA", "Price": 233.59, "Source": "INV", "VendNumber": "2502839", "OrderQty": 18, "Location": "7A2A"},
		{"MedId": "", "ItemNumber": "249980", "ItemDescription": "CISATRACURIUM VL 5ML", "UOM": "10 VIALS/CT", "Price": 69.54, "Source": "INV", "VendNumber": "419541", "OrderQty": 10, "Location": "11F4A"},
		{"MedId": "", "ItemNumber": "250111", "ItemDescription": "ATAZANAVIR CAP 200MG", "UOM": "60 CAPS/BO", "Price": 1194.6, "Source": "W/S", "VendNumber": "3503943", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "250181", "ItemDescription": "GOWN ISOL MED WT SDTIE YEL", "UOM": "None", "Price": 47.64, "Source": "W/S", "VendNumber": "NONLV240", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "250372", "ItemDescription": "TOBRAMYCIN INJECT POW 1.2GM", "UOM": "6 VIALS/CT", "Price": 380.3802, "Source": "INV", "VendNumber": "345177", "OrderQty": 6, "Location": "5E4E"},
		{"MedId": "", "ItemNumber": "250374", "ItemDescription": "ADENOSINE VL 6MG", "UOM": "25 VIALS/CT", "Price": 48.74, "Source": "INV", "VendNumber": "219006", "OrderQty": 25, "Location": "3C1C"},
		{"MedId": "", "ItemNumber": "250375", "ItemDescription": "LEUCOVORIN VL 200MG", "UOM": "None", "Price": 14.91, "Source": "INV", "VendNumber": "151027", "OrderQty": 1, "Location": "4E1A"},
		{"MedId": "", "ItemNumber": "250377", "ItemDescription": "TRETINOIN CAP 10MG", "UOM": "30 CAPS/BO", "Price": 0.01, "Source": "W/S", "VendNumber": "4903183", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "250380", "ItemDescription": "SUCCINYLCHO FTV200MG/10ML", "UOM": "10 VIALS/CT", "Price": 142.76, "Source": "INV", "VendNumber": "681213", "OrderQty": 10, "Location": "11F1A"},
		{"MedId": "", "ItemNumber": "250381", "ItemDescription": "METFORMIN TAB SR 750MG", "UOM": "100 TABS/BO", "Price": 4, "Source": "W/S", "VendNumber": "3709144", "OrderQty": 1, "Location": "2E2A"},
		{"MedId": "", "ItemNumber": "250384", "ItemDescription": "OXYCODONE TAB 10MG", "UOM": "100 TABS/BO", "Price": 12.23, "Source": "W/S", "VendNumber": "030460", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "250511", "ItemDescription": "NITROGLY 50MG/D5W 250ML", "UOM": "12 BO/CA", "Price": 68.5296, "Source": "INV", "VendNumber": "673210", "OrderQty": 12, "Location": "12A4A"},
		{"MedId": "", "ItemNumber": "250892", "ItemDescription": "FOSAPREPITANT VL 150MG", "UOM": "None", "Price": 282.18, "Source": "W/S", "VendNumber": "050183", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "250895", "ItemDescription": "DOLUTEGRAVIR TAB 50MG", "UOM": "30 TABLETS/BO", "Price": 1414.83, "Source": "W/S", "VendNumber": "241214", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "250925", "ItemDescription": "SOD TETRADECYL 3% VL 2ML", "UOM": "5 VIALS/CT", "Price": 283.57, "Source": "W/S", "VendNumber": "SOT16302", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "250993", "ItemDescription": "LACTOBACILLUS RHAMNOSUS CAP", "UOM": "30 CAP/BO", "Price": 13.029, "Source": "W/S", "VendNumber": "026898", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "250995", "ItemDescription": "CONTRAST GADAVIST INJ 65ML", "UOM": "None", "Price": 2075.566, "Source": "INV", "VendNumber": "138412", "OrderQty": 1, "Location": "4C4B"},
		{"MedId": "", "ItemNumber": "251009", "ItemDescription": "BAG CMPD EVA TPN NDEHP 3000ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "251173", "ItemDescription": "FLUBLOK VL 0.5ML", "UOM": "10 VIALS/CT", "Price": 407.5, "Source": "INV", "VendNumber": "FLU411710", "OrderQty": 10, "Location": "11A1A"},
		{"MedId": "", "ItemNumber": "251247", "ItemDescription": "TBO-FILGRASTIM SYR 300MCG 0.5M", "UOM": "10 SYRINGES/CT", "Price": 1507.31, "Source": "INV", "VendNumber": "253062", "OrderQty": 10, "Location": "10C7B"},
		{"MedId": "", "ItemNumber": "251248", "ItemDescription": "TBO-FILGRASTIM SYR 480MCG 0.8M", "UOM": "10 SYRINGES/CT", "Price": 2412.33, "Source": "INV", "VendNumber": "253021", "OrderQty": 10, "Location": "10C7C"},
		{"MedId": "", "ItemNumber": "251249", "ItemDescription": "SOD CHL INH 3% 4ML", "UOM": "60 EACH/ CT", "Price": 9.198, "Source": "W/S", "VendNumber": "642367", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "251422", "ItemDescription": "VIT K INJECT 1MG/0.5ML", "UOM": "10 SYR/CT", "Price": 161.09, "Source": "INV", "VendNumber": "257618", "OrderQty": 10, "Location": "5F4B"},
		{"MedId": "", "ItemNumber": "251423", "ItemDescription": "BUDESONIDE CAP ER 9MG", "UOM": "30 CAPS/BO", "Price": 1537.071, "Source": "W/S", "VendNumber": "4814877", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "251479", "ItemDescription": "FLUCONAZOLE SUSP 40MG/ML 35ML", "UOM": "None", "Price": 20.71, "Source": "INV", "VendNumber": "568394", "OrderQty": 1, "Location": "6A6G"},
		{"MedId": "", "ItemNumber": "251597", "ItemDescription": "HYDROXYPROGEST VL 1.25GM/5ML", "UOM": "None", "Price": 3639.75, "Source": "W/S", "VendNumber": "139956", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "251703", "ItemDescription": "HYDROCOD/APAP LIQ 7.5/325 16OZ", "UOM": "None", "Price": 11.06, "Source": "W/S", "VendNumber": "350001", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "251750", "ItemDescription": "LEUPROLIDE INJECT 45MG", "UOM": "None", "Price": 746.01, "Source": "W/S", "VendNumber": "128722", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "251908", "ItemDescription": "INFLUENZA QUAD 0.5ML", "UOM": "10 VI/CT", "Price": 155, "Source": "INV", "VendNumber": "0907-52", "OrderQty": 10, "Location": "11A2A"},
		{"MedId": "", "ItemNumber": "251909", "ItemDescription": "OSELTAMIVIR LIQ 6MG/ML 60ML", "UOM": "None", "Price": 148.09, "Source": "W/S", "VendNumber": "241224", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "252272", "ItemDescription": "CAP CLAV SINGLE STERILE", "UOM": "50 CAPS/BX", "Price": 11, "Source": "W/S", "VendNumber": "2011501", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "252273", "ItemDescription": "CAP PRIMING CLAV STERILE", "UOM": "100 CAPS/CA", "Price": 22, "Source": "W/S", "VendNumber": "2011701", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "252275", "ItemDescription": "ADAPTER VIAL W/FILT CLAV 5ML", "UOM": "50 VIALS/CA", "Price": 138.5, "Source": "W/S", "VendNumber": "2011901", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "252276", "ItemDescription": "DEVICE VIAL UNIV CLAV ST", "UOM": "50 VIALS/CA", "Price": 144.5, "Source": "W/S", "VendNumber": "2013301", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "252277", "ItemDescription": "BAG SPIKE NON-REMOVE CLAV", "UOM": "50 EACH/BX", "Price": 102.5, "Source": "W/S", "VendNumber": "2012601", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "252278", "ItemDescription": "CONNECTOR SPIROS MALE CLAV", "UOM": "50 EACH/CA", "Price": 156, "Source": "W/S", "VendNumber": "2013001", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "252364", "ItemDescription": "GLOVE EXAM GRD STRCH VNYL SM", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "252365", "ItemDescription": "GLOVE EXAM GRD STRCH VNYL MED", "UOM": "None", "Price": 36.49, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "252366", "ItemDescription": "GLOVE EXAM GRD STRCH VNYL LG", "UOM": "None", "Price": 37.62, "Source": "W/S", "VendNumber": "FG1503", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "252367", "ItemDescription": "GLOVE EXAM GRD STRCH VNYL XLG", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "252369", "ItemDescription": "GLOVE EXAM GRD NITRILE PF SM", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "252370", "ItemDescription": "GLOVE EXAM GRD NITRILE PF MED", "UOM": "None", "Price": 78.69, "Source": "W/S", "VendNumber": "FG2502", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "252371", "ItemDescription": "GLOVE EXAM GRD NITRILE PF LG", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "252372", "ItemDescription": "GLOVE EXAM GRD NITRILE PF XLG", "UOM": "None", "Price": 80.44, "Source": "W/S", "VendNumber": "FG2504", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "252552", "ItemDescription": "METOPROLOL TAB XL 50MG", "UOM": "1000 TABS/BO", "Price": 448.3, "Source": "INV", "VendNumber": "422808", "OrderQty": 1000, "Location": "2E4B"},
		{"MedId": "", "ItemNumber": "252862", "ItemDescription": "CLOBETASOL 0.05% OINT 15 GM", "UOM": "None", "Price": 25.73, "Source": "INV", "VendNumber": "038877", "OrderQty": 1, "Location": "1D5F"},
		{"MedId": "", "ItemNumber": "252863", "ItemDescription": "CLOBETASOL 0.05% CRM 15 GM", "UOM": "None", "Price": 23.89, "Source": "INV", "VendNumber": "045898", "OrderQty": 1, "Location": "1D5E"},
		{"MedId": "", "ItemNumber": "253056", "ItemDescription": "NALBUPHINE 20MG/ML SDV", "UOM": "10 VIALS/CT", "Price": 49.92, "Source": "INV", "VendNumber": "376970", "OrderQty": 10, "Location": "5A5A"},
		{"MedId": "", "ItemNumber": "253118", "ItemDescription": "METOPROLOL TAB XL 25MG", "UOM": "1000 TABS/BO", "Price": 457.2, "Source": "W/S", "VendNumber": "006049", "OrderQty": 1, "Location": "2E3D"},
		{"MedId": "", "ItemNumber": "253139", "ItemDescription": "VIAL SPIKE UNIV VENTED CLAV", "UOM": "50 EACH/BX", "Price": 130, "Source": "W/S", "VendNumber": "2012501", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "253182", "ItemDescription": "ESCITALOPRAM TAB 5MG", "UOM": "100 TABS/BO", "Price": 8.19, "Source": "INV", "VendNumber": "285106", "OrderQty": 100, "Location": "2C3F"},
		{"MedId": "", "ItemNumber": "253183", "ItemDescription": "ESCITALOPRAM TAB 10MG", "UOM": "100 TABS/BO", "Price": 7.97, "Source": "INV", "VendNumber": "285116", "OrderQty": 100, "Location": "2C3G"},
		{"MedId": "", "ItemNumber": "253184", "ItemDescription": "ESCITALOPRAM TAB 20MG", "UOM": "100 TABS/BO", "Price": 11.68, "Source": "INV", "VendNumber": "285142", "OrderQty": 100, "Location": "2C3H"},
		{"MedId": "", "ItemNumber": "253410", "ItemDescription": "KCENTRA VL +500IU", "UOM": "SEND 500-550 IU RANGE", "Price": 784.34, "Source": "W/S", "VendNumber": "485599", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "253499", "ItemDescription": "ACETAMIN 120ML 160MG/5ML", "UOM": "None", "Price": 0.95, "Source": "INV", "VendNumber": "2585743", "OrderQty": 1, "Location": "6A1A"},
		{"MedId": "", "ItemNumber": "253949", "ItemDescription": "FLUVOXAMINE TAB 50 MG", "UOM": "100 TABS/BO", "Price": 36.53, "Source": "W/S", "VendNumber": "3414349", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "253950", "ItemDescription": "FLUVOXAMINE TAB 100MG", "UOM": "100 TABS/BO", "Price": 42, "Source": "W/S", "VendNumber": "3414372", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "253951", "ItemDescription": "MEMANTINE XR CAP 7 MG", "UOM": "30 CAPS/BO", "Price": 362.06, "Source": "W/S", "VendNumber": "4876728", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "253952", "ItemDescription": "MEMANTINE XR CAP 14MG", "UOM": "30 CAPS/BO", "Price": 356.841, "Source": "W/S", "VendNumber": "223490", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "253957", "ItemDescription": "HEPARIN 25KU 0.45NACL 250ML", "UOM": "24 BAGS/CA", "Price": 99.6912, "Source": "INV", "VendNumber": "F000208439", "OrderQty": 24, "Location": "13A2A"},
		{"MedId": "", "ItemNumber": "254047", "ItemDescription": "CEFOTAXIME VL 1GM", "UOM": "25 VIALS/CT", "Price": 30.09, "Source": "INV", "VendNumber": "241740", "OrderQty": 25, "Location": "3E5B"},
		{"MedId": "", "ItemNumber": "254131", "ItemDescription": "LISINOPRIL TAB 5MG", "UOM": "100 TABS/BO", "Price": 1.44, "Source": "INV", "VendNumber": "277754", "OrderQty": 100, "Location": "2D5K"},
		{"MedId": "", "ItemNumber": "254173", "ItemDescription": "DULOXETINE CAP 20MG", "UOM": "60 CAPS/BO", "Price": 25.23, "Source": "INV", "VendNumber": "285066", "OrderQty": 60, "Location": "2C2N"},
		{"MedId": "", "ItemNumber": "254174", "ItemDescription": "DULOXETINE CAP 30MG", "UOM": "30 EA/BO", "Price": 10.89, "Source": "INV", "VendNumber": "285072", "OrderQty": 30, "Location": "2C2O"},
		{"MedId": "", "ItemNumber": "254175", "ItemDescription": "DULOXETINE CAP 60MG", "UOM": "30 CAPS/BO", "Price": 7.539, "Source": "INV", "VendNumber": "285092", "OrderQty": 30, "Location": "2C2P"},
		{"MedId": "", "ItemNumber": "254198", "ItemDescription": "ACETAMINOPHEN TAB 325MG UD", "UOM": "1000 TABS/CT", "Price": 13.7, "Source": "INV", "VendNumber": "287342", "OrderQty": 1000, "Location": "6C5A"},
		{"MedId": "", "ItemNumber": "254303", "ItemDescription": "LEVETIRACETAM TAB 750MG", "UOM": "100 TABS/BO", "Price": 20.73, "Source": "INV", "VendNumber": "363251", "OrderQty": 100, "Location": "2D4G"},
		{"MedId": "", "ItemNumber": "254304", "ItemDescription": "CEFTRIAXONE VL 1GM", "UOM": "25 VIALS/CT", "Price": 24.88, "Source": "INV", "VendNumber": "273399", "OrderQty": 25, "Location": "3F1B"},
		{"MedId": "", "ItemNumber": "254319", "ItemDescription": "METFORMIN TAB SR 500MG", "UOM": "50 TABS/BO", "Price": 6.37, "Source": "INV", "VendNumber": "086809", "OrderQty": 50, "Location": "2E1H"},
		{"MedId": "", "ItemNumber": "254321", "ItemDescription": "LORATADINE TAB 10MG", "UOM": "300 TABS/BO", "Price": 9.54, "Source": "INV", "VendNumber": "204602", "OrderQty": 300, "Location": "2D6E"},
		{"MedId": "", "ItemNumber": "254370", "ItemDescription": "MIRTAZAPINE TAB 30MG", "UOM": "100 TABS/BO", "Price": 15.66, "Source": "INV", "VendNumber": "741936", "OrderQty": 100, "Location": "2E5I"},
		{"MedId": "", "ItemNumber": "254372", "ItemDescription": "ATOVAQUONE LIQ 750MG 5ML 210ML", "UOM": "None", "Price": 644.52, "Source": "INV", "VendNumber": "284036", "OrderQty": 1, "Location": "6A2F"},
		{"MedId": "", "ItemNumber": "254373", "ItemDescription": "FENOFIBRATE CAP 67 MG", "UOM": "90 CAPS/BO", "Price": 55.17, "Source": "W/S", "VendNumber": "232780", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "254394", "ItemDescription": "ZOLEDRONIC ACID 5MG 100ML", "UOM": "None", "Price": 134.61, "Source": "W/S", "VendNumber": "214419", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "254424", "ItemDescription": "BAG CLEAR ZIP 4X6IN", "UOM": "None", "Price": 8.08, "Source": "W/S", "VendNumber": "RDPA19", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "254425", "ItemDescription": "BAG ZIP 2MIL CLR 10X12", "UOM": "None", "Price": 40, "Source": "W/S", "VendNumber": "RDPA41", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "254437", "ItemDescription": "DOXORUBICIN VL 200MG 100ML", "UOM": "None", "Price": 37.34, "Source": "W/S", "VendNumber": "4857884", "OrderQty": 1, "Location": "11C2B"},
		{"MedId": "", "ItemNumber": "254454", "ItemDescription": "OXYCODONE/ACET 5/325", "UOM": "500 TABS/BO", "Price": 39.99, "Source": "W/S", "VendNumber": "414560", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "254456", "ItemDescription": "BUPIV/EPI 0.25% 10ML", "UOM": "25 VIALS/CT", "Price": 31.78, "Source": "INV", "VendNumber": "063608", "OrderQty": 25, "Location": "3D6A"},
		{"MedId": "", "ItemNumber": "254479", "ItemDescription": "IBUPROFEN TAB 200MG UD", "UOM": "100 TABS/BX", "Price": 3.29, "Source": "INV", "VendNumber": "082267", "OrderQty": 100, "Location": "2D2A"},
		{"MedId": "", "ItemNumber": "254480", "ItemDescription": "BUPIV/EPI 0.5% SDV 30ML", "UOM": "25 VIALS/CT", "Price": 43.77, "Source": "INV", "VendNumber": "063503", "OrderQty": 25, "Location": "3D6B"},
		{"MedId": "", "ItemNumber": "254532", "ItemDescription": "HALOPERIDOL DEC VL 100MG 1ML", "UOM": "None", "Price": 32.24, "Source": "W/S", "VendNumber": "2741205", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "254577", "ItemDescription": "DEXMEDETOMIDINE 200MCG 2ML", "UOM": "25 VIALS/CT", "Price": 145.06, "Source": "INV", "VendNumber": "544837", "OrderQty": 25, "Location": "6F1B"},
		{"MedId": "", "ItemNumber": "254893", "ItemDescription": "PLASM HUMATE-P 1000 RCOF", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "255240", "ItemDescription": "AIRWAY ORAL BRMN SZ1 60MM BLK", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "255274", "ItemDescription": "SERTRALINE TAB 100MG 500 TABS/", "UOM": "BO", "Price": 21.54, "Source": "INV", "VendNumber": "381184", "OrderQty": 1, "Location": "3A5D"},
		{"MedId": "", "ItemNumber": "255390", "ItemDescription": "BUPROPION SR TAB 150MG", "UOM": "500 TABS/BO", "Price": 63.75, "Source": "INV", "VendNumber": "554992", "OrderQty": 500, "Location": "2A5H"},
		{"MedId": "", "ItemNumber": "255392", "ItemDescription": "METOPROLOL TAB 25MG", "UOM": "500 TABS/BO", "Price": 14.4, "Source": "INV", "VendNumber": "437158", "OrderQty": 500, "Location": "2E3C"},
		{"MedId": "", "ItemNumber": "255597", "ItemDescription": "GOWN CHEMOPLUS DISP LG", "UOM": "None", "Price": 112.04, "Source": "W/S", "VendNumber": "573838", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "255604", "ItemDescription": "FLUOXETINE LIQ 20MG/5ML 120ML", "UOM": "None", "Price": 3.16, "Source": "INV", "VendNumber": "607527", "OrderQty": 1, "Location": "6B1A"},
		{"MedId": "", "ItemNumber": "255605", "ItemDescription": "GABAPENTIN CAP 300MG", "UOM": "100 CAPS/BO", "Price": 9.61, "Source": "INV", "VendNumber": "327751", "OrderQty": 100, "Location": "2C5B"},
		{"MedId": "", "ItemNumber": "255606", "ItemDescription": "TRAMADOL TAB 50MG UD", "UOM": "100 TABS/BX", "Price": 6.39, "Source": "W/S", "VendNumber": "588107", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "255628", "ItemDescription": "IC GREEN DYE", "UOM": "6 VIALS/CT", "Price": 464.04, "Source": "INV", "VendNumber": "520916", "OrderQty": 6, "Location": "4D4B"},
		{"MedId": "", "ItemNumber": "255637", "ItemDescription": "CYCLOPHOSPHAMIDE VL 1G", "UOM": "None", "Price": 444.39, "Source": "W/S", "VendNumber": "358130", "OrderQty": 1, "Location": "999A"},
		{"MedId": "", "ItemNumber": "255696", "ItemDescription": "CETUXIMAB VL 200MG", "UOM": "None", "Price": 1085.72, "Source": "W/S", "VendNumber": "092577", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "255714", "ItemDescription": "ENVELOPE SEC TMPALRT 9X12", "UOM": "None", "Price": 69.5, "Source": "W/S", "VendNumber": "TE1000", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "255872", "ItemDescription": "HYDROCOD/APAP TAB 5/325 BULK", "UOM": "100 TABS/BO", "Price": 8.16, "Source": "W/S", "VendNumber": "566911", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "255873", "ItemDescription": "TRIPTORELIN LA 11.25 MG", "UOM": "None", "Price": 560.16, "Source": "W/S", "VendNumber": "4086559", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "255874", "ItemDescription": "RAMUCIRUMAB VL 10MG/ML 10ML", "UOM": "None", "Price": 1020, "Source": "W/S", "VendNumber": "4982419", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "255875", "ItemDescription": "GONAK SOL 15ML (ENDO ONLY)", "UOM": "None", "Price": 6.33, "Source": "W/S", "VendNumber": "3572104", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "255876", "ItemDescription": "PHENYLEPHRINE VL 50MG/5ML", "UOM": "10 VIALS/CT", "Price": 221.04, "Source": "INV", "VendNumber": "351643", "OrderQty": 10, "Location": "5C5A"},
		{"MedId": "", "ItemNumber": "255938", "ItemDescription": "LIDOCAINE JELLY 2% 11ML (GLYDO", "UOM": "10 SYRINGES/CT", "Price": 52.65, "Source": "INV", "VendNumber": "347599", "OrderQty": 10, "Location": "7E5A"},
		{"MedId": "", "ItemNumber": "255939", "ItemDescription": "NICOTINE PATCH 7MG", "UOM": "14 PATCH/BX", "Price": 23.8602, "Source": "INV", "VendNumber": "414944", "OrderQty": 14, "Location": "1F3A"},
		{"MedId": "", "ItemNumber": "256076", "ItemDescription": "VEDOLIZUMAB VL 300MG", "UOM": "None", "Price": 4819, "Source": "W/S", "VendNumber": "4989216", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "256077", "ItemDescription": "VAGINAL APPLICATOR", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "256174", "ItemDescription": "EPHEDRINE SYR 50MG 10ML", "UOM": "25 SYR/CA", "Price": 1571.25, "Source": "W/S", "VendNumber": "3304NO", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "256175", "ItemDescription": "PHENYLEPHRINE SYR 400MCG 10ML", "UOM": "25 SYR/CA", "Price": 106.25, "Source": "W/S", "VendNumber": "3312NO", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "256176", "ItemDescription": "MONTELUKAST TAB 10MG", "UOM": "500 TABS/BO", "Price": 53, "Source": "INV", "VendNumber": "204659", "OrderQty": 500, "Location": "2E6A"},
		{"MedId": "", "ItemNumber": "256354", "ItemDescription": "POT CHL TAB 8MEQ", "UOM": "100 TABS/BO", "Price": 30, "Source": "W/S", "VendNumber": "5012117", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "256396", "ItemDescription": "AIRWAY BERMAN 90MM YELLOW", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "256418", "ItemDescription": "PREDNISONE LIQ 5MG/5ML BULK", "UOM": "None", "Price": 25.45, "Source": "W/S", "VendNumber": "361451", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "256608", "ItemDescription": "PHENAZOPYRIDINE TAB 95MG", "UOM": "30 TABS/BO", "Price": 5.5098, "Source": "INV", "VendNumber": "704940", "OrderQty": 30, "Location": "2F5D"},
		{"MedId": "", "ItemNumber": "256609", "ItemDescription": "ROPIVAC VL 2MG/ML 10ML", "UOM": "10 VIALS/CT", "Price": 13.91, "Source": "INV", "VendNumber": "342586", "OrderQty": 10, "Location": "5D3B"},
		{"MedId": "", "ItemNumber": "256717", "ItemDescription": "PYRIDOXINE TAB 25MG", "UOM": "100 TABS/BO", "Price": 1.51, "Source": "W/S", "VendNumber": "773150", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "256719", "ItemDescription": "CYANOCOBAL TAB 500MCG", "UOM": "130 TABS/BX", "Price": 1.84, "Source": "W/S", "VendNumber": "714253", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "256720", "ItemDescription": "GLYBURIDE TAB 1.25MG", "UOM": "100 TABS/BO", "Price": 3, "Source": "W/S", "VendNumber": "3169208", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "256721", "ItemDescription": "METOCLOPRAM TAB 5MG", "UOM": "100 TABS/BO", "Price": 2.83, "Source": "INV", "VendNumber": "586594", "OrderQty": 100, "Location": "2E2F"},
		{"MedId": "", "ItemNumber": "256722", "ItemDescription": "PROMETHAZINE TAB 12.5MG", "UOM": "100 TABS/BO", "Price": 4.97, "Source": "W/S", "VendNumber": "254664", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "256723", "ItemDescription": "LISINOPRIL TAB 2.5MG", "UOM": "500 TABS/BO", "Price": 5.49, "Source": "W/S", "VendNumber": "368163", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "256724", "ItemDescription": "GENIE VIAL DEVICE (50/CS)", "UOM": "50 EA/CS", "Price": 228.5, "Source": "W/S", "VendNumber": "2013201", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "256867", "ItemDescription": "MILRINONE VL 20MG 20ML", "UOM": "10 VIALS/CT", "Price": 64.84, "Source": "INV", "VendNumber": "506670", "OrderQty": 10, "Location": "5A3C"},
		{"MedId": "", "ItemNumber": "256868", "ItemDescription": "PHENYTOIN CAP 100MG", "UOM": "100 CAPS/BX", "Price": 35, "Source": "INV", "VendNumber": "015966", "OrderQty": 100, "Location": "2F5E"},
		{"MedId": "", "ItemNumber": "256970", "ItemDescription": "TIZANIDINE TAB 2MG", "UOM": "150 TABS/BO", "Price": 17.205, "Source": "W/S", "VendNumber": "516132", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "257049", "ItemDescription": "PACK BLSTR MEDICUP OVAL GRN", "UOM": "None", "Price": 28.6, "Source": "W/S", "VendNumber": "MD445", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "257050", "ItemDescription": "COVER LD/LBL BLSTR OVL BLU DOT", "UOM": "None", "Price": 31.2, "Source": "W/S", "VendNumber": "MD200", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "257246", "ItemDescription": "PREDLONE OPH SOL 1% 1ML", "UOM": "None", "Price": 21.58, "Source": "INV", "VendNumber": "631788", "OrderQty": 1, "Location": "1A5E"},
		{"MedId": "", "ItemNumber": "257247", "ItemDescription": "MIDODRINE TAB 5MG", "UOM": "100 TABS/BO", "Price": 48.82, "Source": "INV", "VendNumber": "115832", "OrderQty": 100, "Location": "2E5D"},
		{"MedId": "", "ItemNumber": "257248", "ItemDescription": "LIDOCAINE 2% W/EPI 20ML SDV", "UOM": "25 VIALS/CT", "Price": 116.74, "Source": "INV", "VendNumber": "095796", "OrderQty": 25, "Location": "4E5B"},
		{"MedId": "", "ItemNumber": "257345", "ItemDescription": "METHYLENE BLUE 1% 10ML", "UOM": "None", "Price": 36.98, "Source": "INV", "VendNumber": "F75138", "OrderQty": 1, "Location": "4F4C"},
		{"MedId": "", "ItemNumber": "257347", "ItemDescription": "RAMIPRIL CAP 2.5MG", "UOM": "500 CAPS/BO", "Price": 55.21, "Source": "W/S", "VendNumber": "4093936", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "257371", "ItemDescription": "SPLITTER PILL BLUE", "UOM": "None", "Price": 1.41, "Source": "W/S", "VendNumber": "NON135000", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "257491", "ItemDescription": "CYCLOPHOSPHAMIDE CAP 25MG", "UOM": "100 CAPS/BO", "Price": 469.22, "Source": "W/S", "VendNumber": "4998118", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "257514", "ItemDescription": "IMMUNE GLOB 10GM (OCTAGAM)", "UOM": "None", "Price": 648.38, "Source": "INV", "VendNumber": "358523", "OrderQty": 1, "Location": "11D5B"},
		{"MedId": "", "ItemNumber": "257515", "ItemDescription": "HYDROCOD/APAP TAB 10/325", "UOM": "100 TABS/BO", "Price": 10.84, "Source": "W/S", "VendNumber": "350227", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "257536", "ItemDescription": "SPIKE BAG VENTED CLAVE 50/CA", "UOM": "None", "Price": 107, "Source": "W/S", "VendNumber": "4112587", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "257537", "ItemDescription": "SEAL IV SECURSEAL 28MM BLUE", "UOM": "None", "Price": 59.96, "Source": "W/S", "VendNumber": "3562683", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "257539", "ItemDescription": "LINER GLOVE HALF FNGR SM RED", "UOM": "None", "Price": 47.97, "Source": "W/S", "VendNumber": "7469-03", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "257540", "ItemDescription": "LINER GLOVE FULL FNGR SM GRN", "UOM": "None", "Price": 51.75, "Source": "W/S", "VendNumber": "7454-SMALL", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "257541", "ItemDescription": "LINER GLOVE FULL FNGR MED ORG", "UOM": "None", "Price": 46.13, "Source": "W/S", "VendNumber": "7454-MED", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "257549", "ItemDescription": "BAG ADAPTER BLUNT SPIKE 10/CA", "UOM": "None", "Price": 30.7, "Source": "W/S", "VendNumber": "H93866", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "257573", "ItemDescription": "RAPID FILL CONNECTOR-RED 50/CS", "UOM": "None", "Price": 47.25, "Source": "W/S", "VendNumber": "772236", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "257574", "ItemDescription": "DARUNAVIR TAB 800MG", "UOM": "30 TABS/BO", "Price": 1428.1899, "Source": "W/S", "VendNumber": "198754", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "257608", "ItemDescription": "KIT IV STRT FREPP TEGA 1.0ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "257831", "ItemDescription": "MEMANTINE XR CAP 28MG", "UOM": "30 CAPS/BO", "Price": 356.84, "Source": "W/S", "VendNumber": "223507", "OrderQty": 1, "Location": "2E1D"},
		{"MedId": "", "ItemNumber": "257868", "ItemDescription": "CARDIOPLEGIA DEL NIDO FORMULA", "UOM": "1 L/BAG", "Price": 64, "Source": "W/S", "VendNumber": "0120-02", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "257940", "ItemDescription": "LOSARTAN TAB 50MG", "UOM": "1000 TABS/BO", "Price": 31.62, "Source": "INV", "VendNumber": "602932", "OrderQty": 1000, "Location": "2D6H"},
		{"MedId": "", "ItemNumber": "257941", "ItemDescription": "VAC HUM PLV GARDASIL 9", "UOM": "10 VIALS/CT", "Price": 1783.88, "Source": "INV", "VendNumber": "374874", "OrderQty": 10, "Location": "10C4A"},
		{"MedId": "", "ItemNumber": "257993", "ItemDescription": "SULFASALAZINE DR TAB 500MG", "UOM": "100 TABS/BO", "Price": 20.2, "Source": "W/S", "VendNumber": "879054", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "258039", "ItemDescription": "AZITHROMYCIN TAB 250MG", "UOM": "18 TABS/BX", "Price": 5.9094, "Source": "INV", "VendNumber": "429746", "OrderQty": 18, "Location": "2A4C"},
		{"MedId": "", "ItemNumber": "258041", "ItemDescription": "REMODULIN CADD MS 3ML SYR", "UOM": "None", "Price": 7.41, "Source": "W/S", "VendNumber": "217450", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "258042", "ItemDescription": "REMODULIN EXT TUBING 43IN", "UOM": "None", "Price": 7.2, "Source": "W/S", "VendNumber": "710624", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "258043", "ItemDescription": "SPRAY BOTTLE 100 ML 50/PK", "UOM": "None", "Price": 42.93, "Source": "W/S", "VendNumber": "10407", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "258044", "ItemDescription": "SPRAY BOTTLE 250 ML 50/PK", "UOM": "None", "Price": 45.23, "Source": "W/S", "VendNumber": "10408", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "258045", "ItemDescription": "PUMP TOP FOR SPRAY BOT 100/PK", "UOM": "None", "Price": 52.16, "Source": "W/S", "VendNumber": "10414", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "258115", "ItemDescription": "CAFFEINE CITR VL 60MG/3ML", "UOM": "10 VIALS/CT", "Price": 91.18, "Source": "INV", "VendNumber": "400402", "OrderQty": 10, "Location": "3E1B"},
		{"MedId": "", "ItemNumber": "258116", "ItemDescription": "METHOTREXATE VL 50MG/2ML", "UOM": "10 VIALS/CT", "Price": 24.62, "Source": "INV", "VendNumber": "185862", "OrderQty": 10, "Location": "9E1B"},
		{"MedId": "", "ItemNumber": "258178", "ItemDescription": "LORAZEPAM VL 40MG/10ML", "UOM": "10 VIALS/CT", "Price": 61.59, "Source": "W/S", "VendNumber": "4585808", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "258179", "ItemDescription": "JUVEN PKT", "UOM": "30 PKT/BX", "Price": 376.2, "Source": "INV", "VendNumber": "938567", "OrderQty": 30, "Location": "6B2D"},
		{"MedId": "", "ItemNumber": "258180", "ItemDescription": "CARDIOPLEGIA INDUC 4:1 HIGH K", "UOM": "None", "Price": 174, "Source": "W/S", "VendNumber": "0110-00", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "258181", "ItemDescription": "CARDIOPLEGIA MAINT 4:1 LOW K", "UOM": "None", "Price": 136, "Source": "W/S", "VendNumber": "0110-01", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "258212", "ItemDescription": "QUININE TAB 324 MG", "UOM": "30 CAPS/BO", "Price": 63.12, "Source": "W/S", "VendNumber": "183374", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "258245", "ItemDescription": "HYDROXYZINE SYRP 10MG/5ML", "UOM": "120 ML/BO", "Price": 10.53, "Source": "INV", "VendNumber": "1694926", "OrderQty": 120, "Location": "6B2B"},
		{"MedId": "", "ItemNumber": "258246", "ItemDescription": "NIVOLUMAB VL 100 MG", "UOM": "None", "Price": 2545.15, "Source": "W/S", "VendNumber": "365655", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "258262", "ItemDescription": "BENZOCAINE SPRAY STRAWS 200/PK", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "258272", "ItemDescription": "LEVONORGESTREL TAB 1.5MG", "UOM": "1 TAB/BX", "Price": 17.25, "Source": "W/S", "VendNumber": "5055363", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "258418", "ItemDescription": "CIPRODEX OTIC SUSP 0.3-0.1%", "UOM": "None", "Price": 183.8, "Source": "INV", "VendNumber": "863410", "OrderQty": 1, "Location": "1A3D"},
		{"MedId": "", "ItemNumber": "260634", "ItemDescription": "NIVOLUMAB VL 40 MG", "UOM": "None", "Price": 1018.06, "Source": "W/S", "VendNumber": "365635", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "260635", "ItemDescription": "ALUMINUM HYDROX. 16 OZ BO", "UOM": "None", "Price": 3.14, "Source": "W/S", "VendNumber": "1170885", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "260639", "ItemDescription": "SET INFS PRIM SPH PE LN AP331", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "260640", "ItemDescription": "SET INFS SPH BLD AP13301 200MH", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "260641", "ItemDescription": "SET INFS PRIM SPH 2 Y AP43101", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "260650", "ItemDescription": "IBUPROFEN TAB 800MG UD", "UOM": "750 TABS/BO", "Price": 56.55, "Source": "INV", "VendNumber": "322057", "OrderQty": 750, "Location": "7D1C"},
		{"MedId": "", "ItemNumber": "261022", "ItemDescription": "IBUPROFEN TAB 400MG UD", "UOM": "750 TABS/BO", "Price": 35.775, "Source": "INV", "VendNumber": "409553", "OrderQty": 750, "Location": "7D1A"},
		{"MedId": "", "ItemNumber": "261023", "ItemDescription": "IBUPROFEN TAB 600MG UD", "UOM": "750 TABS/BO", "Price": 43.725, "Source": "INV", "VendNumber": "309625", "OrderQty": 750, "Location": "7D1B"},
		{"MedId": "", "ItemNumber": "261024", "ItemDescription": "LORATADINE/PSEUD TAB 10/240MG", "UOM": "15 TABS/BO", "Price": 4.13, "Source": "INV", "VendNumber": "241497", "OrderQty": 15, "Location": "2D6F"},
		{"MedId": "", "ItemNumber": "261198", "ItemDescription": "MORPHINE VL 4MG", "UOM": "25 VIALS/CT", "Price": 21.65, "Source": "W/S", "VendNumber": "470567", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "261199", "ItemDescription": "DAPTOMYCIN VL 500MG", "UOM": "None", "Price": 184.91, "Source": "INV", "VendNumber": "570416", "OrderQty": 1, "Location": "10A3B"},
		{"MedId": "", "ItemNumber": "262371", "ItemDescription": "PEMBROLIZUMAB VL 100 MG/4 ML", "UOM": "None", "Price": 4513.2, "Source": "W/S", "VendNumber": "378113", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "262372", "ItemDescription": "MISOPROSTOL TAB 200 MCG U/D", "UOM": "100 TABS/BX", "Price": 117.89, "Source": "INV", "VendNumber": "226357", "OrderQty": 100, "Location": "2E5L"},
		{"MedId": "", "ItemNumber": "262373", "ItemDescription": "FINASTERIDE TAB 5 MG U/D", "UOM": "50 TABS/BX", "Price": 28.25, "Source": "INV", "VendNumber": "198337", "OrderQty": 50, "Location": "2C3N"},
		{"MedId": "", "ItemNumber": "262374", "ItemDescription": "FLUCONAZOLE TAB 100 MG U/D", "UOM": "100 TABS/BX", "Price": 122.68, "Source": "INV", "VendNumber": "417687", "OrderQty": 100, "Location": "2C4B"},
		{"MedId": "", "ItemNumber": "262375", "ItemDescription": "FLUCONAZOLE TAB 200 MG U/D", "UOM": "100 TABS/BX", "Price": 161.18, "Source": "INV", "VendNumber": "339648", "OrderQty": 100, "Location": "2C4C"},
		{"MedId": "", "ItemNumber": "262386", "ItemDescription": "PAPER CHART 7 DAY -5 TO 25", "UOM": "None", "Price": 28.8028, "Source": "W/S", "VendNumber": "HE-220366", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "262427", "ItemDescription": "BUPRENORPHINE TAB 8MG", "UOM": "30 TABS/BO", "Price": 43.37, "Source": "W/S", "VendNumber": "389357", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "263214", "ItemDescription": "IDARUCIZUMAB VL 2500MG", "UOM": "2 VIALS/CT", "Price": 3500, "Source": "W/S", "VendNumber": "5170550", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "263256", "ItemDescription": "PANTOPRAZOLE TAB 40MG", "UOM": "1000 TABS/BO", "Price": 81, "Source": "INV", "VendNumber": "474902", "OrderQty": 1000, "Location": "2F4B"},
		{"MedId": "", "ItemNumber": "263265", "ItemDescription": "FUROSEMIDE LIQ 40MG/5ML 500ML", "UOM": "None", "Price": 36.2, "Source": "W/S", "VendNumber": "2442101", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "263266", "ItemDescription": "ALBUTEROL HFA 18GM INHALER", "UOM": "None", "Price": 38.87, "Source": "INV", "VendNumber": "496513", "OrderQty": 1, "Location": "1C1A"},
		{"MedId": "", "ItemNumber": "263273", "ItemDescription": "GENTIAN VIOLET BOT 2 OZ", "UOM": "None", "Price": 5.37, "Source": "W/S", "VendNumber": "3686987", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "263893", "ItemDescription": "SET IV INFUS SPHR PRIM AP43401", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "263915", "ItemDescription": "CALCIUM ACET/ALUMINUM SULF PKT", "UOM": "12 PKT/BX", "Price": 7.13, "Source": "W/S", "VendNumber": "4598546", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "263938", "ItemDescription": "GLYCOPYRROLATE TAB 1MG", "UOM": "100 TABS/BO", "Price": 43.35, "Source": "INV", "VendNumber": "5220538", "OrderQty": 100, "Location": "2C6K"},
		{"MedId": "", "ItemNumber": "263939", "ItemDescription": "GUAIFENESIN/COD LIQ 473ML", "UOM": "None", "Price": 15.19, "Source": "W/S", "VendNumber": "3868551", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "263949", "ItemDescription": "LAMOTRIGINE CHEW TAB 25MG", "UOM": "100 TABS/BO", "Price": 8.3, "Source": "W/S", "VendNumber": "4155198", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264001", "ItemDescription": "OXYBUTYNIN TAB 5MG (BULK)", "UOM": "100 TABS/BO", "Price": 30.22, "Source": "INV", "VendNumber": "329334", "OrderQty": 100, "Location": "2F3G"},
		{"MedId": "", "ItemNumber": "264002", "ItemDescription": "PROCARDIA XL TAB 60MG", "UOM": "100 TABS/BO", "Price": 122.04, "Source": "INV", "VendNumber": "179438", "OrderQty": 100, "Location": "3A2B"},
		{"MedId": "", "ItemNumber": "264003", "ItemDescription": "PROCARDIA XL TAB 90MG", "UOM": "80 TABS/BO", "Price": 154.7, "Source": "INV", "VendNumber": "4337036", "OrderQty": 80, "Location": "3A2C"},
		{"MedId": "", "ItemNumber": "264090", "ItemDescription": "LIDOCAINE 2 G/500 ML D5W", "UOM": "18 BAGS/CA", "Price": 67.7196, "Source": "INV", "VendNumber": "590356", "OrderQty": 18, "Location": "7E5B"},
		{"MedId": "", "ItemNumber": "264091", "ItemDescription": "LINEZOLID TAB 600MG U/D", "UOM": "20 TABS/BX", "Price": 99.58, "Source": "W/S", "VendNumber": "502278", "OrderQty": 1, "Location": "2D5J"},
		{"MedId": "", "ItemNumber": "264093", "ItemDescription": "BEARD COVER  DBL HOOK WHITE", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264129", "ItemDescription": "DONEPEZIL TAB 5MG", "UOM": "100 TABS/BO", "Price": 8.75, "Source": "INV", "VendNumber": "432021", "OrderQty": 100, "Location": "2C2E"},
		{"MedId": "", "ItemNumber": "264130", "ItemDescription": "DONEPEZIL TAB 10MG", "UOM": "100 TABS/BO", "Price": 9.09, "Source": "INV", "VendNumber": "338083", "OrderQty": 100, "Location": "2C2F"},
		{"MedId": "", "ItemNumber": "264160", "ItemDescription": "FENTANYL VL 100 MCG (EMS ONLY)", "UOM": "25 VIALS/CT", "Price": 14.49, "Source": "W/S", "VendNumber": "184580", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264163", "ItemDescription": "SPIRONOLACTONE TAB 25MG (BULK)", "UOM": "100 TABS/BO", "Price": 5.32, "Source": "INV", "VendNumber": "582243", "OrderQty": 100, "Location": "3A6G"},
		{"MedId": "", "ItemNumber": "264207", "ItemDescription": "MORPHINE ER TAB 15MG (BULK)", "UOM": "100 TABS/BO", "Price": 61.67, "Source": "W/S", "VendNumber": "3500691", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264213", "ItemDescription": "CAP BOUFFANT LT WT BL 24IN", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264323", "ItemDescription": "CEFTOLOZANE/TAZOBACTAM VL 1.5G", "UOM": "10 VIALS/CT", "Price": 958.2, "Source": "W/S", "VendNumber": "5232772", "OrderQty": 1, "Location": "11D1B"},
		{"MedId": "", "ItemNumber": "264324", "ItemDescription": "CEFTAZIDIME/AVIBACTAM VL 2.5G", "UOM": "10 VIALS/CT", "Price": 2801.1, "Source": "INV", "VendNumber": "5073846", "OrderQty": 10, "Location": "3E6D"},
		{"MedId": "", "ItemNumber": "264328", "ItemDescription": "PHENYTOIN SUSP 100MG/4ML CUP", "UOM": "50 CUPS/BX", "Price": 177.56, "Source": "INV", "VendNumber": "4306031", "OrderQty": 50, "Location": "6C2C"},
		{"MedId": "", "ItemNumber": "264330", "ItemDescription": "TOPIRAMATE TAB 25MG", "UOM": "50 TABS/BX", "Price": 4.5, "Source": "INV", "VendNumber": "362723", "OrderQty": 50, "Location": "3B2F"},
		{"MedId": "", "ItemNumber": "264331", "ItemDescription": "TOPIRAMATE TAB 100MG", "UOM": "100 TABS/BX", "Price": 17.87, "Source": "INV", "VendNumber": "188268", "OrderQty": 100, "Location": "3B2G"},
		{"MedId": "", "ItemNumber": "264332", "ItemDescription": "RISPERIDONE TAB 0.25MG", "UOM": "100 TABS/BX", "Price": 16.25, "Source": "W/S", "VendNumber": "849737", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264333", "ItemDescription": "RISPERIDONE TAB 0.5MG", "UOM": "50 TABS/BX", "Price": 8.74, "Source": "INV", "VendNumber": "389496", "OrderQty": 50, "Location": "3A4E"},
		{"MedId": "", "ItemNumber": "264334", "ItemDescription": "RISPERIDONE TAB 1MG", "UOM": "50 TABS/BX", "Price": 10.66, "Source": "W/S", "VendNumber": "389508", "OrderQty": 1, "Location": "3A4F"},
		{"MedId": "", "ItemNumber": "264335", "ItemDescription": "RISPERIDONE TAB 2MG", "UOM": "50 TABS/BX", "Price": 12.15, "Source": "W/S", "VendNumber": "389515", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264344", "ItemDescription": "COVER SHOE NONSKID BL XLG LF", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264369", "ItemDescription": "PRENATAL VIT W/ IODINE", "UOM": "90 TABS/BO", "Price": 19.8, "Source": "INV", "VendNumber": "007068", "OrderQty": 90, "Location": "3A1K"},
		{"MedId": "", "ItemNumber": "264370", "ItemDescription": "THEOPHYL CAP ER 24H 200MG", "UOM": "100 CAPS/BO", "Price": 229.77, "Source": "W/S", "VendNumber": "5022835", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264371", "ItemDescription": "AZATHIOPRINE TAB 50MG", "UOM": "50 TABS/BO", "Price": 21.12, "Source": "W/S", "VendNumber": "002598", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264372", "ItemDescription": "CARBAMAZEP TAB SR 200MG", "UOM": "30 TABS/BO", "Price": 51.55, "Source": "INV", "VendNumber": "4556122", "OrderQty": 30, "Location": "2A6J"},
		{"MedId": "", "ItemNumber": "264373", "ItemDescription": "TAMOXIFEN TAB 10MG", "UOM": "100 TABS/BO", "Price": 36, "Source": "W/S", "VendNumber": "4019113", "OrderQty": 1, "Location": "3B1D"},
		{"MedId": "", "ItemNumber": "264374", "ItemDescription": "ABACAVIR TAB 300MG", "UOM": "30 TABS/BO", "Price": 210.261, "Source": "W/S", "VendNumber": "4826467", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264375", "ItemDescription": "PHENYTOIN CHEW TAB 50MG", "UOM": "50 TABS/BO", "Price": 25.53, "Source": "W/S", "VendNumber": "213862", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264377", "ItemDescription": "ZIDOVUDINE CAP 100MG", "UOM": "30 CAPS/BO", "Price": 52.7598, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264378", "ItemDescription": "ZIDOVUDINE TAB 300MG", "UOM": "30 TABS/BO", "Price": 25.86, "Source": "W/S", "VendNumber": "062059", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264416", "ItemDescription": "LIDOCAINE PF AMP 1% 2ML", "UOM": "10 AMPS/CT", "Price": 5.81, "Source": "INV", "VendNumber": "241430", "OrderQty": 10, "Location": "4E3B"},
		{"MedId": "", "ItemNumber": "264444", "ItemDescription": "ZIPRASIDONE CAP 80MG", "UOM": "80 CAPS/BO", "Price": 49.06, "Source": "W/S", "VendNumber": "5047071", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264506", "ItemDescription": "LABEL HAZARD DRUG SMALL YELLOW", "UOM": "None", "Price": 12.25, "Source": "W/S", "VendNumber": "MVO2SY3292", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264507", "ItemDescription": "NALOXONE SPRAY 4 MG/0.1 ML", "UOM": "2 EACH/CT", "Price": 115.13, "Source": "W/S", "VendNumber": "510727", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264508", "ItemDescription": "MENING.B VAC BEXSERO 0.5ML", "UOM": "10 VIALS/CT", "Price": 1203.77, "Source": "W/S", "VendNumber": "602318", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264511", "ItemDescription": "FACTOR VIIA (NOVO7) 1MG", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264512", "ItemDescription": "FACTOR VIII RECOMB. 1000 IU", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264513", "ItemDescription": "FACTOR IX BENEFIX 1000 IU", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "264514", "ItemDescription": "FACTOR IX PROFILNINE 1000 IU", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265051", "ItemDescription": "KETAMINE SYR 50MG/5ML NS", "UOM": "25 SYR/CT", "Price": 113, "Source": "W/S", "VendNumber": "3320NO", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265053", "ItemDescription": "SUGAMMADEX VL 200MG/2ML", "UOM": "10 VIALS/CT", "Price": 874.91, "Source": "INV", "VendNumber": "500898", "OrderQty": 10, "Location": "5E3B"},
		{"MedId": "", "ItemNumber": "265054", "ItemDescription": "ENTRESTO TAB 24/26MG", "UOM": "60 TABS/BO", "Price": 358.878, "Source": "W/S", "VendNumber": "418863", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265055", "ItemDescription": "ENTRESTO TAB 49/51MG", "UOM": "60 TABS/BO", "Price": 358.88, "Source": "W/S", "VendNumber": "418867", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265056", "ItemDescription": "ENTRESTO TAB 97/103MG", "UOM": "60 TABS/BO", "Price": 335.4, "Source": "W/S", "VendNumber": "418871", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265058", "ItemDescription": "NALOXONE VL 0.4MG/1ML", "UOM": "25 VIALS/CT", "Price": 247.6, "Source": "INV", "VendNumber": "490666", "OrderQty": 25, "Location": "5A5B"},
		{"MedId": "", "ItemNumber": "265079", "ItemDescription": "LIPIODOL (ETHIODIZED OIL) 10ML", "UOM": "None", "Price": 1057, "Source": "W/S", "VendNumber": "LP-AMP-10", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265080", "ItemDescription": "GLASS SYRINGE 10ML", "UOM": "10 SYR/CT", "Price": 142.38, "Source": "W/S", "VendNumber": "332157", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265081", "ItemDescription": "REPEATER PUMP ORAL LIQ SET", "UOM": "10 EA/CT", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265152", "ItemDescription": "GOWN ISO CHEMO TST KNITCF LG B", "UOM": "None", "Price": 42.15, "Source": "W/S", "VendNumber": "NON25457", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265153", "ItemDescription": "GOWN ISO CHEMO TST KNITCF XL B", "UOM": "None", "Price": 47.7, "Source": "W/S", "VendNumber": "NON25457XL", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265157", "ItemDescription": "BAG IV CLAVE SPIKE AD PORT", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265209", "ItemDescription": "DARATUMUMAB VL 100 MG", "UOM": "None", "Price": 483.59, "Source": "W/S", "VendNumber": "489462", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265210", "ItemDescription": "DARATUMUMAB VL 400 MG", "UOM": "None", "Price": 1934.36, "Source": "W/S", "VendNumber": "489468", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265211", "ItemDescription": "PEG BOWEL 17 GM", "UOM": "100 PKT/CT", "Price": 62.63, "Source": "INV", "VendNumber": "383859", "OrderQty": 100, "Location": "6C1A"},
		{"MedId": "", "ItemNumber": "265212", "ItemDescription": "LIDOCAINE 1% W/EPI VL 30ML", "UOM": "25 VIALS/CT", "Price": 67.7, "Source": "INV", "VendNumber": "045252", "OrderQty": 25, "Location": "4E3C"},
		{"MedId": "", "ItemNumber": "265213", "ItemDescription": "LABEL-DO NOT HANDLE W/PREG.", "UOM": "1000/RL", "Price": 3.825, "Source": "W/S", "VendNumber": "2805", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265423", "ItemDescription": "MAT TACKY W/ FRAME 18X36", "UOM": "None", "Price": 65.16, "Source": "W/S", "VendNumber": "PTM797", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265424", "ItemDescription": "CEFAZOLIN 2 GM/DEXT FROZEN MB", "UOM": "12 BAGS/CT", "Price": 73.8, "Source": "INV", "VendNumber": "2G3508", "OrderQty": 12, "Location": "10B3A"},
		{"MedId": "", "ItemNumber": "265425", "ItemDescription": "LEVOFLOXACIN TAB 500MG", "UOM": "100 TABS/BO", "Price": 19.35, "Source": "INV", "VendNumber": "128637", "OrderQty": 100, "Location": "2D4I"},
		{"MedId": "", "ItemNumber": "265426", "ItemDescription": "ATEZOLIZUMAB VL 1200MG", "UOM": "None", "Price": 8620, "Source": "W/S", "VendNumber": "541623", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265427", "ItemDescription": "ADAPTER VIAL SPIKE UNIV CLAVE", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265470", "ItemDescription": "TICAGRELOR TAB 60MG", "UOM": "60 TABS/BO", "Price": 287.27, "Source": "W/S", "VendNumber": "5135934", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265471", "ItemDescription": "MYCOPHENOLATE SUSP 200MG/ML", "UOM": "None", "Price": 1090.44, "Source": "W/S", "VendNumber": "5038534", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265472", "ItemDescription": "SIROLIMUS ORAL SOLN 1MG/ML", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265548", "ItemDescription": "ACETAMIN/COD EL 118ML", "UOM": "None", "Price": 1.86, "Source": "W/S", "VendNumber": "591834", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265587", "ItemDescription": "SERTRALINE TAB 50MG", "UOM": "30 TABS/BO", "Price": 1.269, "Source": "INV", "VendNumber": "839769", "OrderQty": 30, "Location": "3A5C"},
		{"MedId": "", "ItemNumber": "265708", "ItemDescription": "BENDAMUSTINE VL 100MG LIQ MDV", "UOM": "None", "Price": 2228.12, "Source": "W/S", "VendNumber": "506365", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265709", "ItemDescription": "FENTANYL PATCH 37.5MCG U/D", "UOM": "5 PATCH/BX", "Price": 196.39, "Source": "W/S", "VendNumber": "5064225", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265710", "ItemDescription": "PEGFILGRASTIM ONPRO KIT 6MG", "UOM": "None", "Price": 4772.2, "Source": "W/S", "VendNumber": "378075", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265711", "ItemDescription": "ECALLANTIDE VL 10MG", "UOM": "3 VIALS/CT", "Price": 12624.6, "Source": "W/S", "VendNumber": "35451", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265712", "ItemDescription": "PREMASOL AMINO ACIDS 10% 500ML", "UOM": "24 BAGS/CS", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265713", "ItemDescription": "METHOTREXATE TAB 2.5MG U/D", "UOM": "20 TABS/BX", "Price": 42.63, "Source": "INV", "VendNumber": "321554", "OrderQty": 20, "Location": "9E1A"},
		{"MedId": "", "ItemNumber": "265715", "ItemDescription": "ELOTUZUMAB VL 400MG", "UOM": "DR. WRZESINSKI NPI#1780856971", "Price": 2439.57, "Source": "W/S", "VendNumber": "491682", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265716", "ItemDescription": "THEOPHYL CAP ER 24H 100MG", "UOM": "100 CAPS/BO", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265740", "ItemDescription": "MENINGOCOC. VAC (MENVEO)", "UOM": "5 VIALS/CT", "Price": 421.62, "Source": "W/S", "VendNumber": "037879", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265741", "ItemDescription": "IRON GLUCONATE VL 62.5MG/5ML", "UOM": "10 VIALS/CT", "Price": 87.5, "Source": "INV", "VendNumber": "388114", "OrderQty": 10, "Location": "4D4E"},
		{"MedId": "", "ItemNumber": "265742", "ItemDescription": "DEXMETHYLPHENIDATE TAB 2.5MG", "UOM": "100 TABS/BO", "Price": 37.76, "Source": "W/S", "VendNumber": "3989548", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265743", "ItemDescription": "DEXMETHYLPHENIDATE TAB 5MG", "UOM": "100 TABS/BO", "Price": 53.83, "Source": "W/S", "VendNumber": "3989555", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265744", "ItemDescription": "DEXMETHYLPHENIDATE TAB 10MG", "UOM": "100 TABS/BO", "Price": 77.49, "Source": "W/S", "VendNumber": "3989563", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265745", "ItemDescription": "DEXTROAMPH/AMP SALT TAB 5MG", "UOM": "100 TABS/BO", "Price": 77, "Source": "W/S", "VendNumber": "5252168", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265746", "ItemDescription": "DEXTROAMPH/AMP SALT TAB 7.5MG", "UOM": "100 TABS/BO", "Price": 41.8, "Source": "W/S", "VendNumber": "498636", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265747", "ItemDescription": "DEXTROAMPH/AMP SALT TAB 10MG", "UOM": "100 TABS/BO", "Price": 33.85, "Source": "W/S", "VendNumber": "541144", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265748", "ItemDescription": "MIDAZOLAM VL 2MG/2ML PF", "UOM": "25 VIALS/CT", "Price": 12.67, "Source": "W/S", "VendNumber": "008324", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265838", "ItemDescription": "LABEL HAZARD DRUG LARGE YELLOW", "UOM": "1000/ROLL", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265839", "ItemDescription": "LABEL LOOK ALIKE SOUND ALIKE", "UOM": "1000/ROLL", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265840", "ItemDescription": "SEAL SEC LOCK RED PLAIN W/O #", "UOM": "100/BOX", "Price": 15.05, "Source": "W/S", "VendNumber": "R65", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265842", "ItemDescription": "EPHEDRINE VL 50 MG", "UOM": "25 VIALS/CT", "Price": 762.38, "Source": "INV", "VendNumber": "626325", "OrderQty": 25, "Location": "4B4B"},
		{"MedId": "", "ItemNumber": "265843", "ItemDescription": "TEMAZEPAM CAP 7.5MG U/D", "UOM": "30 CAPS/BO", "Price": 124.56, "Source": "W/S", "VendNumber": "183564", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265845", "ItemDescription": "LEVETIRACETAM VL 500MG", "UOM": "25 VIALS/CT", "Price": 70.26, "Source": "INV", "VendNumber": "544213", "OrderQty": 25, "Location": "4E2B"},
		{"MedId": "", "ItemNumber": "265846", "ItemDescription": "SILDENAFIL TAB 20MG U/D", "UOM": "50 TABS/BO", "Price": 33.03, "Source": "INV", "VendNumber": "416469", "OrderQty": 50, "Location": "3A5F"},
		{"MedId": "", "ItemNumber": "265847", "ItemDescription": "CAPSAICIN CR 0.1%", "UOM": "None", "Price": 9.57, "Source": "W/S", "VendNumber": "206896", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "265881", "ItemDescription": "CEFAZOLIN 1 GM/DEXT FROZEN MB", "UOM": "24 BAGS/CA", "Price": 95.7408, "Source": "INV", "VendNumber": "2G3503", "OrderQty": 24, "Location": "10B2A"},
		{"MedId": "", "ItemNumber": "265882", "ItemDescription": "CHOLECALCIFEROL CAP 50000 IU", "UOM": "100 CAPS/BO", "Price": 16.5, "Source": "W/S", "VendNumber": "392403", "OrderQty": 1, "Location": "2B3B"},
		{"MedId": "", "ItemNumber": "265927", "ItemDescription": "AMLODIPINE TAB 10MG", "UOM": "2400 TABS/BO", "Price": 46.08, "Source": "INV", "VendNumber": "4366720", "OrderQty": 2400, "Location": "2A2G"},
		{"MedId": "", "ItemNumber": "265930", "ItemDescription": "LISINOPRIL TAB 20MG", "UOM": "100 TABS/BO", "Price": 7.14, "Source": "INV", "VendNumber": "258463", "OrderQty": 100, "Location": "2D6B"},
		{"MedId": "", "ItemNumber": "265931", "ItemDescription": "DABIGATRAN CAP 110MG", "UOM": "60 CAPS/BO", "Price": 311.95, "Source": "W/S", "VendNumber": "5207238", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266041", "ItemDescription": "POT CHL PKT 20MEQ", "UOM": "100 EA/CT", "Price": 644.19, "Source": "INV", "VendNumber": "605081", "OrderQty": 100, "Location": "6C3A"},
		{"MedId": "", "ItemNumber": "266126", "ItemDescription": "PEGINTERFER. ALFA 2A VL 180MCG", "UOM": "None", "Price": 966.95, "Source": "W/S", "VendNumber": "681770", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266144", "ItemDescription": "THEOPHYL CAP ER 24H 300MG", "UOM": "100 CAPS/BO", "Price": 282.41, "Source": "W/S", "VendNumber": "5022843", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266235", "ItemDescription": "VANCOMYCIN 750MG/NS 150ML FROZ", "UOM": "6 BAGS/CA", "Price": 60.3, "Source": "INV", "VendNumber": "2G3591", "OrderQty": 6, "Location": "10B4A"},
		{"MedId": "", "ItemNumber": "266236", "ItemDescription": "TRIPTORELIN LA 3.75 MG", "UOM": "None", "Price": 576.72, "Source": "W/S", "VendNumber": "637797", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266237", "ItemDescription": "MALARONE TAB 250/100 MG", "UOM": "24 TABS/BO", "Price": 154.01, "Source": "W/S", "VendNumber": "3331204", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266238", "ItemDescription": "INFUVITE PED IV 2X5ML", "UOM": "5 DOSES/CT", "Price": 43.48, "Source": "INV", "VendNumber": "079297", "OrderQty": 5, "Location": "11E3A"},
		{"MedId": "", "ItemNumber": "266239", "ItemDescription": "PHENTOLAMINE VL 5MG", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266242", "ItemDescription": "OXYCODONE CR TAB 40MG", "UOM": "100 TABS/BO", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266255", "ItemDescription": "FOMEPIZOLE VL 1500MG", "UOM": "None", "Price": 1132.45, "Source": "W/S", "VendNumber": "4254140", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266256", "ItemDescription": "MORPHINE VL 50MG/ML 20 ML", "UOM": "None", "Price": 9.84, "Source": "W/S", "VendNumber": "551775", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266437", "ItemDescription": "LABEL 4X3 QUATTRO RX 1900/RL", "UOM": "4 ROLLS/BX", "Price": 157, "Source": "W/S", "VendNumber": "DTL269PH", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266438", "ItemDescription": "DIGOXIN AMP 0.5MG", "UOM": "10 AMPS/CT", "Price": 25.52, "Source": "INV", "VendNumber": "425734", "OrderQty": 10, "Location": "3F5D"},
		{"MedId": "", "ItemNumber": "266439", "ItemDescription": "PREGABALIN CAP 75MG", "UOM": "90 CAPS/BO", "Price": 570.906, "Source": "W/S", "VendNumber": "538640", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266440", "ItemDescription": "PREGABALIN CAP 150MG", "UOM": "90 CAPS/BO", "Price": 570.906, "Source": "W/S", "VendNumber": "539787", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266441", "ItemDescription": "PREGABALIN CAP 200MG", "UOM": "90 CAPS/BO", "Price": 570.906, "Source": "W/S", "VendNumber": "539801", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266638", "ItemDescription": "OLARATUMAB VL 500MG", "UOM": "None", "Price": 2360, "Source": "W/S", "VendNumber": "583498", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266639", "ItemDescription": "OLARATUMAB VL 190MG", "UOM": "None", "Price": 896.8, "Source": "W/S", "VendNumber": "635615", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266640", "ItemDescription": "TENOFOVIR ALAFENAMIDE TAB 25MG", "UOM": "30 TABS/BO", "Price": 932.421, "Source": "W/S", "VendNumber": "5302955", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266641", "ItemDescription": "DESCOVY TAB", "UOM": "30 TABS/BO", "Price": 1443.78, "Source": "W/S", "VendNumber": "524314", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266642", "ItemDescription": "ODEFSEY TAB", "UOM": "30 TABS/BO", "Price": 2343.48, "Source": "W/S", "VendNumber": "5224860", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266643", "ItemDescription": "GENVOYA TAB", "UOM": "30 TABS/BO", "Price": 2537.84, "Source": "W/S", "VendNumber": "485969", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266644", "ItemDescription": "STRIBILD TAB", "UOM": "30 TABS/BO", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266645", "ItemDescription": "COBICISTAT TAB 150MG", "UOM": "30 TABS/BO", "Price": 192.231, "Source": "W/S", "VendNumber": "5027693", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266646", "ItemDescription": "PREGABALIN CAP 225MG", "UOM": "90 CAPS/BO", "Price": 529.299, "Source": "W/S", "VendNumber": "3683059", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "266647", "ItemDescription": "PREGABALIN CAP 300MG", "UOM": "90 CAPS/BO", "Price": 570.906, "Source": "W/S", "VendNumber": "539902", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "267182", "ItemDescription": "LABEL DIRECT THERMAL-BATCH IV", "UOM": "1000 LABELS/ROLL", "Price": 4.88, "Source": "W/S", "VendNumber": "31DT-0", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "267183", "ItemDescription": "OXYCODONE TAB 30MG", "UOM": "100 TABS/BO", "Price": 26.48, "Source": "W/S", "VendNumber": "3591377", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "267721", "ItemDescription": "TRIUMEQ TAB", "UOM": "30 TABS/BO", "Price": 2428.63, "Source": "W/S", "VendNumber": "5013099", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "267722", "ItemDescription": "EVOTAZ TAB", "UOM": "30 TABS/BO", "Price": 1478.64, "Source": "W/S", "VendNumber": "375307", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "267723", "ItemDescription": "PREZCOBIX TAB", "UOM": "30 TABS/BO", "Price": 1598.18, "Source": "W/S", "VendNumber": "5056858", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "268043", "ItemDescription": "PASIREOTIDE AMP 0.9 MG", "UOM": "60 AMPS/CT", "Price": 11967.12, "Source": "W/S", "VendNumber": "246492", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "268051", "ItemDescription": "DEXRAZOXANE VL 250 MG", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "268765", "ItemDescription": "TRASTUZUMAB VL 150MG", "UOM": "None", "Price": 1468.96, "Source": "INV", "VendNumber": "665784", "OrderQty": 1, "Location": "11C4C"},
		{"MedId": "", "ItemNumber": "268767", "ItemDescription": "MULTIVITAMIN WITH MINERAL TAB", "UOM": "100 TABS/BO", "Price": 2.23, "Source": "INV", "VendNumber": "714782", "OrderQty": 100, "Location": "2E6D"},
		{"MedId": "", "ItemNumber": "268768", "ItemDescription": "CLINDAMYCIN 600MG/50ML D5 W", "UOM": "24 BAGS/CT", "Price": 149.2992, "Source": "INV", "VendNumber": "209546", "OrderQty": 24, "Location": "6E4A"},
		{"MedId": "", "ItemNumber": "268769", "ItemDescription": "CLINDAMYCIN 900MG/50ML D5 W", "UOM": "24 BAGS/CT", "Price": 182.34, "Source": "INV", "VendNumber": "209551", "OrderQty": 24, "Location": "6E5A"},
		{"MedId": "", "ItemNumber": "268770", "ItemDescription": "SODIUM BICARB VL 50ML CMPD", "UOM": "30 VIALS/CA", "Price": 300, "Source": "INV", "VendNumber": "914-50", "OrderQty": 30, "Location": "9A5A"},
		{"MedId": "", "ItemNumber": "269315", "ItemDescription": "SILVER SULF 50GM TB ER/OR", "UOM": "None", "Price": 8.5, "Source": "INV", "VendNumber": "226170", "OrderQty": 1, "Location": "1F5D"},
		{"MedId": "", "ItemNumber": "269316", "ItemDescription": "ALCOHOL STERILE SPRAY 70%", "UOM": "None", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "269318", "ItemDescription": "++DNU+ DUP USE LAWSON 106563", "UOM": "CHEMO SHARPS 20X2 GAL", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "269536", "ItemDescription": "DULERA INH 200/5 MCG 120 DOSE", "UOM": "None", "Price": 160.56, "Source": "INV", "VendNumber": "105763", "OrderQty": 1, "Location": "1C5B"},
		{"MedId": "", "ItemNumber": "269537", "ItemDescription": "HEMIN VL 350 MG", "UOM": "None", "Price": 7231.55, "Source": "W/S", "VendNumber": "678298", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "269538", "ItemDescription": "PHENYLEPHRINE NAS SPRAY 1%", "UOM": "None", "Price": 1.29, "Source": "INV", "VendNumber": "177612", "OrderQty": 1, "Location": "1D2A"},
		{"MedId": "", "ItemNumber": "269576", "ItemDescription": "DULERA INH 100/5 MCG 120 DOSE", "UOM": "None", "Price": 160.56, "Source": "INV", "VendNumber": "105770", "OrderQty": 1, "Location": "1C5A"},
		{"MedId": "", "ItemNumber": "269578", "ItemDescription": "EPINEPHRINE AMP 1 MG/1 ML", "UOM": "10 AMPS/CT", "Price": 92.1, "Source": "INV", "VendNumber": "528091", "OrderQty": 10, "Location": "4B4B"},
		{"MedId": "", "ItemNumber": "269579", "ItemDescription": "HYDROMORP VL 1MG/1ML", "UOM": "10 AMPS/CT", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "269580", "ItemDescription": "ZONISAMIDE CAP 25MG", "UOM": "100 CAPS/BO", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "269581", "ItemDescription": "ZONISAMIDE CAP 50MG", "UOM": "100 CAPS/BO", "Price": 20.14, "Source": "W/S", "VendNumber": "934828", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "", "ItemNumber": "269582", "ItemDescription": "TWINRIX VACC (HEP A/HEP B)", "UOM": "10 VIALS/CT", "Price": 0, "Source": "W/S", "VendNumber": "None", "OrderQty": 1, "Location": "N/A"}
	];
	return inventory;
}