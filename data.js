$(document).ready(function() {
	
$('#marketDetailsTable').dataTable( {
  "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
	"pageLength": 1000,
	"stateSave": true
}); 
	
});

$(function () {
	$('#marketDetailsTable').floatThead({
	position: 'fixed'
});

    $('#market-table').on('click', '.best-order-btn', function () {
        //console.log($(this).closest('tr').first('td').text());
        $('#order-title').text($(this).parents('tr').find('td').first().text());
        $('#top-orders-modal #marketQueue').html("Loading...");
        $('#top-orders-modal #myChart').html("Loading...");

        $('#top-orders-modal').modal('show');

        var symbolCode = $(this).data('symbolcode');
        var marketId = $(this).data('market');
        $.ajax({
            type: "POST",
            url: JSEOT.Market.Index.TopOrderURL,
            data: {
                stockCode: symbolCode,
                marketId: marketId
            },
            success: function (data) {
                $('#top-orders-modal #marketQueue').html(data);
            }
        });

        $.ajax({
            type: "GET",
            url: JSEOT.Market.Index.SymbolPoints,
            data: {
                symbolCode: symbolCode,
                marketId: marketId
            },
            success: function (data) {
                $('#top-orders-modal #stockPoints').html(data);
            }
        });

        $.ajax({
            type: "GET",
            url: JSEOT.Market.Index.SymbolHistory,
            data: {
                symbolCode: symbolCode,
                marketId: marketId
            },
            success: function (data) {
                // split the data set into ohlc and volume
                var ohlc = [],
                    volume = [],
                    dataLength = data.length,
                    i = 0;
                var symbol = '';

                for (i; i < dataLength; i += 1) {
                    ohlc.push([
                        Date.parse(data[i].Date), // the date
                        parseFloat(data[i].Price), // open
                        parseFloat(data[i].Price), // high
                        parseFloat(data[i].Price), // low
                        parseFloat(data[i].Price) // close
                    ]);

                    symbol = data[i].Symbol;

                    volume.push([
                        Date.parse(data[i].Date), // the date
                        data[i].Volume // the volume
                    ]);
                }

                Highcharts.stockChart('myChart', {
                    rangeSelector: {
                        enabled: true,
                        selected: 1,
                        inputEnabled: false,
                    },
                    navigator: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    tooltip: {
                        enabled: true,
                        shared: true,
                        split: false
                    },
                    exporting: false,
                    yAxis: [
                        {
                            labels: {
                                align: 'left',
                                x: -3
                            },
                            title: {
                                text: 'Price'
                            },
                            height: '60%',
                            lineWidth: 2
                        },
                        {
                            labels: {
                                align: 'left',
                                x: -3
                            },
                            title: {
                                text: 'Volume'
                            },
                            credits: {
                                enabled: false
                            },
                            top: '65%',
                            height: '35%',
                            offset: 0,
                            lineWidth: 2
                        }
                    ],
					
                    series: [{
                        type: 'line',
                        id: 'aapl-ohlc',
                        name: 'Price',
                        data: ohlc,
                        marker: {
                            enabled: true,
                            radius: 3
                        },
                        tooltip: {
                            valueDecimals: 2
                        }
                    }, {
                        type: 'column',
                        id: 'aapl-volume',
                        name: 'Volume',
                        data: volume,
                        yAxis: 1,
                        tooltip: {
                            valueDecimals: 0
                        }
                    }],
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 800
                            },
                            chartOptions: {
                                rangeSelector: {
                                    inputEnabled: false
                                }
                            }
                        }]
                    }
                });
            }
        });
    });

    $("#SelectedMarketId").change(function () {
        $.ajax({
            type: "POST",
            url: JSEOT.Market.Index.SelectMarketURL,
            data: { id: $("#SelectedMarketId").val() },
            success: function (data) {
                $('#market-table').html(data);
                	$('#marketDetailsTable').floatThead({
					position: 'fixed'
					});
                //attachScrollEvent();
            },
            beforeSend: AddLoader,
            complete: RemoveLoader
        });
    });

    function AddLoader() {
        JSEOT.DataManager.addLocalSpinner($("#SelectedMarketId"));
    }

    function RemoveLoader() {
        JSEOT.DataManager.removeLocalSpinner($("#SelectedMarketId"));
    }
});

$('.symbolCode').on("click", function () {
    var code = $(this).data("symbolcode");


});