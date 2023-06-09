//Navigare de la o pagina la alta si stilizare pas activ
const steps = document.querySelectorAll(".pas");
const circleSteps = document.querySelectorAll(".step");
let pasActual=1;
let currentCircle=0;

steps.forEach((pas) => {
    const pasUrmator = pas.querySelector(".pas-urmator");
    const pasAnterior = pas.querySelector(".pas-anterior");
    if (pasAnterior) {
        pasAnterior.addEventListener("click", () => {
            document.querySelector(`.step-${pasActual}`).style.display="none";
            pasActual--;
            document.querySelector(`.step-${pasActual}`).style.display = "flex";
            circleSteps[currentCircle].classList.remove("active");
            currentCircle--;
        });
    }
    if (pasUrmator) {
        pasUrmator.addEventListener("click", () => {
            document.querySelector(`.step-${pasActual}`).style.display = "none";
            if (pasActual <5) {
                pasActual++;
                currentCircle++;
            }
            document.querySelector(`.step-${pasActual}`).style.display = "flex";
            circleSteps[currentCircle].classList.add("active");
        });
    }    
});

//Pregatesc variabilele pentru inserare rezultate in ultima pagina
const insertDataPensionareP2 = document.querySelector('.p2-data-pensionare');
const insertDataPensionareP3 = document.querySelector('.p3-data-pensionare');
const insertScenariuPesimistP2 = document.getElementById('pesimist-p2');
const insertScenariuMediuP2 = document.getElementById('mediu-p2');
const insertScenariuOptimistP2 = document.getElementById('optimist-p2');
const insertScenariuPesimistP3 = document.getElementById('pesimist-p3');
const insertScenariuMediuP3 = document.getElementById('mediu-p3');
const insertScenariuOptimistP3 = document.getElementById('optimist-p3');
const insertRezumat = document.getElementById('rezumat');

//Functie pentru adaugare luni la data nasterii pentru determinare varsta pensionare.
function addMonths(date, months) {
    date.setMonth(date.getMonth() + months);    
    return date;
  }

//Perioada ramasa pana la pensionare (luni). Vor fi folosite pentru determinare lungime array-uri cu cate contributii mai poate plati atat P2, cat si P3
let differenceP2;
let differenceP3;

function differenceInMonths(date1, date2) {
const monthDiff = date1.getMonth() - date2.getMonth();
const yearDiff = date1.getYear() - date2.getYear();
return monthDiff + yearDiff * 12;  
}

//Determinare gen masculin/feminin pentru stabilire varsta de pensionare
function gen() {
    let genMF=document.getElementById('masculin').checked;
    if (genMF) {
        genMF="M";
    }
    else {
        genMF="F";
    }
    return genMF;
}

//Declar variabilele cu diversele intervale de pensionare pentru femei
let data1 = new Date("1967/01/01");
let data2 = new Date("1966/02/01");
let data3 = new Date("1965/03/01");
let data4 = new Date("1964/10/01");
let data5 = new Date("1964/05/01");
let data6 = new Date("1963/12/01");
let data7 = new Date("1963/07/01");
let data8 = new Date("1963/02/01");
let data9 = new Date("1962/09/01");
let data10 = new Date("1962/04/01");
let data11 = new Date("1961/11/01");
let data12 = new Date("1961/06/01");
const womenAge = [data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11, data12];

let dataPensionareP2;
let dataPensionareP3;

//functia care ruleaza dupa primul pas, declansata de click pe pasul urmator. Determinare varsta pensionare si perioada ramasa pana la pensionare
function pasul1() {
    const prenume = document.getElementById('prenume').value;
    const dataNasterii = document.getElementById('data-nasterii').value;
    const dobP2 = new Date(dataNasterii); 
    const dobP3 = new Date(dataNasterii);   

//la P3 varsta de pensionare este 60 ani, indiferent de gen         
    dataPensionareP3 = addMonths(dobP3, 720);

//la P2 varsta de pensionare este de 65 ani pentru barbati si dupa un calendar esalonat pentru femei    
    if (gen()==="M") {
        dataPensionareP2 = addMonths(dobP2, 780);
    }
    else if (dobP2>=womenAge[0]) {
        dataPensionareP2 = addMonths(dobP2, 756);
        }
        else if (dobP2<womenAge[11]) {dataPensionareP2 = addMonths(dobP2, 745);
        } else {
            for (let i=1; i<=11; i++) {
                if(dobP2<womenAge[i-1] && dobP2>=womenAge[i]) {
                    dataPensionareP2 = addMonths(dobP2, (756-i));
                }
        }
    }

//determinare perioada ramasa pana la pensionare de utilizat in pasii urmatori si inserare data pensionare in ultima pagina        
    differenceP3 = differenceInMonths(new Date(dataPensionareP3), new Date());
    differenceP2 = differenceInMonths(new Date(dataPensionareP2), new Date());
    insertDataPensionareP2.innerText = dataPensionareP2.toLocaleDateString("ro-RO");
    insertDataPensionareP3.innerText = dataPensionareP3.toLocaleDateString("ro-RO");
    insertRezumat.innerText = (`${prenume} în urma informațiilor furnizate regăsești mai jos data când te poți pensiona și valoarea contului tău de pensie:`);
    return dataPensionareP2, dataPensionareP3, differenceP2, differenceP3;
}

