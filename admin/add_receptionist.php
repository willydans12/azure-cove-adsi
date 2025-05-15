<?php
$mysqli=new mysqli('localhost','root','','hotel_db');if($mysqli->connect_error){http_response_code(500);exit;}
$name=$_POST['name'];$user=$_POST['username'];$email=$_POST['email'];$status=$_POST['status'];
$stmt=$mysqli->prepare("INSERT INTO receptionists(name,username,email,status,created_at) VALUES(?,?,?,?,NOW())");
$stmt->bind_param('ssss',$name,$user,$email,$status);$stmt->execute();echo json_encode(['id'=>$stmt->insert_id]);