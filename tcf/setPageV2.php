<?php
session_start();
//create the header
include ('header.php');
echo '<body>';

$sport = $_SESSION['sport'];
$year = $_SESSION['year'];
$letter = $_SESSION['letter'];

		//table header
		echo '<table>
		<tr class="header">
		<td class="setCol_year"><b>Year</b></td>
		<td class="setCol_setPage"><b>Set</b></td>
		<td class="setCol_setPage"><b>Click a button to view the individual cards.</b></td>
		</tr>';

	for($i=0; $i < count($_SESSION['array']); $i++)
	{
		echo '<form method="post" action="detailsPageV2.php">
		<tr class="table">
		<td class="setCol_year">' . $_SESSION['array'][$i][1] . '</td>
		<td class="setCol_setPage">' . $_SESSION['array'][$i][2] . '</td>
		<td id="matchBackground"><input class="setButton_100" name="update" type="submit" 
			value="' . $sport . '_' . $_SESSION['array'][$i][0] . '" /></td>
		</tr>';
	}//end of for loop

	echo '</table></form>'; // Close the table and form
?>
</body>
</html>