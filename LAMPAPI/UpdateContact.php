<?php include './connectDatabase.php'; ?> 

<?php

header("Content-type: application/json; charset=utf-8;");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");

$firstName = $lastName = $userId = $email = $phone = '';

$body = json_decode(file_get_contents("php://input"), true);

$firstName = $body["firstName"];
$lastName = $body["lastName"];
$userId = $body["userId"];
$email = $body['email'];
$phone = $body['phone'];
$id = $body['id'];


if ((!empty($userId) || !empty($firstName) || !empty($lastName) || !empty($email) || !empty($phone)) && (!empty($id))) {

    $UpdateFlag = 0;    //check which variable get updated first to match the comma in sql statement;

    $sql = "UPDATE Contacts SET "; 

    if(!empty($firstName)){
        $sql .= " FirstName = '$firstName'";
        $UpdateFlag = 1;
    }

    if(!empty($lastName))
    {
        if($UpdateFlag == 0)
            $sql .= "LastName = '$lastName'";
        else
            $sql .= ", LastName = '$lastName'";

        $UpdateFlag = 1;
    }
        

    if(!empty($userId)){
        if($UpdateFlag == 0)
            $sql .= "UserID = '$userId'";
        else
            $sql .= ", UserID = '$userId'";

        $UpdateFlag = 1;
    }   
        

    if(!empty($email))
    {
        if($UpdateFlag == 0)
            $sql .= "Email = '$email'";
        else 
            $sql .= ", Email = '$email'";

        $UpdateFlag = 1;
    }

    if(!empty($phone))
    {
        if($UpdateFlag == 0)
            $sql .= "Phone = '$phone'";
        else 
            $sql .= ", Phone = '$phone'";

        $UpdateFlag = 1;
    }

    $sql .= " WHERE ID = '$id'";
    
    $result = $conn->query($sql);   //run the query

    if ($conn->query($sql) === TRUE) {
        $final = array('contactUpdated' => 'true', 'updatedFirstName' => $firstName, 'updatedLastName' => $lastName, 'updatedEmail' => $email,
            'updatedPhone' => $phone, 'updatedUserID' => $userId, 'ID' => $id);

        echo json_encode($final);
        
      } else {
        $final = array('contactUpdateded' => 'false');

        echo json_encode($final);
      }
      
      // $conn->close();
  
  }else{

    $res = array('Error' => 'at least have one of the inputs non-empty');
    
    echo json_encode( $res );
  }
?>




