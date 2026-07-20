<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/db.php';
require_once '../utils/SessionManager.php';

$data = json_decode(file_get_contents('php://input'), true);

$response = [];

// Validate inputs
if (empty($data['email'])) {
    $response['status'] = 'error';
    $response['message'] = 'Email is required';
    echo json_encode($response);
    exit;
}

if (empty($data['password'])) {
    $response['status'] = 'error';
    $response['message'] = 'Password is required';
    echo json_encode($response);
    exit;
}

// Check if user exists
$sql = "SELECT user_id, email, password_hash, first_name, last_name, username FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $data['email']);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $response['status'] = 'error';
    $response['message'] = 'Invalid email or password';
    echo json_encode($response);
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($data['password'], $user['password_hash'])) {
    $response['status'] = 'error';
    $response['message'] = 'Invalid email or password';
    echo json_encode($response);
    exit;
}

// Create session
$sessionManager = new SessionManager($conn);
$sessionData = $sessionManager->createSession($user['user_id']);

if ($sessionData) {
    // Update last login in user_profile
    $updateLogin = $conn->prepare("UPDATE user_profile SET last_login = NOW() WHERE user_id = ?");
    $updateLogin->bind_param("i", $user['user_id']);
    $updateLogin->execute();
    
    $response['status'] = 'success';
    $response['message'] = 'Login successful';
    $response['user_id'] = $user['user_id'];
    $response['user'] = [
        'id' => $user['user_id'],
        'first_name' => $user['first_name'],
        'last_name' => $user['last_name'],
        'username' => $user['username'],
        'email' => $user['email']
    ];
    $response['token'] = $sessionData['token'];
    $response['expires_at'] = $sessionData['expires_at'];
} else {
    $response['status'] = 'error';
    $response['message'] = 'Failed to create session';
}

echo json_encode($response);
?>