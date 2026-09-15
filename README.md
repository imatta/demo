# Demo Server-Backed Analytics Dashboard

This repository contains a small web application with a Node.js analytics API
that can be served in a container and deployed through a Jenkins pipeline. The
current application code is on the `isaac_dynamic` branch.

The app is an analytics dashboard that demonstrates:

- A global unique visitor counter stored on the server
- A timer showing how long the visitor has stayed on the page
- Global link click tracking for demo navigation links
- A live activity log synchronized from the server

## Repository layout

The `isaac_dynamic` branch contains the following project files:

```text
.
|-- Dockerfile
|-- Jenkinsfile
|-- README.md
|-- css/
|   `-- style.css
|-- docs/
|   `-- ContainerDeploymentManualSteps.pdf
|-- html/
|   `-- index.html
|-- server.js
`-- scripts/
    |-- ascii.sh
    `-- script.js
```

Important files:

- `html/index.html` - dashboard markup served by the Node.js server.
- `css/style.css` - responsive dashboard styling.
- `scripts/script.js` - client-side timer and analytics API integration.
- `server.js` - Node.js static file server and analytics API using
  `/data/analytics.json` for server-side storage.
- `Dockerfile` - builds an Alpine Node.js image and copies the application into
  `/app`.
- `Jenkinsfile` - automates Podman build, cleanup, deployment, and basic
  availability checks for the `isaac_dynamic` branch.

## Prerequisites

For local development:

- Git
- A web browser
- Node.js 22 or later

For container deployment:

- Docker or Podman
- Access to port `9009` on the host machine

For Jenkins deployment:

- Jenkins agent with Git and Podman installed
- Jenkins user allowed to run Podman commands
- Permission for the Jenkins user to create `/home/isaac/app/dist`
- Permission for the Jenkins user to write logs under `/var/lib/jenkins/logs`
- Network access from the Jenkins agent to `https://github.com/imatta/demo.git`

## Get the application code

Clone the repository and check out the branch that contains the static web app:

```bash
git clone https://github.com/imatta/demo.git
cd demo
git checkout isaac_dynamic
```

Confirm the expected files are present:

```bash
ls -la
ls -la html css scripts
```

## Run locally without a container

Use `server.js` locally so the dashboard can call the same server-side
analytics API used in the container.

From the repository root, run:

```bash
mkdir -p .data
PORT=9009 ANALYTICS_FILE=.data/analytics.json node server.js
```

Then open:

```text
http://localhost:9009
```

When you are done, stop the server with `Ctrl+C`. Local analytics data is stored
in `.data/analytics.json`.

## Build and run with Docker

The Dockerfile uses `docker.io/library/node:22-alpine`, copies the app into
`/app`, stores shared analytics under `/data/analytics.json`, and starts
`server.js`.

Build the image:

```bash
docker build -t isaac_dynamic-web-container .
```

Run the container:

```bash
docker run -d \
  --name isaac_dynamic-web-container \
  -p 9009:80 \
  -v isaac_dynamic-analytics:/data \
  isaac_dynamic-web-container
```

Open the site:

```text
http://localhost:9009
```

Check the HTTP response:

```bash
curl -I http://localhost:9009
```

View running containers:

```bash
docker ps
```

Stop and remove the container:

```bash
docker stop isaac_dynamic-web-container
docker rm isaac_dynamic-web-container
```

Remove the image:

```bash
docker rmi isaac_dynamic-web-container
```

## Build and run with Podman

The Jenkins pipeline uses Podman, so these commands match the automated
deployment path.

Check that Podman is available:

```bash
podman info
```

Build the image:

```bash
podman build -t isaac_dynamic-web-container .
```

Run the container:

```bash
podman run -d \
  --name isaac_dynamic-web-container \
  -p 9009:80 \
  -v isaac_dynamic-analytics:/data \
  isaac_dynamic-web-container
```

Open the site:

```text
http://localhost:9009
```

Verify the response:

```bash
curl -I http://localhost:9009
```

Clean up:

```bash
podman stop isaac_dynamic-web-container
podman rm isaac_dynamic-web-container
podman rmi -f isaac_dynamic-web-container
```

## Dockerfile details

The Dockerfile performs these steps:

1. Starts from the lightweight Node.js Alpine image:

   ```Dockerfile
   FROM docker.io/library/node:22-alpine
   ```

2. Sets `/app` as the working directory and copies the application files:

   ```Dockerfile
   WORKDIR /app
   COPY ./html ./html
   COPY ./css ./css
   COPY ./scripts ./scripts
   COPY ./server.js ./server.js
   ```

3. Declares `/data` as the volume for shared analytics persistence:

   ```Dockerfile
   VOLUME ["/data"]
   ```

4. Documents container port `80` with `EXPOSE 80`.

5. Starts the Node.js web and analytics server:

   ```Dockerfile
   CMD ["node", "server.js"]
   ```

The server listens on port `80` inside the container. The run command maps host
port `9009` to container port `80` with `-p 9009:80`.

## Jenkins pipeline deployment

The `Jenkinsfile` is a declarative Jenkins pipeline that builds and deploys the
container from the `isaac_dynamic` branch.

