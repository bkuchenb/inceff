<?php
session_start();
//create the header
include ('beckettOrdersHeader.php');
//connect to the tcf_beckett database
require ('mysqli_connect_tcf_beckett.php');

echo '<body>';

//create a variable to use for sorting the table
$mainSort = '';
if($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['mainSort']))
//set the variable depending on which heading was clicked
{$mainSort = $_GET['mainSort'];}
else//default to sort desc by qty
{$mainSort = 'qty';}

// Set the database access information as constants:
DEFINE ('DB_USER2', 'Mickey');
DEFINE ('DB_PASSWORD2', 'R00thMick');
DEFINE ('DB_HOST2', 'localhost');
DEFINE ('DB_NAME2', 'tcf_overflow');

// Make the connection:
$conn = @mysqli_connect (DB_HOST2, DB_USER2, DB_PASSWORD2, DB_NAME2)
OR die ('Could not connect to MySQL: ' . mysqli_connect_error() );

// Set the encoding...
mysqli_set_charset($conn, 'utf8');

//make the query:
$q = "SELECT sport, year, setName, SUM(qty) as qty, SUM(total) as total
	  FROM orderDetails
	  GROUP BY sport, year, setName
	  ORDER BY " . $mainSort . " DESC, sport ASC, year ASC, setName ASC
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
		$array[$i] = overflowQuery($conn, $array[$i]);
	}
	
	//create a table header
	echo '<div class="infoTable">
	<table class="table table-condensed table-striped table-bordered" >
	<tr>
	<td><b>Sport</b></td>
	<td><b>Year</b></td>
	<td class="expand"><b>Set</b></td>
	<td><b><a href="/setTotals.php?mainSort=qty">Qty Sold</a></b></td>
	<td><b><a href="/setTotals.php?mainSort=total">Total</a></b></td>
	<td><b>Top Loader</b></td>
	<td><b>900 ct</b></td>
	<td><b>Triple Shoe</b></td>
	<td><b>Details</b></td>
	</tr><form method="post" action="orderDetails.php">';
	//fetch and print all the records:
	for($i = 0; $i < count($array); $i++)
	{
	  echo '<tr>
		<td>' . $array[$i]['sport'] . '</td>
		<td>' . $array[$i]['year'] . '</td>
		<td><a href="/orderDetails.php?sport=' . $array[$i]['sport'] . '&year=' .
		$array[$i]['year'] . '&setName=' . $array[$i]['setName'] . '">' .
		$array[$i]['setName'] . '</a></td>
		<td>' . $array[$i]['qty'] . '</td>
		<td>' . '$' . $array[$i]['total'] . '</td>
		<td><input type="checkbox" name="' . $array[$i]['tL'] . '"';
		if($array[$i]['tL']==1){echo ' checked="1"';} echo ' /></td>
		<td>' . $array[$i]['nH'] . '</td>
		<td><input type="checkbox" name="' . $array[$i]['tS'] . '"';
		if($array[$i]['tS']==1){echo ' checked="1"';} echo ' /></td>
		<td><input type="checkbox" name="' . $array[$i]['details'] . '"';
		if($array[$i]['details']==1)//if the details are available display a link
		{
			echo ' checked="1" /><a href="/pickList.php?sport=' . $array[$i]['sport'] .
			'&year=' .	$array[$i]['year'] . '&id=' . $array[$i]['id'] . '&setName=' . $array[$i]['setName'] . 
			'">Details</a>
			</td>';
		}
		else//if not close the input tag
		{echo ' /></td>';}
		echo '
		</tr>';
	}
	echo '</form></table></div>';// Close the table.	
	mysqli_free_result ($r); // Free up the resources.
}//end of if statement: the query ran ok
else// If it did not run OK
{
	// Debugging message:
	echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
}

//function to query tcf_overflow database
function overflowQuery($conn, $line)
{
	//fix any nonsports listings
	if($line['sport'] === 'Non-sports')
	{$line['sport'] = 'nonsports';}
	if($line['sport'] !== 'Magic The Gathering')
	{
		//query the overflow database
		$query = 'SELECT id, top_loader, nine_hundred, triple_shoe, details
				  FROM ' . addslashes($line['sport']) . '
				  WHERE year=\'' . addslashes($line['year']) . '\' 
				  AND set_name=\'' . addslashes($line['setName']) . '\'';
		//run the query
		$results = @mysqli_query ($conn, $query);
		//if it runs ok, add the records to the array
		if($results)
		{
			$row = mysqli_fetch_array($results, MYSQLI_ASSOC);
			$line['id'] = $row['id'];
			$line['tL'] = $row['top_loader'];
			$line['nH'] = $row['nine_hundred'];
			$line['tS'] = $row['triple_shoe'];
			$line['details'] = $row['details'];
		}
		else//if it did not run OK
		{
			// Debugging message:
			echo mysqli_error($conn) . '<br>Query: ' . $query . '<br>';
		}
	}
	else
	{
		//$line['id'] = '';
		$line['tL'] = 0;
		$line['nH'] = 0;
		$line['tS'] = 0;
		$line['details'] = 0;
	}
	return $line;
}//end of function
?>
</body>
</html>