<?php
//Include the head.
include ('store_000_head.php');
//Update the local variables.
$set_list_table = $_SESSION['set_list_table'];
$sport = $_SESSION['sport'];
$year = $_SESSION['year'];
$letter = $_SESSION['letter'];
if(isset($_SESSION['set_table'])){
	$set_table = $_SESSION['set_table'];
}
if(isset($_SESSION['set_name'])){
	$set_name = $_SESSION['set_name'];
}
//Create variables to store the page number and records.
$page = 1;
$record_start = 0;
$record_end = 99;
//Create variables to save the sort order.
$main_sort = 'card_id';
$sort_order = 'ASC';

//Process page change request.
if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_SESSION['array'])){
	//Change which records are displayed.
	if(isset($_POST['location'])){
		if($_POST['location'] == '<<'){
			$page = 1;
			$record_start = 0;
			$record_end = 99;
		}
		if($_POST['location'] == '<' && $_SESSION['page'] != 1){
			$page = $_SESSION['page'] - 1;
			$record_start = $_SESSION['start'] - 100;
			$record_end = $record_start + 99;
		}
		if($_POST['location'] == '>' && $_SESSION['page'] != ceil(count($_SESSION['array'])/100)){
			$page = $_SESSION['page'] + 1;
			$record_start = $_SESSION['start'] + 100;
			$record_end = $record_start + 99;
		}
		if($_POST['location'] == '>>'){
			$page = ceil(count($_SESSION['array'])/100);
			$record_start = ($page - 1) * 100;
			$record_end = count($_SESSION['array']);
		}
	}
	if(isset($_POST['page'])){
		$page = sanitize_string($_POST['page']);
		if(is_numeric($page)){
			//Change the page number if the entry is out of range.
			if($page < 1){
				$page = 1;
			}
			if($page > ceil(count($_SESSION['array'])/100)){
				$page = ceil(count($_SESSION['array'])/100);
			}
			$record_start = ($page - 1) * 100;
			if($page != ceil(count($_SESSION['array'])/100)){
				$record_end = $record_start + 99;
			}
			else{
				$record_end = count($_SESSION['array']);
			}
		}
		else{
			$page = 1;
		}
	}
}
if($_SERVER['REQUEST_METHOD'] == 'GET'){
	$main_sort = $_GET['main_sort'];
	$sort_order = $_GET['sort_order'];
}
//Save the page values to the SESSION.
$_SESSION['page'] = $page;
$_SESSION['start'] = $record_start;

//Include the header.
include ('store_00_header.php');
//Get all the card data stored in set_table.
$q = "SELECT *
	  FROM $set_table
	  ORDER BY $main_sort
	  $sort_order";
