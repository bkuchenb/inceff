<?php
//Start a session to save data.
session_start();
//Include store functions.
include ('store_000_functions.php');
//Connect to the correct database.
require ('store_db2_connect.php');

if(isset($_POST['email'])){
	//Create flag.
	$email_exists = false;
	//Sanitize the user input.
	$email = sanitize_string($_POST['email']);
	//Add slashes to the email.
	$email = mysqli_real_escape_string($dbc2, $email);
	//Query the database to see if the email exists.
	$q = 'SELECT *
	  FROM Users
	  WHERE email="' . $email . '"
	  LIMIT 1';
	//Run the query.
	$r = mysqli_query($dbc2, $q);
	//If it runs okay, return the value.
	if($r){
		//Fetch the results.
		$row = mysqli_fetch_array($r, MYSQLI_ASSOC);
			//Save the user info.
			$user_info = $row;
			//If the email was found check to see if the password matches.
			if(isset($row['email'])){
				$email_exists = true;
			}
	}
	echo $email_exists;
}	
?>