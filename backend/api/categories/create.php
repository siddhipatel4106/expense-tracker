<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
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

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (empty($data['category_name'])) {
    $response['status'] = 'error';
    $response['message'] = 'Category name is required';
    echo json_encode($response);
    exit;
}

if (empty($data['type']) || !in_array($data['type'], ['Income', 'Expense'])) {
    $response['status'] = 'error';
    $response['message'] = 'Valid category type is required (Income or Expense)';
    echo json_encode($response);
    exit;
}

// Check if category already exists for this user
$checkSql = "SELECT category_id FROM categories WHERE user_id = ? AND category_name = ? AND type = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("iss", $user_id, $data['category_name'], $data['type']);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    $response['status'] = 'error';
    $response['message'] = 'Category already exists';
    echo json_encode($response);
    exit;
}

// Insert category
$sql = "INSERT INTO categories (user_id, category_name, type, created_at) VALUES (?, ?, ?, NOW())";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iss", $user_id, $data['category_name'], $data['type']);

if ($stmt->execute()) {
    $category_id = $conn->insert_id;
    
    $response['status'] = 'success';
    $response['message'] = 'Category created successfully';
    $response['data'] = [
        'category_id' => $category_id,
        'category_name' => $data['category_name'],
        'type' => $data['type']
    ];
} else {
    $response['status'] = 'error';
    $response['message'] = 'Failed to create category';
}

echo json_encode($response);
?>