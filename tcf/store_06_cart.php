<?php
//Include the head.
include ('store_000_head.php');
if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['update_qty'])){
    //Create a new array to store cards to be deleted.
    $delete = array();
	//Cycle through the data in the form and compare with $_SESSION['cart'].
	foreach($_SESSION['cart'] as $key => $entry){
		$qty = $entry['qty'];
		$qty_update = sanitize_string($_POST[$entry['card_id']]);
		//Validate the form input
		if(is_numeric($qty_update)){
			if($qty_update != $qty){
				//Adjust the quantity to qty in stock.
				if($qty_update > $entry['total_qty']){
					$qty_update = $qty;
				}
				elseif($qty_update == 0){
					array_push($delete, $key);
				}
				else{
					$_SESSION['cart'][$key]['qty'] = $qty_update;
				}
			}
		}
	}
    //Delete the cards where qty was set to 0.
    foreach($delete as $value){
        unset($_SESSION['cart'][$value]);
    }  
}//End of if statement that checks to see if the cart was updated.
//Include the header and table.
include ('store_00_header.php');
echo'
<body>
	<div class="container_03">
		<div class="body_left_cards">
		</div>
		<div class="body_center">
			<form method="POST" action="store_06_cart.php">';
//Create a variable to hold the total due.
$total = 0.00;
foreach($_SESSION['cart'] as $entry){
	//Get the table name and card_id.
	$set_table = $entry['set_table'];
	$card_id = $entry['card_id'];
	//Get the rest of the information for the card.
	$q = "SELECT *
		  FROM $set_table
		  WHERE card_id = $card_id";
	//Run the query.
	$r = @mysqli_query ($dbc, $q);
	//If it runs okay, display the records.
	if ($r){
		//Fetch the results.
		while($row = mysqli_fetch_array($r, MYSQLI_ASSOC)){
			//Update the total due.
			$total = $total + ((float)$row['cond_price'] * $entry['qty']);
			//Calculate the subtotal.
			$subtotal = number_format(($entry['qty'] * (float)$row['cond_price']), 2, '.', ','); 
			echo'
				<div class="card">
					<div class="image">
						<img class="thumb" name="front" id="' . $row['card_id'] . '"
							src="' . $row['img_front'] . '" />
					</div>
					<div class="card_info">
						<div class="card_info_text">
							<span>' . $entry['year'] . '</span>
							<span>' . $entry['set_name'] . '</span>
						</div>
						<div class="card_info_text">
							<section class="section section_width_100">In Stock: ' . $row['quantity'] . '</section>
							<section class="section section_width_135">Price: $' . $row['cond_price'] . '</section>
						</div>
						<div class="card_info_text">
							<span>' . $row['card_number'] . '</span>
							<span>' . $row['name'] . '</span>
						</div>
						<div class="card_info_text">
							<section class="section section_width_100">In Cart: ' . $entry['qty'] . '</section>
							<section class="section section_width_135">Subtotal: $' . $subtotal . '</section>
						</div>
						<div class="card_info_text">
							<span>Condition: ' . $row['cond'] . '</span>
						</div>
						<div class="card_info_text">
							<section class="section section_width_100">
								<input class="text_box_qty" name="' . $row['card_id'] . '" type="text" autocomplete="off" />
							</section>
							<section class="section section_width_135">
								<input name="update_qty" type="submit" value="Update Cart" />
							</section>
						</div>
					</div>
				</div>';
		}//End of while statement that displays the results.
	}//End of if statement, the query ran okay.
	else{
		echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
		echo '<br>There was a problem finding what you requested.<br>';
	}
}//End of foreach loop that cycles throught the cart.
echo'
			</form>
		</div>
		<div class="body_right_cards">
			<b>Cart Total: $' . number_format($total, 2, '.', ',') . '</b>
		</div>
	</div>
</body>
</html>';
?>