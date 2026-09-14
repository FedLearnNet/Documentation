---
title: How can I deploy a Client
sidebar_position: 2
---
[comment]: <> (Please be REALLY careful with changing the URL of this page. It is hardcoded currently in both the frontend AND the deployment script!)

# Deploy your own Client
You can deploy your own %%DEPLOYED_PRODUCT_NAME%% Client to participate in the %%DEPLOYED_PRODUCT_NAME%% network on
almost any server or machine, including inside a virtual machine.
This tutorial will guide you through the 5-10 minute process of deploying a %%DEPLOYED_PRODUCT_NAME%% Client 
on your own server or machine.

## Prerequisites
- python3 (>= 3.6)
- docker
- docker compose
- at least 4 GB of RAM. This holds even for an empty client without data, as on startup the authentication service Keycloak uses a few GB.
- a server/machine that is at best running 24/7 so your data is always findable. 
[You can read more why this is needed here](#server-availability-247)

Furthermore, the client is accessed from the web browser via HTTP/HTTPS.
If you want to access the %%DEPLOYED_PRODUCT_NAME%% Client also from another machine, 
you need to [ensure HTTPS encryption](#securing-your-client-access-to-the-client-from-other-machines) 
or if this isn't possible
[use an ssh tunnel to connect to the FLNet Client](#using-an-ssh-tunnel).

If you only ever access the %%DEPLOYED_PRODUCT_NAME%% Client from the same machine you can skip this and
in the initialization just run the %%DEPLOYED_PRODUCT_NAME%% Client on `127.0.0.1` (localhost) and a chosen port,
accessing it from the browser on the same machine.

### Special prerequisites to take during development
[comment]: <> (TODO: We should have the images publically pullable and remove this section!)
As the docker registry is not yet public, the images for the %%DEPLOYED_PRODUCT_NAME%% Client as well as
tool images used by the %%DEPLOYED_PRODUCT_NAME%% Client for federated learning and the ETL process are currently
behind an auth check.
Therefore please contact a [%%DEPLOYED_PRODUCT_NAME%% developer](mailto:info@mail.federated-learning.net) to provide you with credentials:
- A username
- A Gitlab Personal Access Token (PAT)
You will be provided with credentials that can pull images from the %%DEPLOYED_PRODUCT_NAME%% registry. 
Given this PAT, please do the following:
```bash
docker login gitlab.cosy.bio:5050
```
When prompted for the password use the PAT provided to you.

## Deploying your %%DEPLOYED_PRODUCT_NAME%% Client 
Please follow these steps to create, run and setup your %%DEPLOYED_PRODUCT_NAME%% Client in 5 to 15 minutes.

### 0. Prepare
First make sure the [prerequisites](#prerequisites) are all installed!
Then, clone the repository containing the %%DEPLOYED_PRODUCT_NAME%% Client setup:
```bash
git clone https://github.com/FedLearnNet/FL-Net-Client-Deployment.git
```
And cd into the cloned folder
```bash
cd FL-Net-Client-Deployment/
```

Please ask your Platform provider whether you require an account in the Network to join the network.
If yes, please make sure to have the credentials ready, as you will need them in the next step.

We also recommend you first read relevant documentation:
- [Welcome](../intro/welcome.md) to understand the Network you're joining.
- [External access management to your Client](../client-usage/external-access-management.md) to understand how to manage access to your Client from the Network.

#### Special step to take during development
[comment]: <> (TODO: We should have the apps publically pullable and remove this section!)
Currently, the apps used in the %%DEPLOYED_PRODUCT_NAME%% for importing data or federated learning are not publically available/pullable. You must therefore give the Client the username and PAT you got from the Federeated Learning Net dev team:
1. Edit the file `FLNet_client/docker-compose.yml`. 
2. In the service `orch-api` under `environment`, you must add the following:“
```
ORCH_DOCKER__GITLAB__REGISTRY_PASSWORD=<the given PAT>
```

### 1. Initializing the Client folder
Simply run the initialization script and follow the command line prompts:
```bash
python3 client_installer.py
``` 
This can be used to either to the initial setup, to reconfigure your client or to perform a 
fresh installation of the Client. The script will ask you for the following information:
- The IP the Client should listen on. Choose 127.0.0.1 if you use your own reverse proxy, 
a (reverse) ssh tunnel or only access the Client from the machine the Client is running on. 
- The port the Client should listen on. The port must be free. If you deploy
onto 0.0.0.0 to allow direct access from the Internet to the Client, we recommend to use
443 as this is the standard https port. This way you can access your Client via
`<your-domain>` instead of having to specify a port like `<your-domain:5555>`
- The domain name used. If you only access the Client from this machine or use a SSH tunnel, this can stay empty.
However if you want to access it from the Internet/Intranet we recommend to have a domain and ssl certificates to
secure the connection.
- The ssl certificate files. Refer to [this section on how to generate these files](#securing-your-client-access-to-the-client-from-other-machines).

After running the installer, the `flnet_client` folder is ready to be used.
The install script will provide you with the next steps, but they are also listed here.

### 2. Running your created Client 
To start the Client, run the following:
```bash
cd FLNet_client/
docker compose up -d
```
The first start up might take upto a few minutes.

### 3. The initial setup of the Client
#### 3.1 First login as the admin user
Now you need to update the initial admin account created for you.
Please access the Client. If you gave a domain, use the domain name. 
Otherwise use the given IP and port. 
The authentication service is available at `auth/`, so e.g. at `<your-domain>/auth/`
In case you missed the initial password given by the initialization script, the initial
username and password can be found in `flnet_client/env/keycloak-secrets.env` as `KC_BOOTSTRAP_ADMIN_PASSWORD`.
Use these credentials to log in.

Please immediately change the password, this can be done via the upper right corner under manage account.
If going to the account management page causes an infinite reload glitch, you need to
1. Go to the Clients page. This is found on the left navigation bar.
2. Go to the account-console client by clicking on it's client id.
3. In Web Origins, add a plus. This just allows the redirect URLs to also be origins of requests. 

#### 3.2 Create a user for the Client 
The %%DEPLOYED_PRODUCT_NAME%% Client is initialized without any users.
To create one:
1. On the left navigation bar go to Manage Realms and choose the FLNet-Client realm.
2. On the left navigation bar go to users and add a user. 
Make sure to tick `Email verified` or connect a SMTP server to the KeyCloak instance, see [Keycloaks documentation](https://www.keycloak.org/docs/latest/server_admin/index.html#_email). 
Alternatively you can deactivate that email verification is required.

Make sure the user is assigned to at least one group. Otherwise, the Client will refuse all operations for security reasons.
For more information about the groups, click on groups. Alternatively, here is a description of the groups:

**Admin**: Members of the Admin group may see and edit anything, having full access.

**Data-Access-Manager**: Members of the Data-Access-Manager group may see all patient data, but cannot edit it or add new data. Furthermore, they can control access via the network in the form of queries or federated learning. They have access to all logs.

**Data-Admin**: Members of the Data-Admin group may read, edit and add patient data. Furthermore, they may see all logs related to the addition, updating or removal of patient data.

The Client is now ready to be used, simply visit it at the domain you chose (or IP:port) and use the user you just created.

## Further information
### Server availability 24/7
The %%DEPLOYED_PRODUCT_NAME%% allows discovery of data at any point in time. To also be able to discover
your data, your machine needs to be connected. Therefore, we recommend running the server/machine
that participates in the %%DEPLOYED_PRODUCT_NAME%% 24/7.
The docker containers deployed are set to restart always unless manually stopped, so on server restart
the client will automatically start again. If you still notice any issues after a server restart, 
please refer to the [troubleshooting section](#the-client-is-misbehaving-after-a-server-restart) below.

### Securing your Client: Access to the Client from other machines
Access to the %%DEPLOYED_PRODUCT_NAME%% Client is via a webserver it deploys. If you are planning to access the Client (in the future) only from the same machine where it is running there are no further setup steps needed,
you can use the machines browser and the address you configured, e.g. `localhost:8250`.

However if you want to access the node from another machine, you should either:
- [Generate and use SSL certificates](#generating-ssl-certificates-automatically). 
If you don't use a domain but only an IP address, you need to perform some manual steps to make the default NGINX configuration work, refer to [this section](#using-an-ip-address-for-https). 
- [Use an SSH tunnel and access the node via the tunnel](#using-an-ssh-tunnel)

#### Generating SSL certificates (automatically)
SSL certificates are the keys used for the encryption of traffic to/from the %%DEPLOYED_PRODUCT_NAME%% Client.
The %%DEPLOYED_PRODUCT_NAME%% Client needs these keys to encrypt the traffic, using the NGINX reverse proxy shipped
with the Client. 
If you use your own reverse proxy, refer to the [advanced documentation on this](#advanced-using-your-own-reverse-proxy).
We recommend to use [letsencrypt](https://letsencrypt.org/) if you can fullfill the DNS challenges
done by lets encrypt.

SSL certificates are usually bound to a domain, so please register a domain/subdomain first 
before continuing. The %%DEPLOYED_PRODUCT_NAME%% Client is then accessed via the browser and this domain.

**If your server is accessible from the internet** 
We recommend using `certbot`. After installing certbot, run the following command, replacing
yourdomain.com with your own domain. This does NOT work with an IP address as domain.
```bash
sudo certbot certonly --standalone \
  -d <yourdomain.com> \
  --deploy-hook "docker exec flnet_client-reverse-proxy-encrypted-1 nginx -s reload"
```
This will generate the SSL certificates as well as take care of renewal.
Please note that the deploy hook will initially fail as the %%DEPLOYED_PRODUCT_NAME%% Client has not been setup and
you might find error logs in the `certbot` logs. This is not an issue though as the
%%DEPLOYED_PRODUCT_NAME%% Client is setup in the [next step](#1-initializing-the-client-folder).

**If your server is not accessible from the internet, e.g. it is behind a VPN or demilitarized zone**
SSL certificate authorities usually verify your domain by sending a request 
to your server running the %%DEPLOYED_PRODUCT_NAME%% Client.

If your server is not reachable via the internet this is not possible.
You have multiple options:
1. Generate self signed certificates. When you access the %%DEPLOYED_PRODUCT_NAME%% Client via the Browser a 
security warning will show, but traffic will be encrypted. 
You can generate self signed SSL certificates via the provided helper:
```bash
python3 create_self_signed_certs.py
```
Make sure to (automatically) renew them before they expire or to set a high expiracy date. 
The NGINX of the Client is setup strictly and by default not set for self signed certificates.
Please go to the nginx https config file 
`nano FLNet_client/nginx_conf_HTTPS.conf`
Comment out the following line:
```
add_header Strict-Transport-Security "max-age=31536000" always;
```
If you used an IP address as domain, please also follow the steps in the [section about using an IP address for HTTPS](#using-an-ip-address-for-https).
If you already started the Client, you need to run the
following command for the %%DEPLOYED_PRODUCT_NAME%% Client to pick up the new certificates:
```bash
cd FLNet_client/
docker compose restart reverse-proxy-encrypted
```
After generating the certificates you can [initialize and start the Client](#1-initializing-the-client-folder).
2. You can also setup an entry in your domain that lets encrypt can use to verify your domain. 
This would be using the [DNS-01 challenge](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge).
For automating the certification renewal, you need to check the API of your domain provider.
3. Not generate SSL certificates at all and just [use an SSH tunnel for encryption](#using-an-ssh-tunnel).
For this you need to modify how the computer accessing the %%DEPLOYED_PRODUCT_NAME%% Client node behaves!
4. Use your own CA Authority to sign the certificates. 
This completely depends on your own IT infrastructure, so we cannot provide additional help.

#### Using an IP Address for HTTPS
If you are using an IP address as the domain using HTTPS, the default NGINX configuration is not set up for this, as it is somewhat unusual. NGINX cannot correctly find the right server block (the right configuration) for IP addresses.

The steps below reassign `default_server` to the SSL block so NGINX starts cleanly. Please perform the following manual steps:

1. Go to the client directory: `cd FLNet_client`
2. Open the file `nginx.conf` in a text editor. You need to comment out/remove the default server block at the end of the file. You can find it by searching for `listen 443 ssl default_server;`.
3. Open the file `nginx_conf_HTTPS.conf` in a text editor. You need to add the `default_server` flag to the listen directive. 
Change `listen 443 ssl;` to `listen 443 ssl default_server;`.

#### Using an SSH tunnel
If you prefer not to set up SSL certificates, you can run the Client on localhost and securely access it through an SSH tunnel. This approach encrypts the connection between your local machine and the server while keeping the Client bound to localhost only.

**Steps to set up SSH tunneling:**

1. Deploy the Client to listen on `127.0.0.1` (localhost) during the [initialization step](#1-initializing-the-client-folder). 
You don't need any SSL certificates as the SSH tunnel we use here already encrypts traffic.
2. From your local machine accessing the %%DEPLOYED_PRODUCT_NAME%% Client, establish an SSH tunnel to your server:
```bash
# Replace 4444 with the port you configured during Client setup
# Replace user@your-server with your actual SSH credentials
ssh -L 4444:localhost:4444 user@your-server
``` 
This can also be setup in e.g. `Putty`. Please make sure that the port on the server and your machine align. 
E.g. `ssh -L 5555:localhost:4444 user@your-server` will not work as the Client will think it is accessed from a non allowed source (the ports mismatch, gets accessed at host header localhost:5555 from your machine but expects localhost:4444)

3. While the SSH connection is active, open your browser and navigate to `http://localhost:4444/`

The Client will now be accessible on your local machine as if it were running locally, with all traffic securely encrypted through the SSH tunnel.

#### Advanced: Using your own reverse proxy
A reverse proxy handles all the traffic send to the %%DEPLOYED_PRODUCT_NAME%% Client, proxying it.
Furthermore, the proxy is used for the encryption of this traffic.

The %%DEPLOYED_PRODUCT_NAME%% Client uses it's own NGINX reverse proxy.
If you want to use your own reverse proxy, it simply needs to relay traffic to 
your chosen IP:Port where you want to run the %%DEPLOYED_PRODUCT_NAME%% Client.
Please note that we use Server Sent Events (SSE), usually requiring special
proxy configuration.

An example configuration for apache would be (Make sure to input your actual domain!):
```
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerName <your-domain>

    # Relay the traffic to where you deploy the client
    Define CLIENT_EXPOSED_ADDRESS 127.0.0.1:8250
    ProxyPass / http://${CLIENT_EXPOSED_ADDRESS}/
    ProxyPassReverse / http://${CLIENT_EXPOSED_ADDRESS}/

    # SSE Support
    SetEnv proxy-sendchunked 1

    # WebSocket support
    RewriteEngine on
    RewriteCond %{HTTP:UPGRADE} ^WebSocket$ [NC]
    RewriteCond %{HTTP:CONNECTION} ^Upgrade$ [NC]
    RewriteRule ^/api/(.*) ws://${CLIENT_EXPOSED_ADDRESS}/api/$1 [P,L]
```

You then need to generate SSL certificates.
**If your server is accessible from the internet** 
You can easily use certbots default certificate generation (Make sure to input your actual domain).
Use `sudo certbot --apache -d <yourdomain.com>` 
for apache or `sudo certbot --nginx -d <yourdomain.com>` for nginx.

This will also automatically update the SSL certificates!

**If your server is not accessible from the internet, e.g. it is behind a VPN or demilitarized zone**
Refer to the [section on generating SSL certificates](#generating-ssl-certificates-automatically).
While this is written for the %%DEPLOYED_PRODUCT_NAME%% Client NGINX reverse proxy, this is fundamentally the same
with your own reverse proxy.

### Limiting network traffic
#### Incoming network traffic
The %%DEPLOYED_PRODUCT_NAME%% Client is accessed through a web interface served by an nginx instance, which routes requests to either the static frontend or the API. Make sure the port you configured during initialization is reachable from any machine you want to access the Client from.

#### Outgoing network traffic
The %%DEPLOYED_PRODUCT_NAME%% Client needs to communicate with the %%DEPLOYED_PRODUCT_NAME%% Platform.
Furthermore, it needs to be able to pull certain docker images to function.
This leads to the following requirements for outgoing network traffic:
- The `GLOBAL_DOMAIN` in `FLNet_Client/.env` needs to be reachable 
on port `443` via `https` and `wss`. 
Furthermore, the `GLOBAL_DOMAIN` must be reachable on the`GLOBAL_TCP_PORT` from the same `.env` file
via `tcp` for federated learning.
- Please make sure `Docker` has access to a DNS server.
- Please make sure the system correctly keeps time (so has network time protocol access), 
or issued authorization tokens might immediately expire.
- Furthermore, the following domains must be whitelisted to pull the docker images used by the %%DEPLOYED_PRODUCT_NAME%% Client:
  - `gitlab.cosy.bio:5050` (the %%DEPLOYED_PRODUCT_NAME%% registry)
  - `docker.io` (the docker hub registry) and `docker.com` (May be used for authentication and pulling images)
    - Please also allow all subdomains, as docker uses multiple, e.g. `auth.docker.io` and `registry-1.docker.io`. Alternatively, you can follow the [docker allow list](https://docs.docker.com/desktop/setup/allow-list/), which may cover domains unused by the %%DEPLOYED_PRODUCT_NAME%% Client, but used by docker itself. 
  - `quay.io` (Red Hat registry for KeyCloak)
  - `cgr.dev` (chainguard registry for the nginx reverse proxy)

We strongly recommend to test deploying the %%DEPLOYED_PRODUCT_NAME%% Client after setting the network
restrictions, as docker might route anonymous image pull requests through other domains.

# Troubleshooting

## The Client is misbehaving after a server restart
Sometimes docker registers the shutdown of containers on shutdown as a manual stop and does not restart them on server restart.
1. Try simply restarting the whole Client:
```bash
cd FLNet_client/
docker compose up -d
```
2. If the issues persist, investigate the logs of the containers in the following order:
- `reverse-proxy` (this routes all traffic to the Client).
- `local-learning-api` (this is the main backend service of the %%DEPLOYED_PRODUCT_NAME%% Client)
- `keycloak` (this is the authentication service of the %%DEPLOYED_PRODUCT_NAME%% Client)
If neither of these containers show any issues, check all further containers. 
Please [contact the developers if issues persist](mailto:info@mail.federated-learning.net) and provide the logs of the containers if you cannot resolve the issues yourself or find a bug in the %%DEPLOYED_PRODUCT_NAME%% Client.

[comment]: <> (TODO: this will be the instance-manager-frontend instead of the reverse-proxy once we integrate!)
