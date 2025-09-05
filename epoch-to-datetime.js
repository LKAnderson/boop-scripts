/**
{
  "api": 1,
  "name": "Epoch to DateTime",
  "description": "Convert epoch timestamp to human-readable date and time",
  "author": "Kent Anderson",
  "icon": "clock",
  "tags": "date,time,epoch,timestamp"
}
**/

function main(state) {
  if (state.fullText.trim() == "") {
    state.fullText = new Date().getTime().toString();
    return;
  }

  var epoch = parseInt(state.fullText.trim());
  if (isNaN(epoch)) {
    state.fullText = "Invalid epoch timestamp";
    return;
  }

  var date = new Date(epoch);
  state.fullText = `UTC: ${date.toUTCString()}\nLOCAL: ${date.toString()}`; // Output in ISO format
}
