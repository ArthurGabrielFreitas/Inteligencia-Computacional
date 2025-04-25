const USE_CLASS_NUMBER_IN_CODE = true;

function main() {
    const config = {
        professores: 10,
        disciplinas: 25,
        horariosPorDia: 4,
        diasPorSemana: 5,
        periodos: 5,
        quantidadeIndividuos: 10,
    };

    const intervaloSemestre = config.horariosPorDia * config.diasPorSemana;

    const populacaoInicial = gerarPopulacaoInicial(
        config.professores,
        config.disciplinas,
        config.horariosPorDia,
        intervaloSemestre,
        config.quantidadeIndividuos
    );

    const avaliacoes = avaliarPopulacao(
        populacaoInicial,
        intervaloSemestre,
        config.periodos
    );

    const populacaoAvaliada = populacaoInicial.map((individuo, index) => ({
        individuo,
        avaliacao: avaliacoes[index],
    }));

    const populacaoOrdenada = populacaoAvaliada.sort((a, b) => a.avaliacao - b.avaliacao);

    const populacaoSelecionada = selecao(populacaoOrdenada);
}

function gerarPopulacaoInicial(
    professores,
    disciplinas,
    horariosPorDia,
    intervaloSemestre,
    quantidadeIndividuos
) {
    const codigosDisciplinas = gerarCodigosDisciplinas(
        professores,
        disciplinas,
        horariosPorDia
    );

    const individuoBase = dividirCodigosPorSemestre(
        codigosDisciplinas,
        intervaloSemestre
    );

    return Array.from({ length: quantidadeIndividuos }, () =>
        embaralharIndividuo(individuoBase)
    );
}

function gerarCodigosDisciplinas(professores, disciplinas, horariosDia) {
    const listCodigos = [];
    let codDis = 0;

    while (codDis < disciplinas) {
        for (let codProf = 0; codProf < professores && codDis < disciplinas; codProf++) {
            for (let j = 0; j < horariosDia; j++) {
                const aula = USE_CLASS_NUMBER_IN_CODE
                    ? `${j}${codProf.toString().padStart(2, "0")}${codDis.toString().padStart(2, "0")}`
                    : `${codProf.toString().padStart(2, "0")}${codDis.toString().padStart(2, "0")}`;
                listCodigos.push(aula);
            }
            codDis++;
        }
    }

    return listCodigos;
}

function dividirCodigosPorSemestre(codigos, intervaloSemestre) {
    const semestres = [];

    for (let i = 0; i < codigos.length; i += intervaloSemestre) {
        semestres.push(codigos.slice(i, i + intervaloSemestre));
    }

    return semestres;
}

function embaralharIndividuo(individuoBase) {
    return individuoBase.flatMap(embaralharSemestre);
}

function embaralharSemestre(semestre) {
    for (let i = semestre.length - 1; i > 0; i--) {
        const indiceAleatorio = Math.floor(Math.random() * (i + 1));
        [semestre[i], semestre[indiceAleatorio]] = [
            semestre[indiceAleatorio],
            semestre[i],
        ];
    }
    return semestre;
}

function avaliarPopulacao(populacao, intervaloSemestre, periodos) {
    return populacao.map((individuo) =>
        avaliarIndividuo(individuo, intervaloSemestre, periodos)
    );
}

function avaliarIndividuo(individuo, intervaloSemestre, periodos) {
    let conflitos = 0;

    for (let i = 0; i < intervaloSemestre; i++) {
        for (let j = 0; j < (periodos - 1) * intervaloSemestre; j += intervaloSemestre) {
            const aula1 = individuo[i + j];
            const professor1 = extrairCodigoProfessor(aula1);

            for (let k = j + intervaloSemestre; k < periodos * intervaloSemestre; k += intervaloSemestre) {
                const aula2 = individuo[i + k];
                const professor2 = extrairCodigoProfessor(aula2);

                if (professor1 === professor2) {
                    conflitos++;
                }
            }
        }
    }

    return conflitos;
}

function extrairCodigoProfessor(aula) {
    return USE_CLASS_NUMBER_IN_CODE ? aula.slice(1, 3) : aula.slice(0, 2);
}

function selecao(populacaoOrdenada) {
    const indice1 = Math.floor((Math.random() * populacaoOrdenada.length) / 2);
    const indice2 = Math.floor(Math.random() * populacaoOrdenada.length);

    return [populacaoOrdenada[indice1], populacaoOrdenada[indice2]];
}

main();
