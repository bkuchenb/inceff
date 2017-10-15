//Get the page element that will be needed.
var page_data = get_page_data();
//Set the focus to the first add box.
page_data[0]['element_input_add'].focus();

//Add event listeners to elements in each row.
for(var i = 0; i < page_data.length; i++){
	//Cycle through the saved elements.
	!function outer(i){
		//Change add text boxes on down or up arrow.
		page_data[i]['element_input_add'].addEventListener('keyup', function inner(event){
			event.preventDefault();
			if(event.keyCode == 40 && i != (page_data.length - 1)){
				page_data[i + 1]['element_input_add'].focus();
			}
			if(event.keyCode == 38 && i != 0){
				page_data[i - 1]['element_input_add'].focus();
			}
		}, false);
		//Turn the row dark green on hover.
		page_data[i]['element_row'].addEventListener('mouseover', function inner(event){
			event.preventDefault();
			page_data[i]['element_input_add'].style.backgroundColor = '#5cd65c';
			page_data[i]['element_qty'].style.backgroundColor = '#5cd65c';
			page_data[i]['element_input_cond'].style.backgroundColor = '#5cd65c';
			page_data[i]['element_input_price'].style.backgroundColor = '#5cd65c';
			page_data[i]['element_div_front'].style.backgroundColor = '#5cd65c';
			page_data[i]['element_div_back'].style.backgroundColor = '#5cd65c';
			page_data[i]['element_desc'].style.backgroundColor = '#5cd65c';
			page_data[i]['element_price'].style.backgroundColor = '#5cd65c';
		}, false);
		page_data[i]['element_row'].addEventListener('mouseout', function inner(event){
			event.preventDefault();
			//If the row has been changed, keep the yellow backgroundColor.
			if(page_data[i]['changed'] == true){
				var color = '#ffff1a';
			}
			else{
				var color = 'white';
			}
			page_data[i]['element_input_add'].style.backgroundColor = 'white';
			page_data[i]['element_qty'].style.backgroundColor = color;
			page_data[i]['element_input_cond'].style.backgroundColor = color;
			page_data[i]['element_input_price'].style.backgroundColor = color;
			page_data[i]['element_div_front'].style.backgroundColor = color;
			page_data[i]['element_div_back'].style.backgroundColor = color;
			page_data[i]['element_desc'].style.backgroundColor = color;
			page_data[i]['element_price'].style.backgroundColor = color;
		}, false);
		
		//Turn the drop boxes dark green on hover.
		page_data[i]['element_image_box_front'].addEventListener('dragenter', function inner(event){
			event.preventDefault();
			page_data[i]['element_image_box_front'].style.backgroundColor = '#5cd65c';
		}, false);
		page_data[i]['element_image_box_back'].addEventListener('dragenter', function inner(event){
			event.preventDefault();
			page_data[i]['element_image_box_back'].style.backgroundColor = '#5cd65c';
		}, false);
		
		//Turn the drop boxes white when the mouse moves out.
		page_data[i]['element_image_box_front'].addEventListener('dragleave', function inner(event){
			event.preventDefault();
			page_data[i]['element_image_box_front'].style.backgroundColor = 'white';
		}, false);
		page_data[i]['element_image_box_back'].addEventListener('dragleave', function inner(event){
			event.preventDefault();
			page_data[i]['element_image_box_back'].style.backgroundColor = 'white';
		}, false);
		
		//When an image is dropped in the box, save the file.
		page_data[i]['element_image_box_front'].addEventListener('drop', function inner(event){
			event.preventDefault();
			//Change the background back to white.
			page_data[i]['element_image_box_front'].style.backgroundColor = 'white';
			//Get the files added.
			var files = event.dataTransfer.files;
			if(files[0].type.indexOf("image") == 0){
				page_data[i]['value_file_front'] = files[0];
				//Change the text displayed.
				this.innerHTML = files[0].name;
			}
		}, false);
		page_data[i]['element_image_box_back'].addEventListener('drop', function inner(event){
			event.preventDefault();
			//Change the background back to white.
			page_data[i]['element_image_box_back'].style.backgroundColor = 'white';
			//Get the files added.
			var files = event.dataTransfer.files;
			if(files[0].type.indexOf("image") == 0){
				page_data[i]['value_file_back'] = files[0];
				//Change the text displayed.
				this.innerHTML = files[0].name;
			}
		}, false);
	}(i)
}

