<?php
// Start session if not started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Session timeout in seconds (1 hour)
define('SESSION_TIMEOUT', 3600);

// Function to create a new session
function createSession($userId, $ipAddress, $userAgent) {
    global $pdo;
    
    // Generate unique session token
    $sessionToken = bin2hex(random_bytes(32));
    $sessionId = session_id();
    $expiresAt = date('Y-m-d H:i:s', time() + SESSION_TIMEOUT);
    
    try {
        // Store session in database
        $stmt = $pdo->prepare("INSERT INTO user_sessions 
                              (session_id, user_id, session_token, ip_address, user_agent, expires_at) 
                              VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$sessionId, $userId, $sessionToken, $ipAddress, $userAgent, $expiresAt]);
        
        // Store in PHP session
        $_SESSION['user_id'] = $userId;
        $_SESSION['session_token'] = $sessionToken;
        $_SESSION['login_time'] = time();
        
        return $sessionToken;
    } catch(PDOException $e) {
        return false;
    }
}

// Function to validate current session
function validateSession() {
    global $pdo;
    
    // Check PHP session
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['session_token'])) {
        return false;
    }
    
    $sessionId = session_id();
    $userId = $_SESSION['user_id'];
    $sessionToken = $_SESSION['session_token'];
    
    try {
        // Check session in database
        $stmt = $pdo->prepare("SELECT * FROM user_sessions 
                              WHERE session_id = ? AND user_id = ? AND session_token = ? 
                              AND is_active = 1 AND expires_at > NOW()");
        $stmt->execute([$sessionId, $userId, $sessionToken]);
        $session = $stmt->fetch();
        
        if ($session) {
            // Update last activity
            $stmt = $pdo->prepare("UPDATE user_sessions SET last_activity = NOW() 
                                  WHERE session_id = ?");
            $stmt->execute([$sessionId]);
            return true;
        }
        
        return false;
    } catch(PDOException $e) {
        return false;
    }
}

// Function to destroy session
function destroySession() {
    global $pdo;
    
    if (isset($_SESSION['user_id']) && isset($_SESSION['session_token'])) {
        $sessionId = session_id();
        $userId = $_SESSION['user_id'];
        
        try {
            // Deactivate session in database
            $stmt = $pdo->prepare("UPDATE user_sessions SET is_active = 0 
                                  WHERE session_id = ? AND user_id = ?");
            $stmt->execute([$sessionId, $userId]);
        } catch(PDOException $e) {
            // Continue with session destruction even if database update fails
        }
    }
    
    // Clear PHP session
    $_SESSION = array();
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
}

// Function to get current user
function getCurrentUser() {
    global $pdo;
    
    if (!validateSession()) {
        return null;
    }
    
    $userId = $_SESSION['user_id'];
    
    try {
        $stmt = $pdo->prepare("SELECT user_id, first_name, last_name, username, email 
                              FROM users WHERE user_id = ?");
        $stmt->execute([$userId]);
        return $stmt->fetch();
    } catch(PDOException $e) {
        return null;
    }
}

// Function to update user profile (login info)
function updateUserProfile($userId, $browser, $os, $device, $ip, $userAgent) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("INSERT INTO user_profile 
                              (user_id, browser_name, operating_system, device_type, ip_address, user_agent, last_login) 
                              VALUES (?, ?, ?, ?, ?, ?, NOW()) 
                              ON DUPLICATE KEY UPDATE 
                              browser_name = VALUES(browser_name),
                              operating_system = VALUES(operating_system),
                              device_type = VALUES(device_type),
                              ip_address = VALUES(ip_address),
                              user_agent = VALUES(user_agent),
                              last_login = NOW()");
        $stmt->execute([$userId, $browser, $os, $device, $ip, $userAgent]);
        return true;
    } catch(PDOException $e) {
        return false;
    }
}
?>