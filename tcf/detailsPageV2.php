<?php
session_start();

if(isset($_POST['update']))
{
	//set $filter to zero
	//the first time Qty is clicked it filters out cards with qty = 0
	$filter = 0;
	//the first time High is clicked it sorts in DESC order
	$sort = 'DESC';
	$sport = strtolower($_SESSION['sport']);//get the sport chosen
	$year = $_SESSION['year'];
	$letter = ':';//remove the letter chosen
	$_SESSION['letterClicked'] = $letter;//save over letter chosen with :
	
	//get the id of the set
	$id = substr($_POST['update'], stripos($_POST['update'], "_") + 1);
	//get the set_name from the tcf_overflow database
	$user = 'Mickey';
	$pw = 'R00thMick';
	$host = 'localhost';
	$database = 'tcf_overflow';

	// Make the connection:
	$dbc = @mysqli_connect ($host, $user, $pw, $database)
	OR die ('Could not connect to MySQL: ' . mysqli_connect_error() );
	//make the select query
	$q = 'SELECT set_name, year FROM ' . $sport . ' WHERE id="' . $id . '"';
	//run the query
	$r = @mysqli_query ($dbc, $q);
	//fetch the results
	$result = mysqli_fetch_object($r);
	if($r)//if the query ran ok
	{
		$_SESSION['set'] = $result->set_name;
		$_SESSION['year'] = $result->year;
	}
	else
	{
		// Debugging message:
		echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
	}//end of else where query did not run
	// Set the encoding...
	mysqli_set_charset($dbc, 'utf8');
	
	//get the table name from the $_POST array
	$table = $_POST['update'];
	//save the table in the $_SESSION array
	$_SESSION['table'] = $table;
}//end if: set was chosen to display details

//make the query based on what column header gets clicked
if($_SERVER['REQUEST_METHOD'] == 'GET')
{
	$table = $_SESSION['table'];
	$sport = $_SESSION['sport'];
		
	if(isset($_GET['filter']))//qty has been clicked
	{
		$sort = 'DESC';
		if($_GET['filter'] == 0)//limit results with zero qty
		{
			$q = "SELECT * FROM $table WHERE quantity=0 ORDER BY card_id ASC";
			$filter = 1;
		}//end if: filter results
		else//don't filter qty
		{
			$q = "SELECT * FROM $table";
			$filter = 0;
		}//end else: don't filter qty
		
	}//end if: qty was clicked
	if(isset($_GET['sort']))//high price was clicked
	{
		$filter = 0;
		if($_GET['sort'] == 'DESC')
		{
<<<<<<< HEAD
			$q = "SELECT * FROM $table ORDER BY price_1 DESC, card_id ASC";
=======
			$q = "SELECT * FROM $table ORDER BY price DESC, card_id ASC";
>>>>>>> 64dbf5732aebd0d4e8d5189086c99a6a33289524
			$sort = 'ASC';
		}
		else
		{
<<<<<<< HEAD
			$q = "SELECT *  FROM $table ORDER BY price_1 ASC, card_id ASC";
=======
			$q = "SELECT *  FROM $table ORDER BY price ASC, card_id ASC";
>>>>>>> 64dbf5732aebd0d4e8d5189086c99a6a33289524
			$sort = 'DESC';
		}	
	}//end if: high price was clicked
}//end if: results have been filtered or sorted
else
{
	$table = $_SESSION['table'];
	$sport = $_SESSION['sport'];
	$q = "SELECT *  FROM $table";
	$filter = 0;
}

//////////////////////////////////////////////////////////
//create the header
include ('header.php');
echo '<body>';
//////////////////////////////////////////////////////////
//update quantity and prices if they are changed
if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['submit']))
{
	$sort = 'DESC';
	$filter = 0;
	$table = $_SESSION['table'];
	for($j = 0; $j < count($_SESSION['details']); $j++)
	{
		$num = $_SESSION['details'][$j][0];
		$qty_update = htmlspecialchars($_POST['data2'][$_SESSION['details'][$j][0]]['qty']);
		$p1_update = htmlspecialchars($_POST['data2'][$_SESSION['details'][$j][0]]['p1']);
		$p2_update = htmlspecialchars($_POST['data2'][$_SESSION['details'][$j][0]]['p2']);
	
	
		//validate the form input
		if(is_numeric($qty_update) &&
			is_numeric($p1_update) &&
			is_numeric($p2_update))
		{
			if($qty_update != $_SESSION['details'][$j][1] || $p1_update != $_SESSION['details'][$j][6] || 
				$p2_update != $_SESSION['details'][$j][7])//make the query:
			{
<<<<<<< HEAD
				$q = "UPDATE $table SET quantity=$qty_update, price_1=$p1_update, price_2=$p2_update WHERE card_id=$num";
=======
				$q = "UPDATE $table SET quantity=$qty_update, price=$p1_update, cond_price=$p2_update WHERE card_id=$num";
>>>>>>> 64dbf5732aebd0d4e8d5189086c99a6a33289524
				//run the query
				$r = @mysqli_query ($dbc, $q);
				if($r)
				{echo '<center>' . $_SESSION['details'][$j][4] . ' ' . $_SESSION['details'][$j][5] . ' has been updated.</center>';}
			}//end of if statement that checks to see if the data has been changed
		}//end of if statement that checks if the form data is a number
		else
			{echo '<center>Error: non-numeric value entered.</center>';}
	}//end of for statement that cycles through the form data		
}//end if statement that checks to see if the form was submitted