//Prevent the browser from opening images in a new page.
window.addEventListener("dragover", function(e){
  e = e || event;
  e.preventDefault();
},false);
window.addEventListener("drop",function(e){
  e = e || event;
  e.preventDefault();
},false);

//Get the navbar_right element.
var navbar_right = document.getElementsByClassName('navbar_right');
//Add an update button to the navbar.
var btn_submit = document.createElement('BUTTON');
btn_submit.innerHTML = 'Update';
btn_submit.className = 'navbar_button';
btn_submit.style.fontWeight = 'bold';
navbar_right[0].appendChild(btn_submit);
//Add an insert button to the navbar.
var btn_insert = document.createElement('BUTTON');
btn_insert.innerHTML = 'Insert';
btn_insert.className = 'navbar_button';
btn_insert.style.fontWeight = 'bold';
navbar_right[0].appendChild(btn_insert);

//Add an action listener to the update button.
btn_submit.addEventListener("click", function(event){
	event.preventDefault();
	//Get the updated page data.
	var page_data_update = get_page_data();
	//Find the changes that were made and update the database.
	for(var j = 0; j < page_data.length; j++){
		if(page_data[j]['value_add'] != page_data_update[j]['value_add'] ||
			page_data[j]['value_cond'] != page_data_update[j]['value_cond'] ||
			page_data[j]['value_price'] != page_data_update[j]['value_price'] ||
			page_data[j]['value_file_front'] != page_data_update[j]['value_file_front'] ||
			page_data[j]['value_file_back'] != page_data_update[j]['value_file_back']){
				//Set a flag to tell that this row has been changed.
				page_data[j]['changed'] = true;
				//Add the front image to page_data_update.
				page_data_update[j]['value_file_front'] = page_data[j]['value_file_front'];
				//Add the back image to page_data_update.
				page_data_update[j]['value_file_back'] = page_data[j]['value_file_back'];
				update_database(page_data_update[j]);
			}
	}
}, false);

//Add an action listener to the insert button.
btn_insert.addEventListener("click", function(event){
	event.preventDefault();
	//Get the updated page data.
	var page_data_update = get_page_data();
	//Find the changes that were made and update the database.
	for(var j = 0; j < page_data.length; j++){
		if(page_data[j]['value_add'] != page_data_update[j]['value_add'] ||
			page_data[j]['value_cond'] != page_data_update[j]['value_cond'] ||
			page_data[j]['value_price'] != page_data_update[j]['value_price'] ||
			page_data[j]['value_file_front'] != page_data_update[j]['value_file_front'] ||
			page_data[j]['value_file_back'] != page_data_update[j]['value_file_back']){
				//Set a flag to tell that this row has been changed.
				page_data[j]['changed'] = true;
				//Add the front image to page_data_update.
				page_data_update[j]['value_file_front'] = page_data[j]['value_file_front'];
				//Add the back image to page_data_update.
				page_data_update[j]['value_file_back'] = page_data[j]['value_file_back'];
				insert_database(page_data_update[j]);
			}
	}
}, false);

function get_page_data(){
	//Create a temp array to hold the page elements
	var temp = [];
	//Get the div that contains the elements.
	var table_rows = document.getElementsByClassName('table_row');
	//Get the qty and card_id elements.
	var quantities = document.getElementsByName('qty');
	var ids = document.getElementsByName('card_id');
	//Get all the add quantity, condition, and price inputs.
	var input_adds = document.getElementsByName('input_add');
	var input_conds = document.getElementsByName('input_cond');
	var input_prices = document.getElementsByName('input_price');
	//Get all the image location inputs and the parent divs.
	var input_fronts = document.getElementsByName('input_front');
	var input_backs = document.getElementsByName('input_back');
	var div_fronts = document.getElementsByClassName('admin_table_front');
	var div_backs = document.getElementsByClassName('admin_table_back');
	//Get all the image_box divs.
	var image_box_fronts = document.getElementsByName('image_box_front');
	var image_box_backs = document.getElementsByName('image_box_back');
	//Get the description and price elements.
	var div_desc = document.getElementsByClassName('admin_text_desc');
	var div_price = document.getElementsByClassName('admin_text_price');

	//Add all page elements to the temp array.
	for(var k = 0; k < image_box_fronts.length; k++){
		temp.push({
			//Used to tell if the row has been changed.
			'changed': false,
			'element_row': table_rows[k],
			'value_card_id': ids[k].value,
			'element_input_add': input_adds[k],
			'value_add': input_adds[k].value,
			'element_qty': quantities[k],
			'value_qty': quantities[k].innerHTML,
			'element_desc': div_desc[k],
			'element_price': div_price[k],
			'element_input_cond': input_conds[k],
			'value_cond': input_conds[k].value,
			'element_input_price': input_prices[k],
			'value_price': input_prices[k].value.replace('$', ''),
			'element_div_front': div_fronts[k],
			'element_div_back': div_backs[k],
			'element_input_front': input_fronts[k],
			'element_input_back': input_backs[k],
			'element_image_box_front': image_box_fronts[k],
			'element_image_box_back': image_box_backs[k],
			'value_file_front': 'empty',
			'value_file_back': 'empty'
			});
	}
	return temp;
}

