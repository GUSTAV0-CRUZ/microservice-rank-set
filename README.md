# 🎾 Rank-set

> Sistema de gestão de rankings e desafios esportivos com arquitetura de microserviços orientada a eventos.

---

## 🚀 Status do Projeto

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

A aplicação evolui de um modelo monolítico para uma arquitetura distribuída utilizando **NestJS + RabbitMQ**.

---

## 🏗️ Arquitetura

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

#### 1. Clone o repositório

```bash
git clone https://github.com/GUSTAV0-CRUZ/microservice-rank-set.git
cd microservice-rank-set
```

#### 2. Configure o `.env`

```env
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
```

#### 3. Suba os containers

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

---

### 🔹 ACK/NACK (Resiliência)

- `ack` → mensagem processada com sucesso  
- `nack` → reprocessamento automático (`requeue: true`)

---

### 🔹 Filtro Global de Exceções

- Padronização de erros HTTP
- Tradução de erros entre microserviços

---

## ✅ Qualidade e Testes

Para garantir a integridade de cada microserviço, o projeto utiliza **Jest** para testes automatizados:

- **Testes Unitários:** Focados na lógica de negócio dos `Services`
- **Mocks:** Isolamento total de dependências externas (Banco de Dados e RabbitMQ)
- **Garantia de Fluxo:** Validação de regras críticas como cálculo de ranking e expiração de desafios

### ▶️ Rodar testes

```bash
# Dentro da pasta de qualquer microserviço
npm run test
```

---

## 🧪 Padrão de Commits

Este projeto segue **Conventional Commits**:

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
🔗 https://github.com/GUSTAV0-CRUZ
