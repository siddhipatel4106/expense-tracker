<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../config/db.php';
require_once '../utils/SessionManager.php';

$response = [];

// Get token from headers
$headers = getallheaders();
$token = isset($headers['Authorization']) ? $headers['Authorization'] : null;

if (!$token) {
    $response['status'] = 'error';
    $response['message'] = 'No token provided';
    echo json_encode($response);
    exit;
}

// Remove 'Bearer ' if present
if (strpos($token, 'Bearer ') === 0) {
    $token = substr($token, 7);
}

$sessionManager = new SessionManager($conn);
if ($sessionManager->destroySession($token)) {
    $response['status'] = 'success';
    $response['message'] = 'Logout successful';
} else {
    $response['status'] = 'error';
    $response['message'] = 'Logout failed';
}

echo json_encode($response);
?>