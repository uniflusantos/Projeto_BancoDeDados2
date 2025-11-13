# Projeto de Tópicos Avançados de Bancos de Dados

O tema escolhido para o projeto foi um Marketplace Digital, pois, além de ser o tema fornecido como exemplo no repositório da disicplina, o grupo o achou interessante e ideal para aplicar todos os conceitos e conhecimentos abordados nas aulas durante o semestre.

Os bancos de dados utilizdos foram:

**PostgreSQL:** Eleito pelo grupo para ser o banco de dados relacional, guardando os dados dos clientes do Marketplace (como nome, email, senha, etc...). Sua escolhe se deu devido à familiariadade do grupo com as ferramentas (abordadas no semestre anterior), plataforma (Supabase, também utilizada no projeto do semestre anterior) e pela facilidade de tratar dados estruturados.
**MongoDB:** Eleito pelo grupo para o ser o DB1 (banco não relacional 1), guardando os dados dos produtos disponíveis para venda no Marketplace. Sua escolha se deu devido à facilidade para tratar dados não estruturados, além do grupo já ter trabalho com ele em outra disciplina.
**Cassandra:** Eleito pelo grupo para ser o DB2 (banco não relacioanl 2), guardando os dados do histórico de pedidos realizados no Marketplace. Sua escolha se deu devido à facilidade para tratar dados de históricos.

**S1** foi desenvolvido como um front-end que realiza os requests de CRUD através das APIs do S2, que acessam o banco de dados.

O S1 foi desenvolvido em TypeScript com next.js e react, por serem tecnologias nativas com web.

O S2 foi desenvolvido em Python com fastAPI, realizando a comunicação com os banco de dados por meio da ORM sqlmodel, da ODM Beanie e da (inserir o que faz a comunicação com o Cassandra)...
