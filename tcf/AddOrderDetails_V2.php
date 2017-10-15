<?php
//create the header
include ('beckettOrdersHeader.php');
//import functions that process beckett data
include ('beckettFunctions.php');
//connect to the tcf_beckett database
require ('mysqli_connect_tcf_beckett.php');
//start a session
session_start();

echo '<body>';

//check to see if the form has been submitted
if($_SERVER['REQUEST_METHOD'] == 'POST' && !isset($_POST['update']))
{
	//save the text submitted
	$text = htmlspecialchars($_POST['orderInfo']);
	//save the text to a file
	file_put_contents("textfile.txt", $text) or die("Unable to open file!");
	
	$array = file("textfile.txt");//read the file into an array
	$cardData = array();//create an array for the card data
	$orderData = array();//create an array for the order info
	$counter = 0;//create a counter
	$cardInfoRow = false;//to tell if card info should be processed
	//create a variable to tell in an itemID number was read
	$itemIdInput = false;
	
	//cycle through the array and process the lines accordingly
	for($i = 0; $i < count($array); $i++)
	{
		//trim the whitespace from each line
		$array[$i] = trim($array[$i]);
		//replace any tabs with spaces
		$array[$i] = str_replace("\t", " ", $array[$i]);
		//turn each line into an array
		$temp = explode(" ", $array[$i]);
		
		if($temp[0] === 'Viewing')//look for the line containing orderID
		{
			$orderData['orderID'] = str_replace("#", "", $temp[4]);//save the orderID
		}
		if($temp[0] === 'Sell')//look for the line containing date and time
		{
			//$date = explode("/", $temp[2]);
			$orderData['date'] = str_replace('-', '', $temp[2]);//save the date and time
			$orderData['time'] = $temp[3];
		}
		if(count($temp) === 1 && ctype_digit($temp[0]))//look for the line containing itemID
		{
			$cardData[$counter]['itemID'] = $temp[0];//add the itemID to the array
			$itemIdInput = true;//set itemIdInput to true
		}
		if($cardInfoRow && count($temp) > 1)//look for the line after card info
		{
			//add the quantity
			$cardData[$counter]['qty'] = $temp[count($temp) - 3];
			//add the price
			$cardData[$counter]['price'] = str_replace("\$", "", $temp[count($temp) - 2]);
			//add the total
			$cardData[$counter]['total'] = str_replace("\$", "", $temp[count($temp) - 1]);
			//find the index of the word "Cards"
			for($j = 0; $j < count($temp); $j++)
			{
				if($temp[$j] === 'Cards')
				{
					$indexCards = $j;
				}
			}
			//add the sport
			$cardData[$counter]['sport'] = $temp[$indexCards - 1];
			//add the condition
			$cond = '';
			//check to see if there was a refund
			if($temp[0] != '*')//no refund
			{
				for($z = 0; $z < ($indexCards - 1); $z++)
				{
					$cond = $cond . $temp[$z] . ' ';
				}
				$cond = trim($cond);
				$cardData[$counter]['cond'] = $cond;
			}
			else//there was a refund
			{
				for($z = 8; $z < ($indexCards - 1); $z++)
				{
					$cond = $cond . $temp[$z] . ' ';
				}
				$cond = trim($cond);
				$cardData[$counter]['cond'] = $cond;
				/*create a variable for original qty
				//$qty1 = $cardData[$counter]['qty'];
				//fix the quantity
				//$cardData[$counter]['qty'] = $cardData[$counter]['qty'] - $temp[4];
				//create a variable for original total
				//$total1 = $cardData[$counter]['total'];
				//fix the total
				//$cardData[$counter]['total'] = $cardData[$counter]['qty'] * $cardData[$counter]['price'];
				//print a message that indicates there was a refund
				echo '<font color="red"><b>There was a refund for item ' . $cardData[$counter]['itemID'] .
				': ' . $cardData[$counter]['cardName'] . '.<br>
				The original quantity was ' . $qty1 . ' and ' . $temp[4] . 'item(s) were returned.<br>
				The adjusted quantity is ' . $cardData[$counter]['qty'] . ' and the adjusted total is: ' .
				$cardData[$counter]['total'] .	'</b></font><br>';*/
			}//end of else statement: there was a refund
			
			$counter++;
			$cardInfoRow = false;//set cardInfoRow to false
		}
		if(count($temp) > 1 && $itemIdInput)//look for the line after itemID
		{
			if($temp[0] === '(refund')//no refund
			{
				//add the year to the array
				$cardData[$counter]['year'] = $temp[2];
				//add the card information to the array
				$splicedData = spliceCard($temp);
				$cardData[$counter]['setName'] = $splicedData[0];
				$cardData[$counter]['cardNumber'] = $splicedData[1];
				$cardData[$counter]['cardName'] = $splicedData[2];
			}
			else//there was a refund
			{
				//add the year to the array
				$cardData[$counter]['year'] = $temp[0];
				//add the card information to the array
				$splicedData = spliceCard($temp);
				$cardData[$counter]['setName'] = $splicedData[0];
				$cardData[$counter]['cardNumber'] = $splicedData[1];
				$cardData[$counter]['cardName'] = $splicedData[2];
			}
			
			$cardInfoRow = true;//set cardInfoRow to true
			$itemIdInput = false;//set the itemIdInput to false
		}
		//look for the line containing Shipping cost
		if($temp[0] === 'Shipping' && strpos($temp[count($temp) - 1], '$') === 0)
		{
			//save the shipping
			$orderData['shipping'] = str_replace("\$", "", $temp[count($temp) - 1]);
			$orderData['shipping'] = floatval($orderData['shipping']);
		}
		if($temp[0] === 'Tax:')//look for the line containing Tax
		{
			//save the tax
			$orderData['tax'] = str_replace("\$", "", $temp[count($temp) - 1]);
			$orderData['tax'] = floatval($orderData['tax']);
		}
		if($temp[0] === 'Total')//look for the line containing Total
		{
			//save the total
			$orderData['total'] = str_replace("\$", "", $temp[count($temp) - 1]);
			$orderData['total'] = floatval($orderData['total']) -
			($orderData['shipping'] + $orderData['tax']);
		}
		if($temp[0] === 'email:')//look for the line containing email:
		{
			$orderData['email'] =  strtolower($temp[1]);//save the email
		}
		if($temp[0] === 'first')//look for the line containing first
		{
			//save the first name
			$orderData['first'] = ucwords(strtolower($temp[count($temp) - 1]));
		}
		if($temp[0] === 'last')//look for the line containing last
		{
			$orderData['last'] = ucwords(strtolower($temp[count($temp) - 1]));
		}
		if($temp[0] === 'Phone')//look for the line containing Phone
		{
			$orderData['phone'] = implode(' ',$temp);
			$orderData['phone'] = str_replace('Phone Number: ', '', $orderData['phone']);
		}
		if($temp[0] === 'Shipping' && $temp[1] === 'Address')//look for the line containing Phone
		{
			$addressStart = $i + 2;
		}
		if($temp[0] === 'Shipping' && $temp[1] === 'Status')//look for the line containing Phone
		{
			$addressEnd = $i - 2;
		}
	}//end of for statement that cycles through the raw data
	
	if($addressStart < $addressEnd)//add address if it exists
	{
		$orderData['shipTo'] = ucwords(strtolower($array[$addressStart]));//save the shipTo name
		$orderData['address'] = ucwords(strtolower($array[$addressStart + 1]));//save the street address
		if($addressEnd - $addressStart == 4)
		{
			//save the second line of the address
			$orderData['address'] .= ' ' . ucwords(strtolower($array[$addressStart + 2]));
		}
		$str = preg_replace('/\s+/', ' ', $array[$addressEnd - 1]);
		$temp = explode(",", $str);
		$orderData['city'] = ucwords(strtolower($temp[0]));//save the city
		$temp = explode(" ", $str);
		$orderData['state'] = $temp[count($temp) - 2];//save the state
		$orderData['zipcode'] = $temp[count($temp) - 1];//save the zipcode
		$orderData['country'] = ucwords(strtolower($array[$addressEnd]));//save the country
	}
	//if there is no address enter TCF info
	else
	{
		$orderData['phone'] = '(518)-238-3818';//save the phone #
		$orderData['shipTo'] = 'TCF';//save the shipTo name
		$orderData['address'] = '470 North Greenbush Rd';//save the street address
		$orderData['city'] = 'Rensselaer';//save the city
		$orderData['state'] = 'NY';//save the state
		$orderData['zipcode'] = 12144;//save the zipcode
		$orderData['country'] = 'United States';//save the country
	}
	
	//display the data in a table and allow the user to make changes
	displayOrder($orderData, $cardData);
	
	//save the original data in the $_SESSION array
	$_SESSION['orderData'] = $orderData;
	$_SESSION['cardData'] = $cardData;
}//end of if statement that checks for POST data
else if(isset($_POST['update']))
	{
		//compare the $_SESSION array to the $_POST array
		$orderData = $_SESSION['orderData'];
		$cardData = $_SESSION['cardData'];
		
		//save any changes made by the user
		foreach($orderData as $key => $value)
		{
			if($value != $_POST[$key])
			{
				//echo $orderData[$key] . ' --> ' . $_POST[$key] . '<br>';//////////////////////////////////////////////////
				$orderData[$key] = htmlspecialchars($_POST[$key]);
			}
		}
		
		for($i = 0; $i < count($cardData); $i++)
		{
			foreach($cardData[$i] as $key => $value)
			{
				if($value != $_POST['data'][$i][$key])
				{
					//echo $cardData[$i][$key] . ' --> ' . $_POST['data'][$i][$key] . '<br>';////////////////////////////
					$cardData[$i][$key] = htmlspecialchars($_POST['data'][$i][$key]);
				}
			}
		}
		
		//check to see if the order has been added
		$added = orderAdded($dbc, $orderData['orderID']);
		//if the order hasn't been added, add it
		if($added == 0)
		{
			//update the orders table
			updateOrders($dbc, $orderData);
			//update the orderDetails table
			updateOrderDetails($dbc, $orderData['orderID'], $cardData);
		}
		//check to see if the customer has been added
		$added = customerAdded($dbc, $orderData);
		//update the customers table
		if($added == 0)
		{
			updateCustomers($dbc, $orderData);
		}
		//create a table header
		echo'
		<div class="infoTable">
			<form method="post" action="AddOrderDetails_V2.php">
				<textarea type="submit" wrap="hard" rows="10" cols="180" name="orderInfo">
				</textarea>
				<input type="submit" name="submit" />
			</form>
		</div>';
	}//end of if statement that checks if update was clicked
else
{
	//create a table header
	echo'
	<div class="infoTable">
		<form method="post" action="AddOrderDetails_V2.php">
			<textarea type="submit" wrap="hard" rows="15" cols="180" name="orderInfo">
			</textarea>
			<input type="submit" name="submit" />
		</form>
	</div>';
}
?>
</body>
</html>