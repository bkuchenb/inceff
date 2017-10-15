<?php
//funtion to check if an order has already been added
function orderAdded($dbc, $orderID)
{
	//create the query
	$q = "SELECT added
	      FROM orders
	      WHERE orderID='$orderID'
		  LIMIT 1";
	
	//run the query
	$r = @mysqli_query ($dbc, $q);
	if ($r)//if the query ran ok
	{
		//fetch the results
		$result = mysqli_fetch_object($r);
		//save the results in a variable
		if(isset($result))//the details were already added
		{
			$added = $result->added;
			if($added == 1)
			{
				echo '<font color="red"><b>The details for order ' . $orderID . ' were already added!</b></font><br>';
			}
		}//end of nested if statement
		else//the details haven't been added
		{
			$added = 0;
		}//end of nested else statement
		//free up resources
		mysqli_free_result($r);
		return $added;
	}//end of if statement
	else//if it did not run OK
	{			
		// Debugging message:
		echo '<p>' . mysqli_error($dbc) . '<br>Query: ' . $q . '</p>';
	}//end of else statement
}//end of function

//funtion to check if a customer has already been added
function customerAdded($dbc, $orderData)
{
	$email = mysqli_real_escape_string($dbc, $orderData['email']);
	//create the query
	$q = "SELECT added
	      FROM customers
	      WHERE email='$email'
		  LIMIT 1";
	
	//run the query
	$r = @mysqli_query ($dbc, $q);
	if ($r)//if the query ran ok
	{
		//fetch the results
		$result = mysqli_fetch_object($r);
		//save the results in a variable
		if(isset($result))//the details were already added
		{
			$added = $result->added;
			if($added == 1)
			{
			echo '<font color="red"><b>' . $orderData['first'] . ' ' . $orderData['last'] .
			' has already been added!</b></font><br>';
			}
		}//end of nested if statement
		else//the details haven't been added
		{
			$added = 0;
		}//end of nested else statement
		//free up resources
		mysqli_free_result($r);
		return $added;
	}//end of if statement
	else//if it did not run OK
	{	
		// Debugging message:
		echo '<p>' . mysqli_error($dbc) . '<br>Query: ' . $q . '</p>';
	}//end of else statement
}//end of function

//function to break up the card information
function spliceCard($array)
{
	//find the element that contains the card #
	$hashTag = "#";
	$index = "";
	for($k = 0; $k < count($array); $k++)
	{
		//check to see if the first character in the element is #
		if(strpos($array[$k], $hashTag) === 0)
		{
			$index = $k;//save the positon of the card number
		}
	}
	//save the set name
	$set = "";
	if($array[0] === '(refund')//no refund
	{
		for($x = 3; $x < $index; $x++)
		{
			$set = $set . $array[$x] . " ";
		}
	}//end of if statement: no refund
	else//there was a refund
	{
		for($x = 1; $x < $index; $x++)
		{
			$set = $set . $array[$x] . " ";
		}
	}//end of else statement: refund
	$set = trim($set);

	//save the card number
	$cardNumber = $array[$index];
	
	//save the card name
	$cardName = "";
	for($y = $index + 1; $y < count($array); $y++)
	{
		$cardName = $cardName . $array[$y] . " ";
	}
	$cardName = trim($cardName);
	//add all saved variables and return as an array
	$cardInfo = array();
	$cardInfo[0] = $set;
	$cardInfo[1] = $cardNumber;
	$cardInfo[2] = $cardName;
	return $cardInfo;
}

