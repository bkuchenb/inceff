<!DOCTYPE html>
<html lang="en-US">
<head>
	<title>Beckett Order Dashboard</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	
	<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
	<link href="css/tcf_header.css" rel="stylesheet" />
	<link href="css/tcf_table.css" rel="stylesheet" />
	<style>
		#btnCol
		{
			background:#008000;
			color: white;
		}
		#btnCol:hover
		{
			background:#006600;
		}
		body
		{
			background-color: #bbff99;
			padding-top:260px;
		}
		div.infoTable
		{
			width: 85%;
			margin: auto;
			border: 1px solid black;
		}
		div#cardData
		{
			width: 95%;
			margin: auto;
			border: none;
		}
		table#cardData
		{
			border: none;
		}
		td
		{
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		td.expand
		{
			width: 15%
		}
		textarea
		{
			width: 100%;
			height: 300px;
			margin: auto;
		}
	</style>
</head>
<header>
    <div class="logo">
        <button class="tcf_header" type="submit" onclick="window.location.href='beckettOrdersHeader.php'" />
	</div>
	<div class="navBar">
	<p><center>
        <button id="btnCol" type="button" class="btn btn-lg" onclick="window.location.href='orders.php'">Orders</button>
        <button id="btnCol" type="button" class="btn btn-lg" onclick="window.location.href='customers.php'">Customers</button>
        <button id="btnCol" type="button" class="btn btn-lg" onclick="window.location.href='orderDetails.php'">Order Details</button>
		<button id="btnCol" type="button" class="btn btn-lg" onclick="window.location.href='addOrderDetails_V2.php'">Add Orders</button>
		<button id="btnCol" type="button" class="btn btn-lg" onclick="window.location.href='addEbayOrderDetails.php'">Add Ebay Orders</button>
		<button id="btnCol" type="button" class="btn btn-lg" onclick="window.location.href='addSetDetails.php'">Add Beckett Inventory</button>
		<button id="btnCol" type="button" class="btn btn-lg" onclick="window.location.href='addSetChecklist.php'">Add Set Checklist</button>
    </center></p>
    <p><center>
        <button id="btnCol" type="button" class="btn btn-lg" onclick="window.location.href='weeklyTotals.php'">Sales Report: Income</button>
		<button id="btnCol" type="button" class="btn btn-lg" onclick="window.location.href='setTotals.php'">Sales Report: Sets</button>
		<button id="btnCol" type="button" class="btn btn-lg" onclick="window.location.href='playerTotals.php'">Sales Report: Players</button>
		<button id="btnCol" type="button" class="btn btn-lg" onclick="window.location.href='sportPageV2.php'">TCF Overflow</button>
    </center></p>
	</div>
</header>