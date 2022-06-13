function fillCoin(data) {

    let coin1 = document.getElementById("moeda1");
    let coin2 = document.getElementById("moeda2");
  
    for (let index in data.value) {
  
      const { simbolo, nomeFormatado, tipoMoeda } = data.value[index];
      let option = document.createElement("option");
      option.value = `${simbolo}-${tipoMoeda}`;
      option.id = tipoMoeda;
      option.innerHTML = nomeFormatado;
  
      coin1.appendChild(option.cloneNode(true));
      coin2.appendChild(option.cloneNode(true));
    }
  }
  
  function loadCoin() {
    fetch("https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$skip=0&$format=json&$select=simbolo,nomeFormatado,tipoMoeda")
      .then(response => response.json())
      .then(data => fillCoin(data))
      .catch(error => console.error(error))
  }
  
  async function getQuotationValue(coin, date) {
    const response = await fetch("https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='" + coin + "'&@dataCotacao='" + date + "'&$top=100&$format=json&$select=paridadeCompra")
      .then(response => response.json())
      .then(data => {
        return data.value[0].paridadeCompra;
      })
      .catch(error => console.error(error))
    return response
  }
  
  async function convertCoin() {
    const baseCoin = document.getElementById('moeda1').value.split("-");
    const targetCoin = document.getElementById('moeda2').value.split("-");
    const date = new Date(document.getElementById('data').value).toLocaleDateString("en-US").replaceAll("/", "-");
    let baseValue = parseInt($("#valor1").val())
    let baseActualValue = await Promise.resolve(getQuotationValue(baseCoin[0], date));
    let targetCoinValue = await Promise.resolve(getQuotationValue(targetCoin[0], date));
  
    if (baseCoin[1] == 'A' && targetCoin[1] == 'A') {
      document.getElementById("valor2").value = (targetCoinValue / baseActualValue) * baseValue;
    }
    if (baseCoin[1] == 'A' && targetCoin[1] == 'B') {
      document.getElementById("valor2").value = ((1 / targetCoinValue) / baseActualValue) * baseValue;
    }
    if (baseCoin[1] == 'B' && targetCoin[1] == 'A') {
      document.getElementById("valor2").value = (targetCoinValue / (1 / baseActualValue)) * baseValue;
    }
    if (baseCoin[1] == 'B' && targetCoin[1] == 'B') {
      document.getElementById("valor2").value = (baseActualValue / targetCoinValue) * baseValue;
    }
  }
  
  $(document).ready(function () {
    loadCoin()
  
  
  
  
  });
  
  form.addEventListener('submit', function (e) {
    convertCoin()
    e.preventDefault();
  });