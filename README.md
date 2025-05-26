# Inteligencia-Computacional

Repositório dos códigos da disciplina de Inteligência Computacional do IFTM/2025

# Algoritmo Genético para Otimização de Horários Acadêmicos

Este projeto é uma interface gráfica em HTML, CSS e JavaScript que executa um algoritmo genético para resolver o problema de choque de horários entre disciplinas e professores.

---

## 🧠 Funcionalidade

O algoritmo genético recebe parâmetros do usuário e tenta encontrar a melhor distribuição de aulas entre os semestres, minimizando o número de choques de horários (situações onde um mesmo professor aparece em horários conflitantes).

---

## 📋 Como Usar

1. **Página Inicial:** Acesse `index.html` e clique no botão "Iniciar".
2. **Formulário de Parâmetros do Problema:**
   - Número de professores, disciplinas, dias e aulas por dia, etc.
3. **Formulário de Algoritmo Genético:**
   - Parâmetros como indivíduos por geração, pontos de corte e probabilidades de cruzamento/mutação.
4. **Resultado:** O melhor indivíduo (solução) será exibido com sua avaliação (quantidade de choques) e geração em que foi encontrado.

---

## 📁 Estrutura de Arquivos
```
.
├── index.html 
├── form.html
├── style.css
├── script.js
├── algoritmo-genetico.js
└── README.md
```

---

## 📌 Requisitos

- Navegador moderno (Chrome, Firefox, Edge, etc.)
- Nenhum backend necessário

---
