<?php
//create the header
include ('beckettOrdersHeader.php');
echo '<body>';

	//create a table header
	echo '<div class="infoTable">
	<table class="table table-condensed table-striped table-bordered" >
	<form method="post" action="AddOrderDetails.php">
	<tr id="blackBorder">
	<td><input name="orderID" type="text" value="" /></td>
	<td><input name="submit" type="submit" value="Submit" /></td>
	</tr>
	<tr>
	<td><b>Item ID</b></td>
	<td><b>Sport</b></td>
	<td><b>Year</b></td>
	<td class="expand"b>Set</b></td>
	<td><b>#</b></td>
	<td class="expand"><b>Card Name</b></td>
	<td><b>Condition</b></td>
	<td><b>Qty</b></td>
	<td><b>Price</b></td>
	<td><b>Total</b></td>
	</tr>';
if($_SERVER['REQUEST_METHOD'] == 'POST')
{
	//get the orderID from the POST array
	$orderID = htmlspecialchars($_POST['orderID']);
	
	//connect to the tcf_beckett database
	require ('mysqli_connect_tcf_beckett.php');
	
	//check to see if the order was already added
	$q = "SELECT added
	      FROM orders
	      WHERE orderID=$orderID
		  LIMIT 1";
	
	//run the query
	$r = @mysqli_query ($dbc, $q);
	$added = mysqli_fetch_object($r);
	//if the record was already added, display a message
	//echo $added->added;****************************************************debugging
	if($added->added == 1)
	{
		echo '<b>The details for order ' . $orderID . ' were already added!</b>';
	}
	else
	{
		//read the contents of the file into an array
		$array = file("c:\\xampp\\htdocs\\newOrder.csv");
		//cycle through the array
		for($i = 1; $i < count($array); $i++)
		{
			//convert the string in each element to an array
			$line = str_getcsv($array[$i], ",", '"');
			
			//remove the Category and CSKU columns
			array_splice($line,4,2);
			
			//format the entries so they can be added to the database
			$line[1] = str_replace("\"", "\\\"",$line[1]);
			$line[1] = addslashes($line[1]);
			$line[2] = str_replace("\"", "\\\"",$line[2]);
			$line[2] = addslashes($line[2]);
			$line[5] = str_replace("\$", "",$line[5]);
			$line[6] = str_replace("\$", "",$line[6]);
			
			//turn the element in position 1 into an array
			$itemDesc[$i] = explode(" ", $line[1]);
			
			//remove the Item Description columns
			array_splice($line,1,1);
			
			//save the itemID, condition, sport, qty, price and total
			$itemID = $line[0];
			$condition = $line[1];
			$sport = $line[2];
			$qty = $line[3];
			$price = $line[4];
			$total = $line[5];
			
			//save the year
			$year = $itemDesc[$i][0];
			
			//condense the elements that contain the set name
			//find the element that contains the card #
			$hashTag = "#";
			$index = "";
			for($k = 0; $k < count($itemDesc[$i]); $k++)
			{
				if(strpos($itemDesc[$i][$k], $hashTag) === 0)
				{
					$index = $k;
				}
			}
			//save the set name
			$set = "";
			for($x = 1; $x < $index; $x++)
			{
				$set = $set . $itemDesc[$i][$x] . " ";
			}
			$set = trim($set);

			//save the card number
			$cardNumber = $itemDesc[$i][$index];
			
			//save the card name
			$cardName = "";
			for($y = $index + 1; $y < count($itemDesc[$i]); $y++)
			{
				$cardName = $cardName . $itemDesc[$i][$y] . " ";
			}
			$cardName = trim($cardName);

			//create a new record
			$q = "INSERT INTO orderdetails(itemID, sport, year, setName, cardNumber, cardName, cond, qty, price, total, orderID)
				VALUES ('$itemID', '$sport', '$year', '$set', '$cardNumber', '$cardName', '$condition', $qty, $price, $total, '$orderID')";
			//run the query
			$r = @mysqli_query ($dbc, $q);
			//if it runs ok, display the records
			if ($r)
			{
				echo '<tr>
				<td class="shirnk">' . $itemID . '</td>
				<td class="shirnk">' . $sport . '</td>
				<td class="shirnk">' . $year . '</td>
				<td class="expand">' . $set . '</td>
				<td class="shirnk">' . $cardNumber . '</td>
				<td class="expand">' . $cardName . '</td>
				<td class="shirnk">' . $condition . '</td>
				<td class="shirnk">' . $qty . '</td>
				<td class="shirnk">' . $price . '</td>
				<td class="shirnk">' . $total . '</td>
				</tr>';
			}	
			else 
			{
				// If it did not run OK.
				// Public message:
				echo '<p class="error">Error: The data you requested is unavailable. We apologize for any inconvenience.</p>';
					
				// Debugging message:
				echo '<p>' . mysqli_error($dbc) . '<br /><br />Query: ' . $q . '</p>';
			}

		}
	
		echo '</form></table></div>'; // Close the table.
			
		//update the orders table to indicate the details were added//create a new record
		$q = "UPDATE orders
			SET added=1
			WHERE orderID='$orderID' ";
		//run the query
		$r = @mysqli_query ($dbc, $q);
		
		//if it runs ok, display a message
		if ($r)
		{
			echo '<center><p>Order ' . $orderID . ' details were added.</p></center>';
		}	
		else 
		{
			// If it did not run OK.
			// Public message:
			echo '<p class="error">Error: The data you requested is unavailable. We apologize for any inconvenience.</p>';
			
			// Debugging message:
			echo '<p>' . mysqli_error($dbc) . '<br /><br />Query: ' . $q . '</p>';
		}
	}
}
	?>
</body>
</html>