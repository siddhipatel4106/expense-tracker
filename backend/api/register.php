<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/db.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

$response = [];

// Validate required fields
$required_fields = ['first_name', 'last_name', 'username', 'email', 'password', 'confirm_password'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        $response['success'] = false;
        $response['message'] = ucfirst(str_replace('_', ' ', $field)) . ' is required';
        echo json_encode($response);
        exit;
    }
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    $response['success'] = false;
    $response['message'] = 'Invalid email format';
    echo json_encode($response);
    exit;
}

// Validate password length
if (strlen($data['password']) < 6) {
    $response['success'] = false;
    $response['message'] = 'Password must be at least 6 characters';
    echo json_encode($response);
    exit;
}

// Check password confirmation
if ($data['password'] !== $data['confirm_password']) {
    $response['success'] = false;
    $response['message'] = 'Passwords do not match';
    echo json_encode($response);
    exit;
}

// Check if email already exists
$checkEmail = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
$checkEmail->bind_param("s", $data['email']);
$checkEmail->execute();
$checkEmail->store_result();

if ($checkEmail->num_rows > 0) {
    $response['success'] = false;
    $response['message'] = 'Email already registered';
    echo json_encode($response);
    exit;
}

// Check if username already exists
$checkUsername = $conn->prepare("SELECT user_id FROM users WHERE username = ?");
$checkUsername->bind_param("s", $data['username']);
$checkUsername->execute();
$checkUsername->store_result();

if ($checkUsername->num_rows > 0) {
    $response['success'] = false;
    $response['message'] = 'Username already taken';
    echo json_encode($response);
    exit;
}

// Hash password
$hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

// Insert user
$sql = "INSERT INTO users (first_name, last_name, username, email, password_hash, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $data['first_name'], $data['last_name'], $data['username'], $data['email'], $hashedPassword);

if ($stmt->execute()) {
    $user_id = $conn->insert_id;
    
    // Create default categories for user
    $defaultCategories = [
        ['Income', 'Salary'],
        ['Income', 'Bonus'],
        ['Income', 'Interest'],
        ['Expense', 'Food'],
        ['Expense', 'Fuel'],
        ['Expense', 'Rent'],
        ['Expense', 'Shopping']
    ];
    
    foreach ($defaultCategories as $category) {
        $insertCategory = $conn->prepare("INSERT INTO categories (user_id, category_name, type, created_at) VALUES (?, ?, ?, NOW())");
        $insertCategory->bind_param("iss", $user_id, $category[1], $category[0]);
        $insertCategory->execute();
    }
    
    // Create user profile
    $profileSql = "INSERT INTO user_profile (user_id, browser_name, operating_system, device_type, created_at)
    VALUES (?, 'Unknown', 'Unknown', 'Desktop', NOW())";
    $profileStmt = $conn->prepare($profileSql);
    $profileStmt->bind_param("i", $user_id);
    $profileStmt->execute();
    
    $response['success'] = true;
    $response['message'] = 'Registration successful';
    $response['status'] = 'success';
} else {
    $response['success'] = false;
    $response['message'] = 'Registration failed. Please try again.';
}

echo json_encode($response);
?>