function update_database(obj){
	var xhttp = new XMLHttpRequest();
	var formdata = new FormData();
	formdata.append('card_id', obj['value_card_id']);
	formdata.append('add', obj['value_add']);
	formdata.append('qty', obj['value_qty']);
	formdata.append('cond', obj['value_cond']);
	formdata.append('cond_price', obj['value_price']);
	formdata.append('file_front', obj['value_file_front']);
	formdata.append('file_back', obj['value_file_back']);
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState == 4 && xhttp.status == 200){
			//Get the response from ajax.
			var update = JSON.parse(xhttp.responseText);
			if(update){
				//Update the input text boxes.
				obj['element_input_add'].value = '';
				obj['element_qty'].innerHTML = update.quantity;
				obj['element_qty'].style.backgroundColor = '#ffff1a';
				obj['element_desc'].style.backgroundColor = '#ffff1a';
				obj['element_price'].style.backgroundColor = '#ffff1a';
				obj['element_input_cond'].value = update.cond;
				obj['element_input_cond'].style.backgroundColor = '#ffff1a';
				obj['element_input_price'].value = ('$' + update.cond_price);
				obj['element_input_price'].style.backgroundColor = '#ffff1a';
				if(update.img_front != ''){
					obj['element_input_front'].checked = 'checked';
				}
				obj['element_div_front'].style.backgroundColor = '#ffff1a';
				obj['element_image_box_front'].innerHTML = 'Drop';
				if(update.img_back != ''){
					obj['element_input_back'].checked = 'checked';
				}
				obj['element_div_back'].style.backgroundColor = '#ffff1a';
				obj['element_image_box_back'].innerHTML = 'Drop';
			}
		}
	}
	xhttp.open('POST', 'store_001_save_file.php', true);
	xhttp.send(formdata);
}

function insert_database(obj){
	var xhttp = new XMLHttpRequest();
	var formdata = new FormData();
	formdata.append('card_id', obj['value_card_id']);
	formdata.append('add', obj['value_add']);
	formdata.append('qty', obj['value_qty']);
	formdata.append('cond', obj['value_cond']);
	formdata.append('cond_price', obj['value_price']);
	formdata.append('file_front', obj['value_file_front']);
	formdata.append('file_back', obj['value_file_back']);
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState == 4 && xhttp.status == 200){
			//Get the response from ajax.
			/* var update = JSON.parse(xhttp.responseText);
			if(update){
				//Update the input text boxes.
				obj['element_input_add'].value = '';
				obj['element_qty'].innerHTML = update.quantity;
				obj['element_qty'].style.backgroundColor = '#ffff1a';
				obj['element_desc'].style.backgroundColor = '#ffff1a';
				obj['element_price'].style.backgroundColor = '#ffff1a';
				obj['element_input_cond'].value = update.cond;
				obj['element_input_cond'].style.backgroundColor = '#ffff1a';
				obj['element_input_price'].value = ('$' + update.cond_price);
				obj['element_input_price'].style.backgroundColor = '#ffff1a';
				if(update.img_front != ''){
					obj['element_input_front'].checked = 'checked';
				}
				obj['element_div_front'].style.backgroundColor = '#ffff1a';
				obj['element_image_box_front'].innerHTML = 'Drop';
				if(update.img_back != ''){
					obj['element_input_back'].checked = 'checked';
				}
				obj['element_div_back'].style.backgroundColor = '#ffff1a';
				obj['element_image_box_back'].innerHTML = 'Drop';
			} */
		}
	}
	xhttp.open('POST', 'store_001_insert_file.php', true);
	xhttp.send(formdata);
}