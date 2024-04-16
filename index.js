// Map initialization 
var map = L.map('map').setView([24, 121], 8);

L.Control.geocoder().addTo(map);

//osm layer
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
osm.addTo(map);

var marker, popup;
var latt = [];
var lngg = [];
var urll = [];
var cnt = 0;
var redraw = function(pay) {
    if(pay.message.lat){
        cnt++;
        latt[cnt] = pay.message.lat;
        lngg[cnt] = pay.message.lng;
        urll[cnt] = pay.message.url;
        console.log(cnt);
        //console.log(lat + "," + lng)

        if(marker) map.removeLayer(marker)
        var currentdate = new Date(); 
        var datetime = currentdate.getFullYear() + "/"
            + (currentdate.getMonth()+1)  + "/" 
            + currentdate.getDate() + " "  
            + currentdate.getHours() + ":"  
            + currentdate.getMinutes();

        var position = "北緯" + latt[cnt] + ", 東經" + lngg[cnt];
        marker = L.marker([latt[cnt], lngg[cnt]])
        popup = marker.bindPopup(`<p>${position}</p>` + `<p>${datetime}</p>` + `<p><img src="${urll[cnt]}" alt="車禍圖片" width="100" height="100"></p>`)
        var featureGroup = L.featureGroup([marker, popup]).addTo(map);

        let tbody = document.querySelector('table > tbody');
        let tr = document.createElement('tr');
        tr.innerHTML = `<td>${cnt}</td>
                        <td>${position}</td>
                        <td>${datetime}</td>
                        <td><a href="${urll[cnt]}">Link</a></td>`;
        tbody.appendChild(tr);
        //map.fitBounds(featureGroup.getBounds())
    }
};

//pn
var pnChannel = "raspi-tracker";
var pubnub = new PubNub({
    publishKey:   'pub-c-54cc73fe-ad96-4dad-8032-f8fe4b184336',
    subscribeKey: 'sub-c-305cae0d-0ae8-4bd5-af55-6caf4d309670',
    uuid: '909092e7-0586-4d21-82ad-f73d88a77cbc'
});
pubnub.subscribe({channels: [pnChannel]});
pubnub.addListener({message:redraw});