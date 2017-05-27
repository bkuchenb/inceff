<?php
include('coupa_00_header.php');
//Create a form that will return to order page on submit.
?>
<body>
	<div class="container_03">
		<div class="body_center">
			<form id="form_login" method="POST" action="coupa_00_order.php">
<?php
//Display message and fill form based on what button was clicked.
if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['login'])){
?>
				<h3>Please enter the following information to log in.</h3>
				<section>User Name<input id="login" name="login" type="text" />
				</section>
				<script>document.getElementById("login").focus();</script>
<?php
}
elseif($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['logout'])){
	//Save the local variable to the Session array.
	unset($_SESSION['user_type']);
?>
				<h3>Click the St. Peter\'s logo to create a new order.</h3>
				<script>
					document.getElementById("btn_logout").style.display = "none";
					document.getElementById("btn_admin").style.display = "none";
				</script>
<?php
}
?>
			</form>
		</div>
	</div>
</body>
</html>