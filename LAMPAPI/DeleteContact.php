<?php include './connectDatabase.php'; ?> 

<?php

header("Content-type: application/json; charset=utf-8;");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");

$body = json_decode(file_get_contents("php://input"), true);

$id = $body['id'];
// $firstName = $body['firstName'];
// $lastName = $body['lastName'];
$userId = $body['userId'];


if (!empty($id)) {
    $sql = "DELETE FROM Contacts WHERE ID = '$id' And UserID = '$userId'";
    
    if (mysqli_query($conn, $sql)) {  
            
      $res = array("deleted ID" => $id, 'Deletion' => "true");
      // $res = array("deleted ID" => $id, 'Deletion' => "true", 'FirstName' => $firstName, 'LastName' => $lastName);

      echo json_encode( $res );
      
    } else {
      
      $res = array("deleted ID" => $id, 'Deletion' => "false");
      // $res = array("deleted ID" => $id, 'Deletion' => "false", 'FirstName' => $firstName, 'LastName' => $lastName);
      
      echo json_encode($res);
    }
  }
  else{
    $res = array('Error' => 'Have to specify ID', 'Contact ID' => $id, 'UserID' => $userId);
    // $res = array('Error' => 'Have to specify ID', 'Contact ID' => $id, 'FirstName' => $firstName, 'LastName' => $lastName, 'UserID' => $userId);
    
    echo json_encode( $res );
  }
  
  //$conn->close();
?>

