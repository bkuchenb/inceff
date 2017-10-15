<?php
//create the header
include ('beckettOrdersHeader.php');
echo '<body>';

//connect to the tcf_beckett database
require ('mysqli_connect_tcf_beckett.php');

/*********************************************************
if($_SERVER['REQUEST_METHOD'] == 'POST')
{
	$orderID = $_POST['orderID'];
	if(isset($_POST[$orderID]))
	{
		$checkbox = 1;
	}
	else
	{
		$checkbox = 0;
	}
	//make the query:
	$q = "UPDATE orders
      SET added = $checkbox
	  WHERE orderID = '$orderID'";
	//run the query
	$r = @mysqli_query ($dbc, $q);
}
*********************************************************/
//create a query that selects all orders in the database
$q = "SELECT *
	  FROM orders
	  INNER JOIN customers
	  ON orders.email=customers.email
	  ORDER BY orderID DESC";
//run the query
$r = @mysqli_query ($dbc, $q);
//if it runs ok, display the records
if ($r)
{
	//table header
	echo '<div class="infoTable">
	<table class="table table-condensed table-striped table-bordered" >
	<tr>
	<td><b>Order ID</b></td>
	<td><b>Added</b></td>
	<td><b>Customer</b></td>
	<td><b>Date</b></td>
	<td><b>State</b></td>
	<td><b>Shipping</b></td>
	<td><b>Tax</b></td>
	<td><b>Total</b></td>
	</tr><form method="post" action="orderDetails.php">';
	//fetch and print all the records:
	while ($row = mysqli_fetch_array($r, MYSQLI_ASSOC))
	{
	  echo '<tr>
	  <td><input type="submit" name="orderID" value="' . $row['orderID'] . '"</td>
	  <td><input type="checkbox" name="' . $row['orderID'] . '"';
	  if($row['added']==1){echo ' checked="1"';} echo ' /></td>
	  <td>' . $row['firstName'] . " " . $row['lastName'] . '</td>
	  <td>' . $row['date'] . '</td>
	  <td>' . $row['state'] . '</td>
	  <td>$' . $row['shipping'] . '</td>
	  <td>$' . $row['tax'] . '</td>
	  <td>$' . $row['total'] . '</td>
	  </tr>';
	}
	echo '</form></table></div>'; // Close the table.	
	mysqli_free_result ($r); // Free up the resources.
}
else 
{// If it did not run OK.
	// Public message:
	echo '<p class="error">Error: The data you requested is unavailable. We apologize for any inconvenience.</p>';
	
	// Debugging message:
	echo '<p>' . mysqli_error($dbc) . '<br /><br />Query: ' . $q . '</p>';
}

?>
</body>
</html>