<?php include './connectDatabase.php'; ?> 

<?php

header("Content-type: application/json; charset=utf-8;");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");

$body = json_decode(file_get_contents("php://input"), true);

$login = $password = '';

$login = $body["login"];
$password = $body["password"];

if (!empty($login) && !empty($password)) {
	
    $sql = "SELECT * FROM Users WHERE Login = '$login'";  //log in the user

    $result = $conn->query($sql);   //run the query

    
    if( $row = $result->fetch_assoc()  )
    {
	if (password_verify($password, $row['Password']))
	{
        	$res = array("id" => $row['ID'], "firstName" => $row['FirstName'], "lastName" => $row['LastName'], "avatar" => $row['Avatar'], "userName" => $row['Login']);
        	echo json_encode($res);
	}
	else
	{
		$res = array("result" => "Incorrect username/password", 'Login' => $login);
		echo json_encode($res);
	}    
    }
    else
    {
        $res = array("result" => "no User found", 'Login' => $login);
		echo json_encode($res);
    }
    
    $conn->close();
  
  }else{

    $res = array('Error' => 'at least one of the input is empty', 'Login' => $login, 'Password' => $password);
    
    echo json_encode( $res );
    
  }
?>
