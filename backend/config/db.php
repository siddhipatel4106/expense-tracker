<?php

$host = "localhost";
$user = "root";
$password = "root";     // MAMP default password
$database = "expense_tracker";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection Failed: " . $conn->connect_error);
}

?>