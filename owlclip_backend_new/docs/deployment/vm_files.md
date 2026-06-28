owlclip folder in the vm inside it we have:

- deploy.sh


azureuser@OwlClip:~/owlclip$ cat deploy.sh

```
#!/bin/bash
set -e

cd /home/azureuser/owlclip

echo "Deploying $IMAGE_TAG"

docker compose up -d

docker image prune -f

echo "Deploy finished"
```


- docker-compose.yml

azureuser@OwlClip:~/owlclip$ cat docker-compose.yml

```
services:
  backend:
    image: ghcr.io/pravweb/owlclip-backend:${IMAGE_TAG}
   
    env_file:
      - .env    

    ports:
      - "127.0.0.1:8000:8000"
    restart: unless-stopped
```

- .env file also in the vm to give the secrets securely to the images.


