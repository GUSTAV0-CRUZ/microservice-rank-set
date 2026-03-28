# 🎾 Rank-set: Microservices & Messaging Architecture

Sistema de gestão de rankings e desafios esportivos escalável, construído com **NestJS** e arquitetura baseada em eventos via **RabbitMQ**. O projeto demonstra a transição de uma arquitetura monolítica para microserviços, focando em resiliência, desacoplamento e observabilidade.

---

## 🏗️ Arquitetura do Sistema

A aplicação foi decomposta em serviços especializados que se comunicam de forma assíncrona. Essa abordagem garante que falhas em serviços periféricos (como o envio de e-mails) não interrompam o fluxo principal de criação de partidas ou gestão de usuários.

### Microserviços:
* **API Gateway:** Ponto único de entrada. Centraliza a autenticação (Supabase) e distribui comandos para os microserviços via RabbitMQ.
* **Micro-Match:** Gerencia o ciclo de vida das partidas e desafios. Dispara eventos ao finalizar confrontos.
* **Micro-Ranking:** O "motor" de pontuação. Reage a eventos de partidas para atualizar as posições dos jogadores em tempo real.
* **Micro-Admin:** Cadastro base de categorias, jogadores e regras de negócio.
* **Micro-Send-Email:** Serviço de notificação isolado, integrado ao **Mailgun**.

---

## 🛠️ Stack Tecnológica

* **Framework:** [NestJS](https://nestjs.com/)
* **Message Broker:** [RabbitMQ](https://www.rabbitmq.com/) (Protocolo AMQP)
* **Banco de Dados:** [MongoDB](https://www.mongodb.com/) (Flexibilidade de documentos e velocidade de escrita)
* **Provedores Cloud:** * **Mailgun:** Disparo de e-mails transacionais.
    * **Cloudinary:** Gerenciamento e persistência de imagens.
    * **Supabase:** Autenticação e storage.
* **Testes:** Jest (Testes unitários e de integração nos Services).

---

## 🚀 Decisões de Engenharia & Patterns

### 1. Comunicação Baseada em Eventos (Event-Driven)
Diferente do monólito original, os serviços são desacoplados. Quando um desafio é concluído no `micro-match`, ele emite um evento que o `micro-ranking` consome. Isso garante que o sistema de ranking possa escalar independentemente.

### 2. Resiliência com ACK/NACK
Foi implementado o controle manual de confirmação de mensagens:
* **Sucesso:** A mensagem é removida da fila apenas após o processamento completo (`channel.ack`).
* **Falhas Retentáveis:** Em erros de infraestrutura (ex: instabilidade na API do Mailgun), a mensagem recebe um `nack` e volta para a fila (`requeue: true`) para ser reprocessada automaticamente.

### 3. Design Patterns Aplicados
* **Factory & Strategy:** Utilizados no cálculo de scores para selecionar a operação aritmética (vitória, derrota, líder) baseada na categoria.
* **Repository Pattern:** Isolamento da camada de dados, facilitando a manutenção e a criação de mocks para testes unitários.
* **Adapter:** Padronização da interface de comunicação com serviços externos como Mailgun e Cloudinary.

---

## 🧠 Desafios Superados & Aprendizados

* **Rastreabilidade:** O desafio de rastrear o fluxo de uma mensagem entre múltiplos serviços. Resolvido através de logs estruturados utilizando o `Logger` nativo do NestJS com metadados de contexto (`methodName`, `stack`).
* **Consistência Eventual:** Entender que, em microserviços, os dados podem levar milissegundos para se sincronizarem entre serviços, e como projetar a interface para lidar com isso.
* **Gestão de Erros:** Diferenciar erros de negócio (que não devem ser reprocessados) de erros de rede (que exigem retry na fila).

---

## 👨‍💻 Autor

| [<img src="https://github.com/GUSTAV0-CRUZ.png" width="100px;"/><br /><sub><b>Gustavo Cruz</b></sub>](https://github.com/GUSTAV0-CRUZ) |
| :---: |

Projeto desenvolvido por Gustavo Cruz (GUSTAV0-CRUZ).
