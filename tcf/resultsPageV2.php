<?php
session_start();

if(isset($_GET['letter']))
	{
		$_SESSION['letterClicked'] = $_GET['letter'];
	}
//create the header
include ('header.php');
echo '<body>';
//check to see what letter was choosen on the previous page
//and format the $letter variable accordingly
if($_GET['letter'] == '%')
//if % was selected return all sets in inventory for the given year
{$letter = '\''. $_GET['letter']. '\'';}
//if any other letter was selected, return all sets that begin with that letter
else{$letter = '\''. $_GET['letter']. '%\'';} 
$_SESSION['letter'] = $letter;


//add the set and year choosen to local variables
$sport = $_SESSION['sport'];
if($_SESSION['year'] == '%')
{$year = '\'' . $_SESSION['year'] . '\'';}
else {$year = $_SESSION['year'];}
//$_SESSION['year'] = $year;//update the session variable for the updatePage

//connect to the tcf_overflow database
require ('mysqli_connect.php');
		
//make the query:
$q = "SELECT year, set_name, top_loader, nine_hundred, triple_shoe, details
      FROM $sport
	  WHERE year=$year AND set_name LIKE $letter AND top_loader > 0 ORDER BY year ASC, set_name ASC";
//run the query
$r = @mysqli_query ($dbc, $q);
//if it runs ok, display the records
if ($r)
{
	//table header
	echo '<table>
	<tr class="header">
	<td class="setCol_year"><b>Year</b></td>
	<td class="setCol_setResults"><b>Set</b></td>
	<td class="setCol_top_loader"><b>Top Loader</b></td>
	<td class="setCol_900"><b>900 Box</b></td>
	<td class="setCol_triple"><b>Triple Shoe</b></td>
	<td class="setCol_triple"><b>Sales</b></td>
	<td class="setCol_triple"><b>Details</b></td>
	</tr>';
	
	//query the orders database to find sales database
	// Set the database access information as constants:
	DEFINE ('DB_USER2', 'Mickey');
	DEFINE ('DB_PASSWORD2', 'R00thMick');
	DEFINE ('DB_HOST2', 'localhost');
	DEFINE ('DB_NAME2', 'tcf_beckett');

	// Make the connection:
	$conn2 = @mysqli_connect(DB_HOST2, DB_USER2, DB_PASSWORD2, DB_NAME2)
	OR die ('Could not connect to MySQL: ' . mysqli_connect_error() );

	// Set the encoding...
	mysqli_set_charset($conn2, 'utf8');
	
	//fetch and print all the records:
	while ($row = mysqli_fetch_array($r, MYSQLI_ASSOC))
	{
		//make the query for each set:
		$q2 = 'SELECT SUM(total) as total
			  FROM orderDetails
			  WHERE sport = "' . $sport . '" AND year = "' . $row['year'] . 
			  '" AND setName = "' . $row['set_name'] . '"';

		//run the query
		$r2 = @mysqli_query($conn2, $q2);
		//if it runs ok, display the records
		if ($r2)
		{
			//fetch the results
			$row2 = mysqli_fetch_array($r2, MYSQLI_ASSOC);
			echo '<tr class="table">
			  <td class="setCol_year">' . $row['year'] . '</td>
			  <td class="setCol_setResults">' . $row['set_name'] . '</td>
			  <td class="setCol_top_loader">' . $row['top_loader'] . '</td>
			  <td class="setCol_900">' . $row['nine_hundred'] . '</td>
			  <td class="setCol_triple">' . $row['triple_shoe'] . '</td>
			  <td class="setCol_triple">$' . $row2['total'] . '</td>
			  <td class="setCol_triple">' . $row['details'] . '</td>
			  </tr>';
		}
		else// If it did not run OK
		{
			// Debugging message:
			echo mysqli_error($conn2) . '<br>Query: ' . $q2 . '<br>';
			echo '<tr class="table">
			  <td class="setCol_year">' . $row['year'] . '</td>
			  <td class="setCol_setResults">' . $row['set_name'] . '</td>
			  <td class="setCol_top_loader">' . $row['top_loader'] . '</td>
			  <td class="setCol_900">' . $row['nine_hundred'] . '</td>
			  <td class="setCol_triple">' . $row['triple_shoe'] . '</td>
			  <td class="setCol_triple">N/A</td>
			  <td class="setCol_triple">' . $row['details'] . '</td>
			  </tr>';
		}
	}
	echo '</table>'; // Close the table.	
	mysqli_free_result ($r); // Free up the resources.
}
else//it did not run OK
{
	// Debugging message:
	echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
}
?>
</body>
<div>
<p></p>
<center><input name="sales" type="submit" class="medium blue button"
onclick="" value="Sales" />
<input name="Update" type="submit" class="medium blue button"
onclick="window.location.href='updatePageV2.php'" value="Update" />
<input name="unsorted" type="submit" class="medium blue button"
onclick="window.location.href='unsorted.php'" value="Unsorted" />
</center>
</div>
</html>