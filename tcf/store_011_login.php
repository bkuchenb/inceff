<?php
//Include the head.
include ('store_000_head.php');
//Include the header.
include ('store_00_header.php');
if($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['choice'])){
	$choice = $_GET['choice'];
	$_SESSION['choice'] = $choice;
	//Create a message to the user that will change with the button clicked.
	$message = 'Please enter the following information to ' . strtolower($choice) . '.';
}
if($_SERVER['REQUEST_METHOD'] == 'GET' && $_GET['choice'] == 'Log out'){
	$choice = '';
	$_SESSION['logged_in'] = false;
	//Clear the user info.
	$_SESSION['user_info'] = array();
	$message = 'Visit us again soon.';
}
echo'
<body>
	<div class="container_03">
		<div class="body_left">
		</div>
		<div class="body_center">
			<section id="opening_message">' . $message . '</section>
			<form method="POST" action="store_01_sport.php">
				<div class="user_info_div">';
if($_SESSION['logged_in'] == false && ($choice == 'Sign up' || $choice == 'Log in')){
	echo'
					<section class="user_info" id="section_email">Email</section>
					<input class="user_info" name="email" id="email" type="text" />
					<section class="user_info" id="section_password">Password</section>
					<input class="user_info" name="password" id="password" type="password" />';
}
if($_SESSION['logged_in'] == false && $choice == 'Sign up'){
	echo'
					<section class="user_info">First Name</section>
					<input class="user_info" name="first_name" id="first_name" type="text" />
					<section class="user_info">Last Name</section>
					<input class="user_info" name="last_name" id="last_name" type="text" />';
}
echo'
					<section class="user_info">
					<input id="btn_submit" type="submit" value="Submit" /></section>
				</div>
			</form>
		</div>
		<div class="body_right">
		</div>
	</div>
<script type="text/javascript" src="store_002_scripts_login.js"></script>
</body>
</html>';
?>