//function to add the card data to the orderDetails table
function updateOrderDetails($dbc, $orderID, $cardData)
{	
	//build the sql statement
	$q = "INSERT INTO orderdetails(itemID, sport, year, setName, cardNumber, cardName, cond, qty, price, total, orderID)
		VALUES ";
		
	for($j = 0; $j < count($cardData); $j++)//add to the sql statement
	{
		//open the parentheses for each set of values
		$q = $q . "(";
		
		//add to the query
		$q = $q . "'" . $cardData[$j]['itemID'] . "'," . " '" . $cardData[$j]['sport'] . "'," .
		" '" . $cardData[$j]['year'] . "'," . " '" . addslashes($cardData[$j]['setName']) . "'," .
		" '" . $cardData[$j]['cardNumber'] . "'," . " '" . addslashes($cardData[$j]['cardName']) . "'," .
		" '" . $cardData[$j]['cond'] . "'," . " '" . $cardData[$j]['qty'] . "'," .
		" '" . $cardData[$j]['price'] . "'," . " '" . $cardData[$j]['total'] . "'" .
		", '" . $orderID . "')";
		//if there is another record, add a comma
		if($j < count($cardData) - 1 && count($cardData) > 1)
		{
			$q = $q . ",";
		}
	}
	//run the query
	$r = @mysqli_query ($dbc, $q);
	
	if ($r)//if the query ran ok display a message
	{
		echo '<b>The orderDetails table has been updated!</b><br>';
	}
	else//if it did not run OK
	{	
		// Debugging message:
		echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
	}
}//end function

