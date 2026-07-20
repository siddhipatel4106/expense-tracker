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

// Get filters
$category_id = isset($_GET['category_id']) ? $_GET['category_id'] : '';
$from_date = isset($_GET['from_date']) ? $_GET['from_date'] : '';
$to_date = isset($_GET['to_date']) ? $_GET['to_date'] : '';
$payment_method = isset($_GET['payment_method']) ? $_GET['payment_method'] : '';

// Build query
$sql = "SELECT i.income_id, i.amount, i.payment_method, i.description, i.date, i.created_at,
        c.category_id, c.category_name, c.type
        FROM income i
        INNER JOIN categories c ON i.category_id = c.category_id
        WHERE i.user_id = ?";

$params = [];
$types = "i";
$params[] = $user_id;

if ($category_id) {
    $sql .= " AND i.category_id = ?";
    $types .= "i";
    $params[] = $category_id;
}

if ($payment_method) {
    $sql .= " AND i.payment_method = ?";
    $types .= "s";
    $params[] = $payment_method;
}

if ($from_date) {
    $sql .= " AND i.date >= ?";
    $types .= "s";
    $params[] = $from_date;
}

if ($to_date) {
    $sql .= " AND i.date <= ?";
    $types .= "s";
    $params[] = $to_date;
}

$sql .= " ORDER BY i.date DESC, i.created_at DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$incomes = [];
while ($row = $result->fetch_assoc()) {
    $incomes[] = $row;
}

$response['status'] = 'success';
$response['data'] = $incomes;

echo json_encode($response);
?>