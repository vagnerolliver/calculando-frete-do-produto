$(function(){
  $("#btn-calcular-frete").click(function(e){
    e.preventDefault();
    calculaFreteProduto();
  });

  $("#cep1").bind("keyup", function(event) {
    if (event.keyCode == '13') {
      $("#cep2").focus();
      $("#cep2").select();
      return false;
    } else if ($(this).val().length == 5) {
      $("#cep2").focus();
      $("#cep2").select();
    }
  });

  $("#cep1").bind("click", function(event) {
      $(this).select();
  });

  $("#cep2").bind("click", function(event) {
      $(this).select();
  });

  $("#cep1").bind("keypress", function(event) {
      if (event.keyCode == "13") {
          return false;
      }
  });

  $("#cep2").bind("keypress", function(event) {
      if (event.keyCode == "13") {
          calculaFreteProduto();
          return false;
      }
  });
})

function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function(n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

function calculaFreteProduto() {
	var cep = $("div.frete #cep1").val() + $("div.frete #cep2").val();
	var cepvalidate = /^[0-9]{8}/;
    if (!cepvalidate.test(cep)) {
        alert('Cep inválido. Informe um cep válido no formato 99999-999!');
        return false;
    } else {
    	$("#btn-calcular-frete").html("Calculando..")
	    $.ajax({
	        url: "/frete_produto",
	        cache: false,
	        type: "POST",
	        dataType: "json",
	        data: {
                   product_id: $("#product_id").zip: cep,quantity: $('#qty input').val()
	        },
	        success: function(json) {
                //console.log(json.error);
                if(json.error == "Invalid zip or product_id"){
                    alert("Cep nao cadastrado no correios")
                } else {
                    var methods = $.parseJSON(json.methods);
                    var address = $.parseJSON(json.address_details);

                    $('.lista-frete').html("")

                    var data = "<h4>Prazo de entrega aproximado para: "+ address.cidade + "/"+ address.estado +"</h4>";
                    data += '<ul>';

                    $.each($(methods), function(index, method){
                        data += '<li>'+method.name+' <span class="valor">R$ '+number_format(method.price, 2, ',', '.')+'</span> <span class="prazo">Entrega em até '+method.deadline+' dias úteis</span></li>';
                    });

    			   data += '</ul>';
    	           $('.lista-frete').html(data);
                }

	           $("#btn-calcular-frete").html("Calcular")

	        }
	    });
	}
}
