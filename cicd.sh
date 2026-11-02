echo "-------------------- Starting Custom CI/CD Pipeline --------------------"
echo


echo "-------------------- Building latest files --------------------"
echo
npm run build
echo


cd server
echo "-------------------- Pushing server files to remote --------------------"
echo
scp -r -i /Users/shubhu/Downloads/Cotraveller-YC_key.pem ./dist ./package*.json azureuser@20.196.215.123:~/server/
echo "-------------------- Server push complete --------------------"
echo
echo

cd ../web
echo "-------------------- Pushing web files to remote --------------------"
echo
scp -r -i /Users/shubhu/Downloads/Cotraveller-YC_key.pem ./dist azureuser@20.196.215.123:~/web/
echo "-------------------- Web push complete --------------------"
echo
echo

cd ..
echo "-------------------- Copying latest nginx config to remote --------------------"
echo
cat ./website.conf | ssh -i /Users/shubhu/Downloads/Cotraveller-YC_key.pem azureuser@20.196.215.123 "sudo tee /etc/nginx/conf.d/website.conf"
echo
echo "-------------------- Nginx config copied --------------------"


echo "-------------------- Run scripts on remote to restart services --------------------"
ssh -f -i /Users/shubhu/Downloads/Cotraveller-YC_key.pem azureuser@20.196.215.123 'screen -d -m bash run.sh'
echo "-------------------- Exiting remote --------------------"
echo "-------------------- Exited remote, scripts run successfully, script complete --------------------"
