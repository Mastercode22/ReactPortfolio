<?php
class AuthMiddleware {
    public static function check($db): bool {
        $token = self::extractToken();

        if ($token) {
            $stmt = $db->prepare("SELECT id, name, email FROM admins WHERE auth_token = ? AND token_expires_at > NOW()");
            $stmt->execute([$token]);
            $admin = $stmt->fetch();
            if ($admin) {
                return true;
            }
        }

        Response::json(false, 'Unauthorized access or session expired. Please log in again.', null, 401);
        exit;
    }

    public static function extractToken(): ?string {
        // 1. Check apache_request_headers if available
        if (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            foreach ($headers as $key => $val) {
                if (strtolower($key) === 'authorization') {
                    if (preg_match('/Bearer\s(\S+)/i', $val, $matches)) {
                        return $matches[1];
                    }
                }
            }
        }

        // 2. Check $_SERVER variables
        $serverAuth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s(\S+)/i', $serverAuth, $matches)) {
            return $matches[1];
        }

        // 3. Fallback check query string or body token
        return $_GET['token'] ?? $_POST['token'] ?? null;
    }
}
