# Steps to Setting up Django Server with Apache

Whatever you run this on, it will need at least Python 3.8 or greater to get the newest version of django. 
> Raspberry Pi you may need to manually compile Python 3.8, there are many guides on how to do this, or yours may already have it. Alternatively, a lower version of Django will run on Python 3.7 as well

## Set Up EC2 Instance OR any Ubuntu computer

You will want to pick an EC2 instance on AWS that is running ubuntu. This doesn't have to be on AWS though, just anything that is running ubuntu, even your own laptop.

### SSH to a server

`ssh username@IP-ADDRESS`


## Setting up Server

1. Clone your project onto the computer
2. In the project's `settings.py`, add the following lines:

```
import os

STATIC_URL = 'static/'

STATIC_ROOT = os.path.join(BASE_DIR, "static")
```

This configures django to know where to serve static files from when we switch over to Apache.

You'll also want to change `DEBUG` to false.

3. Now, you need to create a folder in the top level called `static`

4. You will have a list of required python modules for your server, which you should put into `requirements.txt`. This lets the server know exactly what modules it needs, so you don't have to install every single module that you have into it.

5. Installing required libraries (DONE ON SERVER)

`sudo apt-get install python3-pip apache2 libapache2-mod-wsgi-py3`

`sudo pip3 install virtualenv`

6. `cd` into your project and use the following command:

`virtualenv myprojectenv`

`source myprojectenv/bin/activate`

I'll note, it doesn't need to be called myprojectenv, but you should remember the name that you chose.

7. Run `pip install -r requirements.txt`

8. Back in `settings.py`, add the server's IP and domain name to `ALLOWED_HOSTS`


Now you have almost everything ready with django, just run:

```
python manage.py migrate

python manage.py collectstatic
```

The first command you know, the second, collects all the static files needed for the server and puts it into the static folder we set up earlier.


## Setting up Apache

Edit the file called `/etc/apache2/sites-available/000-default.conf` and put the following.

Note that you should replace `<YOUR APP NAME>` with the name of your project, and the path `<PATH TO PROJECT>` should match where you actually cloned it (including the name of the folder from cloning).

```
<VirtualHost *:80>
ServerAdmin webmaster@example.com
DocumentRoot <PATH TO PROJECT>
ErrorLog ${APACHE_LOG_DIR}/error.log
CustomLog ${APACHE_LOG_DIR}/access.log combined
Alias /static <PATH TO PROJECT>/static
<Directory <PATH TO PROJECT>/static>
Require all granted
</Directory>
<Directory <PATH TO PROJECT>/<APP NAME>>
<Files wsgi.py>
Require all granted
</Files>
</Directory>
WSGIDaemonProcess <YOUR APP NAME> python-path=<PATH TO PROJECT> python-home=<PATH TO PROJECT>/<VIRTUALENV NAME FROM EARLIER STEP>
WSGIProcessGroup <YOUR APP NAME>
WSGIScriptAlias / <PATH TO PROJECT>/<YOUR APP NAME>/wsgi.py
</VirtualHost>
```

EXAMPLE FROM PRESENTATION:

```

<VirtualHost *:80>
ServerAdmin webmaster@example.com
DocumentRoot /home/ubuntu/todos
ErrorLog ${APACHE_LOG_DIR}/error.log
CustomLog ${APACHE_LOG_DIR}/access.log combined
Alias /static /home/ubuntu/todos/static
<Directory /home/ubuntu/todos/static>
Require all granted
</Directory>
<Directory /home/ubuntu/todos/todos>
<Files wsgi.py>
Require all granted
</Files>
</Directory>
WSGIDaemonProcess todos python-path=/home/ubuntu/todos python-home=/home/ubuntu/todos/myprojectenv
WSGIProcessGroup todos
WSGIScriptAlias / /home/ubuntu/todos/todos/wsgi.py
</VirtualHost>

```

### Last steps

#### Allow Apache to use and modify the database and project

`chmod 664 db.sqlite3`

`sudo chown :www-data db.sqlite3`

`sudo chown :www-data <PROJECT LOCATION>`

If you get an apache error saying that the path couldn't be found or such, try this command, and then reload:

`sudo chmod 755 /home/<USER>`

In my case it was just

`sudo chmod 755 /home/ubuntu`

### And Finally

`sudo service apache2 restart`

This starts the server. You should be able to visit your IP and see your django project now!
