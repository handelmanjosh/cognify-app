const partnerLogoList = ["red", "blue", "green", "yellow", "orange", "gray", "red"]; //should be filled with images, but isn't for testing

export class PartnerController {
    vx: number;
    PartnerList: Partner[];
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        let r: number = 40;
        if (window.innerWidth < 768) {
            r = 20;
        }
        this.vx = 1;
        this.canvas = canvas;
        this.context = context;
        this.PartnerList = [];
        let delta = canvas.width * 2 / partnerLogoList.length;
        let x = 0;
        const y = canvas.height / 2;
        for (const partnerLogo of partnerLogoList) {
            const partner = new Partner(x, y, r, partnerLogo, context);
            this.PartnerList.push(partner);
            x += delta;
        }
    }
    moveAll = () => {
        this.PartnerList.forEach(partner => {
            const diff = (partner.x + 2 * partner.r) - this.canvas.width;
            if (diff > 0) {
                partner.adjustedDraw(-1 * partner.r + diff, partner.y);
            }
            partner.x = (partner.x + this.vx) % this.canvas.width;
        });
    };
    draw = () => {
        this.clearCanvas();
        this.moveAll();
        this.PartnerList.forEach(partner => {
            partner.draw();
        });
    };
    clearCanvas = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
}
class Partner {
    x: number;
    y: number;
    r: number;
    color: string;
    context: CanvasRenderingContext2D;
    constructor(x: number, y: number, r: number, color: string, context: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.context = context;
    }
    draw = () => {
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.arc(this.x + this.r, this.y, this.r, 0, 2 * Math.PI);
        this.context.fill();
    };
    adjustedDraw = (x: number, y: number) => {
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.arc(x, y, this.r, 0, 2 * Math.PI);
        this.context.fill();
    };
}