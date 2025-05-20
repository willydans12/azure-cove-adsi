<?php
header('Content-Type: application/json');
require 'koneksi.php';

$start = $_GET['start'] ?? null;
$end   = $_GET['end']   ?? null;
$where = '';
if ($start && $end) {
    $s = $conn->real_escape_string($start);
    $e = $conn->real_escape_string($end);
    $where = "WHERE DATE(check_in) BETWEEN '$s' AND '$e'";
}

$sql = "
  SELECT
    booking_id,
    guest_name,
    guest_email,
    DATE_FORMAT(check_in,  '%d %b %Y') AS check_in,
    DATE_FORMAT(check_out, '%d %b %Y') AS check_out,
    room,
    total,
    status,
    payment_method
  FROM bookings
  $where
  ORDER BY check_in DESC
";
$res = $conn->query($sql);

$data = [];
while ($r = $res->fetch_assoc()) {
  $r['total'] = number_format($r['total'], 0, ',', '.');
  $data[] = $r;
}

echo json_encode($data);
