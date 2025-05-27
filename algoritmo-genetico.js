function algoritmoGenetico(parametrosProblema) {
    const professores = parametrosProblema.professores;
    const disciplinas = parametrosProblema.disciplinas;
    const horariosDia = parametrosProblema.horariosDia;
    const diasSemana = parametrosProblema.diasSemana;
    const periodos = parametrosProblema.periodos;
    const indicadorNumeroAula = parametrosProblema.indicadorNumeroAula;
    const intervaloSemestre = diasSemana * horariosDia;
    const quantidadeIndividuos = parametrosProblema.quantidadeIndividuos;
    const maxGeracoes = parametrosProblema.maxGeracoes;
    const selecaoElitizada = parametrosProblema.selecaoElitizada;
    const pontosDeCorte = parametrosProblema.pontosDeCorte;
    const pc = parametrosProblema.pc;
    const pm = parametrosProblema.pm;

    const populacaoAleatorizada = popInicial(
        professores,
        disciplinas,
        horariosDia,
        intervaloSemestre,
        quantidadeIndividuos,
        indicadorNumeroAula
    );

    // const listaMelhoresSolucoes = [];

    let melhorSolucao = { avaliacao: Infinity, geracao: 0, populacao: [] };

    // console.log(populacaoAleatorizada);

    let geracoes = 0;
    let proximaGeracao = [];

    while (geracoes < maxGeracoes) {
        let populacaoAtual = [];

        if (geracoes == 0) {
            populacaoAtual = populacaoAleatorizada;
        } else {
            populacaoAtual = proximaGeracao;
            proximaGeracao = [];
        }

        const populacaoAvaliada = avaliacao(
            populacaoAtual,
            intervaloSemestre,
            periodos,
            indicadorNumeroAula
        );

        // console.log(populacaoAvaliada);

        const populacaoAvaliadaOrdenada = ordenacaoMergeSort(populacaoAvaliada);

        // console.log("População ordenada: ", populacaoAvaliadaOrdenada);

        const populacaoOrdenada = [];

        // Transforma o array de objetos em um array simples, sem o atributo de avaliação
        populacaoAvaliadaOrdenada.forEach((ind) => {
            populacaoOrdenada.push(ind.populacao);
        });

        // console.log(populacaoOrdenada);

        // const populacaoOrdenadaNativa = ordenacaoNativa(populacaoAvaliada);

        // console.log(populacaoOrdenadaNativa);

        // listaMelhoresSolucoes.push({
        //     ...populacaoAvaliadaOrdenada[0],
        //     geracao: geracoes,
        // });

        if (populacaoAvaliadaOrdenada[0].avaliacao == 0) {
            // console.log("Indivíduo com zero choques encontrado!");
            populacaoAvaliadaOrdenada[0].geracao = geracoes;
            // console.log(populacaoAvaliadaOrdenada[0]);
            return populacaoAvaliadaOrdenada[0];
        }

        if (populacaoAvaliadaOrdenada[0].avaliacao < melhorSolucao.avaliacao) {
            melhorSolucao = populacaoAvaliadaOrdenada[0];
            melhorSolucao.geracao = geracoes;
        }

        geracoes++;

        while (proximaGeracao.length < quantidadeIndividuos) {
            const individuosSelecionados = selecao(
                populacaoOrdenada,
                selecaoElitizada
            );

            // console.log(individuosSelecionados);

            const individuosCruzados = cruzamento(
                individuosSelecionados,
                intervaloSemestre,
                periodos,
                pontosDeCorte,
                pc
            );

            // console.log(individuosCruzados);

            const individuosMutados = mutacao(
                individuosCruzados,
                intervaloSemestre,
                periodos,
                pm
            );

            // console.log(individuosMutados);

            proximaGeracao.push(...individuosMutados);
        }
        // console.log("próxima geração: ", proximaGeracao);
    }
    // console.log("Número máximo de gerações atingido! ");

    const ultimaPopulacaoAvaliada = avaliacao(
        proximaGeracao,
        intervaloSemestre,
        periodos,
        indicadorNumeroAula
    );

    const ultimaPopulacaoAvaliadaOrdenada = ordenacaoMergeSort(
        ultimaPopulacaoAvaliada
    );

    // Caso siga o método de manter a lista de melhores indivíduos:

    // listaMelhoresSolucoes.push(ultimaPopulacaoAvaliadaOrdenada[0]);

    // console.log(listaMelhoresSolucoes);

    // const listaMelhoresSolucoesAvaliada = avaliacao(
    //     listaMelhoresSolucoes,
    //     intervaloSemestre,
    //     periodos,
    //     indicadorNumeroAula
    // );
    // const listaMelhoresSolucoesAvaliadaOrdenada = ordenacaoMergeSort(
    //     listaMelhoresSolucoesAvaliada
    // );

    // console.log("População ordenada: ", listaMelhoresSolucoesAvaliadaOrdenada[0]);

    // return listaMelhoresSolucoesAvaliadaOrdenada[0];

    // Caso siga o método de manter apenas o melhor indivíduo:

    // console.log(ultimaPopulacaoAvaliadaOrdenada[0]);

    if (
        ultimaPopulacaoAvaliadaOrdenada[0].avaliacao < melhorSolucao.avaliacao
    ) {
        melhorSolucao = ultimaPopulacaoAvaliadaOrdenada[0];
        melhorSolucao.geracao = geracoes;
    }

    // console.log("Melhor solução encontrada: ", melhorSolucao);

    return melhorSolucao;
}

