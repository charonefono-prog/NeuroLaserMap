# NeuroMapper PWA

PWA simples com login/logout e sincronização com backend.

## Instalação

```bash
git clone https://github.com/charonefono-prog/NeuroLaserMap.git
cd NeuroLaserMap
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

**Credenciais de teste:**
- Email: `charonejr@gmail.com`
- Senha: `admin123`

## Produção

```bash
npm start
```

## Funcionalidades

- ✅ Login/Logout com email e senha
- ✅ Sincronização de pacientes com backend
- ✅ Interface responsiva (mobile-first)
- ✅ Service Worker para offline
- ✅ Instalável como app nativo

## Estrutura

```
NeuroLaserMap/
├── server.js          # Servidor Express
├── package.json       # Dependências
└── public/
    ├── index.html     # Interface
    ├── manifest.json  # PWA config
    └── sw.js          # Service Worker
```

## Deploy

Pode ser deployado em qualquer plataforma Node.js (Heroku, Railway, Vercel, etc).
