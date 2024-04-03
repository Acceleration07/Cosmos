#!/bin/bash
if [[ $EUID -ne 0 ]]; then
    echo "This script must be run with sudo" 
    exit 1
fi
clear
function confirm() {
    read -p "$1 [y/N]: " response
    case "$response" in
        [yY][eE][sS]|[yY])
            true
            ;;
        *)
            false
            ;;
    esac
}

line="______________________________________________________"
echo ""
echo "       Welcome to the Cosmos+ Website Installer       "
echo "$line"
echo ""
echo "Before We Start The Directory that this install script"
echo "is in will be used for the entire website, it is      "
echo "recommended that you put the directory in a safe place"
echo "and it shouldn't move after you answered yes below    "
echo ""
confirm "Is the Cosmos+ folder where you want it to be?"
if [ $? -eq 0 ]; then
    pwd > os-files/pwd.xml
    filepath=$(head -1 os-files/pwd.xml)
    sed -i '2s#.*#filepath="'"$filepath"'"#' scripts/movie-download.sh
    sed -i '2s#.*#filepath="'"$filepath"'"#' scripts/tv-download.sh
    echo "Using $filepath"
    progress="1"
else
    echo ""
    echo "Please move the Cosmos+ Folder to where you want  "
    echo "it to be permenatly, and run this script again    "
    exit 0
fi
echo "$line"
echo ""
echo "OMDb API Set Up (https://www.omdbapi.com/)"
echo ""
echo "You will need to get a key for the OMDb API"
echo "For Higher Resolution Posters it is recommended that "
echo "you support their Patreon"
echo ""
read -p "Input Key Here: " api_key
echo "Echo Using $api_key as the OMDb API Key"
sed -i '3s#.*#API_KEY="'"$api_key"'"#' scripts/tv-download.sh
sed -i '3s#.*#API_KEY="'"$api_key"'"#' scripts/movie-download.sh
echo "$api_key" > os-files/omdb-api.xml
echo "$line"
echo "" 
echo "Web Server Setup"
echo "default | Router-Assigned IP"
echo "custom  | Type in your new IP (it will change your netplan)"
echo ""
read -p "What type of IP should be used?: " ip_type
if [ "$ip_type" = "default" ]; then
    ipadd=$(ip addr show | grep inet | grep -v inet6 | grep -v "127.0.0.1" | awk '{print $2}' | cut -d '/' -f1 | head -n 1)
    echo "Using $ipadd as Website IP Address"
    echo ""
elif [ "$ip_type" = "custom" ]; then
    read -p "Type New IP Here: " ipadd
    echo "New IP: $ipadd"
    sink=$(ip route get 8.8.8.8 | grep -oP '(?<=dev\s)\S+')
    sudo ip addr add $ipadd/24 dev $sink
    echo "New IP Address add, Use the \"ip addr\" Command to see your current ip addresses"
    echo ""
fi
echo "Installing the Apache2 Webserver"
echo ""
echo ""
sudo apt update
sudo apt install apache2
echo ""
Suser=$SUDO_USER
echo "Apache2 Installed"
echo "Creating Config File"
sed -i '5s#.*#    <Directory '"$filepath"'>#' os-files/apache2conf.xml
sed -i '3s#.*#    DocumentRoot '"$filepath"'#' os-files/apache2conf.xml
sed -i '1s#.*#<VirtualHost '"$ipadd"':80>#' os-files/apache2conf.xml
echo "Adjusting Permissions"
sudo chown -R $Suser:www-data $filepath
sudo usermod -a -G www-data $Suser
sudo cp os-files/apache2conf.xml /etc/apache2/sites-enabled/000-default.conf
echo ""
echo "$line"
echo "Webserver Started, You can access Cosmos+ Here:       "
echo "http://$ipadd/home.html"
echo "To Get Started Inporting Movies and Tv-Shows Run:     "
echo "movie-download, tv-download, and tv-download-web"
hdir="/home/$Suser"
mkdir $hdir/bin
sudo cp scripts/movie-download.sh $hdir/bin/movie-download
sudo chmod +X $hdir/bin/movie-download
sudo chown $Suser:$Suser $hdir/bin/movie-download
sudo cp scripts/tv-download.sh $hdir/bin/tv-download
sudo chmod +X $hdir/bin/tv-download
sudo chown $Suser:$Suser $hdir/bin/tv-download
sudo cp scripts/tv-download-web.sh $hdir/bin/tv-download-web
sudo chmod +X $hdir/bin/tv-download-web
sudo chown $Suser:$Suser $hdir/bin/tv-download-web
sed -i '$ a\export PATH="$HOME/bin:$PATH"' $hdir/.bashrc
echo ""
echo "$line"
sudo systemctl start apache2
sudo systemctl restart apache2
echo "Completed, Cosmos+ is now active"