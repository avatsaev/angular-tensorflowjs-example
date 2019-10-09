import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import {DetectedObject} from '@tensorflow-models/coco-ssd';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  model: cocoSsd.ObjectDetection;
  @ViewChild('videoRef', {static: true}) videoRef: ElementRef<HTMLVideoElement>;
  @ViewChild('svgRef', {static: true}) svgRef: ElementRef<SVGElement>;

  currentDetections: DetectedObject[];

  videoBoundingRect;
  svgEnabled = true;

  constructor(private cdRef: ChangeDetectorRef) {

  }

  async ngOnInit() {
    this.model = await cocoSsd.load({base: 'lite_mobilenet_v2'});
    await this.detectFrame();
    await this.videoRef.nativeElement.play();
  }

  async onVideoCanPlay() {
    this.videoBoundingRect = this.videoRef.nativeElement.getBoundingClientRect();
  }

  async detectFrame() {

    if (this.model) {
        this.currentDetections = await this.model.detect(this.videoRef.nativeElement);
        this.cdRef.markForCheck();
        requestAnimationFrame(async () => {
          await this.detectFrame();
        });
    }
  }

  toggleSvgOverlay() {
    this.svgEnabled = !this.svgEnabled;
  }

}
