<link href="css/tcf_letter_buttons.css" rel="stylesheet" />
<?php
session_start();
//add the year choosen from the previous page to the SESSION array
if(isset($_GET['year']))
{
	$_SESSION['year'] = $_GET['year'];
}
//create the header
include ('header.php');
?>
<body>
<p>
<form method="get" action="resultsPageV2.php" style='text-align: center;'>
<?php
$counter = 0;//create a counter to put paragraph breaks between the rows
$letters = range('A', 'Z');
for($i = 0; $i < 26; $i++)
{
	if($counter == 7)
	{
		$counter = 0;
		echo '</p><p>';
	}
	
	if($i <= 25)
	{echo '<input name="letter" type="submit" class="medium blue button" value="' . $letters[$i] . '" />';}
	$counter++;
}
	echo '<input id="hiddenB" name="letter" type="submit" class="medium blue button" value="I" />';
	echo '<input name="letter" type="submit" class="medium blue button" value="%" />';
?>
</p>
</form>
</body>
</html>