//Change the sort order if the button is pressed again.
if($sort_order == 'ASC'){
	$sort_order = 'DESC';
}
else{
	$sort_order = 'ASC';
}
//Run the query.
$r = mysqli_query($dbc, $q);
//If it runs okay, display the records.
if($r){
echo'
<body>
	<div class="container_03_admin">
		<div class="body_admin_header">
			<div class="admin_add">Add</div>
			<div class="admin_qty">
				<a class="link" href="/store_012_admin.php?main_sort=quantity&sort_order=' . $sort_order . '">Qty</a>
			</div>
			<div class="admin_desc">
				<a class="link" href="/store_012_admin.php?main_sort=card_id&sort_order=' . $sort_order . '">Description</a>
			</div>
			<div class="admin_price">
				<a class="link" href="/store_012_admin.php?main_sort=price&sort_order=' . $sort_order . '">Price</a>
			</div>
			<div class="admin_cond">
				<a class="link" href="/store_012_admin.php?main_sort=cond&sort_order=' . $sort_order . '">Cond</a>
			</div>
			<div class="admin_price_cond">
				<a class="link" href="/store_012_admin.php?main_sort=cond_price&sort_order=' . $sort_order . '">C_Price</a>
			</div>
			<div class="admin_front">
				<a class="link" href="/store_012_admin.php?main_sort=img_front&sort_order=' . $sort_order . '">Img(F)</a>
			</div>
			<div class="admin_back">
				<a class="link" href="/store_012_admin.php?main_sort=img_back&sort_order=' . $sort_order . '">Img(B)</a>
			</div>
			<div class="admin_front">Front</div>
			<div class="admin_back">Back</div>
		</div>
		<div class="body_admin">
			<form method="POST" action="store_012_admin.php" enctype="mulitpart/form-data">';
		//Create an array to store the results of the query.
		$resultsArray = array();
		//Initailize the counter.
		$counter = 0;
		//Fetch and process the query results.
		while($row = mysqli_fetch_array($r, MYSQLI_ASSOC)){
			//Store the query results in the resultsRow array
			$resultsArray[$counter] = $row;
			//Update the counter.
			$counter++;
		}
		//Add the results array to the session array.
		$_SESSION['array'] = $resultsArray;
		//Create an array to store condition
		$conditions = array('', 'GEM-MT', 'MINT', 'NM-MT', 'NM', 'EX-MT', 'EX', 'VG-EX', 'VG', 'GOOD', 'FR', 'PR');
		//Display the results.
		for($i = $record_start; $i < $record_end; $i++){
			echo'
					<div class="table_row">
						<input class="admin_text_add" name="input_add" id="input_add_' . $resultsArray[$i]['card_id'] . '" type="text" />
						<div class="admin_text_qty" name="qty" id="qty_' . $resultsArray[$i]['card_id'] . '">' . $resultsArray[$i]['quantity'] . '</div>
						<div class="admin_text_desc">' . $year . ' ' . $set_name . ' '
							. $resultsArray[$i]['card_number'] . ' ' . $resultsArray[$i]['name'] . '</div>
						<div class="admin_text_price">$' . $resultsArray[$i]['price'] . '</div>
						<select class="admin_text_cond" name="input_cond" id="input_cond_' . $resultsArray[$i]['card_id'] . '">';
			foreach($conditions as $cd){
				if($cd == $resultsArray[$i]['cond']){
					echo'	<option selected="selected">' . $cd . '</option>';
				}
				else{
					echo'	<option>' . $cd . '</option>';
				}
			}
			echo'
						</select>
						<input class="admin_text_cond_price" name="input_price" id="input_price_' . $resultsArray[$i]['card_id'] . '"
							type="text "value="$' . $resultsArray[$i]['cond_price'] . '" />
						<div class="admin_table_front">
							<input class="admin_text_front" name="input_front" id="input_front_' . $resultsArray[$i]['card_id'] . '"
									type="checkbox" ';
			if($resultsArray[$i]['img_front'] != ''){
				echo 'checked="checked" /></div>';
				}
			else{
				echo '/></div>';
			}
			echo'
						<div class="admin_table_back">
							<input class="admin_text_back" name="input_back" id="input_back_' . $resultsArray[$i]['card_id'] . '"
									type="checkbox" ';
			if($resultsArray[$i]['img_back'] != ''){
				echo 'checked="checked" /></div>';
				}
			else{
				echo '/></div>';
			}
			echo'
						<div class="image_box" name="image_box_front" id="drop_front_' . $resultsArray[$i]['card_id'] . '">Drop</div>
						<div class="image_box" name="image_box_back" id="drop_back_' . $resultsArray[$i]['card_id'] . '">Drop</div>
						<input type="hidden" name="card_id" value="' . $resultsArray[$i]['card_id'] . '" />
					</div>';
		}//End of for loop that displays results.
		//Free up the resources.
		mysqli_free_result ($r);
	}//End of if statement that checks to see if the query ran okay.
	else{
		//Print an error message.
		echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
		echo '<br>There was a problem finding what you requested.<br>';
	}
	echo'
			</form>
		</div>
	</div>
	<div class="container_04">
		<form class="admin_form" method="POST" action="store_012_admin.php">
			<input type="submit" name="location" value="<<" />
			<input type="submit" name="location" value="<" />
			<span>Page</span>
		</form>
		<form class="admin_form" method="POST" action="store_012_admin.php">
			<input class="page_box" name="page" type="text" value="' . $page . '" />
		</form>
		<form class="admin_form" method="POST" action="store_012_admin.php">
			<span>of ' . ceil(count($resultsArray)/100) . '</span>
			<input type="submit" name="location" value=">" />
			<input type="submit" name="location" value=">>" />
		</form>
	</div>
<script type="text/javascript" src="store_012_admin.js"></script>
</body>
</html>';
?>
