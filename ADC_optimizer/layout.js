//https://bkuchenb.github.io/ADC_optimizer/
//Variables to store the inventory.
var input = [];
var station_data = [];
var order = 'descending';

//Variables to zebra stripe table rows.
var counter = 0;
var color = '#e6eeff';
//Add a listener to the file browse button.
document.getElementById('input_file').addEventListener('change', handleFileSelect, false);
//Add listeners to the default buttons.
var btn_stations = document.getElementById('btn_stations');
btn_stations.addEventListener('click', get_stations, false);
//Add listeners to the temp cells in the header.
create_listener_drag(document.getElementById('temp1'));
create_listener_drop(document.getElementById('temp1'));
create_listener_drag(document.getElementById('temp2'));
create_listener_drop(document.getElementById('temp2'));
create_listener_drag(document.getElementById('temp3'));
create_listener_drop(document.getElementById('temp3'));
create_listener_drag(document.getElementById('temp4'));
create_listener_drop(document.getElementById('temp4'));

/*     Global variables     */
var page_title = document.getElementById('print_header');
var body = document.getElementById('body');
var navbar = document.getElementById('navbar');
var admin = document.getElementById('admin');
var drawer_selected = false;
var drawer_saved = false;
var last_button_clicked = '';
var current_station = '';
var current_drawer = '';
var current_drawer_index = '';
var saved_configurations = [];
var set_pars = true;
//"_" + current_station + "_" + current_drawer + "_"
var unique_index = '';
//Used until server database is in place.
var storage = {};
//Variabls to separate station buttons.
var floor = '';
var station_column = '';
var print_header = '';
/*This function is called when a file is choosen.
  It saves the csv data in and array named input.
*/
function handleFileSelect(evt){
	//FileList object
	var files = evt.target.files;

	//Loop through the FileList and and save the data in an array.
	for (var i = 0; i < files.length; i++){
		f = files[i];
		//Only process csv files.
		if(!f.name.match('\.csv')){
		continue;
		}

		var reader = new FileReader();

		//Capture the file information.
		reader.onload = (function(theFile){
			return function(e){
				var contents = e.target.result;
				//Save the lines in an array.
				var lines = contents.split(/\n/);
				//Save the header.
				var header = lines[0].split(/,/);
				//Remove the "/" character from the last header entry.
				header[header.length - 1] = 'Avg_Wk';
				//Create a temp variable to split a single line.
				var ln_temp = [];
				//Get the lines from the file.
				for(j = 1; j < lines.length; j++){
					//Split the line, ignore commas within quotes.
					ln_temp = lines[j].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
					//Add the line as an object to the input list.
					var temp_obj = {};
					for(k = 0; k < ln_temp.length; k++){
						temp_obj[header[k]] = ln_temp[k];
					}
					input.push(temp_obj);
				}
			}
		})(f);

		//Read the file.
		reader.readAsText(f);
	}
	//Make the Get Stations button visible.
	btn_stations.style.display = 'inline';
	btn_stations.style.visibility = 'visible';
}
/*This function is called when the "Get Stations" button is clicked.
  It removes the file input box and creates a button for each unique station
  found in the input array.
*/
function get_stations(){
	//Clear the file input box.
	body.innerHTML = '';
	//Force the alignment to center.
	body.style.textAlign = 'center';
	//Cycle through the input array and save the unique station names.
	var station = '';
	for(var x = 0; x < input.length; x++){
		var temp = input[x].Station;
		if(temp != station){
			station = temp;
			//For each station, create a button.
			if(station != ''){
				create_station_buttons(station);
			}
		}
	}
	//Hide the Get Stations button.
	btn_stations.style.display = 'none';
	btn_stations.style.visibility = 'hidden';
}
/*This function is called after all the unique stations have
  been identified and saved in an array. It creates buttons
  for each station and places them in the body.
*/
function create_station_buttons(station){
	//Skip stations that won't be configured.
	if(station.substring(0,1) == 'z'){return 0;}
	if(station.substring(1,4) == 'PVA'){return 0;}
	//Check the first character of the station name.
	if(isNaN(station.substring(0,1))){
		var temp_floor = 'A';
	}
	else{
		var temp_floor = station.substring(0,1);
	}
	var div_temp = document.createElement('div');
	div_temp.className = 'div_station_btn';
	var btn_temp = document.createElement('button');
	//Set the class name for the button.
	btn_temp.className = 'btn_station';
	btn_temp.innerHTML = station;
	btn_temp.style.fontSize = '14px';
	btn_temp.style.width = '100px';
	div_temp.appendChild(btn_temp);
	if(temp_floor != floor){
		floor = temp_floor;
		station_column = document.createElement('div');
		station_column.id = 'station_column_'.concat(floor);
		station_column.className = 'station_column';
		body.appendChild(station_column);
	}
	station_column.appendChild(div_temp);
	create_listener_station_button(btn_temp);
}
/*This function adds an event listener to a station button.
  When the button is pressed, loads the station data into a table.
  It then creates buttons in the navbar that are used to select a
  drawer configuration.
*/
function create_listener_station_button(btn_temp){
	btn_temp.addEventListener('click', function(event){
		event.preventDefault();
		//Get the name of the button clicked.
		current_station = btn_temp.innerHTML;
		//Display the station name in place of the logo/title.
		document.getElementById('title').innerHTML = current_station;
		print_header = print_header.concat(current_station);
		page_title.innerHTML = print_header;
		//Create buttons for admin.
		create_admin_buttons();
		//Change the width of the body element.
		body.style.width = '100%';
		//Save the station data that corresponds to the clicked button.
		for(var y = 0; y < input.length; y++){
			if(input[y].Station == btn_temp.innerHTML){
				station_data.push(input[y]);
			}
		}
		//Div element that will hold station data table.
		var div_table = document.createElement('div');
		div_table.id = 'div_table';
		//Table element that will hold station data.
		var table = document.createElement('table');
		table.id = 'table_1';
		//Remove the buttons and add a table to the body.
		body.innerHTML = '';
		body.style.textAlign = 'left';
		body.appendChild(div_table);
		div_table.appendChild(table);
		//Create the table header and add it to the table.
		var table_header = document.createElement('thead');
		table.appendChild(table_header);
		//Create a row in the table header and add it to the table header.
		var header_row = document.createElement('tr');
		table_header.appendChild(header_row);
		//Create the cells and add them to the row.
		var cell_header_0 = document.createElement('th');
		cell_header_0.style.cursor = 'pointer';
		cell_header_0.innerHTML = 'MedId';
		//Create a listener to sort the table by column.
		create_listener_header(cell_header_0);
		header_row.appendChild(cell_header_0);
		var cell_header_1 = document.createElement('th');
		cell_header_1.style.cursor = 'pointer';
		cell_header_1.innerHTML = 'MedDescription';
		//Create a listener to sort the table by column.
		create_listener_header(cell_header_1);
		header_row.appendChild(cell_header_1);
		var cell_header_2 = document.createElement('th');
		cell_header_2.style.cursor = 'pointer';
		cell_header_2.innerHTML = 'Location';
		//Create a listener to sort the table by column.
		create_listener_header(cell_header_2);
		header_row.appendChild(cell_header_2);
		var cell_header_3 = document.createElement('th');
		cell_header_3.style.cursor = 'pointer';
		cell_header_3.innerHTML = 'Vends';
		//Create a listener to sort the table by column.
		create_listener_header(cell_header_3);
		header_row.appendChild(cell_header_3);
		//Create and add a table body element to the table.
		var tbody = document.createElement('tbody');
		tbody.id = 'table_body';
		table.appendChild(tbody);
		//Sort the station_data array by Vends in descending order.
		sort_station_data('Vends');
		//Create rows in the table that contain the station data.
		for(y = 0; y < station_data.length; y++){
			create_row(station_data[y]);
		}
		//Add buttons to choose drawer configuration.
		create_drawer_buttons();
	}, false);
}
/*This function creates buttons that are used to Reset,
  Print, and Save.
*/
function create_admin_buttons(){
	//Create admin buttons and place them in the admin area.
	var btn_reset = document.createElement('button');
	btn_reset.id = 'btn_reset';
	btn_reset.innerHTML = 'Reset';
	btn_reset.addEventListener('click', reset_display, false);
	admin.appendChild(btn_reset);
	var btn_print = document.createElement('button');
	btn_print.id = 'btn_print';
	btn_print.innerHTML = 'Print';
	btn_print.addEventListener('click', print_drawer, false);
	admin.appendChild(btn_print);
	var btn_save = document.createElement('button');
	btn_save.id = 'btn_save';
	btn_save.innerHTML = 'Save';
	btn_save.addEventListener('click', save_all, false);
	admin.appendChild(btn_save);
	var btn_settings = document.createElement('button');
	btn_settings.id = 'btn_settings';
	btn_settings.innerHTML = 'Settings';
	btn_settings.addEventListener('click', settings, false);
	admin.appendChild(btn_settings);
	//Reduce the fontSize of the title.
	document.getElementById('title').style.fontSize = '30px';
}
/*This function creates rows in a table that contain the
  station data. It also adds a drag listener to each row
  that saves the row id on dragstart.
*/
function create_row(line){
	counter++;
	//Create a new row in the table.
	var row = document.createElement('tr');
	row.className = 'table_row';
	row.id = counter - 1;
	//Allow the element to be draggable.
	row.draggable = true;
	//Create cells for the next item.
	var cell_0 = document.createElement('td');
	//Set the class name for the cell.
	cell_0.className = 'MedId';
	cell_0.innerHTML = line.MedId;
	var cell_1 = document.createElement('td');
	//Set the class name for the cell.
	cell_1.className = 'MedDescription';
	cell_1.innerHTML = line.MedDescription;
	var cell_2 = document.createElement('td');
	//Set the class name for the cell.
	cell_2.className = 'Location';
	cell_2.innerHTML = line.Location;
	var cell_3 = document.createElement('td');
	//Set the class name for the cell.
	cell_3.className = 'Vends';
	cell_3.innerHTML = line.Vends;
	//Add all the cells to the row.
	row.appendChild(cell_0);
	row.appendChild(cell_1);
	row.appendChild(cell_2);
	row.appendChild(cell_3);
	//Add the row to the tbody.
	document.getElementById('table_body').appendChild(row);
	//Zebra stripe the table rows.
	if(counter % 2 == 0){
		row.style.backgroundColor = color;
	}
	else{
		row.style.backgroundColor = 'white';
	}
	//Create a listener to allow the row to be dragged.
	create_listener_drag(row);
}
/*This function creates buttons in that navbar that load
  drawer configurations when clicked. It calls a function
  that adds the listener.
*/
function create_drawer_buttons(){
	//Split the navbar into columns by adding divs.
	for(var i = 0; i < 4; i++){
		var navbar_section = document.createElement('div');
		navbar_section.id = 'navbar_section_'.concat(i);
		navbar_section.className = 'navbar_section';
		for(var j = 0; j < 5; j++){
			//Only create 4 sections for the Tower buttons.
			if(i == 2 && j == 4){break;}
			//Only create one section for the Remote button.
			if(i == 3 && j == 1){break;}
			var div_temp = document.createElement('div');
			div_temp.id = 'navbar_'.concat(i).concat('_').concat(j);
			div_temp.className = 'navbar_column';
			navbar_section.appendChild(div_temp);
			
		}
		navbar.appendChild(navbar_section);
	}
	var drawer = ['1.1', '1.2', '2.1', '2.2', '3.1',
			      '3.2', '4.1', '4.2', '5', '6'];
	var drawer_id = ['1_1', '1_2', '2_1', '2_2', '3_1',
				     '3_2', '4_1', '4_2', '5', '6'];
	var tower = ['1.1', '1.2', '2.1', '2.2', '3.1',
			      '3.2', '4.1', '4.2'];
	var tower_id = ['1_1', '1_2', '2_1', '2_2', '3_1',
				     '3_2', '4_1', '4_2'];
	var column_counter = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
	//Create the buttons for the main drawers.
	for(var i = 0; i < drawer.length; i++){
		var btn_temp = document.createElement('button');
		btn_temp.innerHTML = 'Main '.concat(drawer[i]);
		btn_temp.id = 'M'.concat(drawer_id[i]);
		btn_temp.className = 'btn_drawer';
		var col = 'navbar_0_'.concat(column_counter[i]);
		document.getElementById(col).appendChild(btn_temp);
		create_listener_drawer_button(btn_temp);
	}
	//Create the buttons for the auxillary drawers.
	for(var i = 0; i < drawer.length; i++){
		var btn_temp = document.createElement('button');
		btn_temp.innerHTML = 'Aux '.concat(drawer[i]);
		btn_temp.id = 'A'.concat(drawer_id[i]);
		btn_temp.className = 'btn_drawer';
		var col = 'navbar_1_'.concat(column_counter[i]);
		document.getElementById(col).appendChild(btn_temp);
		create_listener_drawer_button(btn_temp);
	}
	//Create the buttons for the tower drawers.
	for(var i = 0; i < tower.length; i++){
		var btn_temp = document.createElement('button');
		btn_temp.innerHTML = 'Tower '.concat(tower[i]);
		btn_temp.id = 'T'.concat(tower_id[i]);
		btn_temp.className = 'btn_drawer';
		var col = 'navbar_2_'.concat(column_counter[i]);
		document.getElementById(col).appendChild(btn_temp);
		create_listener_drawer_button(btn_temp);
	}
	//Create a button for the remote manager.
	var btn_temp = document.createElement('button');
	btn_temp.innerHTML = 'Remote';
	btn_temp.id = 'R0';
	btn_temp.className = 'btn_drawer';
	var col = 'navbar_3_0'
	document.getElementById(col).appendChild(btn_temp);
	create_listener_drawer_button(btn_temp);
}
/*This function creates a listener for each drawer
  configuration button. When clicked, each button creates
  a grid representing what the physical drawer looks like.
  Each cell in the grid represents a pocket. A drop listener is
  attached to each cell to allow the table rows to be dragged
  and dropped into the pocket.
*/
function create_listener_drawer_button(btn){
	//When clicked, create a grid.
	btn.addEventListener('click', function(event){
		event.preventDefault();
		//Add the drawer to the print_header.
		print_header = current_station.concat(', ').concat(btn.innerHTML);
		page_title.innerHTML = print_header;
		//Generate a unique index for this drawer.
		unique_index = '_'.concat(current_station);
		unique_index = unique_index.concat('_');
		unique_index = unique_index.concat(current_drawer);
		unique_index = unique_index.concat('_');
		//Highlight the button clicked.
		btn.style.backgroundColor = '#e6eeff';
		btn.style.border = '3px solid pink';
		//Save the last drawer configuration.
		if(drawer_selected){
			save_configuration();
			//Reset the last button clicked.
			last_button_clicked.style.backgroundColor = '#F0F0F0';
			last_button_clicked.style.border = '1px solid black';
		}
		else{
			drawer_selected = true;
		}
		//Set the current drawer.
		current_drawer = btn.id;
		//Display the Holding Areas.
		document.getElementById('temp1').style.visibility = 'visible';
		document.getElementById('temp2').style.visibility = 'visible';
		document.getElementById('temp3').style.visibility = 'visible';
		document.getElementById('temp4').style.visibility = 'visible';
		//Check to see if this drawer has already been configured.
		for(var i = 0; i < saved_configurations.length; i++){
			if(saved_configurations[i].id == current_drawer){
				drawer_saved = true;
				current_drawer_index = i;
				break;
			}
			else{
				drawer_saved = false;
			}
		}
		if(!drawer_saved){
			//Create div element that will hold drawer configuration.
			var div_drawer = document.createElement('div');
			div_drawer.id = 'div_drawer';
			//Add the div to the body.
			body.appendChild(div_drawer);
			//Display the appropriate configuration.
			if(btn.id == 'T1_1' || btn.id == 'T3_1'){
				pocket_array = [5, 10, 15, 20,
								4, 9, 14, 19,
								3, 8, 13, 18,
								2, 7, 12, 17,
								1, 6, 11, 16];
				for(var i = 0; i < 20; i++){
					if(i == 0 || i == 4 || i == 8 || i == 12 || i == 16){
						var row = document.createElement('div');
						row.className = 'drawer_row';
					}
					var cell = document.createElement('div');					
					cell.className = 'drawer_cell pocket';
					cell.draggable = true;
					cell.id = 'pocket_'.concat(pocket_array[i]);
					cell.innerHTML = pocket_array[i];
					//Create a listener to allow dragging.
					create_listener_drag(cell);
					//Create a listener to allow table rows to be dropped.
					create_listener_drop(cell);
					row.appendChild(cell);
					if(i == 3 || i == 7 || i == 11 || i == 15 || i == 19){
						div_drawer.appendChild(row);
					}
				}
			}
			else if(btn.id == 'T1_2'){
					pocket_array = [25, 30, 35, 40,
									24, 29, 34, 39,
									23, 28, 33, 38,
									22, 27, 32, 37,
									21, 26, 31, 36];
					for(var i = 0; i < 20; i++){
						if(i == 0 || i == 4 || i == 8 || i == 12 || i == 16){
							var row = document.createElement('div');
							row.className = 'drawer_row';
						}
						var cell = document.createElement('div');
						cell.className = 'drawer_cell pocket';
						cell.draggable = true;
						cell.id = 'pocket_'.concat(pocket_array[i]);
						cell.innerHTML = pocket_array[i];
						//Create a listener to allow dragging.
						create_listener_drag(cell);
						//Create a listener to allow table rows to be dropped.
						create_listener_drop(cell);
						row.appendChild(cell);
						if(i == 3 || i == 7 || i == 11 || i == 15 || i == 19){
							div_drawer.appendChild(row);
						}
					}
				}
			else if(btn.id == 'T2_1' || btn.id == 'T4_1'){
					pocket_array = [5, 10, 15, 20, 25, 30, 35, 40,
									4,  9, 14, 19, 24, 29, 34, 39,
									3,  8, 13, 18, 23, 28, 33, 38,
									2,  7, 12, 17, 22, 27, 32, 37,
									1,  6, 11, 16, 21, 26, 31, 36];
					for(var i = 0; i < 40; i++){
						if(i == 0 || i == 8 || i == 16 || i == 24 || i == 32){
							var row = document.createElement('div');
							row.className = 'drawer_row';
						}
						var cell = document.createElement('div');						
						cell.className = 'two_inch_bin pocket';
						cell.draggable = true;
						cell.id = 'pocket_'.concat(pocket_array[i]);
						cell.innerHTML = pocket_array[i];
						//Create a listener to allow dragging.
						create_listener_drag(cell);
						//Create a listener to allow table rows to be dropped.
						create_listener_drop(cell);
						row.appendChild(cell);
						if(i == 7 || i == 15 || i == 23 || i == 31 || i == 39){
							div_drawer.appendChild(row);
						}
					}
			}
			else if(btn.id == 'T2_2'){
				var drawer = document.createElement('div');
				drawer.innerHTML = 'Tower 2.2 is used for Patient Specific Meds.';
				drawer.style.font = '36px Palatino Linotype';
				drawer.style.fontWeight = 'bold';
				drawer.style.textAlign = 'center';
				drawer.style.paddingTop = '40px';
				div_drawer.appendChild(drawer);
			}
			else if(btn.id == 'T3_2'){
				pocket_array = [22, 24, 26, 28,
								21, 23, 25, 27];
				for(var i = 0; i < 8; i++){
					if(i == 0 || i == 4){
						var row = document.createElement('div');
						row.className = 'drawer_row';
					}
					var cell = document.createElement('div');
					cell.id = 'pocket_'.concat(pocket_array[i]);
					cell.innerHTML = pocket_array[i];
					cell.className = 'four_inch_bin pocket';
					cell.draggable = true;
					if(pocket_array[i] == 27 || pocket_array[i] == 28){
						cell.className = 'six_inch_bin pocket';					
					}
					//Create a listener to allow dragging.
					create_listener_drag(cell);
					//Create a listener to allow table rows to be dropped.
					create_listener_drop(cell);
					row.appendChild(cell);
					if(i == 3 || i == 7){
						div_drawer.appendChild(row);
					}
				}
			}
			else if(btn.id == 'T4_2'){
				pocket_array = [42, 44, 46, 48,
								41, 43, 45, 47];
				for(var i = 0; i < 8; i++){
					if(i == 0 || i == 4){
						var row = document.createElement('div');
						row.className = 'drawer_row';
					}
					var cell = document.createElement('div');
					cell.id = 'pocket_'.concat(pocket_array[i]);
					cell.innerHTML = pocket_array[i];
					cell.className = 'four_inch_bin pocket';
					cell.draggable = true;
					if(pocket_array[i] == 47 || pocket_array[i] == 48){
						cell.className = 'six_inch_bin pocket';					
					}
					//Create a listener to allow dragging.
					create_listener_drag(cell);
					//Create a listener to allow table rows to be dropped.
					create_listener_drop(cell);
					row.appendChild(cell);
					if(i == 3 || i == 7){
						div_drawer.appendChild(row);
					}
				}
			}
			else if(btn.id.substring(0, 1) == 'M' || btn.id.substring(0, 1) == 'A'){
				if(btn.id.length == 2){
					pocket_array = ['E1', 'E3',
								'D1', 'D3',
								'C1', 'C3',
								'B1', 'B3',
								'A1', 'A3'];
					for(var i = 0; i < 10; i++){
						if(i == 0 || i == 2 || i == 4 || i == 6 || i == 8){
							var row = document.createElement('div');
							row.className = 'drawer_row';
						}
						var cell = document.createElement('div');
						if(pocket_array[i].substring(1,2) == '1'){
							cell.className = 'double_deep pocket';
						}
						else{
							cell.className = 'triple_deep pocket';
						}
						cell.draggable = true;
						cell.id = 'pocket_'.concat(pocket_array[i]);
						cell.innerHTML = pocket_array[i];
						//Create a listener to allow dragging.
						create_listener_drag(cell);
						//Create a listener to allow table rows to be dropped.
						create_listener_drop(cell);
						row.appendChild(cell);
						if(i == 1 || i == 3 || i == 5 || i == 7 || i == 9){
							div_drawer.appendChild(row);
						}
					}
				}
				else{
					pocket_array = ['E1', 'E4',
								'D1', 'D3', 'D5',
								'C1', 'C2', 'C3', 'C4', 'C5', 'C6',
								'B1', 'B2', 'B3', 'B4', 'B5', 'B6',
								'A1', 'A2', 'A3', 'A4', 'A5', 'A6'];
					for(var i = 0; i < 23; i++){
						if(i == 0 || i == 2 || i == 5 || i == 11 || i == 17){
							var row = document.createElement('div');
							row.className = 'drawer_row';
						}
						var cell = document.createElement('div');
						if(pocket_array[i].substring(0,1) == 'D'){
							cell.className = 'double_cubie pocket';
						}
						else if(pocket_array[i].substring(0,1) == 'E'){
							cell.className = 'triple_cubie pocket';
						}
						else{
							cell.className = 'single_cubie pocket';
						}
						cell.draggable = true;
						cell.id = 'pocket_'.concat(pocket_array[i]);
						cell.innerHTML = pocket_array[i];
						//Create a listener to allow dragging.
						create_listener_drag(cell);
						//Create a listener to allow table rows to be dropped.
						create_listener_drop(cell);
						row.appendChild(cell);
						if(i == 1 || i == 4 || i == 10 || i == 16 || i == 22){
							div_drawer.appendChild(row);
						}
					}
				}
				
			}
			else{
				var drawer = document.createElement('div');
				drawer.innerHTML = 'This drawer is under construction.';
				drawer.style.font = '36px Palatino Linotype';
				drawer.style.fontWeight = 'bold';
				drawer.style.textAlign = 'center';
				drawer.style.paddingTop = '40px';
				div_drawer.appendChild(drawer);
			}
		}
		else{
			body.appendChild(saved_configurations[current_drawer_index].config);
		}
		last_button_clicked = btn;
	}, false);
}
/*This function creates a dragstart listener for an element.
  When dragged, the element id is saved.
*/
function create_listener_drag(drag_element){
	drag_element.addEventListener('drag', function(event){
	}, false);
	drag_element.addEventListener('dragstart', function(event){
		event.dataTransfer.setData('text', drag_element.id);
	}, false);
	function dragStartCallback(event){
		if(document.activeElement.tagName == 'INPUT'){
			//Block dragging
			console.log('Blocking drag start');
			return false;
		}
		event.dataTransfer.setData('text', 'Dropped');
	}
}
/*This function creates a drop listener for each cell in
  the drawer grid and each holding area. If a table row is dropped into a cell,
  it extracts the data from the row and calculates a par level.
  If data from the holding area is dropped in, it copies and pastes
  the data.
*/
function create_listener_drop(drop_element){
	drop_element.addEventListener('dragover', function(event){
		//Needed to allow drop into the cell.
		event.preventDefault();
	}, false);
	drop_element.addEventListener('drop', function(event){
		/*Before dorpping, check the length of the html in the
		  drop zone to ensure no drops occur into full cells.
		*/
		if(drop_element.innerHTML.length > 20){return 0;}
		//Get the data stored on drag.
		var source_id = event.dataTransfer.getData('text');
		//Prevent holding area --> holding area.
		if(source_id.substring(0,4) == 'temp'
		   && drop_element.innerHTML == 'Holding Area'){return 0;}
		/*Check the source to see where the data comes from:
		  First statement: holding area --> pocket.
		  Second statement: pocket --> holding area.
		  Third statement: pocket --> pocket.
		  Fourth statement: table --> pocket.
		*/
		if(source_id.length > 4 && source_id.substring(0,4) == 'temp'){
			var data = '<br>'.concat(document.getElementById(source_id).innerHTML);
			event.target.innerHTML = event.target.innerHTML.concat(data);
			//Clear the original cell.
			document.getElementById(source_id).innerHTML = 'Holding Area';
			event.dataTransfer.clearData();
		}
		else if(source_id.length > 4 && source_id.substring(0,6) == 'pocket'
				&& drop_element.id.substring(0,4) == 'temp'){
			var data = document.getElementById(source_id).innerHTML;
			//Split the lines of html.
			var html_data = data.split('<br>');
			//Save the pocket number then remove it from the html.
			var pocket = html_data[0];
			//Remove the pocket number from the html.
			html_data.shift();
			//Add the html to the drop zone.
			event.target.innerHTML = html_data.join('<br>');
			//Clear the original cell.
			document.getElementById('pocket_'.concat(pocket)).innerHTML = pocket;
			event.dataTransfer.clearData();
		}
		else if(source_id.length > 4 && source_id.substring(0,6) == 'pocket'
				&& drop_element.id.substring(0,6) == 'pocket'){
			var data = document.getElementById(source_id).innerHTML;
			//Split the lines of html.
			var html_data = data.split('<br>');
			//Save the pocket number then remove it from the html.
			var pocket = html_data[0];
			//Remove the pocket number from the html.
			html_data.shift();
			html_data = '<br>'.concat(html_data.join('<br>'));
			//Add the html to the drop zone.
			event.target.innerHTML = event.target.innerHTML.concat(html_data);
			//Clear the original cell.
			document.getElementById('pocket_'.concat(pocket)).innerHTML = pocket;
			event.dataTransfer.clearData();
		}
		else if(source_id.length < 4 && drop_element.id.substring(0,6) == 'pocket'){
			//Get the childNodes of the table row that is being dropped.
			var source_cells = document.getElementById(source_id).childNodes;
			//Save the MedId which is in the first cell.
			var data = source_cells[0].innerHTML;
			//Variable to save data if there is more than one entry.
			var temp = [];
			//Search the station_data array for the MedId.
			for(var i = 0; i < station_data.length; i++){
				if(station_data[i].MedId == data){
					temp.push(station_data[i]);
				}
			}
			//Create an html string to display the results in the drawer grid.
			var str = '<br>MedId: '.concat(data);
			str = str.concat('<br>');
			//Check the length of the MedDescription and trim if needed.
			if(temp[0].MedDescription.length > 45){
				temp_desc = temp[0].MedDescription.substr(0, 44).concat('...');
			}
			else{
				temp_desc = temp[0].MedDescription;
			}
			str = str.concat(temp_desc);
			str = str.concat('<br>');
			str = str.concat('Vends: ');
			str = str.concat(temp[0].Vends);
			str = str.concat('     Avg/Wk: ');
			str = str.concat(temp[0].Avg_Wk);
			str = str.concat('<br>');
			str = str.concat('Max/Min: ');
			var avg = parseFloat(temp[0].Avg_Wk);
			//Create variable to hold the Max/Min numbers.
			var txt_str = '';
			if(set_pars){
				//Calculate the max and min based on average weekly use.
				if(avg <= 3){
					txt_str = '4/1';
				}
				else if(avg > 3 && avg <= 4){
					txt_str = '6/2';
				}
				else if(avg > 4 && avg <= 9){
					txt_str = '12/3';
				}
				else if(avg > 9 && avg <= 15){
					txt_str = '20/5';
				}
				else if(avg > 15 && avg <= 30){
					txt_str = '40/10';
				}
				else if(avg > 30 && avg <= 40){
					txt_str = '60/20';
				}
				else if(avg > 40 && avg <= 60){
					txt_str = '80/20';
				}
				else if(avg > 60){
					txt_str = '100/25';
				}
			}
			else{
				txt_str = temp[0].Max;
				txt_str = txt_str.concat('/');
				txt_str = txt_str.concat(temp[0].Min);
			}
			//Create a text box to store the Max/Min settings.
			var par_input = document.createElement('input');
			par_input.style.border = 'none';
			par_input.type = 'text';
			par_input.value = txt_str;
			//Add the text to the cell.
			event.target.innerHTML = event.target.innerHTML.concat(str);
			event.target.appendChild(par_input);
			//Remove the row that was dropped.
			document.getElementById('table_body').removeChild(document.getElementById(source_id));
			event.dataTransfer.clearData();
		}
	}, false);
}
/*This function is used to reset the application. The original
  input file data still remains and the station
  buttons are displayed.
*/
function reset_display(){
	//Hide and clear the Holding Areas.
	document.getElementById('temp1').style.visibility = 'hidden';
	document.getElementById('temp1').innerHTML = 'Holding Area';
	document.getElementById('temp2').style.visibility = 'hidden';
	document.getElementById('temp2').innerHTML = 'Holding Area';
	document.getElementById('temp3').style.visibility = 'hidden';
	document.getElementById('temp3').innerHTML = 'Holding Area';
	document.getElementById('temp4').style.visibility = 'hidden';
	document.getElementById('temp4').innerHTML = 'Holding Area';
	//Clear the navbar and admin area.
	navbar.innerHTML = '';
	admin.innerHTML = '';
	//Reset global variables.
	drawer_selected = false;
	drawer_saved = false;
	order = 'descending';
	saved_configurations = [];
	station_data = [];
	//Display the station buttons.
	get_stations();
	//Reset the logo/title.
	document.getElementById('title').innerHTML = 'ADC Optimizer';
	document.getElementById('print_header').innerHTML = 'ADC Optimizer';
}
/*This function is used to save a drawer configuration.
*/
function save_configuration(){
	//Save the current configuration.
	var temp_obj = {};
	temp_obj['id'] = current_drawer;
	temp_obj['config'] = document.getElementById('div_drawer');
	//If the saved data was changed, update the array entry.
	if(drawer_saved){
		saved_configurations[current_drawer_index] = (temp_obj);
	}
	//If this is a new save, add to the end of the array.
	else{
		storage[unique_index] = true;
		saved_configurations.push(temp_obj);
	}
	var pockets = document.getElementsByClassName('pocket');
	//Get the pocket data and save it to local storage.
	for(var i = 0; i < pockets.length; i++){
		storage[unique_index.concat(pockets[i].id)] = pockets[i].innerHTML;
	}
	body.removeChild(document.getElementById('div_drawer'));
}
function save_all(){
	var xhttp = new XMLHttpRequest();
	var post_data = 'save=' + (JSON.stringify(saved_configurations));
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState == 4 && xhttp.status == 200){
			//Print a test message.
			var return_text = JSON.parse(xhttp.responseText);
			console.log(return_text);
		}
	}
	xhttp.open("POST", "test.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(post_data);
	/*storage[unique_index] = true;
	//Get all the pockets.
	var pockets = document.getElementsByClassName('pocket');
	//Get the pocket data and save it to local storage.
	for(var i = 0; i < pockets.length; i++){
		storage[unique_index.concat(pockets[i].id)] = pockets[i].innerHTML;
	} */
}
/*This function is used to display extra settings
  that the user may select.
*/
function settings(){
	btn_temp = document.getElementById('btn_settings');
	if(set_pars){
		set_pars = false;
		btn_temp.style.border = '3px solid red';
	}
	else{
		set_pars = true;
		btn_temp.style.border = '3px solid green';
	}	
}
/*This function is used to print a drawer configuration.
*/
function print_drawer(){
	window.print();
}
/*This function is used to sort the station data
  by the parameter passed when calling the function.
*/
function sort_station_data(index){
	station_data = station_data.sort(function compare(a,b){
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
/*This function creates a listener for the column headings in
  the table. When the button is clicked, it sorts the data
  either ascending or descending.
*/
function create_listener_header(column){
	//When clicked, sort the table by that column.
	column.addEventListener('click', function(event){
		//Reset the counter.
		counter = 0;
		//Variable to store the remaining items in the table.
		var temp_array = [];
		//Get the table body.
		var table_body = document.getElementById('table_body');
		//Get the remaining table rows.
		var table_rows = document.getElementsByClassName('table_row');
		for(var i = 0; i < station_data.length; i++){
			for(var j = 0; j < table_rows.length; j++){
				if(station_data[i].Location == table_rows[j].childNodes[2].innerHTML){
					temp_array.push(station_data[i]);
				}
			}
		}
		//Reset the station_data array.
		station_data = temp_array;
		//Clear the table body.
		while(table_body.firstChild){
			table_body.removeChild(table_body.firstChild);
		}
		//Sort the station_data array by the desired column.
		sort_station_data(column.innerHTML);
		//Create rows in the table that contain the station data.
		for(var y = 0; y < station_data.length; y++){
			create_row(station_data[y]);
		}
	}, false);
}