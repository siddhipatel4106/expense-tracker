<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/db.php';
require_once '../utils/auth_helper.php';

$response = [];

$user_id = getUserId();
if (!$user_id) {
    $response['status'] = 'error';
    $response['message'] = 'Please login first';
    echo json_encode($response);
    exit;
}

$data = [];

// Get total income
$incomeSql = "SELECT COALESCE(SUM(amount), 0) as total FROM income WHERE user_id = ?";
$incomeStmt = $conn->prepare($incomeSql);
$incomeStmt->bind_param("i", $user_id);
$incomeStmt->execute();
$incomeResult = $incomeStmt->get_result();
$incomeData = $incomeResult->fetch_assoc();
$data['totalIncome'] = $incomeData['total'];

// Get total expense
$expenseSql = "SELECT COALESCE(SUM(amount), 0) as total FROM expense WHERE user_id = ?";
$expenseStmt = $conn->prepare($expenseSql);
$expenseStmt->bind_param("i", $user_id);
$expenseStmt->execute();
$expenseResult = $expenseStmt->get_result();
$expenseData = $expenseResult->fetch_assoc();
$data['totalExpense'] = $expenseData['total'];

// Calculate balance
$data['balance'] = $data['totalIncome'] - $data['totalExpense'];
$data['totalTransactions'] = 0;

// Get recent transactions (union of income and expense)
$recentSql = "(SELECT 'income' as type, amount, description, date FROM income WHERE user_id = ?)
              UNION ALL
              (SELECT 'expense' as type, amount, description, date FROM expense WHERE user_id = ?)
              ORDER BY date DESC LIMIT 5";

$recentStmt = $conn->prepare($recentSql);
$recentStmt->bind_param("ii", $user_id, $user_id);
$recentStmt->execute();
$recentResult = $recentStmt->get_result();

$data['recentTransactions'] = [];
$data['totalTransactions'] = 0;

while ($row = $recentResult->fetch_assoc()) {
    $data['recentTransactions'][] = $row;
}

// Get total transaction count
$countSql = "SELECT (SELECT COUNT(*) FROM income WHERE user_id = ?) + (SELECT COUNT(*) FROM expense WHERE user_id = ?) as total";
$countStmt = $conn->prepare($countSql);
$countStmt->bind_param("ii", $user_id, $user_id);
$countStmt->execute();
$countResult = $countStmt->get_result();
$countData = $countResult->fetch_assoc();
$data['totalTransactions'] = $countData['total'];

$response['status'] = 'success';
$response['data'] = $data;

echo json_encode($response);
?>