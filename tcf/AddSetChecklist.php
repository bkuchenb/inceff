<link href="css/tcf_sport_buttons.css" rel="stylesheet" />
<?php
session_start();
//create the header
include ('beckettOrdersHeader.php');

echo '<body>';

if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['setInfo']))
{
	//get the sport from the $_SESSION array
	$sport = $_SESSION['sport'];
	//save the text submitted
	$text = htmlspecialchars($_POST['setInfo']);
	//save the text to a file
	file_put_contents("textfile.txt", $text) or die("Unable to open file!");
	
	$array = file("textfile.txt");//read the file into an array
	
	$cardData = array(array());//create an array for the card data
	$cardInfoLine = True;//to tell if the line read contains card info
	$newIndex = 0;//used to only save row data with valid info
	
	//cycle through the array and process the lines accordingly
	for($i = 0; $i < count($array); $i++)
	{
		//trim the whitespace from each line
		$array[$i] = trim($array[$i]);
		//replace any tabs with spaces
		$array[$i] = str_replace("\t", " ", $array[$i]);
		//turn each line into an array
		$temp = explode(" ", $array[$i]);
		if(count($temp) > 1)//skip any blank lines
		{
			if($cardInfoLine)
			{
				//save the year
				$year = $temp[0];
				
				//add the card information to the array
				$splicedData = spliceCard($temp);
				$set = $splicedData[0];
				$cardData[$newIndex]['cardNumber'] = $splicedData[1];
				$cardData[$newIndex]['cardName'] = $splicedData[2];
				$cardInfoLine = False;
			}
			//look for the line with the price information
			if($temp[0] == '-')
			{
				//save the low price
				$low = str_replace("\$", "", $temp[2]);
				//save the high price
				$high = str_replace("\$", "", $temp[3]);
				$cardData[$newIndex]['high'] = $high;
				$cardData[$newIndex]['low'] = $low;
				$cardInfoLine = True;
				//update the newIndex
				$newIndex++;
			}
		}//end of if that checks line length
	}//end of for statement that loops through the data
	
	//debugging*****************************************************************************************
	/* echo '<p>';
	for($i = 0; $i < count($cardData); $i++)
	{
		echo $year . ' ' . $set . ' ' . $cardData[$i]['cardNumber'] . ' '
		. $cardData[$i]['cardName'] . ' ' . $cardData[$i]['low'] . ' ' . $cardData[$i]['high'] . '<br>';
	}
	echo '</p>'; */
	//debugging*****************************************************************************************
	
	//add the card information to the proper database
	updateDatabase($sport, $year, $set, $cardData);
	
	//create a table header
	echo'
	<div class="infoTable">
		<form method="post" action="AddSetChecklist.php">
			<textarea type="submit" wrap="hard" rows="2" cols="180" name="setInfo">
			</textarea>
			<input type="submit" name="submit" />
		</form>
	</div>';
}//end of if statement that checks for POST data
else if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['sport']))
{
	//save the sport
	$_SESSION['sport'] = strtolower($_POST['sport']);
	echo'
	<div class="infoTable">
		<form method="post" action="AddSetChecklist.php">
			<textarea type="submit" wrap="hard" rows="2" cols="180" name="setInfo">
			</textarea>
			<input type="submit" name="submit" />
		</form>
	</div>';
}
else
{
	//create buttons to choose sport
	echo'
	<p>
	<form method="post" action="AddSetChecklist.php" align="center">
	<input name="sport" class="xlarge blue button" type="submit" value="Baseball" />
	<input name="sport" class="xlarge blue button" type="submit" value="Football" />
	<input name="sport" class="xlarge blue button" type="submit" value="Basketball" />
	<input name="sport" class="xlarge blue button" type="submit" value="Hockey" />
	</p>
	<p>
	<input name="sport" class="xlarge blue button" type="submit" value="Nonsports" />
	<input name="sport" class="xlarge blue button" type="submit" value="Multisport" />
	<input name="sport" class="xlarge blue button" type="submit" value="Racing" />
	<input name="sport" class="xlarge blue button" type="submit" value="Wrestling" />
	</p>
	<p>
	<input name="sport" class="xlarge blue button" type="submit" value="Soccer" />
	<input name="sport" class="xlarge blue button" type="submit" value="Golf" />
	<input name="sport" class="xlarge blue button" type="submit" value="Magic" />
	<input name="sport" class="xlarge blue button" type="submit" value="YuGiOh" />
	</p>
	<p>
	<input name="sport" class="xlarge blue button" type="submit" value="Pokemon" />
	<input name="sport" class="xlarge blue button" type="submit" value="Gaming" />
	<input name="sport" class="xlarge blue button" type="submit" value="Diecast" />
	</p>';
}//end of else statement submit button was not clicked

