# Platoni
## Sobre o projeto
O projeto tem como objetivo hospedar certificados, para que possam ser exibidos no LinkedIn sem realizar autenticação na plataforma que o expediu.

## Tecnologias utilizadas

Este repositório contém apenas o back-end do projeto, e ele foi desenvolvido utilizando:

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![MySQL](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

Além das tecnologias acima, também utilizei o [Cloudinary](https://cloudinary.com/) para hospedagem das imagens, e o [Nodemailer](https://nodemailer.com/) para o serviço de e-mails.

## Documentação
O projeto foi documentado utilizando [Swagger](https://swagger.io/), e caso queira acessar a documentação, basta rodar o projeto e acessar a rota `/api-docs` em seu navagador.

## Como rodar o projeto

### Requisitos
O projeto exige as seguintes tecnologias instaladas:
* [Node](https://nodejs.org/en)
* [MySQL](https://www.mysql.com/)
* [Git](https://git-scm.com/)

### Passo a passo
 Se sua máquina já cumpre os requisitos de instalação, você deve primeiramente clonar este projeto, utilizando o comando `git clone https://github.com/NicolasCoiado/platoni.git` em seu terminal.

* Com o projeto clonado em sua máquina, agora execute o seguinte comando:

    `mysql -u [seu usuario] -p [sua senha]` .

* Ao acessar devidamente o MySQL, você deve criar as tabelas necessárias para o banco de dados, os comandos utilizados para isso, estão presentes no seguinte arquivo: `/src/database/db.txt` .

* Após a criação do seu banco de dados, utilize o comando `exit` para voltar ao terminal inicial.

* Nessa etapa, o que você deve fazer é preencher as informações presentes no arquivo: `/src/config/.end.example`. Este arquivo contém as bases necessárias para que você possa criar seu arquivo [.env](https://www.alura.com.br/artigos/dotenv-gerenciando-variaveis-ambiente).

* Após preencher as informações sensíveis, execute o comando `npm install` e após isso, acesse a pasta src com seu terminal, e execute o comando `node server.js` .

Pronto, agora seu projeto já está em funcionamento :)

## Duvidas
Caso tenha tido alguma dúvida ao tentar executar o projeto, indico os seguintes conteúdos:

Para dúvidas com [Cloudinary](https://cloudinary.com/documentation/node_integration).

Para dúvidas com [NodeMailer](https://www.youtube.com/watch?v=q2sPzKgBMaA).




