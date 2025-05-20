<?php
header('Content-Type: application/json');
$mysqli = new mysqli('localhost','root','','hotel_db');
if($mysqli->connect_error){http_response_code(500);exit;}

// Metrics SQL
$m = $mysqli->query("SELECT 
  COUNT(*) AS visitors,
  CONCAT('+', ROUND((COUNT(*) - (SELECT COUNT(*) FROM bookings WHERE MONTH(check_in)=MONTH(CURRENT_DATE)-1))/(SELECT COUNT(*) FROM bookings WHERE MONTH(check_in)=MONTH(CURRENT_DATE)-1)*100), '%') AS visitors_change,
  CONCAT('Rp ', FORMAT(SUM(total),0,'de_DE')) AS revenue,
  CONCAT('+', ROUND((SUM(total)- (SELECT SUM(total) FROM bookings WHERE MONTH(check_in)=MONTH(CURRENT_DATE)-1))/(SELECT SUM(total) FROM bookings WHERE MONTH(check_in)=MONTH(CURRENT_DATE)-1)*100), '%') AS revenue_change,
  CONCAT(ROUND((COUNT(*)/(SELECT COUNT(*) FROM rooms))*100,1), '%') AS occupancy,
  CONCAT('-', ROUND(((COUNT(*)/(SELECT COUNT(*) FROM rooms))*100 - (SELECT ROUND((COUNT(*)/(SELECT COUNT(*) FROM rooms))*100,1) FROM bookings WHERE MONTH(check_in)=MONTH(CURRENT_DATE)-1)),1), '%') AS occupancy_change
  FROM bookings");
$metrics = $m->fetch_assoc();

// Booking list
$bq = $mysqli->query("SELECT booking_id, guest_name, guest_email, DATE_FORMAT(check_in,'%d %b') AS check_in, DATE_FORMAT(check_out,'%d %b') AS check_out, room, CONCAT('Rp ',FORMAT(total,0,'de_DE')) AS total, status FROM bookings ORDER BY check_in DESC LIMIT 15");
$bookings=[]; while($r=$bq->fetch_assoc()) $bookings[]=$r;

// Chart data (last 7 days)
$revChart=$mysqli->query("SELECT DATE_FORMAT(check_in,'%e %b') AS day, SUM(total) AS val FROM bookings WHERE check_in>=DATE_SUB(CURDATE(),INTERVAL 6 DAY) GROUP BY day ORDER BY STR_TO_DATE(day,'%e %b')");
$visChart=$mysqli->query("SELECT DATE_FORMAT(check_in,'%e %b') AS day, COUNT(*)*10 AS val FROM bookings WHERE check_in>=DATE_SUB(CURDATE(),INTERVAL 6 DAY) GROUP BY day ORDER BY STR_TO_DATE(day,'%e %b')");
$charts=['revenue'=>['labels'=>[],'values'=>[]],'visitors'=>['labels'=>[],'values'=>[]]];
while($r=$revChart->fetch_assoc()){ $charts['revenue']['labels'][]=$r['day']; $charts['revenue']['values'][]=(float)$r['val']; }
while($r=$visChart->fetch_assoc()){ $charts['visitors']['labels'][]=$r['day']; $charts['visitors']['values'][]=(int)$r['val']; }

// Output
echo json_encode(['metrics'=>$metrics,'bookings'=>$bookings,'charts'=>$charts]);

