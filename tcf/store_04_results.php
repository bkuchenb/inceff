<?php
//Include the head.
include ('store_000_head.php');
//Get the letter clicked on the last page.
if(isset($_GET['letter'])){
	$_SESSION['letterClicked'] = $_GET['letter'];
}
//Check to see what letter was choosen.
//Format the $letter variable accordingly.
if($_GET['letter'] == '%'){
	//If % was selected return all sets in inventory for the given year.
	$letter = '\''. $_GET['letter']. '\'';
}
//If any other letter was selected, return all sets that begin with that letter.
else{
	$letter = '\''. $_GET['letter']. '%\'';
}
//Add the letter to the session.
$_SESSION['letter'] = $letter;
//Add the sport and year choosen to local variables.
$sport = $_SESSION['sport'];
if($_SESSION['year'] == '%'){
	$year = '\'' . $_SESSION['year'] . '\'';
}
else{
	$year = $_SESSION['year'];
}
//Build the table name from the choosen sport.
$set_list_table = 'set_list_' . strtolower($sport);
//Add the set_list_table to the session.
$_SESSION['set_list_table'] = $set_list_table;
//Include the header.
include ('store_00_header.php');
//Query the database.
$q = "SELECT year, set_name, table_name
      FROM $set_list_table
	  WHERE year=$year AND active >= 0 AND set_name LIKE $letter ORDER BY year ASC, set_name ASC";
//Run the query.
$r = @mysqli_query ($dbc, $q);
//If it runs okay, display the records.
if ($r){
echo'
<body>
	<div class="container_03">
		<div class="body_left">
		</div>
		<div class="body_center">
			<div class="body_header">
				<div class="body_header_cards" style="width:100px;">Year</div>
				<div class="body_header_cards" style="width:335px;">Set</div>
				<div class="body_header_cards" style="width:145px;">View Cards</div>
			</div>
			<form method="POST" action="store_05_view.php">';
	//Create an array to store the results of the query.
	$resultsArray = array();
	//Create and initailize the counter.
	$counter = 0;
	//Fetch, and add all the records to the results array.
	while ($row = mysqli_fetch_array($r, MYSQLI_ASSOC)){
		//Add the row to the resultsArray.
		$resultsArray[$counter] = $row;	  
		//Update the counter.
		$counter++;		 
	}
	//Add the results array to the session array.
	$_SESSION['array'] = $resultsArray;
	//Display the results.
	for($i=0; $i < count($resultsArray); $i++){
		echo'
				<div class="body_table">
					<div class="body_table_cards" style="width:100px;">' . $resultsArray[$i]['year'] .'</div>
					<div class="body_table_cards" style="width:335px;">' . $resultsArray[$i]['set_name'] .'</div>
					<div class="div_button_view">
						<input name="' . $resultsArray[$i]['set_name'] .'" style="width:145px;" type="submit" value="View" />
						<input name="' . $resultsArray[$i]['table_name'] .'" style="width:145px;" type="hidden" value="Hidden" />							
					</div>
				</div>';
	}
	//Free up the resources.
	mysqli_free_result ($r);
}
else{
	//Print an error message.
	echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
	echo '<br>There was a problem finding what you requested.<br>';
}
echo'
			</form>
		</div>
		<div class="body_right">
		</div>
	</div>
</body>
</html>';
?>