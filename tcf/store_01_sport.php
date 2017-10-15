<?php
//Include the head.
include ('store_000_head.php');
//Initialize variables that will be used to manage which buttons are displayed.
$_SESSION['email_found'] = false;
$_SESSION['password_found'] = false;
$_SESSION['valid_email'] = true;
if(!isset($_SESSION['logged_in'])){
	$_SESSION['logged_in'] = false;
}

//Empty the cart if the button was clicked.
if($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['empty'])){
	$_SESSION['cart'] = array();
}
if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['email'])
	&& isset($_POST['password'])){
	//Connect to the TCFonlineStore database.
	require ('store_db2_connect.php');
	//Get the choice the user made.
	$choice = $_SESSION['choice'];
	//Sanitize the user input.
	$email = sanitize_string($_POST['email']);
	$password = sanitize_string($_POST['password']);
	if(isset($_POST['first_name'])){
		$first_name = sanitize_string($_POST['first_name']);
	}
	if(isset($_POST['last_name'])){
		$last_name = sanitize_string($_POST['last_name']);
	}
	
	//Add slashes to the email.
	$email = mysqli_real_escape_string($dbc2, $email);
	//Validate the email. If it isn't in the proper format, set a flag.
	if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
		$_SESSION['valid_email'] = false;
	}
	else{
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
			if(isset($row['email']) && $row['email'] != ''){
				$_SESSION['email_found'] = true;
				//If the password matches log the user in.
				if($row['password']){
					$_SESSION['password_found'] = true;
				}
			}
			//Free up the resources.
			mysqli_free_result ($r); 
		}
		else{
			//Print an error message.
			echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
			echo '<br>There was a problem finding what you requested.<br>';
		}
	}
	//Process the user request.
	//If login was clicked and the password is correct, log the user in.
	if($choice == 'Log in' && $_SESSION['email_found'] == true
		&& $_SESSION['password_found'] == true){
			$_SESSION['logged_in'] = true;
			$_SESSION['user_info'] = $user_info;
	}
	//If sign up was clicked add the user to the database.
	elseif($choice == 'Sign up' && $_SESSION['email_found'] == false){
		//Add the email and password to the database.
		$q = 'INSERT INTO Users(email, password, first_name, last_name, user_type)
			  VALUES("' . $email . '","' . $password . '","' . $first_name . '","' . $last_name .'", "guest")';
		//Run the query.
		$r = mysqli_query ($dbc2, $q);
		if($r){
			$_SESSION['logged_in'] = true;
			//Save the email and first name.
			$_SESSION['user_info']['email'] = $email;
			$_SESSION['user_info']['first_name'] = $first_name;
		}
		else{
			//Print an error message.
			echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
			echo '<br>There was a problem finding what you requested.<br>';
		}
	}
}
//Initialize the variables that the user will choose.
$_SESSION['sport'] = '';
$_SESSION['year'] = '';
$_SESSION['letterClicked'] = '';
$_SESSION['set_name'] = '';
//Include the header.
include ('store_00_header.php');
echo'
<body>
	<div class="container_03">
		<div class="body_left">
		</div>
		<div class="body_center">
			<form method="get" action="store_02_year.php" class="align_center">';
//Create the sport buttons.
create_sport_buttons();
echo'
			</form>
		</div>
		<div class="body_right">
		</div>
	</div>
</body>
</html>';
?>