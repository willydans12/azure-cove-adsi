<?php
$mysqli=new mysqli('localhost','root','','hotel_db');if($mysqli->connect_error){http_response_code(500);exit;} 
$data=json_decode(file_get_contents('php://input'),1);$id=(int)$data['id'];
$row=$mysqli->query("SELECT status FROM receptionists WHERE id=$id")->fetch_assoc();
$new=$row['status']==='Aktif'?'Nonaktif':'Aktif';
$mysqli->query("UPDATE receptionists SET status='$new' WHERE id=$id");
echo json_encode(['status'=>$new]);