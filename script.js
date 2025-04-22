        function encryptText() {
            let input = document.getElementById("inputText").value;
            let encrypted = [];
            for (let char of input) {
                encrypted.push(char.charCodeAt(0));
            }
            let binaryResult = encrypted.map(num => num.toString(2).padStart(16, '0'));
            drawTape(binaryResult);
        }

        function drawTape(binaryArray) {
            let canvas = document.getElementById("tapeCanvas");
            let ctx = canvas.getContext("2d");
            let holeSize = 4, spacing = 10, margin = 15;
            canvas.width = binaryArray.length * (spacing * 16 + margin);
            canvas.height = 50;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 20, canvas.width, 10);
            binaryArray.forEach((binary, index) => {
                [...binary].forEach((bit, bitIndex) => {
                    if (bit === "1") {
                        ctx.fillStyle = "white";
                        ctx.beginPath();
                        ctx.arc(index * (spacing * 16 + margin) + bitIndex * spacing, 25, holeSize, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.strokeStyle = "black";
                        ctx.stroke();
                    }
                });
            });
        }

        function downloadTape() {
            let canvas = document.getElementById("tapeCanvas");
            let link = document.createElement("a");
            link.download = "tasma.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        }

        function readImage(input) {
            let file = input.files[0];
            if (!file) return;
            let img = new Image();
            let reader = new FileReader();
            reader.onload = function(event) {
                img.src = event.target.result;
                img.onload = function() {
                    decodeFromImage(img);
                };
            };
            reader.readAsDataURL(file);
        }

function decodeFromImage(img) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    let binaryArray = [];
    for (let x = 0; x < canvas.width; x += (10 * 16 + 15)) {
        let binaryNum = "";
        for (let bitX = 0; bitX < 16; bitX++) {
            let imageData = ctx.getImageData(x + bitX * 10, 25, 1, 1);
            let [r, g, b] = imageData.data;
            let brightness = (r + g + b) / 3;
            binaryNum += brightness > 127 ? "1" : "0"; // niższy próg = większa czułość
        }
        binaryArray.push(binaryNum);
    }
    let numbers = binaryArray.map(bin => parseInt(bin, 2));
    let decrypted = numbers.map(num => {
        try {
            return String.fromCharCode(num);
        } catch {
            return "?";
        }
    }).join("");
    document.getElementById("output").textContent = decrypted;
}


        function decryptFromImage() {
            let input = document.getElementById("imageInput");
            if (input.files.length === 0) {
                alert("Wybierz obraz taśmy perforowanej!");
                return;
            }
            readImage(input);
        }

        let dropZone = document.getElementById("dropZone");
        dropZone.addEventListener("dragover", function(e) {
            e.preventDefault();
            dropZone.style.borderColor = "green";
        });
        dropZone.addEventListener("dragleave", function(e) {
            dropZone.style.borderColor = "#aaa";
        });
        dropZone.addEventListener("drop", function(e) {
            e.preventDefault();
            dropZone.style.borderColor = "#aaa";
            if (e.dataTransfer.files.length > 0) {
                let file = e.dataTransfer.files[0];
                if (file.type === "image/png") {
                    let input = { files: [file] };
                    readImage(input);
                }
            }
        });
