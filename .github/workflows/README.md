A simple BMI calculator built mainly to learn Docker, Nginx, Google Cloud, and CI/CD with GitHub Actions.

Tech Stack
Node.js & Express
Docker
Nginx
Google Cloud Compute Engine
GitHub Actions
CI/CD

The project uses GitHub Actions to automate deployment.

When I push to the main branch, the workflow:

connects to my GCP VM using SSH,
copies the updated project files,
rebuilds the Docker image,
replaces the running container with the new version.

This lets me deploy changes without manually logging into the server.