//function to get the information for the card
function spliceCard($array)
{
	$hashTag = "#";
	$index = "";//to save the position of the card number
	//find the element that contains the card #
	for($k = 0; $k < count($array); $k++)
	{
		//check to see if the first character in the element is #
		if(strpos($array[$k], $hashTag) === 0)
		{
			$index = $k;//save the positon of the card number
		}
	}
	//save the set name
	$set = "";//initialize the variable
	for($x = 1; $x < $index; $x++)
	{
		$set = $set . $array[$x] . " ";
	}
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
}//end of function

function updateDatabase($sport, $year, $set, $cardData)
{
	//connect to the tcf_overflow database
	$user = 'Mickey';
	$pw = 'R00thMick';
	$host = 'localhost';
	$database = 'tcf_overflow';

	// Make the connection:
	$dbc = @mysqli_connect ($host, $user, $pw, $database)
	OR die ('Could not connect to MySQL: ' . mysqli_connect_error() );

	// Set the encoding...
	mysqli_set_charset($dbc, 'utf8');
	//make the select query to get the set id
	$q = 'SELECT id FROM ' . $sport . ' WHERE set_name="' . addslashes($set) . '"
		  AND year="' . $year . '"';
	//run the query
	$r = @mysqli_query ($dbc, $q);
	$result = mysqli_fetch_object($r);
	if($r)
	{
		$id = $result->id;
	}
	else
	{
		// Debugging message:
		echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
	}//end of else where query did not run
	
	//set the database where the table will be added
	$database = 'tcf_checklist_' . $sport;
	
	// Make the connection:
	$dbc = @mysqli_connect ($host, $user, $pw, $database)
	OR die ('Could not connect to MySQL: ' . mysqli_connect_error() );
	
	//create a new table
	$q = 'CREATE TABLE ' . $sport . '_' . $id . ' LIKE template';
	//run the query
	$r = @mysqli_query ($dbc, $q);
	
	if ($r)//if the create table query ran ok display a message and insert the card info
	{
		echo '<center><b>The table ' . $sport . '_' . $id .	' was created for: ' . $year .
		' ' . $set . '</b></center>';
		//add the card info to the new table
		//build the sql statement
		$q = 'INSERT INTO ' . $sport . '_' . $id . '(set_id, qty, card_number, name, price_high, price_low)
			VALUES ';
			
		for($j = 0; $j < count($cardData); $j++)//add to the sql statement
		{
			//open the parentheses for each set of values
			$q = $q . "(";
			
			//add to the query
			$q = $q . "'" . $id . "', '" . 0 . "', '" . addslashes($cardData[$j]['cardNumber']) .
			"', '" . addslashes($cardData[$j]['cardName']) . "', '" . $cardData[$j]['high'] . 
			"', '" . $cardData[$j]['low'] . "')";
			//if there is another record, add a comma
			if($j < count($cardData) - 1 && count($cardData) > 1)
			{
				$q = $q . ",";
			}
		}
		//run the query
		$r = @mysqli_query ($dbc, $q);
		
		if ($r)//display a message indicating which set details were added
		{
			//update the tcf_overflow database
			$database = 'tcf_overflow';

			// Make the connection:
			$dbc = @mysqli_connect ($host, $user, $pw, $database)
			OR die ('Could not connect to MySQL: ' . mysqli_connect_error());
			
			//get the id number of the set
			$q = 'SELECT id FROM ' . $sport . ' WHERE year="' . $year . '" AND set_name="' . $set . '"';
			$r = @mysqli_query ($dbc, $q);//run the query
			if(!$r)//start if: the query didn't run
			{echo '<center><b>' . mysqli_error($dbc) . '</b></center>';}
			//fetch the result
			$result = mysqli_fetch_object($r);
			//save the id
			$id = $result->id;
			//make the update query
			$q = "UPDATE $sport SET details = 1 WHERE id=$id";
			//run the query
			$r = @mysqli_query ($dbc, $q);//run the query
			
			if($r)
			{
				echo '<center><b>All cards were successfully added!</b></center>';
			}
			else//start else: query didn't run
			{	
				// Debugging message:
				echo '<center><b>' . mysqli_error($dbc) . '</b></center>';
			}//end else: query didn't run
		}
		else//if it did not run OK
		{	
			// Debugging message:
			echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
		}
	}//end of if statement where new table was created
	else//start else: query didn't run
	{	
		// Debugging message:
		echo '<center><b>' . mysqli_error($dbc) . '</b></center>';
	}//end else: query didn't run
}//end of function
?>
</body>
</html>