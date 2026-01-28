# Cotraveller

## Requirements

- For easy and hassle-free dev, make sure to have docker installed and running
- Project is not optimized for non-docker environment and may cause some features to break

### TLDR: Docker is highly recommended

## How To Run?

### Pre-Dev-Setup (Needed after first setup or when coming after long time)

```bash
npm run setup
```

### Start dev

```bash
npm run dev
```

- This will start the client and the server, and a reverse proxy so that you can directly [Open website here](http://localhost)

## Important things to note

### Installing new packages

- Whenever installing any new package, you must restart the particular container
- For eg: After installing axios in client , u must restart client by :
  - Manually using docker app
  - Using command in client dir:

```bash
npm run rs
```

- Using command at root dir:

``` bash
 npm run rs-client
```

- Same goes with server, however for nginx , you can only use 1st and 3rd method

### Viewing logs

#### Methods

- Use docker app
- Run at root dir

```bash
     npm run logs-client
```

```bash
     npm run logs-server
```

```bash
     npm run logs-nginx
```

- Run in client or server

```bash
    npm run logs
```

## Frontend Docs

- [Architecture](client/docs/ARCHITECTURE.md)
- [Routing](client/docs/ROUTING.md)
- [Folder Structure](client/docs/FOLDER_STRUCTURE.md)
- [Rules](client/docs/RULES.md)
