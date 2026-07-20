<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
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

$expense_id = isset($_GET['expense_id']) ? $_GET['expense_id'] : '';

if ($expense_id) {
    // Get single expense
    $sql = "SELECT e.expense_id, e.amount, e.payment_method, e.description, e.date, 
            c.category_id, c.category_name
            FROM expense e
            INNER JOIN categories c ON e.category_id = c.category_id
            WHERE e.expense_id = ? AND e.user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $expense_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $expense = $result->fetch_assoc();
    
    if ($expense) {
        $response['status'] = 'success';
        $response['data'] = $expense;
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Expense not found';
    }
} else {
    // Get all expenses
    $sql = "SELECT e.expense_id, e.amount, e.payment_method, e.description, e.date, e.created_at,
            c.category_id, c.category_name, c.type
            FROM expense e
            INNER JOIN categories c ON e.category_id = c.category_id
            WHERE e.user_id = ?
            ORDER BY e.date DESC, e.created_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $expenses = [];
    while ($row = $result->fetch_assoc()) {
        $expenses[] = $row;
    }

    $response['status'] = 'success';
    $response['data'] = $expenses;
}

echo json_encode($response);
?>