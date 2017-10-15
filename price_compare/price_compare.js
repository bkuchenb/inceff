//Create variables to store the price information.
var source = [];
var compare = [];
//Create a header for the compare files.
var compare_header = ['col_1','order_id','col_03','col_04','col_05',
                'compare_id','col_07','col_08','col_09','description',
                'col_11','col_12','order_qty','col_14','col_15',
                'ship_qty','col_17','col_18','col_19','col_20',
                'col_21','compare_price','col_23','col_24','col_25',
                'col_26','col_27','col_28'];

//Create variables to zebra stripe table rows.
var counter = 0;
var color = '#e6eeff';

//Add event listeners to the file inputs.
document.getElementById('source_file').addEventListener('change', handleFileSelect, false);
document.getElementById('compare_files').addEventListener('change', handleFileSelect, false);
//Add a listener to the Check Prices button.
document.getElementById('btn_check').addEventListener('click', check_prices, false);

//Add a listener to the last 3 columns to allow them to be hidden.
hide_columns(document.getElementById('col_1_delete'), 'percent_change');
hide_columns(document.getElementById('col_2_delete'), 'change');
hide_columns(document.getElementById('col_3_delete'), 'delete');

function handleFileSelect(evt){
	//FileList object
	var files = evt.target.files;

	//Loop through the FileList and and save the data in an array.
	for (var i = 0; i < files.length; i++){
		f = files[i];
		
		var reader = new FileReader();

		//Capture the file information.
		reader.onload = (function(theFile){
			return function(e){
				var contents = e.target.result;
				if(f.name.match('PO254.csv')){
					//Save the lines in an array.
					var source_lines = contents.split(/\n/);
					//Save the header.
					var source_header = source_lines[0].split(/,/);
					//Create a temp variable to split a single line.
					var ln_temp = [];
					//Get the lines from the file.
					for(j = 1; j < source_lines.length; j++){
						ln_temp = source_lines[j].split(/,/);
						//Add the line as an object to the source list.
						var source_temp_obj = {};
						for(k = 0; k < ln_temp.length; k++){
							//Remove the quotes from the header and line information.
							var header_entry = source_header[k].split('"').join('');
							var entry = ln_temp[k].split('"').join('');
							//Replace the "-" character with underscores.
							header_entry = header_entry.split('-').join('_');
							source_temp_obj[header_entry] = entry;
						}
						source.push(source_temp_obj);
					}
				}
				else{
					//Save the compare file lines in an array.
					var lines = contents.split(/\n/);
					//Cycle through the lines.
					for(var y = 0; y < lines.length; y++){
						//Trim the white space.
						lines[y].trim();
						//Check the length of the line and reject blanks.
						if(lines[y].length < 1){
							break;
						}
						//Split the line and ignore commas within quotes.
						var split_line = lines[y].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
						//Create an object to store the line.
						var temp_obj = {};
						//Add each element to the object.
						for(k = 0; k < split_line.length; k++){
							//Add the line data.
							temp_obj[compare_header[k]] = split_line[k];
						}
						compare.push(temp_obj);
					}
				}
			}
		})(f);
		//Read the file.
		reader.readAsText(f);
	}
}

function check_prices(){
	//Check each compare line for a matching price in source.
	for(var i = 0; i < compare.length; i++){
		//Create a flag to tell if a match was found.
		var match_found = false;
		//Create an object to store the data that will be displayed.
		var prices = {};
		for(var x = 0; x < source.length; x++){
			if(compare[i].compare_id.toString() == source[x].PLI_VEN_ITEM){
				//Update the flag.
				match_found = true;
				//Round the prices to two decimal places.
				prices['compare_price'] = parseFloat(compare[i].compare_price.toString()).toFixed(2);
				prices['source_price'] = parseFloat(source[x].PLI_ENT_UNIT_CST).toFixed(2);
				//Calculate the percent change and absolute change.
				prices['percent_change'] = Math.abs((prices['compare_price']/prices['source_price'] * 100) - 100);
				prices['percent_change'] = parseFloat(prices['percent_change'].toString()).toFixed(2);
				prices['change'] = Math.abs(prices['source_price'] - prices['compare_price']);
				prices['change'] = parseFloat(prices['change'].toString()).toFixed(2);
				//Display the results if the item has shipped and the price has changed.
				//if(1 == 1){
				if(prices['percent_change'] != 0 && compare[i].ship_qty > 0){
					//Create a table row the for the line.
					create_row(prices, source[x], i);					
				} 
			}
		}
		if(!match_found){
			//Round the prices to two decimal places.
			prices['compare_price'] = parseFloat(compare[i].compare_price.toString()).toFixed(2);
			prices['source_price'] = 0;
			prices['percent_change'] = 0;
			prices['change'] = 0;
			//Create a table row the for the line.
			create_row(prices, source[x], i);		
		}
	}
}

