<?php
//Start a session to retrieve data.
session_start();

if(isset($_POST['view'])){
	if($_POST['view'] == 'front'){
		echo $_SESSION['array'][$_POST['index']]['img_front'];
	}
	else{
		echo $_SESSION['array'][$_POST['index']]['img_back'];
	}
}
?>