//declarare array-uri pentru contributiile lunare pe P2 si P3 si variabile pentru probabilitate, media randamente lunare si volatilitate acestora 
const contributiiP2 = [];
const contributiiP3 = [];
let mean;
let stDev;
let probability;

//Generarea inversei distributiei normale (codul este copiat in lipsa unei functii in JS)
function inverseNormalCDF(p) {
    const a1 = -3.969683028665376e+01;
    const a2 =  2.209460984245205e+02;
    const a3 = -2.759285104469687e+02;
    const a4 =  1.383577518672690e+02;
    const a5 = -3.066479806614716e+01;
    const a6 =  2.506628277459239e+00;
  
    const b1 = -5.447609879822406e+01;
    const b2 =  1.615858368580409e+02;
    const b3 = -1.556989798598866e+02;
    const b4 =  6.680131188771972e+01;
    const b5 = -1.328068155288572e+01;
  
    const c1 = -7.784894002430293e-03;
    const c2 = -3.223964580411365e-01;
    const c3 = -2.400758277161838e+00;
    const c4 = -2.549732539343734e+00;
    const c5 =  4.374664141464968e+00;
    const c6 =  2.938163982698783e+00;
  
    const d1 =  7.784695709041462e-03;
    const d2 =  3.224671290700398e-01;
    const d3 =  2.445134137142996e+00;
    const d4 =  3.754408661907416e+00;
  
    const q = p - 0.5;
    let r, x;
  
    if (Math.abs(q) < 0.42) {
      const g = q * q;
      r = q * (((a6 * g + a5) * g + a4) * g + a3) / ((((b5 * g + b4) * g + b3) * g + b2) * g + b1);
      x = r;
    } else {
      if (q < 0) {
        r = p;
      } else {
        r = 1 - p;
      }
      r = Math.log(-Math.log(r));
      x = (((c6 * r + c5) * r + c4) * r + c3) / ((d4 * r + d3) * r + d2);
      if (q < 0) {
        x = -x;
      }
    }
  
    return x;
  }

function norminv(probability, mean, stDev) {
    if (probability <= 0 || probability >= 1) {
      throw new Error('Probability must be between 0 and 1 (exclusive)');
    }
  
    const z = inverseNormalCDF(probability);
    const x = mean + stDev * z;
  
    return x;
  }

class Fond {
    constructor(fundName, fundMean, fundStDev){
        this.fundName = fundName;
        this.fundMean = fundMean;
        this.fundStDev = fundStDev;
    }
}

//functia care ruleaza dupa al doilea pas, declansata de click pe pasul urmator. Populare array contributii P2 in functie de salariul brut si cresterea salariala
function pasul2() {
    const salariu = document.getElementById('salariu').value;
    const crestereSalariala = document.getElementById('crestere-salariala').value;
//creare array contributii P2 si indexare salariala la fiecare an (12luni) 
    contributiiP2[0]=salariu*0.0375;
    for (let i = 1; i<differenceP2-1; i++) {
        if (i%12 != 0 ) {
            contributiiP2[i]=contributiiP2[i-1];
        }
        else {
            contributiiP2[i]=contributiiP2[i-1] * (1+crestereSalariala/100);
        }
        contributiiP2.push(contributiiP2[i]);
    }
    return contributiiP2;
}

