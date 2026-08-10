<?php
// Global CORS + JSON headers — loaded before routing
$allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Storage paths
define('STORAGE_PATH', dirname(__DIR__) . '/storage/');
define('CV_STORAGE',    STORAGE_PATH . 'cv/');
define('MEDIA_STORAGE', STORAGE_PATH . 'media/');

$server = $_SERVER['SERVER_NAME'] ?? 'localhost';
if ($server === 'localhost' || $server === '127.0.0.1') {
    define('PUBLIC_BASE', '/portfolio/backend/storage/');
} else {
    define('PUBLIC_BASE', '/backend/storage/');
}
