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

if (empty($data['expense_id'])) {
    $response['status'] = 'error';
    $response['message'] = 'Expense ID is required';
    echo json_encode($response);
    exit;
}

// Check if expense belongs to user
$checkSql = "SELECT expense_id FROM expense WHERE expense_id = ? AND user_id = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("ii", $data['expense_id'], $user_id);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows === 0) {
    $response['status'] = 'error';
    $response['message'] = 'Expense not found or unauthorized';
    echo json_encode($response);
    exit;
}

$sql = "UPDATE expense SET category_id = ?, amount = ?, payment_method = ?, description = ?, date = ? 
        WHERE expense_id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("idsssii", $data['category_id'], $data['amount'], $data['payment_method'], $data['description'], $data['date'], $data['expense_id'], $user_id);

if ($stmt->execute()) {
    $response['status'] = 'success';
    $response['message'] = 'Expense updated successfully';
} else {
    $response['status'] = 'error';
    $response['message'] = 'Failed to update expense';
}

echo json_encode($response);
?>