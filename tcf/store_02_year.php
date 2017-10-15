<?php
//Include the head.
include ('store_000_head.php');
//Create the header.
if(isset($_GET['sport'])){
	$_SESSION['sport'] = $_GET['sport'];
}
//Include the header.
include ('store_00_header.php');
echo'
<body>
	<div class="container_03">
		<div class="body_left">
		</div>
		<div class="body_center">
			<form method="get" action="store_03_letter.php" class="align_center">';
//Create the year buttons.
create_year_buttons();
echo'
			</form>
		</div>
		<div class="body_right">
		</div>
	</div>
</body>
</html>';
?>