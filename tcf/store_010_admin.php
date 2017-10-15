<?php
//Start a session to save changes.
session_start();
//Include the store_000_head.html file.
include ('store_000_head.html');
//Include store functions.
include ('store_000_functions.php');
//Create the header.
include ('store_00_header.php');
//Initialize the $_SESSION and local variables.
$_SESSION['sport'] = '';
$_SESSION['year'] = '';
$_SESSION['letterClicked'] = '';
$_SESSION['set_name'] = '';
?>

<body>
	<div class="container_03">
		<div class="body_left">
		</div>
		<div class="body_center">
			<form method="get" action="store_010_admin.php" class="align_center">
<?php
//Connect to the db.
require ('store_db_connect.php');
if(!isset($_SERVER['REQUEST_METHOD'])){
	//Create the sport buttons.
	create_sport_buttons();
}
//Create the year buttons.
if($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['sport'])){
	$_SESSION['sport'] = $_GET['sport'];
	create_year_buttons();
}
//Create the letter buttons.
if($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['year'])){
	$_SESSION['year'] = $_GET['year'];
	create_letter_buttons();
}
//Get the letter clicked on the last page.
if(isset($_GET['letter'])){
	$_SESSION['letterClicked'] = $_GET['letter'];
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
}
?>
			</form>
		</div>
		<div class="body_right">
		</div>
	</div>
</body>
</html>	
	<!--
	for($j = 0; $j < count($_SESSION['array']); $j++)
	{
		$id = $_SESSION['array'][$j][0];
		$tl_update = htmlspecialchars($_POST['data'][$_SESSION['array'][$j][0]]['tl']);
		$nh_update = htmlspecialchars($_POST['data'][$_SESSION['array'][$j][0]]['nh']);
		$ts_update = htmlspecialchars($_POST['data'][$_SESSION['array'][$j][0]]['ts']);
		$details_update = htmlspecialchars($_POST['data'][$_SESSION['array'][$j][0]]['details']);

		//validate the form input
		if(is_numeric($tl_update) &&
			is_numeric($nh_update) && 
			is_numeric($ts_update) &&
			is_numeric($details_update))
			{
				if($tl_update != $_SESSION['array'][$j][3] || $nh_update != $_SESSION['array'][$j][4] || 
				$ts_update != $_SESSION['array'][$j][5] || $details_update != $_SESSION['array'][$j][6])//make the query:
				{
					$q = "UPDATE $sport SET top_loader=$tl_update, nine_hundred=$nh_update,
						  triple_shoe=$ts_update, details=$details_update WHERE id=$id ";
					//run the query
					$r = @mysqli_query ($dbc, $q);
					if($r)
					{echo '<center>' . $_SESSION['array'][$j][1] . ' ' . $_SESSION['array'][$j][2] . ' has been updated.</center>';}
				}//end of if statement that checks to see if the data has been changed
			}//end of if statement that checks if the form data is a number
		else
			{echo '<center>Error: non-numeric value entered.</center>';}
	}//end of for statement that cycles through the form data
}//end if statement that checks to see if the form was submitted
	
	/*$numRecords = 100;//set the max number of records to display
	$page = 1;//set the current page number to 1
	$numPages = 1;//initialize the number of pages
	$startRec = 1;//intialize the starting record
	$endRec = 100;//initialize the end record
	//if(isset($_GET['numRecords'])*/
	//make the query:
	$q = "SELECT id, year, set_name, top_loader, nine_hundred, triple_shoe, details
		  FROM $sport
		  WHERE year=$year AND set_name LIKE $letter ORDER BY year ASC, set_name ASC";
	//run the query
	$r = @mysqli_query ($dbc, $q);
	//if it runs ok, display the records
	if ($r)
	{
		//table header
		echo '<table>
		<tr class="header">
		<td class="setCol_year"><b>Year</b></td>
		<td class="setCol_setUpdate"><b>Set</b></td>
		<td class="setCol_top_loader"><b>Top Loader</b></td>
		<td class="setCol_900"><b>900 Box</b></td>
		<td class="setCol_triple"><b>Triple Shoe</b></td>
		<td class="setCol_triple"><b>Details</b></td>
		<td id="matchBackground"><form method="post" action="setPageV2.php">
		<input class="input.setButton_Display" name="submit" type="submit" value="Details"></td></form>
		</tr>';
		//create a 2 dimmensional array to store the results of the query
		$resultsArray = array();
		$resultsRow = array();
		//initailize the counter
		$counter = 0;
		//create a variable to tell if this is the first row
		$isFirstRow = true;
		//fetch and process the query results
	while ($row = mysqli_fetch_array($r, MYSQLI_ASSOC))
	{	
	  //store the query results in the resultsRow array
	  $resultsRow[0] = $row['id'];
	  $resultsRow[1] = $row['year'];
	  $resultsRow[2] = $row['set_name'];
	  $resultsRow[3] = $row['top_loader'];
	  $resultsRow[4] = $row['nine_hundred'];
	  $resultsRow[5] = $row['triple_shoe'];
	  $resultsRow[6] = $row['details'];
	  //add the resultsRow array to the resultsArray
	  $resultsArray[$counter] = $resultsRow;	  
	  //update the counter
	  $counter++;		   
	}//end while statement
	
	//add the results array to the session array
	$_SESSION['array']=$resultsArray;
	//display the results
	for($i=0; $i < count($resultsArray); $i++)
	{
	  echo '<form method="post" action="updatePageV2.php">
	  <tr class="table">
	  <td class="setCol_year">' . $resultsArray[$i][1] . '</td>
	  <td class="setCol_setUpdate">' . $resultsArray[$i][2] . '</td>
	  <td id="matchBackground"><input class="setInputWidth_90" name="data[' . $resultsArray[$i][0] .
	  '][tl]" type="text" value="' . $resultsArray[$i][3] . '" /></td>
	  <td id="matchBackground"><input class="setInputWidth_90" name="data[' . $resultsArray[$i][0] .
	  '][nh]" type="text" value="' . $resultsArray[$i][4] . '" /></td>
	  <td id="matchBackground"><input class="setInputWidth_90" name="data[' . $resultsArray[$i][0] .
	  '][ts]" type="text" value="' . $resultsArray[$i][5] . '" /></td>
	  <td id="matchBackground"><input class="setInputWidth_90" name="data[' . $resultsArray[$i][0] .
	  '][details]" type="text" value="' . $resultsArray[$i][6] . '" /></td>
	  <td id="matchBackground"><input class="input.setButton_Submit" name="submit" type="submit" value="Submit" /></td>
	  </tr>';
	}//end of for loop

	echo '</table></form>'; // Close the table and form
	mysqli_free_result ($r); // Free up the resources.	
	}//end of if statement that checks to see if the query ran ok																				
 else //start else: query didn't run
	{
		echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
	}//end of else where query did not run
?>
</body>
</html>
-->