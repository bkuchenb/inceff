/*jshint maxerr:200 */
//Load the formulary
var formulary = load_formulary();
console.log(formulary.length + ' items were loaded from the formulary.');
//Get the first item element.
var items = document.getElementsByClassName('items');
var item = items[items.length -1];
//Create flags for item in formulary and already scanned.
var in_formulary = false;
var found_match = false;
//Place the cursor in the first empty cell.
item.focus();
//Add an action listener to the barcode field (ClassName = items).
create_listener(item);
//Create an action listener for the first button.
create_listener_delete(document.getElementById('btn_0'));
function create_listener_print(btn_print){
	//Add an event listener to the print button.
	btn_print.addEventListener('click', function(event){
		//Get all the items that need to be printed.
		var  barcode_list = document.getElementsByClassName('barcode');
		var  item_order_list = document.getElementsByClassName('item_order');
		var  desc_order = document.getElementsByClassName('desc_order');
		var  source_order_list = document.getElementsByClassName('source_order');
		var  sqty_order_list = document.getElementsByClassName('sqty_order');
		var  qty_list = document.getElementsByClassName('qty');
		var  location_list = document.getElementsByClassName('location');
		//Create a csv list of all the data.
		var csv = [];
		for(var i = 0; i < item_order_list.length - 1; i++){
			csv.push(location_list[i + 1].innerHTML + ',' + item_order_list[i].innerHTML
			+ ',' + desc_order[i].innerHTML	+ ',' + source_order_list[i].innerHTML
			+ ',' + sqty_order_list[i].innerHTML + ',' + qty_list[i].value);
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
			sqty_order_list[j].innerHTML = row_array[4];
			qty_list[j].value = row_array[5];
			//Replace the barcode valu with line #.
			barcode_list[j + 1].innerHTML = j + 1;
		}
		//Update the barcode column heading.
		barcode_list[0].innerHTML = 'Line';
		window.print();
	}, false);
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
function create_listener(item){
	//Add an event listener to the input cell.
	item.addEventListener('keyup', function(event){
		event.preventDefault();
		if(event.keyCode == 13){
			found_match = false;
			//Update the item details.
			get_data(item);
			var navbar = document.getElementById('navbar');
			//Create a button for printing the order.
			if(!navbar.contains(document.getElementById('btn_print'))){
				var btn_print = document.createElement('button');
				btn_print.id = 'btn_print';
				btn_print.innerHTML = 'Print Pick List';
				//Create an action listener for the print button.
				create_listener_print(btn_print);
				//Add the button to the navbar.
				document.getElementById('navbar').appendChild(btn_print);
			}
		}
	}, false);
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
function create_row(item){
	//Find the tbody element.
	var tbody = document.getElementById('table_body');
	//Create a new row in the table.
	var row = document.createElement('tr');
	//Set the class name for the row.
	row.className = 'empty_row';
	//Create cells for the next item.
	var cell_0 = document.createElement('td');
	//Set the class name for the barcode cell.
	cell_0.className = 'barcode';
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
	//Set the class name for the suggested qty cell.
	cell_4.className = 'sqty_order';
	var cell_5 = document.createElement('td');
	var cell_6 = document.createElement('td');
	//Set the class name for the delete button cell.
	cell_6.className = 'delete';
	var cell_7 = document.createElement('td');
	//Set the class name for the location cell.
	cell_7.className = 'location';
	//Create an input for the next barcode.
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
	//Add the barcode input to the first cell.
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
	//Move the cursor to the new empty line.
	next_item.focus();
	//Add an action listener to the new input.
	create_listener(next_item);
	//Create a listener for the button.
	create_listener_delete(btn_delete);
}
function get_data(item){
  var entry = '';
  var in_formulary = false;
	//Replace the first part of the barcode.
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
	check_rows(entry.ItemNumber, entry.OrderQty);
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
		cells[cells.length - 15].innerHTML = entry.ItemNumber;
		cells[cells.length - 14].innerHTML = entry.ItemDescription;
		cells[cells.length - 13].innerHTML = entry.Source;
		cells[cells.length - 12].innerHTML = '';
		cells[cells.length - 9].innerHTML = entry.Location;
		//Get all the qty inputs.
		quantities = document.getElementsByClassName('qty');
		quantities[quantities.length - 2].value = entry.OrderQty;
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
function load_formulary(){
	var formulary = [
		{"MedId": "64912", "ItemNumber": "200857", "ItemDescription": "ACELLULAR DPT (ADACEL)", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "10A1A"},
		{"MedId": "82375", "ItemNumber": "240328", "ItemDescription": "ALTEPLASE VI 2MG (CATHFLOW)", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10A1D"},
		{"MedId": "98693", "ItemNumber": "105510", "ItemDescription": "ASPIRIN SUPP 600MG U/D", "UOM": "12 SUPP/BX", "Source": "INV", "OrderQty": 12, "Location": "10A1F"},
		{"MedId": "33437", "ItemNumber": "100492", "ItemDescription": "BOTULINUM TOXIN VL 100U", "UOM": "Dr. W. NOTIS - GI", "Source": "INV", "OrderQty": 1, "Location": "10A2A"},
		{"MedId": "65229", "ItemNumber": "201030", "ItemDescription": "CALCITONIN NASAL SPR-RDNA", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10A2B"},
		{"MedId": "20629", "ItemNumber": "105565", "ItemDescription": "CARBOPROST VL 250MCG", "UOM": "10 VIALS/BO", "Source": "INV", "OrderQty": 10, "Location": "10A2D"},
		{"MedId": "38534", "ItemNumber": "105963", "ItemDescription": "DIGOXIN IMMUNE FAB 40MG", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10A3C"},
		{"MedId": "29310", "ItemNumber": "104745", "ItemDescription": "EPOETIN VL 3000U 1ML", "UOM": "6 VIALS/CT", "Source": "INV", "OrderQty": 6, "Location": "10A4B"},
		{"MedId": "20973", "ItemNumber": "104734", "ItemDescription": "EPOETIN VL 4000U 1ML", "UOM": "6 VIALS/CT", "Source": "INV", "OrderQty": 6, "Location": "10A4C"},
		{"MedId": "29771", "ItemNumber": "104746", "ItemDescription": "EPOETIN VL 10000U 1ML", "UOM": "6 VIALS/CT", "Source": "INV", "OrderQty": 6, "Location": "10A4D"},
		{"MedId": "43421", "ItemNumber": "104735", "ItemDescription": "EPOETIN VL 20000U 1ML", "UOM": "4 VIALS/CT", "Source": "INV", "OrderQty": 4, "Location": "10A4E"},
		{"MedId": "51406", "ItemNumber": "100862", "ItemDescription": "HAEMOPHILUS B VL(ACTHIB)", "UOM": "5 VIALS/BX", "Source": "INV", "OrderQty": 5, "Location": "10A6C"},
		{"MedId": "3176", "ItemNumber": "101290", "ItemDescription": "HEP-B IMMUNE GLOB VL 5ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10A6F"},
		{"MedId": "98736", "ItemNumber": "211289", "ItemDescription": "INDOMETHACIN SUPP 50MG", "UOM": "30 SUPPS/BX", "Source": "INV", "OrderQty": 30, "Location": "10A7C"},
		{"MedId": "55585", "ItemNumber": "200253", "ItemDescription": "INSULIN NOVOLOG", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10A7D"},
		{"MedId": "58969", "ItemNumber": "200904", "ItemDescription": "INSULIN NOVOLOG 70/30", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10A7E"},
		{"MedId": "17897", "ItemNumber": "105480", "ItemDescription": "INSULIN NOVOLIN N", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10A8A"},
		{"MedId": "82178", "ItemNumber": "206024", "ItemDescription": "INSULIN DETEMIR VL 100U", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10A8C"},
		{"MedId": "17878", "ItemNumber": "105479", "ItemDescription": "INSULIN NOVOLIN R", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10A8D"},
		{"MedId": "82813", "ItemNumber": "265881", "ItemDescription": "CEFAZOLIN 1 GM/DEXT FROZEN MB", "UOM": "24 BAGS/CA", "Source": "INV", "OrderQty": 24, "Location": "10B2A"},
		{"MedId": "82818", "ItemNumber": "142639", "ItemDescription": "VANCOMYCIN 1GM/DEXT 200ML FROZ", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10B4B"},
		{"MedId": "41705", "ItemNumber": "105578", "ItemDescription": "LATANOPROST OPH SOL 2.5ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10C1A"},
		{"MedId": "29881", "ItemNumber": "100863", "ItemDescription": "MENINGOCOCCAL VAC VL", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10C1C"},
		{"MedId": "40328", "ItemNumber": "105280", "ItemDescription": "MMR II VL (MEAS/MUMP/RUB", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "10C2A"},
		{"MedId": "62276", "ItemNumber": "223048", "ItemDescription": "OCTREOTIDE LAR SYR 30MG", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "10C2E"},
		{"MedId": "19151", "ItemNumber": "105468", "ItemDescription": "OCTREOTIDE VL 100MCG 1ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "10C3A"},
		{"MedId": "5207", "ItemNumber": "105317", "ItemDescription": "PNEUMOCOCCOL VAC VL", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "10C5A"},
		{"MedId": "52606", "ItemNumber": "103131", "ItemDescription": "PORACTANT VL 1.5ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10C5C"},
		{"MedId": "52607", "ItemNumber": "103130", "ItemDescription": "PORACTANT VL 3ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10C5D"},
		{"MedId": "98814", "ItemNumber": "103808", "ItemDescription": "PROMETHAZINE SUPP 25MG", "UOM": "12 SUPP/BX", "Source": "INV", "OrderQty": 12, "Location": "10C6A"},
		{"MedId": "17363", "ItemNumber": "103414", "ItemDescription": "PROPARACAINE OPH .5% 15ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10C6B"},
		{"MedId": "99669", "ItemNumber": "103414", "ItemDescription": "PROPARACAINE OPH .5% 15ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10C6B"},
		{"MedId": "1508", "ItemNumber": "102754", "ItemDescription": "RABIES VACCINE HUMAN 1ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10C6C"},
		{"MedId": "5659", "ItemNumber": "107948", "ItemDescription": "RABIES IMMUNE GLOB 2ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10C7A"},
		{"MedId": "82589", "ItemNumber": "251247", "ItemDescription": "TBO-FILGRASTIM SYR 300MCG 0.5M", "UOM": "10 SYRINGES/CT", "Source": "INV", "OrderQty": 10, "Location": "10C7B"},
		{"MedId": "82590", "ItemNumber": "251248", "ItemDescription": "TBO-FILGRASTIM SYR 480MCG 0.8M", "UOM": "10 SYRINGES/CT", "Source": "INV", "OrderQty": 10, "Location": "10C7C"},
		{"MedId": "1809", "ItemNumber": "101289", "ItemDescription": "TETANUS IMMUNE GLOB 250U", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "10C8B"},
		{"MedId": "3884", "ItemNumber": "100868", "ItemDescription": "TETANUS/DIP ADULT 0.5ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "10C8C"},
		{"MedId": "82795", "ItemNumber": "263950", "ItemDescription": "INFLUENZA TRI VAC 0.5ML", "UOM": "10 SYRINGES/CT", "Source": "INV", "OrderQty": 10, "Location": "11A2A"},
		{"MedId": "25652", "ItemNumber": "237881", "ItemDescription": "BACITRACIN VL 50KU", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "11D1A"},
		{"MedId": "99145", "ItemNumber": "249980", "ItemDescription": "CISATRACURIUM VL 5ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "11D2A"},
		{"MedId": "32400", "ItemNumber": "107193", "ItemDescription": "DILTIAZEM VL 5MG/ML 5ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "11D3B"},
		{"MedId": "49071", "ItemNumber": "105969", "ItemDescription": "EPTIFIBATIDE VL 10ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "11D5A"},
		{"MedId": "99198", "ItemNumber": "105970", "ItemDescription": "EPTIFIBATIDE VL 100ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "11D5B"},
		{"MedId": "82418", "ItemNumber": "200913", "ItemDescription": "HEPATITIS B PEDI (NYS PGM)", "UOM": "GLAXOSMITH BRAND ONLY", "Source": "INV", "OrderQty": 1, "Location": "11D6A"},
		{"MedId": "22754", "ItemNumber": "100303", "ItemDescription": "FAMOTIDINE VL 20MG 2ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "11E1A"},
		{"MedId": "99115", "ItemNumber": "100532", "ItemDescription": "ROCURONIUM VL 10ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "11E5A"},
		{"MedId": "60450", "ItemNumber": "100314", "ItemDescription": "DRUG SUCCINYLCHO FTV200MG/10ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "11F1A"},
		{"MedId": "17687", "ItemNumber": "100652", "ItemDescription": "VASOPRESSIN VL 20U", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "11F2A"},
		{"MedId": "82035", "ItemNumber": "216581", "ItemDescription": "NICARDIPINE PREMX 20MG 200ML", "UOM": "EA/CT10", "Source": "INV", "OrderQty": 10, "Location": "12A3A"},
		{"MedId": "82551", "ItemNumber": "250511", "ItemDescription": "NITROGLY 50MG/D5W 250ML", "UOM": "12 BO/CA", "Source": "INV", "OrderQty": 12, "Location": "12A4A"},
		{"MedId": "82620", "ItemNumber": "253957", "ItemDescription": "HEPARIN 25KU 0.45NACL 250ML", "UOM": "24 BAGS/CA", "Source": "INV", "OrderQty": 24, "Location": "13A2A"},
		{"MedId": "31865", "ItemNumber": "100529", "ItemDescription": "FLOURETS OPH STRIPS 100", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1A4D"},
		{"MedId": "98686", "ItemNumber": "103803", "ItemDescription": "ACETAMIN SUPP 120MG U/D", "UOM": "12 SUPP/BX", "Source": "INV", "OrderQty": 12, "Location": "1B1A"},
		{"MedId": "98687", "ItemNumber": "103806", "ItemDescription": "ACETAMIN SUPP 325MG U/D", "UOM": "12 SUPP/BX", "Source": "INV", "OrderQty": 12, "Location": "1B1B"},
		{"MedId": "98688", "ItemNumber": "216771", "ItemDescription": "ACETAMIN SUPP 650MG", "UOM": "12 SUPP/BX", "Source": "INV", "OrderQty": 12, "Location": "1B1C"},
		{"MedId": "98694", "ItemNumber": "106982", "ItemDescription": "BISACODYL SUPP 10MG", "UOM": "100 SUPP/BX", "Source": "INV", "OrderQty": 100, "Location": "1B1D"},
		{"MedId": "99649", "ItemNumber": "229157", "ItemDescription": "GLYCERIN SUPP INFANT U/D", "UOM": "10 SUPP/CT", "Source": "INV", "OrderQty": 10, "Location": "1B2A"},
		{"MedId": "98787", "ItemNumber": "105509", "ItemDescription": "PROCHLORPER SUPP 25MG", "UOM": "12 SUPP/BX", "Source": "INV", "OrderQty": 12, "Location": "1B2H"},
		{"MedId": "99549", "ItemNumber": "200523", "ItemDescription": "ACETYLCYS SOL 10% 4ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "1B3A"},
		{"MedId": "82289", "ItemNumber": "233702", "ItemDescription": "ALBUTEROL HFA INHALER (OR/ICU)", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1B3C"},
		{"MedId": "57884", "ItemNumber": "103924", "ItemDescription": "ALBUTEROL SOL 20ML BOT", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1B3D"},
		{"MedId": "34872", "ItemNumber": "214857", "ItemDescription": "ALBUTEROL HFA IN HALER", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1C1A"},
		{"MedId": "53892", "ItemNumber": "100831", "ItemDescription": "BUDESONIDE 0.5MG/2ML NEB", "UOM": "30 NEBS/CT", "Source": "INV", "OrderQty": 30, "Location": "1C4A"},
		{"MedId": "99090", "ItemNumber": "215610", "ItemDescription": "IPRATROPIUM NEB .5MG 2.5ML SGL", "UOM": "30 NEBS/CT", "Source": "INV", "OrderQty": 30, "Location": "1D1A"},
		{"MedId": "6740", "ItemNumber": "105550", "ItemDescription": "PHENYLEPH DROP 1% 30ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1D2A"},
		{"MedId": "14112", "ItemNumber": "105966", "ItemDescription": "PHENYLEPH NAS SP .25%15ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1D2B"},
		{"MedId": "2090", "ItemNumber": "101281", "ItemDescription": "PHENYLEPH NAS SP .5 15ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1D2C"},
		{"MedId": "98228", "ItemNumber": "105416", "ItemDescription": "RACEMIC EPI INH NEB 2.25%", "UOM": "30 NEBS/BX", "Source": "INV", "OrderQty": 30, "Location": "1D2E"},
		{"MedId": "5226", "ItemNumber": "103805", "ItemDescription": "BACITRACIN OINT 1OZ", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1D4G"},
		{"MedId": "46600", "ItemNumber": "101585", "ItemDescription": "BENZOCAINE SPRAY 20% KIT", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1D5A"},
		{"MedId": "38230", "ItemNumber": "104658", "ItemDescription": "COLLAGEN FLOUR JAR 0.5GM", "UOM": "6 JARS/BX", "Source": "INV", "OrderQty": 6, "Location": "1D6A"},
		{"MedId": "18746", "ItemNumber": "127513", "ItemDescription": "DIBUCAINE OINT 1% 1OZ", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1D6D"},
		{"MedId": "33587", "ItemNumber": "107904", "ItemDescription": "EMLA CREAM ER PYXIS", "UOM": "5 TUBES/BX", "Source": "INV", "OrderQty": 5, "Location": "1D6E"},
		{"MedId": "98864", "ItemNumber": "103536", "ItemDescription": "EUCERIN CREAM 4OZ", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1E1A"},
		{"MedId": "99077", "ItemNumber": "102929", "ItemDescription": "FERRIC SUBSULFATE AQUEOUS", "UOM": "12 BO/CA", "Source": "INV", "OrderQty": 12, "Location": "1E1B"},
		{"MedId": "8184", "ItemNumber": "103212", "ItemDescription": "HYDROCORT CR 1% 1OZ", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1E2B"},
		{"MedId": "55020", "ItemNumber": "104870", "ItemDescription": "LANOLIN TENDER CARE 0.3OZ", "UOM": "50 TUBES/CA", "Source": "INV", "OrderQty": 50, "Location": "1E2F"},
		{"MedId": "31691", "ItemNumber": "100817", "ItemDescription": "LIDOCAINE JELLY 2% 30GM", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1E3A"},
		{"MedId": "23040", "ItemNumber": "105878", "ItemDescription": "LIDOCAINE TOP SOL 4% 50ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1E4B"},
		{"MedId": "52234", "ItemNumber": "103317", "ItemDescription": "LIDOCAINE PATCH 700MG", "UOM": "30 PATCH/BX", "Source": "INV", "OrderQty": 30, "Location": "1E5A"},
		{"MedId": "99303", "ItemNumber": "103419", "ItemDescription": "LMX 5 GM TUBE", "UOM": "5 TUBES/CT", "Source": "INV", "OrderQty": 5, "Location": "1E6A"},
		{"MedId": "99748", "ItemNumber": "103419", "ItemDescription": "LMX 5 GM TUBE", "UOM": "5 TUBES/CT", "Source": "INV", "OrderQty": 5, "Location": "1E6A"},
		{"MedId": "33212", "ItemNumber": "103219", "ItemDescription": "MICONAZOLE CR 2% 30GM", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1E6D"},
		{"MedId": "99021", "ItemNumber": "105422", "ItemDescription": "MICONAZOLE 2% PWD 2.5OZ", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1F1A"},
		{"MedId": "6744", "ItemNumber": "106507", "ItemDescription": "MUPIROCIN OINT 2% 22GM", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1F2A"},
		{"MedId": "51504", "ItemNumber": "255939", "ItemDescription": "NICOTINE PATCH 7MG", "UOM": "14 PATCH/BX", "Source": "INV", "OrderQty": 14, "Location": "1F3A"},
		{"MedId": "51505", "ItemNumber": "105425", "ItemDescription": "NICOTINE PATCH 14MG", "UOM": "14 PATCH/BX", "Source": "INV", "OrderQty": 14, "Location": "1F3B"},
		{"MedId": "41382", "ItemNumber": "105423", "ItemDescription": "NICOTINE PATCH 21MG", "UOM": "14 PATCH/BX", "Source": "INV", "OrderQty": 14, "Location": "1F3C"},
		{"MedId": "799", "ItemNumber": "224194", "ItemDescription": "NITROGLY OINT 2% FOIL PK", "UOM": "48EA/CT", "Source": "INV", "OrderQty": 48, "Location": "1F4A"},
		{"MedId": "17220", "ItemNumber": "103425", "ItemDescription": "NITROLINGUAL SPR .4MG", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1F4B"},
		{"MedId": "22062", "ItemNumber": "236671", "ItemDescription": "NYSTATIN CR 15GM", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1F4C"},
		{"MedId": "98607", "ItemNumber": "101058", "ItemDescription": "SCOPOLAMINE PATCH", "UOM": "4 PATCH/BX", "Source": "INV", "OrderQty": 4, "Location": "1F5B"},
		{"MedId": "98607", "ItemNumber": "224433", "ItemDescription": "SCOPOLAMINE PATCH", "UOM": "24 PATCH/BX", "Source": "INV", "OrderQty": 24, "Location": "1F5B"},
		{"MedId": "96077", "ItemNumber": "100815", "ItemDescription": "SILVER NITRATE APP STICK", "UOM": "100 STICKS/BX", "Source": "INV", "OrderQty": 100, "Location": "1F5C"},
		{"MedId": "16441", "ItemNumber": "107845", "ItemDescription": "SILVER SULF 20GM TB ER/OR", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1F5D"},
		{"MedId": "744", "ItemNumber": "105375", "ItemDescription": "THROMBIN TOPICAL 5000U", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "1F5G"},
		{"MedId": "99289", "ItemNumber": "107015", "ItemDescription": "ACETYLCYSTEINE CAP 600MG", "UOM": "60 CAPS/BO", "Source": "INV", "OrderQty": 60, "Location": "2A1B"},
		{"MedId": "23349", "ItemNumber": "104128", "ItemDescription": "ACYCLOVIR CAP 200MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A1C"},
		{"MedId": "3717", "ItemNumber": "107022", "ItemDescription": "ALLOPURINOL TAB 100MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A1E"},
		{"MedId": "3722", "ItemNumber": "107033", "ItemDescription": "ALLOPURINOL TAB 300MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A1F"},
		{"MedId": "98530", "ItemNumber": "244882", "ItemDescription": "AMIODARONE TAB 200MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2A1G"},
		{"MedId": "4590", "ItemNumber": "105748", "ItemDescription": "AMITRIPTY TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A2A"},
		{"MedId": "43522", "ItemNumber": "105584", "ItemDescription": "AMLODIPINE TAB 2.5MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2A2E"},
		{"MedId": "99026", "ItemNumber": "247407", "ItemDescription": "AMLODIPINE TAB 5MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2A2F"},
		{"MedId": "22577", "ItemNumber": "106502", "ItemDescription": "AMOX CAP 250MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A2H"},
		{"MedId": "98849", "ItemNumber": "105777", "ItemDescription": "AMOX/CLAV TAB 500MG", "UOM": "20 TABS/BO", "Source": "INV", "OrderQty": 20, "Location": "2A2J"},
		{"MedId": "99189", "ItemNumber": "247013", "ItemDescription": "AMOX/CLAV TAB 875MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A2K"},
		{"MedId": "82516", "ItemNumber": "248115", "ItemDescription": "APIXABAN TAB 2.5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A3A"},
		{"MedId": "82517", "ItemNumber": "248116", "ItemDescription": "APIXABAN TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A3B"},
		{"MedId": "58385", "ItemNumber": "266253", "ItemDescription": "ARIPIPAZOLE TAB 15MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2A3D"},
		{"MedId": "43108", "ItemNumber": "107794", "ItemDescription": "ASCORB ACID TAB 500MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2A3F"},
		{"MedId": "98865", "ItemNumber": "227031", "ItemDescription": "ASPIRIN TAB EC 81MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2A3G"},
		{"MedId": "4565", "ItemNumber": "104934", "ItemDescription": "ASPIRIN TAB 325MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2A3H"},
		{"MedId": "9662", "ItemNumber": "107939", "ItemDescription": "ASPIRIN TAB EC 325MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A3J"},
		{"MedId": "34124", "ItemNumber": "105436", "ItemDescription": "ATENOLOL TAB 25MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A3K"},
		{"MedId": "2105", "ItemNumber": "105435", "ItemDescription": "ATENOLOL TAB 50MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2A3L"},
		{"MedId": "42850", "ItemNumber": "105574", "ItemDescription": "ATORVASTATIN TAB 10MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2A3M"},
		{"MedId": "82354", "ItemNumber": "238254", "ItemDescription": "ATORVASTATIN TAB 20MG", "UOM": "90 TABLETS/BO", "Source": "INV", "OrderQty": 90, "Location": "2A3N"},
		{"MedId": "45320", "ItemNumber": "244506", "ItemDescription": "ATORVASTATIN TAB 40MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2A4A"},
		{"MedId": "53710", "ItemNumber": "105608", "ItemDescription": "ATORVASTATIN TAB 80MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2A4B"},
		{"MedId": "99071", "ItemNumber": "258039", "ItemDescription": "AZITHROMYCIN TAB 250MG", "UOM": "18 TABS/BX", "Source": "INV", "OrderQty": 18, "Location": "2A4C"},
		{"MedId": "45264", "ItemNumber": "106990", "ItemDescription": "BACLOFEN TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A4D"},
		{"MedId": "34041", "ItemNumber": "106985", "ItemDescription": "BACLOFEN TAB 20MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A4E"},
		{"MedId": "31252", "ItemNumber": "104117", "ItemDescription": "BENAZEPRIL TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A4F"},
		{"MedId": "49937", "ItemNumber": "105676", "ItemDescription": "BENZONATATE CAP 100MG", "UOM": "500 CAPS/BO", "Source": "INV", "OrderQty": 500, "Location": "2A4H"},
		{"MedId": "17529", "ItemNumber": "104891", "ItemDescription": "BISACODYL TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A5B"},
		{"MedId": "2616", "ItemNumber": "103330", "ItemDescription": "BUMETANIDE TAB 1MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A5D"},
		{"MedId": "39466", "ItemNumber": "254455", "ItemDescription": "BUMETANIDE TAB 2MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2A5E"},
		{"MedId": "41252", "ItemNumber": "105396", "ItemDescription": "BUPROPRION TAB 75MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A5F"},
		{"MedId": "21184", "ItemNumber": "105397", "ItemDescription": "BUPROPRION TAB 100MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A5G"},
		{"MedId": "98516", "ItemNumber": "103376", "ItemDescription": "BUSPIRONE TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A5I"},
		{"MedId": "23373", "ItemNumber": "103377", "ItemDescription": "BUSPIRONE TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A5J"},
		{"MedId": "98769", "ItemNumber": "106500", "ItemDescription": "CALCITROL CAP .25MCG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A5K"},
		{"MedId": "98959", "ItemNumber": "105405", "ItemDescription": "CALCIUM ACET CAP 667MG", "UOM": "200 CAPS/BO", "Source": "INV", "OrderQty": 200, "Location": "2A5L"},
		{"MedId": "6323", "ItemNumber": "104125", "ItemDescription": "CALCIUM D TAB 250MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2A6A"},
		{"MedId": "28707", "ItemNumber": "213582", "ItemDescription": "CALCIUM CARB-VIT D TAB 600MG", "UOM": "150 TABS/BO", "Source": "INV", "OrderQty": 150, "Location": "2A6B"},
		{"MedId": "6320", "ItemNumber": "229136", "ItemDescription": "CA CARB TAB 500MG", "UOM": "300 TABS/BO", "Source": "INV", "OrderQty": 300, "Location": "2A6C"},
		{"MedId": "24276", "ItemNumber": "213583", "ItemDescription": "CALCIUM CARB TAB 600MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A6D"},
		{"MedId": "82477", "ItemNumber": "246658", "ItemDescription": "CALCIUM CARBONATE CHEW 1000MG", "UOM": "72 TABS/BO", "Source": "INV", "OrderQty": 72, "Location": "2A6E"},
		{"MedId": "53114", "ItemNumber": "104942", "ItemDescription": "CAPTOPRIL TAB 25MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A6G"},
		{"MedId": "51878", "ItemNumber": "103316", "ItemDescription": "CARBI/LEVO TAB 25/100MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2B1A"},
		{"MedId": "45374", "ItemNumber": "103563", "ItemDescription": "CARVEDILOL TAB 3.125MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B1E"},
		{"MedId": "45375", "ItemNumber": "103562", "ItemDescription": "CARVEDILOL TAB 6.25MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B1F"},
		{"MedId": "45376", "ItemNumber": "103561", "ItemDescription": "CARVEDILOL TAB 12.5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B1G"},
		{"MedId": "45378", "ItemNumber": "209226", "ItemDescription": "CARVEDILOL TAB 25MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B1H"},
		{"MedId": "50525", "ItemNumber": "105616", "ItemDescription": "CELECOXIB CAP 200MG", "UOM": "100 CAPS/BX", "Source": "INV", "OrderQty": 100, "Location": "2B2D"},
		{"MedId": "18027", "ItemNumber": "107800", "ItemDescription": "CEPACOL LOZENGE 384/BX", "UOM": "384 LOZ/BX", "Source": "INV", "OrderQty": 384, "Location": "2B2E"},
		{"MedId": "15875", "ItemNumber": "104104", "ItemDescription": "CEPHALEXIN CAP 250MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B2F"},
		{"MedId": "15876", "ItemNumber": "104103", "ItemDescription": "CEPHALEXIN CAP 500MG", "UOM": "500 CAPS/BO", "Source": "INV", "OrderQty": 500, "Location": "2B2G"},
		{"MedId": "99205", "ItemNumber": "104885", "ItemDescription": "CHOLECALCIFEROL CAP 400IU", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B2H"},
		{"MedId": "82124", "ItemNumber": "222176", "ItemDescription": "CHOLECALCIFEROL TAB 1000IU", "UOM": "180 TABS/BO", "Source": "INV", "OrderQty": 180, "Location": "2B3A"},
		{"MedId": "61222", "ItemNumber": "200535", "ItemDescription": "CINACALCET TAB 30MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "2B3D"},
		{"MedId": "5505", "ItemNumber": "107944", "ItemDescription": "CIPRO TAB 250MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B3E"},
		{"MedId": "5507", "ItemNumber": "107946", "ItemDescription": "CIPROFLOXACIN TAB 500MG U/D", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B3F"},
		{"MedId": "15865", "ItemNumber": "105775", "ItemDescription": "CLINDAMYCIN CAP 150MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B4A"},
		{"MedId": "60543", "ItemNumber": "105738", "ItemDescription": "CLONIDINE TAB 0.1MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2B4B"},
		{"MedId": "60564", "ItemNumber": "105739", "ItemDescription": "CLONIDINE TAB 0.2MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B5A"},
		{"MedId": "48014", "ItemNumber": "246460", "ItemDescription": "CLOPIDOGREL TAB 75 MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2B5B"},
		{"MedId": "22681", "ItemNumber": "105875", "ItemDescription": "CLOTRIMAZOLE TROC 10MG", "UOM": "140 TROCS/BO", "Source": "INV", "OrderQty": 140, "Location": "2B5C"},
		{"MedId": "26706", "ItemNumber": "104135", "ItemDescription": "CYANOCOBAL TAB 1000MCG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B5F"},
		{"MedId": "99417", "ItemNumber": "104742", "ItemDescription": "CYCLOBENZAPRINE TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B5G"},
		{"MedId": "41144", "ItemNumber": "106959", "ItemDescription": "CYCLOBENZAPR TAB 10MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2B5H"},
		{"MedId": "82270", "ItemNumber": "231913", "ItemDescription": "DABIGATRAN CAP 150MG", "UOM": "60 TABS/BO", "Source": "INV", "OrderQty": 60, "Location": "2B6A"},
		{"MedId": "46705", "ItemNumber": "105906", "ItemDescription": "DEXAMETH TAB 4MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B6C"},
		{"MedId": "27117", "ItemNumber": "107066", "ItemDescription": "DICYCLOMINE CAP 10MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B6D"},
		{"MedId": "27118", "ItemNumber": "104952", "ItemDescription": "DICYCLOMINE TAB 20MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B6E"},
		{"MedId": "14305", "ItemNumber": "101582", "ItemDescription": "DIGOXIN TAB .125MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B6F"},
		{"MedId": "24056", "ItemNumber": "101581", "ItemDescription": "DIGOXIN TAB .25MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B6G"},
		{"MedId": "6246", "ItemNumber": "106508", "ItemDescription": "DILTIAZEM TAB 30MG U/D", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B6H"},
		{"MedId": "6266", "ItemNumber": "106504", "ItemDescription": "DILTIAZEM TAB 60MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C1A"},
		{"MedId": "32712", "ItemNumber": "229499", "ItemDescription": "DILTIAZEM CD 180MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C1C"},
		{"MedId": "32715", "ItemNumber": "100618", "ItemDescription": "DILTIAZEM CD 240MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C1D"},
		{"MedId": "36789", "ItemNumber": "106936", "ItemDescription": "DIPHENHYD CAP 25MGU/D", "UOM": "100 CAPS/BX", "Source": "INV", "OrderQty": 100, "Location": "2C1F"},
		{"MedId": "36824", "ItemNumber": "104894", "ItemDescription": "DIPHENHYD CAP 50MG U/D", "UOM": "100 CAPS/BX", "Source": "INV", "OrderQty": 100, "Location": "2C1G"},
		{"MedId": "10550", "ItemNumber": "100395", "ItemDescription": "DIVALPROEX SODIUM TAB EC 250MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C2C"},
		{"MedId": "99379", "ItemNumber": "100377", "ItemDescription": "DIVALPROIC ACID TAB SR 500MG", "UOM": "80 TABS/BO", "Source": "INV", "OrderQty": 80, "Location": "2C2D"},
		{"MedId": "42489", "ItemNumber": "264129", "ItemDescription": "DONEPEZIL TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C2E"},
		{"MedId": "42493", "ItemNumber": "264130", "ItemDescription": "DONEPEZIL TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C2F"},
		{"MedId": "98990", "ItemNumber": "213574", "ItemDescription": "DOXAZOSIN TAB 1MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C2G"},
		{"MedId": "98991", "ItemNumber": "213575", "ItemDescription": "DOXAZOSIN TAB 2MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C2H"},
		{"MedId": "98992", "ItemNumber": "213576", "ItemDescription": "DOXAZOSIN TAB 4MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C2I"},
		{"MedId": "61997", "ItemNumber": "213577", "ItemDescription": "DOXAZOSIN TAB 8MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C2J"},
		{"MedId": "16291", "ItemNumber": "249462", "ItemDescription": "DOXYCYCLINE CAP 100MG", "UOM": "50 CAPS/BO", "Source": "INV", "OrderQty": 50, "Location": "2C2L"},
		{"MedId": "62485", "ItemNumber": "254174", "ItemDescription": "DULOXETINE CAP 30MG", "UOM": "30 EA/BO", "Source": "INV", "OrderQty": 30, "Location": "2C2O"},
		{"MedId": "62483", "ItemNumber": "254175", "ItemDescription": "DULOXETINE CAP 60MG", "UOM": "30 CAPS/BO", "Source": "INV", "OrderQty": 30, "Location": "2C2P"},
		{"MedId": "15662", "ItemNumber": "107937", "ItemDescription": "ENALAPRIL TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C3B"},
		{"MedId": "82606", "ItemNumber": "253182", "ItemDescription": "ESCITALOPRAM TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C3F"},
		{"MedId": "82607", "ItemNumber": "253183", "ItemDescription": "ESCITALOPRAM TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C3G"},
		{"MedId": "82608", "ItemNumber": "253184", "ItemDescription": "ESCITALOPRAM TAB 20MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C3H"},
		{"MedId": "58207", "ItemNumber": "105287", "ItemDescription": "EZETIMIDE TAB 10MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2C3I"},
		{"MedId": "22745", "ItemNumber": "247749", "ItemDescription": "FAMOTIDINE TAB 20MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2C3J"},
		{"MedId": "57784", "ItemNumber": "103492", "ItemDescription": "FENOFIBRATE CAP 200 MG", "UOM": "90 CAPS/BO", "Source": "INV", "OrderQty": 90, "Location": "2C3K"},
		{"MedId": "23345", "ItemNumber": "106991", "ItemDescription": "FERROUS GLU TAB 325MG UD", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2C3L"},
		{"MedId": "43135", "ItemNumber": "104114", "ItemDescription": "FERROUS SUL TAB 325MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2C3M"},
		{"MedId": "99093", "ItemNumber": "105690", "ItemDescription": "FLUOXETINE CAP 10MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C4E"},
		{"MedId": "98556", "ItemNumber": "105677", "ItemDescription": "FLUOXETINE CAP 20MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C4F"},
		{"MedId": "22089", "ItemNumber": "107815", "ItemDescription": "FOLIC ACID TAB 1MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2C4G"},
		{"MedId": "11754", "ItemNumber": "105907", "ItemDescription": "FUROSEM TAB 20MG U/D", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C4I"},
		{"MedId": "34801", "ItemNumber": "105576", "ItemDescription": "GABAPENTIN CAP 100MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C5A"},
		{"MedId": "34802", "ItemNumber": "255605", "ItemDescription": "GABAPENTIN CAP 300MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C5B"},
		{"MedId": "34804", "ItemNumber": "105553", "ItemDescription": "GABAPENTIN CAP 400MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C6A"},
		{"MedId": "52437", "ItemNumber": "105604", "ItemDescription": "GABAPENTIN TAB 600MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2C6B"},
		{"MedId": "42200", "ItemNumber": "107868", "ItemDescription": "GUAIFENESIN TAB 600MG SA", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2C6L"},
		{"MedId": "18298", "ItemNumber": "105678", "ItemDescription": "HYDRALAZINE TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D1C"},
		{"MedId": "37116", "ItemNumber": "105687", "ItemDescription": "HYDRALAZINE TAB 25MG U/D", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D1D"},
		{"MedId": "37140", "ItemNumber": "105686", "ItemDescription": "HYDRALAZINE TAB 50MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D1E"},
		{"MedId": "68290", "ItemNumber": "222309", "ItemDescription": "HCTZ CAP 12.5MG U/D", "UOM": "100 CAPS/BX", "Source": "INV", "OrderQty": 100, "Location": "2D1F"},
		{"MedId": "4907", "ItemNumber": "105743", "ItemDescription": "HCTZ TAB 25MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D1G"},
		{"MedId": "51446", "ItemNumber": "245036", "ItemDescription": "HYDROXYZINE PAM CAP 25MG", "UOM": "500 CAPS/BO", "Source": "INV", "OrderQty": 500, "Location": "2D1I"},
		{"MedId": "45668", "ItemNumber": "245037", "ItemDescription": "HYDROXYZINE PAM CAP 50MG", "UOM": "500 CAPS/BO", "Source": "INV", "OrderQty": 500, "Location": "2D1J"},
		{"MedId": "33251", "ItemNumber": "254479", "ItemDescription": "IBUPROFEN TAB 200MG UD", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2D2A"},
		{"MedId": "47023", "ItemNumber": "102267", "ItemDescription": "IRBESARTAN TAB 150MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2D3B"},
		{"MedId": "39680", "ItemNumber": "103381", "ItemDescription": "ISOSORBIDE MONO 30MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D3E"},
		{"MedId": "33797", "ItemNumber": "103380", "ItemDescription": "ISOSORBIDE MONO TAB 60MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D3F"},
		{"MedId": "25681", "ItemNumber": "105723", "ItemDescription": "LABETALOL TAB 100MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D3G"},
		{"MedId": "23480", "ItemNumber": "105724", "ItemDescription": "LABETALOL TAB 200MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D3H"},
		{"MedId": "51941", "ItemNumber": "104884", "ItemDescription": "LACTOBICILLUS CAP", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D3J"},
		{"MedId": "41345", "ItemNumber": "103574", "ItemDescription": "LAMOTRIGINE TAB 100MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D4B"},
		{"MedId": "52602", "ItemNumber": "230252", "ItemDescription": "LEVETIRACETAM TAB 500MG U/D", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2D4F"},
		{"MedId": "42846", "ItemNumber": "104719", "ItemDescription": "LEVOFLOXACIN TAB 250MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D4H"},
		{"MedId": "42848", "ItemNumber": "265425", "ItemDescription": "LEVOFLOXACIN TAB 500MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D4I"},
		{"MedId": "99268", "ItemNumber": "243460", "ItemDescription": "LEVOFLOXACIN TAB 750MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D4J"},
		{"MedId": "98745", "ItemNumber": "103456", "ItemDescription": "LEVOTHYROX TAB 25MCG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2D5A"},
		{"MedId": "6588", "ItemNumber": "103457", "ItemDescription": "LEVOTHYROX TAB 50MCG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D5B"},
		{"MedId": "98746", "ItemNumber": "103470", "ItemDescription": "LEVOTHYROX TAB 75MCG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2D5C"},
		{"MedId": "30036", "ItemNumber": "103459", "ItemDescription": "LEVOTHYROX TAB 88MCG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2D5D"},
		{"MedId": "6686", "ItemNumber": "103458", "ItemDescription": "LEVOTHYRO TAB 100MCG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D5E"},
		{"MedId": "18508", "ItemNumber": "103460", "ItemDescription": "LEVOTHYROX TAB 112MCG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2D5F"},
		{"MedId": "98748", "ItemNumber": "103467", "ItemDescription": "LEVOTHYROX TAB 125MCG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D5G"},
		{"MedId": "64357", "ItemNumber": "208284", "ItemDescription": "LEVOTHYROX TAB 137MCG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2D5H"},
		{"MedId": "6778", "ItemNumber": "103455", "ItemDescription": "LEVOTHYROX TAB 150MCG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D5I"},
		{"MedId": "6106", "ItemNumber": "254131", "ItemDescription": "LISINOPRIL TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D5K"},
		{"MedId": "6089", "ItemNumber": "222306", "ItemDescription": "LISINOPRIL TAB 10MG U/D", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2D6A"},
		{"MedId": "18568", "ItemNumber": "265930", "ItemDescription": "LISINOPRIL TAB 20MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D6B"},
		{"MedId": "9274", "ItemNumber": "105387", "ItemDescription": "LOPERAMIDE CAP 2MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D6D"},
		{"MedId": "33585", "ItemNumber": "254321", "ItemDescription": "LORATADINE TAB 10MG", "UOM": "300 TABS/BO", "Source": "INV", "OrderQty": 300, "Location": "2D6E"},
		{"MedId": "38291", "ItemNumber": "105302", "ItemDescription": "LOSARTAN TAB 25MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2D6G"},
		{"MedId": "38294", "ItemNumber": "257940", "ItemDescription": "LOSARTAN TAB 50MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2D6H"},
		{"MedId": "98599", "ItemNumber": "104907", "ItemDescription": "MAGNESIUM 500MG (SLO-MAG)", "UOM": "60 TABS/BO", "Source": "INV", "OrderQty": 60, "Location": "2D6J"},
		{"MedId": "43489", "ItemNumber": "105871", "ItemDescription": "MAG OXIDE TAB 400MG", "UOM": "120 TABS/BO", "Source": "INV", "OrderQty": 120, "Location": "2D6K"},
		{"MedId": "37540", "ItemNumber": "105522", "ItemDescription": "MECLIZINE TAB 12.5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2E1A"},
		{"MedId": "82378", "ItemNumber": "240470", "ItemDescription": "MELATONIN TAB 3MG", "UOM": "60 TABLETS/BO", "Source": "INV", "OrderQty": 60, "Location": "2E1B"},
		{"MedId": "82619", "ItemNumber": "257831", "ItemDescription": "MEMANTINE XR CAP 28MG", "UOM": "30 CAPS/BO", "Source": "INV", "OrderQty": 30, "Location": "2E1D"},
		{"MedId": "99107", "ItemNumber": "105713", "ItemDescription": "MESALAMINE EC CAP 400MG", "UOM": "180 CAPS/BO", "Source": "INV", "OrderQty": 180, "Location": "2E1E"},
		{"MedId": "37948", "ItemNumber": "107852", "ItemDescription": "METFORMIN TAB 500MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2E1G"},
		{"MedId": "60474", "ItemNumber": "104109", "ItemDescription": "METHYLDOPA TAB 250MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2E2C"},
		{"MedId": "53090", "ItemNumber": "230251", "ItemDescription": "METOCLOPRAM TAB 10MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2E2G"},
		{"MedId": "99495", "ItemNumber": "255392", "ItemDescription": "METOPROLOL TAB 25MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2E3C"},
		{"MedId": "99278", "ItemNumber": "253118", "ItemDescription": "METOPROLOL TAB XL 25MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2E3D"},
		{"MedId": "36868", "ItemNumber": "107968", "ItemDescription": "METOPROLOL TAB 50MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2E4A"},
		{"MedId": "99091", "ItemNumber": "252552", "ItemDescription": "METOPROLOL TAB XL 50MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2E4B"},
		{"MedId": "36872", "ItemNumber": "107969", "ItemDescription": "METOPROLOL TAB 100MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2E4C"},
		{"MedId": "99092", "ItemNumber": "100821", "ItemDescription": "METOPROLOL TAB XL 100MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2E4D"},
		{"MedId": "5636", "ItemNumber": "105684", "ItemDescription": "METRONIDAZ TAB 500MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2E5B"},
		{"MedId": "42948", "ItemNumber": "257247", "ItemDescription": "MIDODRINE TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2E5D"},
		{"MedId": "41587", "ItemNumber": "222388", "ItemDescription": "MIRTAZAPINE TAB 15MG U/D", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2E5H"},
		{"MedId": "41589", "ItemNumber": "254370", "ItemDescription": "MIRTAZAPINE TAB 30MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2E5I"},
		{"MedId": "48082", "ItemNumber": "256176", "ItemDescription": "MONTELUKAST TAB 10MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2E6A"},
		{"MedId": "82157", "ItemNumber": "223349", "ItemDescription": "MOXIFLOXACIN TAB 400MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "2E6B"},
		{"MedId": "17134", "ItemNumber": "104903", "ItemDescription": "MULTIVIT THERAP TAB", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2E6C"},
		{"MedId": "17130", "ItemNumber": "104945", "ItemDescription": "MULTIVITE/M VIT TAB", "UOM": "EA/BO1000", "Source": "INV", "OrderQty": 1000, "Location": "2E6D"},
		{"MedId": "24891", "ItemNumber": "104130", "ItemDescription": "MULTIVIT W/ZINC TAB", "UOM": "60 TABS/BO", "Source": "INV", "OrderQty": 60, "Location": "2E6E"},
		{"MedId": "39942", "ItemNumber": "104931", "ItemDescription": "NAPROSYN TAB 500MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2E6G"},
		{"MedId": "98807", "ItemNumber": "216552", "ItemDescription": "NEUTROPHOS TAB 250MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2F1A"},
		{"MedId": "45933", "ItemNumber": "104823", "ItemDescription": "NIACIN TAB SR 500MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2F1B"},
		{"MedId": "3142", "ItemNumber": "105737", "ItemDescription": "NIFEDIPINE CAP 10MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2F1C"},
		{"MedId": "3959", "ItemNumber": "104107", "ItemDescription": "NITROFURAN CAP 100MG (BID)", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2F1E"},
		{"MedId": "23324", "ItemNumber": "103373", "ItemDescription": "NITROGLY SL 0.4MG (BO OF25)", "UOM": "4 BOTTLES/BX", "Source": "INV", "OrderQty": 4, "Location": "2F2A"},
		{"MedId": "45361", "ItemNumber": "103296", "ItemDescription": "OLANZAPINE TAB 2.5MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "2F2C"},
		{"MedId": "53822", "ItemNumber": "103308", "ItemDescription": "OLANZAPINE DISIN TAB 5MG", "UOM": "30 TABS/BX", "Source": "INV", "OrderQty": 30, "Location": "2F2D"},
		{"MedId": "42922", "ItemNumber": "103295", "ItemDescription": "OLANZAPINE TAB 5MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "2F2E"},
		{"MedId": "41932", "ItemNumber": "103299", "ItemDescription": "OLANZAPINE TAB 10MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "2F3A"},
		{"MedId": "99583", "ItemNumber": "209047", "ItemDescription": "ONDANSETRON OD TAB 4MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "2F3C"},
		{"MedId": "50661", "ItemNumber": "208981", "ItemDescription": "ONDANSETRON TAB 4MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "2F3D"},
		{"MedId": "8342", "ItemNumber": "105685", "ItemDescription": "OXYBUTYNIN TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2F3F"},
		{"MedId": "82251", "ItemNumber": "230825", "ItemDescription": "PANCRELIPASE CAP 24KU", "UOM": "250 CAPS/BO", "Source": "INV", "OrderQty": 250, "Location": "2F4A"},
		{"MedId": "52743", "ItemNumber": "263256", "ItemDescription": "PANTOPRAZOLE TAB 40MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2F4B"},
		{"MedId": "33494", "ItemNumber": "105525", "ItemDescription": "PAROXETINE TAB 20MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2F4D"},
		{"MedId": "40540", "ItemNumber": "105529", "ItemDescription": "PAROXETINE TAB 10MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "2F4D"},
		{"MedId": "33498", "ItemNumber": "100777", "ItemDescription": "PAROXETINE TAB 30MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2F4E"},
		{"MedId": "82675", "ItemNumber": "256608", "ItemDescription": "PHENAZOPYRIDINE TAB 95MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "2F5D"},
		{"MedId": "98796", "ItemNumber": "105292", "ItemDescription": "PHYTONADIONE TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2F5F"},
		{"MedId": "20817", "ItemNumber": "218742", "ItemDescription": "POT CHL TAB 10MEQ", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2F6A"},
		{"MedId": "57011", "ItemNumber": "230070", "ItemDescription": "POT CHL TAB SR 20MEQ", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2F6B"},
		{"MedId": "32390", "ItemNumber": "102257", "ItemDescription": "PRAVASTATIN TAB 20MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "3A1B"},
		{"MedId": "82355", "ItemNumber": "238255", "ItemDescription": "PRAVASTATIN TAB 40MG", "UOM": "90 TABLETS/BO", "Source": "INV", "OrderQty": 90, "Location": "3A1C"},
		{"MedId": "82356", "ItemNumber": "238256", "ItemDescription": "PRAVASTATIN TAB 80MG", "UOM": "90 TABLETS/BO", "Source": "INV", "OrderQty": 90, "Location": "3A1D"},
		{"MedId": "7838", "ItemNumber": "105757", "ItemDescription": "PREDNISONE TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A1G"},
		{"MedId": "23669", "ItemNumber": "105887", "ItemDescription": "PREDNISONE TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A1H"},
		{"MedId": "13556", "ItemNumber": "105899", "ItemDescription": "PREDNISONE TAB 20MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A1I"},
		{"MedId": "82766", "ItemNumber": "264369", "ItemDescription": "PRENATAL VIT W/ IODINE", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "3A1K"},
		{"MedId": "58453", "ItemNumber": "209427", "ItemDescription": "PROCARDIA (GEQ) TAB XL 30MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A2A"},
		{"MedId": "63629", "ItemNumber": "264002", "ItemDescription": "PROCARDIA XL TAB 60MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A2B"},
		{"MedId": "82753", "ItemNumber": "264003", "ItemDescription": "PROCARDIA XL TAB 90MG", "UOM": "80 TABS/BO", "Source": "INV", "OrderQty": 80, "Location": "3A2C"},
		{"MedId": "40630", "ItemNumber": "106931", "ItemDescription": "PROCHLORPERAZINE TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A2D"},
		{"MedId": "20110", "ItemNumber": "107024", "ItemDescription": "PROMETHAZINE TAB 25MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A2E"},
		{"MedId": "35960", "ItemNumber": "107943", "ItemDescription": "PYRIDOXINE TAB 50MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A2J"},
		{"MedId": "46540", "ItemNumber": "100827", "ItemDescription": "QUETIAPINE TAB 25MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A3A"},
		{"MedId": "54347", "ItemNumber": "205070", "ItemDescription": "QUETIAPINE TAB 50MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A3B"},
		{"MedId": "46537", "ItemNumber": "100828", "ItemDescription": "QUETIAPINE TAB 100MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A3C"},
		{"MedId": "46538", "ItemNumber": "107982", "ItemDescription": "QUETIAPINE TAB 200MG U/D", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A3D"},
		{"MedId": "32678", "ItemNumber": "105579", "ItemDescription": "QUINAPRIL TAB 10MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "3A3F"},
		{"MedId": "32680", "ItemNumber": "105580", "ItemDescription": "QUINAPRIL TAB 20MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "3A3G"},
		{"MedId": "31184", "ItemNumber": "105367", "ItemDescription": "RAMIPRIL CAP 5MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A3I"},
		{"MedId": "66861", "ItemNumber": "206026", "ItemDescription": "RANOLAZINE TAB 500MG", "UOM": "60 TABS/BO", "Source": "INV", "OrderQty": 60, "Location": "3A3J"},
		{"MedId": "82264", "ItemNumber": "231417", "ItemDescription": "RIFAXIMIN TAB 550MG", "UOM": "60 TABS/BO", "Source": "INV", "OrderQty": 60, "Location": "3A4C"},
		{"MedId": "99656", "ItemNumber": "200881", "ItemDescription": "SACCHAROMYCES CAP 250MG", "UOM": "50 CAPS/BO", "Source": "INV", "OrderQty": 50, "Location": "3A4I"},
		{"MedId": "19783", "ItemNumber": "104923", "ItemDescription": "SENNA TAB BULK", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "3A5A"},
		{"MedId": "43243", "ItemNumber": "266082", "ItemDescription": "SERTRALINE TAB 25MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "3A5B"},
		{"MedId": "33655", "ItemNumber": "265587", "ItemDescription": "SERTRALINE TAB 50MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "3A5C"},
		{"MedId": "54533", "ItemNumber": "103530", "ItemDescription": "SEVELAMER TAB 800MG", "UOM": "180 TABS/BO", "Source": "INV", "OrderQty": 180, "Location": "3A5E"},
		{"MedId": "16353", "ItemNumber": "105745", "ItemDescription": "SIMETHICONE TAB 80MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A5G"},
		{"MedId": "68094", "ItemNumber": "208145", "ItemDescription": "SITAGLIPTIN TAB 50MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "3A6B"},
		{"MedId": "68099", "ItemNumber": "208146", "ItemDescription": "SITAGLIPTIN TAB 100MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "3A6C"},
		{"MedId": "99034", "ItemNumber": "105527", "ItemDescription": "SOTALOL TAB 80MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A6D"},
		{"MedId": "99133", "ItemNumber": "105528", "ItemDescription": "SOTALOL TAB 120MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A6E"},
		{"MedId": "8418", "ItemNumber": "239688", "ItemDescription": "SUCRALFATE TAB 1GM", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "3A6H"},
		{"MedId": "23917", "ItemNumber": "106973", "ItemDescription": "SULFAM/TRI TAB DS", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A6I"},
		{"MedId": "46218", "ItemNumber": "100358", "ItemDescription": "TAMSULOSIN CAP 0.4MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B1E"},
		{"MedId": "43169", "ItemNumber": "107940", "ItemDescription": "THIAMINE TAB 100MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "3B2B"},
		{"MedId": "82390", "ItemNumber": "241233", "ItemDescription": "TICAGRELOR TAB 90MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B2C"},
		{"MedId": "43038", "ItemNumber": "103324", "ItemDescription": "TIZANIDINE TAB 4MG", "UOM": "150 TABS/BO", "Source": "INV", "OrderQty": 150, "Location": "3B2D"},
		{"MedId": "42909", "ItemNumber": "264330", "ItemDescription": "TOPIRAMATE TAB 25MG", "UOM": "50 TABS/BX", "Source": "INV", "OrderQty": 50, "Location": "3B2F"},
		{"MedId": "42911", "ItemNumber": "264331", "ItemDescription": "TOPIRAMATE TAB 100MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "3B2G"},
		{"MedId": "745", "ItemNumber": "229414", "ItemDescription": "TRAZODONE TAB 50MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "3B2I"},
		{"MedId": "775", "ItemNumber": "105674", "ItemDescription": "TRAZODONE TAB 100MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B2J"},
		{"MedId": "17388", "ItemNumber": "105672", "ItemDescription": "TRIAM/HCTZ TAB 37.5/25", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B2K"},
		{"MedId": "98949", "ItemNumber": "106484", "ItemDescription": "URSODIOL CAP 300MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B3A"},
		{"MedId": "42797", "ItemNumber": "105452", "ItemDescription": "VALSARTAN CAP 80MG", "UOM": "90 CAPS/BO", "Source": "INV", "OrderQty": 90, "Location": "3B3E"},
		{"MedId": "42802", "ItemNumber": "105453", "ItemDescription": "VALSARTAN CAP 160MG", "UOM": "90 CAPS/BO", "Source": "INV", "OrderQty": 90, "Location": "3B3F"},
		{"MedId": "67420", "ItemNumber": "207911", "ItemDescription": "VARENICLINE TAB 0.5MG", "UOM": "56 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "3B3G"},
		{"MedId": "67421", "ItemNumber": "207912", "ItemDescription": "VARENICLINE TAB 1MG", "UOM": "56 TABS/BO", "Source": "INV", "OrderQty": 56, "Location": "3B3G"},
		{"MedId": "35331", "ItemNumber": "107148", "ItemDescription": "VENLAFAXINE TAB 37.5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B3H"},
		{"MedId": "49449", "ItemNumber": "107145", "ItemDescription": "VENLAFAXINE TAB 75MG XRUD", "UOM": "90 CAPS/BO", "Source": "INV", "OrderQty": 90, "Location": "3B3I"},
		{"MedId": "46372", "ItemNumber": "107144", "ItemDescription": "VENLAFAXINE CAP XR 150MG", "UOM": "90 TABS/BX", "Source": "INV", "OrderQty": 90, "Location": "3B3J"},
		{"MedId": "5517", "ItemNumber": "107030", "ItemDescription": "VERAPAMIL TAB 40MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B4A"},
		{"MedId": "2889", "ItemNumber": "107023", "ItemDescription": "VERAPAMIL TAB 80MG U/D", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B4B"},
		{"MedId": "2904", "ItemNumber": "104899", "ItemDescription": "VERAPAMIL TAB 120MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B4C"},
		{"MedId": "30820", "ItemNumber": "106945", "ItemDescription": "VERAPAMIL TAB SR 120MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B4D"},
		{"MedId": "23076", "ItemNumber": "106947", "ItemDescription": "VERAPAMIL TAB SR 180MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B4E"},
		{"MedId": "17705", "ItemNumber": "106948", "ItemDescription": "VERAPAMIL TAB SR 240MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B4F"},
		{"MedId": "48444", "ItemNumber": "104908", "ItemDescription": "VIT B W/VIT C CAP", "UOM": "130 CAPS/BO", "Source": "INV", "OrderQty": 130, "Location": "3B4G"},
		{"MedId": "24019", "ItemNumber": "102242", "ItemDescription": "DRUG WARFARIN TAB 1MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B5A"},
		{"MedId": "16274", "ItemNumber": "102247", "ItemDescription": "DRUG WARFARIN TAB 2MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "3B5B"},
		{"MedId": "18916", "ItemNumber": "102240", "ItemDescription": "DRUG WARFARIN TAB 2.5MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "3B5C"},
		{"MedId": "43374", "ItemNumber": "102243", "ItemDescription": "DRUG WARFARIN TAB 3MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B5D"},
		{"MedId": "16283", "ItemNumber": "102239", "ItemDescription": "DRUG WARFARIN TAB 5MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "3B6A"},
		{"MedId": "16286", "ItemNumber": "102241", "ItemDescription": "DRUG WARFARIN TAB 7.5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B6B"},
		{"MedId": "16288", "ItemNumber": "102248", "ItemDescription": "DRUG WARFARIN TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B6C"},
		{"MedId": "98842", "ItemNumber": "106974", "ItemDescription": "ZINC SULFATE CAP 220MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B6D"},
		{"MedId": "11356", "ItemNumber": "101541", "ItemDescription": "ACETAZOL VL 500MG/10ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "3C1A"},
		{"MedId": "3139", "ItemNumber": "100633", "ItemDescription": "ACYCLOVIR VL 500MG", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "3C1B"},
		{"MedId": "22587", "ItemNumber": "250374", "ItemDescription": "ADENOSINE VL 6MG", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3C1C"},
		{"MedId": "44971", "ItemNumber": "100339", "ItemDescription": "DRUG AMINOPHY VL 500MG", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3C3A"},
		{"MedId": "19432", "ItemNumber": "104090", "ItemDescription": "ATROPINE SYR 1MG/10ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "3D1B"},
		{"MedId": "5695", "ItemNumber": "101067", "ItemDescription": "ATROPINE VL .4MG 1ML", "UOM": "25 VIALS/BX", "Source": "INV", "OrderQty": 25, "Location": "3D1C"},
		{"MedId": "19709", "ItemNumber": "101088", "ItemDescription": "ATROPINE VL 1MG 1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3D1D"},
		{"MedId": "54447", "ItemNumber": "105047", "ItemDescription": "BIVALIRUDIN VL 250MG", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "3D3C"},
		{"MedId": "10102", "ItemNumber": "101101", "ItemDescription": "BUMETANIDE VL 1MG 4ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "3D4A"},
		{"MedId": "57034", "ItemNumber": "100413", "ItemDescription": "BUPIV TTV .25% 30ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3D5B"},
		{"MedId": "6171", "ItemNumber": "100283", "ItemDescription": "BUPIV/EPI .25% 10ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "3D6A"},
		{"MedId": "57173", "ItemNumber": "100414", "ItemDescription": "BUPIVACAINE TTV .5% 30ML", "UOM": "25 VIALS /CT", "Source": "INV", "OrderQty": 25, "Location": "3E1A"},
		{"MedId": "17274", "ItemNumber": "104088", "ItemDescription": "SYR CA CL 10ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "3E2A"},
		{"MedId": "13198", "ItemNumber": "104862", "ItemDescription": "CEFTRIAXONE VL 250MG", "UOM": "10 VIALS/BX", "Source": "INV", "OrderQty": 10, "Location": "3F1A"},
		{"MedId": "13307", "ItemNumber": "254304", "ItemDescription": "CEFTRIAXONE VL 1GM", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3F1B"},
		{"MedId": "23403", "ItemNumber": "101065", "ItemDescription": "CHLORPROM AMP 50MG 2ML", "UOM": "25 AMPS/BX", "Source": "W/S", "OrderQty": 1, "Location": "3F1E"},
		{"MedId": "8525", "ItemNumber": "238248", "ItemDescription": "CHLOROPROC VL 3% 20ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3F2A"},
		{"MedId": "9518", "ItemNumber": "100702", "ItemDescription": "CORTROSYN VL .25MG", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "3F2C"},
		{"MedId": "2052", "ItemNumber": "100623", "ItemDescription": "CYANOCOBAL VL 1MG 1ML", "UOM": "25 VIALS/BX", "Source": "INV", "OrderQty": 25, "Location": "3F2D"},
		{"MedId": "99505", "ItemNumber": "100635", "ItemDescription": "DEXAMETH VL 4MG/1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3F3A"},
		{"MedId": "5763", "ItemNumber": "100640", "ItemDescription": "DEXAMETH VL 20MG/5ML(MDV)", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3F4A"},
		{"MedId": "3901", "ItemNumber": "101069", "ItemDescription": "DEXAMETH VL 10MG 1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3F4B"},
		{"MedId": "12783", "ItemNumber": "101062", "ItemDescription": "DIGOXIN AMP .5MG 2ML", "UOM": "25 AMPS/BX", "Source": "INV", "OrderQty": 25, "Location": "3F5A"},
		{"MedId": "13310", "ItemNumber": "101558", "ItemDescription": "DIHYDROER 45 VL 1MG/1ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "3F5B"},
		{"MedId": "23884", "ItemNumber": "100630", "ItemDescription": "DIPHENHYD VL 50MG 1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3F6A"},
		{"MedId": "6729", "ItemNumber": "100368", "ItemDescription": "DRUG ENALAPRIL VL 2.5MG 2ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "4A4A"},
		{"MedId": "33629", "ItemNumber": "100889", "ItemDescription": "ENOXAPARIN SYR 30MG/0.3ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "4A5A"},
		{"MedId": "99201", "ItemNumber": "100877", "ItemDescription": "ENOXAPARIN SYR 60MG/0.6ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "4A6A"},
		{"MedId": "99202", "ItemNumber": "100878", "ItemDescription": "ENOXAPARIN SYR 80MG/0.8ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "4B1A"},
		{"MedId": "99203", "ItemNumber": "100876", "ItemDescription": "ENOXAPARIN SYR 100MG/ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "4B2A"},
		{"MedId": "99295", "ItemNumber": "100886", "ItemDescription": "ENOXAPARIN SYR 120MG", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "4B3A"},
		{"MedId": "99294", "ItemNumber": "100887", "ItemDescription": "ENOXAPARIN SYR 150MG", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "4B3B"},
		{"MedId": "1183", "ItemNumber": "236672", "ItemDescription": "EPHEDRINE AMP 50MG", "UOM": "10 AMPS/CT", "Source": "INV", "OrderQty": 10, "Location": "4B4B"},
		{"MedId": "18323", "ItemNumber": "104089", "ItemDescription": "EPINEPHRINE SYR 10ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "4B4C"},
		{"MedId": "2806", "ItemNumber": "100333", "ItemDescription": "EPINEPHRINE AMP 1 MG/1 ML", "UOM": "25 AMPS/BX", "Source": "INV", "OrderQty": 25, "Location": "4B5B"},
		{"MedId": "4946", "ItemNumber": "101538", "ItemDescription": "ETOMIDATE VL 20MG 10ML", "UOM": "10 VL/CT", "Source": "INV", "OrderQty": 10, "Location": "4C1B"},
		{"MedId": "99001", "ItemNumber": "104859", "ItemDescription": "FLUMAZENIL VL 0.5MG 5ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "4C2B"},
		{"MedId": "15336", "ItemNumber": "100554", "ItemDescription": "FLUORESCEIN VL 10% 5ML", "UOM": "12 VIALS/CT", "Source": "INV", "OrderQty": 12, "Location": "4C2C"},
		{"MedId": "4255", "ItemNumber": "100657", "ItemDescription": "GENTAMICIN PFV20MG/2ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4C4A"},
		{"MedId": "4284", "ItemNumber": "100398", "ItemDescription": "DRUG GENTAMICIN VL 80MG 2ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4C4B"},
		{"MedId": "16555", "ItemNumber": "107814", "ItemDescription": "GLUCAGON VL 1MG", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "4C6A"},
		{"MedId": "16579", "ItemNumber": "105988", "ItemDescription": "HALOPERIDOL VL 5MG 1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4C6C"},
		{"MedId": "47129", "ItemNumber": "100625", "ItemDescription": "HEPARIN VL 1KU/ML 10ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4D1C"},
		{"MedId": "4303", "ItemNumber": "100626", "ItemDescription": "HYDRALAZINE VL 20MG 1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4D3A"},
		{"MedId": "35009", "ItemNumber": "105567", "ItemDescription": "HYDROCORT VL 100MG PF", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "4D3B"},
		{"MedId": "82671", "ItemNumber": "255628", "ItemDescription": "IC GREEN DYE", "UOM": "6 VIALS/CT", "Source": "INV", "OrderQty": 6, "Location": "4D4B"},
		{"MedId": "14351", "ItemNumber": "107040", "ItemDescription": "IRON DEXTRAN VL 2ML", "UOM": "10VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "4D4D"},
		{"MedId": "54227", "ItemNumber": "100683", "ItemDescription": "IRON SUCROSE VL 20MG 5ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "4D4F"},
		{"MedId": "23886", "ItemNumber": "100334", "ItemDescription": "ISOPROTER AMP 1MG 5ML", "UOM": "10 AMPS/CT", "Source": "INV", "OrderQty": 10, "Location": "4D4G"},
		{"MedId": "98932", "ItemNumber": "101550", "ItemDescription": "KETOROLAC VL 60MG", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4D4H"},
		{"MedId": "49038", "ItemNumber": "107194", "ItemDescription": "KETOROLAC VL 15MG", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4D5A"},
		{"MedId": "98883", "ItemNumber": "100355", "ItemDescription": "KETOROLAC VL 30MG 1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4D5B"},
		{"MedId": "98852", "ItemNumber": "100305", "ItemDescription": "DRUG LABETALOL VL 100MG 20ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "4D6A"},
		{"MedId": "19528", "ItemNumber": "106454", "ItemDescription": "LEUPROLIDE INJ 7.5MG", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "4E2A"},
		{"MedId": "15650", "ItemNumber": "265212", "ItemDescription": "LIDOCAINE 1% W/EPI VL 30ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4E3C"},
		{"MedId": "32880", "ItemNumber": "100320", "ItemDescription": "LIDOCAINE W/EPI 1% 20ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4E4A"},
		{"MedId": "32881", "ItemNumber": "100321", "ItemDescription": "LIDOCAINE W/EPI 2% 20ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4E5A"},
		{"MedId": "17438", "ItemNumber": "257248", "ItemDescription": "LIDOCAINE 2% W/EPI 20ML SDV", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4E5B"},
		{"MedId": "49714", "ItemNumber": "100688", "ItemDescription": "DRUG MANNITOL VL 25 50ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4F2B"},
		{"MedId": "54969", "ItemNumber": "100341", "ItemDescription": "MEPIVACAINE VL 1%  30ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "4F3A"},
		{"MedId": "55117", "ItemNumber": "100382", "ItemDescription": "MEPIVACAINE VL 2% 20ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "4F3B"},
		{"MedId": "82821", "ItemNumber": "265929", "ItemDescription": "METHYLENE BLUE AMP 0.5% 10ML", "UOM": "5 AMPS/CT", "Source": "INV", "OrderQty": 5, "Location": "4F4B"},
		{"MedId": "35016", "ItemNumber": "100307", "ItemDescription": "METHYLPRED VL 40MG 2ML", "UOM": "25 VIALS/BX", "Source": "INV", "OrderQty": 25, "Location": "4F5A"},
		{"MedId": "316", "ItemNumber": "105561", "ItemDescription": "METHYLPRED (DEPO) 40MG/ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4F6B"},
		{"MedId": "7824", "ItemNumber": "105562", "ItemDescription": "METHYLPRED (DEPO) 80MG/ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4F6C"},
		{"MedId": "35015", "ItemNumber": "100359", "ItemDescription": "METHYLPRED VL 125MG", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4F6D"},
		{"MedId": "4414", "ItemNumber": "105994", "ItemDescription": "METOCLOPRAM VL 10MG 2ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5A1A"},
		{"MedId": "33417", "ItemNumber": "100644", "ItemDescription": "MILRINONE VL  10ML10MG", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5A3B"},
		{"MedId": "17098", "ItemNumber": "200368", "ItemDescription": "MINERAL OIL STERILE 25ML", "UOM": "25 VIALS/PK", "Source": "INV", "OrderQty": 25, "Location": "5A3D"},
		{"MedId": "82601", "ItemNumber": "253056", "ItemDescription": "NALBUPHINE 20MG/ML SDV", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5A5A"},
		{"MedId": "57583", "ItemNumber": "265058", "ItemDescription": "NALOXONE VL 0.4MG/1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5A5B"},
		{"MedId": "6818", "ItemNumber": "103318", "ItemDescription": "NALOXONE SYR 2MG 2ML", "UOM": "10 EA/CT", "Source": "INV", "OrderQty": 10, "Location": "5A5C"},
		{"MedId": "61205", "ItemNumber": "103307", "ItemDescription": "OLANZAPINE VL 10MG", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "5B2A"},
		{"MedId": "98953", "ItemNumber": "208846", "ItemDescription": "ONDANSETRON VL 4MG 2ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5B3A"},
		{"MedId": "56611", "ItemNumber": "100622", "ItemDescription": "OXYTOCIN VL 10U 1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5B6C"},
		{"MedId": "82266", "ItemNumber": "107156", "ItemDescription": "PANTOPRAZOLE VL 40MG", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5C1A"},
		{"MedId": "32890", "ItemNumber": "249054", "ItemDescription": "PAPAVERINE VL 60MG 2ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5C4A"},
		{"MedId": "6753", "ItemNumber": "101547", "ItemDescription": "POLYMIXIN B VL 500000U", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5C6A"},
		{"MedId": "4421", "ItemNumber": "101064", "ItemDescription": "PROCHLORPER 10MG INJ", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5D1A"},
		{"MedId": "23418", "ItemNumber": "101063", "ItemDescription": "PROMETHAZINE VL  25MG", "UOM": "25 VIALS/BX", "Source": "INV", "OrderQty": 25, "Location": "5D1B"},
		{"MedId": "18469", "ItemNumber": "100627", "ItemDescription": "PROPRAN VL 1MG 1ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5D1C"},
		{"MedId": "48661", "ItemNumber": "100621", "ItemDescription": "PROTAMINE VL 50MG/5ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5D2B"},
		{"MedId": "51257", "ItemNumber": "256609", "ItemDescription": "ROPIVAC VL 2MG/ML 10ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5D3B"},
		{"MedId": "82302", "ItemNumber": "246955", "ItemDescription": "ROPIVAC VL 0.5% 20ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5D3C"},
		{"MedId": "41967", "ItemNumber": "100832", "ItemDescription": "ROPIVAC VL 10MG/ML 20ML", "UOM": "25 VIALS/BX", "Source": "INV", "OrderQty": 25, "Location": "5D4A"},
		{"MedId": "98910", "ItemNumber": "100659", "ItemDescription": "SOD BICARB SDV 4% 5ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5D6A"},
		{"MedId": "38468", "ItemNumber": "100658", "ItemDescription": "SOD CHL SDV 10ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5E2A"},
		{"MedId": "82770", "ItemNumber": "265053", "ItemDescription": "SUGAMMADEX VL 200MG/2ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5E3B"},
		{"MedId": "99055", "ItemNumber": "103589", "ItemDescription": "SUMATRIPTAN VL 6MG/.5ML", "UOM": "5 VIALS/CT", "Source": "INV", "OrderQty": 5, "Location": "5E3D"},
		{"MedId": "22205", "ItemNumber": "100662", "ItemDescription": "TERBUTALINE VL 1MG 1ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5E4B"},
		{"MedId": "1448", "ItemNumber": "100620", "ItemDescription": "THIAMINE VL 100MG 2ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5E4C"},
		{"MedId": "1995", "ItemNumber": "250372", "ItemDescription": "TOBRAMYCIN INJECT POW 1.2GM", "UOM": "6 VIALS/CT", "Source": "INV", "OrderQty": 6, "Location": "5E4E"},
		{"MedId": "99331", "ItemNumber": "100663", "ItemDescription": "TOBRAMYCIN VL 80MG 2ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5E4F"},
		{"MedId": "53300", "ItemNumber": "102194", "ItemDescription": "TRIAMCIN ACET VL 40MG 5ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "5E5B"},
		{"MedId": "33771", "ItemNumber": "245102", "ItemDescription": "VANCOMYCIN ADV 500MG PS2", "UOM": "25 VI/CT", "Source": "INV", "OrderQty": 25, "Location": "5E6B"},
		{"MedId": "32456", "ItemNumber": "107952", "ItemDescription": "VECURONIUM VL 10MG 10ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5F2A"},
		{"MedId": "4454", "ItemNumber": "100351", "ItemDescription": "DRUG VERAPAMIL VL 10MG", "UOM": "5 VIALS/CT", "Source": "INV", "OrderQty": 5, "Location": "5F3A"},
		{"MedId": "58619", "ItemNumber": "100345", "ItemDescription": "DRUG VIT K AMP 10MG 1ML", "UOM": "25 AMPS/CT", "Source": "INV", "OrderQty": 25, "Location": "5F4A"},
		{"MedId": "44978", "ItemNumber": "100656", "ItemDescription": "WATER INJ STER 20ML SD", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5F5A"},
		{"MedId": "13875", "ItemNumber": "201321", "ItemDescription": "ACETAMIN EL 650MG 20.3ML", "UOM": "100 CUPS/CA", "Source": "INV", "OrderQty": 100, "Location": "6A1B"},
		{"MedId": "21427", "ItemNumber": "104124", "ItemDescription": "BISMUTH LIQ 16OZ", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "6A3B"},
		{"MedId": "99078", "ItemNumber": "107012", "ItemDescription": "CHARCOAL ACTIV/AQUA 50GM", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "6A3G"},
		{"MedId": "98948", "ItemNumber": "100610", "ItemDescription": "CHLORHEX ORAL RINSE 16OZ", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "6A4A"},
		{"MedId": "98768", "ItemNumber": "106983", "ItemDescription": "CHOLESTYRAMINE PWD PK 4GM", "UOM": "60 PKTS/BX", "Source": "INV", "OrderQty": 60, "Location": "6A4B"},
		{"MedId": "16055", "ItemNumber": "106999", "ItemDescription": "CITRA PH 30ML", "UOM": "100 CUPS/CA", "Source": "INV", "OrderQty": 100, "Location": "6A5A"},
		{"MedId": "98641", "ItemNumber": "107906", "ItemDescription": "DILUENT-ORAL CHERRY 500ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "6A5B"},
		{"MedId": "35914", "ItemNumber": "200521", "ItemDescription": "DIPHENHYD ELIX 25MG 10ML", "UOM": "100 CUPS/BX", "Source": "INV", "OrderQty": 100, "Location": "6A6A"},
		{"MedId": "61972", "ItemNumber": "105633", "ItemDescription": "DOCUSATE SF 100MG 10ML", "UOM": "100 CUPS/CA", "Source": "INV", "OrderQty": 100, "Location": "6A6B"},
		{"MedId": "82443", "ItemNumber": "245059", "ItemDescription": "FERROUS SULF LIQ 16OZ", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "6A6F"},
		{"MedId": "45213", "ItemNumber": "105516", "ItemDescription": "GEL GLUCOSE ORAL GLUTOSE 15", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "6B1B"},
		{"MedId": "4693", "ItemNumber": "105641", "ItemDescription": "GUAIFENESIN LIQ 10ML U/D", "UOM": "10 CUPS/SLEEVE", "Source": "INV", "OrderQty": 10, "Location": "6B1C"},
		{"MedId": "4692", "ItemNumber": "105635", "ItemDescription": "GUAIFENESIN LIQ 15ML U/D", "UOM": "100 CUPS/CA", "Source": "INV", "OrderQty": 100, "Location": "6B1D"},
		{"MedId": "5661", "ItemNumber": "201315", "ItemDescription": "GUAIFENESIN DM 10ML U/D", "UOM": "10 CUPS/SLEEVE", "Source": "INV", "OrderQty": 10, "Location": "6B2A"},
		{"MedId": "63987", "ItemNumber": "201314", "ItemDescription": "IBUPROFEN LIQ 5ML U/D", "UOM": "50/CA", "Source": "INV", "OrderQty": 50, "Location": "6B2C"},
		{"MedId": "19028", "ItemNumber": "229175", "ItemDescription": "LACTULOSE LIQ 30ML", "UOM": "100 CUPS/BX", "Source": "INV", "OrderQty": 100, "Location": "6B3B"},
		{"MedId": "7688", "ItemNumber": "105881", "ItemDescription": "LIDOCAINE VISC 2% 100ML", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "6B5A"},
		{"MedId": "17083", "ItemNumber": "105650", "ItemDescription": "METOCLOPRAM LIQ 10MG U/D", "UOM": "10 CUPS/SLEEVE", "Source": "INV", "OrderQty": 10, "Location": "6B6A"},
		{"MedId": "60327", "ItemNumber": "229138", "ItemDescription": "NYSTATIN SUSP 5ML", "UOM": "100 CUPS/BX", "Source": "INV", "OrderQty": 100, "Location": "6B6B"},
		{"MedId": "99301", "ItemNumber": "265211", "ItemDescription": "PEG BOWEL 17 GM", "UOM": "100 PKT/CT", "Source": "INV", "OrderQty": 100, "Location": "6C1A"},
		{"MedId": "97059", "ItemNumber": "105640", "ItemDescription": "POT CHL LIQ 40MEQ/30ML UD", "UOM": "50 CUPS/BX", "Source": "INV", "OrderQty": 50, "Location": "6C2D"},
		{"MedId": "98987", "ItemNumber": "103379", "ItemDescription": "PREDNISOLONE LIQ 15MG/5ML BULK", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "6C3B"},
		{"MedId": "99200", "ItemNumber": "107971", "ItemDescription": "PSYLLIUM S/F INSTANT U/D", "UOM": "30 PACKETS/BX", "Source": "INV", "OrderQty": 30, "Location": "6C3C"},
		{"MedId": "18493", "ItemNumber": "102729", "ItemDescription": "SOD POLYSTY SUSP 60ML U/D", "UOM": "10BOTTLES/CT", "Source": "INV", "OrderQty": 10, "Location": "6C3H"},
		{"MedId": "19355", "ItemNumber": "105742", "ItemDescription": "SORE THROAT SPRAY 6OZ", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "6C4A"},
		{"MedId": "98902", "ItemNumber": "103923", "ItemDescription": "SULFAM/TRI LIQ 16OZ.", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "6C4B"},
		{"MedId": "26839", "ItemNumber": "254198", "ItemDescription": "ACETAMINOPHEN TAB 325MG UD", "UOM": "1000 TABS/CT", "Source": "INV", "OrderQty": 1000, "Location": "6C5A"},
		{"MedId": "54738", "ItemNumber": "215609", "ItemDescription": "ALBUTEROL SOL 2.5MG 3ML SINGLE", "UOM": "30 NEBS/CT", "Source": "INV", "OrderQty": 30, "Location": "6C6A"},
		{"MedId": "82137", "ItemNumber": "222683", "ItemDescription": "ALBUTEROL/IPRATROP INH 3ML", "UOM": "30 EACH/CT", "Source": "INV", "OrderQty": 30, "Location": "6D1A"},
		{"MedId": "6623", "ItemNumber": "104936", "ItemDescription": "ASPIRIN TAB CHEW 81MG", "UOM": "750 TABS/BO", "Source": "INV", "OrderQty": 750, "Location": "6D4A"},
		{"MedId": "24129", "ItemNumber": "105063", "ItemDescription": "BENZOCAINE SPRAY 2OZ", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "6D4B"},
		{"MedId": "46557", "ItemNumber": "105444", "ItemDescription": "CEFAZOLIN VL 1GM", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "6E1A"},
		{"MedId": "17851", "ItemNumber": "100337", "ItemDescription": "DEXTROSE SYR 50% 50ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "6F2A"},
		{"MedId": "99072", "ItemNumber": "216773", "ItemDescription": "DOBUTAMINE 500MG/D5W 250ML", "UOM": "12 BAGS/CA", "Source": "INV", "OrderQty": 12, "Location": "6F4A"},
		{"MedId": "43123", "ItemNumber": "229140", "ItemDescription": "DOCUSATE CAP 100MG U/D", "UOM": "750 CAPS/BX", "Source": "INV", "OrderQty": 750, "Location": "6F5A"},
		{"MedId": "99169", "ItemNumber": "100871", "ItemDescription": "ENOXAPARIN SYR 40MG/0.4ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "7A3A"},
		{"MedId": "63162", "ItemNumber": "102187", "ItemDescription": "ELECTROLYTE BOWEL SOL 4L", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "7B1A"},
		{"MedId": "16524", "ItemNumber": "100415", "ItemDescription": "FUROSEM VL 40MG 4ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "7C1A"},
		{"MedId": "6237", "ItemNumber": "101184", "ItemDescription": "GENTAMICIN PB 80MG 50ML", "UOM": "EA/CA24", "Source": "INV", "OrderQty": 24, "Location": "7C2A"},
		{"MedId": "46516", "ItemNumber": "101095", "ItemDescription": "GLYCOPYROLATE VL .2MG 1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "7C2B"},
		{"MedId": "82216", "ItemNumber": "227030", "ItemDescription": "HEPARIN VL 5KU/ML 1 ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "7C3A"},
		{"MedId": "23950", "ItemNumber": "261022", "ItemDescription": "IBUPROFEN TAB 400MG UD", "UOM": "750 TABS/BO", "Source": "INV", "OrderQty": 750, "Location": "7D1A"},
		{"MedId": "25825", "ItemNumber": "261023", "ItemDescription": "IBUPROFEN TAB 600MG UD", "UOM": "750 TABS/BO", "Source": "INV", "OrderQty": 750, "Location": "7D1B"},
		{"MedId": "56331", "ItemNumber": "260650", "ItemDescription": "IBUPROFEN TAB 800MG UD", "UOM": "750 TABS/BO", "Source": "INV", "OrderQty": 750, "Location": "7D1C"},
		{"MedId": "42843", "ItemNumber": "104741", "ItemDescription": "LEVOFLOXACIN PB 250MG", "UOM": "24 BAGS/BX", "Source": "INV", "OrderQty": 24, "Location": "7D1D"},
		{"MedId": "42844", "ItemNumber": "104722", "ItemDescription": "LEVOFLOXACIN MB 500MG 100", "UOM": "24 BAGS/CA", "Source": "INV", "OrderQty": 24, "Location": "7D2A"},
		{"MedId": "54065", "ItemNumber": "104743", "ItemDescription": "LEVOFLOXACIN PB 750MG", "UOM": "24 BAGS/CA", "Source": "INV", "OrderQty": 24, "Location": "7D4A"},
		{"MedId": "12797", "ItemNumber": "229139", "ItemDescription": "LIDOCAINE VL 1% 20ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "7E1A"},
		{"MedId": "56229", "ItemNumber": "100323", "ItemDescription": "LIDOCAINE VL 2% 20ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "7E3A"},
		{"MedId": "44959", "ItemNumber": "100338", "ItemDescription": "LIDOCAINE 2% SYR 100MG/5M", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "7F1A"},
		{"MedId": "82298", "ItemNumber": "100285", "ItemDescription": "KIT LARYNGOTRACHEAL ANES", "UOM": "25 KITS/CA", "Source": "INV", "OrderQty": 25, "Location": "7F2A"},
		{"MedId": "53804", "ItemNumber": "201178", "ItemDescription": "MAG HYDROX PLUS 30ML", "UOM": "10 CUPS/SLEEVE", "Source": "INV", "OrderQty": 10, "Location": "7F4A"},
		{"MedId": "3160", "ItemNumber": "101249", "ItemDescription": "METRONIDAZ PB 500MG 100ML", "UOM": "24 BAGS/BX", "Source": "INV", "OrderQty": 24, "Location": "8A1A"},
		{"MedId": "13895", "ItemNumber": "100418", "ItemDescription": "METOPROLOL VL 5MG 5ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "8B1A"},
		{"MedId": "82074", "ItemNumber": "100418", "ItemDescription": "METOPROLOL VL 5MG 5ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "8B1A"},
		{"MedId": "97058", "ItemNumber": "201179", "ItemDescription": "MILK OF MAG 30ML", "UOM": "10 CUPS/SLEEVE", "Source": "INV", "OrderQty": 10, "Location": "8B4A"},
		{"MedId": "98931", "ItemNumber": "245883", "ItemDescription": "NITROGLY 25MG/D5W 250ML", "UOM": "12 BOTTLES/CA", "Source": "INV", "OrderQty": 12, "Location": "8B5B"},
		{"MedId": "33914", "ItemNumber": "101086", "ItemDescription": "PROPOFOL VL 100ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "8F1A"},
		{"MedId": "16036", "ItemNumber": "100340", "ItemDescription": "SOD BICARB SYR 50ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "9A1A"},
		{"MedId": "78950", "ItemNumber": "100332", "ItemDescription": "SOD CHL BACT FTV 30ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "9B3A"},
		{"MedId": "21128", "ItemNumber": "105372", "ItemDescription": "THROMBIN KIT 20 UNIT", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "9B5B"},
		{"MedId": "12385", "ItemNumber": "101643", "ItemDescription": "WITCH HAZEL PADS", "UOM": "None", "Source": "INV", "OrderQty": 1, "Location": "9C3A"},
		{"MedId": "21265", "ItemNumber": "100311", "ItemDescription": "CALCITRIOL INJ 1MCG/ML", "UOM": "10 VIALS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "55908", "ItemNumber": "100421", "ItemDescription": "PARICALCITOL VL 2MCG 1ML", "UOM": "25 VIALS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "98689", "ItemNumber": "102739", "ItemDescription": "MELPHALEN TAB 2MG", "UOM": "50 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "48346", "ItemNumber": "103416", "ItemDescription": "TRIFLURIDINE OPH 1% 7.5ML", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "34821", "ItemNumber": "103512", "ItemDescription": "DORNASE ALPHA AMP 2.5MG", "UOM": "30 AMPS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "33324", "ItemNumber": "103553", "ItemDescription": "DIGOXIN PED AMP .1MG 1ML", "UOM": "10 AMPS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "98744", "ItemNumber": "103554", "ItemDescription": "CHLORAMBUCIL TAB 2MG", "UOM": "50 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "34195", "ItemNumber": "103799", "ItemDescription": "GLYCERIN SUPP ADULT U/D", "UOM": "10 SUPP/BX", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "99754", "ItemNumber": "104006", "ItemDescription": "IODINE TINCTURE 2% PTS", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "5339", "ItemNumber": "104110", "ItemDescription": "INDOMETHACIN CAP 25MG", "UOM": "100 CAPS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "98775", "ItemNumber": "104709", "ItemDescription": "ACETAMIN TAB 80MG", "UOM": "30 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "29308", "ItemNumber": "104733", "ItemDescription": "EPOETIN VL 2000U 1ML", "UOM": "6 VIALS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "58370", "ItemNumber": "105293", "ItemDescription": "ETHACRYNIC ACID VL 50MG", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "98881", "ItemNumber": "105296", "ItemDescription": "CHLOROTHIAZIDE VL INJECT 500MG", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "99134", "ItemNumber": "105300", "ItemDescription": "ALENDRONATE TAB 10MG", "UOM": "20 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "63571", "ItemNumber": "105365", "ItemDescription": "PCN/BENZATHINE LA 2.4MU", "UOM": "10 SYR/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "64771", "ItemNumber": "105374", "ItemDescription": "PCN/BENZATHINE LA 1.2MU", "UOM": "10 SYR/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "4407", "ItemNumber": "105376", "ItemDescription": "TRIMETHOBENZ VL 200MG", "UOM": "25 VL/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "77550", "ItemNumber": "105382", "ItemDescription": "ACETIC ACID OTIC 2% 15ML", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "54774", "ItemNumber": "105383", "ItemDescription": "HALOPERIDOL TAB .5MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "54863", "ItemNumber": "105384", "ItemDescription": "HALOPERIDOL TAB 1MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "54985", "ItemNumber": "105386", "ItemDescription": "HALOPERIDOL TAB 5MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "98972", "ItemNumber": "105526", "ItemDescription": "ACYCLOVIR TAB 800MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "33524", "ItemNumber": "105582", "ItemDescription": "DEPO PROVERA VL 150MG/1ML", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "50424", "ItemNumber": "105615", "ItemDescription": "CELECOXIB CAP 100MG", "UOM": "100 CAPS/BX", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "9137", "ItemNumber": "105675", "ItemDescription": "HYDROXYZINE TAB 10MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "29441", "ItemNumber": "105936", "ItemDescription": "PYRIDOSTIG AMP 5MG/ML", "UOM": "10 AMPS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "29646", "ItemNumber": "106453", "ItemDescription": "LEUPROLIDE INJ 3.75MG", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "4510", "ItemNumber": "107042", "ItemDescription": "ACETAZOL TAB 250MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "35326", "ItemNumber": "107143", "ItemDescription": "VENLAFAXINE TAB 25MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "78880", "ItemNumber": "107773", "ItemDescription": "ACETYLCYSTEINE VL 6G/30ML", "UOM": "4 VIALS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "99142", "ItemNumber": "107781", "ItemDescription": "FERRIS SUBSULFATE SOL 500", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "30948", "ItemNumber": "107792", "ItemDescription": "COCOA BUTTER BAR 1OZ", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "98755", "ItemNumber": "107798", "ItemDescription": "MEDROXYPROGESTER TAB 10MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "16436", "ItemNumber": "107803", "ItemDescription": "PEN VK TAB 500MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "52771", "ItemNumber": "107862", "ItemDescription": "LEUPROLIDE INJ 22.5MG", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "14286", "ItemNumber": "107960", "ItemDescription": "PHYSOSTIGMINE AMP 2MG 2ML", "UOM": "10 AMPS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "99378", "ItemNumber": "200894", "ItemDescription": "SOL SUCROSE NAT SWEET-EASE", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "82151", "ItemNumber": "200894", "ItemDescription": "SOL SUCROSE NAT SWEET-EASE", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "859", "ItemNumber": "201038", "ItemDescription": "HYALURONIDASE VL 150U", "UOM": "4 VIALS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "31890", "ItemNumber": "201180", "ItemDescription": "BENZTROPINE AMP 2MG/2ML", "UOM": "5 AMPS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "64714", "ItemNumber": "206027", "ItemDescription": "FONDAPARINUX SYR 2.5MG", "UOM": "10 SYR/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "55239", "ItemNumber": "208965", "ItemDescription": "LEUPROLIDE INJ 11.25MG", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "63025", "ItemNumber": "211011", "ItemDescription": "FONDAPARINUX SYR 5MG", "UOM": "10 SYR/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "63026", "ItemNumber": "211012", "ItemDescription": "FONDAPARINUX SYR 7.5MG", "UOM": "2 SYR/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "63027", "ItemNumber": "211013", "ItemDescription": "FONDAPARINUX SYR 10MG", "UOM": "10 SYR/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "60381", "ItemNumber": "211731", "ItemDescription": "LEVOTHYROX TAB 175MCG", "UOM": "90 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "85057", "ItemNumber": "216553", "ItemDescription": "METHYLNALTREXONE VL 12MG", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "2012", "ItemNumber": "216573", "ItemDescription": "SOL MANNITOL 20% IV 500ML", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "59061", "ItemNumber": "218092", "ItemDescription": "LEUPROLIDE KIT 30MG", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "40541", "ItemNumber": "229142", "ItemDescription": "PAROXETINE TAB 40MG", "UOM": "100 TABS/BX", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "231414", "ItemNumber": "231414", "ItemDescription": "BUBBLE GUM FLAVOR CONC 2OZ", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "231415", "ItemNumber": "231415", "ItemDescription": "CHOCOLATE FLAVOR CONC 2OZ", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "82363", "ItemNumber": "239703", "ItemDescription": "TETRACAINE AMP 20MG 2ML", "UOM": "25 AMPS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "98940", "ItemNumber": "242065", "ItemDescription": "ETOPOSIDE CAP 50MG", "UOM": "20 CAPS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "82433", "ItemNumber": "244164", "ItemDescription": "DEGARELIX KIT 240MG (2X120MG)", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "245010", "ItemNumber": "245010", "ItemDescription": "TIPRANAVIR CAP 250MG", "UOM": "120 CAPS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "82617", "ItemNumber": "253951", "ItemDescription": "MEMANTINE XR CAP 7 MG", "UOM": "30 CAPS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "82618", "ItemNumber": "253952", "ItemDescription": "MEMANTINE XR CAP 14MG", "UOM": "30 CAPS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "31183", "ItemNumber": "257347", "ItemDescription": "RAMIPRIL CAP 2.5MG", "UOM": "500 CAPS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "82148", "ItemNumber": "258272", "ItemDescription": "LEVONORGESTREL TAB 1.5MG", "UOM": "1 TAB/BX", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "4595", "ItemNumber": "260635", "ItemDescription": "ALUMINUM HYDROX. 16 OZ BO", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "54695", "ItemNumber": "263265", "ItemDescription": "FUROSEMIDE LIQ 40MG/5ML 500ML", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"}
	];
	return formulary;
}