const indicadorNumeroAula = true;
function main() {
    const professores = 10;
    const disciplinas = 25;
    const horariosDia = 4;
    const diasSemana = 5;
    const periodos = 5;
    const intervaloSemestre = horariosDia * diasSemana;
    const quantidadeIndividuos = 10;

    const populacaoAleatorizada = popInicial(
        professores,
        disciplinas,
        horariosDia,
        intervaloSemestre,
        quantidadeIndividuos
    );

    // console.log(populacaoAleatorizada);
    
    const avaliacoes = avaliacao(
        populacaoAleatorizada,
        intervaloSemestre,
        periodos
    );

    // console.log(avaliacoes);

    const populacaoAvaliada = populacaoAleatorizada.map((pop, i) => ({
        populacao: pop,
        avaliacao: avaliacoes[i],
    }));

    console.log(populacaoAvaliada);

    // Ordena a população pela avaliação (menor valor é melhor)
    populacaoAvaliada.sort((a, b) => a.avaliacao - b.avaliacao);
    console.log(populacaoAvaliada[0]);
}

function popInicial(
    professores,
    disciplinas,
    horariosDia,
    intervaloSemestre,
    quantidadeIndividuos
) {
    const listaCodigosDisciplinas = gerarCodigosDisciplinas(
        professores,
        disciplinas,
        horariosDia
    );
    const individuo = gerarIndividuo(
        listaCodigosDisciplinas,
        intervaloSemestre
    );
    const populacaoAleatorizada = gerarPopulacaoAleatorizada(
        individuo,
        quantidadeIndividuos
    );

    return populacaoAleatorizada;
}

function gerarCodigosDisciplinas(professores, disciplinas, horariosDia) {
    let codProf = "00";
    let codDis = "00";
    let listCodigos = [];
    do {
        codProf = "00";
        for (let i = 0; i < professores; i++) {
            if (parseInt(codDis) == disciplinas) {
                break;
            }
            for (let j = 0; j < horariosDia; j++) {
                let aula;
                if (indicadorNumeroAula) {
                    aula = j + codProf + codDis;
                } else {
                    aula = codProf + codDis;
                }
                listCodigos.push(aula);
            }
            let numeroProf = parseInt(codProf, 10) + 1;
            let numeroDis = parseInt(codDis, 10) + 1;
            codProf = numeroProf.toString().padStart(2, "0");
            codDis = numeroDis.toString().padStart(2, "0");
        }
    } while (parseInt(codDis) < disciplinas);
    return listCodigos;
}

function gerarIndividuo(listaCodigos, horariosSemana) {
    const codigosSemestre = [];
    for (let i = 0; i < listaCodigos.length; i += horariosSemana) {
        codigosSemestre.push(listaCodigos.slice(i, i + horariosSemana));
    }
    return codigosSemestre;
}

function gerarPopulacaoAleatorizada(individuo, quantidadeIndividuos) {
    const matrizPopulacao = [];
    for (let i = 0; i < quantidadeIndividuos; i++) {
        matrizPopulacao.push(gerarIndividuoAleatorizado(individuo));
    }
    return matrizPopulacao;
}

function gerarIndividuoAleatorizado(individuo) {
    const individuoAleatorizado = [];
    for (let i = 0; i < individuo.length; i++) {
        let semestreAleatorizado = gerarSemestreAleatorizado(individuo[i]);
        individuoAleatorizado.push(...semestreAleatorizado);
    }
    return individuoAleatorizado;
}

function gerarSemestreAleatorizado(semestre) {
    const semestreAleatorizado = [];
    let indiceAleatorio = 0;
    const semestreAux = [...semestre];
    while (semestreAux.length > 0) {
        indiceAleatorio = Math.floor(Math.random() * semestreAux.length);
        semestreAleatorizado.push(semestreAux[indiceAleatorio]);
        semestreAux.splice(indiceAleatorio, 1);
    }
    return semestreAleatorizado;
}

function avaliacao(populacaoAleatorizada, intervaloSemestre, periodos) {
    const avaliacoes = [];
    for (let i = 0; i < populacaoAleatorizada.length; i++) {
        let avaliacaoIndividuo = avaliaIndividuo(
            populacaoAleatorizada[i],
            intervaloSemestre,
            periodos
        );
        avaliacoes.push(avaliacaoIndividuo);
    }
    return avaliacoes;
}

function avaliaIndividuo(individuo, intervaloSemestre, periodos) {
    let avaliacao = 0;
    // Define que serão consideradas as aulas do primeiro semestre (1 x 2, 1 x 3, etc)
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
                    // console.log(aula1 + " " + aula2);
                    // console.log(i + 1, numeroProximaAula + 1);
                    // console.log(avaliacao);
                }
            }
        }
    }
    // console.log("Avaliação final do indivíduo: ", avaliacao);
    return avaliacao;
}

main();
