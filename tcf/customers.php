<?php
//create the header
include ('beckettOrdersHeader.php');
//import functions that process beckett data
include ('beckettFunctions.php');
//connect to the tcf_beckett database
require ('mysqli_connect_tcf_beckett.php');

echo '<body>';
/* //create a variable to use for sorting the table
$mainSort = '';
if($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['mainSort']))
//set the variable depending on which heading was clicked
{$mainSort = $_GET['mainSort'];}
else//default to sort desc by qty
{$mainSort = 'qty';} */

    //make the query:
$q = "SELECT firstName, lastName, email
      FROM customers
	  GROUP BY email
	  ORDER BY lastName DESC";

//run the query
$r = @mysqli_query ($dbc, $q);
//if it runs ok, display the records
if ($r)
{
	//$i = 0;//create a counter
	//fetch all the records and save them in an array
	for($i = 0; $i < mysqli_num_rows($r); $i++)
	{
		$results[$i] = mysqli_fetch_array($r, MYSQLI_ASSOC);
	}
	//add the totals to the results
	//and sort descending by total spent
	$results = customerTotals($dbc, $results);
	
	//table header
	echo '<div class="infoTable">
	<table class="table table-condensed table-striped table-bordered" >
	<tr>

	<td><b>First Name</b></td>
	<td><b>Last Name</b></td>
	<td><b>Email</b></td>
	<td><b>Number of Orders</b></td>
	<td><b>Total Spent</b></td>
	</tr><form method="post" action="orderDetails.php">';
	
	//print all the records
	for($i = 0; $i < count($results); $i++)
	{
		$firstName = strtolower($results[$i]['firstName']);
		$lastName = strtolower($results[$i]['lastName']);
		$email = strtolower($results[$i]['email']);
		$firstName = ucfirst($firstName);
		$lastName = ucfirst($lastName);
	  echo '<tr>
	  <td>' . $firstName . '</td>
	  <td>' . $lastName . '</td>
	  <td><input type="submit" name="email" value="' . $results[$i]['email'] . '"</td>
	  <td>' . $results[$i]['numOrders'] . '</td>
	  <td>$' . $results[$i]['total'] . '</td>
	  </tr>';
	}
	echo '</table></div>'; // Close the table.	
	mysqli_free_result ($r); // Free up the resources.
}
else 
{
	// Debugging message:
	echo '<p>' . mysqli_error($dbc) . '<br /><br />Query: ' . $q . '</p>';
}

?>
</body>
</html>