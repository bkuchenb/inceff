<link href="css/tcf_sport_buttons.css" rel="stylesheet" />
<?php
session_start();
$_SESSION['sport'] = '';
$_SESSION['year'] = '';
$_SESSION['letterClicked'] = '';
$_SESSION['set'] = '';
//Create the header.
include('header.php');
?>
<body>
<p>
<form method="get" action="yearPageV2.php" style='text-align: center;'>
<input name="sport" class="xlarge blue button" type="submit" value="Baseball" />
<input name="sport" class="xlarge blue button" type="submit" value="Football" />
<input name="sport" class="xlarge blue button" type="submit" value="Basketball" />
<input name="sport" class="xlarge blue button" type="submit" value="Hockey" />
</p>
<p>
<input name="sport" class="xlarge blue button" type="submit" value="Nonsports" />
<input name="sport" class="xlarge blue button" type="submit" value="Multisport" />
<input name="sport" class="xlarge blue button" type="submit" value="Racing" />
<input name="sport" class="xlarge blue button" type="submit" value="Wrestling" />
</p>
<p>
<input name="sport" class="xlarge blue button" type="submit" value="Soccer" />
<input name="sport" class="xlarge blue button" type="submit" value="Golf" />
<input name="sport" class="xlarge blue button" type="submit" value="Magic" />
<input name="sport" class="xlarge blue button" type="submit" value="YuGiOh" />
</p>
<p>
<input name="sport" class="xlarge blue button" type="submit" value="Pokemon" />
<input name="sport" class="xlarge blue button" type="submit" value="Gaming" />
<input name="sport" class="xlarge blue button" type="submit" value="Diecast" />
<input id="hiddenB" name="sport" class="xlarge blue button" type="submit" value="Diecast" />
</p>
</form>
</body>
</html>