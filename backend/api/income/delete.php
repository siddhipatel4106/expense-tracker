<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../../config/db.php';
require_once '../../utils/auth_helper.php';

$response = [];

// Check if user is logged in
$user_id = getUserId();
if (!$user_id) {
    $response['status'] = 'error';
    $response['message'] = 'Please login first';
    echo json_encode($response);
    exit;
}

// Get DELETE data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (empty($data['income_id'])) {
    $response['status'] = 'error';
    $response['message'] = 'Income ID is required';
    echo json_encode($response);
    exit;
}

// Check if income belongs to user
$checkSql = "SELECT income_id FROM income WHERE income_id = ? AND user_id = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("ii", $data['income_id'], $user_id);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows === 0) {
    $response['status'] = 'error';
    $response['message'] = 'Income not found or unauthorized';
    echo json_encode($response);
    exit;
}

// Delete income
$sql = "DELETE FROM income WHERE income_id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $data['income_id'], $user_id);

if ($stmt->execute()) {
    $response['status'] = 'success';
    $response['message'] = 'Income deleted successfully';
} else {
    $response['status'] = 'error';
    $response['message'] = 'Failed to delete income';
}

echo json_encode($response);
?>