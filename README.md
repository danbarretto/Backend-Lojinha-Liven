# Projeto Backend para Lojinha - Liven
Author: Daniel Sá Barretto
---
---

Este projeto é uma API REST simples para cadastro e gerenciamento de usuários e seus endereços. O projeto foi desenvolvido utilizando Node.js com Typescript, Objection js para ORM, Knex para migrations e Query Building e MySQL para banco de dados.

## Execução
Para executar este projeto, instale as dependências com:
```bash
    yarn install
```
E configure um arquivo ```.env``` na pasta raiz do diretório com as seguintes variáveis:

```.env
DB_HOST=x.x.x.x #O endereço de host do banco de dados
DB_USER=xxxx    #O usuário da banco de dados
DB_PASS=xxxx    #A senha deste usuário
DB_DATABASE=xxx #O nome do banco de dados escolhido
SECRET_JWT=xxxx #A string segredo para a assinatura do JWT
HASH_SALT_ROUNDS=xx #Quantidade de salt rounds para realizar a hash das senhas dos usuários
```

Feito isto, execute as migrations do banco de dados com o seguinte comando:
```bash
    npx knex migrate:latest
```

Caso deseje executar localmente em modo de desenvolvimento, execute:
```bash
    yarn dev
```

## Compilação

Para compilar este projeto, execute:
```bash
    npm run build
    #ou
    yarn build
```

Finalmente para executar a versão compilada, execute:
```bash
    npm start
    #ou
    yarn start
```