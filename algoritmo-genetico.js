function algoritmoGenetico(parametrosProblema) {
    const {
        professores,
        disciplinas,
        horariosDia,
        diasSemana,
        periodos,
        indicadorNumeroAula,
        quantidadeIndividuos,
        maxGeracoes,
        selecaoElitizada,
        pontosDeCorte,
        pc,
        pm
    } = parametrosProblema;
    const intervaloSemestre = diasSemana * horariosDia;
    let populacao = popInicial(
        professores,
        disciplinas,
        horariosDia,
        intervaloSemestre,
        quantidadeIndividuos,
        indicadorNumeroAula
    );
    let melhorSolucao = { avaliacao: Infinity, geracao: 0, populacao: [] };
    let geracoes = 0;

    while (geracoes < maxGeracoes) {
        const populacaoAvaliada = avaliacao(
            populacao,
            intervaloSemestre,
            periodos,
            indicadorNumeroAula
        );
        const populacaoOrdenada = ordenacaoMergeSort(populacaoAvaliada);

        if (populacaoOrdenada[0].avaliacao === 0) {
            populacaoOrdenada[0].geracao = geracoes;
            return populacaoOrdenada[0];
        }
        if (populacaoOrdenada[0].avaliacao < melhorSolucao.avaliacao) {
            melhorSolucao = { ...populacaoOrdenada[0], geracao: geracoes };
        }

        const novaGeracao = [];
        while (novaGeracao.length < quantidadeIndividuos) {
            const pais = selecao(populacaoOrdenada.map(x => x.populacao), selecaoElitizada);
            let filhos = cruzamento(
                pais,
                intervaloSemestre,
                periodos,
                pontosDeCorte,
                pc
            );
            filhos = mutacao(
                filhos,
                intervaloSemestre,
                periodos,
                pm
            );
            novaGeracao.push(...filhos.slice(0, quantidadeIndividuos - novaGeracao.length));
        }
        populacao = novaGeracao;
        geracoes++;
    }

    const ultimaPopulacaoAvaliada = avaliacao(
        populacao,
        intervaloSemestre,
        periodos,
        indicadorNumeroAula
    );
    const ultimaOrdenada = ordenacaoMergeSort(ultimaPopulacaoAvaliada);

    if (ultimaOrdenada[0].avaliacao < melhorSolucao.avaliacao) {
        melhorSolucao = { ...ultimaOrdenada[0], geracao: geracoes };
    }
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
    return gerarPopulacaoAleatorizada(
        individuo,
        quantidadeIndividuos
    );
}

function gerarCodigosDisciplinas(
    professores,
    disciplinas,
    horariosDia,
    indicadorNumeroAula
) {
    let codProf = 0, codDis = 0, listCodigos = [];
    while (codDis < disciplinas) {
        for (let i = 0; i < professores && codDis < disciplinas; i++, codProf++) {
            for (let j = 0; j < horariosDia; j++) {
                let aula = indicadorNumeroAula
                    ? `${j}${codProf.toString().padStart(2, "0")}${codDis.toString().padStart(2, "0")}`
                    : `${codProf.toString().padStart(2, "0")}${codDis.toString().padStart(2, "0")}`;
                listCodigos.push(aula);
            }
            codDis++;
        }
        codProf = 0;
    }
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
    return Array.from({ length: quantidadeIndividuos }, () =>
        gerarIndividuoAleatorizado(individuo)
    );
}

function gerarIndividuoAleatorizado(individuo) {
    return individuo.flatMap(gerarSemestreAleatorizado);
}

