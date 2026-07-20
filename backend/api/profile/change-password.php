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

if (empty($data['current_password']) || empty($data['new_password'])) {
    $response['status'] = 'error';
    $response['message'] = 'All fields are required';
    echo json_encode($response);
    exit;
}

if (strlen($data['new_password']) < 6) {
    $response['status'] = 'error';
    $response['message'] = 'Password must be at least 6 characters';
    echo json_encode($response);
    exit;
}

// Get current password
$getPasswordSql = "SELECT password_hash FROM users WHERE user_id = ?";
$getPasswordStmt = $conn->prepare($getPasswordSql);
$getPasswordStmt->bind_param("i", $user_id);
$getPasswordStmt->execute();
$result = $getPasswordStmt->get_result();
$user = $result->fetch_assoc();

if (!password_verify($data['current_password'], $user['password_hash'])) {
    $response['status'] = 'error';
    $response['message'] = 'Current password is incorrect';
    echo json_encode($response);
    exit;
}

$newPasswordHash = password_hash($data['new_password'], PASSWORD_DEFAULT);

$sql = "UPDATE users SET password_hash = ?, updated_at = NOW() WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $newPasswordHash, $user_id);

if ($stmt->execute()) {
    $response['status'] = 'success';
    $response['message'] = 'Password changed successfully';
} else {
    $response['status'] = 'error';
    $response['message'] = 'Failed to change password';
}

echo json_encode($response);
?>