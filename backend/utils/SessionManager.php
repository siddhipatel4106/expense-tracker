<?php
class SessionManager {
    private $conn;
    
    public function __construct($dbConnection) {
        $this->conn = $dbConnection;
    }
    
    // Create new session when user logs in
    public function createSession($user_id) {
        // Generate unique token
        $token = bin2hex(random_bytes(32));
        
        // Set expiry time (15 hours from now)
        $expires_at = date('Y-m-d H:i:s', strtotime('+15 hours'));
        $login_time = date('Y-m-d H:i:s');
        
        $sql = "INSERT INTO user_session (user_id, session_token, login_time, expires_at, is_active, token_issued_at) 
                VALUES (?, ?, ?, ?, 1, ?)";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("issss", $user_id, $token, $login_time, $expires_at, $login_time);
        
        if ($stmt->execute()) {
            return [
                'token' => $token,
                'expires_at' => $expires_at
            ];
        }
        return false;
    }
    
    // Validate session token
    public function validateSession($token) {
        $sql = "SELECT * FROM user_session 
                WHERE session_token = ? 
                AND is_active = 1 
                AND expires_at > NOW()";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $session = $result->fetch_assoc();
            // Refresh session expiry
            $this->refreshSession($token);
            return $session['user_id'];
        }
        return false;
    }
    
    // Refresh session expiry
    public function refreshSession($token) {
        $new_expiry = date('Y-m-d H:i:s', strtotime('+15 hours'));
        $last_activity = date('Y-m-d H:i:s');
        
        $sql = "UPDATE user_session 
                SET expires_at = ?, last_activity = ? 
                WHERE session_token = ?";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sss", $new_expiry, $last_activity, $token);
        return $stmt->execute();
    }
    
    // Destroy session on logout
    public function destroySession($token) {
        $logout_time = date('Y-m-d H:i:s');
        
        $sql = "UPDATE user_session 
                SET is_active = 0, logout_time = ? 
                WHERE session_token = ?";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ss", $logout_time, $token);
        return $stmt->execute();
    }
}
?>