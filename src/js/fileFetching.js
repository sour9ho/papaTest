export async function fetchCsv(filePath){
    return await fetch(filePath)
       .then(response => response.text())
       .then(text => csv2Json(text))
       .catch(err => console.log(err))
}

function preprocessCell(cellText){
    let cell = cellText;
    if(cellText !== undefined){
        const len = cellText.length;
        if((cellText[0] === "\"") & (cellText[len - 1] === "\"")){
            cell = cellText.substring(1, len-1);
        }
    }
    return cell;
}

function csv2Json(csvText){
    const lines = csvText.split("\r\n");
    const jsonText = [];

    const headers = lines[0].split(",");
    
    for(let i=1; i<lines.length; i++){
        const obj = {};
        const currentLine = lines[i].split(",");
        for(let j=0; j<headers.length; j++){
            obj[headers[j]] = preprocessCell(currentLine[j]);
        }
        jsonText.push(obj);
    }

    const json = JSON.stringify(jsonText);
    return JSON.parse(json);
}

