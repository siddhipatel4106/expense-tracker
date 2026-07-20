<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT');
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

// Get PUT data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (empty($data['income_id'])) {
    $response['status'] = 'error';
    $response['message'] = 'Income ID is required';
    echo json_encode($response);
    exit;
}

if (empty($data['category_id'])) {
    $response['status'] = 'error';
    $response['message'] = 'Category is required';
    echo json_encode($response);
    exit;
}

if (empty($data['amount']) || $data['amount'] <= 0) {
    $response['status'] = 'error';
    $response['message'] = 'Amount must be greater than 0';
    echo json_encode($response);
    exit;
}

if (empty($data['payment_method'])) {
    $response['status'] = 'error';
    $response['message'] = 'Payment method is required';
    echo json_encode($response);
    exit;
}

$validMethods = ['Cash', 'UPI', 'Credit Card', 'Bank Transfer'];
if (!in_array($data['payment_method'], $validMethods)) {
    $response['status'] = 'error';
    $response['message'] = 'Invalid payment method';
    echo json_encode($response);
    exit;
}

if (empty($data['date'])) {
    $response['status'] = 'error';
    $response['message'] = 'Date is required';
    echo json_encode($response);
    exit;
}

$today = date('Y-m-d');
if ($data['date'] > $today) {
    $response['status'] = 'error';
    $response['message'] = 'Date cannot be in the future';
    echo json_encode($response);
    exit;
}

// Check if income belongs to user
$checkIncomeSql = "SELECT income_id FROM income WHERE income_id = ? AND user_id = ?";
$checkIncomeStmt = $conn->prepare($checkIncomeSql);
$checkIncomeStmt->bind_param("ii", $data['income_id'], $user_id);
$checkIncomeStmt->execute();
$checkIncomeStmt->store_result();

if ($checkIncomeStmt->num_rows === 0) {
    $response['status'] = 'error';
    $response['message'] = 'Income not found or unauthorized';
    echo json_encode($response);
    exit;
}

// Verify category belongs to user and is of type Income
$checkCategorySql = "SELECT category_id FROM categories WHERE category_id = ? AND user_id = ? AND type = 'Income'";
$checkCategoryStmt = $conn->prepare($checkCategorySql);
$checkCategoryStmt->bind_param("ii", $data['category_id'], $user_id);
$checkCategoryStmt->execute();
$checkCategoryStmt->store_result();

if ($checkCategoryStmt->num_rows === 0) {
    $response['status'] = 'error';
    $response['message'] = 'Invalid category selected';
    echo json_encode($response);
    exit;
}

// Update income
$sql = "UPDATE income SET category_id = ?, amount = ?, payment_method = ?, description = ?, date = ? 
        WHERE income_id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("idsssii", $data['category_id'], $data['amount'], $data['payment_method'], $data['description'], $data['date'], $data['income_id'], $user_id);

if ($stmt->execute()) {
    $response['status'] = 'success';
    $response['message'] = 'Income updated successfully';
    $response['data'] = [
        'income_id' => $data['income_id'],
        'amount' => $data['amount'],
        'category_id' => $data['category_id'],
        'payment_method' => $data['payment_method'],
        'description' => $data['description'],
        'date' => $data['date']
    ];
} else {
    $response['status'] = 'error';
    $response['message'] = 'Failed to update income';
}

echo json_encode($response);
?>