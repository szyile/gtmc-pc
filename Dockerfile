FROM 172.22.106.25/public/nginx:1.15.2-busybox
   ADD pc-pads /usr/share/nginx/html 
   CMD ["nginx", "-g", "daemon off;"]