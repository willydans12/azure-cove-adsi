<?php
header('Content-Type: application/json');
require 'koneksi.php';

// 1) Baca filter tanggal (YYYY-MM-DD)
$start = $_GET['start'] ?? null;
$end   = $_GET['end']   ?? null;

// 2) Buat klausa WHERE
$where = '1=1';
if ($start && $end) {
    $s = $conn->real_escape_string($start);
    $e = $conn->real_escape_string($end);
    $where = "DATE(check_in) BETWEEN '$s' AND '$e'";
}

// 3) Total Revenue unik per booking_id
$sql = "
  SELECT SUM(t.rev) AS total_rev
  FROM (
    SELECT booking_id, MAX(total) AS rev
    FROM bookings
    WHERE $where
    GROUP BY booking_id
  ) AS t
";
$r   = $conn->query($sql)->fetch_assoc();
$rev = (float)$r['total_rev'];

// 4) Total Bookings unik
$sql = "
  SELECT COUNT(*) AS total_cnt
  FROM (
    SELECT booking_id
    FROM bookings
    WHERE $where
    GROUP BY booking_id
  ) AS t
";
$r   = $conn->query($sql)->fetch_assoc();
$cnt = (int)$r['total_cnt'];

// 5) Average Stay
$sql = "
  SELECT AVG(DATEDIFF(check_out, check_in)) AS avg_days
  FROM bookings
  WHERE $where
";
$r       = $conn->query($sql)->fetch_assoc();
$avgStay = round((float)$r['avg_days'], 1);

// 6) Total Check In unik per booking
$sql = "
  SELECT COUNT(*) AS in_cnt
  FROM (
    SELECT booking_id
    FROM bookings
    WHERE $where AND status = 'Check In'
    GROUP BY booking_id
  ) AS t
";
$r     = $conn->query($sql)->fetch_assoc();
$curIn = (int)$r['in_cnt'];

// 7) Total Rooms tetap
$totalRooms = 200;

// 8) Occupancy (%)
$occ = $totalRooms > 0
     ? min(100, round($curIn / $totalRooms * 100, 2))
     : 0;

// 9) Statistik Metode Pembayaran (Credit Card, Bank Transfer, E-Wallet)
$payments = [
  'Credit Card'   => 0,
  'Bank Transfer' => 0,
  'E-Wallet'      => 0,
];

$sql = "
  SELECT payment_method, COUNT(DISTINCT booking_id) AS total
  FROM bookings
  WHERE $where
  GROUP BY payment_method
";
$res = $conn->query($sql);
while ($row = $res->fetch_assoc()) {
    $method = $row['payment_method'];
    if (isset($payments[$method])) {
        $payments[$method] = (int)$row['total'];
    }
}

// 10) Return JSON
echo json_encode([
  'totalRevenue'     => round($rev / 1e6, 1),  // dalam jutaan
  'totalRevenuePct'  => null,

  'totalBookings'    => $cnt,
  'totalBookingsPct' => null,

  'avgStay'          => $avgStay,
  'avgStayPct'       => null,

  'avgOccupancy'     => $occ,
  'avgOccupancyPct'  => null,

  'paymentMethods'   => $payments
]);
