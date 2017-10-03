<?php
 include_once('myPHPMailer/class.phpmailer.php'); 
 
 class Mailer extends PHPMailer{ 
 
     var $Host = "tls://email-smtp.us-west-2.amazonaws.com"; //Amazon Server
     var $Username = "AKIAJBPJWFDK2UQMQKEQ";    //Enter Username from Amazon 
     var $Password = "Av8E157W2JE1FS3l4GfWELRsqbJ2746QyO7DMC/xoipj";  //Enter Pasword from Amazon 
     var $Port = 465;                        //Port number from Amazon 
     var $SMTPAuth = true; 
     var $From = "barasharironnel@yahoo.com";    //From may be any email you want 
     var $FromName = "My Site"; 
     var $CharSet = "UTF-8"; 
     var $Sender = 'info@rocketscrum.com';  //Sender has to be verified email !!! 
 
     var  $SMTPDebug  = true;             // set true if you want to debug
  /** 
   * Prevents the SMTP connection from being closed after each mail 
   * sending. If this is set to true then to close the connection 
   * requires an explicit call to SmtpClose(). 
   * @var bool 
   */
      var $SMTPKeepAlive = true; 
     function Mailer(){ 
           $this->IsSMTP(); 
      } 
      function send_email($email,$subject,$body){ 
              $this->ClearAddresses(); 
                $this->SingleTo = true;               
                mb_internal_encoding("UTF-8");  //If you send in UTF-8 Encoding 
                $this->AddAddress($email); 
                $this->Subject = ($subject); 
                $this->Body=$body; 
                return $this->Send();
      }
 }
 ?> 