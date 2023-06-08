<?php include './connectDatabase.php'; ?> 

<?php

header("Content-type: application/json; charset=utf-8;");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");

$body = json_decode(file_get_contents("php://input"), true);

$login = $password = $FirstName = $LastName = '';

$login = $body["login"];
$password = $body["password"];
$FirstName = $body["firstName"];
$LastName = $body["lastName"];
$Avatar = $body["avatar"];


if (!empty($login) && !empty($password) && !empty($FirstName) && !empty($LastName) && !empty($Avatar)) {
  // Make sure login doesn't already exist
  $sql = "SELECT * FROM Users WHERE Login = '$login'";  //log in the user

  $result = $conn->query($sql);   //run the query

  if($row = $result->fetch_assoc())
  {
    $res = array('Error' => "User '$login' already exists.", 'createdUser' => 'false');
    
    echo json_encode( $res );
  }
  else
  {
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $sql = "INSERT INTO Users (FirstName, LastName, Login, Password, Avatar) VALUES ('$FirstName', '$LastName', '$login', '$hash', '$Avatar')";
  
    if ($conn->query($sql) === TRUE) {
  
    $final = array('FirstName' => $FirstName, 'LastName' => $LastName, 'Login' => $login, 'Password' => $password, 'createdUser' => 'true');
  
    echo json_encode($final);
     
    } else {
  
      $res = array('Error' => 'Database connection error', 'createdUser' => 'false');
        
      echo json_encode( $res );
    }
  }

  $conn->close();
    
} else {
  $res = array('Error' => 'at least one of the input is empty', 'Login' => $login, 'Password' => $password, 'FirstName' => $FirstName, 'LastName' => $LastName);
  
  echo json_encode( $res );
}
?>

