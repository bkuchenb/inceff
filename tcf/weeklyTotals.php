<?php
//create the header
include ('beckettOrdersHeader.php');
//import functions that process beckett data
include ('beckettFunctions.php');
//connect to the tcf_beckett database
require ('mysqli_connect_tcf_beckett.php');
			
if($_SERVER['REQUEST_METHOD'] == 'POST')
{
	echo '<b>Results from ' . str_pad($_POST['monthS'], 2, "0", STR_PAD_LEFT) .
	'/' . str_pad($_POST['dayS'], 2, "0", STR_PAD_LEFT) . '/' . $_POST['yearS'] . 
	' - ' . str_pad($_POST['monthE'], 2, "0", STR_PAD_LEFT) .
	'/' . str_pad($_POST['dayE'], 2, "0", STR_PAD_LEFT) . '/' . $_POST['yearE'] .
	'<b><br>';
	//get the dates to use as filters
	$dateStart = $_POST['yearS'] . str_pad($_POST['monthS'], 2, "0", STR_PAD_LEFT) .
	str_pad($_POST['dayS'], 2, "0", STR_PAD_LEFT);
	$dateEnd = $_POST['yearE'] . str_pad($_POST['monthE'], 2, "0", STR_PAD_LEFT) .
	str_pad($_POST['dayE'], 2, "0", STR_PAD_LEFT);
	
	//build the sql statement
	$q = 'SELECT  SUM(total) AS sum, COUNT(total) as recordCount
		FROM orders
		INNER JOIN customers
		ON orders.email=customers.email
		WHERE state!=\'NY\' AND date >= \'' . $dateStart . '\' AND date <= \'' . $dateEnd . '\'
		AND orders.email != \'mickeybuysgold@gmail.com\' ';
		
	//run the query
	$r = @mysqli_query ($dbc, $q);

	if ($r)//if the query ran ok display a message
	{
		$result = mysqli_fetch_object($r);

		echo '<b>Total for ' . $result->recordCount . ' Non-Taxable Sales orders: $' .
		number_format($result->sum, 2) . '<br>';
	}//end of nested if
	else//if it did not run OK
	{	
		// Debugging message:
		echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
	}//end of nested else
	
	//free up resources
	mysqli_free_result($r);
	
	//build the sql statement
	$q = 'SELECT  SUM(total) AS sum, COUNT(total) as recordCount
		FROM orders
		INNER JOIN customers
		ON orders.email=customers.email
		WHERE state=\'NY\' AND date >= \'' . $dateStart . '\' AND date <= \'' . $dateEnd . '\'
		AND orders.email != \'mickeybuysgold@gmail.com\' ';
		
	//run the query
	$r = @mysqli_query ($dbc, $q);

	if ($r)//if the query ran ok display a message
	{
		$result = mysqli_fetch_object($r);
		
		echo '<b>Total for ' . $result->recordCount . ' Taxable Sales orders: $' .
		number_format($result->sum, 2) . '<br>';
	}//end of nested if
	else//if it did not run OK
	{	
		// Debugging message:
		echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
	}//end of nested else
		
	//free up resources
	mysqli_free_result($r);
}//end of if that checks for $_POST data
else
{
	echo '<body>
	<div><form method="post" action="weeklyTotals.php">
		<p><center><b>From: </b>
		<select name="monthS">';
		for($i = 1; $i <= 12; $i++)
		{
			echo '<option value="' . $i . '">' . $i . '</option>';
		}
		echo '
		</select>
		<select name="dayS">';
		for($i = 1; $i <= 31; $i++)
		{
			echo '<option value="' . $i . '">' . $i . '</option>';
		}
		echo '
		</select>
		<select name="yearS">';
		for($i = 2013; $i <= 2020; $i++)
		{
			echo '<option value="' . $i . '">' . $i . '</option>';
		}
		echo '</select>
		<b> To: </b>
		<select name="monthE">';
		for($i = 1; $i <= 12; $i++)
		{
			echo '<option value="' . $i . '">' . $i . '</option>';
		}
		echo '
		</select>
		<select name="dayE">';
		for($i = 1; $i <= 31; $i++)
		{
			echo '<option value="' . $i . '">' . $i . '</option>';
		}
		echo '
		</select>
		<select name="yearE">';
		for($i = 2013; $i <= 2020; $i++)
		{
			echo '<option value="' . $i . '">' . $i . '</option>';
		}
		echo '</select>
		<input name="submit" type="submit" value="Submit" />
		</center></p></form></div>';
}//end of else statement
?>
</body>
</html>