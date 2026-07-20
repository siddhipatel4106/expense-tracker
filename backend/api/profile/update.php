<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../../config/db.php';
require_once '../../utils/auth_helper.php';

$response = [];

$user_id = getUserId();
if (!$user_id) {
    $response['status'] = 'error';
    $response['message'] = 'Please login first';
    echo json_encode($response);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['first_name']) || empty($data['last_name']) || empty($data['username']) || empty($data['email'])) {
    $response['status'] = 'error';
    $response['message'] = 'All fields are required';
    echo json_encode($response);
    exit;
}

// Check if email exists for other users
$checkEmailSql = "SELECT user_id FROM users WHERE email = ? AND user_id != ?";
$checkEmailStmt = $conn->prepare($checkEmailSql);
$checkEmailStmt->bind_param("si", $data['email'], $user_id);
$checkEmailStmt->execute();
$checkEmailStmt->store_result();

if ($checkEmailStmt->num_rows > 0) {
    $response['status'] = 'error';
    $response['message'] = 'Email already exists';
    echo json_encode($response);
    exit;
}

$sql = "UPDATE users SET first_name = ?, last_name = ?, username = ?, email = ?, updated_at = NOW() WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssi", $data['first_name'], $data['last_name'], $data['username'], $data['email'], $user_id);

if ($stmt->execute()) {
    $response['status'] = 'success';
    $response['message'] = 'Profile updated successfully';
} else {
    $response['status'] = 'error';
    $response['message'] = 'Failed to update profile';
}

echo json_encode($response);
?>