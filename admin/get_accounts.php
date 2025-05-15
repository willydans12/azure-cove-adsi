<?php
header('Content-Type: application/json');
$mysqli=new mysqli('localhost','root','','hotel_db');
if($mysqli->connect_error){http_response_code(500);exit;}
$res=$mysqli->query("SELECT id, avatar_url, name, username, email, status, DATE_FORMAT(created_at,'%d %b %Y') created_at FROM receptionists ORDER BY created_at DESC");
$out=[];while($r=$res->fetch_assoc()){ $r['id']=(int)$r['id']; $out[]=$r;}echo json_encode($out);