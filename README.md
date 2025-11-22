# PorttuSmart - Sistema de Gestão Condominial

> Sistema web completo para gestão de condomínios desenvolvido como projeto integrador V

## 📋 Sobre o Projeto

O **PorttuSmart** é uma plataforma digital moderna que facilita a administração de condomínios, oferecendo ferramentas específicas para síndicos/gestores e moradores. O sistema permite gerenciar desde comunicados e reservas até controle financeiro e de visitantes.

## 🚀 Funcionalidades

### 👥 Para Moradores
- **Dados Pessoais**: Atualização de cadastro
- **Veículos**: Gerenciamento de veículos cadastrados
- **Áreas Comuns**: Reserva de espaços (salão de festas, churrasqueira, etc.)
- **Entregas**: Controle de encomendas e entregas
- **Documentos**: Acesso a documentos do condomínio
- **Comunicados**: Visualização de avisos e informações
- **Mensagens**: Sistema de comunicação com a administração
- **Notificações**: Alertas em tempo real

### 🏢 Para Síndicos/Gestores
- **Moradores**: Cadastro e histórico de moradores
- **Visitantes**: Controle de entrada e saída
- **Veículos**: Gerenciamento de veículos de moradores
- **Entregas**: Cadastro e histórico de entregas
- **Reservas**: Aprovação e controle de reservas
- **Financeiro**: Gestão de boletos e pagamentos
- **Ocorrências**: Registro e acompanhamento de manutenções
- **Comunicados**: Criação e envio de avisos
- **Mensagens**: Central de atendimento aos moradores
- **Multi-condomínios**: Gestão de múltiplos condomínios

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura das páginas
- **CSS3**: Estilização e responsividade
- **JavaScript (ES6+)**: Lógica de negócio e interações
- **Fetch API**: Comunicação com backend
- **LocalStorage**: Armazenamento local de dados

### Backend/API
- **API REST**: `https://api.porttusmart.tech/api/v1/`
- **Autenticação JWT**: Sistema de tokens de acesso
- **PostgreSQL**: Banco de dados (estrutura em `porttusmart_banco.txt`)

## 📁 Estrutura do Projeto

```
Site-Condomino-PIV/
├── assets/
│   ├── css/
│   │   ├── telasmorador/          # Estilos específicos do morador
│   │   ├── telassindico/          # Estilos específicos do síndico
│   │   ├── homemorador.css        # Dashboard do morador
│   │   ├── homesindico.css        # Dashboard do síndico
│   │   ├── login.css              # Tela de login
│   │   └── ia_chatbot.css         # Interface do chatbot
│   ├── img/
│   │   ├── fundo-login.png        # Background da tela de login
│   │   └── logoinit.jpeg          # Logo da aplicação
│   └── js/
│       ├── telasmorador/          # Scripts específicos do morador
│       │   ├── comunicados/
│       │   ├── dados/
│       │   ├── documentos/
│       │   ├── mensagens/
│       │   ├── pedidos/
│       │   ├── reservas/
│       │   └── veiculos/
│       ├── telassindico/          # Scripts específicos do síndico
│       │   ├── comunicados/
│       │   ├── mensagens/
│       │   ├── morador/
│       │   ├── ocorrencia/
│       │   ├── pedidos/
│       │   ├── reservas/
│       │   ├── veiculos/
│       │   └── visitante/
│       ├── login.js               # Autenticação
│       ├── logout.js              # Encerramento de sessão
│       └── mobile.js              # Responsividade mobile
├── pages/
│   ├── cadastrese.html            # Cadastro de usuários
│   ├── esqueceusenha.html         # Recuperação de senha
│   ├── homemorador.html           # Dashboard do morador
│   ├── homesindico.html           # Dashboard do síndico
│   └── logout.html                # Página de logout
├── index.html                     # Página de login principal
├── porttusmart_banco.txt          # Estrutura do banco de dados
└── README.md                      # Documentação do projeto
```

## 🔧 Instalação e Configuração

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional para desenvolvimento)
- Conexão com internet (para API)

### Executando o Projeto

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd Site-Condomino-PIV
   ```

2. **Abra o projeto**
   - Abra o arquivo `index.html` diretamente no navegador, ou
   - Use um servidor local (Live Server, Python HTTP Server, etc.)

3. **Acesse a aplicação**
   - URL: `http://localhost:porta` ou arquivo local
   - Faça login com credenciais válidas

## 🔐 Autenticação

O sistema utiliza autenticação JWT com os seguintes endpoints:

- **Login**: `POST /api/v1/auth/login/`
- **Dados do usuário**: `GET /api/v1/users/persons/me/`
- **Refresh token**: `POST /api/v1/auth/refresh/`

### Tipos de Usuário
- **Morador/Resident**: Acesso ao painel do morador
- **Síndico/Admin**: Acesso ao painel de gestão

## 📱 Responsividade

O sistema é totalmente responsivo, adaptando-se a:
- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptado com menu colapsável
- **Mobile**: Interface otimizada para toque

## 🗄️ Banco de Dados

O sistema utiliza PostgreSQL com as seguintes entidades principais:

- **Condomínio**: Dados dos condomínios
- **Usuário**: Informações de login e perfil
- **Morador**: Dados específicos dos moradores
- **Visitante**: Controle de acesso
- **Veículo**: Cadastro de veículos
- **Área Comum**: Espaços para reserva
- **Reserva**: Agendamentos de áreas
- **Financeiro**: Controle de pagamentos
- **Ocorrência**: Registro de problemas/manutenções
- **Comunicado**: Avisos e informações
- **Mensagem**: Sistema de comunicação

## 🔄 Fluxo de Navegação

1. **Login** (`index.html`) → Autenticação
2. **Dashboard** → Redirecionamento baseado no tipo de usuário
3. **Módulos** → Acesso às funcionalidades específicas
4. **Logout** → Encerramento seguro da sessão

## 🎨 Padrões de Design

- **Cores**: Paleta azul/branco para transmitir confiança
- **Tipografia**: Fontes legíveis e hierarquia clara
- **Ícones**: Emojis e símbolos intuitivos
- **Layout**: Grid responsivo com sidebar colapsável
- **UX**: Interface intuitiva com feedback visual

## 🚧 Desenvolvimento

### Estrutura Modular
Cada funcionalidade é organizada em módulos com:
- **API**: Comunicação com backend (`api*.js`)
- **Telas**: Renderização de interfaces (`telas*.js`)
- **Main**: Inicialização e controle (`main.js`)

### Convenções
- Nomes de arquivos em português
- Comentários explicativos no código
- Separação clara entre lógica e apresentação
- Tratamento de erros consistente

## 📞 Suporte

Para dúvidas ou problemas:
- Consulte a documentação da API
- Verifique o console do navegador para erros
- Analise os logs de rede para problemas de conectividade

## 📄 Licença

Projeto desenvolvido para fins acadêmicos - Projeto Integrador V

---

**PorttuSmart** - Facilitando a gestão condominial com tecnologia moderna 🏢✨