//connect to the correct database
$user = 'Mickey';
$pw = 'R00thMick';
$host = 'localhost';
$database = 'tcf_inventory_' . $sport;

// Make the connection:
$dbc = @mysqli_connect ($host, $user, $pw, $database)
OR die ('Could not connect to MySQL: ' . mysqli_connect_error());

// Set the encoding...
mysqli_set_charset($dbc, 'utf8');

//run the query
$r = @mysqli_query ($dbc, $q);
//if it runs ok, display the records
if ($r)
{
	//table header
	echo '<table>
	<tr class="header">
	<td class="setCol_qty"><b><a href="/detailsPageV2.php?filter=' . $filter .'&sport=' .
	$sport . '">Qty</a></b></td>
	<td class="setCol_year"><b>Year</b></td>
	<td class="setCol_detailsPage"><b>Set</b></td>
	<td class="setCol_cardNum"><b>#</b></td>
	<td class="setCol_detailsPage"><b>Name</b></td>
	<td class="setCol_price"><b><a href="/detailsPageV2.php?sort=' . $sort . '&sport=' .
	$sport . '">High</a></b></td>
	<td class="setCol_price"><b>Low</b></td>
	<td class="setCol_submitHeading"><b>Submit</b></td>
	</tr>';
	//create a 2 dimmensional array to store the results of the query
	$resultsArray = array();
	$resultsRow = array();
	//initailize the counter
	$counter = 0;
	//fetch and process the query results
	while ($row = mysqli_fetch_array($r, MYSQLI_ASSOC))
	{	
	  //store the query results in the resultsRow array
	  $resultsRow[0] = $row['card_id'];
	  $resultsRow[1] = $row['quantity'];
	  $resultsRow[4] = $row['card_number'];
	  $resultsRow[5] = $row['name'];
	  $resultsRow[6] = $row['price'];
	  $resultsRow[7] = $row['cond_price'];
	  //add the resultsRow array to the resultsArray
	  $resultsArray[$counter] = $resultsRow;	  
	  //update the counter
	  $counter++;
	}//end while statement

	//add the results array to the session array
	$_SESSION['details'] = $resultsArray;
	//display the results
	for($i=0; $i < count($resultsArray); $i++)
	{
	  echo '<form method="post" action="detailsPageV2.php">
	  <tr class="table">
	  <td id="matchBackground"><input class="setInputWidth_80" name="data2[' . $resultsArray[$i][0] . '][qty]" type="text"
	  value="' . $resultsArray[$i][1] . '"</td>' .
	  '<td class="setCol_year">' . $_SESSION['year'] . '</td>
	  <td class="setCol_detailsPage">' . $_SESSION['set'] . '</td>
	  <td class="setCol_cardNum">' . $resultsArray[$i][4] . '</td>
	  <td class="setCol_detailsPage">' . $resultsArray[$i][5] . '</td>
	  <td id="matchBackground"><input class="setInputWidth_90" name="data2[' . $resultsArray[$i][0] . '][p1]" type="text"
	  value="' . $resultsArray[$i][6] . '"</td>
	  <td id="matchBackground"><input class="setInputWidth_90" name="data2[' . $resultsArray[$i][0] . '][p2]" type="text"
	  value="' . $resultsArray[$i][7] . '"</td>
	  <td id="matchBackground"><input class="input.setButton_Submit" name="submit" type="submit" value="Submit" /></td>
	  </tr>';
	}//end of for loop

	echo '</table></form>'; // Close the table and form
	mysqli_free_result ($r); // Free up the resources.	
}//end of if statement that checks to see if the query ran ok
 else 
{
	// Debugging message:
	echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
}//end of else where query did not run
?>
</body>
</html>