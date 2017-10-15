<?php
//Connect to the inceff database.
require('mysqli_connect2.php');

if(isset($_POST['category']) && isset($_POST['year']) && isset($_POST['letter']))
{
	//Check to see if % was the chosen letter.
	if($_POST['letter'] == '%'){
		//Return all sets in inventory for the given category and year.
		$letter = '\''. $_POST['letter']. '\'';
	}
	else{
		$letter = '\''. $_POST['letter']. '%\'';
	}
	//Create the query.
	$q = 'SELECT *
		  FROM tcf_sets
		  WHERE set_year = "' . $_POST['year'] . '" AND category = "' . $_POST['category'] . '"
		  AND set_name LIKE ' . $letter . ' 
		  ORDER BY set_year ASC, set_name ASC';
	//Run the query
	$r = @mysqli_query($dbc, $q);
	//If the query runs ok, return the records.
	if($r){
		//Create an array to store the results.
		$data = array();
		//Cycle through the results and add them to the array.
		while($row = mysqli_fetch_array($r, MYSQLI_ASSOC)){
			array_push($data, $row);
		}
		// Set the database access information as constants:
		DEFINE ('DB_USER2', 'bk00chenb');
		DEFINE ('DB_PASSWORD2', 'NR8A*Ecb*');
		DEFINE ('DB_HOST2', 'inceff.ctlel9cvjtqf.us-west-2.rds.amazonaws.com');
		DEFINE ('DB_NAME2', 'inceff');

		// Make the connection:
		$dbc = @mysqli_connect(DB_HOST2, DB_USER2, DB_PASSWORD2, DB_NAME2)
		OR die ('Could not connect to MySQL: ' . mysqli_connect_error());
		//Get the sales data for each set.
		for($i = 0; $i < count($data); $i++){
			//Create the query.
			$q = 'SELECT SUM(total) as total
			  FROM tcf_orderdetails
			  WHERE sport = "' . $data[$i]['category'] . '" AND year = "' . $data[$i]['set_year'] . 
			  '" AND setName = "' . $data[$i]['set_name'] . '"';
			//Run the query.
			$r2 = @mysqli_query($dbc, $q);
			//If the query runs ok, return the records.
			if($r2){
				//Fetch the results.
				$row = mysqli_fetch_array($r2, MYSQLI_ASSOC);
				$data[$i]['total'] = $row['total'];
			}
			else{
				echo mysqli_error($dbc) . ' Query: ' . $q;
			}
		}
		//Return the data.
		echo json_encode($data);
	}	
	else{
		echo mysqli_error($dbc) . ' Query: ' . $q;
	}
	$r->close();
	$dbc->close();
}
?>