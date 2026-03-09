(function() {
  function getVal(row, keys) {
    for (var i = 0; i < keys.length; i++) {
      if (row[keys[i]] !== undefined) {
        var v = row[keys[i]];
        return (Array.isArray(v) ? v[0] : v) || '';
      }
    }
    return '';
  }

  function render(rows) {
    document.body.style.cssText = 'margin:0;padding:0;overflow:auto;background:#0d1b2a;font-family:Arial,sans-serif;';

    if (!rows || rows.length === 0) {
      document.body.innerHTML = '<div style="padding:20px;color:#aaa;font-size:13px;">Nenhuma transferencia pendente.</div>';
      return;
    }

    var html = '<style>table{width:100%;border-collapse:collapse;font-size:11px;}thead tr{background:#1B3A5C;color:#fff;}thead th{padding:8px 10px;text-align:left;white-space:nowrap;}tbody tr{border-bottom:1px solid #1e2d3d;}tbody tr:hover{background:#1a2a3a;}tbody td{padding:7px 10px;color:#cdd9e5;vertical-align:middle;}.btn{padding:5px 12px;border:none;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;text-decoration:none;display:inline-block;}.btn-a{background:#1a7a4a;color:#fff;margin-right:4px;}.btn-a:hover{background:#21a060;}.btn-r{background:#922b21;color:#fff;}.btn-r:hover{background:#b83329;}</style>';
    html += '<table><thead><tr><th>#</th><th>Conta</th><th>CNPJ</th><th>Cliente</th><th>Acao</th></tr></thead><tbody>';

    rows.forEach(function(row, i) {
      var id   = getVal(row, ['id_interno','idInterno','ID_INTERNO']).toString();
      var cc   = getVal(row, ['codigoConta','CODIGO_CONTA']).toString();
      var cnpj = getVal(row, ['cnpj','cnpj_formatado','CNPJ']).toString();
      var cli  = getVal(row, ['nomeCliente','NOME_CLIENTE','segmentoTOTVS']).toString();
      var urlA = getVal(row, ['urlAprovar','url_aprovar','btn_aprovar']).toString();
      var urlR = getVal(row, ['urlReprovar','url_reprovar','btn_reprovar']).toString();

      html += '<tr>';
      html += '<td style="color:#5a7a9a;">'+(i+1)+'</td>';
      html += '<td><b style="color:#7eb3e0;">'+cc+'</b></td>';
      html += '<td style="color:#8899aa;">'+cnpj+'</td>';
      html += '<td>'+cli+'</td>';
      html += '<td><a class="btn btn-a" href="'+urlA+'" target="_blank">✅ Aprovar</a><a class="btn btn-r" href="'+urlR+'" target="_blank">❌ Reprovar</a></td>';
      html += '</tr>';
    });

    html += '</tbody></table>';
    document.body.innerHTML = html;
  }

  function init() {
    if (typeof dscc !== 'undefined') {
      dscc.subscribeToData(function(data) {
        var rows = [];
        try { rows = data.tables.DEFAULT; } catch(e) {}
        render(rows);
      }, { transform: dscc.tableTransform });
    } else {
      setTimeout(init, 500);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
