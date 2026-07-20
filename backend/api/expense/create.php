<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
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

// Validation
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

// Verify category belongs to user and is of type Expense
$checkCategorySql = "SELECT category_id FROM categories WHERE category_id = ? AND user_id = ? AND type = 'Expense'";
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

$sql = "INSERT INTO expense (user_id, category_id, amount, payment_method, description, date, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iidsss", $user_id, $data['category_id'], $data['amount'], $data['payment_method'], $data['description'], $data['date']);

if ($stmt->execute()) {
    $response['status'] = 'success';
    $response['message'] = 'Expense added successfully';
} else {
    $response['status'] = 'error';
    $response['message'] = 'Failed to add expense';
}

echo json_encode($response);
?>