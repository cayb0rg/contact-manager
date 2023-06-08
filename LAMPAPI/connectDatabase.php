<?php

$servername = "localhost";
$username = "Fei";
$password = "fei";
$dbname = "COP4331";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);


// Check connection
if ($conn->connect_error) {
	echo json_encode(array('connetion to database' => 'false'));
	return;
}

?>

