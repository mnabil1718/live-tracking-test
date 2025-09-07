## Run
```
docker-compose up --build
```

## Shutdown
```
docker-compose down
```

## Architecture
Use Clean/Hexagon Architecture

- Domains -> Entity, Repo Interface, Business Core Entities
- Applications -> Use cases
- Infrastructure -> impl. of interfaces, concrete of domains/applications
- Interfaces -> Connector between infrastructure and applications
- Commons -> utility & shared helpers