function gerarSemestreAleatorizado(semestre) {
    const arr = semestre.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function avaliacao(
    populacaoAleatorizada,
    intervaloSemestre,
    periodos,
    indicadorNumeroAula
) {
    if (!Array.isArray(populacaoAleatorizada[0])) {
        return populacaoAleatorizada.map(pop => ({
            ...pop,
            avaliacao: avaliaIndividuo(
                pop.populacao,
                intervaloSemestre,
                periodos,
                indicadorNumeroAula
            )
        }));
    }
    return populacaoAleatorizada.map(pop => ({
        populacao: pop,
        avaliacao: avaliaIndividuo(
            pop,
            intervaloSemestre,
            periodos,
            indicadorNumeroAula
        )
    }));
}

function avaliaIndividuo(
    individuo,
    intervaloSemestre,
    periodos,
    indicadorNumeroAula
) {
    let avaliacao = 0;
    for (let i = 0; i < intervaloSemestre; i++) {
        for (let j = 0; j < (periodos - 1) * intervaloSemestre; j += intervaloSemestre) {
            const aula1 = individuo[i + j];
            const professor1 = indicadorNumeroAula ? aula1.slice(1, 3) : aula1.slice(0, 2);
            for (let k = j + intervaloSemestre; k < periodos * intervaloSemestre; k += intervaloSemestre) {
                const aula2 = individuo[i + k];
                const professor2 = indicadorNumeroAula ? aula2.slice(1, 3) : aula2.slice(0, 2);
                if (professor1 === professor2) avaliacao++;
            }
        }
    }
    return avaliacao;
}

function ordenacaoMergeSort(populacao) {
    if (populacao.length <= 1) return populacao;
    const meio = Math.floor(populacao.length / 2);
    const esq = ordenacaoMergeSort(populacao.slice(0, meio));
    const dir = ordenacaoMergeSort(populacao.slice(meio));
    const resultado = [];
    let i = 0, j = 0;
    while (i < esq.length && j < dir.length) {
        if (esq[i].avaliacao <= dir[j].avaliacao) resultado.push(esq[i++]);
        else resultado.push(dir[j++]);
    }
    return resultado.concat(esq.slice(i)).concat(dir.slice(j));
}

function selecao(populacaoOrdenada, selecaoElitizada) {
    const n = populacaoOrdenada.length;
    let limite = n;
    if (selecaoElitizada) {
        limite = Math.ceil(n / 2);
    } else {
    }
    const idx1 = Math.floor(Math.random() * limite);
    let idx2;
    do {
        idx2 = Math.floor(Math.random() * limite);
    } while (idx2 === idx1);
    return [populacaoOrdenada[idx1], populacaoOrdenada[idx2]];
}

function cruzamento(
    individuosSelecionados,
    intervaloSemestre,
    periodos,
    pontosDeCorte = 0,
    pc
) {
    if (Math.random() >= pc) return individuosSelecionados;
    if (!pontosDeCorte) pontosDeCorte = Math.ceil(Math.random() * (periodos - 1));
    const indices = [];
    while (indices.length < pontosDeCorte) {
        const idx = Math.floor(Math.random() * (periodos - 1));
        if (!indices.includes(idx)) indices.push(idx);
    }
    indices.sort((a, b) => a - b);
    const cortes = [-1, ...indices, periodos - 1];
    const pais = individuosSelecionados.map(pai =>
        Array.from({ length: periodos }, (_, i) =>
            pai.slice(i * intervaloSemestre, (i + 1) * intervaloSemestre)
        )
    );
    let troca = false;
    for (let l = 0; l < cortes.length - 1; l++) {
        const ini = cortes[l] + 1, fim = cortes[l + 1];
        if (troca) {
            for (let k = ini; k <= fim; k++) {
                [pais[0][k], pais[1][k]] = [pais[1][k], pais[0][k]];
            }
        }
        troca = !troca;
    }
    return [pais[0].flat(), pais[1].flat()];
}

function mutacao(individuosSelecionados, intervaloSemestre, periodos, pm) {
    return individuosSelecionados.map(ind => {
        if (Math.random() >= pm) return ind;
        let alteracoes = 0;
        const novo = ind.slice();
        do {
            const semestre = Math.floor(Math.random() * periodos);
            const a1 = Math.floor(Math.random() * intervaloSemestre);
            let a2;
            do {
                a2 = Math.floor(Math.random() * intervaloSemestre);
            } while (a1 === a2);
            const idx1 = semestre * intervaloSemestre + a1;
            const idx2 = semestre * intervaloSemestre + a2;
            [novo[idx1], novo[idx2]] = [novo[idx2], novo[idx1]];
            alteracoes++;
        } while (Math.random() < 0.75 && alteracoes < intervaloSemestre / 2);
        return novo;
    });
}
