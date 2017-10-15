<link href="css/tcf_buttons.css" rel="stylesheet" />
<?php
session_start();
//add the sport choosen from the first page to the SESSION array
if(isset($_GET['sport']))
{
	$_SESSION['sport'] = $_GET['sport'];
}
//create the header
include ('header.php');
?>
<body>
<p>
<form method="get" action="letterPageV2.php" style='text-align: center;'>
<?php
$counter = 0;//create a counter to put paragraph breaks between the rows
for($i = 1960; $i < 2020; $i++)
{
	if($counter == 10)
	{
		$counter = 0;
		echo '</p><p>';
	}
	
	if($i <= 2017)
	{
		echo '<input name="year" type="submit" class="medium blue button" value="' . $i . '" />';
	}
	else
	{
		echo '<input id="hiddenB" name="year" type="submit" class="medium blue button" value="' . $i . '" />';
	}
	$counter++;
}
//echo '<input name="year" type="submit" class="medium blue button" value="%" />';
?>
</p>
</form>
</body>
</html>