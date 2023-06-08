<?php include './connectDatabase.php'; ?> 

<?php

$body = json_decode(file_get_contents("php://input"), true);

$userId = $body['userId'];
$searchItem = $body['searchItem'] ;
$searchItem2 = $body['searchItem'];  //for partial search purpose
$searchItem2 .= '%';

if (!empty($userId)) {

    
    if (!empty($searchItem))
    {
        if (filter_var($searchItem, FILTER_VALIDATE_EMAIL)) {
            $sql = "select * from Contacts where UserID = '$userId' And Email = '$searchItem'";
        }
        else if(filter_var($searchItem, FILTER_SANITIZE_NUMBER_INT)){
            $sql = "select * from Contacts where UserID = '$userId' And Phone = '$searchItem'";
        }else if(preg_match("/^([a-zA-Z' ]+)$/",$searchItem)){
            $sql = "select * from Contacts where UserID = '$userId' and (FirstName like '$searchItem2' or LastName like '$searchItem2')";
        }
        /*else{
            $sql = "select * from Contacts where UserID = '$userId'";
        }*/

        //echo $sql;
    } else {
        $sql = "select * from Contacts where UserID = '$userId'";
    }

    if(!empty($sql)){
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {

            $final = array();

            while($rowContact = $result->fetch_assoc()) {
                $eachContact = array('ID' => $rowContact["ID"], 'FirstName' => $rowContact["FirstName"], 'LastName' => $rowContact["LastName"], 'UserID' => $rowContact["UserID"], 'Email' => $rowContact["Email"], 'Phone' => $rowContact["Phone"]);
                array_push($final, $eachContact);
            }

            echo json_encode($final);

        } 
        else {

            $res = array("result" => "no contacts found", 'UserId' => $userId);
            
            echo json_encode($res);
        }
    } else {

        $res = array("result" => "no contacts found", 'UserId' => $userId);
        
        echo json_encode($res);
    }

}
  else{
    $res = array('Error' => 'at least one of the input is empty', 'UserId' => $userId, 'searchItem' => $searchItem);
    
    echo json_encode( $res );
  }
  
  //$conn->close();
?>

