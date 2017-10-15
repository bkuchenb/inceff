<?php
function sanitize_string($var){
    if(get_magic_quotes_gpc()){
        $var = stripslashes($var);
    }
    $var = htmlentities($var);
    $var = strip_tags($var);
    return $var;
}

function sanitize_mysql($var){
    $var = mysql_real_escape_string($var);
    $var = sanitze_string($var);
    return $var;
}

function create_sport_buttons(){
	echo'
				<div class="first_button_row">
					<input name="sport" class="xlarge green button" type="submit" value="Baseball" />
					<input name="sport" class="xlarge green button" type="submit" value="Football" />
					<input name="sport" class="xlarge green button" type="submit" value="Basketball" />
					<input name="sport" class="xlarge green button" type="submit" value="Hockey" />
				</div>
				<div>
					<input name="sport" class="xlarge green button" type="submit" value="Nonsports" />
					<input name="sport" class="xlarge green button" type="submit" value="Multisport" />
					<input name="sport" class="xlarge green button" type="submit" value="Racing" />
					<input name="sport" class="xlarge green button" type="submit" value="Wrestling" />
				</div>
				<div>
					<input name="sport" class="xlarge green button" type="submit" value="Soccer" />
					<input name="sport" class="xlarge green button" type="submit" value="Golf" />
					<input name="sport" class="xlarge green button" type="submit" value="Magic" />
					<input name="sport" class="xlarge green button" type="submit" value="YuGiOh" />
				</div>
				<div>
					<input name="sport" class="xlarge green button" type="submit" value="Pokemon" />
					<input name="sport" class="xlarge green button" type="submit" value="Gaming" />
					<input name="sport" class="xlarge green button" type="submit" value="Diecast" />
					<input name="sport" class="xlarge green button btn_hidden" type="submit" value="Diecast" />
				</div>';
}

function create_year_buttons(){
	//Create the buttons.
	for($i = 1960; $i < 2020; $i++){
		if($i <= 2016){
			if($i == 1960){
				echo'
				<div class="first_button_row">';
			}
			elseif(substr(strval($i), -1) == '0'){
				echo'
				<div>';
			}
			echo'
					<input name="year" type="submit" class="large green button" value="' . $i . '" />';
			if(substr(strval($i), -1) == '9'){
				echo'
				</div>';
			}
		}
		else{
			echo'
					<input name="year" type="submit" class="large green button btn_hidden" value="' . $i . '" />';
			if(substr(strval($i), -1) == '9'){
				echo'
				</div>';
			}
		}		
	}
}

function create_letter_buttons(){
	echo'
				<div class="first_button_row">';
	$letters = range('A', 'Z');
	for($i = 0; $i < 26; $i++){
		if($i <= 25){
			echo'
					<input name="letter" type="submit" class="medium green button" value="' . $letters[$i] . '" />';
		}
		if($letters[$i] == 'G' || $letters[$i] == 'N' || $letters[$i] == 'U'){
			echo'
				</div>
				<div>';
		}	
	}
	echo'
					<input name="letter" type="submit" class="medium green button btn_hidden" value="I" />
					<input name="letter" type="submit" class="medium green button" value="%" />
				</div>';
}
?>