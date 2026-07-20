<?php
// Simple auth middleware
function checkAuth() {
    // Get token from headers
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? $headers['Authorization'] : null;
    
    // If no token, try getting from POST/GET
    if (!$token && isset($_POST['token'])) {
        $token = $_POST['token'];
    }
    if (!$token && isset($_GET['token'])) {
        $token = $_GET['token'];
    }
    
    // Remove 'Bearer ' if present
    if ($token && strpos($token, 'Bearer ') === 0) {
        $token = substr($token, 7);
    }
    
    if (!$token) {
        return false;
    }
    
    // Validate session
    require_once __DIR__ . '/../config/database.php';
    require_once __DIR__ . '/../utils/SessionManager.php';
    
    $sessionManager = new SessionManager($conn);
    $user_id = $sessionManager->validateSession($token);
    
    return $user_id;
}
?>