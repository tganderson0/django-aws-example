# Steps to Setting up Django Server

## Set Up EC2 Instance

You will want to pick an EC2 instance that is running ubuntu. This doesn't have to be on AWS though, just anything that is running ubuntu, even your own laptop

## Setting Up Server

1. Clone your project onto the computer
2. In the project's `settings.py`, add the following lines:

```
import os

STATIC_URL = 'static/'

STATIC_ROOT = os.path.join(BASE_DIR, "static")
```

This configures django to know where to serve static files from when we switch over to Apache.

You'll also want to change `DEBUG` to false.

3. Now, you need to create a folder in the top level called 'static'

4. You will have a list of required python modules for your server, which you should put into requirements.txt. This lets the server know exactly what modules it needs, so you don't have to install every single module that you have into it.

5. Installing required libraries (DONE ON SERVER)

`sudo apt-get install python3-pip apache2 libapache2-mod-wsgi-py3`

`sudo pip3 install virtualenv`

6. `cd` into your project and use the following command:

`virtualenv myprojectenv`

I'll note, it doesn't need to be called myprojectenv, but you should remember the name that you chose.

7. Back in `settings.py`, add the server's IP and domain name to `ALLOWED_HOSTS`

8. Run `pip install -r requirements.txt`


Now you have almost everything ready with django, just run:

```
python manage.py migrate

python manage.py collectstatic
```

The first command you know, the second, collects all the static files needed for the server and puts it into the static folder we set up earlier.


## Setting up Apache

Edit the file called `/etc/apache2/sites-available/000-default.conf` and put the following.

Note that you should replace `<YOUR APP NAME>` with the folder name of your project, and the path should match where you actually cloned it. This assumes you have it in the home directory.

```
<VirtualHost *:80>
ServerAdmin webmaster@example.com
DocumentRoot /home/ubuntu/<YOUR APP NAME>
ErrorLog ${APACHE_LOG_DIR}/error.log
CustomLog ${APACHE_LOG_DIR}/access.log combined
Alias /static /home/ubuntu/<YOUR APP NAME>/static
<Directory /home/ubuntu/<YOUR APP NAME>/static>
Require all granted
</Directory>
<Directory /home/ubuntu/<YOUR APP NAME>/todos>
<Files wsgi.py>
Require all granted
</Files>
</Directory>
WSGIDaemonProcess <YOUR APP NAME> python-path=/home/ubuntu/<YOUR APP NAME> python-home=/home/ubuntu/<YOUR APP NAME>/<VIRTUALENV NAME FROM EARLIER STEP>
WSGIProcessGroup <YOUR APP NAME>
WSGIScriptAlias / /home/ubuntu/<YOUR APP NAME>/<YOUR APP NAME>/wsgi.py
</VirtualHost>
```

### Last steps

#### Allow Apache to use the database and project

`chmod 664 db.sqlite3`

`sudo chown :www-data db.sqlite3`

`sudo chown :www-data ~/<PROJECT LOCATION>`


### And Finally

`sudo service apache2 restart`

This starts the server. You should be able to visit your IP and see your django project now!

