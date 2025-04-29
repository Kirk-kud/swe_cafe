<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Validate input
if (!isset($data['fullName']) || !isset($data['email']) || !isset($data['password']) || !isset($data['studentId'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$fullName = $data['fullName'];
$email = $data['email'];
$password = $data['password'];
$studentId = $data['studentId'];
$phoneNumber = $data['phoneNumber'] ?? '';

try {
    // Check if user already exists
    $stmt = $pdo->prepare('SELECT * FROM Users WHERE email = ? OR student_id = ?');
    $stmt->execute([$email, $studentId]);
    if ($stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'User already exists']);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Split full name into first and last name
    $nameParts = explode(' ', $fullName, 2);
    $firstName = $nameParts[0];
    $lastName = $nameParts[1] ?? '';

    // Insert new user
    $stmt = $pdo->prepare('INSERT INTO Users (first_name, last_name, email, phone, password_hash, user_type, student_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$firstName, $lastName, $email, $phoneNumber, $hashedPassword, 'student', $studentId]);
    
    $userId = $pdo->lastInsertId();

    // Generate JWT token
    $token = generateJWT($userId);

    // Return success response
    echo json_encode([
        'message' => 'User registered successfully',
        'token' => $token,
        'user' => [
            'id' => $userId,
            'email' => $email,
            'fullName' => $fullName,
            'studentId' => $studentId,
            'phoneNumber' => $phoneNumber
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
    exit;
}

function generateJWT($userId) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'userId' => $userId,
        'iat' => time(),
        'exp' => time() + (24 * 60 * 60) // 24 hours
    ]);

    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, 'your-secret-key', true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}
?> 