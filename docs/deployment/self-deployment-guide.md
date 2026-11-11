---
title: Self deployment of a FL-Net Platform
description: Deploy the FL-Net Platform. Includes Keycloak (Oauth server), APIs, DBs, frontend, reverse proxy, and documentation.
sidebar_position: 2
---

# Deploy your own Platform
## Prerequisites
- either Linux or MacOS. On Windows, you can use WSL2 with e.g. Ubuntu 22.04 or later.
- curl (for downloading the CLI installation shell script, you can delete it after the installation)
- docker
- docker compose
- A registered domain
- certbot
- at least 16 GB of RAM. 
  - On startup the authentication service Keycloak uses a few GB.
  - The ontology of the Platform consists of millions of nodes which depending on usage can be in RAM.
- a server/machine that is at best running 24/7 and exposed to the internet on two ports. 
The network is star shaped with the FLNet Platform instance as the central coordination hub. 
Without your FLNet Platform instance your whole FLNet is not available!

## How to deploy
### 0. Prepare
#### Install the CLI
First make sure the [prerequisites](#prerequisites) are all met!
Then, install the `flnet` CLI tool by running the following command:
```bash
curl -fsSL https://raw.githubusercontent.com/FedLearnNet/FL-Net-CLI/main/install.sh | sh
```
This will download the relevant binary for your system and place it in `~/.local/bin` (Linux/Mac) 
for non root users and /usr/local/bin as `root`.

#### Generate the SSL certificates
Generate the SSL certificates to use with the FLNet Platform and setup the deploy hook that
restarts the FLNet Platform after SSL cert renewal (Replace yourdomain.com!):
```bash
sudo certbot certonly --standalone \
  -d <yourdomain.com> \
  --deploy-hook "docker exec fl-net-platform-reverse-proxy-encrypted-1 nginx -s reload && docker restart fl-net-platform-relay-server-1"
```

Alternatively, you can use your own reverse proxy and deploy the FLNet Platform to `127.0.0.1`.
Please prepare this already before continuing.
For setting up your own reverse proxy, please note the following:
1. The FLNet Platform uses websockets and Server Sent Events (SSE) on multiple endpoints. 
For SSE: Make sure to turn off caching and buffering or the SSE events might get stuck in your proxies cache
For Websockets: Make sure to correctly handle websocket messages, e.g. via the rewrite engine in apache.
1. The FLNet Platform additionally deploys a TCP server for the federated learning. Make sure to
correctly proxy TCP, not HTTP to this, e.g. via the stream module in nginx.
1. The HOST header is used my multiple services of the FLNet Platform for either security or
creating redirect URIs. Please make sure to preserve the original Host header.

### 1. Creating the FLNet Platform folder
Simply run the initialization command and follow the command line prompts:
```bash
flnet platform init
``` 
You will need to specify:
- The IP the Platform should listen on. Choose 127.0.0.1 if you use your own reverse proxy, otherwise
use 0.0.0.0.
- The port the Platform should listen on. The port should be free. If you deploy
onto 0.0.0.0 to allow direct access from the Internet to the Platform, we recommend to use
443 as this is the standard https port. This way you can access your Platform via
`<your-domain>` instead of having to specify a port like `<your-domain:5555>`
- The IP and port of the Platforms federated learning TCP server. This server is only used for
federated learning and manages encryption on it's own, it has normal SSL encryption via self signed
certificates plus end to end encryption. It needs another port then the main platform server!
- The domain name used. 
- The ssl certificate files.

Use `flnet platform info` to see the path of your platform folder.
The install script will provide you with the next steps, but they are also listed here.

#### Optional: Get the UMLS ontology
The FLNet Platform supports using the UMLS as an ontology to ensure a stable data standard.
1. Make sure to get a license at the [umls homepage](https://www.nlm.nih.gov/research/umls/index.html).
1. Download the [UMLS Metathesaurus Full Subset ](https://www.nlm.nih.gov/research/umls/licensedcontent/umlsknowledgesources.html)
1. Extract the following files:
- `MRCONSO.RRF` to `<path-to-platform-folder>/umls`
- `MRREL.RRF` to `<path-to-platform-folder>/umls`

These files are automatically provided on startup via mounting the `umls` folder and 
the UMLS is automaically imported if these files are available. 

#### Optional: Getting the sapbert model for better ontology search
We support the use of the sapbert model for embedding the ontology, making search through
the ontology more efficient.

1. You can request the files from the FLNet developer. you need the `tokenizer.json` and 
the [sapbert model](https://github.com/cambridgeltl/sapbert/tree/main) in `onnx` format.
1. Place the following files in the relevant folder:
- `sapbert.onnx` to `<path-to-platform-folder>/sapbert`
- `tokenizer.json` to `<path-to-platform-folder>/sapbert`

The model is automatically loaded and used to embedd all ontology nodes.

### 2. Running your created FLNet Platform 
To start the Platform, run the following:
```bash
flnet platform up
```
You can also run the underlying `docker compose` command yourself.
```bash
cd <path-to-platform-folder>
docker compose up -d
```

The first start up might take upto a few minutes.

### 3. The initial setup of the FLNet Platform
#### 3.1 First login as the admin user to the KeyCloak Administration Console
The FLNet Platform uses `KeyCloak` as the OIDC Provider for authentication. 
There are two different so called `Realms` in it:
- The `FLNet-Platform` realm is used for the Platform itself. It contains the users, roles and groups that are used to access the Platform.
- The `Master` realm is the administration realm of KeyCloak itself. It is used to manage the KeyCloak instance and the `FLNet-Platform` realm.

First, you need to update the initial admin account created for you in the `Master` realm.

1. Access the KeyCloak Administration Console at `<your-domain>/auth/admin/`

In case you missed the initial password given by the initialization script, the initial
username and password for the `Master` realm can be found in `FLNET_platform/env/keycloak-secrets.env` as `KC_BOOTSTRAP_ADMIN_PASSWORD`.
Use these credentials to log in.

Please immediately change the password, this can be done via the upper right corner under manage account.
If going to the account management page causes an infinite reload glitch, you need to
1. Go to the Clients page. This is found on the left navigation bar.
2. Go to the account-console client by clicking on it's client id.
3. In Web Origins, add a plus. This just allows the redirect URLs to also be origins of requests. 

Please directly continue with [managing users in KeyCloak](#32-managing-users-via-the-keycloak-administration-console).

#### 3.2 Managing users via the KeyCloak Administration Console
The FLNet Platform is initialized without any users in the `FLNet-Platform` realm.
**Please make sure to directly create the user with username `admin` with the password you want to use.**
The Platform automatically loads and builds prevetted Tools and Workflows. 
These are owned by the `admin` user, so make sure you create that user.

You can create users manually, hook in your own authentication service (SAML or OpenID Connect) or 
allow self registration of users. 
Please refer to the KeyCloak documentation itself. 

Here we only provide information on how to add users manually:
1. Follow the steps in the previous section to log in to the KeyCloak Administration Console.
2. On the left navigation bar go to Manage Realms and choose the FLNet-Platform realm.
3. On the left navigation bar go to users and add a user. 
Make sure to tick `Email verified` or connect a SMTP server to the KeyCloak instance, see [Keycloaks documentation](https://www.keycloak.org/docs/latest/server_admin/index.html#_email). 
Alternatively you can deactivate that email verification is required.

Users that create, update or delete schemas, ontologies and datatypes need the realm role `Data-Modeler` (or `Admin`).

Users that audit Tools need the realm role `Auditor` (or `Admin`).

Other users who use the network for data science and federated learning need the realm role `Data-Scientist` (or `Admin`).

[comment]: <> (TODO: We still only have dev level groups, we should have groups and add the info about them here!)

Congratulations, you're ready to go.
Share your chosen domain and TCP port with the data holders that want to join your network.
You automatically also deploy documentation, so you can refer data holders to the relevant
documentation on how to join your network:
`<your-domain>/documentation/docs/deployment/deploy-client`

[comment]: <> (TODO: The URL of the docs is still a bit fucked up right now!)

#### 3.3 Restricting access to the KeyCloak admin console
The KeyCloak Administration Console is available at `<your-domain>/auth/admin/`.
We recommend to restrict access to this console to only your own IP address.
You can do this by editing the `nginx_keycloak_admin.conf` file in the folder created by
the initialization script (`~/fl-net/platforms`).

## 4. Keeping your FLNet Platform running
### Cert renewal
The deployment does neither automatically renew the SSL certificates nor reload updated certificates.
1. Make sure you take care of certificate renewal yourself. 
2. On certificate renewal, make sure you reload the relevant services (the reverse proxy and the relay server) to use the new certificates.
```bash
flnet platform restart
```
Alternatively check the exact container names.
If you use certbot, you can use the `--deploy-hook` option to automatically reload the services after cert renewal.
Make sure to test the restart commands before you setup the hook, as it's easy to make a mistake in e.g. container names.

### Updating the FLNet Platform
The FLNet Platform is deployed via docker compose.
We currently don'y have a specific update functionality.
You may use e.g. watchtower to automatically update the images.

Manual update:

```sh
docker compose pull
docker compose up -d
```
