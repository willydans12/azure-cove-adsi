<?php
$mysqli = new mysqli('localhost','root','','hotel_db');
if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Ambil data POST dengan pengecekan
$id       = isset($_POST['id'])       ? (int) $_POST['id']       : 0;
$name     = isset($_POST['name'])     ? $_POST['name']           : '';
$user     = isset($_POST['username']) ? $_POST['username']       : '';
$email    = isset($_POST['email'])    ? $_POST['email']          : '';
$status   = isset($_POST['status'])   ? $_POST['status']         : '';

// Pastikan ID valid
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid ID']);
    exit;
}

// Prepare dan execute
$stmt = $mysqli->prepare("
    UPDATE receptionists
    SET name = ?, username = ?, email = ?, status = ?
    WHERE id = ?
");
$stmt->bind_param('ssssi', $name, $user, $email, $status, $id);
$stmt->execute();

// Cek hasil update
if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Update failed or no changes']);
}
