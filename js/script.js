var layOutTimeline = (function() {

  "use strict";

  function sortByProp(array, prop, desc) {
    return array.slice().sort(function(a, b) {
      return desc ? (a[prop] + b[prop]) : (a[prop] - b[prop]);
    });
  }

  function generateArray(start, stop) {
    var result = [];
    var temp;
    var ii;

    if (stop < start) {
      temp = stop;
      stop = start;
      start = temp;
    }

    for (ii = start; ii <= stop + 1; ii++) {
      result.push(ii);
    }

    return result;
  }

  function generateTimeSpan(events) {
    var min = events.map(function(event) {
      return event.start.year();
    }).reduce(function(a, b) {
      return a < b ? a : b;
    });

    var max = events.map(function(event) {
      return event.end ? event.end.year() : event.start.year();
    }).reduce(function(a, b) {
      return a > b ? a : b;
    });

    return generateArray(min, max);
  }

  function renderTimeSpanHTML(timeSpan, scale) {
    return timeSpan.map(function(year, index) {
      var style = [
        'left: ' + ((365 * index) * scale) + 'px;',
        'width: ' + (365 * scale) + 'px;',
        'background-color: ' + (index % 2 ? '#080933' : 'none')
      ].join('');

      return [
        '<div class="year" style="' + style + '">',
        '<span>' + year + ' (' + (year - timeSpan[0]) + ')' + '</span>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderTimeSpan(timeSpan, scale) {
    var html = renderTimeSpanHTML(timeSpan, scale);
    document.getElementById('timespan').innerHTML = html;
    document.getElementById('timeline').style.width = (timeSpan.length * 365 * scale) + 1000 + 'px';
  }

  function renderEventsHTML(events, origin, scale) {
    return events.map(function(event, index) {
      var zeroDay = moment(new Date(origin,0,1));
      var offset = moment(event.start).diff(zeroDay, 'days');
      
      var spanStyle = [
        'float: left;',
        'width:' + ((event.end.toString() != event.start.toString() ? event.end.diff(event.start, 'days')  * scale : 0)) + 'px;',
      ].join('');
      
      var elementStyle = [
        'margin-left: ' + ((offset) * scale) + 'px;'
      ].join('');

      return [
        '<div class="event" style="' + elementStyle + '">',
        '    <span class="timebar" style="' + spanStyle + '"></span>',
        '    <p>' + event.name + '</p>',
        '</div>'
      ].join('')
    }).join('');
  }

  function renderEvents(events, origin, scale) {
    var html = renderEventsHTML(events, origin, scale);
    document.getElementById('events').innerHTML = html;
  }

  function createDataArray(events) {
    return events.map(function(event) {
      if (event.end === '') event.end = new Date();

      return {
        name: event.name,
        start: moment(event.start),
        end: moment(event.end || event.start)
      }
    });
  }

  function formatEventDataFromFacebook(events) {
    return events.map(function(event) {
      return {
        name: event.name + ' (' + (event.location ? event.location : 'Unknown') + ')',
        start: event.start_time,
        end: event.end_time
      };
    });
  }

  return function(facebookEvents, scale) {
    var events = formatEventDataFromFacebook(facebookEvents);
    var scale = scale || 0.3;
    var data = createDataArray(events);
    var sortedData = sortByProp(data, 'start');
    var timeSpan = generateTimeSpan(sortedData);
    renderTimeSpan(timeSpan, scale);
    renderEvents(sortedData, timeSpan[0], scale);
  };
}());
