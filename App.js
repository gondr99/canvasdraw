class App {
    constructor(){
        this.mouse = {x: 0, y: 0};
        this.last_mouse = {x: 0, y: 0};
        this.ppts = []; //마우스가 지나온 포인트들

        this.canvas = document.querySelector("#myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.draw = false;

        //컨테이너 크기에 맞춰서 캔버스를 확장시키고
        let container = document.querySelector('.container');
        let container_style = getComputedStyle(container);
        this.canvas.width = parseInt(container_style.getPropertyValue('width'));
        this.canvas.height = parseInt(container_style.getPropertyValue('height'));

        this.tempCanvas = document.createElement('canvas'); //임시로 캔버스를 만들고
        this.tmp_ctx = this.tempCanvas.getContext('2d');
        this.tempCanvas.id = 'tmp_canvas';
        this.tempCanvas.width = this.canvas.width;
        this.tempCanvas.height = this.canvas.height;
        //실제 캔버스와 동일한 크기로 만들어준다(보여지지는 않음.)
        
        container.appendChild(this.tempCanvas);

        this.tempCanvas.addEventListener('mousedown', (e) => {            
            this.draw = true;
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
            
            this.ppts.push({x: this.mouse.x, y: this.mouse.y});
            
            this.onPaint(e);
        }, false);
        
        this.tempCanvas.addEventListener('mouseup', (e) =>{     
            this.draw = false;    
            // 실제 캔버스로 임시 캔버스에 그려진 내용을 복사함.
            this.ctx.drawImage(this.tempCanvas, 0, 0);
            // 임시 캔버스를 삭제하여 전부 투명으로 만들어줌.
            this.tmp_ctx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
            
            // 그동안 그려진 포인트 전부 삭제
            this.ppts = [];
        }, false);

        this.tempCanvas.addEventListener('mousemove', (e) => {
            if(!this.draw) return;
            this.onPaint(e);
        });
    }

    onPaint(e){
        console.log("마우스 무브");
        this.ppts.push({x: e.offsetX, y: e.offsetY});

        //그려진 마우스 무브 포인트의 길이가 3보다 작을경우
        if (this.ppts.length < 3) {
            let b = this.ppts[0];
            this.tmp_ctx.beginPath();
            
            this.tmp_ctx.arc(b.x, b.y, this.tmp_ctx.lineWidth / 2, 0, Math.PI * 2);
            this.tmp_ctx.fill();
            this.tmp_ctx.closePath();
            return;
        }

        //그 이상일 경우
        this.tmp_ctx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
                
        this.tmp_ctx.beginPath();
        this.tmp_ctx.moveTo(this.ppts[0].x, this.ppts[0].y);
        
        let i;
        for (i = 1; i < this.ppts.length - 2; i++) {
            //다음 점과 이번 점사이의 간격을 잡고 이번점을 커브포인트로 잡아서 다음점 절반까지 곡선을 그림
            let c = (this.ppts[i].x + this.ppts[i + 1].x) / 2;
            let d = (this.ppts[i].y + this.ppts[i + 1].y) / 2;
            
            this.tmp_ctx.quadraticCurveTo(this.ppts[i].x, this.ppts[i].y, c, d);
        }
                
        // 마지막 남은 2개의 점은 따로 그려준다.
        this.tmp_ctx.quadraticCurveTo(
            this.ppts[i].x,
            this.ppts[i].y,
            this.ppts[i + 1].x,
            this.ppts[i + 1].y
        );
        this.tmp_ctx.stroke();
    }
}