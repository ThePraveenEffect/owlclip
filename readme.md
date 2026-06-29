OwlClip - Editing long video take hours OwlClip does in minutes.


This project is opensource so you can remove all the ratelimiter and every other things that stop you to not clip unlimited videos you can remove it.
also you can contribute to this project to make it more better engine for creators who have not much time to edit short videos.


Note: 
youtube block you to download video from their platform. and also owlclip not violate their policy. we made OwlClip because individual creator don't have much time to edit short and long videos both. 

we recommend to clip only your own long video to respect other creators value and respect to youtube policy and copyrights.

## How to use OwlClip.

you have to pull the repo from my github profile.


command :- 

```
git clone https://github.com/ThePraveenEffect/owlclip.git
```
This clones the repo on your laptop/pc.

now you have got two folders :

- owlclip_frontend 
- owlclip_backend_new


- owlclip_frontend: 

You must have pnpm installed to use it. 

```
npm install -g pnpm 
```

you can also use npm but have to do some extra things.
whatever you prefer use it. 

Installed the configuration that all in package.json : 

```
pnpm install
```
or 
```
npm install
```

make your frontend run by this command:

using pnpm : 

```
pnpm dev
```
using npm : 

```
npm dev
```

This start frontend now after it the main thing you have to start is the backend and need some configuration to use it.

Note :

you can remove services like ratelimiter , auth, database, queue, payments, 
worker etc. to make it work on your pc and you can use that engine.

You also need groq api to make it work. 

- owlclip_backend_new :

To start backend we just need to install the configurations as well you must have uv package manager installed. 

You must know how to use that uv properly and that is very best package manager like pnpm in nodejs. 

This install all the configurations that are in the pyproject.toml file and also create a .venv 

```
uv sync --frozen
```

now for window you have to run like this :



PowerShell: 
```
.venv\Scripts\Activate.ps1
```

Bash: 
```
source .venv/Scripts/activate
```

For linux :

```
source .venv/bin/activate
```


now after this you will see the terminal prompt looks like this : 

== (owlclip_backend_new) CodeVeen@antix1:~/OwlClip_C/owlclip_backend_new ==

Then you can run the backend :

```
uvicorn app.main:app --reload 
```

then your both frontend and backend runs properly but you may face some problems because of may be the cors or some db problem.

I recommend you to remove the auth, payments, database all of things then you add a groq api key.

but those who are terminal nerds or use the postman they can also do it much far away. 

also use ai to learn whatever inside my code and see the architecture. 

we've love your support and your suggestion for this project. 

If any issue you can contact us - 

```
thepraveeneffect@gmail.com
```

Thanks for reading it.
