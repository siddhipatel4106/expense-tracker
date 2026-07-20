<?php
// Simple auth helper without token-based session

function getUserId() {
    // Check if user is logged in via session
    if (isset($_SESSION['user_id'])) {
        return $_SESSION['user_id'];
    }
    
    // Or check if user_id is sent in request
    if (isset($_GET['user_id'])) {
        return $_GET['user_id'];
    }
    
    if (isset($_POST['user_id'])) {
        return $_POST['user_id'];
    }
    
    // Check if user_id is in JSON body
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data && isset($data['user_id'])) {
        return $data['user_id'];
    }
    
    return false;
}

function isLoggedIn() {
    return getUserId() !== false;
}
?>