//functia care ruleaza dupa al treilea pas, declansata de click pe pasul urmator. Stabilire valoare cont P2 la final dupa 10.000 de simulari (Monte Carlo)
function pasul3() {
    const soldP2=document.getElementById('pilon2-cont').value;
    const fondP2=document.getElementById('fonduri-p2').value;
    contributiiP2[0]= contributiiP2[0] + parseInt(soldP2);
//stabilire randament si volatilitate in functie de fondul ales    
    let aripi = new Fond ('Aripi',0.00615014833925152, 0.0148675129711954);
    let azt = new Fond ('AZT', 0.00561695027266273, 0.0137565262524001);
    let bcr = new Fond ('BCR', 0.00603385919710083, 0.0144081363530737);
    let brd = new Fond ('BRD', 0.00512647339866225, 0.0127945299929529);
    let metropolitan = new Fond ('Metropolitan', 0.00628127836485134, 0.0127861772792893);
    let nn = new Fond ('NN', 0.00621812405008594, 0.0138240584340827);
    let vital = new Fond('Vital', 0.00574548756067463, 0.0124298436110774);
    let fonduriP2 = [aripi, azt, bcr, brd, metropolitan, nn, vital];
    let selectedFundP2 = fonduriP2.find(fund => fund.fundName == fondP2);

//generarea unui singur scenariu privind rezultatul investirii contributiilor lunare cu un randament mediu si volatilitate date si conform unei probabilitati distribuite normal    
    let mc = [];
    let scenariu = [];
    function rulareScenariiP2(){
        scenariu[0]=contributiiP2[0]*(1+norminv(math.random(),selectedFundP2.fundMean,selectedFundP2.fundStDev));
        for (k=1; k < differenceP2; k++) {
            scenariu[k] = (scenariu[k-1]+contributiiP2[k])*(1+norminv(math.random(),selectedFundP2.fundMean,selectedFundP2.fundStDev));
        }  
        return scenariu[scenariu.length-1];
    }
console.log(scenariu);
//generarea a 10.000 de simulari si inserare in pagina de rezultate percentila 10(scenariu pesimist), percentila 50 (scenariu mediu) si percentile 90 (scenariu optimist)
    for (j=0; j<10000; j++) {    
        mc.push(rulareScenariiP2());
    }
    mc.sort((a,b)=>a-b);
    insertScenariuPesimistP2.innerText = math.round(mc[999]);
    insertScenariuMediuP2.innerText = math.round(mc[4999]);
    insertScenariuOptimistP2.innerText = math.round(mc[8999]);
}

//functia care ruleaza dupa al patrulea pas, declansata de click pe pasul urmator. Creare array-uri si stabilire valoare cont P3 la final dupa 10.000 de simulari (Monte Carlo)
function pasul4() {
    const contributieFacultativa = document.getElementById('contributie-p3').value;
    const soldP3 = document.getElementById('pilon3-cont').value;
    const fondP3=document.getElementById('fonduri-p3').value;
//creare array contributii P3    
    contributiiP3[0]= parseInt(soldP3) + parseInt(contributieFacultativa);
    for (let i=1; i<differenceP3-1; i++) {
        contributiiP3[i]=parseInt(contributieFacultativa);
        contributiiP3.push(contributiiP3[i]);
    }
//stabilire randament si volatilitate in functie de fondul ales    
    let aegon = new Fond ('Aegon',0.00285007101114853, 0.0168006909467267);
    let aztmoderato = new Fond ('AZTModerato', 0.00475641612342395, 0.0150780836108091);
    let aztvivace = new Fond ('AZTVivace', 0.00494048695349917, 0.0192685247797806);
    let bcrplus = new Fond ('BCRPlus', 0.00432884751188297, 0.0126454886651071);
    let brdmedio = new Fond ('BRDMedio', 0.00354452120469458, 0.0129360312570334);
    let pensiamea = new Fond ('PensiaMea', 0.0040881335144684, 0.0112296032942495);
    let nnactiv = new Fond ('NNActiv', 0.00531434884504096, 0.0177798267374991);
    let nnoptim = new Fond ('NNOptim', 0.00509028930455701, 0.0152767289267626);
    let raiffeisen = new Fond('Raiffeisen', 0.00564557664504505, 0.0149838443374733);
    let stabil = new Fond('Stabil', 0.00451309915120776, 0.0144961494417246);
    let fonduriP3 = [aegon, aztmoderato, aztvivace, bcrplus, brdmedio, pensiamea, nnactiv, nnoptim, raiffeisen, stabil];
    let selectedFundP3 = fonduriP3.find(fund => fund.fundName == fondP3);

//generarea unui singur scenariu privind rezultatul investirii contributiilor lunare cu un randament mediu si volatilitate date si conform unei probabilitati distribuite normal    
    let mc = [];
    let scenariu = [];
    function rulareScenariiP3(){
        scenariu[0]=contributiiP3[0]*(1+norminv(math.random(),selectedFundP3.fundMean,selectedFundP3.fundStDev));
        for (k=1; k < differenceP3; k++) {
            scenariu[k] = (scenariu[k-1]+contributiiP3[k])*(1+norminv(math.random(),selectedFundP3.fundMean,selectedFundP3.fundStDev));
        }  
        return scenariu[scenariu.length-1];
    }

//generarea a 10.000 de simulari si inserare in pagina de rezultate percentila 10(scenariu pesimist), percentila 50 (scenariu mediu) si percentile 90 (scenariu optimist)
    for (j=0; j<10000; j++) {    
        mc.push(rulareScenariiP3());
    }
    mc.sort((a,b)=>a-b);
    insertScenariuPesimistP3.innerText = math.round(mc[999]);
    insertScenariuMediuP3.innerText = math.round(mc[4999]);
    insertScenariuOptimistP3.innerText = math.round(mc[8999]);
}