<?php
session_start();
//create the header
include ('header.php');

echo '<body>';
$sport = $_SESSION['sport'];
$year = $_SESSION['year'];
$letter = $_SESSION['letter'];

if($_SERVER['REQUEST_METHOD'] == 'POST')
{
		$update_id = htmlspecialchars($_POST['id']);
		$update_sport = $_POST['sport'];
		$update_year = $_POST['year'];
		$update_set_name = $_POST['set_name'];
		
		//connect to the tcf_overflow_unsorted database
		$user = 'Mickey';
		$pw = 'R00thMick';
		$host = 'localhost';
		$database = 'tcf_overflow_unsorted';

		// Make the connection:
		$dbc = @mysqli_connect ($host, $user, $pw, $database)
		OR die ('Could not connect to MySQL: ' . mysqli_connect_error() );

		// Set the encoding...
		mysqli_set_charset($dbc, 'utf8');
		
		//make the update query to set the id
		$q = 'INSERT INTO unsorted (id, sport, year, set_name) 
			  VALUES(' . $update_id . ', "' . $update_sport . '", "' . $update_year . '", "' .
			  addslashes($update_set_name) . '")';
		//run the query
		$r = @mysqli_query ($dbc, $q);

		if($r)//start if: the query ran ok
		{
			echo '<center><b>' . $update_sport . ' ' . $update_year . ' ' . $update_set_name .
			' has been added to Location: ' . $update_id . '</b></center><br>';
		}
		else
		{
			echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
		}
}//end if: the form was submitted

//connect to the tcf_overflow database
require ('mysqli_connect.php');

//make the query:
$q = "SELECT year, set_name
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
	<td class="setCol_year"><b>Location</b></td>
	<td class="setCol_year"><b>Sport</b></td>
	<td class="setCol_year"><b>Year</b></td>
	<td class="setCol_setUpdate"><b>Set</b></td>
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
	  $resultsRow[1] = $row['year'];
	  $resultsRow[2] = $row['set_name'];
	  //add the resultsRow array to the resultsArray
	  $resultsArray[$counter] = $resultsRow;	  
	  //update the counter
	  $counter++;		   
	}//end while statement

	//add the results array to the session array
	$_SESSION['array'] = $resultsArray;
	
	//display the results
	for($i=0; $i < count($resultsArray); $i++)
	{
	  echo '<form method="post" action="unsorted.php">
	  <tr class="table">
	  <td id="matchBackground"><input class="setInputWidth_90" name="id" type="text" value="" /></td>
	  <td class="setCol_year">' . $sport . '</td>
	  <td class="setCol_year">' . $resultsArray[$i][1] . '</td>
	  <td class="setCol_setUpdate">' . $resultsArray[$i][2] . '</td>
	  <input class="setInputWidth_90" type="hidden" name="sport" value="' .
	  $sport . '" readonly /></td>
	  <input class="setInputWidth_90" type="hidden" name="year" value="' .
	  $resultsArray[$i][1] . '" readonly /></td>
	  <input class="setInputWidth_90" type="hidden" name="set_name" value="' .
	  $resultsArray[$i][2] . '" readonly /></td>
	  <td id="matchBackground"><input class="input.setButton_Submit" name="submit" type="submit" value="Submit" /></td>
	  </tr></form>';
	}//end of for loop

	echo '</table>'; // Close the table and form
	mysqli_free_result ($r); // Free up the resources.	
}//end of if statement that checks to see if the query ran ok																				
 else //start else: query didn't run
{
	echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
}//end of else where query did not run
?>
</body>
</html>