<?php
//Include the head.
include ('store_000_head.php');
//Create the header.
if(isset($_GET['year'])){
	$_SESSION['year'] = $_GET['year'];
}
//Include the header.
include ('store_00_header.php');
echo'
<body>
	<div class="container_03">
		<div class="body_left">
		</div>
		<div class="body_center">
			<form method="get" action="store_04_results.php" class="align_center">';
//Create the letter buttons.
create_letter_buttons();	
echo'
			</form>
		</div>
		<div class="body_right">
		</div>
	</div>
</body>
</html>';
?>