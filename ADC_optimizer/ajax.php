<?php
session_start();
if(isset($_POST['save']))
{
	/* if($_POST['save'] == 'test')
	{
		echo 'Data received!';
	} */
	echo $_POST['save'];
}
?>