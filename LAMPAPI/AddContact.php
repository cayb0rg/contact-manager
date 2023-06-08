<?php include './connectDatabase.php'; ?> 

<?php

header("Content-type: application/json; charset=utf-8;");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");

$body = json_decode(file_get_contents("php://input"), true);

$firstName = $body["firstName"];
$lastName = $body["lastName"];
$userId = $body["userId"];
$email = $body["email"];
$phone = $body["phone"];


if (!empty($userId) && !empty($firstName) && !empty($lastName) && !empty($email) && !empty($phone)) {


    $sql = "INSERT INTO Contacts (FirstName, LastName, UserID, Email, Phone) VALUES ('$firstName', '$lastName', '$userId', '$email', '$phone')"; 

    $result = $conn->query($sql);   //run the query

    if ($result) {
        $final = array('contactAdded' => 'true', 'FirstName' => $firstName, 'LastName' => $lastName, 'userId' => $userId, 'Email' => $email, 'Phone' => $phone);

        echo json_encode($final);
        
      } else {
        $final = array('contactAdded' => 'false');

        echo json_encode($final);
      }
      
      // $conn->close();
  
  }else{

    $res = array('Error' => 'at least one of the input is empty', 'FirstName' => $firstName, 'LastName' => $lastName, 'userId' => $userId, 'Email' => $email, 'Phone' => $phone);
    
    echo json_encode( $res );
  }
?>

