<?php
$mysqli=new mysqli('localhost','root','','hotel_db');if($mysqli->connect_error){http_response_code(500);exit;}
$data=json_decode(file_get_contents('php://input'),1);$id=(int)$data['id'];
$stmt=$mysqli->prepare("DELETE FROM receptionists WHERE id=?");$stmt->bind_param('i',$id);$stmt->execute();
if($stmt->affected_rows>0)echo json_encode(['deleted'=>true]);else{http_response_code(404);echo json_encode(['error'=>'Not found']);}