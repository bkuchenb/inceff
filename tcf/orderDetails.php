<?php
//create the header
include ('beckettOrdersHeader.php');
echo '<body>';

//connect to the tcf_beckett database
require ('mysqli_connect_tcf_beckett.php');

//check the POST variable to see if the orderDetails should be filtered
if($_SERVER['REQUEST_METHOD'] == 'POST')
{	
	if(isset($_POST['orderID']))
	{
		//get the orderID from the POST array
		$orderID = $_POST['orderID'];
		//make the query for specific id
		$q = "SELECT *
		  FROM orderDetails
		  WHERE orderID=$orderID
		  ORDER BY orderID DESC, sport ASC, year ASC, cardNumber ASC";
		//make a SUM query for specific id
		$getTotal = "SELECT SUM(total) AS orderTotal
		  FROM orderDetails
		  WHERE orderID=$orderID";
		//run the SUM query
		$sumResults = @mysqli_query ($dbc, $getTotal);
		//fetch the results
		$orderTotal = mysqli_fetch_object($sumResults);
		//create the table header
		createHeader();
		runQuery($dbc, $q);
	}
	
	else if(isset($_POST['cardName']))
	{
		//get the orderID from the POST array
		$cardName = addslashes($_POST['cardName']);
		//make the query for specific id
		$q = "SELECT *
		  FROM orderDetails
		  WHERE cardName='$cardName'
		  ORDER BY sport ASC, year ASC, setName ASC, cardNumber ASC";
		//make a SUM query for specific id
		$getTotal = 'SELECT SUM(total) AS orderTotal
		  FROM orderDetails
		  WHERE cardName = \'' . $cardName . '\'';
		//run the SUM query
		$sumResults = @mysqli_query ($dbc, $getTotal);
		//fetch the results
		$orderTotal = mysqli_fetch_object($sumResults);
		//create the table header
		createHeader();
		runQuery($dbc, $q);
	}
	
	else if(isset($_POST['email']))
	{
		//get the customerID from the POST array
		$email = $_POST['email'];

		//add a table row with email address
		echo '<center><p><b>All orders for: ' . $email . '</b></p></center>';
		//create the table header
		createHeader();
		//get all orders for the customerID
		$query = 'SELECT orderID
		  FROM orders
		  WHERE email=\'' . addslashes($email) . '\'';
		//run the query
		$r = @mysqli_query ($dbc, $query);
		if($r)
		{
			while ($row = mysqli_fetch_array($r, MYSQLI_ASSOC))
			{
				//store the results in an array
				$value = $row['orderID'];
				//add to the query statement
				$q = "SELECT *
				  FROM orderDetails
				  WHERE orderID=$value
				  ORDER BY orderID DESC, sport ASC, year ASC, cardNumber ASC";
				//run the query
				runQuery($dbc, $q);
			}
			
		}
		else 
		{
			// Debugging message:
			echo '<p>' . mysqli_error($dbc) . '<br /><br />Query: ' . $query . '</p>';
		}
		
		//make a SUM query for the specific customer
		$getTotal = 'SELECT SUM(total) AS orderTotal
		  FROM orders
		  WHERE email=\'' . addslashes($email) . '\'';
		//run the SUM query
		$sumResults = @mysqli_query ($dbc, $getTotal);
		//fetch the results
		$orderTotal = mysqli_fetch_object($sumResults);	
	}//end of if statement that checks POST for email
	
}//end of if statement that checks if SERVER_METHOD = POST

else if(isset($_GET['sport']))
{
	//get the info passed via GET
	$sport = $_GET['sport'];
	$year = $_GET['year'];
	$setName = $_GET['setName'];	

	//make the query for specific id
	$q = "SELECT *
	  FROM orderDetails
	  WHERE sport='$sport' AND year='$year' AND setName='$setName'
	  ORDER BY sport ASC, year ASC, setName ASC, cardNumber ASC";
	//make a SUM query for specific id
	$getTotal = "SELECT SUM(total) AS orderTotal
	  FROM orderDetails
	  WHERE sport='$sport' AND year='$year' AND setName='$setName'";
	//run the SUM query
	$sumResults = @mysqli_query ($dbc, $getTotal);
	//fetch the results
	$orderTotal = mysqli_fetch_object($sumResults);
	//create the table header
	createHeader();
	runQuery($dbc, $q);	
}//end else if: SERVER_METHOD = GET

else//start else: no SERVER_METHOD
{
    //make the query:
	$q = "SELECT *
		  FROM orderDetails
		  ORDER BY price DESC";
		  //ORDER BY orderID DESC, sport ASC, year ASC, cardNumber ASC";
	//create the table header
	createHeader();
	runQuery($dbc, $q);
}

//if there is a total add it to the table
if($_SERVER['REQUEST_METHOD'] == 'POST' || isset($_GET['sport']))
{
	echo '<tr><td></td><td></td><td></td><td></td>
	<td></td><td></td><td></td><td></td><td></td>
	<td><b>' . '$' . number_format($orderTotal->orderTotal, 2) . ' </b></td></tr>';
}
echo '</table></div>'; //close the table

//function to create the table header
function createHeader()
{
	//create a table header
	echo '<div class="infoTable">
	<table class="table table-condensed table-striped table-bordered" >
	<tr>
	<td><b>Order ID</b></td>
	<td><b>Sport</b></td>
	<td><b>Year</b></td>
	<td class="expand"><b>Set</b></td>
	<td><b>#</b></td>
	<td class="expand"><b>Card Name</b></td>
	<td><b>Condition</b></td>
	<td><b>Qty</b></td>
	<td><b>Price</b></td>
	<td><b>Total</b></td>
	</tr>';
}

//function to print to order details		
function runQuery($dbc, $q)
{
	//run the query
	$r = @mysqli_query ($dbc, $q);
	//if it runs ok, display the records
	if ($r)
	{
		//fetch and print all the records:
		while ($row = mysqli_fetch_array($r, MYSQLI_ASSOC))
		{
		  echo '<tr>
			<td>' . $row['orderID'] . '</td>
			<td>' . $row['sport'] . '</td>
			<td>' . $row['year'] . '</td>
			<td class="expand">' . $row['setName'] . '</td>
			<td>' . $row['cardNumber'] . '</td>
			<td class="expand">' . $row['cardName'] . '</td>
			<td>' . $row['cond'] . '</td>
			<td>' . $row['qty'] . '</td>
			<td>' . '$' . $row['price'] . '</td>
			<td>' . '$' . $row['total'] . '</td>
			</tr>';
		}
	}
	else 
	{
		// Debugging message:
		echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
	}
	mysqli_free_result ($r); //free up the resources
}//end of funtion
?>
</body>
</html>