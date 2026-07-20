<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../config/db.php';
require_once '../utils/SessionManager.php';
require_once '../middleware/auth.php';

$response = [];

$user_id = checkAuth();

if ($user_id) {
    // Get user data
    $sql = "SELECT user_id, first_name, last_name, username, email FROM users WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    $response['status'] = 'success';
    $response['message'] = 'Session valid';
    $response['user'] = $user;
} else {
    $response['status'] = 'error';
    $response['message'] = 'Session invalid or expired';
}

echo json_encode($response);
?>