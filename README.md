# UntitledElements
HetznerGameJam 2019 - Gunzenhausen, DE
## Installation

Phaser is installed in the Docker container

#### Install the node modules

```bash
npm install
```
#### Fire up the container
```bash
docker-compose up -d
```
#### Check for the Docker IP
```bash
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker-compose ps | awk '/untitledelements/{print$1}')
```
## Contributing
names will be here soooon
## License
[MIT](https://choosealicense.com/licenses/mit/)