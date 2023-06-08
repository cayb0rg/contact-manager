<?php include './connectDatabase.php'; ?> 


<?php




$body = json_decode(file_get_contents("php://input"), true);

// $Login = $Password = '';
// $Login = $body["Login"];
// $Password = $body["Password"];

$id = $body['userId'];


if (!empty($id)) {
  
    $sql = "DELETE FROM Users WHERE ID = '$id'";
    
    if (mysqli_query($conn, $sql)) {  
            
      $res = array("deleted ID" => $id, 'Deletion' => "true");

      echo json_encode( $res );
      
    } else {
      
      $res = array("deleted ID" => $id, 'Deletion' => "false");
      
      echo json_encode($res);
    }
  }
  else{
    $res = array('Error' => 'at least one of the input is empty', 'UserID' => $id);
    
    echo json_encode( $res );
  }
  
  //$conn->close();
?>

