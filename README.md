# rocketscrum
The Rocket Scrum web app source code.

This is a private repo. Make sure you do not make this repo public.


Setup Notes for OpenBSD 6.1 (work in progress)

1. Create new instance based on OpenBSD. (can we use startup script to setup?)
2. Check /etc/installurl and confirm it has this line: https://ftp.openbsd.org/pub/OpenBSD
3. Run update with pkg_add -u.
4. Setup firewall (PF) including stopping brute forcing and also only allow logins from specific IPs.
5. Setup certificates for login.
6. Setup SSH to require certificate for login.
7. Disallow root login. Require 'doas'.
8. Update .profile and .kshrc.
9. Enable httpd.
   - rcctl enable httpd
10. Configure httpd (copy httpd.conf configuration file).
   - Create httpd.conf
   - /etc/rc.d/httpd -f start
   - put index.html /var/www/htdocs/index.html
   - openssl genrsa -out /etc/ssl/private/server.key
   - openssl req -new -x509 -key /etc/ssl/private/server.key -out /etc/ssl/server.crt -days 365
11. Install and configure MariaDB.
12. Install and configure PHP.
   - pkg_add php   (choose php 7)
   - rcctl enable php70_fpm
   - rcctl start php70_fpm
13. Install tarsnap from source code.
14. Setup backups.

