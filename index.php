<?
if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
  $file = '/tmp/sample-app.log';
  $message = file_get_contents('php://input');
  file_put_contents($file, date('Y-m-d H:i:s') . " Received message: " . $message . "\n", FILE_APPEND);
}
else
{
?>
<!DOCTYPE html>
<html lang="en-US">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>Increase Efficiency</title>
	<meta name="viewport" content="width=device-width">
	<!--[if IE]><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
	<link rel="stylesheet" href="css/style.css"  type="text/css" media="screen">
	<link rel="stylesheet" href="css/style_print.css" type="text/css" media="print">
</head>
<header>
	<div id="container_01">
		<div id="temp1" class="temp"></div>
		<div id="temp2" class="temp"></div>
		<div id="header_center">
			<div class="logo" id="title">Increase-Efficiency</div>
			<div class="logo" id="admin"></div>
		</div>
		<div id="temp3" class="temp"></div>
		<div id="temp4" class="temp"></div>
	</div>
	<div id="container_02">
		<nav id="navbar">
			<button id="btn_login">Log In</button>
		</nav>
	</div>
</header>
	<div id="container_03">
		<div id="body" class="body_center">
			<a href="http://www.increase-efficiency.net/ADC_optimizer">ADC Optimizer</a>
		</div>
	</div>
	<script src="inceff.js" type="text/javascript"></script>
</body>
</html>
<? 
} 
?>