//function to add data to the orders table
function updateOrders($dbc, $orderData)
{
	//build the sql statement
	$q = 'INSERT INTO orders(orderID, email, added, date, time, shipping, tax, total)
		VALUES (\'' . $orderData['orderID'] . '\',\'' . $orderData['email'] . '\', 1,' . $orderData['date'] . ',\'' .
		$orderData['time'] . '\',' . $orderData['shipping'] . ',' . $orderData['tax'] .
		',' . $orderData['total'] . ')';
		
	//run the query
	$r = @mysqli_query ($dbc, $q);
	
	if ($r)//if the query ran ok display a message
	{
		echo '<b>Order ' . $orderData['orderID'] . ' has been added!</b><br>';
	}//end of nested if
	else//if it did not run OK
	{
		// Public message:
		echo '<p class="error">Error: The data you requested is unavailable. We apologize for any inconvenience.</p>';
			
		// Debugging message:
		echo '<p>' . mysqli_error($dbc) . '<br /><br />Query: ' . $q . '</p>';
	}//end of nested else
}//end of function

//function to add data to the customers table
function updateCustomers($dbc, $orderData)
{
	
	//build the sql statement
	$q = 'INSERT INTO customers (added, firstName, lastName, email, phone, shipTo,
		address, city, state, zipcode, country)
		VALUES (1,\'' . addslashes($orderData['first']) . '\',\'' . addslashes($orderData['last']) . '\',\'' .
		$orderData['email'] . '\',\'' . $orderData['phone'] . '\',\'' . addslashes($orderData['shipTo']) . '\',\'' .
		addslashes($orderData['address']) . '\',\'' . addslashes($orderData['city']) . '\',\'' .
		$orderData['state'] . '\',\'' . $orderData['zipcode'] . '\',\'' . $orderData['country'] . '\')';
		
	//run the query
	$r = @mysqli_query ($dbc, $q);
	
	if ($r)//if the query ran ok display a message
	{
		echo '<b>Customer ' . $orderData['first'] . ' ' . $orderData['last'] .
	' has been added!</b>';
	}//end of nested if
	else//if it did not run OK
	{
		// Public message:
		echo '<p class="error">Error: The data you requested is unavailable. We apologize for any inconvenience.</p>';
			
		// Debugging message:
		echo '<p>' . mysqli_error($dbc) . '<br /><br />Query: ' . $q . '</p>';
	}//end of nested else
}//end of function

//function to get customer totals
function customerTotals($dbc, $results)
{
	for($i = 0; $i < count($results); $i++)
	{
		//build the sql statement
		$q = 'SELECT SUM(total) as total, COUNT(email) as numOrders
			  FROM orders
			  WHERE email = \'' . $results[$i]['email'] . '\'';
		//run the query
		$r = @mysqli_query ($dbc, $q);
		if($r)//if it runs ok, add the total to the results array
		{
			//fetch the result
			$resultObj = mysqli_fetch_object($r);
			//add the result to the array
			$results[$i]['total'] = $resultObj->total;
			$results[$i]['numOrders'] = $resultObj->numOrders;
		}
		else
		{
			// Debugging message:
			echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
		}
	}//end of foreach loop
	
	//sort the array by total
	// Obtain a list of columns
	foreach ($results as $key => $row)
	{
		$firstName[$key]  = $row['firstName'];
		$lastName[$key] = $row['lastName'];
		$email[$key] = $row['email'];
		$total[$key] = $row['total'];
		$numOrders[$key] = $row['numOrders'];
	}
	array_multisort($total, SORT_DESC, SORT_NUMERIC, $results);
	
	return $results;
}//end of function

function displayOrder($orderData, $cardData)
{
	echo '
		<div id"cardData">
		<form method="post" action="AddOrderDetails_V2.php">
		<p><center>
		<input type="submit" name="update" value="Update" />
		</center></p>
		<p>
		<b>OrderID: </b><input size="6" name="orderID" type="text" value="' . $orderData['orderID'] . '" />
		<b>Date: </b><input size="6" name="date" type="text" value="' . $orderData['date'] . '" />
		<b>Time: </b><input size="6" name="time" type="text" value="' . $orderData['time'] . '" />
		</p>
		<p>
		<b>Shipping: </b><input size="6" name="shipping" type="text" value="' . $orderData['shipping'] . '" />
		<b>Tax: </b><input size="6" name="tax" type="text" value="' . $orderData['tax'] . '" />
		<b>Total: </b><input size="6" name="total" type="text" value="' . $orderData['total'] . '" />
		</p>
		<p>
		<b>First: </b><input size="15" name="first" type="text" value="' . $orderData['first'] . '" />
		<b>Last: </b><input size="15" name="last" type="text" value="' . $orderData['last'] . '" />
		<b>Email: </b><input size="30" name="email" type="text" value="' . $orderData['email'] . '" />
		<b>Phone: </b><input size="15" name="phone" type="text" value="' . $orderData['phone'] . '" />
		</p>
		<p>
		<b>Ship To: </b><input name="shipTo" type="text" value="' . $orderData['shipTo'] . '" />
		<b>Address: </b><input name="address" type="text" value="' . $orderData['address'] . '" />
		<b>City: </b><input name="city" type="text" value="' . $orderData['city'] . '" />
		<b>State: </b><input size="4" name="state" type="text" value="' . $orderData['state'] . '" />
		<b>Zip: </b><input size="6" name="zipcode" type="text" value="' . $orderData['zipcode'] . '" />
		<b>Country: </b><input size="10" name="country" type="text" value="' . $orderData['country'] . '" />
		</p>';
			
		for($i = 0; $i < count($cardData); $i++)
		{
			echo '
			<p>
			<b>Item ID </b><input size="7" name="data[' . $i . '][itemID]" type="text" value="' . $cardData[$i]['itemID'] . '" />
			<b>Sport </b><input size="6" name="data[' . $i . '][sport]" type="text" value="' . $cardData[$i]['sport'] . '" />
			<b>Year </b><input size="6" name="data[' . $i . '][year]" type="text" value="' . $cardData[$i]['year'] . '" />
			<b>Set </b><input size="20" name="data[' . $i . '][setName]" type="text" value="' . $cardData[$i]['setName'] . '" />
			<b># </b><input size="3" name="data[' . $i . '][cardNumber]" type="text" value="' . $cardData[$i]['cardNumber'] . '" />
			<b>Name </b><input size="28" name="data[' . $i . '][cardName]" type="text" value="' . $cardData[$i]['cardName'] . '" />
			<b>Condition </b><input size="10" name="data[' . $i . '][cond]" type="text" value="' . $cardData[$i]['cond'] . '" /></td>
			<b>Qty </b><input size="3" name="data[' . $i . '][qty]" type="text" value="' . $cardData[$i]['qty'] . '" /></td>
			<b>Price </b><input size="4" name="data[' . $i . '][price]" type="text" value="' . $cardData[$i]['price'] . '" /></td>
			<b>Total </b><input size="4" name="data[' . $i . '][total]" type="text" value="' . $cardData[$i]['total'] . '" /></td>
			</p>';
		}
		echo '<p align="right" style="margin-right:44px;">
		<input type="submit" name="update" value="Update" />
		</center></p>
		</form></table></div>';
		
}//end of function
?>