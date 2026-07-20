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
if (empty($data['category_id'])) {
    $response['status'] = 'error';
    $response['message'] = 'Category ID is required';
    echo json_encode($response);
    exit;
}

if (empty($data['category_name'])) {
    $response['status'] = 'error';
    $response['message'] = 'Category name is required';
    echo json_encode($response);
    exit;
}

// Check if category belongs to user
$checkSql = "SELECT category_id FROM categories WHERE category_id = ? AND user_id = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("ii", $data['category_id'], $user_id);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows === 0) {
    $response['status'] = 'error';
    $response['message'] = 'Category not found or unauthorized';
    echo json_encode($response);
    exit;
}

// Check if new name already exists for this user (excluding current category)
$checkNameSql = "SELECT category_id FROM categories WHERE user_id = ? AND category_name = ? AND category_id != ?";
$checkNameStmt = $conn->prepare($checkNameSql);
$checkNameStmt->bind_param("isi", $user_id, $data['category_name'], $data['category_id']);
$checkNameStmt->execute();
$checkNameStmt->store_result();

if ($checkNameStmt->num_rows > 0) {
    $response['status'] = 'error';
    $response['message'] = 'Category name already exists';
    echo json_encode($response);
    exit;
}

// Update category
$sql = "UPDATE categories SET category_name = ? WHERE category_id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sii", $data['category_name'], $data['category_id'], $user_id);

if ($stmt->execute()) {
    $response['status'] = 'success';
    $response['message'] = 'Category updated successfully';
    $response['data'] = [
        'category_id' => $data['category_id'],
        'category_name' => $data['category_name']
    ];
} else {
    $response['status'] = 'error';
    $response['message'] = 'Failed to update category';
}

echo json_encode($response);
?>