const title = document.querySelector("title");
const header = document.querySelector("header");
const form1 = document.getElementById("formParametros1");
const form2 = document.getElementById("formParametros2");
const resultadoDiv = document.getElementById("resultado");

let parametrosProblema = {};

form1.addEventListener("submit", function (e) {
    e.preventDefault();
    const dados = new FormData(form1);
    dados.forEach((valor, chave) => {
        if (Number(valor)) {
            parametrosProblema[chave] = Number(valor);
        } else {
            if (valor === "true") {
                parametrosProblema[chave] = true;
            } else if (valor === "false") {
                parametrosProblema[chave] = false;
            } else {
                parametrosProblema[chave] = valor;
            }
        }
    });
    form1.classList.add("hidden");
    form2.classList.remove("hidden");
});

form2.addEventListener("submit", function (e) {
    e.preventDefault();
    const dados = new FormData(form2);
    dados.forEach((valor, chave) => {
        if (Number(valor)) {
            parametrosProblema[chave] = Number(valor);
        } else {
            if (valor === "true") {
                parametrosProblema[chave] = true;
            } else if (valor === "false") {
                parametrosProblema[chave] = false;
            } else {
                parametrosProblema[chave] = valor;
            }
        }
    });
    form2.classList.add("hidden");
    title.innerText = "Resultados - Algoritmo Genético";
    header.getElementsByTagName("h1")[0].innerText =
        "Resultados do Algoritmo Genético";

    const resultado = algoritmoGenetico(parametrosProblema);

    resultadoDiv.innerHTML = `
    <h2>Melhor Solução Encontrada</h2>
    <p><strong>Avaliação:</strong> ${resultado.avaliacao}</p>
    <p><strong>Geração:</strong> ${resultado.geracao}</p>
    <h3>Distribuição de Aulas:</h3>
    ${gerarTabela(resultado.populacao, parametrosProblema)}
  `;
});

function gerarTabela(populacao, params) {
    const { periodos, diasSemana, horariosDia } = params;
    const linhas = [];

    for (let p = 0; p < periodos; p++) {
        linhas.push(`<h4>Período ${p + 1}</h4>`);
        linhas.push("<table><tr>");

        for (let d = 0; d < diasSemana; d++) {
            linhas.push(`<th>Dia ${d + 1}</th>`);
        }

        linhas.push("</tr>");
        for (let a = 0; a < horariosDia; a++) {
            linhas.push("<tr>");
            for (let d = 0; d < diasSemana; d++) {
                const index =
                    p * diasSemana * horariosDia + d * horariosDia + a;
                const codigo = populacao[index] || "-----";
                const aula = formatarCodigo(codigo);
                linhas.push(`<td>${aula}</td>`);
            }
            linhas.push("</tr>");
        }
        linhas.push("</table>");
    }

    return linhas.join("");
}

function formatarCodigo(codigo) {
    if (typeof codigo !== "string" || codigo.length < 5) {
        const parte1 = codigo.slice(0, 2);
        const parte2 = codigo.slice(2);
        return `Prof: ${parte1} | Disc: ${parte2}`;
    }
    const parte1 = codigo[0];
    const parte2 = codigo.slice(1, 3);
    const parte3 = codigo.slice(3);
    return `#${parte1} | Prof: ${parte2} | Disc: ${parte3}`;
}