### Pipeline environment variables

```groovy
BRANCH_NAME = "isaac_dynamic"
USER_NAME = "isaac"
USER_PORT = "9009"
DEPLOY_PATH = "/home/${USER_NAME}/app/dist"
REPO_URL = "https://github.com/imatta/demo.git"
SITE_URL = "http://localhost:${USER_PORT}"
```

These values control which branch is checked out, which image/container name is
used, where the deployment directory is created, and which local URL is checked
after deployment.

### Stage-by-stage flow

1. **Dry-Run**
   - Runs `podman info`.
   - Confirms the Jenkins agent can communicate with Podman before building.

2. **Build**
   - Checks out `https://github.com/imatta/demo.git` on branch
     `isaac_dynamic`.
   - Lists any existing image named `isaac_dynamic-web-container`.
   - Finds any existing container with the same name.
   - Stops and removes the existing container if one is present.
   - Removes the old image with `podman rmi -f`.
   - Builds a fresh image:

     ```bash
     podman build -t isaac_dynamic-web-container .
     ```

3. **Test**
   - Runs `podman images isaac_dynamic-web-container`.
   - Confirms the image was created and is available for deployment.

4. **Pre-Deploy**
   - Creates the deployment directory:

     ```bash
     sudo mkdir -p /home/isaac/app/dist
     ```

   - Lists the deployment directory.
   - Runs `podman info` again.
   - Checks disk and memory resources with:

     ```bash
     sudo df -h && free -h
     ```

5. **Deploy**
   - Lists all containers before deployment.
   - Starts the web container in detached mode:

     ```bash
     nohup podman run -d \
       --name isaac_dynamic-web-container \
       -p 9009:80 \
       -v isaac_dynamic-analytics:/data \
       isaac_dynamic-web-container \
       > /var/lib/jenkins/logs/isaac_dynamic-web-container_run.log 2>&1 &
     ```

   - Lists containers again so the build log shows the deployed container.

6. **Post actions**
   - On success, Jenkins checks site availability:

     ```bash
     curl -I http://localhost:9009
     ```

   - Jenkins then sleeps for 300 seconds, leaving time to inspect the running
     service.
   - On failure, Jenkins prints the site URL and deployment folder to check.

### Configure Jenkins

1. Create a new Jenkins Pipeline job.
2. Set the SCM repository URL to:

   ```text
   https://github.com/imatta/demo.git
   ```

3. Set the branch to:

   ```text
   isaac_dynamic
   ```

4. Set the pipeline script path to:

   ```text
   Jenkinsfile
   ```

5. Make sure the Jenkins agent can run:

   ```bash
   git --version
   podman info
   curl --version
   ```

6. Make sure the Jenkins user has access to the required directories:

   ```bash
   sudo mkdir -p /home/isaac/app/dist
   sudo mkdir -p /var/lib/jenkins/logs
   sudo chown -R jenkins:jenkins /var/lib/jenkins/logs
   ```

7. Run the Jenkins job.
8. After the job succeeds, open:

   ```text
   http://localhost:9009
   ```

## Application behavior

When the page loads, `scripts/script.js`:

1. Reads `site_visitor_id` from browser `localStorage`.
2. Creates a visitor id if one does not already exist.
3. Sends the visitor id to `POST /api/analytics/visit`.
4. Updates the global unique visitor count from the server response.
5. Starts a one-second interval that updates time spent on the page.
6. Sends tracked link clicks to `POST /api/analytics/click`.
7. Refreshes the shared visitor count, click count, and activity log from
   `GET /api/analytics` every five seconds.

`server.js` stores shared analytics in `/data/analytics.json` by default. To
reset server-side counters in a local run, stop the server and remove the data
file:

```bash
rm -f .data/analytics.json
```

To reset only the current browser identity, clear the browser's site data or run
this in the browser console:

```javascript
localStorage.removeItem('site_visitor_id');
location.reload();
```

## Troubleshooting

### Port 9009 is already in use

Stop the old container or choose another host port:

```bash
podman ps -a
podman stop isaac_dynamic-web-container
podman rm isaac_dynamic-web-container
```

### Container starts but the site is unavailable

Check whether the container is running:

```bash
podman ps -a
```

Check logs:

```bash
podman logs isaac_dynamic-web-container
```

Confirm the port mapping:

```bash
podman port isaac_dynamic-web-container
```

### Jenkins cannot remove an old image

Stop and remove the old container first:

```bash
podman stop isaac_dynamic-web-container
podman rm isaac_dynamic-web-container
podman rmi -f isaac_dynamic-web-container
```

### Jenkins cannot write logs

Create the log directory and grant ownership to the Jenkins user:

```bash
sudo mkdir -p /var/lib/jenkins/logs
sudo chown -R jenkins:jenkins /var/lib/jenkins/logs
```

## Cleanup commands

Use these commands to reset the local Podman deployment:

```bash
podman stop isaac_dynamic-web-container || true
podman rm isaac_dynamic-web-container || true
podman rmi -f isaac_dynamic-web-container || true
```
