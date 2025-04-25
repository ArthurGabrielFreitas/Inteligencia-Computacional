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

    // console.log(populacaoAvaliada);

    const populacaoOrdenada = ordenacaoMergeSort(populacaoAvaliada);

    // console.log(populacaoOrdenada);

    // const populacaoOrdenadaNativa = ordenacaoNativa(populacaoAvaliada);

    // console.log(populacaoOrdenadaNativa);

    const populacaoSelecionada = selecao(populacaoOrdenada);

    console.log(populacaoSelecionada);
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
        // Lógica para comparar as aulas de semestres seguintes (2 x 3, 2 x 4, etc)
        for (
            let j = 0;
            j < (periodos - 1) * intervaloSemestre;
            j += intervaloSemestre
        ) {
            let numeroPrimeiraAula = i + j;
            let aula1 = individuo[numeroPrimeiraAula];
            let professor1;
            if (indicadorNumeroAula) {
                professor1 = aula1.slice(1, 3);
            } else {
                professor1 = aula1.slice(0, 2);
            }
            // Lógica para definir as aulas dos semestres seguintes
            for (
                let k = j;
                k < periodos * intervaloSemestre;
                k += intervaloSemestre
            ) {
                if (k == j) {
                    continue;
                }
                let numeroProximaAula = i + k;
                const aula2 = individuo[numeroProximaAula];
                let professor2;
                if (indicadorNumeroAula) {
                    professor2 = aula2.slice(1, 3);
                } else {
                    professor2 = aula2.slice(0, 2);
                }
                if (professor1 == professor2) {
                    avaliacao++;
                    // Mostra no console as aulas com mesmo professor para conferência manual
                    // console.log(aula1 + " " + aula2);
                    // console.log(i + 1, numeroProximaAula + 1);
                    // console.log(avaliacao);
                }
            }
        }
    }

    return conflitos;
}

function extrairCodigoProfessor(aula) {
    return USE_CLASS_NUMBER_IN_CODE ? aula.slice(1, 3) : aula.slice(0, 2);
}

function ordenacaoMergeSort(populacao) {
    if (populacao.length == 1) {
        return populacao;
    }
    const metadeVetorInicial = Math.floor(populacao.length / 2);
    const vetor1 = ordenacaoMergeSort(populacao.slice(0, metadeVetorInicial));
    const vetor2 = ordenacaoMergeSort(populacao.slice(metadeVetorInicial));
    const resultado = [];

    while (vetor1.length > 0 && vetor2.length > 0) {
        if (vetor1[0].avaliacao <= vetor2[0].avaliacao) {
            resultado.push(vetor1.shift());
        } else {
            resultado.push(vetor2.shift());
        }
    }

    return resultado.concat(vetor1).concat(vetor2);
}

function ordenacaoNativa(populacao) {
    return populacao.sort((a, b) => a.avaliacao - b.avaliacao);
}

function selecao(populacaoOrdenada) {
    const numeroAleatorio1 = Math.floor(
        (Math.random() * populacaoOrdenada.length) / 2
    );
    const numeroAleatorio2 = Math.floor(
        Math.random() * populacaoOrdenada.length
    );

    const populacaoSelecionada = [
        populacaoOrdenada[numeroAleatorio1],
        populacaoOrdenada[numeroAleatorio2],
    ];

    return populacaoSelecionada;
}

main();
