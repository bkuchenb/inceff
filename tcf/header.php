<!DOCTYPE html>
<html lang="en-US">
<head>
	<title>TCF Overflow Inventory</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	
	<!--
	<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
	-->
	<link type="text/css" href="css/style.css" rel="stylesheet" media="screen">
	<link href="css/tcf_header.css" rel="stylesheet" />
	<link href="css/tcf_table.css" rel="stylesheet" />
	<style>
	#hiddenB
		{
			visibility: hidden;
		}
	</style>
</head>
<header>
	<div class="logo">
		<button class="tcf_header" type="submit" onclick="window.location.href='sportPageV2.php'" />
	</div>
	<div class="navBar">
		<ul>
			<li><a href="sportPageV2.php"><?php echo $_SESSION['sport']; ?></a></li>
			<li><a href="yearPageV2.php"><?php echo $_SESSION['year']; ?></a></li>
			<li><a href="letterPageV2.php"><?php echo $_SESSION['letterClicked']; ?></a></li>
			<li><a href=""><?php echo $_SESSION['set']; ?></a></li>
		</ul>
	</div>
</header>