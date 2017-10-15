<?php
//create the header
include ('beckettOrdersHeader.php');
//connect to the tcf_beckett database
require ('mysqli_connect_tcf_beckett.php');

echo '<body>';
//create variables to use for sorting the table
$mainSort = '';
$mainSort2 = '';
if($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['mainSort']))
//set the variable depending on which heading was clicked
{
	$mainSort = $_GET['mainSort'];
	if($mainSort == 'qty')
	{$mainSort2 = 'total';}
	else
	{$mainSort2 = 'qty';}
}
else//default to sort desc by qty
{
	$mainSort = 'qty';
	$mainSort2 = 'total';
}

//make the query:
$q = "SELECT cardName, SUM(qty) as qty, SUM(total) as total
	  FROM orderDetails
	  GROUP BY cardName
	  ORDER BY " . $mainSort . " DESC, " . $mainSort2 . " DESC
	  LIMIT 100";

//run the query
$r = @mysqli_query ($dbc, $q);

//if it runs ok, display the records
if ($r)
{
	//save the results in an array
	for($i = 0; $i < mysqli_num_rows($r); $i++)
	{
		$array[$i] = mysqli_fetch_array($r, MYSQLI_ASSOC);
		//find out which customer bought the most cards
		$q2 = 'SELECT orders.email, SUM(orderDetails.qty) as qty
			  FROM orderDetails
			  INNER JOIN orders
			  ON orderDetails.orderID=orders.orderID
			  WHERE cardName=\'' . addslashes($array[$i]['cardName']) . '\'
			  GROUP BY orders.email
			  ORDER BY qty DESC
			  LIMIT 1';

		//run the query
		$r2 = @mysqli_query($dbc, $q2);
		if($r2)
		{
			$results[$i] = mysqli_fetch_array($r2, MYSQLI_ASSOC);
		}
		else
		{
			// Debugging message:
			echo '<p>' . mysqli_error($dbc) . '<br /><br />Query: ' . $q2 . '</p>';
		}
		
	}
	
	//create a table header
	echo '<div class="infoTable">
	<table class="table table-condensed table-striped table-bordered" >
	<tr>
	<td class="expand"><b>Player</b></td>
	<td><b><a href="/playerTotals.php?mainSort=qty">Qty Sold</a></b></td>
	<td><b>Customer</b></td>
	<td><b>Customer Qty</b></td>
	<td><b><a href="/playerTotals.php?mainSort=total">Total</a></b></td>
	</tr><form method="post" action="orderDetails.php">';
	//fetch and print all the records:
	for($i = 0; $i < count($array); $i++)
	{
	  echo '<tr>
		<td><input type="submit" name="cardName" value="' . $array[$i]['cardName'] . '"</td>
		<td>' . $array[$i]['qty'] . '</td>
		<td><input type="submit" name="email" value="' . $results[$i]['email'] . '"</td>
		<td>' . $results[$i]['qty'] . '</td>
		<td>' . '$' . $array[$i]['total'] . '</td>';
	}
	echo '</table></div>';// Close the table.	
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