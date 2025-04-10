const professores = 10;
const disciplinas = 25;
const horariosDia = 4;
const diasSemana = 5;
const periodos = 5;
const quantidadeIndividuos = 10;

function popInicial(){
    const listaCodigosDisciplinas = gerarCodigosDisciplinas(professores, disciplinas, horariosDia);
    const individuo = gerarIndividuo(listaCodigosDisciplinas, horariosDia*diasSemana);
    const populacaoAleatorizada = gerarPopulacaoAleatorizada(individuo, quantidadeIndividuos);

    console.log(populacaoAleatorizada);
}

function gerarCodigosDisciplinas(professores, disciplinas, horariosDia){
    let codProf = "00";
    let codDis = "00";
    let listCodigos = [];
    do {
        codProf = "00";
        for(let i=0;i<professores;i++){
            if(parseInt(codDis)==disciplinas){
                break;
            }
            for (let j = 0; j < horariosDia; j++) {   
                listCodigos.push(j+codProf+codDis);
            }
            let numeroProf = parseInt(codProf, 10) +1;
            let numeroDis = parseInt(codDis, 10) +1;
            codProf = numeroProf.toString().padStart(2, "0");
            codDis = numeroDis.toString().padStart(2, "0");
        }
    } while (parseInt(codDis)<disciplinas);
    return listCodigos;
}

function gerarIndividuo(listaCodigos, horariosSemana){
    const codigosSemestre = [];
    for(let i=0;i<listaCodigos.length;i+=horariosSemana){
        codigosSemestre.push(listaCodigos.slice(i, i+horariosSemana));
    }
    return codigosSemestre;
}

function gerarPopulacaoAleatorizada(individuo, quantidadeIndividuos){
    const matrizPopulacao = [];
    for(let i=0;i<quantidadeIndividuos;i++){
        matrizPopulacao.push(gerarIndividuoAleatorizado(individuo));
    }
    return matrizPopulacao;
}

function gerarIndividuoAleatorizado(individuo){
    const individuoAleatorizado = [];
    for(let i=0;i<individuo.length;i++){
        let semestreAleatorizado = gerarSemestreAleatorizado(individuo[i]);
        individuoAleatorizado.push(...semestreAleatorizado);
    }
    return individuoAleatorizado;
}

function gerarSemestreAleatorizado(semestre){
    const semestreAleatorizado = [];
    let indiceAleatorio = 0;
    const semestreAux = [...semestre];
    while(semestreAux.length>0){
        indiceAleatorio = Math.floor(Math.random()*semestreAux.length);
        semestreAleatorizado.push(semestreAux[indiceAleatorio]);
        semestreAux.splice(indiceAleatorio, 1);
    }
    return semestreAleatorizado;
}