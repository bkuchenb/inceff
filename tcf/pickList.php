<!DOCTYPE html>
<html lang="en-US">
<head>
	<title>Pick List</title>
	<meta charset="utf-8" />

</head>
<style>
body 
{ 
	background: white; 
	font-size: 12pt; 
}
table
{
	margin: 0 auto;
	width: 90%;
	border-spacing: 3px;
	text-align: left;
	border: 1px solid black;
}
td
{
	border: 1px solid black;
	padding-left: 4px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
<body>
<?php
session_start();

if($_SERVER['REQUEST_METHOD'] == 'GET')
{
	$sport = $_GET['sport'];//get the sport
	$_SESSION['sport'] = $sport;//set the session variable
	$year = $_GET['year'];//get the year
	$_SESSION['year'] = $year;//set the session variable
	$setName = $_GET['setName'];//get the sport
	$_SESSION['setName'] = $setName;//set the session variable
	$id = $_GET['id'];//get the id
	$_SESSION['id'] = $id;//set the session variable
	$table = $sport . '_' . $id;//set the table
	$_SESSION['table'] = $table;//set the session variable
	$_SESSION['filter'] = 'WHERE quantity=0';//create a filter for the display
}//end if: GET data available

//connect to the correct database
$user = 'Mickey';
$pw = 'R00thMick';
$host = 'localhost';
$database = 'tcf_inventory_' . $sport;

// Make the connection:
$dbc = @mysqli_connect ($host, $user, $pw, $database)
OR die ('Could not connect to MySQL: ' . mysqli_connect_error());

// Set the encoding...
mysqli_set_charset($dbc, 'utf8');
	
//make the query:
$q = "SELECT *  FROM $table WHERE quantity=0";

//run the query
$r = @mysqli_query ($dbc, $q);
//if it runs ok, display the records
if ($r)
{
	//table header
	echo '<table class="table table-condensed table-bordered" >
	<tr>
	<td><b>Qty</b></td>
	<td><b>Year</b></td>
	<td><b>Set</b></td>
	<td><b>#</b></td>
	<td><b>Name</b></td>
	</tr>';
	//create a 2 dimmensional array to store the results of the query
	$resultsArray = array();
	$resultsRow = array();
	//initailize the counter
	$counter = 0;
	//fetch and process the query results

while ($row = mysqli_fetch_array($r, MYSQLI_ASSOC))
{	
  //store the query results in the resultsRow array
  $resultsRow[1] = $row['quantity'];
  $resultsRow[4] = $row['card_number'];
  $resultsRow[5] = $row['name'];
  $resultsRow[6] = $row['price_1'];
  $resultsRow[7] = $row['price_2'];
  //add the resultsRow array to the resultsArray
  $resultsArray[$counter] = $resultsRow;	  
  //update the counter
  $counter++;
}//end while statement

//add the results array to the session array
$_SESSION['details'] = $resultsArray;
//display the results
for($i=0; $i < count($resultsArray); $i++)
{
	
	//check to see if there is a duplicate entry
	if($i >0 && $resultsArray[$i][4] != $resultsArray[$i - 1][4])
	  echo '<form method="post" action="detailsPageV2.php">
	  <tr>
	  <td>' . $resultsArray[$i][1] . '</td>
	  <td>' . $_SESSION['year'] . '</td>
	  <td>' . $_SESSION['setName'] . '</td>
	  <td>' . $resultsArray[$i][4] . '</td>
	  <td>' . $resultsArray[$i][5] . '</td>
	  </tr>';
}//end of for loop

echo '</table></form>'; // Close the table and form
mysqli_free_result ($r); // Free up the resources.	
}//end of if statement that checks to see if the query ran ok
 else 
{
	// Debugging message:
	echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
}//end of else where query did not run
?>
</body>
</html>