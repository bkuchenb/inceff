//Global variable to store order options.
//This will be replaced with an ajax call.
var item_options = [];
//Create an action listener for the Load Template button.
var btn_load = document.getElementById('btn_load');
crt_lst_load(btn_load);
function crt_lst_load(btn_load){
	//Add an event listener to the "Load Template" button.
	btn_load.addEventListener('click', function(event){
		//Get the cost center from the drop box.
		var cost_center = document.getElementById('sel_cst_cntr').value;
		console.log(cost_center);
		//Request the item options from the server.
		item_options = get_options(cost_center);
		//Remove the drop down box and "Load Template" button.
		var body_center = document.getElementById('body_center');
		while(body_center.firstChild){
			body_center.removeChild(body_center.firstChild);
		}
		//Create a counter to assign a unique id for each row.
		var counter = 0;
		//Create the order form.
		var table = document.createElement('table');
		var thead = document.createElement('thead');
		var row = document.createElement('tr');
		row.className = 'thead_row';
		var cell_1 = document.createElement('th');
		cell_1.innerHTML = 'Item Number';
		var cell_2 = document.createElement('th');
		cell_2.innerHTML = 'Description';
		var cell_3 = document.createElement('th');
		cell_3.innerHTML = 'UOM';
		var cell_4 = document.createElement('th');
		cell_4.innerHTML = 'Quantity';
		//Add the thead and associated elements to the table.
		row.appendChild(cell_1);
		row.appendChild(cell_2);
		row.appendChild(cell_3);
		row.appendChild(cell_4);
		thead.appendChild(row);
		table.appendChild(thead);
		var tbody = document.createElement('tbody');
		for(var i = 0; i < item_options.length; i++){
			var temp_row = document.createElement('tr');
			temp_row.id = 'row_' + counter.toString();
			var temp_1 = document.createElement('td');
			temp_1.innerHTML = item_options[i].item_number;
			temp_1.className = 'item_number';
			temp_row.appendChild(temp_1);
			var temp_2 = document.createElement('td');
			temp_2.innerHTML = item_options[i].description;
			temp_row.appendChild(temp_2);
			var temp_3 = document.createElement('td');
			temp_string = item_options[i].multiple.toString() + ' ' + item_options[i].uom;
			temp_3.innerHTML = temp_string;
			temp_3.className = 'uom';
			temp_row.appendChild(temp_3);
			var temp_4 = document.createElement('td');
			temp_4.innerHTML = 0;
			//temp_4.innerHTML = item_options[i].multiple;
			temp_4.className = 'qty';
			temp_row.appendChild(temp_4);
			var temp_5 = document.createElement('td');
			temp_5.className = 'btn_cell';
			var btn_add = document.createElement('button');
			btn_add.innerHTML = '+';
			btn_add.className = 'btn_qty';
			//Create a listener for the button.
			crt_lst_quantity(btn_add,temp_row);
			temp_5.appendChild(btn_add);
			var btn_sub = document.createElement('button');
			btn_sub.innerHTML = '-';
			btn_sub.className = 'btn_qty';
			//Create a listener for the button.
			crt_lst_quantity(btn_sub, temp_row);
			temp_5.appendChild(btn_sub);
			temp_row.appendChild(temp_5);
			tbody.appendChild(temp_row);
			counter++;
		}
		table.appendChild(tbody);
		body_center.appendChild(table);
	}, false);
}
function crt_lst_quantity(btn_qty, temp_row){
	//Add an event listener to the plus and minus buttons.
	btn_qty.addEventListener('click', function(event){
		//Get all the cells in the row.
		var cells = temp_row.childNodes;
		//Find the multiple for the given row.
		for(var i = 0; i < item_options.length; i++){
			if(item_options[i].item_number == cells[0].innerHTML){
				var multiple = item_options[i].multiple;
			}
		}
		if(btn_qty.innerHTML == '+'){			
			cells[3].innerHTML = parseInt(cells[3].innerHTML) + multiple;
		}
		if(btn_qty.innerHTML == '-'){
			var temp = parseInt(cells[3].innerHTML) - multiple;
			//Prevent numbers less than zero.
			if(temp < 0){
				cells[3].innerHTML = 0;
			}
			else{
				cells[3].innerHTML = temp;
			}
		}
	}, false);
}
function get_options(cost_center){
	item_options = [
		{'item_number': 'item 1', 'description': 'description 1', 'uom': 'unit/box', 'multiple': 1},
		{'item_number': 'item 2', 'description': 'description 2', 'uom': 'units/box', 'multiple': 2},
		{'item_number': 'item 3', 'description': 'description 3', 'uom': 'units/box', 'multiple': 3},
		{'item_number': 'item 4', 'description': 'description 4', 'uom': 'units/box', 'multiple': 4},
		{'item_number': 'item 5', 'description': 'description 5', 'uom': 'units/box', 'multiple': 5},
		{'item_number': 'item 6', 'description': 'description 6', 'uom': 'units/box', 'multiple': 6},
		{'item_number': 'item 7', 'description': 'description 7', 'uom': 'units/box', 'multiple': 7},
		{'item_number': 'item 8', 'description': 'description 8', 'uom': 'units/box', 'multiple': 8},
		{'item_number': 'item 9', 'description': 'description 9', 'uom': 'units/box', 'multiple': 9}
	]
	if(cost_center == '1234'){item_options = item_options.slice(0, 4);}
	else if(cost_center == '2345'){item_options = item_options.slice(1, 5);}
	else if(cost_center == '3456'){item_options = item_options.slice(2, 6);}
	else if(cost_center == '4567'){item_options = item_options.slice(3, 7);}
	else if(cost_center == '5678'){item_options = item_options.slice(4, 8);}
	else{item_options = item_options.slice(5, 9);}
	/* var xhttp = new XMLHttpRequest();
	var post_data = 'save=' + (cost_center);
	//var post_data = 'cost_center=' + (cost_center);
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState == 4 && xhttp.status == 200){
			//Print a test message.
			var return_data = JSON.parse(xhttp.responseText);
			console.log(return_data);
			/* var item_options = JSON.parse(xhttp.responseText);
			console.log(item_options);
		}
	}
	xhttp.open("POST", "ajax.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(post_data);*/
	return item_options;
}
