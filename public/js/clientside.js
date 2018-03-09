//Client Side JavaScript for building table


var headerRow = document.createElement("tr");

for(var i = 0; i < 6; i++){

	var newHeader = document.createElement("th");
	
	switch(i){

		case 0:
			newHeader.textContent = "NAME";
			break;
		case 1:
			newHeader.textContent = "REPS";
			break;
		case 2:
			newHeader.textContent = "WEIGHT";
			break;
		case 3:
			newHeader.textContent = "DATE";
			break;
		case 4:
			newHeader.textContent = "UNITS";
			break;
		case 5:
			newHeader.textContent = "ACTION";
			break;
		default:
			newHeader.textContent = "";
	}

	headerRow.appendChild(newHeader);

}

document.getElementById("main-table").appendChild(headerRow);
