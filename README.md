# 🎾 Rank-set

> Event-driven microservices platform for managing competitive sports rankings and challenges, designed with scalability, resilience and real-world distributed system patterns.

---

## 🚀 Status do Projeto

![API Gateway CI](https://github.com/GUSTAV0-CRUZ/microservice-rank-set/actions/workflows/api-gateway.yml/badge.svg)
![Status](https://img.shields.io/badge/status-atualizado-brightgreen)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![NestJS](https://img.shields.io/badge/framework-NestJS-red)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![RabbitMQ](https://img.shields.io/badge/messaging-RabbitMQ-orange)
![Tests](https://img.shields.io/badge/tests-Jest-blueviolet)

---

## 📌 Sobre o Projeto

O **Rank-set** é um sistema escalável para gerenciamento de rankings e desafios esportivos, construído com foco em:

- 🔥 Escalabilidade
- 🔗 Desacoplamento
- ⚡ Processamento assíncrono
- 🧱 Arquitetura baseada em microserviços

A aplicação evolui de um modelo monolítico para uma arquitetura distribuída utilizando **NestJS + RabbitMQ**, adotando padrões utilizados em sistemas reais de produção.

---

## 🏗️ Arquitetura

### 📷 Diagrama da Arquitetura

![Arquitetura do Sistema](./docs/architecture.png)

A aplicação é composta por múltiplos microserviços independentes que se comunicam via mensageria (AMQP).

```
Client → API Gateway → RabbitMQ → Microservices
```

### 🔹 Microserviços

- **API Gateway**
  - Entrada única do sistema
  - Autenticação via Supabase
  - Validação JWT
  - Orquestra comunicação com RabbitMQ

- **Micro-Admin**
  - Gerenciamento de jogadores e categorias

- **Micro-Match**
  - Controle de partidas

- **Micro-Ranking**
  - Atualização de rankings em tempo real

- **Micro-Challenge**
  - Fluxo de desafios entre jogadores

- **Micro-Send-Email**
  - Envio de notificações (Mailgun)

---

## 🖥️ Execução em Ambiente Real

### 📦 Containers em execução

![Docker Running](./docs/images/docker-running.png)

A imagem acima demonstra a execução completa do ambiente local utilizando **Docker Compose**, com todos os microserviços ativos e comunicação assíncrona via RabbitMQ.

---

## 🧠 Conceitos Aplicados

- Arquitetura orientada a eventos
- Comunicação assíncrona
- Isolamento de serviços
- Alta resiliência
- Escalabilidade horizontal

---

## 🐳 Execução com Docker

### 📋 Pré-requisitos

- Docker
- Docker Compose

---

### ▶️ Rodando o projeto

```bash
git clone https://github.com/GUSTAV0-CRUZ/microservice-rank-set.git
cd microservice-rank-set
```

```env
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
```

```bash
sudo docker compose up --build
```

---

## 🛠️ Stack Tecnológica

| Categoria        | Tecnologia            |
|-----------------|----------------------|
| Backend         | NestJS               |
| Mensageria      | RabbitMQ (AMQP)      |
| Containerização | Docker + Compose     |
| Banco de Dados  | MongoDB Atlas        |
| Autenticação    | Supabase             |
| Emails          | Mailgun              |
| Imagens         | Cloudinary           |

---

## ⚙️ Decisões de Engenharia

### 🔹 Multi-Stage Builds
- Redução de até **80% no tamanho das imagens**
- Separação entre build e runtime

### 🔹 ACK/NACK (Resiliência)
- `ack` → mensagem processada com sucesso  
- `nack` → reprocessamento automático (`requeue: true`)

### 🔹 Filtro Global de Exceções
- Padronização de erros HTTP
- Tradução de erros entre microserviços

---

## ✅ Qualidade e Testes

Para garantir a integridade de cada microserviço, o projeto utiliza **Jest** para testes automatizados:

- Testes unitários focados na lógica de negócio
- Mocks para isolamento de dependências externas
- Validação de regras críticas (ranking e desafios)

```bash
npm run test
```

---

## 🤖 Integração Contínua (CI)

O projeto utiliza **GitHub Actions** para garantir a qualidade do código:

- Execução automática a cada `push` e `pull request`
- Validação de testes unitários
- Verificação de build Docker

```yaml
Checkout Código -> Setup Node.js -> Install Deps -> Run Tests -> Docker Build Check
```

---

## 🧪 Padrão de Commits

```
feat: nova funcionalidade
fix: correção de bug
refactor: melhoria interna
test: testes
```

---

## 👨‍💻 Autor

<img src="https://github.com/GUSTAV0-CRUZ.png" width="100px;" />

**Gustavo Cruz**  
https://github.com/GUSTAV0-CRUZ