function create_row(prices, source_line, i){
	counter++;
	var index = i + 1;
	//Find the tbody element.
	var tbody = document.getElementById('table_body');
	//Create a new row in the table.
	var row = document.createElement('tr');
	//Set the class name for the row.
	row.className = 'table_row';
	row.id = counter - 1;
	//Create cells for the next item.
	var cell_0 = document.createElement('td');
	//Set the class name for the order number cell.
	cell_0.className = 'order_id';
	cell_0.innerHTML = source_line.PLI_PO_NUMBER;
	var cell_1 = document.createElement('td');
	//Set the class name for the line number cell.
	cell_1.className = 'line';
	cell_1.innerHTML = source_line.PLI_LINE_NBR;
	var cell_2 = document.createElement('td');
	//Set the class name for the source number cell.
	cell_2.className = 'source_num';
	cell_2.innerHTML = source_line.PLI_ITEM;
	var cell_3 = document.createElement('td');
	//Set the class name for the compare id cell.
	cell_3.className = 'compare_id';
	cell_3.innerHTML = source_line.PLI_VEN_ITEM;
	var cell_4 = document.createElement('td');
	//Set the class name for the description cell.
	cell_4.className = 'description';
	cell_4.innerHTML = source_line.PLI_DESCRIPTION;
	var cell_5 = document.createElement('td');
	//Set the class name for the source price cell.
	cell_5.className = 'source_price';
	cell_5.innerHTML = '$'.concat(prices.source_price.toString());
	var cell_6 = document.createElement('td');
	//Set the class name for the invoice price cell.
	cell_6.className = 'compare_price';
	cell_6.innerHTML = '$'.concat(prices.compare_price.toString());
	cell_6.style.color = 'red';
	var cell_7 = document.createElement('td');
	//Set the class name for the change % cell.
	cell_7.className = 'percent_change';
	cell_7.innerHTML = prices.percent_change.toString().concat(' %');
	var cell_8 = document.createElement('td');
	//Set the class name for the change cell.
	cell_8.className = 'change';
	cell_8.innerHTML = '$'.concat(prices.change.toString());
	var cell_9 = document.createElement('td');
	//Set the class name for the delete button cell.
	cell_9.className = 'delete';
	
	//Check to see if the price went up or down.
	if(prices.source_price > prices.compare_price){
		cell_7.style.color = 'red';
		cell_8.style.color = 'red';
	}
	if(prices.source_price < prices.compare_price){
		cell_7.style.color = 'green';
		cell_8.style.color = 'green';
	}
	//Create a delete button to remove the line.
	var btn_delete = document.createElement('button');
	//Set the className, id and innerHTML
	btn_delete.className = 'btn_delete';
	btn_delete.innerHTML = 'Delete';
	btn_delete.id = 'btn_'.concat(counter - 1);
	//Add the delete button to the last cell.
	cell_9.appendChild(btn_delete);
	//Add all the cells to the row.
	row.appendChild(cell_0);
	row.appendChild(cell_1);
	row.appendChild(cell_2);
	row.appendChild(cell_3);
	row.appendChild(cell_4);
	row.appendChild(cell_5);
	row.appendChild(cell_6);
	row.appendChild(cell_7);
	row.appendChild(cell_8);
	row.appendChild(cell_9);
	//Add the row to the tbody.
	tbody.appendChild(row);
	//Create a listener for the button.
	create_listener_delete(btn_delete);
	//Zebra stripe the table rows.
	if(counter % 2 == 0){
		row.style.backgroundColor = color;
	}
	else{
		row.style.backgroundColor = 'white';
	}
}

function create_listener_delete(btn_delete){
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

function hide_columns(column, class_name){
	//When clicked, remove the elements in this coulmn.
	column.addEventListener('click', function(event){
		event.preventDefault();
		//Get all the rows displayed.
		var rows = document.getElementsByTagName('tr');
		//Get header elements.
		var header = rows[0].getElementsByTagName('th');
		for(var y = 0; y < rows.length; y++){
			if(class_name == 'percent_change'){
				rows[y].deleteCell(7);				
			}
			else if(class_name == 'change'){
				if(header.length == 10){
					//This is the first column to be deleted.
					rows[y].deleteCell(8);
				}
				else if(header[header.length - 1].className == 'change'){
					//The delete buttons have been removed first.
					rows[y].deleteCell(-1);
				}
				else{
					//The % Change column has been removed first.
					rows[y].deleteCell(7);
				}
			}
			else{
				rows[y].deleteCell(-1);
			}
		}
	}, false);
}