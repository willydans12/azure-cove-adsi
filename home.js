$(function() {
    // Date Range Picker
    $('#daterange').daterangepicker({
      opens: 'center',
      locale: { format: 'MMM D, YYYY' },
      startDate: moment(),
      endDate: moment().add(1, 'days')
    });
  
    // counters
    let rooms = 1;
    let adults = 2;
  
    function updateSummary() {
      $('#roomsSummary').text(`${rooms} room${rooms>1?'s':''}, ${adults} adult${adults>1?'s':''}`);
      $('#room-count').text(rooms);
      $('#adult-count').text(adults);
    }
  
    $('#room-increase').click(() => { rooms++; updateSummary(); });
    $('#room-decrease').click(() => { if(rooms>1) rooms--; updateSummary(); });
    $('#adult-increase').click(() => { adults++; updateSummary(); });
    $('#adult-decrease').click(() => { if(adults>1) adults--; updateSummary(); });
  });
  