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
if (empty($data['category_id'])) {
    $response['status'] = 'error';
    $response['message'] = 'Category ID is required';
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

// Check if category is being used in income or expense
$checkIncomeSql = "SELECT income_id FROM income WHERE category_id = ? LIMIT 1";
$checkIncomeStmt = $conn->prepare($checkIncomeSql);
$checkIncomeStmt->bind_param("i", $data['category_id']);
$checkIncomeStmt->execute();
$checkIncomeStmt->store_result();

$checkExpenseSql = "SELECT expense_id FROM expense WHERE category_id = ? LIMIT 1";
$checkExpenseStmt = $conn->prepare($checkExpenseSql);
$checkExpenseStmt->bind_param("i", $data['category_id']);
$checkExpenseStmt->execute();
$checkExpenseStmt->store_result();

if ($checkIncomeStmt->num_rows > 0 || $checkExpenseStmt->num_rows > 0) {
    $response['status'] = 'error';
    $response['message'] = 'Cannot delete category as it is being used in transactions';
    echo json_encode($response);
    exit;
}

// Delete category
$sql = "DELETE FROM categories WHERE category_id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $data['category_id'], $user_id);

if ($stmt->execute()) {
    $response['status'] = 'success';
    $response['message'] = 'Category deleted successfully';
} else {
    $response['status'] = 'error';
    $response['message'] = 'Failed to delete category';
}

echo json_encode($response);
?>