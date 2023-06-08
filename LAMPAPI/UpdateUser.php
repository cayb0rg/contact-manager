<?php include './connectDatabase.php'; ?> 

<?php

$FirstName = $LastName = $Login = $Password = $ID = '';

$body = json_decode(file_get_contents("php://input"), true);

//get input from url
$FirstName = $body["firstName"];
$LastName = $body["lastName"];
$Login = $body["login"];
$Password = $body["password"];
$Avatar = $body["avatar"];
$ID = $body["id"];


if (!empty($ID)) {
    $UpdateFlag = 0;    //check which variable get updated first to match the comma in sql statement;

    $sql = "UPDATE Users SET ";

    if(!empty($FirstName)){
        $sql .= " FirstName = '$FirstName'";
        $UpdateFlag = 1;
    }

    if(!empty($LastName))
    {
        if($UpdateFlag == 0)
            $sql .= "LastName = '$LastName'";
        else
            $sql .= ", LastName = '$LastName'";

        $UpdateFlag = 1;
    }
        

    if(!empty($Login)){
        // Make sure login doesn't already exist
        $check_sql = "SELECT * FROM Users WHERE Login = '$Login'";  //log in the user
      
        $result = $conn->query($check_sql);   //run the query
      
        if($row = $result->fetch_assoc())
        {
          $res = array('Error' => "User '$Login' already exists.", 'createdUser' => 'false');
          $UpdateFlag = 0;
          
          echo json_encode( $res );

          return;
        }
        else
        {
            if($UpdateFlag == 0)
                $sql .= "Login = '$Login'";
            else
                $sql .= ", Login = '$Login'";

            $UpdateFlag = 1;
        }
    }   
        

    if(!empty($Password))
    {
        $hash = password_hash($Password, PASSWORD_BCRYPT);

        if($UpdateFlag == 0)
            $sql .= "Password = '$hash'";
        else 
            $sql .= ", Password = '$hash'";

        $UpdateFlag = 1;
    }

    if(!empty($Avatar))
    {
        if($UpdateFlag == 0)
            $sql .= "Avatar = '$Avatar'";
        else 
            $sql .= ", Avatar = '$Avatar'";

        $UpdateFlag = 1;
    }

    $sql .= " WHERE ID = '$ID'";

    if (mysqli_query($conn, $sql)) {  // success
      
      $res = array("userId" => $ID, "updatedFirstName" => $FirstName, "updatedLastName" => $LastName, "updatedLogin" => $Login, "updatedAvatar" => $Avatar);
      
      echo json_encode( $res );
      
    } else {
      
      $res = array('Error' => 'fail to execute to query');
      
      echo json_encode($res);
    }
  }
  else{
    $res = array('Error' => "ID can't be empty", "ID" => $ID);
    
    echo json_encode( $res );
  }
  
  //$conn->close();
?>

