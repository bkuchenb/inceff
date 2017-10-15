<?php
//create the header
include ('beckettOrdersHeader.php');
//connect to the tcf_beckett database
require ('mysqli_connect_tcf_beckett.php');

echo '<body>';

//make the query:
$q = "SELECT cardName, SUM(qty) as qty, SUM(total) as total
	  FROM orderDetails
	  GROUP BY cardName
	  ORDER BY qty DESC, total DESC
	  LIMIT 50";

//run the query
$r = @mysqli_query ($dbc, $q);
//if it runs ok, display the records
if ($r)
{
	//save the results in an array
	for($i = 0; $i < mysqli_num_rows($r); $i++)
	{
		$array[$i] = mysqli_fetch_array($r, MYSQLI_ASSOC);
	}
	
	//create a table header
	echo '<div class="infoTable">
	<table class="table table-condensed table-striped table-bordered" >
	<tr>
	<td class="expand"><b>Player</b></td>
	<td><b>Qty Sold</b></td>
	<td><b>Total</b></td>

	</tr>';
	//fetch and print all the records:
	for($i = 0; $i < count($array); $i++)
	{
	  echo '<tr>
		<td class="expand">' . $array[$i]['cardName'] . '</td>
		<td>' . $array[$i]['qty'] . '</td>
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