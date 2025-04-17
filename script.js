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

    populacaoAvaliada.sort((a, b) => a.avaliacao - b.avaliacao);
    console.log(populacaoAvaliada[0]);
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

function gerarCodigosDisciplinas(professores, disciplinas, horariosPorDia) {
    const codigos = [];

    for (let disciplina = 0; disciplina < disciplinas; disciplina++) {
        const codigoDisciplina = disciplina.toString().padStart(2, "0");

        for (let professor = 0; professor < professores; professor++) {
            const codigoProfessor = professor.toString().padStart(2, "0");

            for (let horario = 0; horario < horariosPorDia; horario++) {
                const codigoAula = USE_CLASS_NUMBER_IN_CODE
                    ? `${horario}${codigoProfessor}${codigoDisciplina}`
                    : `${codigoProfessor}${codigoDisciplina}`;
                codigos.push(codigoAula);
            }
        }
    }

    return codigos;
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
    const semestreEmbaralhado = [...semestre];

    for (let i = semestreEmbaralhado.length - 1; i > 0; i--) {
        const indiceAleatorio = Math.floor(Math.random() * (i + 1));
        [semestreEmbaralhado[i], semestreEmbaralhado[indiceAleatorio]] = [
            semestreEmbaralhado[indiceAleatorio],
            semestreEmbaralhado[i],
        ];
    }

    return semestreEmbaralhado;
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

main();
