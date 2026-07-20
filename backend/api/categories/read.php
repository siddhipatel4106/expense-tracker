<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
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

// Get type filter if provided
$type = isset($_GET['type']) ? $_GET['type'] : '';

$sql = "SELECT category_id, category_name, type, created_at FROM categories WHERE user_id = ?";
if ($type && in_array($type, ['Income', 'Expense'])) {
    $sql .= " AND type = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("is", $user_id, $type);
} else {
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
}

$stmt->execute();
$result = $stmt->get_result();

$categories = [];
while ($row = $result->fetch_assoc()) {
    $categories[] = $row;
}

$response['status'] = 'success';
$response['data'] = $categories;

echo json_encode($response);
?>