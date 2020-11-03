# mfd-web
Web/webservice component of the mobile field demo



### Building the web container
Make sure you are in the ```web``` directory.


```
docker build .
```
Assuming things went well, the last message of the ```build``` command should give you the id of the new image.  It should look something like ...

```
Successfully built e26804129abc
```
where ```e26804129abc``` is the containerId.

Tag the newly created with a suitable tag.

```
docker tag <containerId> escapedcanadian/mfd-web:<tag> 
```

If this is to be the ```latest``` version of the container, also add the latest tag.
```
docker tag <containerId> escapedcanadian/mfd-web:latest 
```

Push the new container to the docker hub (you may need appropriate credentials).

```
docker push escapedcanadian/mfd-web:<tag>
docker push escapedcanadian/mfd-web:latest
```
