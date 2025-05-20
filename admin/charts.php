<?php
header('Content-Type: application/json');
require 'koneksi.php';

$start = $_GET['start'] ?? null;
$end   = $_GET['end']   ?? null;
$where = '1=1';
if ($start && $end) {
    $s = $conn->real_escape_string($start);
    $e = $conn->real_escape_string($end);
    $where = "DATE(check_in) BETWEEN '$s' AND '$e'";
}

$sql = "
  SELECT 
    DATE(check_in) AS dt,
    SUM(total)      AS revenue,
    COUNT(*)/(SELECT COUNT(*) FROM rooms)*100 AS occupancy
  FROM bookings
  WHERE $where
  GROUP BY dt
  ORDER BY dt ASC
";
$res = $conn->query($sql);

$labels = []; $rev = []; $occ = [];
while($r = $res->fetch_assoc()) {
  $labels[] = date('j M', strtotime($r['dt']));
  $rev[]    = round($r['revenue']/1e6,1);
  $occ[]    = round($r['occupancy'],1);
}

echo json_encode([
  'labels'    => $labels,
  'revenue'   => $rev,
  'occupancy' => $occ
]);