function popInicial(
    professores,
    disciplinas,
    horariosDia,
    intervaloSemestre,
    quantidadeIndividuos,
    indicadorNumeroAula
) {
    const listaCodigosDisciplinas = gerarCodigosDisciplinas(
        professores,
        disciplinas,
        horariosDia,
        indicadorNumeroAula
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

function gerarCodigosDisciplinas(
    professores,
    disciplinas,
    horariosDia,
    indicadorNumeroAula
) {
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

function avaliacao(
    populacaoAleatorizada,
    intervaloSemestre,
    periodos,
    indicadorNumeroAula
) {
    const avaliacoes = [];
    const populacaoAvaliada = [];
    if (!Array.isArray(populacaoAleatorizada[0])) {
        for (let i = 0; i < populacaoAleatorizada.length; i++) {
            let avaliacaoIndividuo = avaliaIndividuo(
                populacaoAleatorizada[i].populacao,
                intervaloSemestre,
                periodos,
                indicadorNumeroAula
            );
            avaliacoes.push(avaliacaoIndividuo);
        }
        populacaoAvaliada.push(
            ...populacaoAleatorizada.map((pop, i) => ({
                ...pop,
                avaliacao: avaliacoes[i],
            }))
        );
    } else {
        for (let i = 0; i < populacaoAleatorizada.length; i++) {
            let avaliacaoIndividuo = avaliaIndividuo(
                populacaoAleatorizada[i],
                intervaloSemestre,
                periodos,
                indicadorNumeroAula
            );
            avaliacoes.push(avaliacaoIndividuo);
        }
        populacaoAvaliada.push(
            ...populacaoAleatorizada.map((pop, i) => ({
                populacao: pop,
                avaliacao: avaliacoes[i],
            }))
        );
    }

    return populacaoAvaliada;
}

function avaliaIndividuo(
    individuo,
    intervaloSemestre,
    periodos,
    indicadorNumeroAula
) {
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
                    // Mostra no console as aulas com mesmo professor para conferência manual
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

function ordenacaoMergeSort(populacao) {
    if (populacao.length <= 1) {
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

function selecao(populacaoOrdenada, selecaoElitizada) {
    let limite = 0;
    if (selecaoElitizada) {
        limite = populacaoOrdenada.length / 2;
    } else {
        limite = populacaoOrdenada.length;
    }

    const numeroAleatorio1 = Math.floor(Math.random() * limite);
    const numeroAleatorio2 = Math.floor(
        Math.random() * populacaoOrdenada.length
    );

    const individuosSelecionados = [
        populacaoOrdenada[numeroAleatorio1],
        populacaoOrdenada[numeroAleatorio2],
    ];

    return individuosSelecionados;
}

function cruzamento(
    individuosSelecionados,
    intervaloSemestre,
    periodos,
    pontosDeCorte = 0,
    pc
) {
    const random = Math.random();
    if (random < pc) {
        if (!pontosDeCorte) {
            pontosDeCorte = Math.ceil(Math.random() * (periodos - 1));
        }

        const indicesPontosDeCorte = [];
        while (indicesPontosDeCorte.length < pontosDeCorte) {
            const numero = Math.floor(Math.random() * (periodos - 1));
            if (!indicesPontosDeCorte.includes(numero)) {
                indicesPontosDeCorte.push(numero);
            }
        }
        indicesPontosDeCorte.sort((a, b) => a - b);
        // console.log(indicesPontosDeCorte);

        const semestresPai1 = [],
            semestresPai2 = [];
        const vetorPais = [semestresPai1, semestresPai2];
        vetorPais.forEach((pai, index) => {
            for (let i = 0, j = 1; i < periodos; i++, j++) {
                pai.push(
                    individuosSelecionados[index].slice(
                        i * intervaloSemestre,
                        j * intervaloSemestre
                    )
                );
            }
        });

        // console.log(vetorPais);

        let trocaGenes = false;
        let cortes = [-1, ...indicesPontosDeCorte, periodos - 1]; // garante intervalos completos

        for (let l = 0; l < cortes.length - 1; l++) {
            const inicio = cortes[l] + 1;
            const fim = cortes[l + 1];

            for (let k = inicio; k <= fim; k++) {
                // console.log(cortes[l], k);
                if (trocaGenes) {
                    // console.log("Trocando genes");
                    const semestreAux = vetorPais[0][k];
                    vetorPais[0][k] = vetorPais[1][k];
                    vetorPais[1][k] = semestreAux;
                }
            }

            trocaGenes = !trocaGenes; // alterna apenas ao final de cada intervalo
        }
        // console.log(
        //     "---------------------------------------------------------"
        // );
        // console.log(vetorPais);

        vetorPais[0] = vetorPais[0].flat();
        vetorPais[1] = vetorPais[1].flat();

        return vetorPais;
    } else {
        return individuosSelecionados;
    }
}

// Mutação: aleatorizar (1/2 ou 1/4) dos horários de (1, 2, 3) período(s)

function mutacao(individuosSelecionados, intervaloSemestre, periodos, pm) {
    for (let i = 0; i < individuosSelecionados.length; i++) {
        let random = Math.random();
        if (random < pm) {
            let alteracoes = 0;
            do {
                const semestreAleatorio = Math.floor(Math.random() * periodos);
                const aulaAleatoria1 = Math.floor(
                    Math.random() * intervaloSemestre
                );
                const aulaAleatoria2 = Math.floor(
                    Math.random() * intervaloSemestre
                );
                // console.log(semestreAleatorio * intervaloSemestre + aulaAleatoria1);
                // console.log(semestreAleatorio * intervaloSemestre + aulaAleatoria2);
                // console.log("trocando: ", individuosSelecionados[i][
                //     semestreAleatorio * intervaloSemestre + aulaAleatoria1
                // ], individuosSelecionados[i][
                //         semestreAleatorio * intervaloSemestre + aulaAleatoria2
                //     ]);

                // Realiza a troca das aulas do mesmo semestre
                const aulaAux =
                    individuosSelecionados[i][
                        semestreAleatorio * intervaloSemestre + aulaAleatoria1
                    ];
                individuosSelecionados[i][
                    semestreAleatorio * intervaloSemestre + aulaAleatoria1
                ] =
                    individuosSelecionados[i][
                        semestreAleatorio * intervaloSemestre + aulaAleatoria2
                    ];
                individuosSelecionados[i][
                    semestreAleatorio * intervaloSemestre + aulaAleatoria2
                ] = aulaAux;
                alteracoes++;
                random = Math.random();
            } while (random < 0.75 && alteracoes < intervaloSemestre / 2);
            // console.log("Alterações: ", alteracoes);
        }
    }
    return individuosSelecionados;
}

// const professores = 10;
// const disciplinas = 25;
// const horariosDia = 4;
// const diasSemana = 5;
// const periodos = 5;
// const intervaloSemestre = horariosDia * diasSemana;
// const quantidadeIndividuos = 10;
// const maxGeracoes = 100;
// const pontosDeCorte = 3;
// const pc = 0.98;
// const pm = 0.05;

// const parametrosProblema = {
//     professores,
//     disciplinas,
//     horariosDia,
//     diasSemana,
//     periodos,
//     intervaloSemestre,
//     quantidadeIndividuos,
//     maxGeracoes,
//     pontosDeCorte,
//     pc,
//     pm
// };
// algoritmoGenetico(parametrosProblema);
