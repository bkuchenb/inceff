//Get all the form elements.
var elem_form = document.getElementsByTagName('FORM');
//If the logout button is present, hide the button and the message.
if(elem_form[0].contains(document.getElementById('logout_btn'))){
	//Remove the Log out button.
	elem_form[0].removeChild(document.getElementById('logout_btn'));
	//Remove the welcome message.
	elem_form[0].removeChild(document.getElementById('welcome'));
	//Hide the Submit button.
	document.getElementById('btn_submit').style.visibility = 'hidden';
	//Display the Login button.
	btn_login = document.createElement('INPUT');
	btn_login.className = 'navbar_button';
	btn_login.id = 'login_btn';
	btn_login.name = 'choice';
	btn_login.type = 'submit';
	btn_login.value = 'Log in';
	elem_form[0].appendChild(btn_login);
	//Remove the admin button if it is displayed.
	if(elem_form[1].contains(document.getElementById('btn_admin'))){
		elem_form[1].removeChild(document.getElementById('btn_admin'));
	}
}
//Check to see if the email element is present.
if(document.body.contains(document.getElementById('email'))){
	//Save the email text box element.
	input_email = document.getElementById('email');
	//Set the focus to the email text box.
	input_email.focus();
	//Add an event listener to the email.
	input_email.addEventListener('blur', function(event){
	event.preventDefault();
	//Check to see if this user already exists.
	check_email(input_email.value);
}, false);
}


function check_email(email){
	var xhttp = new XMLHttpRequest();
	var post_data = 'email=' + email;
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState == 4 && xhttp.status == 200){
			//Get the response from ajax.
			var email_exists = xhttp.responseText;
			//Check to see if sign up was clicked.
			var sign_up = document.body.contains(document.getElementById('first_name'));
			if(email_exists && sign_up){
				//Get the password section element.
				section_password = document.getElementById('section_password');
				//Make the text in this element red.
				section_password.style.color = 'red';
				//Display a message to the user to log in.
				section_password.innerHTML = 'A user with that email already exists.<br>Click "Log in" instead.';
			}
		}
	}
	xhttp.open('POST', 'store_001_get_email.php', true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhttp.send(post_data);
}