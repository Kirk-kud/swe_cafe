<?php
function verifyToken() {
    $headers = getallheaders();
    $token = null;

    // Get token from Authorization header
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        }
    }

    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'No token provided']);
        exit;
    }

    try {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }

        $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[0]));
        $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1]));
        $signature = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[2]));

        $validSignature = hash_hmac('sha256', $parts[0] . "." . $parts[1], 'your-secret-key', true);

        if (!hash_equals($validSignature, $signature)) {
            throw new Exception('Invalid token signature');
        }

        $payload = json_decode($payload, true);
        if (!$payload || !isset($payload['userId']) || !isset($payload['exp'])) {
            throw new Exception('Invalid token payload');
        }

        if ($payload['exp'] < time()) {
            throw new Exception('Token expired');
        }

        return $payload['userId'];
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
        exit;
    }
}
?> 