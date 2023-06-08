<?php include './connectDatabase.php'; ?> 

<?php
    $body = json_decode(file_get_contents("php://input"), true);

    $userId = '';
    $searchResults = "";

    $userId = $body["userId"];

    if (!empty($userId)) {

        $sqlGetContacts = "SELECT * FROM Contacts WHERE UserID = '$userId'";  // get all contacts associated with user

        $result = $conn->query($sqlGetContacts);   //run the query

        if ($result->num_rows > 0) {

            $final = array();

            while($row = $result->fetch_assoc()) {
                $eachContact = array('ID' => $row["ID"], 'FirstName' => $row["FirstName"], 'LastName' => $row["LastName"], 'UserID' => $row["UserID"], 'Email' => $row["Email"], 'Phone' => $row["Phone"]);
                array_push($final, $eachContact);
            }

            echo json_encode($final); 
        } 
        else {
            $res = array("result" => "no contacts found", 'userId' => $userId);
            
            echo json_encode($res);
        }
        
        $conn->close();
  
    } else {
        $res = array('Error' => 'at least one of the input is empty', 'UserId' => $userId);
        
        echo json_encode( $res );
    }
?>
